# there is a Lambda function
resource "aws_lambda_function" "sandbox" {
  function_name = "api-sandbox-${terraform.workspace}"

  s3_bucket = "${var.lambda_deploy_bucket}"
  s3_key    = "aws-api-sandbox/${terraform.workspace}/sandbox-${var.build_id}.zip"

  # this is seconds, default is only 3
  timeout = "60"

  # publish versions when the code changes
  publish = true

  # the file `main.js` will export a method `handler`
  handler = "main.handler"
  runtime = "nodejs10.16.3"

  # this lambda assumes this role
  role = "${aws_iam_role.sandbox.arn}"

  tags = {
    Environment = "${terraform.workspace}"
    CostCenter  = "sandbox"
  }
}

# there is an empty role to assign to the lambda
resource "aws_iam_role" "sandbox" {
  name = "sandbox-${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = {
    Environment = "${terraform.workspace}"
    CostCenter  = "sandbox"
  }
}

# there is a policy attached to our role that allow log creation
resource "aws_iam_role_policy" "sandbox" {
  name = "lambda_exec_policy-${terraform.workspace}"
  role = "${aws_iam_role.sandbox.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ]
    }
  ]
}
EOF
}

# there is an API Gateway
resource "aws_api_gateway_rest_api" "sandbox" {
  name        = "API Sandbox - ${terraform.workspace}"
  description = "Experiments with infrastructure as code."
}

# requests will be routed to our lambda
resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.sandbox.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.sandbox.invoke_arn}"
}

# the gateway is deployed once available
resource "aws_api_gateway_deployment" "sandbox" {
  depends_on = [
    "aws_api_gateway_integration.lambda",
    "aws_api_gateway_integration.lambda_root",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.sandbox.id}"
  stage_name  = "sandbox-${terraform.workspace}"
}

# the gateway has permission to invoke our lambda
resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.sandbox.arn}"
  principal     = "apigateway.amazonaws.com"

  # access is granted from any method on any resource within the API Gateway
  source_arn = "${aws_api_gateway_deployment.sandbox.execution_arn}/*/*"
}

# the gateway will accept all paths
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.sandbox.id}"
  parent_id   = "${aws_api_gateway_rest_api.sandbox.root_resource_id}"
  path_part   = "{proxy+}" # this accepts any route
}

# the gateway will accept all HTTP methods
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.sandbox.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

# the gateway will match on an empty path (workaround for proxy+)
resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.sandbox.id}"
  resource_id   = "${aws_api_gateway_rest_api.sandbox.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
}

# the gateway will match on an empty path (workaround for proxy+)
resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.sandbox.id}"
  resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.sandbox.invoke_arn}"
}

# there shall be logs
resource "aws_api_gateway_method_settings" "sandbox" {
  rest_api_id = "${aws_api_gateway_rest_api.sandbox.id}"
  stage_name  = "${aws_api_gateway_deployment.sandbox.stage_name}"
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }

  depends_on = ["aws_api_gateway_account.sandbox"]
}

resource "aws_api_gateway_account" "sandbox" {
  cloudwatch_role_arn = "${aws_iam_role.cloudwatch.arn}"
}

resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_global-${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "cloudwatch-${terraform.workspace}"
  role = "${aws_iam_role.cloudwatch.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

# the public url will be printed
output "base-url" {
  value = "${aws_api_gateway_deployment.sandbox.invoke_url}"
}
