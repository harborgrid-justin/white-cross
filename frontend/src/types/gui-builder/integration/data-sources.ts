/**
 * Data Sources Types
 *
 * This module defines types for external data source integration.
 *
 * @module gui-builder/integration/data-sources
 */

import type { DataSourceId } from '../core';

/**
 * Data source connection.
 */
export interface DataSourceConnection {
  readonly id: DataSourceId;
  readonly name: string;
  readonly type: 'rest' | 'graphql' | 'database' | 'custom';
  readonly endpoint?: string;
  readonly credentials?: {
    readonly type: 'none' | 'bearer' | 'basic' | 'api-key';
    readonly token?: string;
  };
}

/**
 * Data query configuration.
 */
export interface DataQueryConfig {
  readonly dataSourceId: DataSourceId;
  readonly query: string;
  readonly variables?: Record<string, unknown>;
  readonly transform?: string; // JavaScript transformation function
  readonly cache?: {
    readonly enabled: boolean;
    readonly ttl?: number;
  };
}
