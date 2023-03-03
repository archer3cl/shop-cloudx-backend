import { Responses } from '@libs/api-responses';
import { middyfy } from '@libs/lambda';
import { databaseTables } from '@libs/db-utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dynamodbService } from '@services/dynamodb.service';
import { AvailableProduct } from '@models/Product';

const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { productsTable, stocksTable } = databaseTables();
  try {
    const productId = event.pathParameters?.productId;

    if (!productId) return Responses._400({ message: 'Product not found' });
    const productsResult = await dynamodbService.getItem({
      key: 'id',
      value: productId,
      tableName: productsTable,
    });

    const product = <AvailableProduct>{
      id: productsResult?.Item.id,
      title: productsResult?.Item.title,
      description: productsResult?.Item.description,
      price: productsResult?.Item.price,
    };

    const stockResult = await dynamodbService.getItem({
      key: 'product_id',
      value: product.id,
      tableName: stocksTable,
    });

    product.count = stockResult?.Item.count || 0;

    return Responses._200({ data: product });
  } catch (error) {
    return Responses._400({ message: 'Product not found' });
  }
};

export const main = middyfy(getProductsById);
