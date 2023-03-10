import { Responses } from '@libs/api-responses';
import { middyfyCors } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { folders, s3Buckets } from '@import-service/libs/s3-utils';
import { s3Service } from '@import-service/services/s3.service';

const importProductsFile = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const fileKey = event.queryStringParameters?.name;
  const { importServiceBucket } = s3Buckets();
  const signedUrl = await s3Service.getSignedUrl({
    ContentType: 'text/csv',
    Bucket: importServiceBucket,
    Key: `${folders.Uploaded}/${fileKey}`,
  });
  return Responses._200(signedUrl);
};

export const main = middyfyCors(importProductsFile);
