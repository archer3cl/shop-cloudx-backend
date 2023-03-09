import { mockedContext } from '../../../../__mocks__/context';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { main } from './handler';
import { Readable } from 'stream';
import 'aws-sdk-client-mock-jest';
import { folders, s3Buckets } from '@import-service/libs/s3-utils';

describe('importFileParser handler', function () {
  const s3Mock = mockClient(S3Client);
  beforeEach(() => {
    s3Mock.reset();
  });
  it('verifies successful response', async () => {
    const bucket = s3Buckets().importServiceBucket;
    const event = {
      httpMethod: 'GET',
      Records: [
        {
          eventVersion: '2.0',
          eventSource: 'aws:s3',
          awsRegion: 'us-east-1',
          eventTime: '1970-01-01T00:00:00.000Z',
          eventName: 'ObjectCreated:Put',
          userIdentity: {
            principalId: 'EXAMPLE',
          },
          requestParameters: {
            sourceIPAddress: '127.0.0.1',
          },
          responseElements: {
            'x-amz-request-id': 'EXAMPLE123456789',
            'x-amz-id-2':
              'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH',
          },
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'testConfigRule',
            bucket: {
              name: 'example-bucket',
              ownerIdentity: {
                principalId: 'EXAMPLE',
              },
              arn: 'arn:aws:s3:::example-bucket',
            },
            object: {
              key: 'uploaded/fileTest.csv',
              size: 1024,
              eTag: '0123456789abcdef0123456789abcdef',
              sequencer: '0A1B2C3D4E5F678901',
            },
          },
        },
      ],
    };

    const stream = new Readable();
    stream.push(null);
    const sdkStream = sdkStreamMixin(stream);

    s3Mock
      .on(GetObjectCommand)
      .resolves({ Body: sdkStream })
      .on(CopyObjectCommand)
      .resolves({})
      .on(DeleteObjectCommand)
      .resolves({});
    const result = await main(event as any, mockedContext);
    expect(result.statusCode).toEqual(200);
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
    expect(s3Mock).toHaveReceivedCommand(CopyObjectCommand);
    expect(s3Mock).toHaveReceivedCommand(DeleteObjectCommand);
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: bucket,
      Key: 'uploaded/fileTest.csv',
    });
    expect(s3Mock).toHaveReceivedCommandWith(CopyObjectCommand, {
      CopySource: `${bucket}/uploaded/fileTest.csv`,
      Bucket: bucket,
      Key: `${folders.Parsed}/fileTest.csv`,
    });
    expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
      Bucket: bucket,
      Key: 'uploaded/fileTest.csv',
    });
  });
});
