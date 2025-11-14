"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubModule = exports.PUB_SUB = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = __importDefault(require("ioredis"));
exports.PUB_SUB = 'PUB_SUB';
let PubSubModule = class PubSubModule {
};
exports.PubSubModule = PubSubModule;
exports.PubSubModule = PubSubModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.PUB_SUB,
                useFactory: (configService) => {
                    const redisHost = configService.get('REDIS_HOST') || 'localhost';
                    const redisPort = configService.get('REDIS_PORT') || 6379;
                    const redisPassword = configService.get('REDIS_PASSWORD');
                    const redisDb = configService.get('REDIS_DB') || 0;
                    const redisOptions = {
                        host: redisHost,
                        port: redisPort,
                        password: redisPassword,
                        db: redisDb,
                        retryStrategy: (times) => {
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
                    const publisher = new ioredis_1.default(redisOptions);
                    const subscriber = new ioredis_1.default(redisOptions);
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
                    return new graphql_redis_subscriptions_1.RedisPubSub({
                        publisher,
                        subscriber,
                        serializer: (value) => JSON.stringify(value),
                        deserializer: (value) => JSON.parse(value),
                    });
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [exports.PUB_SUB],
    })
], PubSubModule);
//# sourceMappingURL=pubsub.module.js.map