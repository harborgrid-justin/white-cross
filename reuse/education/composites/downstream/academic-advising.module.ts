import { Sequelize, Model, DataTypes } from 'sequelize';
import { Module, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AcademicAdvisingController } from './academic-advising-controller';
import { AcademicAdvisingControllersService } from './academic-advising-service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';
import { PermissionsGuard } from './security/guards/permissions.guard';
import { Roles } from './security/decorators/roles.decorator';
import { RequirePermissions } from './security/decorators/permissions.decorator';

/**
 * LOC: EDU-DOWN-ADVISING-MODULE-001
 * File: /reuse/education/composites/downstream/academic-advising.module.ts
 *
 * Purpose: Academic Advising Module - Dependency injection and module configuration
 */


// ============================================================================
// SECURITY: Authentication & Authorization
// ============================================================================
// SECURITY: Import authentication and authorization

@Module({
  controllers: [AcademicAdvisingController],
  providers: [
    AcademicAdvisingControllersService,
    Logger,
  ],
  exports: [AcademicAdvisingControllersService],
})

// ============================================================================
// SEQUELIZE MODELS WITH PRODUCTION-READY FEATURES
// ============================================================================

/**
 * Production-ready Sequelize model for AcademicAdvising.moduleRecord
 *
 * Features:
 * - Lifecycle hooks for FERPA/HIPAA compliance auditing
 * - Comprehensive validations with custom validators
 * - Model scopes for common query patterns
 * - Virtual attributes for computed properties
 * - Paranoid mode for soft deletes
 * - Optimized indexes (simple and compound)
 */
export const createAcademicAdvisingModuleRecord = (sequelize: Sequelize) => {
  class AcademicAdvisingModuleRecord extends Model {
    public id!: string;
    public status!: string;
    public data!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    // Virtual attributes
    get isActive(): boolean {
      return this.status === 'active';
    }

    get isPending(): boolean {
      return this.status === 'pending';
    }

    get isCompleted(): boolean {
      return this.status === 'completed';
    }

    get statusLabel(): string {
      return this.status.replace('_', ' ').toUpperCase();
    }
  }

  AcademicAdvising.moduleRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Record status',
        validate: {
          isIn: [['active', 'inactive', 'pending', 'completed', 'cancelled']],
          notEmpty: true,
        },
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Comprehensive record data',
        validate: {
          isValidData(value: any) {
            if (typeof value !== 'object' || value === null) {
              throw new Error('data must be a valid object');
            }
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'academic_advising.module_records',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['created_at'] },
        { fields: ['updated_at'] },
        { fields: ['deleted_at'] },
        { fields: ['status', 'created_at'] },
      ],
      hooks: {
        beforeCreate: async (record: AcademicAdvising.moduleRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_AcademicADvising.module',
                  tableName: 'academic_advising.module_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: AcademicAdvising.moduleRecord, options: any) => {
          console.log(`[AUDIT] AcademicAdvising.moduleRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: AcademicAdvising.moduleRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_AcademicADvising.module',
                  tableName: 'academic_advising.module_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: AcademicAdvising.moduleRecord, options: any) => {
          console.log(`[AUDIT] AcademicAdvising.moduleRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: AcademicAdvising.moduleRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_AcademicADvising.module',
                  tableName: 'academic_advising.module_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: AcademicAdvising.moduleRecord, options: any) => {
          console.log(`[AUDIT] AcademicAdvising.moduleRecord deleted: ${record.id}`);
        },
      },
      scopes: {
        defaultScope: {
          attributes: { exclude: ['deletedAt'] },
        },
        active: {
          where: { status: 'active' },
        },
        pending: {
          where: { status: 'pending' },
        },
        completed: {
          where: { status: 'completed' },
        },
        recent: {
          order: [['createdAt', 'DESC']],
          limit: 100,
        },
        withData: {
          attributes: {
            include: ['id', 'status', 'data', 'createdAt', 'updatedAt'],
          },
        },
      },
    },
  );

  return AcademicAdvisingModuleRecord;
};


@Injectable()
export class AcademicAdvisingModule {}
