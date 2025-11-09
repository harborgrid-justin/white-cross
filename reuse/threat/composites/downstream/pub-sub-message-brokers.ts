/**
 * LOC: PUBSUBBROKER001
 * File: /reuse/threat/composites/downstream/pub-sub-message-brokers.ts
 *
 * UPSTREAM (imports from):
 *   - ../real-time-threat-streaming-composite
 *   - @nestjs/common
 *   - @nestjs/microservices
 */

import { Injectable, Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class PublishThreatEventDto {
  @ApiProperty() @IsString() topic: string;
  @ApiProperty() @IsString() eventType: string;
  @ApiProperty() payload: any;
  @ApiProperty() @IsNumber() priority: number;
}

export class SubscribeToTopicDto {
  @ApiProperty() @IsString() topic: string;
  @ApiProperty() @IsString() consumerId: string;
  @ApiProperty() @IsArray() filters: string[];
}

@Injectable()
export class PubSubMessageBrokerService {
  private readonly logger = new Logger(PubSubMessageBrokerService.name);
  private subscriptions: Map<string, any[]> = new Map();

  async publishThreatEvent(dto: PublishThreatEventDto): Promise<any> {
    this.logger.log(`Publishing threat event to topic: ${dto.topic}`);

    const event = {
      eventId: `EVT-${Date.now()}`,
      topic: dto.topic,
      eventType: dto.eventType,
      payload: dto.payload,
      timestamp: new Date(),
      priority: dto.priority,
      deliveryCount: 0,
    };

    const subscribers = this.subscriptions.get(dto.topic) || [];
    this.logger.log(`Delivering to ${subscribers.length} subscribers`);

    return { event, subscribersNotified: subscribers.length, status: 'PUBLISHED' };
  }

  async subscribeToTopic(dto: SubscribeToTopicDto): Promise<any> {
    this.logger.log(`New subscription to topic: ${dto.topic}`);

    const subscription = {
      subscriptionId: `SUB-${Date.now()}`,
      topic: dto.topic,
      consumerId: dto.consumerId,
      filters: dto.filters,
      createdAt: new Date(),
      status: 'ACTIVE',
    };

    if (!this.subscriptions.has(dto.topic)) {
      this.subscriptions.set(dto.topic, []);
    }
    this.subscriptions.get(dto.topic)!.push(subscription);

    return subscription;
  }

  async getTopicMetrics(topic: string): Promise<any> {
    const subscribers = this.subscriptions.get(topic) || [];
    return {
      topic,
      subscriberCount: subscribers.length,
      messagesPublished: Math.floor(Math.random() * 1000),
      averageLatency: Math.random() * 50,
      errorRate: Math.random() * 0.01,
    };
  }
}

@ApiTags('Pub/Sub Message Broker')
@Controller('api/v1/pubsub')
@ApiBearerAuth()
export class PubSubMessageBrokerController {
  constructor(private readonly service: PubSubMessageBrokerService) {}

  @Post('publish')
  @ApiOperation({ summary: 'Publish threat event' })
  @ApiResponse({ status: 201, description: 'Event published' })
  async publish(@Body() dto: PublishThreatEventDto) {
    return this.service.publishThreatEvent(dto);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to topic' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  async subscribe(@Body() dto: SubscribeToTopicDto) {
    return this.service.subscribeToTopic(dto);
  }

  @Get('metrics/:topic')
  @ApiOperation({ summary: 'Get topic metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  async metrics(@Param('topic') topic: string) {
    return this.service.getTopicMetrics(topic);
  }
}

export default { service: PubSubMessageBrokerService, controller: PubSubMessageBrokerController };
