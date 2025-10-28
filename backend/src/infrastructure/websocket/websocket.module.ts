/**
 * WebSocket Module
 *
 * Provides real-time WebSocket communication infrastructure for the White Cross platform.
 * Integrates Socket.io with NestJS dependency injection and authentication systems.
 *
 * Module Features:
 * - WebSocket Gateway for connection handling
 * - WebSocket Service for broadcasting
 * - JWT authentication integration
 * - Global availability for use across all modules
 *
 * Dependencies:
 * - JwtModule: For token verification
 * - ConfigModule: For configuration access
 *
 * Exports:
 * - WebSocketService: For use in other modules to broadcast messages
 * - WebSocketGateway: For direct server access if needed
 *
 * Usage:
 * Import this module in any feature module that needs to broadcast WebSocket messages.
 * Inject WebSocketService to send real-time updates to clients.
 *
 * @example
 * // In another module
 * import { WebSocketModule } from './infrastructure/websocket/websocket.module';
 *
 * @Module({
 *   imports: [WebSocketModule],
 *   // ...
 * })
 * export class FeatureModule {}
 *
 * // In a service
 * constructor(private readonly websocketService: WebSocketService) {}
 *
 * async sendAlert(organizationId: string, alert: any) {
 *   await this.websocketService.broadcastEmergencyAlert(organizationId, alert);
 * }
 *
 * @module WebSocketModule
 */
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { WsJwtAuthGuard } from './guards';

/**
 * WebSocket Module
 * Global module providing WebSocket infrastructure across the application
 */
@Global()
@Module({
  imports: [
    // JWT Module for authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    WebSocketGateway,
    WebSocketService,
    WsJwtAuthGuard,
  ],
  exports: [
    WebSocketService,
    WebSocketGateway,
  ],
})
export class WebSocketModule {}
