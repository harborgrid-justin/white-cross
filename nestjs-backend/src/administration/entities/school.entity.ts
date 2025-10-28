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

/**
 * School Entity
 *
 * Represents a school within a district
 */
@Entity('schools')
@Index(['code'])
@Index(['districtId'])
@Index(['isActive'])
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column('uuid')
  districtId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 2, nullable: true })
  state: string;

  @Column({ length: 10, nullable: true })
  zipCode: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 200, nullable: true })
  principal: string;

  @Column({ type: 'integer', nullable: true })
  totalEnrollment: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => District, (district) => district.schools)
  @JoinColumn({ name: 'districtId' })
  district: District;
}
