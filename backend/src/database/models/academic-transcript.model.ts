import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';

/**
 * Subject Grade Interface
 */
export interface SubjectGrade {
  subjectName: string;
  subjectCode: string;
  grade: string;
  percentage: number;
  credits: number;
  teacher?: string;
}

/**
 * Attendance Record Interface
 */
export interface AttendanceRecord {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  tardyDays: number;
  attendanceRate: number;
}

/**
 * Behavior Record Interface
 */
export interface BehaviorRecord {
  conductGrade: string;
  incidents: number;
  commendations: number;
  notes?: string;
}

/**
 * Academic Transcript Attributes
 */
export interface AcademicTranscriptAttributes {
  id: string;
  studentId: string;
  academicYear: string;
  semester: string;
  grade: string;
  gpa: number;
  subjects: SubjectGrade[];
  attendance: AttendanceRecord;
  behavior: BehaviorRecord;
  importedBy?: string;
  importedAt?: Date;
  importSource?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Academic Transcript Model
 *
 * Stores academic records for students including grades, GPA, attendance, and behavior.
 * Integrated with Student Information Systems (SIS) for data import.
 *
 * Features:
 * - Comprehensive academic history tracking
 * - GPA calculation and tracking
 * - Attendance monitoring
 * - Behavior tracking
 * - SIS integration support
 *
 * Indexes:
 * - studentId for quick student lookup
 * - academicYear for year-based queries
 * - Composite index on (studentId, academicYear, semester) for unique constraints
 */
@Table({
  tableName: 'academic_transcripts',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id'],
      name: 'academic_transcripts_student_id_idx',
    },
    {
      fields: ['academic_year'],
      name: 'academic_transcripts_academic_year_idx',
    },
    {
      fields: ['student_id', 'academic_year', 'semester'],
      unique: true,
      name: 'academic_transcripts_student_year_semester_unique',
    },
    {
      fields: ['gpa'],
      name: 'academic_transcripts_gpa_idx',
    },
    {
      fields: ['imported_by'],
      name: 'academic_transcripts_imported_by_idx',
    },
  ],
})
export class AcademicTranscript extends Model<AcademicTranscriptAttributes> implements AcademicTranscriptAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Student reference
   */
  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  studentId: string;

  /**
   * Academic year (e.g., "2024-2025")
   */
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'academic_year',
  })
  academicYear: string;

  /**
   * Semester/Term (e.g., "Fall", "Spring", "Q1", "Q2")
   */
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  semester: string;

  /**
   * Grade level during this period (e.g., "9", "10", "11", "12")
   */
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  grade: string;

  /**
   * Grade Point Average for this period
   */
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  gpa: number;

  /**
   * Subject grades as JSON array
   */
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  subjects: SubjectGrade[];

  /**
   * Attendance record for this period
   */
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      tardyDays: 0,
      attendanceRate: 0,
    },
  })
  attendance: AttendanceRecord;

  /**
   * Behavior record for this period
   */
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {
      conductGrade: 'N/A',
      incidents: 0,
      commendations: 0,
    },
  })
  behavior: BehaviorRecord;

  /**
   * User who imported this record
   */
  @Column({
    type: DataType.UUID,
    field: 'imported_by',
  })
  importedBy?: string;

  /**
   * When this record was imported
   */
  @Column({
    type: DataType.DATE,
    field: 'imported_at',
  })
  importedAt?: Date;

  /**
   * Source system for import (e.g., "PowerSchool", "SIS", "Manual")
   */
  @Column({
    type: DataType.STRING(100),
    field: 'import_source',
  })
  importSource?: string;

  /**
   * Additional metadata
   */
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => Student)
  student?: Student;

  /**
   * Get total credits for this period
   */
  getTotalCredits(): number {
    return this.subjects.reduce((total, subject) => total + subject.credits, 0);
  }

  /**
   * Get honor roll status based on GPA
   */
  getHonorRollStatus(): 'High Honors' | 'Honors' | 'None' {
    if (this.gpa >= 3.75) return 'High Honors';
    if (this.gpa >= 3.25) return 'Honors';
    return 'None';
  }

  /**
   * Check if student is at risk (low GPA or poor attendance)
   */
  isAtRisk(): boolean {
    return this.gpa < 2.0 || this.attendance.attendanceRate < 90;
  }

  /**
   * Get subject by subject code
   */
  getSubject(subjectCode: string): SubjectGrade | undefined {
    return this.subjects.find(s => s.subjectCode === subjectCode);
  }
}
