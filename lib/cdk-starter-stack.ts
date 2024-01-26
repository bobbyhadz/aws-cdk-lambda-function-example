import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 lambda function definition
    const lambdaFunction = new lambda.Function(this, 'lambda-function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/my-lambda')),
      environment: {
        REGION: cdk.Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          cdk.Stack.of(this).availabilityZones,
        ),
      },
    });

    // 👇 create a policy statement
    const listBucketsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:ListAllMyBuckets'],
      resources: ['arn:aws:s3:::*'],
    });

    // 👇 attach the policy to the function's role
    lambdaFunction.role?.attachInlinePolicy(
      new iam.Policy(this, 'list-buckets', {
        statements: [listBucketsPolicy],
      }),
    );
  }
}
