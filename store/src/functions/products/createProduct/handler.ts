import { Responses } from '@libs/api-responses';
import { middyfyBodyValidator } from '@libs/lambda';
import { databaseTables } from '@libs/db-utils';
import { dynamodbService } from '@services/dynamodb.service';
import { AvailableProduct, AvailableProductSchema } from '@models/Product';
import { randomUUID } from 'crypto';

const createProduct = async (event) => {
  const { productsTable, stocksTable } = databaseTables();
  try {
    const { title, description, price, count } = event.body;

    const product = <AvailableProduct>{
      id: randomUUID(),
      title,
      description,
      price,
      count,
    };

    await dynamodbService.transactCreate({
      TransactItems: [
        {
          Put: {
            TableName: productsTable,
            Item: {
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
            },
          },
        },
        {
          Put: {
            TableName: stocksTable,
            Item: {
              product_id: product.id,
              count: product.count,
            },
          },
        },
      ],
    });

    return Responses._200({ data: product });
  } catch (error) {
    return Responses._400({ message: 'Could not create product' });
  }
};

export const main = middyfyBodyValidator(createProduct, AvailableProductSchema);
