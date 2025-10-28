/**
 * Public Route Decorator
 *
 * Marks a route as public, bypassing authentication guards.
 * Use for endpoints that don't require authentication (e.g., login, register).
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
