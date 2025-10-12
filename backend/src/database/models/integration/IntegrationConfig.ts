import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IntegrationType, IntegrationStatus } from '../../types/enums';

/**
 * IntegrationConfig Model
 * Manages external system integration configurations including
 * SIS, EHR, pharmacy systems, and other healthcare integrations
 */

interface IntegrationConfigAttributes {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: any;
  isActive: boolean;
  lastSyncAt?: Date;
  lastSyncStatus?: string;
  syncFrequency?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IntegrationConfigCreationAttributes
  extends Optional<
    IntegrationConfigAttributes,
    | 'id'
    | 'status'
    | 'endpoint'
    | 'apiKey'
    | 'username'
    | 'password'
    | 'settings'
    | 'isActive'
    | 'lastSyncAt'
    | 'lastSyncStatus'
    | 'syncFrequency'
    | 'createdAt'
    | 'updatedAt'
  > {}

export class IntegrationConfig
  extends Model<IntegrationConfigAttributes, IntegrationConfigCreationAttributes>
  implements IntegrationConfigAttributes
{
  public id!: string;
  public name!: string;
  public type!: IntegrationType;
  public status!: IntegrationStatus;
  public endpoint?: string;
  public apiKey?: string;
  public username?: string;
  public password?: string;
  public settings?: any;
  public isActive!: boolean;
  public lastSyncAt?: Date;
  public lastSyncStatus?: string;
  public syncFrequency?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IntegrationConfig.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Integration name cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Integration name must be between 2 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z0-9\s\-_()]+$/.test(value)) {
            throw new Error('Integration name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses');
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IntegrationType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(IntegrationType)],
          msg: 'Invalid integration type'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(IntegrationStatus)),
      allowNull: false,
      defaultValue: IntegrationStatus.INACTIVE,
      validate: {
        isIn: {
          args: [Object.values(IntegrationStatus)],
          msg: 'Invalid integration status'
        }
      }
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidEndpoint(value: string | null) {
          if (value) {
            // URL validation
            try {
              const url = new URL(value);
              // Only allow http and https protocols
              if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error('Endpoint must use HTTP or HTTPS protocol');
              }
              // Validate URL length
              if (value.length > 2048) {
                throw new Error('Endpoint URL cannot exceed 2048 characters');
              }
            } catch (error: any) {
              if (error.message.includes('protocol') || error.message.includes('exceed')) {
                throw error;
              }
              throw new Error('Invalid endpoint URL format');
            }
          }
        },
        noLocalhostInProduction(value: string | null) {
          if (value && process.env.NODE_ENV === 'production') {
            const url = new URL(value);
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '0.0.0.0') {
              throw new Error('Localhost endpoints are not allowed in production');
            }
          }
        }
      }
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidApiKey(value: string | null) {
          if (value) {
            // API Key length validation
            if (value.length < 8) {
              throw new Error('API Key must be at least 8 characters long');
            }
            if (value.length > 512) {
              throw new Error('API Key cannot exceed 512 characters');
            }
            // Check for basic security (no plain text patterns)
            if (/^(password|12345|test|demo|api[-_]?key)/i.test(value)) {
              throw new Error('API Key appears to be insecure or a placeholder');
            }
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 100],
          msg: 'Username must be between 2 and 100 characters'
        },
        isValidUsername(value: string | null) {
          if (value) {
            // Username format validation
            if (!/^[a-zA-Z0-9@._\-+]+$/.test(value)) {
              throw new Error('Username contains invalid characters');
            }
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidPassword(value: string | null) {
          if (value) {
            // Password strength validation
            if (value.length < 8) {
              throw new Error('Password must be at least 8 characters long');
            }
            if (value.length > 256) {
              throw new Error('Password cannot exceed 256 characters');
            }
            // Check for weak passwords
            if (/^(password|12345678|qwerty|admin|test)/i.test(value)) {
              throw new Error('Password is too weak or appears to be a placeholder');
            }
          }
        }
      }
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isValidSettings(value: any) {
          if (value !== null && value !== undefined) {
            // Ensure it's a valid object
            if (typeof value !== 'object' || Array.isArray(value)) {
              throw new Error('Settings must be a valid JSON object');
            }

            // Validate sync schedule if present (cron expression)
            if (value.syncSchedule && typeof value.syncSchedule === 'string') {
              const cronParts = value.syncSchedule.trim().split(/\s+/);
              if (cronParts.length < 5 || cronParts.length > 7) {
                throw new Error('Invalid cron expression format in syncSchedule');
              }
            }

            // Validate timeout values
            if (value.timeout !== undefined) {
              const timeout = Number(value.timeout);
              if (isNaN(timeout) || timeout < 1000 || timeout > 300000) {
                throw new Error('Timeout must be between 1000ms (1s) and 300000ms (5min)');
              }
            }

            // Validate retry attempts
            if (value.retryAttempts !== undefined) {
              const retryAttempts = Number(value.retryAttempts);
              if (isNaN(retryAttempts) || retryAttempts < 0 || retryAttempts > 10) {
                throw new Error('Retry attempts must be between 0 and 10');
              }
            }

            // Validate retry delay
            if (value.retryDelay !== undefined) {
              const retryDelay = Number(value.retryDelay);
              if (isNaN(retryDelay) || retryDelay < 100 || retryDelay > 60000) {
                throw new Error('Retry delay must be between 100ms and 60000ms (1min)');
              }
            }

            // Validate authentication method
            if (value.authMethod) {
              const validAuthMethods = ['api_key', 'basic_auth', 'oauth2', 'jwt', 'certificate', 'custom'];
              if (!validAuthMethods.includes(value.authMethod)) {
                throw new Error(`Invalid authentication method. Must be one of: ${validAuthMethods.join(', ')}`);
              }
            }

            // Validate sync direction
            if (value.syncDirection) {
              const validDirections = ['inbound', 'outbound', 'bidirectional'];
              if (!validDirections.includes(value.syncDirection)) {
                throw new Error(`Invalid sync direction. Must be one of: ${validDirections.join(', ')}`);
              }
            }

            // Validate OAuth2 configuration if present
            if (value.oauth2Config) {
              const oauth2 = value.oauth2Config;
              if (!oauth2.clientId || typeof oauth2.clientId !== 'string') {
                throw new Error('OAuth2 configuration requires valid clientId');
              }
              if (!oauth2.clientSecret || typeof oauth2.clientSecret !== 'string') {
                throw new Error('OAuth2 configuration requires valid clientSecret');
              }
              if (!oauth2.authorizationUrl || !/^https?:\/\/.+/.test(oauth2.authorizationUrl)) {
                throw new Error('OAuth2 configuration requires valid authorizationUrl');
              }
              if (!oauth2.tokenUrl || !/^https?:\/\/.+/.test(oauth2.tokenUrl)) {
                throw new Error('OAuth2 configuration requires valid tokenUrl');
              }
              const validGrantTypes = ['authorization_code', 'client_credentials', 'password', 'refresh_token'];
              if (!oauth2.grantType || !validGrantTypes.includes(oauth2.grantType)) {
                throw new Error(`OAuth2 grantType must be one of: ${validGrantTypes.join(', ')}`);
              }
            }

            // Validate field mappings if present
            if (value.fieldMappings && Array.isArray(value.fieldMappings)) {
              value.fieldMappings.forEach((mapping: any, index: number) => {
                if (!mapping.sourceField || typeof mapping.sourceField !== 'string') {
                  throw new Error(`Field mapping at index ${index} requires valid sourceField`);
                }
                if (!mapping.targetField || typeof mapping.targetField !== 'string') {
                  throw new Error(`Field mapping at index ${index} requires valid targetField`);
                }
                if (!mapping.dataType) {
                  throw new Error(`Field mapping at index ${index} requires valid dataType`);
                }
                const validDataTypes = ['string', 'number', 'boolean', 'date', 'array', 'object'];
                if (!validDataTypes.includes(mapping.dataType)) {
                  throw new Error(`Invalid dataType at index ${index}. Must be one of: ${validDataTypes.join(', ')}`);
                }
              });
            }

            // Validate webhook configuration
            if (value.enableWebhooks && value.webhookUrl) {
              try {
                const webhookUrl = new URL(value.webhookUrl);
                if (!['http:', 'https:'].includes(webhookUrl.protocol)) {
                  throw new Error('Webhook URL must use HTTP or HTTPS protocol');
                }
              } catch (error: any) {
                if (error.message.includes('protocol')) {
                  throw error;
                }
                throw new Error('Invalid webhook URL format');
              }
            }

            // Validate rate limiting if present
            if (value.rateLimitPerSecond !== undefined) {
              const rateLimit = Number(value.rateLimitPerSecond);
              if (isNaN(rateLimit) || rateLimit < 1 || rateLimit > 1000) {
                throw new Error('Rate limit must be between 1 and 1000 requests per second');
              }
            }
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isValidDate(value: Date | null) {
          if (value) {
            const syncDate = new Date(value);
            const now = new Date();
            if (syncDate > now) {
              throw new Error('Last sync date cannot be in the future');
            }
          }
        }
      }
    },
    lastSyncStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['success', 'failed', 'pending', 'in_progress']],
          msg: 'Invalid sync status. Must be one of: success, failed, pending, in_progress'
        }
      }
    },
    syncFrequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Sync frequency must be at least 1 minute'
        },
        max: {
          args: [43200],
          msg: 'Sync frequency cannot exceed 43200 minutes (30 days)'
        },
        isInt: {
          msg: 'Sync frequency must be an integer'
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'integration_configs',
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['isActive'] },
      { fields: ['lastSyncAt'] },
      { fields: ['name'], unique: true },
    ],
    validate: {
      // Model-level validation to ensure authentication is configured
      hasAuthenticationMethod(this: IntegrationConfig) {
        // Skip validation for GOVERNMENT_REPORTING which may not need external auth
        if (this.type === IntegrationType.GOVERNMENT_REPORTING) {
          return;
        }

        // At least one authentication method should be provided
        const settings = this.settings as any;
        if (!this.apiKey && !this.username && !this.password &&
            (!settings || !settings.oauth2Config)) {
          throw new Error('At least one authentication method (apiKey, username/password, or OAuth2) must be configured');
        }

        // If username is provided, password should also be provided for basic auth
        if (this.username && !this.password && !this.apiKey) {
          throw new Error('Password is required when username is provided for basic authentication');
        }
      },

      // Ensure endpoint is provided for external integrations
      hasEndpointForExternalIntegration(this: IntegrationConfig) {
        const typesRequiringEndpoint = [
          IntegrationType.SIS,
          IntegrationType.EHR,
          IntegrationType.PHARMACY,
          IntegrationType.LABORATORY,
          IntegrationType.INSURANCE,
          IntegrationType.PARENT_PORTAL,
          IntegrationType.HEALTH_APP
        ];

        if (typesRequiringEndpoint.includes(this.type as IntegrationType) && !this.endpoint) {
          throw new Error(`Endpoint URL is required for ${this.type} integration type`);
        }
      }
    }
  }
);
