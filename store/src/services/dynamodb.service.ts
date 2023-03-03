import * as AWS from 'aws-sdk';
export type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;
export type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
export type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;
export type ScanItem = AWS.DynamoDB.DocumentClient.ScanInput;
export type ScanItemOutput = AWS.DynamoDB.DocumentClient.ScanOutput;
export type BatchGetItem = AWS.DynamoDB.DocumentClient.BatchGetItemInput;
export type BatchGetItemOutput = AWS.DynamoDB.DocumentClient.BatchGetItemOutput;
export type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
export type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;
export type TransactWriteItems =
  AWS.DynamoDB.DocumentClient.TransactWriteItemsInput;
export type TransactWriteItemsOutput =
  AWS.DynamoDB.DocumentClient.TransactWriteItemsOutput;

const documentClient = new AWS.DynamoDB.DocumentClient();

export const dynamodbService = {
  getItem: async ({ key, value, tableName }): Promise<GetItemOutput> => {
    try {
      const params = {
        TableName: tableName,
        Key: {
          [key]: value,
        },
      };
      return await documentClient.get(params).promise();
    } catch (error) {
      throw Error(
        `There was an error fetching the data for ${key} of ${value} from ${tableName}`
      );
    }
  },
  query: async (params: QueryItem): Promise<QueryItemOutput> => {
    try {
      return await documentClient.query(params).promise();
    } catch (error) {
      throw Error(`query-error: ${error}`);
    }
  },
  scan: async (params: ScanItem): Promise<ScanItemOutput> => {
    try {
      return await documentClient.scan(params).promise();
    } catch (error) {
      throw Error(`scan-error: ${error}`);
    }
  },
  batchGetItem: async (params: BatchGetItem): Promise<BatchGetItemOutput> => {
    try {
      return await documentClient.batchGet(params).promise();
    } catch (error) {
      throw Error(`batch-read-error: ${error}`);
    }
  },
  create: async (params: PutItem): Promise<PutItemOutput> => {
    try {
      return await documentClient.put(params).promise();
    } catch (error) {
      throw Error(`create-error: ${error}`);
    }
  },
  transactCreate: async (
    params: TransactWriteItems
  ): Promise<TransactWriteItemsOutput> => {
    try {
      return await documentClient.transactWrite(params).promise();
    } catch (error) {
      throw Error(`transact-create-error: ${error}`);
    }
  },
};
