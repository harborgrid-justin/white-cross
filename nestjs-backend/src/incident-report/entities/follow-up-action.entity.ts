import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ActionStatus, ActionPriority } from '../enums';
import { IncidentReport } from './incident-report.entity';

@Entity('follow_up_actions')
@Index(['incidentReportId', 'status'])
@Index(['assignedTo', 'status'])
@Index(['dueDate', 'status'])
export class FollowUpAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'incident_report_id', type: 'uuid' })
  @Index()
  incidentReportId: string;

  @Column({ type: 'text' })
  action: string;

  @Column({ name: 'due_date', type: 'timestamp' })
  @Index()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ActionPriority,
  })
  @Index()
  priority: ActionPriority;

  @Column({
    type: 'enum',
    enum: ActionStatus,
    default: ActionStatus.PENDING,
  })
  @Index()
  status: ActionStatus;

  @Column({ name: 'assigned_to', type: 'uuid', nullable: true })
  @Index()
  assignedTo: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'completed_by', type: 'uuid', nullable: true })
  completedBy: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IncidentReport)
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'assigned_to' })
  // assignedToUser: User;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'completed_by' })
  // completedByUser: User;
}
