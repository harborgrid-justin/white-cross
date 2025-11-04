import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export interface WebhookAttributes {
  id?: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  headers?: any;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'webhooks',
  timestamps: true,
  underscored: false,
,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_webhook_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_webhook_updated_at'
    }
  ]})
export class Webhook extends Model<WebhookAttributes> implements WebhookAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  events: string[];

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.STRING(255))
  secret?: string;

  @Column(DataType.JSON)
  headers?: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Webhook) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] Webhook ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
