import { mockedContext } from '../../../../../__mocks__/context';
import { main } from './handler';
import { mockClient } from 'aws-sdk-client-mock';
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { databaseTables } from '@libs/db-utils';

jest.mock('@middy/core', () => require('../../../../../__mocks__/middy'));

describe('getProductsList handler', function () {
  const { stocksTable } = databaseTables();
  const testProducts = [
    {
      id: 'afd20f46-4826-4b07-82f9-331660c4e22f',
      title: 'Apollotech B340',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      price: 3750,
      count: 15,
    },
  ];

  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it('verifies successful response', async () => {
    const event = {
      httpMethod: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      pathParameters: {
        productId: 'afd20f46-4826-4b07-82f9-331660c4e22f',
      },
    } as any;

    ddbMock
      .on(ScanCommand)
      .resolves({ Items: testProducts })
      .on(BatchGetCommand)
      .resolves({
        Responses: {
          [stocksTable]: testProducts.map((p) => ({
            product_id: p.id,
            count: p.count,
          })),
        },
      });

    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ data: testProducts }));
  });
});
