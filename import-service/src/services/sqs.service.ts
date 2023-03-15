import {
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({});
export const sqsService = {
  sendBatch: async (
    params: SendMessageBatchCommandInput
  ): Promise<SendMessageBatchCommandOutput> => {
    try {
      const command = new SendMessageBatchCommand(params);
      return await sqsClient.send(command);
    } catch (error) {
      throw Error(`sendBatch-error: ${error}`);
    }
  },
};
