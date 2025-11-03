import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { WsExceptionFilter } from '../../infrastructure/websocket/filters/ws-exception.filter';
import { WsJwtAuthGuard } from '../../infrastructure/websocket/guards/ws-jwt-auth.guard';
import { WsLoggingInterceptor } from '../../infrastructure/websocket/interceptors/ws-logging.interceptor';

@UseFilters(new WsExceptionFilter())
@UseInterceptors(WsLoggingInterceptor)
@WebSocketGateway({
  namespace: '/communication',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class CommunicationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommunicationGateway.name);

  /**
   * Gateway initialization lifecycle hook
   */
  afterInit(server: Server): void {
    this.logger.log('Communication Gateway initialized');
    this.logger.log(`Namespace: ${server.name}`);
  }

  /**
   * Handles new client connections
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected to communication namespace: ${client.id}`);
  }

  /**
   * Handles client disconnections
   */
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected from communication namespace: ${client.id}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('subscribe-delivery-updates')
  handleSubscribeDeliveryUpdates(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Client ${client.id} subscribed to delivery updates for message ${data.messageId}`);
    client.join('message-' + data.messageId);
    return { success: true };
  }

  emitDeliveryStatusUpdate(messageId: string, status: any) {
    this.server.to('message-' + messageId).emit('delivery-status-update', status);
  }
}
