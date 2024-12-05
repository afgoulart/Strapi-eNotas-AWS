resource "aws_s3_bucket" "lambda_versions_bucket" {
  bucket = "lambda-versions-bucket"
    
  tags = {
    Name        = "lambda-versions-bucket"
    Environment = "production"
  }
}