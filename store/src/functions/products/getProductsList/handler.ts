import { Responses } from '@libs/api-responses';
import { databaseTables } from '@libs/db-utils';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { dynamodbService } from '@services/dynamodb.service';

const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  const { productsTable, stocksTable } = databaseTables();
  try {
    const results = await dynamodbService.scan({ TableName: productsTable });
    const products = results?.Items?.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    }));

    const params = {
      RequestItems: {
        [stocksTable]: {
          Keys: products.map((product) => ({ product_id: product.id })),
        },
      },
    };

    const stocksResults = await dynamodbService.batchGetItem(params);
    const stocks = stocksResults?.Responses[stocksTable];

    const mergedProducts = products.map((product) => ({
      ...product,
      count: stocks.find((s) => s.product_id === product.id)?.count || 0,
    }));

    return Responses._200({ data: mergedProducts });
  } catch (error) {
    return Responses._400({ message: 'Failed to retreive list of products' });
  }
};

export const main = middyfy(getProductsList);
