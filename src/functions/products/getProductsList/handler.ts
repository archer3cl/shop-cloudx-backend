import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { products } from 'src/mocks/data';

const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    data: products,
  });
};

export const main = middyfy(getProductsList);
