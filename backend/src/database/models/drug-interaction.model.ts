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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;
import { InteractionSeverity } from '../../clinical/enums/interaction-severity.enum';

export interface DrugInteractionAttributes {
  id: string;
  drug1Id: string;
  drug2Id: string;
  severity: InteractionSeverity;
  description: string;
  clinicalEffects?: string;
  management?: string;
  references?: string[];
  evidenceLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
  drug1?: any;
  drug2?: any;
}

@Table({
  tableName: 'drug_interactions',
  timestamps: true,
  indexes: [
    {
      fields: ['drug1_id', 'drug2_id'],
      unique: true,
    },
    {
      fields: ['severity'],
    },
  ],
})
export class DrugInteraction extends Model<DrugInteractionAttributes> implements DrugInteractionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./drug-catalog.model').DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'drug1_id',
  })
  @Index
  drug1Id: string;

  @ForeignKey(() => require('./drug-catalog.model').DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'drug2_id',
  })
  @Index
  drug2Id: string;

  @Column({
    type: DataType.ENUM(...(Object.values(InteractionSeverity) as string[])),
    allowNull: false,
  })
  @Index
  severity: InteractionSeverity;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'clinical_effects',
  })
  clinicalEffects?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  management?: string;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  references?: string[];

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    field: 'evidence_level',
  })
  evidenceLevel?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./drug-catalog.model').DrugCatalog, { foreignKey: 'drug1Id', as: 'drug1' })
  drug1?: any;

  @BelongsTo(() => require('./drug-catalog.model').DrugCatalog, { foreignKey: 'drug2Id', as: 'drug2' })
  drug2?: any;
}
