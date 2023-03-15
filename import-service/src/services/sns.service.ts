import {
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  SNSClient,
} from '@aws-sdk/client-sns';

const snsClient = new SNSClient({});
export const snsService = {
  publish: async (
    params: PublishCommandInput
  ): Promise<PublishCommandOutput> => {
    try {
      const command = new PublishCommand(params);
      return await snsClient.send(command);
    } catch (error) {
      throw Error(`publish-error: ${error}`);
    }
  },
};
