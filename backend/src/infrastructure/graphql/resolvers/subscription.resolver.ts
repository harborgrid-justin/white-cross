/**
 * Subscription Resolver
 *
 * Implements real-time GraphQL subscriptions for:
 * - Health record updates
 * - Alert notifications
 * - Student updates
 * - Vitals monitoring
 *
 * Features:
 * - Redis-backed PubSub for scalability
 * - Authenticated subscriptions
 * - Role-based filtering
 * - Student-specific subscriptions
 *
 * Security:
 * - All subscriptions require authentication
 * - Filter events by user permissions
 * - Audit logging for PHI access
 *
 * @example
 * ```graphql
 * subscription OnHealthRecordCreated($studentId: ID!) {
 *   healthRecordCreated(studentId: $studentId) {
 *     id
 *     title
 *     recordDate
 *   }
 * }
 * ```
 */
import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { GqlAuthGuard, GqlRolesGuard } from '../guards';
import { Roles } from '@/services/auth';
import { UserRole } from '@/database';
import { AlertDto, HealthRecordDto, StudentDto, VitalsDto } from '../dto';


/**
 * Subscription payload type
 */
interface SubscriptionPayload {
  [key: string]: unknown;
}

/**
 * Subscription event names
 * Centralized constants for PubSub topics
 */
export enum SubscriptionEvent {
  HEALTH_RECORD_CREATED = 'HEALTH_RECORD_CREATED',
  HEALTH_RECORD_UPDATED = 'HEALTH_RECORD_UPDATED',
  STUDENT_UPDATED = 'STUDENT_UPDATED',
  ALERT_CREATED = 'ALERT_CREATED',
  CRITICAL_ALERT = 'CRITICAL_ALERT',
  VITALS_UPDATED = 'VITALS_UPDATED',
}

/**
 * Subscription Resolver
 * Handles all real-time GraphQL subscriptions
 */
