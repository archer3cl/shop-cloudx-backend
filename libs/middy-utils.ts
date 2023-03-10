import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Responses } from './api-responses';
import { Schema } from 'yup';

export const bodySchemaValidator = (
  schema: Schema
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    try {
      const { body } = request.event;
      schema.validateSync(body);
      return Promise.resolve();
    } catch (error) {
      return Responses._400({ errors: error.errors }, 422);
    }
  };
  return { before };
};
