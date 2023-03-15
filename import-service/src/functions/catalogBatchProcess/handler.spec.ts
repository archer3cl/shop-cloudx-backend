import { mockedContext } from '../../../../__mocks__/context';
import { main } from './handler';
import 'aws-sdk-client-mock-jest';
import { AvailableProduct } from '@models/Product';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { snsTopicArns } from '@import-service/libs/sns-utils';

jest.mock('@middy/core', () => require('../../../../__mocks__/middy'));

describe('catalogBatchProcess handler', function () {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const snsMock = mockClient(SNSClient);
  const testProducts: Array<AvailableProduct> = [
    {
      title: 'Refined Steel Mouse',
      description:
        'The Refined Steel Mouse is the trademarked name of several series of Nagasaki sport bikes that started with the 1984 ABC800J',
      price: 9240,
      count: 16,
    },
  ];

  beforeEach(() => {
    ddbMock.reset();
    snsMock.reset();
  });

  it('verifies successful product creation', async () => {
    const event = {
      Records: [
        {
          messageId: 'a99e761c-9dcc-4d19-993f-b5837d032f15',
          body: JSON.stringify(testProducts[0]),
        },
      ],
    };

    const products = await main(event, mockedContext);
    expect(ddbMock).toHaveReceivedCommand(TransactWriteCommand);
    expect(products).toEqual(expect.arrayContaining([...testProducts]));
  });

  it('verifies successful sns publish', async () => {
    const { createProductTopicArn } = snsTopicArns();
    const event = {
      Records: [
        {
          messageId: 'a99e761c-9dcc-4d19-993f-b5837d032f15',
          body: JSON.stringify(testProducts[0]),
        },
      ],
    };

    await main(event, mockedContext);
    expect(snsMock).toHaveReceivedCommandWith(PublishCommand, {
      TopicArn: createProductTopicArn,
    });
  });
});
