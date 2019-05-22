# aws-api-sandbox

AWS API Gateway and Lambda with Terraform

### Requirements

* An AWS account
* The AWS command line client
* Your AWS credentials set up so you can access your resources
* The Terraform client
* A command line JSON parser called `jq` (used in `e2e/bin/exec_url`)
* Node 8.10.0 (for running tests locally)

### Setup

#### Install the AWS client, Terraform and, jq.

```
brew install awscli terraform jq
```

Configure the AWS client using [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

### Local Tests

```
# run unit tests and lint the Lambda
cd lambda && npm test
```

### CI/CD

This project is set up to be tested and deployed using CircleCI.

The configuration in `.circleci/config.yml` and the simple `bash` scripts in `bin` are the source of truth for the build and deploy process.

For troubleshooting, local testing, and modifying the build process, you can populate the environment variables in the `.env` files and run individual scripts.

#### Details

* Unit tests and linting will be run with every push to any branch
* Completed Pull Requests (really all merges into develop) will be deployed to an environment called `dev`
* You can choose to deploy a feature branch by pushing a tag that starts with "feature-" plus one or more other characters, your branch name should only contain lower chars and dashes
* Feature deployments will use the exact tag as the name for the environment

**NOTE:** Builds triggered with a tag are sort of hard to find in the CircleCI web interface. Click on "JOBS" in the upper left hand and you can see a running job. Go into the details of the job and click the text link "workflow" in the summary at the top of the job to see the entire workflow.

### Running end to end tests locally

Copy `.env.example` to `.env` and edit appropriately.

```
# set up your environment
source ./.env

# end to end (SAFE) tests (works against a deployed environment)
cd e2e && CYPRESS_BASE_URL=$(./bin/exec_url ${CI_ENV}) npm test
```

### Local Build and Deploy

If you want a faster feedback loop when changing the Lambda, you can deploy a given environment without using Terraform or running a CircleCI build. There are no automated protections in place to prevent running this against an important environment like, `production`, so use this at your own risk.

Copy `.env.example` to `.env` and edit appropriately.

```
# set up your environment
source ./.env

# build
./bin/build

# deploy new version without using Terraform
# this should only be used during feature development
./bin/deploy_lambda "api-sandbox-${CI_ENV}"
```

### Cleanup of Deployed Environments

There is no automated build job to delete the AWS resources created by the Terraform scripts in `infrastructure`.

To clean up after yourself, follow these steps.

Copy `.env.example` to `.env` and edit appropriately.

If you exactly follow these instructions, the environment named in `$CI_ENV` will be destroyed. Be sure to read the confirmation message from Terraform before you type `yes`.

```
# set up your environment
source ./.env

# destroy a given environment
cd infrastructure
terraform workspace select "$CI_ENV" || terraform workspace new "$CI_ENV"
terraform destroy
# read the confirmation message and follow the instructions
```

### CircleCI Config

These environment variables need to be set up for your CircleCI project.

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
LAMBDA_DEPLOY_BUCKET
```
