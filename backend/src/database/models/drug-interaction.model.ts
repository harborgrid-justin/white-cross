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
  Scopes,
  BeforeCreate,
  BeforeUpdate,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'drug_interactions',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['drug1Id', 'drug2Id'],
      unique: true,
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_drug_interaction_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_drug_interaction_updated_at',
    },
  ],
})
export class DrugInteraction
  extends Model<DrugInteractionAttributes>
  implements DrugInteractionAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./drug-catalog.model').DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  drug1Id: string;

  @ForeignKey(() => require('./drug-catalog.model').DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  drug2Id: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(InteractionSeverity)],
    },
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
  })
  evidenceLevel?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./drug-catalog.model').DrugCatalog, {
    foreignKey: 'drug1Id',
    as: 'drug1',
  })
  drug1?: any;

  @BelongsTo(() => require('./drug-catalog.model').DrugCatalog, {
    foreignKey: 'drug2Id',
    as: 'drug2',
  })
  drug2?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: DrugInteraction) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] DrugInteraction ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
