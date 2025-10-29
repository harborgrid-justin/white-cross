/**
 * @fileoverview Notification GraphQL Subscriptions
 *
 * GraphQL subscriptions for real-time notifications
 *
 * @module graphql/subscriptions/notification
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import { NOTIFICATION_FRAGMENT } from '../fragments';

/**
 * Subscribe to user notifications
 */
export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNotification($userId: ID!) {
    notificationReceived(userId: $userId) {
      ...Notification
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

/**
 * Subscribe to system notifications
 */
export const SYSTEM_NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnSystemNotification {
    systemNotificationReceived {
      ...Notification
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

/**
 * Subscribe to emergency alerts
 */
export const EMERGENCY_ALERT_SUBSCRIPTION = gql`
  subscription OnEmergencyAlert {
    emergencyAlertReceived {
      id
      type
      severity
      title
      message
      studentId
      student {
        id
        fullName
        grade
      }
      createdAt
    }
  }
`;
