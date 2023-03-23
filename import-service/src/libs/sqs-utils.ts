export const sqsUrls = () => {
  const { CATALOG_ITEMS_QUEUE_URL } = process.env;
  return {
    catalogItemsQueueUrl: CATALOG_ITEMS_QUEUE_URL ?? 'undefined-url',
  };
};
