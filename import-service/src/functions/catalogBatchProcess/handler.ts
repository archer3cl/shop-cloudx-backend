import { middyfy } from '@libs/lambda';
import { databaseTables } from '@libs/db-utils';
import { AvailableProduct, AvailableProductSchema } from '@models/Product';
import { dynamodbService } from '@services/dynamodb.service';
import { SQSEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import * as yup from 'yup';
import { snsService } from '@import-service/services/sns.service';
import { snsTopicArns } from '@import-service/libs/sns-utils';

const catalogBatchProcess = async (
  event: SQSEvent
): Promise<Array<AvailableProduct>> => {
  const { productsTable, stocksTable } = databaseTables();
  const { createProductTopicArn } = snsTopicArns();
  const parsedProducts = event.Records.map((r) => JSON.parse(r.body));
  const batchSchema = yup.array().of(AvailableProductSchema);
  const products = await batchSchema.validate(parsedProducts);
  const transactionItems = products.reduce((acc, product) => {
    const productId = randomUUID();
    const productPut = {
      Put: {
        TableName: productsTable,
        Item: {
          id: productId,
          title: product.title,
          description: product.description,
          price: product.price,
        },
      },
    };
    const stockPut = {
      Put: {
        TableName: stocksTable,
        Item: {
          product_id: productId,
          count: product.count,
        },
      },
    };
    acc.push(productPut, stockPut);
    return acc;
  }, []);

  await dynamodbService.transactCreate({
    TransactItems: transactionItems,
  });

  await snsService.publish({
    Message: `${products.length} created`,
    MessageAttributes: {
      ProductsCreated: {
        DataType: 'Number',
        StringValue: `${products.length}`,
      },
    },
    Subject: 'Product creation finished - CloudX Javascript',
    TopicArn: createProductTopicArn,
  });

  return products;
};

export const main = middyfy(catalogBatchProcess);
