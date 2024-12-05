
resource "aws_sns_topic" "stripe_events_topic" {
  name = "stripe-events-topic"
}

resource "aws_sns_topic_subscription" "sns_to_sqs" {
  topic_arn = aws_sns_topic.stripe_events_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.stripe_events_queue.arn
}