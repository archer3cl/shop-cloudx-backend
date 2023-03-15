import { mockedContext } from '../../../../../__mocks__/context';
import { main } from './handler';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { databaseTables } from '@libs/db-utils';

jest.mock('@middy/core', () => require('../../../../../__mocks__/middy'));

describe('getProductsById handler', function () {
  const testProduct = {
    id: '8a551e0e-bad5-447d-bbc3-0e1392a7900d',
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

  it('verifies successful response', async () => {
    ddbMock
      .on(GetCommand, {
        TableName: productsTable,
        Key: {
          id: testProduct.id,
        },
      })
      .resolves({ Item: { ...testProduct } })
      .on(GetCommand, {
        TableName: stocksTable,
        Key: {
          product_id: testProduct.id,
        },
      })
      .resolves({
        Item: {
          product_id: testProduct.id,
          count: testProduct.count,
        },
      });
    const event = {
      httpMethod: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      pathParameters: {
        productId: testProduct.id,
      },
    } as any;
    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ data: { ...testProduct } }));
  });

  it("return an error when product it's missing", async () => {
    const event = {
      httpMethod: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      pathParameters: {
        productId: '000',
      },
    } as any;

    ddbMock.on(GetCommand).resolves({
      Item: undefined,
    });

    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: 'Product not found' })
    );
  });
});
