
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { VendorQualificationStatus } from '../types/bid.types';

@Table({
  tableName: 'vendor_prequalifications',
  timestamps: true,
  indexes: [
    { fields: ['vendorId'] },
    { fields: ['qualificationStatus'] },
    { fields: ['workCategories'], using: 'gin' },
  ],
})
export class VendorPrequalification extends Model<VendorPrequalification> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  vendorId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  vendorName!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  qualificationNumber!: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  workCategories!: string[];

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  maxProjectValue!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  bondingCapacity!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  insuranceCoverage!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  pastProjectCount!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  pastProjectValue!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  safetyRating!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  qualityRating!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  performanceRating!: number;

  @AllowNull(false)
  @Default('FAIR')
  @Column(DataType.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'))
  financialStrength!: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

  @AllowNull(false)
  @Default(VendorQualificationStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(VendorQualificationStatus)),
  })
  qualificationStatus!: VendorQualificationStatus;

  @Column(DataType.DATE)
  qualifiedDate?: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  certifications!: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  licenses!: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata!: Record<string, any>;
}
