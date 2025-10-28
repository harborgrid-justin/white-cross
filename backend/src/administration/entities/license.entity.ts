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
import { District } from './district.entity';
import { LicenseType, LicenseStatus } from '../enums/administration.enums';

/**
 * License Entity
 *
 * Represents a software license issued to a district
 */
@Entity('licenses')
@Index(['licenseKey'])
@Index(['status'])
export class License {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  licenseKey: string;

  @Column({
    type: 'enum',
    enum: LicenseType,
    default: LicenseType.TRIAL,
  })
  type: LicenseType;

  @Column({
    type: 'enum',
    enum: LicenseStatus,
    default: LicenseStatus.ACTIVE,
  })
  status: LicenseStatus;

  @Column({ type: 'integer', nullable: true })
  maxUsers: number;

  @Column({ type: 'integer', nullable: true })
  maxSchools: number;

  @Column({ type: 'jsonb' })
  features: string[];

  @Column({ length: 255, nullable: true })
  issuedTo: string;

  @Column({ type: 'uuid', nullable: true })
  districtId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deactivatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => District, (district) => district.licenses, { nullable: true })
  @JoinColumn({ name: 'districtId' })
  district: District;
}
