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
import { WitnessType } from '../enums';
import { IncidentReport } from './incident-report.entity';

@Entity('witness_statements')
@Index(['incidentReportId', 'verified'])
export class WitnessStatement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'incident_report_id', type: 'uuid' })
  @Index()
  incidentReportId: string;

  @Column({ name: 'witness_name', type: 'varchar', length: 255 })
  witnessName: string;

  @Column({
    name: 'witness_type',
    type: 'enum',
    enum: WitnessType,
  })
  witnessType: WitnessType;

  @Column({ name: 'witness_contact', type: 'varchar', length: 255, nullable: true })
  witnessContact: string;

  @Column({ type: 'text' })
  statement: string;

  @Column({ type: 'boolean', default: false })
  @Index()
  verified: boolean;

  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IncidentReport)
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'verified_by' })
  // verifiedByUser: User;
}
