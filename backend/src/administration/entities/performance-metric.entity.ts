/**
 * PerformanceMetric Entity
 *
 * Stores system performance metrics over time for monitoring and analysis
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and enum
export { PerformanceMetric } from '../../database/models/performance-metric.model';

export { MetricType } from '../enums/administration.enums';
