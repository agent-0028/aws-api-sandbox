# aws-api-sandbox

AWS API Gateway and Lambda with Terraform

### Requirements

* An AWS account
* The AWS command line client
* Your AWS credentials set up so you can access your resources
* The Terraform client
* Node 8.10.0 (for running tests locally)

### Setup

#### Install and configure the AWS client

```
brew install awscli terraform
```

Configure the client using [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

#### Install AWS client

```
brew install awscli terraform
```

### Build and Deploy

This will get codified in a CircleCI config file.

For now, these are the authoritative build instructions.

Copy `.env.example` to `.env` and edit appropriately.

```
# set up your environment
source ./.env

# build
./bin/build

# full deploy
./bin/stage_lambda_zip "$LAMBDA_DEPLOY_BUCKET" "$ENVIRONMENT" "$BUILD_ID"
cd infrastructure
terraform workspace select "$ENVIRONMENT" || terraform workspace new "$ENVIRONMENT"
terraform plan
terraform apply

# deploy new version without using Terraform
./bin/deploy_lambda "api-sandbox-${ENVIRONMENT}"

# unit tests for the Lambda
cd lambda && npm test

# end to end (SAFE) tests
cd e2e && npm test
```

### Notes

This is the equation to find the invoke URL.
Might need this for CI to use for Cypress post deployment tests.
```
output "calculated-url" {
  value = "https://${aws_api_gateway_rest_api.sandbox.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.sandbox.stage_name}/rhymes/"
}
```
