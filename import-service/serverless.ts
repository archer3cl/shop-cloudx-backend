import type { AWS } from '@serverless/typescript';
import type { Lift } from 'serverless-lift';
import importProductsFile from '@import-service/functions/importProductsFile';
import importFileParser from '@import-service/functions/importFileParser';
import catalogBatchProcess from '@import-service/functions/catalogBatchProcess';

const serverlessConfiguration: AWS & Lift = {
  service: 'shop-cloudx-import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-s3-cleaner', 'serverless-lift'],
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
      CATALOG_ITEMS_QUEUE_URL: '${construct:catalogItemsQueue.queueUrl}',
      SNS_CREATE_PRODUCT_TOPIC_ARN: '${self:custom.createProductTopicArn}',
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
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: [
              '${param:productsTableResource}',
              '${param:stocksTableResource}',
            ],
          },
          {
            Effect: 'Allow',
            Action: ['sns:Publish'],
            Resource: ['${self:custom.createProductTopicArn}'],
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
    createProductTopicArn: {
      'Fn::GetAtt': ['CreateProductTopic', 'TopicArn'],
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
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'Create Product Pipeline',
          TopicName: 'createProduct',
        },
      },
      CreateProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'vieyrafc@gmail.com',
          Protocol: 'email',
          TopicArn: '${self:custom.createProductTopicArn}',
        },
      },
      TooManyProductsCreatedSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'Alejandro_Vieyra@epam.com',
          Protocol: 'email',
          TopicArn: '${self:custom.createProductTopicArn}',
          FilterPolicyScope: 'MessageAttributes',
          FilterPolicy: {
            ProductsCreated: [{ numeric: ['>=', 3] }],
          },
        },
      },
    },
  },
  constructs: {
    catalogItemsQueue: {
      type: 'queue',
      batchSize: 5,
      fifo: true,
      worker: catalogBatchProcess,
    },
  },
};

module.exports = serverlessConfiguration;
