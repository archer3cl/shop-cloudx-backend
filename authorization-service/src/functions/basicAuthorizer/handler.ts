import {
  APIGatewayTokenAuthorizerEvent,
  AuthResponse,
  PolicyDocument,
} from 'aws-lambda';

const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _,
  callback
): Promise<AuthResponse> => {
  const headerToken = extractTokenFromHeader(event);

  if (!headerToken) {
    console.log({ headerToken });

    callback('Unauthorized');
    return;
  }

  if (!validateToken(headerToken)) {
    console.log({ isValid: validateToken(headerToken) });
    callback(null, {
      principalId: 'user',
      policyDocument: generatePolicy('Deny', event.methodArn),
    });
    return;
  }

  callback(null, {
    principalId: '',
    policyDocument: generatePolicy('Allow', event.methodArn),
  });
};

const extractTokenFromHeader = (e: APIGatewayTokenAuthorizerEvent) => {
  const header = e.authorizationToken;

  if (header && header.split(' ')[0] === 'Basic') return header.split(' ')[1];
  return null;
};

const validateToken = (token: string) => {
  const decodedData = Buffer.from(token, 'base64').toString('binary');
  const [user, password] = decodedData.split('=');
  return !!process.env[user] && process.env[user] === password;
};

const generatePolicy = (effect: string, resource: string): PolicyDocument => {
  const policyDocument = {} as PolicyDocument;
  if (effect && resource) {
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
  }
  return policyDocument;
};

export const main = basicAuthorizer;
