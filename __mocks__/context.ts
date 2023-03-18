import { Context } from 'aws-lambda';

export const mockedContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'mocked',
  functionVersion: 'mocked',
  invokedFunctionArn: 'mocked',
  memoryLimitInMB: 'mocked',
  awsRequestId: 'mocked',
  logGroupName: 'mocked',
  logStreamName: 'mocked',
  getRemainingTimeInMillis(): number {
    return 999;
  },
  done(_error?: Error, _result?: any): void {
    return;
  },
  fail(_error: Error | string): void {
    return;
  },
  succeed(_messageOrObject: any): void {
    return;
  },
};
