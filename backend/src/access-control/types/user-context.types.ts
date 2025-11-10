/**
 * User context types for authentication and authorization
 */

/**
 * Authenticated user interface from JWT token
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * Express Request with authenticated user
 */
export interface RequestWithUser extends Express.Request {
  user?: AuthenticatedUser;
}

/**
 * HTTP request headers interface
 */
export interface RequestHeaders {
  'x-forwarded-for'?: string;
  'x-real-ip'?: string;
  [key: string]: string | string[] | undefined;
}

/**
 * HTTP request with connection details
 */
export interface RequestWithConnection {
  headers: RequestHeaders;
  connection?: {
    remoteAddress?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
  user?: AuthenticatedUser;
}

/**
 * Cache entry structure with TTL
 */
export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Cache statistics
 */
export interface CacheStatistics {
  hits: number;
  misses: number;
  sets: number;
  invalidations: number;
}

/**
 * Cache statistics with calculated metrics
 */
export interface CacheStatisticsResult {
  userPermissions: CacheStatistics & {
    hitRate: string;
    size: number;
  };
  rolePermissions: CacheStatistics & {
    hitRate: string;
    size: number;
  };
  totalSize: number;
}
