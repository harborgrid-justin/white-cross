import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  IncidentType,
  IncidentSeverity,
  InsuranceClaimStatus,
  ComplianceStatus,
} from '../enums';

@Entity('incident_reports')
@Index(['studentId', 'occurredAt'])
@Index(['reportedById', 'occurredAt'])
@Index(['type', 'severity'])
export class IncidentReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'reported_by_id', type: 'uuid' })
  @Index()
  reportedById: string;

  @Column({
    type: 'enum',
    enum: IncidentType,
  })
  @Index()
  type: IncidentType;

  @Column({
    type: 'enum',
    enum: IncidentSeverity,
  })
  @Index()
  severity: IncidentSeverity;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'simple-array', nullable: true })
  witnesses: string[];

  @Column({ name: 'actions_taken', type: 'text' })
  actionsTaken: string;

  @Column({ name: 'occurred_at', type: 'timestamp' })
  @Index()
  occurredAt: Date;

  @Column({ name: 'parent_notified', type: 'boolean', default: false })
  @Index()
  parentNotified: boolean;

  @Column({ name: 'parent_notification_method', type: 'varchar', length: 100, nullable: true })
  parentNotificationMethod: string;

  @Column({ name: 'parent_notified_at', type: 'timestamp', nullable: true })
  parentNotifiedAt: Date;

  @Column({ name: 'follow_up_required', type: 'boolean', default: false })
  @Index()
  followUpRequired: boolean;

  @Column({ name: 'follow_up_notes', type: 'text', nullable: true })
  followUpNotes: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @Column({ name: 'evidence_photos', type: 'simple-array', nullable: true })
  evidencePhotos: string[];

  @Column({ name: 'evidence_videos', type: 'simple-array', nullable: true })
  evidenceVideos: string[];

  @Column({ name: 'insurance_claim_number', type: 'varchar', length: 100, nullable: true })
  insuranceClaimNumber: string;

  @Column({
    name: 'insurance_claim_status',
    type: 'enum',
    enum: InsuranceClaimStatus,
    nullable: true,
  })
  insuranceClaimStatus: InsuranceClaimStatus;

  @Column({
    name: 'legal_compliance_status',
    type: 'enum',
    enum: ComplianceStatus,
    nullable: true,
  })
  legalComplianceStatus: ComplianceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations will be added when Student and User entities are available
  // @ManyToOne(() => Student, (student) => student.incidentReports)
  // @JoinColumn({ name: 'student_id' })
  // student: Student;

  // @ManyToOne(() => User, (user) => user.reportedIncidents)
  // @JoinColumn({ name: 'reported_by_id' })
  // reportedBy: User;

  // @OneToMany(() => FollowUpAction, (action) => action.incidentReport)
  // followUpActions: FollowUpAction[];

  // @OneToMany(() => WitnessStatement, (statement) => statement.incidentReport)
  // witnessStatements: WitnessStatement[];
}
