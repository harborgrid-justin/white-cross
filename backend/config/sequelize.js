/**
 * Sequelize CLI Configuration (CommonJS)
 * This file is used by Sequelize CLI for migrations and seeders
 *
 * IMPORTANT: Must be in CommonJS format (not ES modules)
 * Sequelize CLI requires this format for compatibility
 */

require('dotenv').config(); // Load environment variables

/**
 * Parse DATABASE_URL into connection parameters
 */
function parseDatabaseUrl(databaseUrl) {
  try {
    const url = new URL(databaseUrl);

    // Parse SSL mode from query parameters
    const sslMode = url.searchParams.get('sslmode') || url.searchParams.get('ssl');
    const requireSSL = sslMode === 'require' || sslMode === 'true' || databaseUrl.includes('sslmode=require');

    return {
      dialect: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 5432,
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1), // Remove leading slash
      dialectOptions: requireSSL ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    };
  } catch (error) {
    console.error('Failed to parse DATABASE_URL:', error);
    throw new Error('Invalid DATABASE_URL format');
  }
}

/**
 * Get base configuration
 */
function getBaseConfig(env = process.env) {
  const isProduction = env.NODE_ENV === 'production';
  const isDevelopment = env.NODE_ENV === 'development';

  // Base configuration
  let config = {
    dialect: env.DB_DIALECT || 'postgres',

    // Connection pooling
    pool: {
      max: parseInt(env.DB_POOL_MAX || (isProduction ? '20' : '10'), 10),
      min: parseInt(env.DB_POOL_MIN || (isProduction ? '5' : '2'), 10),
      acquire: parseInt(env.DB_POOL_ACQUIRE || '30000', 10),
      idle: parseInt(env.DB_POOL_IDLE || '10000', 10),
    },

    // Migration/Seeder configuration
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeders',
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',

    // Logging
    logging: isDevelopment ? console.log : false,

    // Model defaults
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  };

  // Priority 1: Use DATABASE_URL if provided
  if (env.DATABASE_URL) {
    const urlConfig = parseDatabaseUrl(env.DATABASE_URL);
    config = { ...config, ...urlConfig };

    // Override SSL settings if explicitly provided
    if (env.DB_SSL === 'true' || env.DB_SSL === 'false') {
      const requireSSL = env.DB_SSL === 'true';
      const rejectUnauthorized = env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

      config.dialectOptions = {
        ...config.dialectOptions,
        ssl: requireSSL ? {
          require: true,
          rejectUnauthorized,
        } : undefined,
      };
    }
  } else {
    // Priority 2: Use individual connection parameters
    config.host = env.DB_HOST || 'localhost';
    config.port = parseInt(env.DB_PORT || '5432', 10);
    config.username = env.DB_USERNAME || 'postgres';
    config.password = env.DB_PASSWORD || '';
    config.database = env.DB_NAME || 'whitecross';

    // Configure SSL if enabled
    if (env.DB_SSL === 'true') {
      const rejectUnauthorized = env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
      config.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized,
        },
      };
    }
  }

  return config;
}

/**
 * Environment-specific configurations
 */
module.exports = {
  development: {
    ...getBaseConfig({ ...process.env, NODE_ENV: 'development' }),
  },

  test: {
    ...getBaseConfig({ ...process.env, NODE_ENV: 'test' }),
    logging: false,
  },

  production: {
    ...getBaseConfig({ ...process.env, NODE_ENV: 'production' }),
    logging: false,
  },
};

/**
 * Export single config for current environment
 * Sequelize CLI uses this when environment is not specified
 */
module.exports.default = module.exports[process.env.NODE_ENV || 'development'];
