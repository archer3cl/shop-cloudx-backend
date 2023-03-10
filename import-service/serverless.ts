import type { AWS } from '@serverless/typescript';
import importProductsFile from '@import-service/functions/importProductsFile';
import importFileParser from '@import-service/functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'shop-cloudx-import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-s3-cleaner'],
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
      IMPORT_SERVICE_BUCKET: '${self:custom.importServiceBucket}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              's3:GetObject',
              's3:DeleteObject',
              's3:ListObject',
              's3:PutObject',
            ],
            Resource: [
              'arn:aws:s3:::${self:custom.importServiceBucket}',
              'arn:aws:s3:::${self:custom.importServiceBucket}/*',
            ],
          },
        ],
      },
    },
    s3: {
      importServiceBucket: {
        name: '${self:custom.importServiceBucket}',
        corsConfiguration: {
          CorsRules: [
            {
              AllowedHeaders: ['*'],
              AllowedOrigins: ['*'],
              AllowedMethods: ['GET', 'PUT', 'HEAD'],
            },
          ],
        },
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
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
    importServiceBucket: 'shop-cloudx-import-service',
    'serverless-s3-cleaner': {
      buckets: ['${self:custom.importServiceBucket}'],
    },
  },
  resources: {
    Resources: {
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:custom.importServiceBucket}',
          PolicyDocument: {
            Statement: {
              Action: ['s3:PutObject'],
              Resource: [
                'arn:aws:s3:::${self:custom.importServiceBucket}/uploaded/*',
              ],
              Effect: 'Allow',
              Principal: '*',
            },
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
