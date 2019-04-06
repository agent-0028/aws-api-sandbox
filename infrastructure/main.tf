provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
    bucket = "grosgrain"
    key    = "terraform-state/aws-api-sandbox/tf"
    region = "us-west-2"
  }
}
