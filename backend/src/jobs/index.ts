/**
 * File: /backend/src/jobs/index.ts
 * Locator: WC-IDX-JOB-069
 * Purpose: Background Jobs Management Hub - Healthcare system job orchestration
 * 
 * Upstream: ../utils/logger, ./medicationReminderJob, ./inventoryMaintenanceJob
 * Downstream: server.ts, ../services/*, healthcare application lifecycle
 * Dependencies: logger, cron scheduler, medication reminder system, inventory management
 * Exports: initializeJobs, stopJobs, getJobsHealth, MedicationReminderJob, InventoryMaintenanceJob
 * 
 * LLM Context: Central job management for White Cross healthcare system. Coordinates
 * HIPAA-compliant background tasks including medication reminders (midnight/6am) and
 * inventory maintenance (15min intervals). Critical for healthcare operations continuity.
 */

/**
 * Background Jobs Initialization
 *
 * Centralizes all background job management for the application
 */

import { logger } from '../utils/logger';
import MedicationReminderJob from './medicationReminderJob';
import InventoryMaintenanceJob from './inventoryMaintenanceJob';

/**
 * Initialize all background jobs
 */
export function initializeJobs() {
  try {
    logger.info('Initializing background jobs...');

    // Start medication reminder job (midnight and 6am)
    MedicationReminderJob.start();

    // Start inventory maintenance job (every 15 minutes)
    InventoryMaintenanceJob.start();

    logger.info('Background jobs initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize background jobs', error);
    throw error;
  }
}

/**
 * Gracefully stop all jobs
 */
export function stopJobs() {
  try {
    logger.info('Stopping background jobs...');

    MedicationReminderJob.stop();
    InventoryMaintenanceJob.stop();

    logger.info('Background jobs stopped successfully');
  } catch (error) {
    logger.error('Error stopping background jobs', error);
  }
}

/**
 * Health check for background jobs
 */
export function getJobsHealth() {
  return {
    medicationReminders: {
      name: 'Medication Reminders',
      schedule: '0 0,6 * * *',
      description: 'Generates medication reminders at midnight and 6am',
      status: 'active'
    },
    inventoryMaintenance: {
      name: 'Inventory Maintenance',
      schedule: '*/15 * * * *',
      description: 'Refreshes inventory alerts every 15 minutes',
      status: 'active'
    }
  };
}

export {
  MedicationReminderJob,
  InventoryMaintenanceJob
};

export default {
  initializeJobs,
  stopJobs,
  getJobsHealth
};
