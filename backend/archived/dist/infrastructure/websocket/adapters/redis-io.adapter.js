"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const common_1 = require("@nestjs/common");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    adapterConstructor;
    logger = new common_1.Logger(RedisIoAdapter.name);
    pubClient;
    subClient;
    isConnected = false;
    constructor(app) {
        super(app);
    }
    async connectToRedis() {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
        const redisPassword = process.env.REDIS_PASSWORD;
        const redisUsername = process.env.REDIS_USERNAME || 'default';
        const maxRetries = parseInt(process.env.REDIS_MAX_RETRIES || '10', 10);
        const retryDelay = parseInt(process.env.REDIS_RETRY_DELAY || '3000', 10);
        this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
        try {
            const clientConfig = {
                socket: {
                    host: redisHost,
                    port: redisPort,
                    reconnectStrategy: (retries) => {
                        if (retries > maxRetries) {
                            this.logger.error(`Redis connection failed after ${maxRetries} retries. Stopping reconnection.`);
                            return new Error('Max retries exceeded');
                        }
                        const delay = Math.min(retryDelay * Math.pow(2, retries), 30000);
                        this.logger.warn(`Redis reconnecting in ${delay}ms (attempt ${retries + 1})`);
                        return delay;
                    },
                },
            };
            if (redisPassword) {
                clientConfig.username = redisUsername;
                clientConfig.password = redisPassword;
                this.logger.log('Using Redis authentication');
            }
            else {
                this.logger.log('No Redis password configured - connecting without authentication');
            }
            this.pubClient = (0, redis_1.createClient)(clientConfig);
            this.subClient = this.pubClient.duplicate();
            this.pubClient.on('error', (err) => {
                this.logger.error('Redis Pub Client Error:', err);
                this.isConnected = false;
            });
            this.subClient.on('error', (err) => {
                this.logger.error('Redis Sub Client Error:', err);
                this.isConnected = false;
            });
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
            await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
            this.isConnected = true;
            this.logger.log('Redis clients connected successfully');
            this.adapterConstructor = (0, redis_adapter_1.createAdapter)(this.pubClient, this.subClient);
        }
        catch (error) {
            this.logger.error('Failed to connect to Redis:', error);
            await this.cleanup();
            throw error;
        }
    }
    createIOServer(port, options) {
        if (!this.isConnected || !this.adapterConstructor) {
            this.logger.error('Redis adapter not initialized. Call connectToRedis() before starting the server.');
            if (process.env.NODE_ENV === 'development') {
                this.logger.warn('DEVELOPMENT MODE: Falling back to default Socket.IO adapter. ' +
                    'WebSockets will NOT work across multiple server instances.');
                return super.createIOServer(port, options);
            }
            throw new Error('Redis adapter not initialized. Cannot create WebSocket server without Redis in production.');
        }
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        this.logger.log('Socket.IO server created with Redis adapter');
        return server;
    }
    isRedisConnected() {
        return (this.isConnected &&
            this.pubClient?.isReady === true &&
            this.subClient?.isReady === true);
    }
    getConnectionHealth() {
        return {
            isConnected: this.isConnected,
            pubClientReady: this.pubClient?.isReady === true,
            subClientReady: this.subClient?.isReady === true,
        };
    }
    async cleanup() {
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
        }
        catch (error) {
            this.logger.error('Error during Redis cleanup:', error);
        }
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map