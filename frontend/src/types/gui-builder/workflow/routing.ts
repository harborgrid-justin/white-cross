/**
 * Routing Types
 *
 * This module defines types for page routing and navigation.
 *
 * @module gui-builder/workflow/routing
 */

import type { PageId } from '../core';

/**
 * Route parameter type.
 */
export enum RouteParamType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Slug = 'slug',
}

/**
 * Route parameter definition.
 */
export interface RouteParam {
  readonly name: string;
  readonly type: RouteParamType;
  readonly optional?: boolean;
  readonly pattern?: string;
}

/**
 * Route definition.
 */
export interface Route {
  readonly path: string;
  readonly pageId: PageId;
  readonly params?: readonly RouteParam[];
  readonly exact?: boolean;
  readonly caseSensitive?: boolean;
}

/**
 * Navigation target.
 */
export interface NavigationTarget {
  readonly pageId: PageId;
  readonly params?: Record<string, string | number | boolean>;
  readonly queryParams?: Record<string, string>;
  readonly hash?: string;
  readonly state?: Record<string, unknown>;
}

/**
 * Navigation options.
 */
export interface NavigationOptions {
  readonly replace?: boolean;
  readonly scroll?: boolean | { x: number; y: number };
  readonly transition?: 'none' | 'fade' | 'slide';
}
