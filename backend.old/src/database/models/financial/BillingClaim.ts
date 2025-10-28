import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export enum ClaimStatus { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED', PENDING = 'PENDING', APPROVED = 'APPROVED', DENIED = 'DENIED', PAID = 'PAID' }

export interface BillingClaimAttributes {
  id: string;
  claimNumber: string;
  studentId: string;
  serviceDate: Date;
  diagnosisCodes: string[];
  procedureCodes: string[];
  totalAmount: number;
  status: ClaimStatus;
  submittedAt?: Date;
  submittedBy?: string;
  paidAmount?: number;
  paidAt?: Date;
  denialReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingClaimCreationAttributes extends Optional<BillingClaimAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class BillingClaim extends Model<BillingClaimAttributes, BillingClaimCreationAttributes> implements BillingClaimAttributes {
  public id!: string;
  public claimNumber!: string;
  public studentId!: string;
  public serviceDate!: Date;
  public diagnosisCodes!: string[];
  public procedureCodes!: string[];
  public totalAmount!: number;
  public status!: ClaimStatus;
  public submittedAt?: Date;
  public submittedBy?: string;
  public paidAmount?: number;
  public paidAt?: Date;
  public denialReason?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public isPaid(): boolean { return this.status === ClaimStatus.PAID; }
  public isDenied(): boolean { return this.status === ClaimStatus.DENIED; }
  public canSubmit(): boolean { return this.status === ClaimStatus.DRAFT; }

  public static initialize(sequelize: Sequelize): typeof BillingClaim {
    BillingClaim.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        claimNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'claim_number' },
        studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
        serviceDate: { type: DataTypes.DATE, allowNull: false, field: 'service_date' },
        diagnosisCodes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, field: 'diagnosis_codes' },
        procedureCodes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, field: 'procedure_codes' },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'total_amount' },
        status: { type: DataTypes.ENUM(...Object.values(ClaimStatus)), allowNull: false, defaultValue: ClaimStatus.DRAFT },
        submittedAt: { type: DataTypes.DATE, allowNull: true, field: 'submitted_at' },
        submittedBy: { type: DataTypes.UUID, allowNull: true, field: 'submitted_by' },
        paidAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'paid_amount' },
        paidAt: { type: DataTypes.DATE, allowNull: true, field: 'paid_at' },
        denialReason: { type: DataTypes.TEXT, allowNull: true, field: 'denial_reason' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      },
      { sequelize, tableName: 'billing_claims', modelName: 'BillingClaim', timestamps: true, underscored: true }
    );
    return BillingClaim;
  }

  public static associate(models: any): void {
    BillingClaim.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    BillingClaim.belongsTo(models.User, { foreignKey: 'submittedBy', as: 'submitter' });
  }

  public static async findPendingClaims(): Promise<BillingClaim[]> {
    return this.findAll({ where: { status: [ClaimStatus.SUBMITTED, ClaimStatus.PENDING] }, order: [['submittedAt', 'ASC']] });
  }
}

export default BillingClaim;
