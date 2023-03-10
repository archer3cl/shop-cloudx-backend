import path from 'path';
import { Readable } from 'stream';
import { APIGatewayProxyResult, S3Event } from 'aws-lambda';
import { Responses } from '@libs/api-responses';
import { middyfy } from '@libs/lambda';
import { folders, s3Buckets } from '@import-service/libs/s3-utils';
import { s3Service } from '@import-service/services/s3.service';
import { readCsv } from '@import-service/libs/stream-utils';

const bucket = s3Buckets().importServiceBucket;

const importFileParser = async (
  event: S3Event
): Promise<APIGatewayProxyResult> => {
  const originalKey = event.Records[0].s3.object.key;
  const getResponse = await s3Service.get({
    Bucket: bucket,
    Key: originalKey,
  });
  const products = await readCsv(getResponse.Body as Readable);
  console.log({ products });
  const key = path.basename(originalKey);
  await s3Service.copy({
    CopySource: `${bucket}/${originalKey}`,
    Bucket: bucket,
    Key: `${folders.Parsed}/${key}`,
  });
  await s3Service.delete({
    Bucket: bucket,
    Key: originalKey,
  });
  return Responses._200();
};

export const main = middyfy(importFileParser);
