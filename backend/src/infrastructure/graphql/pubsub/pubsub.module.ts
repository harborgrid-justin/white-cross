/**
 * PubSub Module
 *
 * Provides Redis-backed PubSub for GraphQL subscriptions.
 * Uses Redis for horizontal scalability across multiple server instances.
 *
 * Features:
 * - Redis-backed for multi-instance support
 * - Automatic reconnection
 * - Connection pooling
 * - Error handling
 *
 * @module PubSubModule
 */
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

/**
 * PubSub injection token
 * Use this token to inject PubSub in resolvers
 *
 * @example
 * ```typescript
 * constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) {}
 * ```
 */
export const PUB_SUB = 'PUB_SUB';

/**
 * PubSub Module
 * Global module providing Redis PubSub for GraphQL subscriptions
 */
@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = configService.get<number>('REDIS_PORT') || 6379;
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const redisDb = configService.get<number>('REDIS_DB') || 0;

        const redisOptions = {
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          db: redisDb,
          retryStrategy: (times: number) => {
            // Exponential backoff with max 2 seconds
            const delay = Math.min(times * 50, 2000);
            console.log(`Redis reconnecting in ${delay}ms (attempt ${times})`);
            return delay;
          },
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
        };

        console.log('Initializing Redis PubSub:', {
          host: redisHost,
          port: redisPort,
          db: redisDb,
        });

        // Create separate connections for publisher and subscriber
        // This is required by Redis PubSub protocol
        const publisher = new Redis(redisOptions);
        const subscriber = new Redis(redisOptions);

        // Log connection events
        publisher.on('connect', () => {
          console.log('Redis publisher connected');
        });

        publisher.on('error', (error) => {
          console.error('Redis publisher error:', error);
        });

        subscriber.on('connect', () => {
          console.log('Redis subscriber connected');
        });

        subscriber.on('error', (error) => {
          console.error('Redis subscriber error:', error);
        });

        return new RedisPubSub({
          publisher,
          subscriber,
          // Optional: serialize/deserialize for complex data types
          serializer: (value: any) => JSON.stringify(value),
          deserializer: (value: string) => JSON.parse(value),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
