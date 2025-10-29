/**
 * @fileoverview Job Priority Enumeration
 * @module infrastructure/queue/enums
 * @description Defines priority levels for queue jobs
 */

/**
 * Job priority levels
 * Higher numbers = higher priority (processed first)
 */
export enum JobPriority {
  /**
   * Low priority - batch operations, cleanup tasks
   * Value: 1
   */
  LOW = 1,

  /**
   * Normal priority - standard messages, background indexing
   * Value: 5
   */
  NORMAL = 5,

  /**
   * High priority - real-time messages, critical notifications
   * Value: 10
   */
  HIGH = 10,

  /**
   * Critical priority - urgent system messages, alerts
   * Value: 20
   */
  CRITICAL = 20,
}
