provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
    # these describe an external dependency
    # however, cannot store backend config in environment vars
    # IF YOU ARE NOT ME, CHANGE THIS TO A BUCKET YOU CAN ACCESS
    bucket = "grosgrain"

    key    = "terraform-state/aws-api-sandbox/tf"
    region = "us-west-2"
  }
}
