export const handler = async (event: { Records: any }) => {
  try {
    const cnpj = process.env.CNPJ;
    const servicoDescricao = process.env.SERVICO_DESCRICAO;
    const enotasApiKey = process.env.ENOTAS_API_KEY;

    if (!cnpj || !servicoDescricao || !enotasApiKey) {
      throw new Error(
        "Variáveis de ambiente CNPJ, SERVICO_DESCRICAO ou ENOTAS_API_KEY não configuradas."
      );
    }

    for (const record of event.Records) {
      const sqsMessage = JSON.parse(record.body);
      const snsMessage = JSON.parse(sqsMessage.Message);
      const stripeEvent = snsMessage;

      if (stripeEvent.type === "invoice.payment_succeeded") {
        const invoice = stripeEvent.data.object;

        const payload = {
          cnpj: cnpj,
          cliente: {
            nome: invoice.customer_name || "Cliente Desconhecido",
            email: invoice.customer_email || "email@desconhecido.com",
          },
          servico: {
            descricao: servicoDescricao,
            valor: invoice.amount_paid / 100,
          },
        };

        const response = await fetch("https://api.enotas.com.br/v2/notas", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${enotasApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Erro ao gerar nota fiscal: ${response.statusText}`);
        }

        await response.json();
        console.log(`Nota fiscal gerada com sucesso!`);
      } else {
        console.log(`Evento ignorado: ${stripeEvent.type}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Eventos processados com sucesso." }),
    };
  } catch (error: any) {
    console.error("Erro ao processar eventos:", error);
    // throw new Error("Erro ao processar eventos da fila.");
    return {
      statusCode: 500,
      causes: error.message,
      body: JSON.stringify({ message: "Erro ao processar eventos da fila." }),
    };
  }
};
