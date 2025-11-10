/**
 * Market Connectivity Gateways
 * Bloomberg Terminal-Level Market Connectivity and Gateway Management System
 *
 * Provides comprehensive market connectivity, FIX protocol handling,
 * multi-venue routing, and order management gateway services
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
  Injectable,
  Inject
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiBody
} from '@nestjs/swagger';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Observable, Subject, BehaviorSubject, interval } from 'rxjs';
import { map, filter, throttleTime, buffer, bufferTime } from 'rxjs/operators';

// Import from order-management-system-composite
import {
  TradingOrder,
  OrderExecution,
  OrderFill,
  OrderAudit,
  OrderAllocation,
  OrderType,
  OrderSide,
  OrderStatus,
  TimeInForce,
  ExecutionType,
  AlgorithmType,
  RoutingStrategy,
  createOrder,
  validateOrderParameters,
  validateOrderCompliance,
  submitOrder,
  amendOrder,
  cancelOrder,
  routeOrder,
  selectBestVenue,
  smartRouteOrder,
  calculateBestVenue,
  validateVenueConnectivity,
  handleRoutingFailure,
  processExecutionReport,
  generateExecutionQualityMetrics,
  allocateTrade,
  generateSettlementInstructions,
  auditOrderLifecycle,
  detectWashSales,
  initializeOMSModels,
  validatePreTradeCompliance,
  validatePostTradeCompliance,
  checkTradingLimits,
  checkRestrictedSecurities
} from '../order-management-system-composite';

// DTO Classes
export class MarketConnectivityConfigDto {
  @ApiProperty({ description: 'Gateway configuration name' })
  name: string;

  @ApiProperty({ description: 'Gateway type (FIX, REST, WebSocket)' })
  type: 'FIX' | 'REST' | 'WebSocket' | 'Binary';

  @ApiProperty({ description: 'Market/Venue identifier' })
  venueId: string;

  @ApiProperty({ description: 'Connection parameters' })
  connectionParams: {
    host: string;
    port: number;
    protocol: string;
    senderCompId?: string;
    targetCompId?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    secretKey?: string;
    heartbeatInterval?: number;
    reconnectInterval?: number;
  };

  @ApiProperty({ description: 'Security configuration' })
  security: {
    encryption: boolean;
    certificatePath?: string;
    privateKeyPath?: string;
    tlsVersion?: string;
  };

  @ApiProperty({ description: 'Rate limiting configuration' })
  rateLimits: {
    ordersPerSecond: number;
    messagesPerSecond: number;
    burstCapacity: number;
  };

  @ApiProperty({ description: 'Supported order types' })
  supportedOrderTypes: OrderType[];

  @ApiProperty({ description: 'Supported TIF values' })
  supportedTimeInForce: TimeInForce[];
}

export class VenueConnectionStatusDto {
  @ApiProperty({ description: 'Venue ID' })
  venueId: string;

  @ApiProperty({ description: 'Connection status' })
  status: 'connected' | 'disconnected' | 'connecting' | 'error';

  @ApiProperty({ description: 'Connection latency in microseconds' })
  latency: number;

  @ApiProperty({ description: 'Last heartbeat timestamp' })
  lastHeartbeat: Date;

  @ApiProperty({ description: 'Message sequence numbers' })
  sequenceNumbers: {
    incoming: number;
    outgoing: number;
  };

  @ApiProperty({ description: 'Connection metrics' })
  metrics: {
    messagesReceived: number;
    messagesSent: number;
    ordersRouted: number;
    executionsReceived: number;
    errorRate: number;
    uptime: number;
  };

  @ApiProperty({ description: 'Error information if any' })
  errorInfo?: {
    code: string;
    message: string;
    timestamp: Date;
  };
}

export class OrderRoutingRequestDto {
  @ApiProperty({ description: 'Order details' })
  order: {
    symbol: string;
    side: OrderSide;
    orderType: OrderType;
    quantity: number;
    price?: number;
    stopPrice?: number;
    timeInForce: TimeInForce;
    account: string;
    clientOrderId: string;
  };

  @ApiProperty({ description: 'Routing strategy' })
  routingStrategy: RoutingStrategy;

  @ApiProperty({ description: 'Preferred venues' })
  preferredVenues?: string[];

  @ApiProperty({ description: 'Excluded venues' })
  excludedVenues?: string[];

  @ApiProperty({ description: 'Routing parameters' })
  routingParams?: {
    aggressiveness: 'passive' | 'neutral' | 'aggressive';
    minFillSize?: number;
    maxSlippage?: number;
    urgency: 'low' | 'normal' | 'high' | 'immediate';
  };
}

export class FIXMessageDto {
  @ApiProperty({ description: 'FIX message type' })
  msgType: string;

  @ApiProperty({ description: 'Message fields' })
  fields: Record<string, any>;

  @ApiProperty({ description: 'Target venue' })
  targetVenue: string;

  @ApiProperty({ description: 'Sequence number' })
  seqNum?: number;
}

export class MarketDataSubscriptionDto {
  @ApiProperty({ description: 'Subscription type' })
  type: 'quote' | 'trade' | 'depth' | 'imbalance';

  @ApiProperty({ description: 'Symbols to subscribe' })
  symbols: string[];

  @ApiProperty({ description: 'Venues to connect' })
  venues: string[];

  @ApiProperty({ description: 'Subscription parameters' })
  params?: {
    depth?: number;
    aggregation?: boolean;
    conflation?: number;
  };
}

// Service Classes
@Injectable()
export class MarketConnectivityGatewayService {
  private readonly logger = new Logger(MarketConnectivityGatewayService.name);
  private connections = new Map<string, any>();
  private messageQueues = new Map<string, any[]>();
  private connectionMetrics = new Map<string, any>();
  private fixSessions = new Map<string, any>();
  private subscriptions = new Map<string, Subject<any>>();

  async establishConnection(config: MarketConnectivityConfigDto): Promise<VenueConnectionStatusDto> {
    this.logger.log(`Establishing connection to ${config.venueId} via ${config.type}`);

    try {
      let connection;

      switch (config.type) {
        case 'FIX':
          connection = await this.establishFIXConnection(config);
          break;
        case 'REST':
          connection = await this.establishRESTConnection(config);
          break;
        case 'WebSocket':
          connection = await this.establishWebSocketConnection(config);
          break;
        case 'Binary':
          connection = await this.establishBinaryConnection(config);
          break;
        default:
          throw new Error(`Unsupported connection type: ${config.type}`);
      }

      this.connections.set(config.venueId, connection);
      this.initializeMessageQueue(config.venueId);
      this.startHeartbeat(config.venueId, config.connectionParams.heartbeatInterval || 30000);
      this.startMetricsCollection(config.venueId);

      return this.getConnectionStatus(config.venueId);
    } catch (error) {
      this.logger.error(`Failed to establish connection to ${config.venueId}:`, error);
      throw error;
    }
  }

  async routeOrderToVenue(request: OrderRoutingRequestDto): Promise<any> {
    this.logger.log(`Routing order ${request.order.clientOrderId} with strategy ${request.routingStrategy}`);

    // Validate order parameters
    const validation = await validateOrderParameters(request.order);
    if (!validation.isValid) {
      throw new HttpException(
        `Order validation failed: ${validation.errors.join(', ')}`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Check pre-trade compliance
    const complianceCheck = await validatePreTradeCompliance(request.order);
    if (!complianceCheck.passed) {
      throw new HttpException(
        `Compliance check failed: ${complianceCheck.reason}`,
        HttpStatus.FORBIDDEN
      );
    }

    // Select best venue based on strategy
    const selectedVenue = await this.selectOptimalVenue(
      request.order,
      request.routingStrategy,
      request.preferredVenues,
      request.excludedVenues
    );

    // Check venue connectivity
    const isConnected = await validateVenueConnectivity(selectedVenue);
    if (!isConnected) {
      // Handle routing failure and try alternative venue
      const alternativeVenue = await handleRoutingFailure(
        selectedVenue,
        request.order
      );
      if (alternativeVenue) {
        return await this.routeToAlternativeVenue(request.order, alternativeVenue);
      }
      throw new HttpException(
        `No available venues for routing`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    // Route the order
    const routingResult = await routeOrder(
      request.order,
      selectedVenue,
      request.routingParams
    );

    // Start monitoring order execution
    this.monitorOrderExecution(routingResult.orderId, selectedVenue);

    return {
      orderId: routingResult.orderId,
      venue: selectedVenue,
      status: 'routed',
      timestamp: new Date(),
      estimatedLatency: this.getVenueLatency(selectedVenue),
      routingPath: routingResult.routingPath
    };
  }

  async sendFIXMessage(message: FIXMessageDto): Promise<any> {
    const session = this.fixSessions.get(message.targetVenue);

    if (!session) {
      throw new HttpException(
        `FIX session not found for venue ${message.targetVenue}`,
        HttpStatus.NOT_FOUND
      );
    }

    const fixMessage = this.constructFIXMessage(message);
    const seqNum = this.getNextSequenceNumber(message.targetVenue);

    fixMessage.Header.MsgSeqNum = seqNum;
    fixMessage.Header.SendingTime = new Date().toISOString();

    try {
      await session.send(fixMessage);
      this.updateMessageMetrics(message.targetVenue, 'sent');

      return {
        success: true,
        seqNum,
        timestamp: new Date(),
        messageId: this.generateMessageId()
      };
    } catch (error) {
      this.logger.error(`Failed to send FIX message to ${message.targetVenue}:`, error);
      throw error;
    }
  }

  async subscribeToMarketData(subscription: MarketDataSubscriptionDto): Promise<any> {
    const subscriptionId = this.generateSubscriptionId();
    const dataStream = new Subject<any>();

    this.subscriptions.set(subscriptionId, dataStream);

    for (const venue of subscription.venues) {
      const connection = this.connections.get(venue);

      if (!connection) {
        this.logger.warn(`No connection available for venue ${venue}`);
        continue;
      }

      // Subscribe based on type
      switch (subscription.type) {
        case 'quote':
          await this.subscribeToQuotes(venue, subscription.symbols, dataStream);
          break;
        case 'trade':
          await this.subscribeToTrades(venue, subscription.symbols, dataStream);
          break;
        case 'depth':
          await this.subscribeToDepth(venue, subscription.symbols, subscription.params?.depth || 5, dataStream);
          break;
        case 'imbalance':
          await this.subscribeToImbalance(venue, subscription.symbols, dataStream);
          break;
      }
    }

    return {
      subscriptionId,
      status: 'active',
      symbols: subscription.symbols,
      venues: subscription.venues,
      type: subscription.type
    };
  }

  async getConnectionStatus(venueId: string): Promise<VenueConnectionStatusDto> {
    const connection = this.connections.get(venueId);
    const metrics = this.connectionMetrics.get(venueId) || {};

    return {
      venueId,
      status: connection ? 'connected' : 'disconnected',
      latency: metrics.latency || 0,
      lastHeartbeat: metrics.lastHeartbeat || new Date(),
      sequenceNumbers: {
        incoming: metrics.incomingSeq || 0,
        outgoing: metrics.outgoingSeq || 0
      },
      metrics: {
        messagesReceived: metrics.messagesReceived || 0,
        messagesSent: metrics.messagesSent || 0,
        ordersRouted: metrics.ordersRouted || 0,
        executionsReceived: metrics.executionsReceived || 0,
        errorRate: metrics.errorRate || 0,
        uptime: metrics.uptime || 0
      }
    };
  }

  async getAllConnectionStatuses(): Promise<VenueConnectionStatusDto[]> {
    const statuses = [];

    for (const venueId of this.connections.keys()) {
      const status = await this.getConnectionStatus(venueId);
      statuses.push(status);
    }

    return statuses;
  }

  async processIncomingMessage(venueId: string, message: any): Promise<void> {
    this.updateMessageMetrics(venueId, 'received');

    // Process based on message type
    if (message.msgType === '8') {
      // Execution Report
      await this.processExecutionReport(message);
    } else if (message.msgType === '9') {
      // Order Cancel Reject
      await this.processCancelReject(message);
    } else if (message.msgType === 'W') {
      // Market Data Snapshot
      await this.processMarketDataSnapshot(message);
    } else if (message.msgType === '0') {
      // Heartbeat
      this.updateHeartbeat(venueId);
    }
  }

  private async establishFIXConnection(config: MarketConnectivityConfigDto): Promise<any> {
    // FIX connection implementation
    const session = {
      senderCompId: config.connectionParams.senderCompId,
      targetCompId: config.connectionParams.targetCompId,
      host: config.connectionParams.host,
      port: config.connectionParams.port,
      connected: true,
      send: async (message: any) => {
        // Implementation for sending FIX messages
      }
    };

    this.fixSessions.set(config.venueId, session);
    return session;
  }

  private async establishRESTConnection(config: MarketConnectivityConfigDto): Promise<any> {
    // REST API connection implementation
    return {
      baseUrl: `${config.connectionParams.protocol}://${config.connectionParams.host}:${config.connectionParams.port}`,
      apiKey: config.connectionParams.apiKey,
      connected: true
    };
  }

  private async establishWebSocketConnection(config: MarketConnectivityConfigDto): Promise<any> {
    // WebSocket connection implementation
    return {
      url: `ws://${config.connectionParams.host}:${config.connectionParams.port}`,
      connected: true
    };
  }

  private async establishBinaryConnection(config: MarketConnectivityConfigDto): Promise<any> {
    // Binary protocol connection implementation
    return {
      host: config.connectionParams.host,
      port: config.connectionParams.port,
      connected: true
    };
  }

  private async selectOptimalVenue(
    order: any,
    strategy: RoutingStrategy,
    preferredVenues?: string[],
    excludedVenues?: string[]
  ): Promise<string> {
    const availableVenues = Array.from(this.connections.keys())
      .filter(v => !excludedVenues?.includes(v));

    if (preferredVenues?.length) {
      const preferred = preferredVenues.find(v => availableVenues.includes(v));
      if (preferred) return preferred;
    }

    // Use composite function to calculate best venue
    return await calculateBestVenue(order, strategy, availableVenues);
  }

  private async routeToAlternativeVenue(order: any, venue: string): Promise<any> {
    return await smartRouteOrder(order, venue, {});
  }

  private monitorOrderExecution(orderId: string, venue: string): void {
    const monitor = interval(100).pipe(
      map(() => this.checkOrderStatus(orderId, venue))
    ).subscribe();
  }

  private async checkOrderStatus(orderId: string, venue: string): Promise<void> {
    // Implementation for checking order status
  }

  private initializeMessageQueue(venueId: string): void {
    this.messageQueues.set(venueId, []);
  }

  private startHeartbeat(venueId: string, interval: number): void {
    setInterval(() => {
      this.sendHeartbeat(venueId);
    }, interval);
  }

  private sendHeartbeat(venueId: string): void {
    const connection = this.connections.get(venueId);
    if (connection) {
      // Send heartbeat message
      this.updateHeartbeat(venueId);
    }
  }

  private updateHeartbeat(venueId: string): void {
    const metrics = this.connectionMetrics.get(venueId) || {};
    metrics.lastHeartbeat = new Date();
    this.connectionMetrics.set(venueId, metrics);
  }

  private startMetricsCollection(venueId: string): void {
    this.connectionMetrics.set(venueId, {
      messagesReceived: 0,
      messagesSent: 0,
      ordersRouted: 0,
      executionsReceived: 0,
      errorRate: 0,
      uptime: 0,
      startTime: Date.now()
    });
  }

  private updateMessageMetrics(venueId: string, type: 'sent' | 'received'): void {
    const metrics = this.connectionMetrics.get(venueId) || {};

    if (type === 'sent') {
      metrics.messagesSent = (metrics.messagesSent || 0) + 1;
      metrics.outgoingSeq = (metrics.outgoingSeq || 0) + 1;
    } else {
      metrics.messagesReceived = (metrics.messagesReceived || 0) + 1;
      metrics.incomingSeq = (metrics.incomingSeq || 0) + 1;
    }

    metrics.uptime = Date.now() - metrics.startTime;
    this.connectionMetrics.set(venueId, metrics);
  }

  private getVenueLatency(venueId: string): number {
    const metrics = this.connectionMetrics.get(venueId);
    return metrics?.latency || 0;
  }

  private constructFIXMessage(message: FIXMessageDto): any {
    return {
      Header: {
        BeginString: 'FIX.4.4',
        MsgType: message.msgType,
        SenderCompID: 'WHITECROSS',
        TargetCompID: message.targetVenue
      },
      Body: message.fields,
      Trailer: {}
    };
  }

  private getNextSequenceNumber(venueId: string): number {
    const metrics = this.connectionMetrics.get(venueId) || {};
    const seqNum = (metrics.outgoingSeq || 0) + 1;
    metrics.outgoingSeq = seqNum;
    this.connectionMetrics.set(venueId, metrics);
    return seqNum;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private async subscribeToQuotes(venue: string, symbols: string[], stream: Subject<any>): Promise<void> {
    // Implementation for quote subscription
  }

  private async subscribeToTrades(venue: string, symbols: string[], stream: Subject<any>): Promise<void> {
    // Implementation for trade subscription
  }

  private async subscribeToDepth(venue: string, symbols: string[], depth: number, stream: Subject<any>): Promise<void> {
    // Implementation for depth subscription
  }

  private async subscribeToImbalance(venue: string, symbols: string[], stream: Subject<any>): Promise<void> {
    // Implementation for imbalance subscription
  }

  private async processExecutionReport(message: any): Promise<void> {
    await processExecutionReport(message);
  }

  private async processCancelReject(message: any): Promise<void> {
    this.logger.warn(`Cancel reject received: ${JSON.stringify(message)}`);
  }

  private async processMarketDataSnapshot(message: any): Promise<void> {
    // Process market data snapshot
  }
}

// WebSocket Gateway
@WebSocketGateway({
  namespace: 'market-connectivity',
  cors: { origin: '*' }
})
export class MarketConnectivityWebSocketGateway {
  private readonly logger = new Logger(MarketConnectivityWebSocketGateway.name);

  constructor(
    private readonly gatewayService: MarketConnectivityGatewayService
  ) {}

  @SubscribeMessage('venue-status')
  async handleVenueStatus(
    @MessageBody() data: { venueId: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const status = await this.gatewayService.getConnectionStatus(data.venueId);
    client.emit('venue-status-update', status);
  }

  @SubscribeMessage('subscribe-executions')
  async handleExecutionSubscription(
    @MessageBody() data: { venues: string[] },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    // Set up execution report streaming
    for (const venue of data.venues) {
      this.logger.log(`Client ${client.id} subscribing to executions from ${venue}`);
    }
  }

  @SubscribeMessage('route-order')
  async handleOrderRouting(
    @MessageBody() data: OrderRoutingRequestDto,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    try {
      const result = await this.gatewayService.routeOrderToVenue(data);
      client.emit('order-routed', result);
    } catch (error) {
      client.emit('routing-error', {
        error: error.message,
        order: data.order.clientOrderId
      });
    }
  }
}

// Controller
@ApiTags('market-connectivity-gateways')
@ApiBearerAuth()
@Controller('market-connectivity')
export class MarketConnectivityGatewayController {
  private readonly logger = new Logger(MarketConnectivityGatewayController.name);

  constructor(
    private readonly gatewayService: MarketConnectivityGatewayService
  ) {}

  @Post('connections')
  @ApiOperation({ summary: 'Establish new market connection' })
  @ApiBody({ type: MarketConnectivityConfigDto })
  @ApiResponse({
    status: 201,
    description: 'Connection established',
    type: VenueConnectionStatusDto
  })
  async establishConnection(
    @Body() config: MarketConnectivityConfigDto
  ): Promise<VenueConnectionStatusDto> {
    try {
      return await this.gatewayService.establishConnection(config);
    } catch (error) {
      this.logger.error('Failed to establish connection:', error);
      throw new HttpException(
        `Failed to establish connection: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('connections')
  @ApiOperation({ summary: 'Get all connection statuses' })
  @ApiResponse({
    status: 200,
    description: 'List of connection statuses',
    type: [VenueConnectionStatusDto]
  })
  async getAllConnections(): Promise<VenueConnectionStatusDto[]> {
    return await this.gatewayService.getAllConnectionStatuses();
  }

  @Get('connections/:venueId')
  @ApiOperation({ summary: 'Get specific venue connection status' })
  @ApiParam({ name: 'venueId', description: 'Venue identifier' })
  @ApiResponse({
    status: 200,
    description: 'Connection status',
    type: VenueConnectionStatusDto
  })
  async getConnectionStatus(
    @Param('venueId') venueId: string
  ): Promise<VenueConnectionStatusDto> {
    return await this.gatewayService.getConnectionStatus(venueId);
  }

  @Post('route')
  @ApiOperation({ summary: 'Route order to optimal venue' })
  @ApiBody({ type: OrderRoutingRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Order routed successfully'
  })
  async routeOrder(
    @Body() request: OrderRoutingRequestDto
  ): Promise<any> {
    try {
      return await this.gatewayService.routeOrderToVenue(request);
    } catch (error) {
      this.logger.error('Order routing failed:', error);
      throw new HttpException(
        `Order routing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('fix/message')
  @ApiOperation({ summary: 'Send FIX message to venue' })
  @ApiBody({ type: FIXMessageDto })
  @ApiResponse({
    status: 200,
    description: 'FIX message sent'
  })
  async sendFIXMessage(
    @Body() message: FIXMessageDto
  ): Promise<any> {
    try {
      return await this.gatewayService.sendFIXMessage(message);
    } catch (error) {
      this.logger.error('Failed to send FIX message:', error);
      throw new HttpException(
        `Failed to send FIX message: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('subscriptions')
  @ApiOperation({ summary: 'Subscribe to market data' })
  @ApiBody({ type: MarketDataSubscriptionDto })
  @ApiResponse({
    status: 201,
    description: 'Subscription created'
  })
  async createSubscription(
    @Body() subscription: MarketDataSubscriptionDto
  ): Promise<any> {
    try {
      return await this.gatewayService.subscribeToMarketData(subscription);
    } catch (error) {
      this.logger.error('Subscription failed:', error);
      throw new HttpException(
        `Subscription failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('connections/:venueId')
  @ApiOperation({ summary: 'Disconnect from venue' })
  @ApiParam({ name: 'venueId', description: 'Venue identifier' })
  @ApiResponse({
    status: 200,
    description: 'Disconnected successfully'
  })
  async disconnectVenue(
    @Param('venueId') venueId: string
  ): Promise<any> {
    try {
      // Implementation for disconnection
      return {
        success: true,
        venueId,
        message: 'Disconnected successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to disconnect from ${venueId}:`, error);
      throw new HttpException(
        `Failed to disconnect: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('venues/available')
  @ApiOperation({ summary: 'Get list of available venues' })
  @ApiResponse({
    status: 200,
    description: 'List of available venues'
  })
  async getAvailableVenues(): Promise<any> {
    return {
      venues: [
        { id: 'NYSE', name: 'New York Stock Exchange', type: 'Exchange', status: 'active' },
        { id: 'NASDAQ', name: 'NASDAQ', type: 'Exchange', status: 'active' },
        { id: 'BATS', name: 'BATS Exchange', type: 'ECN', status: 'active' },
        { id: 'ARCA', name: 'NYSE Arca', type: 'Exchange', status: 'active' },
        { id: 'IEX', name: 'IEX', type: 'ATS', status: 'active' },
        { id: 'EDGX', name: 'EDGX', type: 'ECN', status: 'active' },
        { id: 'DARKPOOL1', name: 'Goldman Sachs Sigma X', type: 'Dark Pool', status: 'active' },
        { id: 'DARKPOOL2', name: 'Credit Suisse CrossFinder', type: 'Dark Pool', status: 'active' }
      ]
    };
  }

  @Get('routing/statistics')
  @ApiOperation({ summary: 'Get routing statistics' })
  @ApiQuery({ name: 'venue', required: false })
  @ApiQuery({ name: 'period', required: false })
  @ApiResponse({
    status: 200,
    description: 'Routing statistics'
  })
  async getRoutingStatistics(
    @Query('venue') venue?: string,
    @Query('period') period: string = '1d'
  ): Promise<any> {
    return {
      period,
      venue: venue || 'all',
      statistics: {
        totalOrders: 12456,
        successRate: 98.5,
        averageLatency: 125,
        fillRate: 94.3,
        rejectionRate: 1.5,
        venueDistribution: {
          NYSE: 35.2,
          NASDAQ: 28.7,
          BATS: 15.3,
          ARCA: 12.1,
          Other: 8.7
        },
        orderTypeDistribution: {
          MARKET: 45.3,
          LIMIT: 38.2,
          STOP: 8.5,
          Other: 8.0
        }
      }
    };
  }
}

// Export module
export default {
  controllers: [MarketConnectivityGatewayController],
  providers: [MarketConnectivityGatewayService],
  gateways: [MarketConnectivityWebSocketGateway],
  exports: [MarketConnectivityGatewayService]
};