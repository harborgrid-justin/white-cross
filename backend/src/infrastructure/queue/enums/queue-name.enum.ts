/**
 * @fileoverview Queue Name Enumeration
 * @module infrastructure/queue/enums
 * @description Defines all available queue types for the messaging platform
 */

/**
 * Queue names for different message processing operations
 * Each queue handles a specific type of asynchronous task
 */
export enum QueueName {
  /**
   * Queue for asynchronous message delivery
   * Handles sending messages to recipients
   */
  MESSAGE_DELIVERY = 'message-delivery',

  /**
   * Queue for push notifications and email alerts
   * Handles notification dispatch for new messages
   */
  MESSAGE_NOTIFICATION = 'message-notification',

  /**
   * Queue for search index updates
   * Handles indexing messages for full-text search
   */
  MESSAGE_INDEXING = 'message-indexing',

  /**
   * Queue for encryption and decryption operations
   * Handles CPU-intensive cryptographic operations
   */
  MESSAGE_ENCRYPTION = 'message-encryption',

  /**
   * Queue for batch message sending
   * Handles bulk message operations
   */
  BATCH_MESSAGE_SENDING = 'batch-message-sending',

  /**
   * Queue for scheduled cleanup tasks
   * Handles deletion of old messages and maintenance
   */
  MESSAGE_CLEANUP = 'message-cleanup',
}