@Resolver()
export class SubscriptionResolver {
  constructor(@Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  /**
   * Subscription: Health record created
   *
   * Notifies when a new health record is created.
   * Can be filtered by student ID.
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE
   */
  @Subscription(() => HealthRecordDto, {
    name: 'healthRecordCreated',
    filter: (payload, variables, context) => {
      // Security: Only authenticated users
      if (!context.user) return false;

      // Filter by student ID if provided
      if (variables.studentId) {
        return payload.healthRecordCreated.studentId === variables.studentId;
      }

      // Additional role-based filtering can be added here
      // For example, nurses only see records for their assigned students

      return true;
    },
    resolve: (payload) => {
      // Log PHI access for HIPAA compliance
      console.log('SUBSCRIPTION: Health record accessed', {
        recordId: payload.healthRecordCreated.id,
        studentId: payload.healthRecordCreated.studentId,
        timestamp: new Date().toISOString(),
      });

      return payload.healthRecordCreated;
    },
  })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  healthRecordCreated(
    @Args('studentId', { type: () => ID, nullable: true }) studentId?: string,
  ) {
    return this.pubSub.asyncIterator(SubscriptionEvent.HEALTH_RECORD_CREATED);
  }

  /**
   * Subscription: Health record updated
   *
   * Notifies when an existing health record is updated.
   * Can be filtered by student ID.
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE
   */
  @Subscription(() => HealthRecordDto, {
    name: 'healthRecordUpdated',
    filter: (payload, variables, context) => {
      if (!context.user) return false;

      if (variables.studentId) {
        return payload.healthRecordUpdated.studentId === variables.studentId;
      }

      return true;
    },
    resolve: (payload) => {
      console.log('SUBSCRIPTION: Health record update accessed', {
        recordId: payload.healthRecordUpdated.id,
        timestamp: new Date().toISOString(),
      });

      return payload.healthRecordUpdated;
    },
  })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  healthRecordUpdated(
    @Args('studentId', { type: () => ID, nullable: true }) studentId?: string,
  ) {
    return this.pubSub.asyncIterator(SubscriptionEvent.HEALTH_RECORD_UPDATED);
  }

  /**
   * Subscription: Student updated
   *
   * Notifies when student information is updated.
   * Useful for keeping dashboards in sync.
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Subscription(() => StudentDto, {
    name: 'studentUpdated',
    filter: (payload, variables, context) => {
      if (!context.user) return false;

      // Filter by specific student ID
      if (variables.studentId) {
        return payload.studentUpdated.id === variables.studentId;
      }

      // Nurses only see updates for their assigned students
      if (context.user.role === UserRole.NURSE) {
        return payload.studentUpdated.nurseId === context.user.id;
      }

      return true;
    },
  })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  studentUpdated(
    @Args('studentId', { type: () => ID, nullable: true }) studentId?: string,
  ) {
    return this.pubSub.asyncIterator(SubscriptionEvent.STUDENT_UPDATED);
  }

  /**
   * Subscription: Alert created
   *
   * Notifies users of new alerts relevant to them.
   * Alerts are filtered by recipient ID or role.
   *
   * Access: All authenticated users
   */
  @Subscription(() => AlertDto, {
    name: 'alertCreated',
    filter: (payload, variables, context) => {
      if (!context.user) return false;

      const alert = payload.alertCreated;

      // Send to specific recipient
      if (alert.recipientId === context.user.id) {
        return true;
      }

      // Send to all users with matching role
      if (alert.recipientRole === context.user.role) {
        return true;
      }

      // Broadcast alerts (no specific recipient)
      return !alert.recipientId && !alert.recipientRole;


    },
  })
  @UseGuards(GqlAuthGuard)
  alertCreated() {
    return this.pubSub.asyncIterator(SubscriptionEvent.ALERT_CREATED);
  }

  /**
   * Subscription: Critical alert
   *
   * Broadcasts critical alerts to all authorized medical staff.
   * Used for emergency situations requiring immediate attention.
   *
   * Access: ADMIN, NURSE only
   */
  @Subscription(() => AlertDto, {
    name: 'criticalAlert',
    filter: (payload, variables, context) => {
      // Only send to nurses and admins
      return (
        context.user &&
        [UserRole.ADMIN, UserRole.NURSE].includes(context.user.role)
      );
    },
    resolve: (payload) => {
      console.warn('CRITICAL ALERT broadcast:', {
        alertId: payload.criticalAlert.id,
        type: payload.criticalAlert.type,
        timestamp: new Date().toISOString(),
      });

      return payload.criticalAlert;
    },
  })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  criticalAlert() {
    return this.pubSub.asyncIterator(SubscriptionEvent.CRITICAL_ALERT);
  }

  /**
   * Subscription: Vitals updated
   *
   * Real-time monitoring of student vital signs.
   * Useful for continuous health monitoring during school day.
   *
   * Access: ADMIN, NURSE
   */
  @Subscription(() => VitalsDto, {
    name: 'vitalsUpdated',
    filter: (payload, variables, context) => {
      if (!context.user) return false;

      // Must specify student ID
      if (!variables.studentId) return false;

      // Check if this is the correct student
      return payload.vitalsUpdated.studentId === variables.studentId;
    },
    resolve: (payload) => {
      // Log vitals access for audit trail
      console.log('SUBSCRIPTION: Vitals accessed', {
        studentId: payload.vitalsUpdated.studentId,
        timestamp: new Date().toISOString(),
      });

      return payload.vitalsUpdated;
    },
  })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  vitalsUpdated(@Args('studentId', { type: () => ID }) studentId: string) {
    return this.pubSub.asyncIterator(
      `${SubscriptionEvent.VITALS_UPDATED}_${studentId}`,
    );
  }
}

/**
 * Helper: Publish event to PubSub
 *
 * Use this in services to trigger subscriptions.
 *
 * @example
 * ```typescript
 * // In HealthRecordService
 * await publishSubscriptionEvent(
 *   this.pubSub,
 *   SubscriptionEvent.HEALTH_RECORD_CREATED,
 *   { healthRecordCreated: newRecord }
 * );
 * ```
 */
export async function publishSubscriptionEvent(
  pubSub: RedisPubSub,
  event: SubscriptionEvent,
  payload: SubscriptionPayload,
): Promise<void> {
  try {
    await pubSub.publish(event, payload);
    console.log(`Published subscription event: ${event}`);
  } catch (error) {
    console.error(`Failed to publish subscription event: ${event}`, error);
  }
}
