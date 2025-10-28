import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { DocumentSignature } from './document-signature.entity';
import { DocumentAuditTrail } from './document-audit-trail.entity';

@Table({ tableName: 'documents', timestamps: true, paranoid: true })
export class Document extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  @Index
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  category: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  fileType: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  fileName: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  fileSize: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  fileUrl: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  @Index
  uploadedBy: string;

  @Column({ type: DataType.UUID, allowNull: true })
  studentId?: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true, defaultValue: [] })
  tags?: string[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isTemplate: boolean;

  @Column({ type: DataType.JSONB, allowNull: true })
  templateData?: any;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'DRAFT' })
  @Index
  status: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  version: number;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'STAFF_ONLY' })
  accessLevel: string;

  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: true })
  parentId?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  retentionDate?: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  containsPHI: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  lastAccessedAt?: Date;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  accessCount: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @BelongsTo(() => Document, 'parentId')
  parent?: Document;

  @HasMany(() => Document, 'parentId')
  versions?: Document[];

  @HasMany(() => DocumentSignature, 'documentId')
  signatures?: DocumentSignature[];

  @HasMany(() => DocumentAuditTrail, 'documentId')
  auditTrail?: DocumentAuditTrail[];
}
