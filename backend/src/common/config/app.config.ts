/**
 * Application Configuration
 * Type-safe application-level configuration
 */

import { registerAs } from '@nestjs/config';

export interface AppConfig {
  env: 'development' | 'staging' | 'production' | 'test';
  port: number;
  name: string;
  version: string;
  apiPrefix: string;
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
    format: 'json' | 'text';
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  };
  websocket: {
    enabled: boolean;
    port: number;
    path: string;
    corsOrigin: string;
    pingTimeout: number;
    pingInterval: number;
  };
  monitoring: {
    sentryDsn?: string;
    enableMetrics: boolean;
    enableTracing: boolean;
  };
  timeout: {
    request: number;
    gracefulShutdown: number;
  };
  features: {
    aiSearch: boolean;
    analytics: boolean;
    websocket: boolean;
    reporting: boolean;
    dashboard: boolean;
    advancedFeatures: boolean;
    enterprise: boolean;
    discovery: boolean;
    cliMode: boolean;
  };
  throttle: {
    short: {
      ttl: number;
      limit: number;
    };
    medium: {
      ttl: number;
      limit: number;
    };
    long: {
      ttl: number;
      limit: number;
    };
  };
}

export default registerAs('app', (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    env: nodeEnv as 'development' | 'staging' | 'production' | 'test',
    port: parseInt(process.env.PORT || '3001', 10),
    name: 'White Cross School Health Platform',
    version: '2.0.0',
    apiPrefix: 'api',
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info',
      format: nodeEnv === 'production' ? 'json' : 'text',
      enableConsole: true,
      enableFile: nodeEnv === 'production',
      filePath: process.env.LOG_FILE_PATH,
    },
    websocket: {
      enabled: process.env.FEATURES_ENABLE_WEBSOCKET !== 'false',
      port: parseInt(process.env.WS_PORT || '3002', 10),
      path: process.env.WS_PATH || '/socket.io',
      corsOrigin: process.env.WS_CORS_ORIGIN || 'http://localhost:3000',
      pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '60000', 10),
      pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000', 10),
    },
    monitoring: {
      sentryDsn: process.env.SENTRY_DSN,
      enableMetrics: nodeEnv === 'production',
      enableTracing: nodeEnv === 'production',
    },
    timeout: {
      request: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
      gracefulShutdown: 10000, // 10 seconds
    },
    features: {
      aiSearch: process.env.FEATURES_ENABLE_AI_SEARCH === 'true',
      analytics: process.env.ENABLE_ANALYTICS !== 'false',
      websocket: process.env.FEATURES_ENABLE_WEBSOCKET !== 'false',
      reporting: process.env.ENABLE_REPORTING !== 'false',
      dashboard: process.env.ENABLE_DASHBOARD !== 'false',
      advancedFeatures: process.env.ENABLE_ADVANCED_FEATURES !== 'false',
      enterprise: process.env.ENABLE_ENTERPRISE !== 'false',
      discovery:
        nodeEnv === 'development' && process.env.ENABLE_DISCOVERY === 'true',
      cliMode: process.env.CLI_MODE === 'true',
    },
    throttle: {
      short: {
        ttl: 1000, // 1 second
        limit: nodeEnv === 'development' ? 100 : 10,
      },
      medium: {
        ttl: 10000, // 10 seconds
        limit: nodeEnv === 'development' ? 500 : 50,
      },
      long: {
        ttl: 60000, // 1 minute
        limit: nodeEnv === 'development' ? 1000 : 100,
      },
    },
  };
});
