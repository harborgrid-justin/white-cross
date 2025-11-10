
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
import { RelationshipType, DurationType } from '../types/schedule.types';

@Table({
  tableName: 'activity_relationships',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['predecessorActivityId'] },
    { fields: ['successorActivityId'] },
    { fields: ['relationshipType'] },
    { fields: ['projectId', 'predecessorActivityId'] },
    { fields: ['projectId', 'successorActivityId'] },
    { fields: ['predecessorActivityId', 'successorActivityId'], unique: true },
  ],
})
export class ActivityRelationship extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  predecessorActivityId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  successorActivityId: string;

  @AllowNull(false)
  @Default(RelationshipType.FS)
  @Column({
    type: DataType.ENUM(...Object.values(RelationshipType)),
  })
  relationshipType: RelationshipType;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  lagDays: number;

  @AllowNull(false)
  @Default(DurationType.WORKING_DAYS)
  @Column({
    type: DataType.ENUM(...Object.values(DurationType)),
  })
  lagType: DurationType;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isDriving: boolean;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
