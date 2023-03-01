import { APIGatewayProxyEvent } from 'aws-lambda';
import { products } from 'src/mocks/data';
import { mockedContext } from '../__mocks__/context';
import { main } from './handler';
jest.mock('@middy/core', () => require('../../../../__mocks__/middy'));

describe('getProductsList handler', function () {
  it('verifies successful response', async () => {
    const event: APIGatewayProxyEvent = {} as any;
    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ data: products }));
  });
});
