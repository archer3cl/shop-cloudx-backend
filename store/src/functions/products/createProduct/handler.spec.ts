import { mockedContext } from '../../../../../__mocks__/context';
import { main } from './handler';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import * as crypto from 'crypto';
import { databaseTables } from '@store/libs/db-utils';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));
jest.mock('@middy/core', () => require('../../../../../__mocks__/middy'));

describe('createProduct handler', function () {
  const testProduct = {
    id: '3a654a62-dbb6-488c-8953-8d469007f999',
    title: 'Apollotech B340',
    description:
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    price: 3750,
    count: 15,
  };
  const { productsTable, stocksTable } = databaseTables();

  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it('verifies successful creation', async () => {
    const { id, ...requestTestProduct } = testProduct;
    const mockRandomUUID = jest.spyOn(crypto, 'randomUUID').mockReturnValue(id);

    const event = {
      httpMethod: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestTestProduct),
    } as any;

    ddbMock
      .on(TransactWriteCommand, {
        TransactItems: [
          {
            Put: {
              TableName: productsTable,
              Item: {
                id: testProduct.id,
              },
            },
          },
          {
            Put: {
              TableName: stocksTable,
              Item: {
                product_id: testProduct.id,
              },
            },
          },
        ],
      })
      .resolves({});

    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ data: testProduct }));
    expect(mockRandomUUID).toHaveBeenCalledTimes(1);
  });
});
