import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PolicyDocument } from './policy-document.entity';

@Entity('policy_acknowledgments')
@Unique(['policyId', 'userId'])
export class PolicyAcknowledgment {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Associated policy document ID' })
  @Column({ type: 'varchar' })
  policyId: string;

  @ApiProperty({ description: 'User who acknowledged the policy' })
  @Column({ type: 'varchar' })
  userId: string;

  @ApiProperty({ description: 'When the policy was acknowledged' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  acknowledgedAt: Date;

  @ApiProperty({ description: 'IP address from which acknowledgment was made', required: false })
  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string;

  @ManyToOne(() => PolicyDocument, policy => policy.acknowledgments)
  @JoinColumn({ name: 'policyId' })
  policy: PolicyDocument;
}
