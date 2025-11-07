/**
 * Redis Configuration Types
 *
 * Type definitions for Redis client configuration used in WebSocket adapter.
 * Provides type safety for Redis connection settings and authentication.
 *
 * @module redis-config.types
 */

/**
 * Reconnection strategy function type
 * Returns the delay in milliseconds before next reconnection attempt,
 * or an Error to stop reconnecting
 */
export type ReconnectStrategyFn = (retries: number) => number | Error;

/**
 * Redis socket configuration
 */
export interface RedisSocketConfig {
  /**
   * Redis server hostname
   */
  host: string;

  /**
   * Redis server port
   */
  port: number;

  /**
   * Reconnection strategy function
   */
  reconnectStrategy: ReconnectStrategyFn;
}

/**
 * Redis client configuration
 * Compatible with redis v5.x client options
 */
export interface RedisClientConfig {
  /**
   * Socket connection configuration
   */
  socket: RedisSocketConfig;

  /**
   * Redis username for authentication
   * @optional
   */
  username?: string;

  /**
   * Redis password for authentication
   * @optional
   */
  password?: string;
}
