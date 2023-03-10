import { Responses } from '@libs/api-responses';
import { middyfyCors } from '@libs/lambda';
import { databaseTables } from '@store/libs/db-utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AvailableProduct } from '@store/models/Product';
import { dynamodbService } from '@store/services/dynamodb.service';

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

    if (!productsResult.Item)
      return Responses._400({ message: 'Product not found' });

    const product = <AvailableProduct>{
      id: productsResult.Item.id,
      title: productsResult.Item.title,
      description: productsResult.Item.description,
      price: productsResult.Item.price,
    };

    const stockResult = await dynamodbService.getItem({
      key: 'product_id',
      value: product.id,
      tableName: stocksTable,
    });

    product.count = stockResult?.Item?.count || 0;

    return Responses._200({ data: product });
  } catch (error) {
    return Responses._400({ message: 'Product not found' });
  }
};

export const main = middyfyCors(getProductsById);
