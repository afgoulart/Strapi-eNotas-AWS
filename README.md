# Process Stripe Events Lambda

Este projeto é uma implementação de um AWS Lambda para processar eventos do Stripe, integrando-os ao eNotas para emissão automática de notas fiscais.

## Arquitetura

1. **Stripe Webhook**: Envia eventos para um tópico SNS configurado na AWS.
2. **SNS**: Encaminha os eventos para uma fila SQS.
3. **SQS**: Dispara um Lambda sempre que uma nova mensagem é adicionada à fila.
4. **Lambda**: Processa os eventos do Stripe e realiza a requisição para a API do eNotas.

## Pré-requisitos

- Node.js instalado
- AWS CLI configurado
- Terraform instalado
- Conta no eNotas com uma API Key válida
- Arquivo `.env` contendo:
  ```env
  CNPJ=00.000.000/0001-00
  SERVICO_DESCRICAO=Serviço mensal
  ENOTAS_API_KEY=SUA_API_KEY
  ```

## Estrutura do Projeto

```
lambda/
├── index.js          # Código principal do Lambda
├── package.json      # Dependências e scripts
.env                  # Variáveis de ambiente
```

## Configuração

### 1. Instalar Dependências
Dentro da pasta `lambda`, execute:
```bash
npm install
```

### 2. Compactar o Código
Para preparar o código para deploy, gere o arquivo ZIP:
```bash
zip -r lambda.zip .
```

### 3. Configuração com Terraform
Certifique-se de que o Terraform está configurado corretamente no seu ambiente e aplique as configurações:
```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

### 4. Deploy Automático com GitHub Actions
Inclua as seguintes variáveis no repositório no GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Ao fazer um push para a branch `main`, o workflow será disparado automaticamente para realizar o deploy.

## Testes

1. Use o modo de testes do Stripe para simular eventos.
2. Monitore os logs do Lambda no AWS CloudWatch.
3. Verifique se as notas fiscais foram geradas no eNotas.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).