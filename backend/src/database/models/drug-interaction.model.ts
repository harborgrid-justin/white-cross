import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  BeforeCreate,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { DrugCatalog } from './drug-catalog.model';

export enum InteractionSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  SEVERE = 'SEVERE',
  CONTRAINDICATED = 'CONTRAINDICATED',
}

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
}

@Table({
  tableName: 'drug_interactions',
  timestamps: true,
  indexes: [
    {
      fields: ['drug1Id', 'drug2Id'],
      unique: true,
    },
    {
      fields: ['drug1Id'],
    },
    {
      fields: ['drug2Id'],
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

  @ForeignKey(() => DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  drug1Id: string;

  @ForeignKey(() => DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  drug2Id: string;

  @Column({
    type: DataType.ENUM(...Object.values(InteractionSeverity)),
    allowNull: false,
  })
  severity: InteractionSeverity;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column(DataType.TEXT)
  clinicalEffects?: string;

  @Column(DataType.TEXT)
  management?: string;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  references?: string[];

  @Column(DataType.STRING(50))
  evidenceLevel?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  // Relationships
  @BelongsTo(() => DrugCatalog, 'drug1Id')
  drug1?: DrugCatalog;

  @BelongsTo(() => DrugCatalog, 'drug2Id')
  drug2?: DrugCatalog;
}
