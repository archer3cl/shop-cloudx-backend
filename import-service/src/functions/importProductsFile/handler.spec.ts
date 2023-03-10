import { mockedContext } from '../../../../__mocks__/context';
import { main } from './handler';
import * as S3requestPresigner from '@aws-sdk/s3-request-presigner';
import 'aws-sdk-client-mock-jest';
import { s3Buckets } from '@import-service/libs/s3-utils';
const { importServiceBucket } = s3Buckets();

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

jest.mock('@middy/core', () => require('../../../../__mocks__/middy'));

describe('importProductsFile handler', function () {
  it('verifies successful signed url creation', async () => {
    const signedUrl = 'http://peaceful-behold.com';
    const testFileName = 'myfile.csv';
    const event = {
      httpMethod: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      queryStringParameters: { name: testFileName },
    } as any;

    const mockGetSignedUrl = jest
      .spyOn(S3requestPresigner, 'getSignedUrl')
      .mockResolvedValue(signedUrl);

    const result = await main(event, mockedContext);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify(signedUrl));
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: {
          Bucket: importServiceBucket,
          ContentType: 'text/csv',
          Key: `uploaded/${testFileName}`,
        },
      }),
      expect.objectContaining({ expiresIn: 3600 })
    );
  });
});
