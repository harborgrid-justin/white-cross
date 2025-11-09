/**
 * Multi-Channel Notification Infrastructure
 *
 * @module infrastructure/notifications
 * @description Email, SMS, and push notification services with template rendering and delivery tracking
 *
 * @category Infrastructure
 * @subcategory Notifications
 *
 * @example Basic Email
 * ```typescript
 * import * as Notifications from '@white-cross/reuse/infrastructure/notifications';
 *
 * // All notification functions are available
 * await Notifications.sendEmailViaSendGrid({...});
 * await Notifications.sendSMSViaTwilio({...});
 * ```
 *
 * @example Direct Imports
 * ```typescript
 * import { NotificationService } from '@white-cross/reuse/infrastructure/notifications';
 *
 * const service = new NotificationService();
 * await service.sendEmail({...});
 * ```
 */
export * from '../../notification-kit.prod';
/**
 * Available Kits
 * ==============
 * - notification-kit.prod.ts (Primary - 62 exports)
 * - email-notification-kit-v2.ts (Legacy - has overlaps)
 * - email-notifications-kit.ts (Legacy - has overlaps)
 *
 * Use the production kit for all new code.
 */
/**
 * Quick Reference
 * ===============
 *
 * **Send Email (SendGrid)**:
 * ```typescript
 * await sendEmail({
 *   to: 'user@example.com',
 *   from: 'noreply@app.com',
 *   subject: 'Welcome',
 *   html: '<h1>Welcome!</h1>',
 *   provider: 'sendgrid',
 *   trackOpens: true,
 *   trackClicks: true
 * });
 * ```
 *
 * **Send SMS (Twilio)**:
 * ```typescript
 * await sendSMS({
 *   to: '+1234567890',
 *   from: '+0987654321',
 *   message: 'Your code is 123456',
 *   provider: 'twilio'
 * });
 * ```
 *
 * **Send Push (FCM)**:
 * ```typescript
 * await sendPush({
 *   token: deviceToken,
 *   title: 'New Message',
 *   body: 'You have a new message',
 *   data: { messageId: '123' },
 *   provider: 'fcm'
 * });
 * ```
 *
 * **Templated Email**:
 * ```typescript
 * await sendTemplatedEmail({
 *   to: 'user@example.com',
 *   template: 'welcome-email',
 *   data: {
 *     name: 'John Doe',
 *     activationLink: 'https://...'
 *   },
 *   provider: 'sendgrid'
 * });
 * ```
 *
 * **Bulk Notifications**:
 * ```typescript
 * await batchNotifications([
 *   { type: 'email', to: 'user1@example.com', ... },
 *   { type: 'sms', to: '+1234567890', ... },
 *   { type: 'push', token: 'device-token', ... }
 * ]);
 * ```
 *
 * **Track Delivery**:
 * ```typescript
 * const status = await getDeliveryStatus(messageId);
 * console.log(status); // 'delivered', 'bounced', 'pending'
 * ```
 */
//# sourceMappingURL=index.d.ts.map