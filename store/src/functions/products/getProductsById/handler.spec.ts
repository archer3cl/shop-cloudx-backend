import { APIGatewayProxyEvent } from 'aws-lambda';
import { products } from 'src/mocks/data';
import { mockedContext } from '../__mocks__/context';
import { main } from './handler';
jest.mock('@middy/core', () => require('../../../../__mocks__/middy'));

describe('getProductsById handler', function () {
  it('verifies successful response', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      },
    } as any;
    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ data: products[0] }));
  });

  it("return an error when product it's missing", async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '00000',
      },
    } as any;
    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: 'Product not found' })
    );
  });
});
