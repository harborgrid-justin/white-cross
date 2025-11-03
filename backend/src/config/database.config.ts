/**
 * Database Configuration
 * Type-safe database configuration for White Cross platform
 */

import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  synchronize: boolean;
  logging: boolean;
  pool: {
    min: number;
    max: number;
    acquireTimeoutMillis: number;
    idleTimeoutMillis: number;
  };
}

export default registerAs('database', (): DatabaseConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isTest = nodeEnv === 'test';
  const isProduction = nodeEnv === 'production';

  return {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: isTest
      ? (process.env.DB_NAME_TEST as string)
      : (process.env.DB_NAME as string),
    ssl: process.env.DB_SSL === 'true' || isProduction,
    synchronize: process.env.DB_SYNC === 'true' && !isProduction,
    logging: process.env.DB_LOGGING === 'true',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    },
  };
});
