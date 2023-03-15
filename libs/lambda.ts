import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import inputOutputLogger from '@middy/input-output-logger';
import { bodySchemaValidator } from '@libs/middy-utils';
import { Schema } from 'yup';

export const middyfy = (handler) => {
  return middy(handler).use(inputOutputLogger());
};

export const middyfyHttp = (handler) => {
  return middyfy(handler).use(httpHeaderNormalizer()).use(httpErrorHandler());
};

export const middyfyCors = (handler) => {
  return middyfyHttp(handler).use(cors());
};

export const middifyHttpRequest = (handler) => {
  return middyfyCors(handler).use(httpEventNormalizer());
};

export const middyfyBodyRequest = (handler) => {
  return middifyHttpRequest(handler).use(httpJsonBodyParser());
};

export const middyfyBodyValidator = (handler, schema: Schema) => {
  return middyfyBodyRequest(handler).use(bodySchemaValidator(schema));
};
