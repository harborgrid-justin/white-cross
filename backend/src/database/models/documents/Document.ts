import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from '../../types/enums';

/**
 * Document Model
 * Manages all healthcare-related documents including medical records,
 * consent forms, policies, and administrative documents with version control
 */

interface DocumentAttributes {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  version: number;
  status: DocumentStatus;
  tags: string[];
  isTemplate: boolean;
  templateData?: any;
  parentId?: string;
  retentionDate?: Date;
  accessLevel: DocumentAccessLevel;
  uploadedBy: string;
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentCreationAttributes
  extends Optional<
    DocumentAttributes,
    | 'id'
    | 'description'
    | 'version'
    | 'status'
    | 'tags'
    | 'isTemplate'
    | 'templateData'
    | 'parentId'
    | 'retentionDate'
    | 'accessLevel'
    | 'studentId'
    | 'createdAt'
    | 'updatedAt'
  > {}

export class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public category!: DocumentCategory;
  public fileType!: string;
  public fileName!: string;
  public fileSize!: number;
  public fileUrl!: string;
  public version!: number;
  public status!: DocumentStatus;
  public tags!: string[];
  public isTemplate!: boolean;
  public templateData?: any;
  public parentId?: string;
  public retentionDate?: Date;
  public accessLevel!: DocumentAccessLevel;
  public uploadedBy!: string;
  public studentId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(DocumentCategory)),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DocumentStatus)),
      allowNull: false,
      defaultValue: DocumentStatus.DRAFT,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    templateData: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    retentionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accessLevel: {
      type: DataTypes.ENUM(...Object.values(DocumentAccessLevel)),
      allowNull: false,
      defaultValue: DocumentAccessLevel.STAFF_ONLY,
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    indexes: [
      { fields: ['category', 'status'] },
      { fields: ['studentId'] },
      { fields: ['createdAt'] },
      { fields: ['uploadedBy'] },
      { fields: ['parentId'] },
      { fields: ['retentionDate'] },
      { fields: ['isTemplate'] },
    ],
  }
);
