# aws-api-sandbox

AWS API Gateway and Lambda with Terraform

### Requirements

* An AWS account
* The AWS command line client
* Your AWS credentials set up so you can access your resources
* The Terraform client
* A command line JSON parser called `jq` (used in e2e/bin/exec_url)
* Node 8.10.0 (for running tests locally)

### Setup

#### Install and configure the AWS client

```
brew install awscli terraform jq
```

Configure the client using [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

#### Install AWS client

```
brew install awscli terraform
```

### Local Build and Deploy

Copy `.env.example` to `.env` and edit appropriately.

```
# set up your environment
source ./.env

# build
./bin/build

# full deploy
./bin/stage_lambda_zip "$LAMBDA_DEPLOY_BUCKET" "$CI_ENV" "$BUILD_ID"
cd infrastructure
terraform workspace select "$CI_ENV" || terraform workspace new "$CI_ENV"
terraform plan
terraform apply

# deploy new version without using Terraform
# this should only be used for feature development
./bin/deploy_lambda "api-sandbox-${CI_ENV}"

# unit tests for the Lambda
cd lambda && npm test

# end to end (SAFE) tests
cd e2e && npm test
```

### CircleCI Config

These environment variables need to be set up for your CircleCI project.

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
LAMBDA_DEPLOY_BUCKET
```
