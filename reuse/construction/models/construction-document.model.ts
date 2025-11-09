
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { DocumentType, DocumentDiscipline, DocumentStatus, RetentionPeriod } from '../types/document.types';
import { DocumentRevision } from './document-revision.model';
import { DocumentDistribution } from './document-distribution.model';

@Table({ tableName: 'construction_documents', timestamps: true, paranoid: true })
export class ConstructionDocument extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  documentNumber: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentType)),
    allowNull: false,
  })
  documentType: DocumentType;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentDiscipline)),
    allowNull: false,
  })
  discipline: DocumentDiscipline;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentStatus)),
    defaultValue: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  revision: string;

  @Column({
    type: DataType.STRING(1000),
  })
  description: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  fileUrl: string;

  @Column({
    type: DataType.STRING(100),
  })
  fileName: string;

  @Column({
    type: DataType.BIGINT,
  })
  fileSize: number;

  @Column({
    type: DataType.STRING(100),
  })
  mimeType: string;

  @Column({
    type: DataType.UUID,
  })
  parentDocumentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy: string;

  @Column({
    type: DataType.UUID,
  })
  approvedBy: string;

  @Column({
    type: DataType.DATE,
  })
  approvedAt: Date;

  @Column({
    type: DataType.DATE,
  })
  issuedDate: Date;

  @Column({
    type: DataType.DATE,
  })
  effectiveDate: Date;

  @Column({
    type: DataType.DATE,
  })
  expirationDate: Date;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  tags: string[];

  @Column({
    type: DataType.JSONB,
  })
  metadata: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isLatestRevision: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  requiresAcknowledgment: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(RetentionPeriod)),
    defaultValue: RetentionPeriod.SEVEN_YEARS,
  })
  retentionPeriod: RetentionPeriod;

  @HasMany(() => DocumentRevision, 'documentId')
  revisions: DocumentRevision[];

  @HasMany(() => DocumentDistribution, 'documentId')
  distributions: DocumentDistribution[];
}
