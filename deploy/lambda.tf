resource "aws_lambda_function" "process_stripe_events" {
  filename         = "lambda.zip" # Arquivo ZIP gerado
  function_name    = "process-stripe-events"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  timeout          = 30
  memory_size      = 128

  environment {
    variables = {
      CNPJ               = var.cnpj
      SERVICO_DESCRICAO  = var.servico_descricao
      ENOTAS_API_KEY     = var.enotas_api_key
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_to_lambda" {
  event_source_arn = aws_sqs_queue.stripe_events_queue.arn
  function_name    = aws_lambda_function.process_stripe_events.arn
}