/**
 * LOC: WC-DOWN-TRADING-WEBSOCKET-101
 */
import React from 'react';
import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketGatewayService {
  private readonly logger = new Logger(WebSocketGatewayService.name);
  
  broadcastMarketData(data: any): void {
    this.logger.log('Broadcasting market data');
  }
  
  broadcastOrderUpdate(orderId: string, status: string): void {
    this.logger.log(`Order update: ${orderId} - ${status}`);
  }
}

@WebSocketGateway({ cors: true })
export class TradingWebSocketGateway {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(TradingWebSocketGateway.name);
  
  constructor(private readonly service: WebSocketGatewayService) {}
  
  @SubscribeMessage('subscribe-market-data')
  handleSubscribeMarketData(@MessageBody() data: any): void {
    this.logger.log(`Client subscribed to ${data.symbol}`);
    this.server.emit('market-data', { symbol: data.symbol, price: 150.25, timestamp: new Date() });
  }
  
  @SubscribeMessage('subscribe-order-updates')
  handleSubscribeOrderUpdates(@MessageBody() data: any): void {
    this.logger.log('Client subscribed to order updates');
    this.server.emit('order-update', { orderId: 'ORD1', status: 'filled' });
  }
}

export const WebSocketGatewayDashboard: React.FC = () => {
  return (
    <div className="websocket-gateway-dashboard">
      <h1>WebSocket Gateway</h1>
      <div className="connection-status">Connected</div>
      <div className="subscription-list">
        <h2>Active Subscriptions</h2>
        <ul>
          <li>Market Data: AAPL, MSFT, GOOGL</li>
          <li>Order Updates: All accounts</li>
        </ul>
      </div>
    </div>
  );
};

export { WebSocketGatewayService, TradingWebSocketGateway };
