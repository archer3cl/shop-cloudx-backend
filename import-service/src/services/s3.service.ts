import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({});

export const s3Service = {
  get: async (
    params: GetObjectCommandInput
  ): Promise<GetObjectCommandOutput> => {
    try {
      const command = new GetObjectCommand(params);
      return await s3Client.send(command);
    } catch (error) {
      throw Error(`get-error: ${error}`);
    }
  },
  copy: async (
    params: CopyObjectCommandInput
  ): Promise<CopyObjectCommandOutput> => {
    try {
      const command = new CopyObjectCommand(params);
      return await s3Client.send(command);
    } catch (error) {
      throw Error(`copy-error: ${error}`);
    }
  },
  delete: async (
    params: DeleteObjectCommandInput
  ): Promise<DeleteObjectCommandOutput> => {
    try {
      const command = new DeleteObjectCommand(params);
      return await s3Client.send(command);
    } catch (error) {
      throw Error(`delete-error: ${error}`);
    }
  },
  getSignedUrl: async (
    params: PutObjectCommandInput,
    expiresIn: number = 3600
  ): Promise<string> => {
    try {
      const command = new PutObjectCommand(params);
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      throw Error(`getSignedUrl-error: ${error}`);
    }
  },
};
