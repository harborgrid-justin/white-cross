/**
 * AWS Configuration
 * Type-safe AWS services configuration for White Cross platform
 */

import { registerAs } from '@nestjs/config';

export interface AwsConfig {
  region: string;
  credentials: {
    accessKeyId?: string;
    secretAccessKey?: string;
    useIamRole: boolean;
  };
  s3: {
    bucket: string;
    region?: string;
    endpoint?: string;
    forcePathStyle: boolean;
  };
  secretsManager: {
    enabled: boolean;
    secretName?: string;
    region?: string;
  };
  ses: {
    enabled: boolean;
    region?: string;
    fromEmail?: string;
  };
  cloudWatch: {
    enabled: boolean;
    logGroupName?: string;
    logStreamName?: string;
  };
}

export default registerAs('aws', (): AwsConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasCredentials = !!(
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  );

  return {
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      // Prefer IAM roles in production (more secure)
      useIamRole: isProduction && !hasCredentials,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET || '',
      region: process.env.AWS_S3_REGION || process.env.AWS_REGION,
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
    },
    secretsManager: {
      enabled: process.env.AWS_SECRETS_MANAGER_ENABLED === 'true',
      secretName: process.env.AWS_SECRET_NAME,
      region: process.env.AWS_SECRETS_MANAGER_REGION || process.env.AWS_REGION,
    },
    ses: {
      enabled: process.env.AWS_SES_ENABLED === 'true',
      region: process.env.AWS_SES_REGION || process.env.AWS_REGION,
      fromEmail: process.env.AWS_SES_FROM_EMAIL,
    },
    cloudWatch: {
      enabled: isProduction && process.env.AWS_CLOUDWATCH_ENABLED !== 'false',
      logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP,
      logStreamName: process.env.AWS_CLOUDWATCH_LOG_STREAM,
    },
  };
});
