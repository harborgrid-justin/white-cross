/**
 * Order Management Controllers
 * Bloomberg Terminal-Level Order Management System Controllers
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  TradingOrder,
  OrderType,
  OrderSide,
  OrderStatus,
  TimeInForce,
  createOrder,
  validateOrderParameters,
  submitOrder,
  amendOrder,
  cancelOrder,
  getOrderStatus,
  trackOrderLifecycle,
  processExecution,
  allocateTrade,
  generateSettlementInstructions,
  auditOrderLifecycle,
  validatePreTradeCompliance,
  checkTradingLimits,
  initializeOMSModels
} from '../order-management-system-composite';

@Injectable()
export class OrderManagementService {
  async createNewOrder(orderData: any) {
    await validateOrderParameters(orderData);
    await validatePreTradeCompliance(orderData);
    await checkTradingLimits(orderData);
    
    const order = await createOrder(orderData);
    const submitted = await submitOrder(order.id);
    
    return submitted;
  }

  async modifyOrder(orderId: string, amendments: any) {
    const status = await getOrderStatus(orderId);
    if (status === OrderStatus.FILLED) {
      throw new Error('Cannot amend filled order');
    }
    
    return await amendOrder(orderId, amendments);
  }

  async cancelExistingOrder(orderId: string, reason: string) {
    const cancelled = await cancelOrder(orderId);
    await auditOrderLifecycle(orderId, 'CANCELLED', reason);
    
    return cancelled;
  }

  async getOrderDetails(orderId: string) {
    const order = await TradingOrder.findByPk(orderId);
    const lifecycle = await trackOrderLifecycle(orderId);
    
    return { order, lifecycle };
  }
}

@ApiTags('order-management')
@Controller('orders')
export class OrderManagementController {
  constructor(private readonly service: OrderManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  async createOrder(@Body() orderData: any) {
    return await this.service.createNewOrder(orderData);
  }

  @Put(':orderId')
  @ApiOperation({ summary: 'Amend order' })
  async amendOrder(@Param('orderId') id: string, @Body() amendments: any) {
    return await this.service.modifyOrder(id, amendments);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Cancel order' })
  async cancelOrder(@Param('orderId') id: string, @Body() body: { reason: string }) {
    return await this.service.cancelExistingOrder(id, body.reason);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details' })
  async getOrder(@Param('orderId') id: string) {
    return await this.service.getOrderDetails(id);
  }
}

export default {
  controllers: [OrderManagementController],
  providers: [OrderManagementService]
};
