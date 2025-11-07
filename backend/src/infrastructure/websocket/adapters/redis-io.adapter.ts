/**
 * Redis IO Adapter
 *
 * Custom Socket.IO adapter that uses Redis for message broadcasting across multiple server instances.
 * This is CRITICAL for horizontal scaling of WebSocket connections in production.
 *
 * Features:
 * - Redis pub/sub for cross-server message broadcasting
 * - Connection pooling for Redis clients
 * - Automatic reconnection with exponential backoff
 * - Error handling and logging
 * - Health monitoring
 *
 * When to use:
 * - Running multiple backend instances (horizontal scaling)
 * - Load balancing WebSocket connections
 * - Deploying to cloud platforms with auto-scaling
 *
 * @class RedisIoAdapter
 */
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import type { INestApplicationContext } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);
  private pubClient: ReturnType<typeof createClient>;
  private subClient: ReturnType<typeof createClient>;
  private isConnected = false;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  /**
   * Connects to Redis and creates pub/sub clients
   * This must be called before creating the IO server
   *
   * @throws Error if Redis connection fails
   */
  async connectToRedis(): Promise<void> {
    // Get Redis configuration from environment
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD;
    const redisUsername = process.env.REDIS_USERNAME || 'default';
    const maxRetries = parseInt(process.env.REDIS_MAX_RETRIES || '10', 10);
    const retryDelay = parseInt(process.env.REDIS_RETRY_DELAY || '3000', 10);

    this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

    try {
      // Create pub client with authentication if password is provided
      const clientConfig: any = {
        socket: {
          host: redisHost,
          port: redisPort,
          reconnectStrategy: (retries: number) => {
            if (retries > maxRetries) {
              this.logger.error(
                `Redis connection failed after ${maxRetries} retries. Stopping reconnection.`,
              );
              return new Error('Max retries exceeded');
            }

            const delay = Math.min(retryDelay * Math.pow(2, retries), 30000);
            this.logger.warn(
              `Redis reconnecting in ${delay}ms (attempt ${retries + 1})`,
            );
            return delay;
          },
        },
      };

      // Only add authentication if password is provided
      if (redisPassword) {
        clientConfig.username = redisUsername;
        clientConfig.password = redisPassword;
        this.logger.log('Using Redis authentication');
      } else {
        this.logger.log(
          'No Redis password configured - connecting without authentication',
        );
      }

      this.pubClient = createClient(clientConfig);

      // Create sub client (duplicate of pub client)
      this.subClient = this.pubClient.duplicate();

      // Set up error handlers BEFORE connecting
      this.pubClient.on('error', (err) => {
        this.logger.error('Redis Pub Client Error:', err);
        this.isConnected = false;
      });

      this.subClient.on('error', (err) => {
        this.logger.error('Redis Sub Client Error:', err);
        this.isConnected = false;
      });

      // Set up connection event handlers
      this.pubClient.on('connect', () => {
        this.logger.log('Redis Pub Client connected');
      });

      this.subClient.on('connect', () => {
        this.logger.log('Redis Sub Client connected');
      });

      this.pubClient.on('ready', () => {
        this.logger.log('Redis Pub Client ready');
      });

      this.subClient.on('ready', () => {
        this.logger.log('Redis Sub Client ready');
      });

      this.pubClient.on('reconnecting', () => {
        this.logger.warn('Redis Pub Client reconnecting...');
        this.isConnected = false;
      });

      this.subClient.on('reconnecting', () => {
        this.logger.warn('Redis Sub Client reconnecting...');
        this.isConnected = false;
      });

      // Connect both clients
      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

      this.isConnected = true;
      this.logger.log('Redis clients connected successfully');

      // Create the adapter constructor
      this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);

      // Clean up clients if connection failed
      await this.cleanup();

      throw error;
    }
  }

  /**
   * Creates the Socket.IO server with Redis adapter
   *
   * @param port - The port to listen on
   * @param options - Socket.IO server options
   * @returns The configured Socket.IO server
   */
  createIOServer(port: number, options?: ServerOptions): any {
    if (!this.isConnected || !this.adapterConstructor) {
      this.logger.error(
        'Redis adapter not initialized. Call connectToRedis() before starting the server.',
      );

      // In development, allow fallback to default adapter
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn(
          'DEVELOPMENT MODE: Falling back to default Socket.IO adapter. ' +
            'WebSockets will NOT work across multiple server instances.',
        );
        return super.createIOServer(port, options);
      }

      throw new Error(
        'Redis adapter not initialized. Cannot create WebSocket server without Redis in production.',
      );
    }

    const server = super.createIOServer(port, options);

    // Apply the Redis adapter
    server.adapter(this.adapterConstructor);

    this.logger.log('Socket.IO server created with Redis adapter');

    return server;
  }

  /**
   * Checks if Redis clients are connected
   *
   * @returns True if both clients are connected, false otherwise
   */
  isRedisConnected(): boolean {
    return (
      this.isConnected &&
      this.pubClient?.isReady === true &&
      this.subClient?.isReady === true
    );
  }

  /**
   * Gets Redis connection health information
   *
   * @returns Health status object
   */
  getConnectionHealth(): {
    isConnected: boolean;
    pubClientReady: boolean;
    subClientReady: boolean;
  } {
    return {
      isConnected: this.isConnected,
      pubClientReady: this.pubClient?.isReady === true,
      subClientReady: this.subClient?.isReady === true,
    };
  }

  /**
   * Cleans up Redis connections
   * Should be called when shutting down the application
   */
  async cleanup(): Promise<void> {
    this.logger.log('Cleaning up Redis connections...');

    try {
      if (this.pubClient) {
        await this.pubClient.quit();
        this.logger.log('Redis Pub Client disconnected');
      }

      if (this.subClient) {
        await this.subClient.quit();
        this.logger.log('Redis Sub Client disconnected');
      }

      this.isConnected = false;
    } catch (error) {
      this.logger.error('Error during Redis cleanup:', error);
    }
  }
}
