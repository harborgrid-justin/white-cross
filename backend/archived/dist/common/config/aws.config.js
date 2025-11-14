"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('aws', () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const hasCredentials = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    return {
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
//# sourceMappingURL=aws.config.js.map