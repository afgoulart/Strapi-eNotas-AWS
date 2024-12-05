resource "aws_sqs_queue" "stripe_events_queue" {
  name = "stripe-events-queue"
}

resource "aws_sqs_queue_policy" "sqs_policy" {
  queue_url = aws_sqs_queue.stripe_events_queue.id
  policy    = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "SQS:SendMessage",
      "Resource": "${aws_sqs_queue.stripe_events_queue.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.stripe_events_topic.arn}"
        }
      }
    }
  ]
}
POLICY
}