import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export interface PHIDisclosureAuditAttributes {
  id: string;
  disclosureId: string;
  action: 'CREATED' | 'UPDATED' | 'VIEWED' | 'DELETED';
  changes?: Record<string, any>;
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface PHIDisclosureAuditCreationAttributes
  extends Optional<PHIDisclosureAuditAttributes, 'id' | 'createdAt'> {}

class PHIDisclosureAudit extends Model<PHIDisclosureAuditAttributes, PHIDisclosureAuditCreationAttributes>
  implements PHIDisclosureAuditAttributes {
  public id!: string;
  public disclosureId!: string;
  public action!: 'CREATED' | 'UPDATED' | 'VIEWED' | 'DELETED';
  public changes?: Record<string, any>;
  public performedBy!: string;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;

  public static initialize(sequelize: Sequelize): typeof PHIDisclosureAudit {
    PHIDisclosureAudit.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        disclosureId: { type: DataTypes.UUID, allowNull: false, field: 'disclosure_id' },
        action: { type: DataTypes.ENUM('CREATED', 'UPDATED', 'VIEWED', 'DELETED'), allowNull: false },
        changes: { type: DataTypes.JSONB, allowNull: true },
        performedBy: { type: DataTypes.UUID, allowNull: false, field: 'performed_by' },
        ipAddress: { type: DataTypes.INET, allowNull: true, field: 'ip_address' },
        userAgent: { type: DataTypes.TEXT, allowNull: true, field: 'user_agent' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      },
      { sequelize, tableName: 'phi_disclosure_audit', modelName: 'PHIDisclosureAudit', timestamps: false, underscored: true }
    );
    return PHIDisclosureAudit;
  }

  public static associate(models: any): void {
    PHIDisclosureAudit.belongsTo(models.PHIDisclosure, { foreignKey: 'disclosureId', as: 'disclosure' });
    PHIDisclosureAudit.belongsTo(models.User, { foreignKey: 'performedBy', as: 'performer' });
  }
}

export default PHIDisclosureAudit;
