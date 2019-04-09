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

Configure the client using (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)[these instructions].

#### Install AWS client

```
brew install awscli terraform
```

### Build and Deploy

This will get codified in a CircleCI config file.

For now, these are the authoritative build instructions.

Copy `.env.example` to `.env` and edit appropriately.

```
source ./.env
./bin/build
./bin/stage_lambda_zip "$LAMBDA_DEPLOY_BUCKET" "$ENVIRONMENT" "$BUILD_ID"
cd infrastructure
terraform workspace select "$ENVIRONMENT" || terraform workspace new "$ENVIRONMENT"
terraform plan
terraform apply
```
