/**
 * @fileoverview Email DTOs and Interfaces
 * @module infrastructure/email/dto
 * @description Data transfer objects and interfaces for email operations
 */

import { AlertSeverity, AlertCategory } from '../../../alerts/alerts.service';

/**
 * Alert email data structure
 * Used for sending alert notifications via email
 */
export interface AlertEmailData {
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  alertId: string;
}

/**
 * Generic email data structure
 * Used for sending general-purpose emails
 */
export interface GenericEmailData {
  subject: string;
  body: string;
  html?: string;
}

/**
 * Email delivery result
 * Returned after email send operations
 */
export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
