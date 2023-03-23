export const snsTopicArns = () => {
  const { SNS_CREATE_PRODUCT_TOPIC_ARN } = process.env;
  return {
    createProductTopicArn:
      SNS_CREATE_PRODUCT_TOPIC_ARN ?? 'undefined-topic-arn',
  };
};
