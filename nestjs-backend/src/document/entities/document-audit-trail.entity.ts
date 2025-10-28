import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { Document } from './document.entity';

@Table({ tableName: 'document_audit_trails', timestamps: true, updatedAt: false })
export class DocumentAuditTrail extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  action: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  @Index
  performedBy: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  changes?: any;

  @Column({ type: DataType.STRING(45), allowNull: true })
  ipAddress?: string;

  @CreatedAt
  createdAt: Date;

  @BelongsTo(() => Document)
  document: Document;
}
