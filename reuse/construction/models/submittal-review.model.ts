
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
} from 'sequelize-typescript';
import { ReviewAction } from '../types/submittal.types';
import { ConstructionSubmittal } from './construction-submittal.model';

@Table({
  tableName: 'submittal_reviews',
  timestamps: true,
  indexes: [
    { fields: ['submittalId'] },
    { fields: ['reviewerId'] },
    { fields: ['reviewDate'] },
    { fields: ['action'] },
    { fields: ['isLatest'] },
    { fields: ['submittalId', 'reviewStepNumber'] },
  ],
})
export class SubmittalReview extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionSubmittal)
  @AllowNull(false)
  @Column(DataType.UUID)
  submittalId: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  reviewerId: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  reviewerName: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  reviewerEmail: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  reviewerRole: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  reviewDate: Date;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ReviewAction)),
  })
  action: ReviewAction;

  @AllowNull(false)
  @Column(DataType.TEXT)
  comments: string;

  @Column(DataType.TEXT)
  privateNotes?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  markupUrls: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  deficiencies: string[];

  @Column(DataType.STRING(200))
  nextAction?: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  daysToReview: number;

  @Column(DataType.TEXT)
  signature?: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isLatest: boolean;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  reviewStepNumber: number;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
