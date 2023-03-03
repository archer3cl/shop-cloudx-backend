import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import inputOutputLogger from '@middy/input-output-logger';
import { bodySchemaValidator } from './middy-utils';
import { Schema } from 'yup';

export const middyfy = (handler) => {
  return middy(handler)
    .use(httpHeaderNormalizer())
    .use(cors())
    .use(httpJsonBodyParser())
    .use(httpErrorHandler())
    .use(inputOutputLogger());
};

export const middyfyBodyValidator = (handler, schema: Schema) => {
  return middyfy(handler)
    .use(httpEventNormalizer())
    .use(bodySchemaValidator(schema));
};
