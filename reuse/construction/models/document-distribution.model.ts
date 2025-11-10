
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DistributionStatus } from '../types/document.types';
import { ConstructionDocument } from './construction-document.model';

@Table({ tableName: 'document_distributions', timestamps: true })
export class DocumentDistribution extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => ConstructionDocument)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  documentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  recipientId: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  recipientName: string;

  @Column({
    type: DataType.STRING(200),
  })
  recipientEmail: string;

  @Column({
    type: DataType.STRING(200),
  })
  recipientOrganization: string;

  @Column({
    type: DataType.ENUM(...Object.values(DistributionStatus)),
    defaultValue: DistributionStatus.PENDING,
  })
  status: DistributionStatus;

  @Column({
    type: DataType.DATE,
  })
  sentAt: Date;

  @Column({
    type: DataType.DATE,
  })
  deliveredAt: Date;

  @Column({
    type: DataType.DATE,
  })
  acknowledgedAt: Date;

  @Column({
    type: DataType.STRING(500),
  })
  deliveryMethod: string;

  @Column({
    type: DataType.TEXT,
  })
  notes: string;

  @Column({
    type: DataType.UUID,
  })
  distributedBy: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  requiresSignature: boolean;

  @Column({
    type: DataType.STRING(500),
  })
  signatureUrl: string;

  @BelongsTo(() => ConstructionDocument)
  document: ConstructionDocument;
}
