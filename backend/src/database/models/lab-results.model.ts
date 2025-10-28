import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface LabResultsAttributes {
  id?: string;
  studentId: string;
  testType: string; // blood_test, urinalysis, culture, etc.
  testName: string;
  testCode?: string; // LOINC code
  orderedDate: Date;
  collectionDate?: Date;
  resultDate?: Date;
  result: string;
  resultValue?: number;
  resultUnit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  abnormalFlags?: string[]; // high, low, critical, etc.
  interpretation?: string;
  status: string; // pending, completed, reviewed, cancelled
  orderedBy?: string;
  performedBy?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  labName?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'lab_results',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['testType'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['isAbnormal'],
    },
    {
      fields: ['orderedDate'],
    },
    {
      fields: ['resultDate'],
    },
  ],
})
export class LabResults extends Model<LabResultsAttributes> implements LabResultsAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.ENUM('blood_test', 'urinalysis', 'culture', 'chemistry', 'hematology', 'microbiology', 'other'),
    allowNull: false,
  })
  testType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  testName: string;

  @Column(DataType.STRING)
  testCode?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  orderedDate: Date;

  @Column(DataType.DATE)
  collectionDate?: Date;

  @Column(DataType.DATE)
  resultDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  result: string;

  @Column(DataType.FLOAT)
  resultValue?: number;

  @Column(DataType.STRING)
  resultUnit?: string;

  @Column(DataType.STRING)
  referenceRange?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAbnormal: boolean;

  @Column(DataType.JSON)
  abnormalFlags?: string[];

  @Column(DataType.TEXT)
  interpretation?: string;

  @Default('pending')
  @Column(DataType.ENUM('pending', 'completed', 'reviewed', 'cancelled'))
  status: string;

  @Column(DataType.STRING)
  orderedBy?: string;

  @Column(DataType.STRING)
  performedBy?: string;

  @Column(DataType.STRING)
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewedDate?: Date;

  @Column(DataType.STRING)
  labName?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @BeforeCreate
  @BeforeUpdate
  static async checkAbnormalResults(instance: LabResults) {
    const abnormalFlags: string[] = [];

    // Check for abnormal numeric results
    if (instance.resultValue !== undefined && instance.referenceRange) {
      // Simple check - in a real system this would parse reference ranges properly
      const value = instance.resultValue;
      const range = instance.referenceRange;

      // Basic parsing for ranges like "10-20" or "< 5" or "> 100"
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(r => parseFloat(r.trim()));
        if (!isNaN(min) && !isNaN(max)) {
          if (value < min) abnormalFlags.push('low');
          if (value > max) abnormalFlags.push('high');
        }
      } else if (range.startsWith('<')) {
        const max = parseFloat(range.substring(1).trim());
        if (!isNaN(max) && value >= max) abnormalFlags.push('high');
      } else if (range.startsWith('>')) {
        const min = parseFloat(range.substring(1).trim());
        if (!isNaN(min) && value <= min) abnormalFlags.push('low');
      }
    }

    // Check for critical values (would need domain-specific logic)
    if (instance.resultValue !== undefined) {
      // Example critical value checks
      if (instance.testName.toLowerCase().includes('glucose') && instance.resultValue > 500) {
        abnormalFlags.push('critical_high');
      }
      if (instance.testName.toLowerCase().includes('potassium') && (instance.resultValue < 3.0 || instance.resultValue > 6.0)) {
        abnormalFlags.push('critical');
      }
    }

    instance.abnormalFlags = abnormalFlags;
    instance.isAbnormal = abnormalFlags.length > 0;
  }
}
