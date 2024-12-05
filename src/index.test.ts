import { expect, test } from "@jest/globals";

import { handler } from "./";

describe("handler", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusCode: 200,
        json: () =>
          Promise.resolve({
            message: "Nota fiscal gerada com sucesso.",
          }),
        text: () => Promise.resolve("Nota fiscal gerada com sucesso."),
      })
    ) as jest.Mock;
  });

  test("should return success message", async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            Message: JSON.stringify({
              type: "invoice.payment_succeeded",
              data: {
                object: {
                  customer_name: "Cliente Teste",
                  customer_email: "customer@test.com",
                  amount_paid: 1000,
                },
              },
            }),
          }),
        },
      ],
    };

    const response = await handler(event);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://api.enotas.com.br/v2/notas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ENOTAS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cnpj: "00.000.000/0001-00",
        cliente: {
          nome: "Cliente Teste",
          email: "customer@test.com",
        },
        servico: {
          descricao: "Serviço mensal",
          valor: 10,
        },
      }),
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: "Eventos processados com sucesso.",
    });
  });
});
