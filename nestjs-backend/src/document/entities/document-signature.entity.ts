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

@Table({ tableName: 'document_signatures', timestamps: true, updatedAt: false })
export class DocumentSignature extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  @Index
  signedBy: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  signedByRole: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  signatureData?: string;

  @Column({ type: DataType.STRING(45), allowNull: true })
  ipAddress?: string;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: false, field: 'signed_at' })
  signedAt: Date;

  @BelongsTo(() => Document)
  document: Document;
}
