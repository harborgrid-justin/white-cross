/**
 * GraphQL DTOs for Alert type
 *
 * Defines GraphQL object types for real-time alerts and notifications.
 */
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

/**
 * Alert Type Enum
 */
export enum AlertType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
  EMERGENCY = 'EMERGENCY',
}

// Register enum with GraphQL
registerEnumType(AlertType, {
  name: 'AlertType',
  description: 'Type of alert notification',
});

/**
 * Alert GraphQL Object Type
 */
@ObjectType()
export class AlertDto {
  @Field(() => ID)
  id: string;

  @Field(() => AlertType)
  type: AlertType;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  studentId?: string;

  @Field(() => ID, { nullable: true })
  recipientId?: string;

  @Field({ nullable: true })
  recipientRole?: string;

  @Field({ nullable: true })
  actionUrl?: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  expiresAt?: Date;
}
