
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { RevisionType } from '../types/document.types';
import { ConstructionDocument } from './construction-document.model';

@Table({ tableName: 'document_revisions', timestamps: true })
export class DocumentRevision extends Model {
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
    type: DataType.STRING(50),
    allowNull: false,
  })
  revisionNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(RevisionType)),
    allowNull: false,
  })
  revisionType: RevisionType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  fileUrl: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  revisionDate: Date;

  @Column({
    type: DataType.JSONB,
  })
  changes: Array<{
    section: string;
    description: string;
    reason: string;
  }>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  superseded: boolean;

  @Column({
    type: DataType.DATE,
  })
  supersededDate: Date;

  @BelongsTo(() => ConstructionDocument)
  document: ConstructionDocument;
}
