export const DynamoDBTables = {
  ProductsTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Delete',
    Properties: {
      TableName: '${self:provider.environment.PRODUCTS_TABLE}',
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
  StocksTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Delete',
    Properties: {
      TableName: '${self:provider.environment.STOCKS_TABLE}',
      AttributeDefinitions: [
        { AttributeName: 'product_id', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'product_id', KeyType: 'HASH' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
};
