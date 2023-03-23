import type { AWS } from '@serverless/typescript';
import basicAuthorizer from '@authorization-service/functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'shop-cloudx-authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-2',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Outputs: {
      AuthorizerFunctionARN: {
        Value: { 'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'] },
      },
    },
  },
};

module.exports = serverlessConfiguration;
