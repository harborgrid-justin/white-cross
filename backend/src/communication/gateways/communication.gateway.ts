import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from '../../infrastructure/websocket/filters/ws-exception.filter';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: '/communication' })
export class CommunicationGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommunicationGateway.name);

  @SubscribeMessage('subscribe-delivery-updates')
  handleSubscribeDeliveryUpdates(@MessageBody() data: { messageId: string }, @ConnectedSocket() client: Socket) {
    this.logger.log('Client subscribed to delivery updates');
    client.join('message-' + data.messageId);
    return { success: true };
  }

  emitDeliveryStatusUpdate(messageId: string, status: any) {
    this.server.to('message-' + messageId).emit('delivery-status-update', status);
  }
}
