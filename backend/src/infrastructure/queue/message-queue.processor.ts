/**
 * @fileoverview Message Queue Processors
 * @module infrastructure/queue
 * @description Barrel export for all message queue processors
 */

// Export all processors from the processors directory
export * from './processors';

// Export base processor for extension
export { BaseQueueProcessor } from './base.processor';
