/**
 * @fileoverview Health Monitor Legacy Export
 * @module services/resilience/HealthMonitor
 * @category Resilience Services
 *
 * Legacy export for backward compatibility. This file now re-exports
 * the modular HealthMonitor implementation from the HealthMonitor directory.
 *
 * The HealthMonitor has been refactored into focused, modular components:
 * - HealthMonitor/types.ts - Type definitions and interfaces
 * - HealthMonitor/MetricsCalculator.ts - Response time and health metrics calculation
 * - HealthMonitor/DegradationDetector.ts - Degradation detection and alerting
 * - HealthMonitor/HealthMonitor.ts - Main orchestrator class
 * - HealthMonitor/index.ts - Module exports and utilities
 *
 * This ensures each file remains under 500 lines while maintaining
 * full backward compatibility for existing imports.
 */

// Re-export everything from the modular implementation
export * from './HealthMonitor/index';

// Maintain the legacy singleton exports for backward compatibility
export { 
  getGlobalHealthMonitor, 
  resetGlobalHealthMonitor 
} from './HealthMonitor/index';

// Legacy default export for backward compatibility
import { HealthMonitor } from './HealthMonitor/index';
export default HealthMonitor;
