import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import { products } from 'src/mocks/data';
import { Product } from 'src/models/Product';

const getProductsById = async (event: APIGatewayEvent) => {
  const productId = event.pathParameters?.productId;

  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return apiResponses._200(product);
    }
  }

  return apiResponses._400({ message: 'Product not found' });
};

const apiResponses = {
  _200: (data: Product) => {
    return formatJSONResponse({
      data,
    });
  },
  _400: (body: { [key: string]: any }) => ({
    statusCode: 400,
    body: JSON.stringify(body),
  }),
};

export const main = middyfy(getProductsById);
