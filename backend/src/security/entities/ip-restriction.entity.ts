import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { IpRestrictionType } from '../enums';

/**
 * IP Restriction Entity
 * Manages IP whitelisting, blacklisting, and geolocation-based access control
 */
@Entity('ip_restrictions')
@Index(['type', 'isActive'])
@Index(['ipAddress'])
export class IpRestrictionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: IpRestrictionType,
  })
  type: IpRestrictionType;

  @Column({ nullable: true })
  ipAddress?: string; // Single IP or CIDR notation (e.g., "192.168.1.0/24")

  @Column({ type: 'json', nullable: true })
  ipRange?: { start: string; end: string };

  @Column({ type: 'simple-array', nullable: true })
  countries?: string[]; // ISO country codes for geo restrictions

  @Column({ type: 'text' })
  reason: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ default: true })
  isActive: boolean;
}
