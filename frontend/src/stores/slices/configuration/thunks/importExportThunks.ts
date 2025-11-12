/**
 * Configuration Store - Import/Export Thunks
 * 
 * Async thunks for configuration import and export operations
 * 
 * @module stores/slices/configuration/thunks/importExportThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { configurationService } from '../service';
import type { ImportConfigurationsPayload } from '../../../../services/configurationApi';

/**
 * Export configurations for backup or migration.
 * 
 * Exports configurations matching the specified filter criteria.
 * Useful for system backups, migration between environments,
 * or sharing configuration templates.
 * 
 * @param filter - Optional filter for configurations to export
 * 
 * @example
 * ```typescript
 * // Export all security configurations
 * dispatch(exportConfigurations({
 *   category: 'security',
 *   scope: 'organization'
 * }));
 * 
 * // Export all configurations (no filter)
 * dispatch(exportConfigurations());
 * ```
 */
export const exportConfigurations = createAsyncThunk(
  'configuration/exportConfigurations',
  async (filter?: { category?: string; scope?: string }) => {
    const response = await configurationService.exportConfigurations(filter);
    return response;
  }
);

/**
 * Import configurations from a backup or template.
 * 
 * Imports configurations from a previously exported file or template.
 * Supports merge and replace strategies for handling conflicts.
 * 
 * @param data - Import payload with configurations and options
 * 
 * @example
 * ```typescript
 * dispatch(importConfigurations({
 *   configurations: [
 *     { key: 'session_timeout', value: '30', category: 'security' },
 *     { key: 'password_length', value: '12', category: 'security' }
 *   ],
 *   strategy: 'merge', // or 'replace'
 *   dryRun: false
 * }));
 * ```
 */
export const importConfigurations = createAsyncThunk(
  'configuration/importConfigurations',
  async (data: ImportConfigurationsPayload) => {
    const response = await configurationService.importConfigurations(data);
    return response;
  }
);
