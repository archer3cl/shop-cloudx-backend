export const s3Buckets = () => {
  const { IMPORT_SERVICE_BUCKET } = process.env;
  return {
    importServiceBucket: IMPORT_SERVICE_BUCKET ?? 'shop-cloudx-import-service',
  };
};

export const folders = {
  Uploaded: 'uploaded',
  Parsed: 'parsed',
};
