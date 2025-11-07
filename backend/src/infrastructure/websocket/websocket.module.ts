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
 * - Token blacklist verification
 * - Rate limiting for spam prevention
 * - Global availability for use across all modules
 * - EVENT-DRIVEN: Appointment event listeners for real-time notifications
 *
 * Dependencies:
 * - JwtModule: For token verification
 * - ConfigModule: For configuration access
 * - AuthModule: For token blacklist service
 *
 * Exports:
 * - WebSocketService: For use in other modules to broadcast messages
 * - WebSocketGateway: For direct server access if needed
 * - AppointmentWebSocketListener: Event listener for appointment events
 *
 * Usage:
 * Import this module in any feature module that needs to broadcast WebSocket messages.
 * Inject WebSocketService to send real-time updates to clients.
 *
 * Event-Driven Architecture:
 * - Appointment events are automatically handled by AppointmentWebSocketListener
 * - No need to inject WebSocketService into AppointmentService
 * - Eliminates circular dependencies
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
 * async sendAlert(organizationId: string, alert: Record<string, unknown>) {
 *   await this.websocketService.broadcastEmergencyAlert(organizationId, alert);
 * }
 *
 * @module WebSocketModule
 */
import { Module, Global } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { WsJwtAuthGuard } from './guards';
import { RateLimiterService, AdminMetricsService } from './services';
import { AdminWebSocketGateway } from './gateways';
import { AuthModule } from '@/auth';
import { AppointmentWebSocketListener } from './listeners/appointment.listener';

/**
 * WebSocket Module
 * Global module providing WebSocket infrastructure across the application
 */
@Global()
@Module({
  imports: [
    // Auth Module for token blacklist service
    AuthModule,
    // JWT Module for authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error(
            'CRITICAL SECURITY ERROR: JWT_SECRET not configured for WebSocket module',
          );
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: 86400, // 24 hours in seconds
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    WebSocketGateway,
    WebSocketService,
    WsJwtAuthGuard,
    RateLimiterService,
    AdminMetricsService,
    AdminWebSocketGateway,
    // Event-driven architecture listeners
    AppointmentWebSocketListener,
  ],
  exports: [
    WebSocketService,
    WebSocketGateway,
    AdminMetricsService,
    AdminWebSocketGateway,
    AppointmentWebSocketListener,
  ],
})
export class WebSocketModule {}
