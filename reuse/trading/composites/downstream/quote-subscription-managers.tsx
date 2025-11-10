/**
 * Quote Subscription Managers
 * Bloomberg Terminal-Level Real-Time Quote Subscription Management
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';

import {
  MarketDataSubscription,
  MarketDataQuote,
  MarketDataTrade,
  DataVendor,
  createSubscription,
  cancelSubscription,
  getUserSubscriptions,
  streamRealTimeQuotes,
  streamMarketDepth,
  streamTimeAndSales,
  normalizeMarketData,
  aggregateQuotes,
  calculateNBBO,
  detectArbitrageOpportunities,
  validateMarketDataQuality,
  monitorFeedHealth,
  cacheMarketData,
  getCachedMarketData,
  handleVendorFailover,
  initializeMarketDataModels
} from '../real-time-market-data-composite';

@Injectable()
export class QuoteSubscriptionService {
  private subscriptions = new Map<string, any>();
  private activeStreams = new Map<string, any>();

  async createQuoteSubscription(userId: string, symbols: string[], types: string[]) {
    const subscription = await createSubscription({
      userId,
      symbols,
      dataTypes: types,
      vendor: 'Bloomberg' as DataVendor
    });

    for (const symbol of symbols) {
      if (types.includes('quote')) {
        const quoteStream = await streamRealTimeQuotes(symbol, 'Bloomberg' as DataVendor);
        this.activeStreams.set(`${subscription.id}_${symbol}_quote`, quoteStream);
      }
      
      if (types.includes('depth')) {
        const depthStream = await streamMarketDepth(symbol, 'Bloomberg' as DataVendor);
        this.activeStreams.set(`${subscription.id}_${symbol}_depth`, depthStream);
      }
      
      if (types.includes('trades')) {
        const tradeStream = await streamTimeAndSales(symbol, 'Bloomberg' as DataVendor);
        this.activeStreams.set(`${subscription.id}_${symbol}_trades`, tradeStream);
      }
    }

    this.subscriptions.set(subscription.id, subscription);
    
    return subscription;
  }

  async cancelQuoteSubscription(subscriptionId: string) {
    const cancelled = await cancelSubscription(subscriptionId);
    
    // Stop all active streams for this subscription
    for (const [key, stream] of this.activeStreams) {
      if (key.startsWith(subscriptionId)) {
        stream.unsubscribe();
        this.activeStreams.delete(key);
      }
    }
    
    this.subscriptions.delete(subscriptionId);
    
    return cancelled;
  }

  async getActiveSubscriptions(userId: string) {
    const subscriptions = await getUserSubscriptions(userId);
    const enriched = [];
    
    for (const sub of subscriptions) {
      const health = await monitorFeedHealth(sub.vendor);
      const quality = await validateMarketDataQuality({
        vendor: sub.vendor,
        symbol: sub.symbols[0],
        threshold: 0.95
      });
      
      enriched.push({
        ...sub,
        feedHealth: health,
        dataQuality: quality,
        isActive: this.subscriptions.has(sub.id)
      });
    }
    
    return enriched;
  }

  async getConsolidatedQuote(symbol: string) {
    const quotes = await aggregateQuotes([symbol]);
    const nbbo = await calculateNBBO([symbol]);
    const cached = await getCachedMarketData(symbol);
    const arbitrage = await detectArbitrageOpportunities([symbol]);
    
    return {
      symbol,
      aggregatedQuote: quotes,
      nbbo,
      cachedData: cached,
      arbitrageOpportunities: arbitrage,
      timestamp: new Date()
    };
  }

  async handleFailover(vendor: DataVendor) {
    const result = await handleVendorFailover(vendor);
    
    // Migrate active subscriptions to failover vendor
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.vendor === vendor) {
        subscription.vendor = result.failoverVendor;
        // Recreate streams with new vendor
        await this.migrateStreams(subscription);
      }
    }
    
    return result;
  }

  private async migrateStreams(subscription: any) {
    // Implementation to migrate streams to new vendor
    console.log(`Migrating streams for subscription ${subscription.id}`);
  }
}

@WebSocketGateway({ namespace: 'quotes' })
export class QuoteSubscriptionGateway {
  @SubscribeMessage('subscribe')
  async handleSubscribe(@MessageBody() data: any) {
    // Handle WebSocket subscriptions
    return { event: 'subscribed', data };
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(@MessageBody() data: any) {
    // Handle WebSocket unsubscriptions
    return { event: 'unsubscribed', data };
  }
}

@ApiTags('quote-subscriptions')
@Controller('quote-subscriptions')
export class QuoteSubscriptionController {
  constructor(private readonly service: QuoteSubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create quote subscription' })
  async createSubscription(@Body() body: {
    userId: string;
    symbols: string[];
    types: string[];
  }) {
    return await this.service.createQuoteSubscription(
      body.userId,
      body.symbols,
      body.types
    );
  }

  @Delete(':subscriptionId')
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancelSubscription(@Param('subscriptionId') id: string) {
    return await this.service.cancelQuoteSubscription(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user subscriptions' })
  async getUserSubscriptions(@Param('userId') userId: string) {
    return await this.service.getActiveSubscriptions(userId);
  }

  @Get('quote/:symbol')
  @ApiOperation({ summary: 'Get consolidated quote' })
  async getQuote(@Param('symbol') symbol: string) {
    return await this.service.getConsolidatedQuote(symbol);
  }

  @Post('failover')
  @ApiOperation({ summary: 'Handle vendor failover' })
  async handleFailover(@Body() body: { vendor: DataVendor }) {
    return await this.service.handleFailover(body.vendor);
  }
}

export default {
  controllers: [QuoteSubscriptionController],
  providers: [QuoteSubscriptionService],
  gateways: [QuoteSubscriptionGateway]
};
