import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  TransactWriteCommand,
  TransactWriteCommandInput,
  TransactWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb';

const fullClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(fullClient);

export const dynamodbService = {
  getItem: async ({ key, value, tableName }): Promise<GetCommandOutput> => {
    try {
      const params = {
        TableName: tableName,
        Key: {
          [key]: value,
        },
      };
      const command = new GetCommand(params);
      return await documentClient.send(command);
    } catch (error) {
      throw Error(
        `There was an error fetching the data for ${key} of ${value} from ${tableName}`
      );
    }
  },
  query: async (params: QueryCommandInput): Promise<QueryCommandOutput> => {
    try {
      const command = new QueryCommand(params);
      return await documentClient.send(command);
    } catch (error) {
      throw Error(`query-error: ${error}`);
    }
  },
  scan: async (params: ScanCommandInput): Promise<ScanCommandOutput> => {
    try {
      const command = new ScanCommand(params);
      return await documentClient.send(command);
    } catch (error) {
      throw Error(`scan-error: ${error}`);
    }
  },
  batchGetItem: async (
    params: BatchGetCommandInput
  ): Promise<BatchGetCommandOutput> => {
    try {
      const command = new BatchGetCommand(params);
      return await documentClient.send(command);
    } catch (error) {
      throw Error(`batch-read-error: ${error}`);
    }
  },
  create: async (params: PutCommandInput): Promise<PutCommandOutput> => {
    try {
      const command = new PutCommand(params);
      return await documentClient.send(command);
    } catch (error) {
      throw Error(`create-error: ${error}`);
    }
  },
  transactCreate: async (
    params: TransactWriteCommandInput
  ): Promise<TransactWriteCommandOutput> => {
    try {
      const command = new TransactWriteCommand(params);
      return await documentClient.send(command);
    } catch (error) {
      throw Error(`transact-create-error: ${error}`);
    }
  },
};
