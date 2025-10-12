/**
 * Chronic Condition Service - Sequelize Implementation
 *
 * Enterprise-grade service for managing student chronic health conditions.
 * Implements comprehensive care plan tracking, medication management, and PHI compliance.
 *
 * @module services/chronicConditionService
 * @deprecated Import from './chronicCondition' instead for better modularity
 */

// Re-export everything from the modular implementation
export * from './chronicCondition';
export { ChronicConditionService as default } from './chronicCondition';
