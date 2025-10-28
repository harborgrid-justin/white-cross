import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { TrainingCategory } from '../enums/administration.enums';

/**
 * TrainingModule Entity
 *
 * Represents training modules for staff education and compliance
 */
@Entity('training_modules')
@Index(['category'])
@Index(['isRequired'])
@Index(['order'])
export class TrainingModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'integer', nullable: true })
  duration: number;

  @Column({
    type: 'enum',
    enum: TrainingCategory,
  })
  category: TrainingCategory;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ type: 'integer', default: 0 })
  order: number;

  @Column({ type: 'jsonb', nullable: true })
  attachments: string[];

  @Column({ type: 'integer', default: 0 })
  completionCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
