import type { AWS } from '@serverless/typescript';
import { DynamoDBTables } from './resources/dynamodb-tables';

const serverlessConfiguration: AWS = {
  service: 'shop-cloudx-backend-db',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    region: 'us-east-2',
    stage: 'dev',
    environment: {
      PRODUCTS_TABLE: '${self:custom.productsTable}',
      STOCKS_TABLE: '${self:custom.stocksTable}',
    },
  },
  custom: {
    productsTable:
      '${self:service}-products-table-${opt:stage, self:provider.stage}',
    stocksTable:
      '${self:service}-stocks-table-${opt:stage, self:provider.stage}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      },
    },
  },
  resources: {
    Resources: {
      ...DynamoDBTables,
    },
    Outputs: {
      ProductsTableResource: {
        Value: { 'Fn::GetAtt': ['ProductsTable', 'Arn'] },
      },
      StocksTableResource: {
        Value: { 'Fn::GetAtt': ['StocksTable', 'Arn'] },
      },
      ProductsTableName: {
        Value: '${self:provider.environment.PRODUCTS_TABLE}',
      },
      StocksTableName: {
        Value: '${self:provider.environment.STOCKS_TABLE}',
      },
    },
  },
};

module.exports = serverlessConfiguration;
