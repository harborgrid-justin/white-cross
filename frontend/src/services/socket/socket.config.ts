/**
 * Socket.io Configuration
 *
 * Environment-based configuration for Socket.io messaging client
 *
 * @module services/socket/socket.config
 */

/**
 * Socket.io connection configuration
 */
export interface SocketConfig {
  /** WebSocket server URL */
  url: string;

  /** Connection path */
  path: string;

  /** Reconnection settings */
  reconnection: {
    enabled: boolean;
    delay: number;
    delayMax: number;
    attempts: number;
  };

  /** Connection timeout in milliseconds */
  timeout: number;

  /** Transport methods */
  transports: ('websocket' | 'polling')[];

  /** Heartbeat interval in milliseconds */
  heartbeatInterval: number;

  /** Heartbeat timeout in milliseconds */
  heartbeatTimeout: number;

  /** Enable debug logging */
  debug: boolean;

  /** Message queue settings */
  queue: {
    maxSize: number;
    persistToStorage: boolean;
    retryAttempts: number;
    retryDelay: number;
  };

  /** Message deduplication window in milliseconds */
  deduplicationWindow: number;
}

/**
 * Get Socket.io configuration based on environment
 */
export function getSocketConfig(): SocketConfig {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    url: apiUrl,
    path: '/socket.io',

    reconnection: {
      enabled: true,
      delay: 1000,           // Start with 1 second
      delayMax: 30000,       // Max 30 seconds
      attempts: 10           // Try 10 times before giving up
    },

    timeout: 20000,          // 20 second connection timeout

    transports: ['websocket', 'polling'],

    heartbeatInterval: 25000,  // Send ping every 25 seconds
    heartbeatTimeout: 5000,    // Expect pong within 5 seconds

    debug: isDevelopment,

    queue: {
      maxSize: 100,              // Max 100 queued messages
      persistToStorage: true,     // Save queue to localStorage
      retryAttempts: 3,          // Retry failed messages 3 times
      retryDelay: 2000           // Wait 2 seconds between retries
    },

    deduplicationWindow: 60000   // 1 minute deduplication window
  };
}

/**
 * Default socket configuration
 */
export const socketConfig = getSocketConfig();

export default socketConfig;
