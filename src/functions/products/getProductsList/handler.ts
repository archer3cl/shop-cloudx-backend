import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from 'src/mocks/data';

const getProductsList = async () => {
  return formatJSONResponse({
    data: products,
  });
};

export const main = middyfy(getProductsList);
