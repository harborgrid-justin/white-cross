import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IntegrationType } from '../../types/enums';

/**
 * IntegrationLog Model
 * Tracks all integration operations, sync activities, and outcomes
 * Essential for monitoring integration health and troubleshooting
 */

interface IntegrationLogAttributes {
  id: string;
  integrationType: IntegrationType;
  action: string;
  status: string;
  recordsProcessed?: number;
  recordsSucceeded?: number;
  recordsFailed?: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
  details?: any;
  integrationId?: string;
  createdAt: Date;
}

interface IntegrationLogCreationAttributes
  extends Optional<
    IntegrationLogAttributes,
    | 'id'
    | 'recordsProcessed'
    | 'recordsSucceeded'
    | 'recordsFailed'
    | 'completedAt'
    | 'duration'
    | 'errorMessage'
    | 'details'
    | 'integrationId'
    | 'createdAt'
  > {}

export class IntegrationLog
  extends Model<IntegrationLogAttributes, IntegrationLogCreationAttributes>
  implements IntegrationLogAttributes
{
  public id!: string;
  public integrationType!: IntegrationType;
  public action!: string;
  public status!: string;
  public recordsProcessed?: number;
  public recordsSucceeded?: number;
  public recordsFailed?: number;
  public startedAt!: Date;
  public completedAt?: Date;
  public duration?: number;
  public errorMessage?: string;
  public details?: any;
  public integrationId?: string;
  public readonly createdAt!: Date;
}

IntegrationLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    integrationType: {
      type: DataTypes.ENUM(...Object.values(IntegrationType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(IntegrationType)],
          msg: 'Invalid integration type'
        }
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Action cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Action must be between 2 and 100 characters'
        },
        isValidAction(value: string) {
          const validActions = [
            'create', 'update', 'delete', 'test_connection', 'sync',
            'enable', 'disable', 'configure', 'test', 'connect',
            'disconnect', 'import', 'export', 'validate', 'webhook'
          ];
          if (!validActions.includes(value.toLowerCase())) {
            // Allow through if it's a custom action, but log it
            if (!/^[a-z_]+$/.test(value.toLowerCase())) {
              throw new Error('Action can only contain lowercase letters and underscores');
            }
          }
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Status cannot be empty'
        },
        isIn: {
          args: [['success', 'failed', 'pending', 'in_progress']],
          msg: 'Invalid status. Must be one of: success, failed, pending, in_progress'
        }
      }
    },
    recordsProcessed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Records processed cannot be negative'
        },
        max: {
          args: [1000000],
          msg: 'Records processed cannot exceed 1,000,000'
        },
        isInt: {
          msg: 'Records processed must be an integer'
        }
      }
    },
    recordsSucceeded: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Records succeeded cannot be negative'
        },
        max: {
          args: [1000000],
          msg: 'Records succeeded cannot exceed 1,000,000'
        },
        isInt: {
          msg: 'Records succeeded must be an integer'
        }
      }
    },
    recordsFailed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Records failed cannot be negative'
        },
        max: {
          args: [1000000],
          msg: 'Records failed cannot exceed 1,000,000'
        },
        isInt: {
          msg: 'Records failed must be an integer'
        }
      }
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Started at must be a valid date'
        },
        isNotFuture(value: Date) {
          const now = new Date();
          if (new Date(value) > now) {
            throw new Error('Started at cannot be in the future');
          }
        }
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Completed at must be a valid date'
        },
        isNotFuture(value: Date | null) {
          if (value) {
            const now = new Date();
            if (new Date(value) > now) {
              throw new Error('Completed at cannot be in the future');
            }
          }
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Duration cannot be negative'
        },
        max: {
          args: [86400000],
          msg: 'Duration cannot exceed 24 hours (86400000ms)'
        },
        isInt: {
          msg: 'Duration must be an integer'
        }
      }
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 10000],
          msg: 'Error message cannot exceed 10000 characters'
        }
      }
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isValidDetails(value: any) {
          if (value !== null && value !== undefined) {
            // Ensure it's a valid object
            if (typeof value !== 'object') {
              throw new Error('Details must be a valid JSON object or array');
            }

            // Validate that details don't contain sensitive information in plain text
            const detailsString = JSON.stringify(value).toLowerCase();
            const sensitivePatterns = [
              /password\s*[:=]\s*["'][^"']{1,}/i,
              /api[-_]?key\s*[:=]\s*["'][^"']{1,}/i,
              /secret\s*[:=]\s*["'][^"']{1,}/i,
              /token\s*[:=]\s*["'][^"']{1,}/i
            ];

            for (const pattern of sensitivePatterns) {
              if (pattern.test(detailsString)) {
                // Check if it's actually masked
                if (!detailsString.includes('***masked***') && !detailsString.includes('***hidden***')) {
                  throw new Error('Details contain potentially sensitive information that should be masked');
                }
              }
            }

            // Validate details size (prevent excessively large JSON)
            if (detailsString.length > 100000) {
              throw new Error('Details JSON size cannot exceed 100KB');
            }
          }
        }
      }
    },
    integrationId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Integration ID must be a valid UUID'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Created at must be a valid date'
        }
      }
    },
  },
  {
    sequelize,
    tableName: 'integration_logs',
    timestamps: false,
    indexes: [
      { fields: ['integrationType', 'createdAt'] },
      { fields: ['integrationId', 'createdAt'] },
      { fields: ['status'] },
      { fields: ['startedAt'] },
      { fields: ['action'] },
      { fields: ['createdAt'] },
    ],
    validate: {
      // Model-level validation to ensure data consistency
      recordCountsAreConsistent() {
        if (this.recordsProcessed !== null && this.recordsProcessed !== undefined) {
          const succeeded = this.recordsSucceeded || 0;
          const failed = this.recordsFailed || 0;
          const total = succeeded + failed;

          if (total > this.recordsProcessed) {
            throw new Error('Sum of succeeded and failed records cannot exceed total records processed');
          }
        }
      },

      // Validate that completed operations have completedAt timestamp
      completedOperationsHaveTimestamp() {
        if (this.status === 'success' || this.status === 'failed') {
          if (!this.completedAt) {
            throw new Error('Completed operations must have a completedAt timestamp');
          }
        }
      },

      // Validate that completedAt is after startedAt
      completedAtIsAfterStartedAt() {
        if (this.completedAt && this.startedAt) {
          const started = new Date(this.startedAt).getTime();
          const completed = new Date(this.completedAt).getTime();

          if (completed < started) {
            throw new Error('Completed at cannot be before started at');
          }

          // Optionally validate duration matches the time difference
          if (this.duration !== null && this.duration !== undefined) {
            const calculatedDuration = completed - started;
            // Allow for small discrepancies (up to 1 second)
            if (Math.abs(calculatedDuration - this.duration) > 1000) {
              throw new Error('Duration does not match the time difference between started and completed timestamps');
            }
          }
        }
      },

      // Validate that failed operations have error messages
      failedOperationsHaveErrorMessage() {
        if (this.status === 'failed' && !this.errorMessage && (!this.details || !this.details.errors)) {
          throw new Error('Failed operations must have an error message or error details');
        }
      }
    }
  }
);
