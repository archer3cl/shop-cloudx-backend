import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { mockedContext } from '../../../../__mocks__/context';
import { main } from './handler';

jest.mock('@middy/core', () => require('../../../../__mocks__/middy'));

describe('basicAuthorizer handler', function () {
  const env = process.env;
  const mockedCallback = jest
    .fn()
    .mockImplementation((...args) => console.log(args));

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
    mockedCallback.mockClear();
  });

  afterEach(() => {
    process.env = env;
  });

  it('verifies successful user exists', async () => {
    process.env.testKey = 'testPassword';
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      methodArn:
        'arn:aws:execute-api:us-east-2:720608073116:uepb4rehl2/dev/GET/import',
      authorizationToken: 'Basic dGVzdEtleT10ZXN0UGFzc3dvcmQ=',
    };

    await main(event, mockedContext, mockedCallback);
    expect(mockedCallback).toHaveBeenCalled();
    expect(mockedCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        policyDocument: expect.objectContaining({
          Statement: expect.arrayContaining([
            expect.objectContaining({
              Effect: 'Allow',
            }),
          ]),
        }),
      })
    );
  });

  it('verifies 401 on missing auth header', async () => {
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      methodArn:
        'arn:aws:execute-api:us-east-2:720608073116:uepb4rehl2/dev/GET/import',
      authorizationToken: null,
    };

    await main(event, mockedContext, mockedCallback);
    expect(mockedCallback).toHaveBeenCalled();
    expect(mockedCallback).toHaveBeenCalledWith('Unauthorized');
  });

  it('verifies 403 when user does not exist', async () => {
    process.env.testKey = 'testPassword';

    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      methodArn:
        'arn:aws:execute-api:us-east-2:720608073116:uepb4rehl2/dev/GET/import',
      authorizationToken: 'Basic YW5vdGhlclVzZXI9VEVTVF9QQVNTV09SRA==',
    };

    await main(event, mockedContext, mockedCallback);
    expect(mockedCallback).toHaveBeenCalled();
    expect(mockedCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        policyDocument: expect.objectContaining({
          Statement: expect.arrayContaining([
            expect.objectContaining({
              Effect: 'Deny',
            }),
          ]),
        }),
      })
    );
  });

  it('verifies 403 when password does not match', async () => {
    process.env.testKey = 'testPassword';
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      methodArn:
        'arn:aws:execute-api:us-east-2:720608073116:uepb4rehl2/dev/GET/import',
      authorizationToken: 'Basic dGVzdEtleT0xMjM0NTY3OA==',
    };

    await main(event, mockedContext, mockedCallback);
    expect(mockedCallback).toHaveBeenCalled();
    expect(mockedCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        policyDocument: expect.objectContaining({
          Statement: expect.arrayContaining([
            expect.objectContaining({
              Effect: 'Deny',
            }),
          ]),
        }),
      })
    );
  });

  it('verifies 403 when token is incomplete fails', async () => {
    process.env.testKey = 'testPassword';
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      methodArn:
        'arn:aws:execute-api:us-east-2:720608073116:uepb4rehl2/dev/GET/import',
      authorizationToken: 'Basic YW5vdGhl==',
    };

    await main(event, mockedContext, mockedCallback);
    expect(mockedCallback).toHaveBeenCalled();
    expect(mockedCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        policyDocument: expect.objectContaining({
          Statement: expect.arrayContaining([
            expect.objectContaining({
              Effect: 'Deny',
            }),
          ]),
        }),
      })
    );
  });
});
