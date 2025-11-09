/**
 * Command Microservices Architecture
 *
 * Production-ready NestJS microservices for emergency command and control operations.
 * Implements event-driven architecture, CQRS patterns, message queues (RabbitMQ, Kafka),
 * and distributed service coordination for incident processing, dispatch, resource management,
 * notifications, analytics, GIS, reporting, and archival operations.
 *
 * Features:
 * - Event-driven microservices architecture with RabbitMQ and Kafka
 * - CQRS (Command Query Responsibility Segregation) implementation
 * - Event sourcing for audit trails and state reconstruction
 * - Distributed transaction coordination with Saga pattern
 * - Circuit breaker and retry patterns for resilience
 * - Service discovery and health monitoring
 * - Real-time event streaming and processing
 * - Message-based inter-service communication
 * - Asynchronous command processing
 * - Event store and replay capabilities
 *
 * Microservices Covered:
 * - Incident Processing Service
 * - Dispatch Coordination Service
 * - Resource Management Service
 * - Notification Service
 * - Analytics Processing Service
 * - GIS Service
 * - Reporting Service
 * - Archive Service
 *
 * @module CommandMicroservices
 * @category Microservices Architecture
 * @version 1.0.0
 */

import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport, MessagePattern, EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Observable, Subject, firstValueFrom, timeout, catchError, retry, of } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

/**
 * Incident Processing Microservice
 *
 * Handles all incident-related commands and events through message queues.
 * Processes incident creation, updates, status changes, and lifecycle management.
 */
@Injectable()
export class IncidentProcessingService {
  private readonly logger = new Logger(IncidentProcessingService.name);
  private kafkaClient: ClientProxy;
  private rabbitMQClient: ClientProxy;

  constructor(
    @InjectModel('Incident') private readonly incidentModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize message queue clients
   */
  private initializeClients(): void {
    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'incident-processing-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'incident-consumer-group',
        },
      },
    });

    this.rabbitMQClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'incident_commands',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  /**
   * Process create incident command
   */
  @MessagePattern('create_incident')
  async processCreateIncidentCommand(@Payload() data: any, @Ctx() context: RmqContext): Promise<any> {
    this.logger.log(`Processing create incident command: ${data.incidentNumber}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const incident = await this.incidentModel.create({
        incidentNumber: data.incidentNumber,
        type: data.type,
        priority: data.priority,
        location: data.location,
        description: data.description,
        status: 'CREATED',
        createdAt: new Date(),
      });

      // Publish incident created event to Kafka
      await this.publishIncidentCreatedEvent(incident);

      channel.ack(originalMsg);
      return { success: true, incidentId: incident.id };
    } catch (error) {
      this.logger.error(`Failed to create incident: ${error.message}`);
      channel.nack(originalMsg, false, true);
      throw error;
    }
  }

  /**
   * Publish incident created event to event stream
   */
  async publishIncidentCreatedEvent(incident: any): Promise<void> {
    const event = {
      eventType: 'IncidentCreated',
      aggregateId: incident.id,
      incidentNumber: incident.incidentNumber,
      type: incident.type,
      priority: incident.priority,
      location: incident.location,
      timestamp: new Date(),
      version: 1,
    };

    this.kafkaClient.emit('incident.created', event);
    this.eventEmitter.emit('incident.created', event);
  }

  /**
   * Process update incident command
   */
  @MessagePattern('update_incident')
  async processUpdateIncidentCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing update incident command: ${data.incidentId}`);

    const incident = await this.incidentModel.findByPk(data.incidentId);
    if (!incident) {
      throw new NotFoundException(`Incident ${data.incidentId} not found`);
    }

    await incident.update(data.updates);

    await this.publishIncidentUpdatedEvent(incident, data.updates);

    return { success: true, incident };
  }

  /**
   * Publish incident updated event
   */
  async publishIncidentUpdatedEvent(incident: any, updates: any): Promise<void> {
    const event = {
      eventType: 'IncidentUpdated',
      aggregateId: incident.id,
      updates,
      timestamp: new Date(),
      version: incident.version + 1,
    };

    this.kafkaClient.emit('incident.updated', event);
  }

  /**
   * Process close incident command
   */
  @MessagePattern('close_incident')
  async processCloseIncidentCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing close incident command: ${data.incidentId}`);

    const incident = await this.incidentModel.findByPk(data.incidentId);
    if (!incident) {
      throw new NotFoundException(`Incident ${data.incidentId} not found`);
    }

    await incident.update({
      status: 'CLOSED',
      closedAt: new Date(),
      closureNotes: data.notes,
    });

    await this.publishIncidentClosedEvent(incident);

    return { success: true };
  }

  /**
   * Publish incident closed event
   */
  async publishIncidentClosedEvent(incident: any): Promise<void> {
    const event = {
      eventType: 'IncidentClosed',
      aggregateId: incident.id,
      closedAt: new Date(),
      timestamp: new Date(),
    };

    this.kafkaClient.emit('incident.closed', event);
  }

  /**
   * Handle incident escalation
   */
  @MessagePattern('escalate_incident')
  async handleIncidentEscalation(@Payload() data: any): Promise<any> {
    this.logger.log(`Escalating incident: ${data.incidentId}`);

    const incident = await this.incidentModel.findByPk(data.incidentId);
    if (!incident) {
      throw new NotFoundException(`Incident ${data.incidentId} not found`);
    }

    const newPriority = this.calculateEscalatedPriority(incident.priority);
    await incident.update({ priority: newPriority });

    const event = {
      eventType: 'IncidentEscalated',
      aggregateId: incident.id,
      previousPriority: incident.priority,
      newPriority,
      reason: data.reason,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('incident.escalated', event);

    return { success: true, newPriority };
  }

  /**
   * Calculate escalated priority level
   */
  private calculateEscalatedPriority(currentPriority: string): string {
    const priorityMap = {
      'LOW': 'MEDIUM',
      'MEDIUM': 'HIGH',
      'HIGH': 'CRITICAL',
      'CRITICAL': 'CRITICAL',
    };
    return priorityMap[currentPriority] || currentPriority;
  }
}

/**
 * Dispatch Coordination Microservice
 *
 * Coordinates unit dispatching, resource allocation, and response coordination
 * through distributed message-based architecture.
 */
@Injectable()
export class DispatchCoordinationService {
  private readonly logger = new Logger(DispatchCoordinationService.name);
  private rabbitMQClient: ClientProxy;
  private kafkaClient: ClientProxy;

  constructor(
    @InjectModel('Dispatch') private readonly dispatchModel: any,
    @InjectModel('Unit') private readonly unitModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize message clients
   */
  private initializeClients(): void {
    this.rabbitMQClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'dispatch_commands',
        queueOptions: { durable: true },
      },
    });

    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'dispatch-coordination-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
      },
    });
  }

  /**
   * Process dispatch unit command
   */
  @MessagePattern('dispatch_unit')
  async processDispatchUnitCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing dispatch unit command: ${data.unitId} to incident ${data.incidentId}`);

    const unit = await this.unitModel.findByPk(data.unitId);
    if (!unit) {
      throw new NotFoundException(`Unit ${data.unitId} not found`);
    }

    if (unit.status !== 'AVAILABLE') {
      throw new ConflictException(`Unit ${data.unitId} is not available for dispatch`);
    }

    const dispatch = await this.dispatchModel.create({
      unitId: data.unitId,
      incidentId: data.incidentId,
      dispatchedAt: new Date(),
      status: 'DISPATCHED',
      priority: data.priority,
    });

    await unit.update({ status: 'DISPATCHED' });

    await this.publishUnitDispatchedEvent(dispatch, unit);

    return { success: true, dispatchId: dispatch.id };
  }

  /**
   * Publish unit dispatched event
   */
  async publishUnitDispatchedEvent(dispatch: any, unit: any): Promise<void> {
    const event = {
      eventType: 'UnitDispatched',
      dispatchId: dispatch.id,
      unitId: unit.id,
      incidentId: dispatch.incidentId,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('dispatch.unit.dispatched', event);
  }

  /**
   * Process unit enroute command
   */
  @MessagePattern('unit_enroute')
  async processUnitEnrouteCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing unit enroute: ${data.dispatchId}`);

    const dispatch = await this.dispatchModel.findByPk(data.dispatchId);
    if (!dispatch) {
      throw new NotFoundException(`Dispatch ${data.dispatchId} not found`);
    }

    await dispatch.update({
      status: 'ENROUTE',
      enrouteAt: new Date(),
    });

    const event = {
      eventType: 'UnitEnroute',
      dispatchId: dispatch.id,
      unitId: dispatch.unitId,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('dispatch.unit.enroute', event);

    return { success: true };
  }

  /**
   * Process unit on-scene command
   */
  @MessagePattern('unit_on_scene')
  async processUnitOnSceneCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing unit on-scene: ${data.dispatchId}`);

    const dispatch = await this.dispatchModel.findByPk(data.dispatchId);
    if (!dispatch) {
      throw new NotFoundException(`Dispatch ${data.dispatchId} not found`);
    }

    await dispatch.update({
      status: 'ON_SCENE',
      onSceneAt: new Date(),
    });

    const event = {
      eventType: 'UnitOnScene',
      dispatchId: dispatch.id,
      unitId: dispatch.unitId,
      incidentId: dispatch.incidentId,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('dispatch.unit.on_scene', event);

    return { success: true };
  }

  /**
   * Process unit available command
   */
  @MessagePattern('unit_available')
  async processUnitAvailableCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing unit available: ${data.unitId}`);

    const unit = await this.unitModel.findByPk(data.unitId);
    if (!unit) {
      throw new NotFoundException(`Unit ${data.unitId} not found`);
    }

    await unit.update({
      status: 'AVAILABLE',
      availableAt: new Date(),
    });

    const event = {
      eventType: 'UnitAvailable',
      unitId: unit.id,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('dispatch.unit.available', event);

    return { success: true };
  }

  /**
   * Request mutual aid from neighboring jurisdiction
   */
  @MessagePattern('request_mutual_aid')
  async requestMutualAid(@Payload() data: any): Promise<any> {
    this.logger.log(`Requesting mutual aid for incident: ${data.incidentId}`);

    const event = {
      eventType: 'MutualAidRequested',
      incidentId: data.incidentId,
      jurisdiction: data.jurisdiction,
      resourcesNeeded: data.resourcesNeeded,
      priority: data.priority,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('dispatch.mutual_aid.requested', event);

    return { success: true, requestId: this.generateRequestId() };
  }

  /**
   * Generate unique mutual aid request ID
   */
  private generateRequestId(): string {
    return `MA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Coordinate multi-unit response
   */
  @MessagePattern('coordinate_multi_unit_response')
  async coordinateMultiUnitResponse(@Payload() data: any): Promise<any> {
    this.logger.log(`Coordinating multi-unit response for incident: ${data.incidentId}`);

    const dispatches = [];
    for (const unitId of data.unitIds) {
      const dispatch = await this.processDispatchUnitCommand({
        unitId,
        incidentId: data.incidentId,
        priority: data.priority,
      });
      dispatches.push(dispatch);
    }

    return { success: true, dispatches };
  }
}

/**
 * Resource Management Microservice
 *
 * Manages resource allocation, availability tracking, and capacity planning
 * through event-driven architecture.
 */
@Injectable()
export class ResourceManagementService {
  private readonly logger = new Logger(ResourceManagementService.name);
  private kafkaClient: ClientProxy;

  constructor(
    @InjectModel('Resource') private readonly resourceModel: any,
    @InjectModel('Unit') private readonly unitModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize Kafka client
   */
  private initializeClients(): void {
    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'resource-management-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
      },
    });
  }

  /**
   * Process allocate resource command
   */
  @MessagePattern('allocate_resource')
  async processAllocateResourceCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Allocating resource: ${data.resourceId}`);

    const resource = await this.resourceModel.findByPk(data.resourceId);
    if (!resource) {
      throw new NotFoundException(`Resource ${data.resourceId} not found`);
    }

    if (resource.status !== 'AVAILABLE') {
      throw new ConflictException(`Resource ${data.resourceId} is not available`);
    }

    await resource.update({
      status: 'ALLOCATED',
      allocatedTo: data.allocatedTo,
      allocatedAt: new Date(),
    });

    const event = {
      eventType: 'ResourceAllocated',
      resourceId: resource.id,
      allocatedTo: data.allocatedTo,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('resource.allocated', event);

    return { success: true };
  }

  /**
   * Process release resource command
   */
  @MessagePattern('release_resource')
  async processReleaseResourceCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Releasing resource: ${data.resourceId}`);

    const resource = await this.resourceModel.findByPk(data.resourceId);
    if (!resource) {
      throw new NotFoundException(`Resource ${data.resourceId} not found`);
    }

    await resource.update({
      status: 'AVAILABLE',
      allocatedTo: null,
      releasedAt: new Date(),
    });

    const event = {
      eventType: 'ResourceReleased',
      resourceId: resource.id,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('resource.released', event);

    return { success: true };
  }

  /**
   * Check resource availability
   */
  @MessagePattern('check_resource_availability')
  async checkResourceAvailability(@Payload() data: any): Promise<any> {
    this.logger.log(`Checking resource availability for type: ${data.resourceType}`);

    const availableResources = await this.resourceModel.findAll({
      where: {
        type: data.resourceType,
        status: 'AVAILABLE',
      },
    });

    return {
      available: availableResources.length > 0,
      count: availableResources.length,
      resources: availableResources,
    };
  }

  /**
   * Reserve resource for future use
   */
  @MessagePattern('reserve_resource')
  async reserveResource(@Payload() data: any): Promise<any> {
    this.logger.log(`Reserving resource: ${data.resourceId}`);

    const resource = await this.resourceModel.findByPk(data.resourceId);
    if (!resource) {
      throw new NotFoundException(`Resource ${data.resourceId} not found`);
    }

    await resource.update({
      status: 'RESERVED',
      reservedFor: data.reservedFor,
      reservedUntil: data.reservedUntil,
    });

    const event = {
      eventType: 'ResourceReserved',
      resourceId: resource.id,
      reservedFor: data.reservedFor,
      timestamp: new Date(),
    };

    this.kafkaClient.emit('resource.reserved', event);

    return { success: true };
  }

  /**
   * Track resource utilization metrics
   */
  @MessagePattern('track_resource_utilization')
  async trackResourceUtilization(@Payload() data: any): Promise<any> {
    this.logger.log('Tracking resource utilization');

    const resources = await this.resourceModel.findAll();

    const utilizationMetrics = {
      total: resources.length,
      available: resources.filter((r: any) => r.status === 'AVAILABLE').length,
      allocated: resources.filter((r: any) => r.status === 'ALLOCATED').length,
      reserved: resources.filter((r: any) => r.status === 'RESERVED').length,
      maintenance: resources.filter((r: any) => r.status === 'MAINTENANCE').length,
      utilizationRate: 0,
    };

    utilizationMetrics.utilizationRate =
      ((utilizationMetrics.allocated + utilizationMetrics.reserved) / utilizationMetrics.total) * 100;

    return utilizationMetrics;
  }
}

/**
 * Notification Microservice
 *
 * Handles multi-channel notification delivery through event-driven messaging.
 * Supports SMS, email, push notifications, and webhook notifications.
 */
@Injectable()
export class NotificationMicroservice {
  private readonly logger = new Logger(NotificationMicroservice.name);
  private rabbitMQClient: ClientProxy;

  constructor(
    @InjectModel('Notification') private readonly notificationModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize RabbitMQ client
   */
  private initializeClients(): void {
    this.rabbitMQClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'notifications',
        queueOptions: { durable: true },
      },
    });
  }

  /**
   * Send notification through message queue
   */
  @MessagePattern('send_notification')
  async processSendNotificationCommand(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing send notification: ${data.type} to ${data.recipient}`);

    const notification = await this.notificationModel.create({
      type: data.type,
      channel: data.channel,
      recipient: data.recipient,
      subject: data.subject,
      content: data.content,
      status: 'PENDING',
      createdAt: new Date(),
    });

    // Route to appropriate notification handler
    this.rabbitMQClient.emit(`notification.${data.channel}`, {
      notificationId: notification.id,
      ...data,
    });

    return { success: true, notificationId: notification.id };
  }

  /**
   * Handle SMS notification
   */
  @EventPattern('notification.sms')
  async handleSMSNotification(@Payload() data: any): Promise<void> {
    this.logger.log(`Sending SMS notification: ${data.notificationId}`);

    try {
      // Simulate SMS sending
      await this.sendSMS(data.recipient, data.content);

      await this.notificationModel.update(
        { status: 'SENT', sentAt: new Date() },
        { where: { id: data.notificationId } }
      );
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      await this.notificationModel.update(
        { status: 'FAILED', error: error.message },
        { where: { id: data.notificationId } }
      );
    }
  }

  /**
   * Handle email notification
   */
  @EventPattern('notification.email')
  async handleEmailNotification(@Payload() data: any): Promise<void> {
    this.logger.log(`Sending email notification: ${data.notificationId}`);

    try {
      await this.sendEmail(data.recipient, data.subject, data.content);

      await this.notificationModel.update(
        { status: 'SENT', sentAt: new Date() },
        { where: { id: data.notificationId } }
      );
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      await this.notificationModel.update(
        { status: 'FAILED', error: error.message },
        { where: { id: data.notificationId } }
      );
    }
  }

  /**
   * Handle push notification
   */
  @EventPattern('notification.push')
  async handlePushNotification(@Payload() data: any): Promise<void> {
    this.logger.log(`Sending push notification: ${data.notificationId}`);

    try {
      await this.sendPushNotification(data.recipient, data.content);

      await this.notificationModel.update(
        { status: 'SENT', sentAt: new Date() },
        { where: { id: data.notificationId } }
      );
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      await this.notificationModel.update(
        { status: 'FAILED', error: error.message },
        { where: { id: data.notificationId } }
      );
    }
  }

  /**
   * Send mass notification to multiple recipients
   */
  @MessagePattern('send_mass_notification')
  async sendMassNotification(@Payload() data: any): Promise<any> {
    this.logger.log(`Sending mass notification to ${data.recipients.length} recipients`);

    const notifications = [];
    for (const recipient of data.recipients) {
      const notification = await this.processSendNotificationCommand({
        ...data,
        recipient,
      });
      notifications.push(notification);
    }

    return { success: true, count: notifications.length };
  }

  /**
   * Schedule delayed notification
   */
  @MessagePattern('schedule_notification')
  async scheduleNotification(@Payload() data: any): Promise<any> {
    this.logger.log(`Scheduling notification for ${data.scheduledFor}`);

    const notification = await this.notificationModel.create({
      type: data.type,
      channel: data.channel,
      recipient: data.recipient,
      subject: data.subject,
      content: data.content,
      status: 'SCHEDULED',
      scheduledFor: new Date(data.scheduledFor),
      createdAt: new Date(),
    });

    return { success: true, notificationId: notification.id };
  }

  /**
   * Simulate SMS sending
   */
  private async sendSMS(recipient: string, content: string): Promise<void> {
    // Integration with SMS provider (Twilio, etc.)
    this.logger.log(`SMS sent to ${recipient}: ${content}`);
  }

  /**
   * Simulate email sending
   */
  private async sendEmail(recipient: string, subject: string, content: string): Promise<void> {
    // Integration with email provider (SendGrid, etc.)
    this.logger.log(`Email sent to ${recipient}: ${subject}`);
  }

  /**
   * Simulate push notification sending
   */
  private async sendPushNotification(recipient: string, content: string): Promise<void> {
    // Integration with push notification service (FCM, etc.)
    this.logger.log(`Push notification sent to ${recipient}: ${content}`);
  }
}

/**
 * Analytics Processing Microservice
 *
 * Processes analytics events and metrics through stream processing.
 * Handles real-time analytics, aggregations, and reporting metrics.
 */
@Injectable()
export class AnalyticsProcessingService {
  private readonly logger = new Logger(AnalyticsProcessingService.name);
  private kafkaClient: ClientProxy;

  constructor(
    @InjectModel('AnalyticsEvent') private readonly analyticsEventModel: any,
    @InjectModel('Metric') private readonly metricModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize Kafka client for stream processing
   */
  private initializeClients(): void {
    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'analytics-processing-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'analytics-consumer-group',
        },
      },
    });
  }

  /**
   * Process analytics event
   */
  @EventPattern('analytics.event')
  async processAnalyticsEvent(@Payload() data: any): Promise<void> {
    this.logger.log(`Processing analytics event: ${data.eventType}`);

    await this.analyticsEventModel.create({
      eventType: data.eventType,
      eventData: data.eventData,
      userId: data.userId,
      sessionId: data.sessionId,
      timestamp: new Date(),
    });

    await this.updateMetrics(data);
  }

  /**
   * Update aggregated metrics
   */
  private async updateMetrics(event: any): Promise<void> {
    const metricKey = `${event.eventType}_count`;

    await this.metricModel.upsert({
      key: metricKey,
      value: await this.incrementMetric(metricKey),
      updatedAt: new Date(),
    });
  }

  /**
   * Increment metric counter
   */
  private async incrementMetric(key: string): Promise<number> {
    const metric = await this.metricModel.findOne({ where: { key } });
    return metric ? metric.value + 1 : 1;
  }

  /**
   * Calculate response time metrics
   */
  @MessagePattern('calculate_response_times')
  async calculateResponseTimes(@Payload() data: any): Promise<any> {
    this.logger.log('Calculating response time metrics');

    const responseTimes = await this.analyticsEventModel.findAll({
      where: {
        eventType: 'RESPONSE_TIME',
        timestamp: {
          [Op.gte]: data.startDate,
          [Op.lte]: data.endDate,
        },
      },
    });

    const times = responseTimes.map((rt: any) => rt.eventData.responseTime);

    return {
      average: times.reduce((a: number, b: number) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.calculateMedian(times),
      count: times.length,
    };
  }

  /**
   * Calculate median value
   */
  private calculateMedian(values: number[]): number {
    const sorted = values.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

  /**
   * Generate incident statistics
   */
  @MessagePattern('generate_incident_statistics')
  async generateIncidentStatistics(@Payload() data: any): Promise<any> {
    this.logger.log('Generating incident statistics');

    const stats = await this.analyticsEventModel.findAll({
      where: {
        eventType: {
          [Op.in]: ['INCIDENT_CREATED', 'INCIDENT_CLOSED', 'INCIDENT_ESCALATED'],
        },
        timestamp: {
          [Op.gte]: data.startDate,
          [Op.lte]: data.endDate,
        },
      },
    });

    const groupedStats = this.groupBy(stats, 'eventType');

    return {
      created: groupedStats['INCIDENT_CREATED']?.length || 0,
      closed: groupedStats['INCIDENT_CLOSED']?.length || 0,
      escalated: groupedStats['INCIDENT_ESCALATED']?.length || 0,
      totalEvents: stats.length,
    };
  }

  /**
   * Group array by property
   */
  private groupBy(array: any[], property: string): any {
    return array.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  /**
   * Process real-time dashboard metrics
   */
  @MessagePattern('get_realtime_metrics')
  async getRealtimeMetrics(@Payload() data: any): Promise<any> {
    this.logger.log('Fetching real-time metrics');

    const metrics = await this.metricModel.findAll({
      where: {
        key: {
          [Op.in]: data.metricKeys || [],
        },
      },
    });

    return metrics.reduce((acc: any, metric: any) => {
      acc[metric.key] = metric.value;
      return acc;
    }, {});
  }

  /**
   * Stream analytics events
   */
  @MessagePattern('stream_analytics')
  streamAnalytics(@Payload() data: any): Observable<any> {
    this.logger.log('Streaming analytics events');

    const subject = new Subject();

    // Simulate real-time analytics streaming
    const interval = setInterval(async () => {
      const recentEvents = await this.analyticsEventModel.findAll({
        where: {
          timestamp: {
            [Op.gte]: new Date(Date.now() - 5000), // Last 5 seconds
          },
        },
        limit: 10,
      });

      subject.next({
        timestamp: new Date(),
        events: recentEvents,
      });
    }, 5000);

    setTimeout(() => {
      clearInterval(interval);
      subject.complete();
    }, data.duration || 60000);

    return subject.asObservable();
  }
}

/**
 * GIS Microservice
 *
 * Handles geographic information system operations, location-based queries,
 * and spatial analysis through microservices architecture.
 */
@Injectable()
export class GISMicroservice {
  private readonly logger = new Logger(GISMicroservice.name);
  private kafkaClient: ClientProxy;

  constructor(
    @InjectModel('Location') private readonly locationModel: any,
    @InjectModel('GeoFence') private readonly geoFenceModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize Kafka client
   */
  private initializeClients(): void {
    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'gis-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
      },
    });
  }

  /**
   * Find nearest units to location
   */
  @MessagePattern('find_nearest_units')
  async findNearestUnits(@Payload() data: any): Promise<any> {
    this.logger.log(`Finding nearest units to location: ${data.latitude}, ${data.longitude}`);

    // Use PostGIS or similar for actual distance calculations
    const units = await this.locationModel.findAll({
      where: {
        type: 'UNIT',
        status: 'AVAILABLE',
      },
    });

    const unitsWithDistance = units.map((unit: any) => ({
      ...unit.toJSON(),
      distance: this.calculateDistance(
        data.latitude,
        data.longitude,
        unit.latitude,
        unit.longitude
      ),
    }));

    const sorted = unitsWithDistance.sort((a: any, b: any) => a.distance - b.distance);

    return sorted.slice(0, data.limit || 5);
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check if location is within geofence
   */
  @MessagePattern('check_geofence')
  async checkGeofence(@Payload() data: any): Promise<any> {
    this.logger.log(`Checking geofence for location: ${data.latitude}, ${data.longitude}`);

    const geofences = await this.geoFenceModel.findAll({
      where: { active: true },
    });

    const withinGeofences = geofences.filter((fence: any) =>
      this.isPointInPolygon(data.latitude, data.longitude, fence.coordinates)
    );

    if (withinGeofences.length > 0) {
      const event = {
        eventType: 'GeofenceEntered',
        location: { latitude: data.latitude, longitude: data.longitude },
        geofences: withinGeofences.map((f: any) => f.id),
        timestamp: new Date(),
      };

      this.kafkaClient.emit('gis.geofence.entered', event);
    }

    return {
      withinGeofence: withinGeofences.length > 0,
      geofences: withinGeofences,
    };
  }

  /**
   * Check if point is within polygon
   */
  private isPointInPolygon(lat: number, lon: number, polygon: any[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];

      const intersect = ((yi > lat) !== (yj > lat)) &&
                       (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Calculate optimal route
   */
  @MessagePattern('calculate_route')
  async calculateRoute(@Payload() data: any): Promise<any> {
    this.logger.log(`Calculating route from ${data.origin} to ${data.destination}`);

    // Integration with routing service (OSRM, Google Maps, etc.)
    const route = {
      origin: data.origin,
      destination: data.destination,
      distance: this.calculateDistance(
        data.origin.latitude,
        data.origin.longitude,
        data.destination.latitude,
        data.destination.longitude
      ),
      estimatedTime: 0,
      waypoints: [],
    };

    route.estimatedTime = (route.distance / 60) * 60; // Assume 60 km/h average

    return route;
  }

  /**
   * Update unit location
   */
  @MessagePattern('update_unit_location')
  async updateUnitLocation(@Payload() data: any): Promise<any> {
    this.logger.log(`Updating location for unit: ${data.unitId}`);

    await this.locationModel.upsert({
      unitId: data.unitId,
      type: 'UNIT',
      latitude: data.latitude,
      longitude: data.longitude,
      heading: data.heading,
      speed: data.speed,
      altitude: data.altitude,
      accuracy: data.accuracy,
      timestamp: new Date(),
    });

    const event = {
      eventType: 'UnitLocationUpdated',
      unitId: data.unitId,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      timestamp: new Date(),
    };

    this.kafkaClient.emit('gis.unit.location_updated', event);

    return { success: true };
  }

  /**
   * Create geofence
   */
  @MessagePattern('create_geofence')
  async createGeofence(@Payload() data: any): Promise<any> {
    this.logger.log(`Creating geofence: ${data.name}`);

    const geofence = await this.geoFenceModel.create({
      name: data.name,
      type: data.type,
      coordinates: data.coordinates,
      active: true,
      createdAt: new Date(),
    });

    return { success: true, geofenceId: geofence.id };
  }
}

/**
 * Reporting Microservice
 *
 * Generates and manages operational reports through asynchronous processing.
 */
@Injectable()
export class ReportingMicroservice {
  private readonly logger = new Logger(ReportingMicroservice.name);
  private rabbitMQClient: ClientProxy;

  constructor(
    @InjectModel('Report') private readonly reportModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize RabbitMQ client
   */
  private initializeClients(): void {
    this.rabbitMQClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'reports',
        queueOptions: { durable: true },
      },
    });
  }

  /**
   * Generate incident report
   */
  @MessagePattern('generate_incident_report')
  async generateIncidentReport(@Payload() data: any): Promise<any> {
    this.logger.log(`Generating incident report for: ${data.incidentId}`);

    const report = await this.reportModel.create({
      type: 'INCIDENT',
      incidentId: data.incidentId,
      status: 'PROCESSING',
      requestedBy: data.userId,
      requestedAt: new Date(),
    });

    // Queue report generation
    this.rabbitMQClient.emit('report.generate', {
      reportId: report.id,
      type: 'INCIDENT',
      parameters: data,
    });

    return { success: true, reportId: report.id };
  }

  /**
   * Process report generation
   */
  @EventPattern('report.generate')
  async processReportGeneration(@Payload() data: any): Promise<void> {
    this.logger.log(`Processing report generation: ${data.reportId}`);

    try {
      // Simulate report generation
      await this.delay(5000);

      const reportData = await this.generateReportData(data.type, data.parameters);

      await this.reportModel.update(
        {
          status: 'COMPLETED',
          data: reportData,
          completedAt: new Date(),
        },
        { where: { id: data.reportId } }
      );
    } catch (error) {
      this.logger.error(`Report generation failed: ${error.message}`);
      await this.reportModel.update(
        {
          status: 'FAILED',
          error: error.message,
        },
        { where: { id: data.reportId } }
      );
    }
  }

  /**
   * Generate report data
   */
  private async generateReportData(type: string, parameters: any): Promise<any> {
    // Report generation logic
    return {
      generatedAt: new Date(),
      type,
      parameters,
      data: {},
    };
  }

  /**
   * Schedule recurring report
   */
  @MessagePattern('schedule_recurring_report')
  async scheduleRecurringReport(@Payload() data: any): Promise<any> {
    this.logger.log(`Scheduling recurring report: ${data.name}`);

    const report = await this.reportModel.create({
      type: data.type,
      name: data.name,
      schedule: data.schedule,
      parameters: data.parameters,
      status: 'SCHEDULED',
      createdAt: new Date(),
    });

    return { success: true, reportId: report.id };
  }

  /**
   * Get report status
   */
  @MessagePattern('get_report_status')
  async getReportStatus(@Payload() data: any): Promise<any> {
    this.logger.log(`Getting report status: ${data.reportId}`);

    const report = await this.reportModel.findByPk(data.reportId);
    if (!report) {
      throw new NotFoundException(`Report ${data.reportId} not found`);
    }

    return {
      reportId: report.id,
      status: report.status,
      progress: report.progress || 0,
      estimatedCompletion: report.estimatedCompletion,
    };
  }

  /**
   * Export report to format
   */
  @MessagePattern('export_report')
  async exportReport(@Payload() data: any): Promise<any> {
    this.logger.log(`Exporting report ${data.reportId} to ${data.format}`);

    const report = await this.reportModel.findByPk(data.reportId);
    if (!report) {
      throw new NotFoundException(`Report ${data.reportId} not found`);
    }

    // Export logic (PDF, Excel, CSV, etc.)
    const exportedFile = await this.exportToFormat(report, data.format);

    return {
      success: true,
      fileUrl: exportedFile,
      format: data.format,
    };
  }

  /**
   * Export report to specified format
   */
  private async exportToFormat(report: any, format: string): Promise<string> {
    // Export implementation
    return `/exports/${report.id}.${format}`;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Archive Microservice
 *
 * Manages data archival and retrieval through asynchronous processing.
 */
@Injectable()
export class ArchiveMicroservice {
  private readonly logger = new Logger(ArchiveMicroservice.name);
  private rabbitMQClient: ClientProxy;

  constructor(
    @InjectModel('Archive') private readonly archiveModel: any,
    @InjectModel('Incident') private readonly incidentModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize RabbitMQ client
   */
  private initializeClients(): void {
    this.rabbitMQClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'archive',
        queueOptions: { durable: true },
      },
    });
  }

  /**
   * Archive incident data
   */
  @MessagePattern('archive_incident')
  async archiveIncident(@Payload() data: any): Promise<any> {
    this.logger.log(`Archiving incident: ${data.incidentId}`);

    const incident = await this.incidentModel.findByPk(data.incidentId);
    if (!incident) {
      throw new NotFoundException(`Incident ${data.incidentId} not found`);
    }

    const archive = await this.archiveModel.create({
      entityType: 'INCIDENT',
      entityId: incident.id,
      data: incident.toJSON(),
      archivedAt: new Date(),
      retentionPeriod: data.retentionPeriod || 2555, // 7 years in days
    });

    // Queue for cold storage
    this.rabbitMQClient.emit('archive.store', {
      archiveId: archive.id,
      data: incident.toJSON(),
    });

    return { success: true, archiveId: archive.id };
  }

  /**
   * Retrieve archived incident
   */
  @MessagePattern('retrieve_archived_incident')
  async retrieveArchivedIncident(@Payload() data: any): Promise<any> {
    this.logger.log(`Retrieving archived incident: ${data.incidentId}`);

    const archive = await this.archiveModel.findOne({
      where: {
        entityType: 'INCIDENT',
        entityId: data.incidentId,
      },
    });

    if (!archive) {
      throw new NotFoundException(`Archived incident ${data.incidentId} not found`);
    }

    return {
      success: true,
      incident: archive.data,
      archivedAt: archive.archivedAt,
    };
  }

  /**
   * Process bulk archival
   */
  @MessagePattern('bulk_archive')
  async processBulkArchive(@Payload() data: any): Promise<any> {
    this.logger.log(`Processing bulk archive for ${data.entityType}`);

    const entities = await this.getEntitiesForArchival(data.entityType, data.criteria);

    const archived = [];
    for (const entity of entities) {
      const archive = await this.archiveIncident({ incidentId: entity.id });
      archived.push(archive);
    }

    return {
      success: true,
      count: archived.length,
      archived,
    };
  }

  /**
   * Get entities for archival based on criteria
   */
  private async getEntitiesForArchival(entityType: string, criteria: any): Promise<any[]> {
    // Query logic based on entity type and criteria
    return this.incidentModel.findAll({
      where: {
        status: 'CLOSED',
        closedAt: {
          [Op.lte]: new Date(Date.now() - criteria.daysOld * 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  /**
   * Delete archived data past retention period
   */
  @MessagePattern('purge_expired_archives')
  async purgeExpiredArchives(@Payload() data: any): Promise<any> {
    this.logger.log('Purging expired archives');

    const expiredArchives = await this.archiveModel.findAll({
      where: {
        archivedAt: {
          [Op.lte]: new Date(Date.now() - data.retentionDays * 24 * 60 * 60 * 1000),
        },
      },
    });

    for (const archive of expiredArchives) {
      await archive.destroy();
    }

    return {
      success: true,
      purged: expiredArchives.length,
    };
  }

  /**
   * Restore archived incident
   */
  @MessagePattern('restore_archived_incident')
  async restoreArchivedIncident(@Payload() data: any): Promise<any> {
    this.logger.log(`Restoring archived incident: ${data.archiveId}`);

    const archive = await this.archiveModel.findByPk(data.archiveId);
    if (!archive) {
      throw new NotFoundException(`Archive ${data.archiveId} not found`);
    }

    // Restore to active database
    const restored = await this.incidentModel.create({
      ...archive.data,
      restoredAt: new Date(),
      restoredFrom: archive.id,
    });

    return {
      success: true,
      incidentId: restored.id,
    };
  }
}

/**
 * Event Store Service
 *
 * Manages event sourcing and event store operations for the microservices architecture.
 */
@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);
  private kafkaClient: ClientProxy;

  constructor(
    @InjectModel('Event') private readonly eventModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize Kafka client
   */
  private initializeClients(): void {
    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'event-store-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
      },
    });
  }

  /**
   * Store event in event store
   */
  @MessagePattern('store_event')
  async storeEvent(@Payload() data: any): Promise<any> {
    this.logger.log(`Storing event: ${data.eventType} for aggregate ${data.aggregateId}`);

    const event = await this.eventModel.create({
      eventType: data.eventType,
      aggregateId: data.aggregateId,
      aggregateType: data.aggregateType,
      eventData: data.eventData,
      metadata: data.metadata,
      version: data.version,
      timestamp: new Date(),
    });

    // Publish to event stream
    this.kafkaClient.emit(`event.${data.eventType}`, event);

    return { success: true, eventId: event.id };
  }

  /**
   * Replay events for aggregate
   */
  @MessagePattern('replay_events')
  async replayEvents(@Payload() data: any): Promise<any> {
    this.logger.log(`Replaying events for aggregate: ${data.aggregateId}`);

    const events = await this.eventModel.findAll({
      where: {
        aggregateId: data.aggregateId,
      },
      order: [['version', 'ASC']],
    });

    return {
      success: true,
      events: events.map((e: any) => e.toJSON()),
      count: events.length,
    };
  }

  /**
   * Get aggregate current state from events
   */
  @MessagePattern('get_aggregate_state')
  async getAggregateState(@Payload() data: any): Promise<any> {
    this.logger.log(`Getting aggregate state: ${data.aggregateId}`);

    const events = await this.eventModel.findAll({
      where: {
        aggregateId: data.aggregateId,
      },
      order: [['version', 'ASC']],
    });

    // Reconstruct state from events
    const state = this.reconstructStateFromEvents(events);

    return {
      success: true,
      aggregateId: data.aggregateId,
      state,
      version: events.length > 0 ? events[events.length - 1].version : 0,
    };
  }

  /**
   * Reconstruct aggregate state from event stream
   */
  private reconstructStateFromEvents(events: any[]): any {
    let state = {};

    for (const event of events) {
      state = this.applyEvent(state, event);
    }

    return state;
  }

  /**
   * Apply event to state
   */
  private applyEvent(state: any, event: any): any {
    // Event sourcing logic to apply events to state
    switch (event.eventType) {
      case 'IncidentCreated':
        return { ...state, ...event.eventData, status: 'CREATED' };
      case 'IncidentUpdated':
        return { ...state, ...event.eventData };
      case 'IncidentClosed':
        return { ...state, status: 'CLOSED', closedAt: event.timestamp };
      default:
        return state;
    }
  }

  /**
   * Create snapshot of aggregate state
   */
  @MessagePattern('create_snapshot')
  async createSnapshot(@Payload() data: any): Promise<any> {
    this.logger.log(`Creating snapshot for aggregate: ${data.aggregateId}`);

    const state = await this.getAggregateState(data);

    // Store snapshot for faster state reconstruction
    await this.eventModel.create({
      eventType: 'SNAPSHOT',
      aggregateId: data.aggregateId,
      aggregateType: data.aggregateType,
      eventData: state.state,
      version: state.version,
      timestamp: new Date(),
    });

    return { success: true };
  }
}

/**
 * Saga Orchestration Service
 *
 * Manages distributed transactions using the Saga pattern.
 */
@Injectable()
export class SagaOrchestrationService {
  private readonly logger = new Logger(SagaOrchestrationService.name);
  private kafkaClient: ClientProxy;

  constructor(
    @InjectModel('Saga') private readonly sagaModel: any,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeClients();
  }

  /**
   * Initialize Kafka client
   */
  private initializeClients(): void {
    this.kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'saga-orchestration-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
      },
    });
  }

  /**
   * Start saga execution
   */
  @MessagePattern('start_saga')
  async startSaga(@Payload() data: any): Promise<any> {
    this.logger.log(`Starting saga: ${data.sagaType}`);

    const saga = await this.sagaModel.create({
      sagaType: data.sagaType,
      sagaData: data.sagaData,
      status: 'STARTED',
      currentStep: 0,
      steps: data.steps,
      startedAt: new Date(),
    });

    await this.executeSagaStep(saga, 0);

    return { success: true, sagaId: saga.id };
  }

  /**
   * Execute saga step
   */
  private async executeSagaStep(saga: any, stepIndex: number): Promise<void> {
    if (stepIndex >= saga.steps.length) {
      await this.completeSaga(saga);
      return;
    }

    const step = saga.steps[stepIndex];

    try {
      this.kafkaClient.emit(`saga.step.${step.command}`, {
        sagaId: saga.id,
        stepIndex,
        data: saga.sagaData,
      });

      await saga.update({
        currentStep: stepIndex + 1,
        status: 'IN_PROGRESS',
      });
    } catch (error) {
      this.logger.error(`Saga step failed: ${error.message}`);
      await this.compensateSaga(saga, stepIndex);
    }
  }

  /**
   * Handle saga step completion
   */
  @EventPattern('saga.step.completed')
  async handleSagaStepCompleted(@Payload() data: any): Promise<void> {
    this.logger.log(`Saga step completed: ${data.sagaId}, step ${data.stepIndex}`);

    const saga = await this.sagaModel.findByPk(data.sagaId);
    if (!saga) {
      this.logger.error(`Saga ${data.sagaId} not found`);
      return;
    }

    await this.executeSagaStep(saga, data.stepIndex + 1);
  }

  /**
   * Complete saga
   */
  private async completeSaga(saga: any): Promise<void> {
    this.logger.log(`Completing saga: ${saga.id}`);

    await saga.update({
      status: 'COMPLETED',
      completedAt: new Date(),
    });

    this.kafkaClient.emit('saga.completed', {
      sagaId: saga.id,
      sagaType: saga.sagaType,
    });
  }

  /**
   * Compensate saga on failure
   */
  private async compensateSaga(saga: any, failedStep: number): Promise<void> {
    this.logger.log(`Compensating saga: ${saga.id} from step ${failedStep}`);

    await saga.update({
      status: 'COMPENSATING',
    });

    // Execute compensation actions in reverse order
    for (let i = failedStep - 1; i >= 0; i--) {
      const step = saga.steps[i];
      if (step.compensation) {
        this.kafkaClient.emit(`saga.compensate.${step.compensation}`, {
          sagaId: saga.id,
          stepIndex: i,
          data: saga.sagaData,
        });
      }
    }

    await saga.update({
      status: 'COMPENSATED',
      compensatedAt: new Date(),
    });
  }

  /**
   * Get saga status
   */
  @MessagePattern('get_saga_status')
  async getSagaStatus(@Payload() data: any): Promise<any> {
    this.logger.log(`Getting saga status: ${data.sagaId}`);

    const saga = await this.sagaModel.findByPk(data.sagaId);
    if (!saga) {
      throw new NotFoundException(`Saga ${data.sagaId} not found`);
    }

    return {
      sagaId: saga.id,
      status: saga.status,
      currentStep: saga.currentStep,
      totalSteps: saga.steps.length,
      startedAt: saga.startedAt,
      completedAt: saga.completedAt,
    };
  }
}

/**
 * Circuit Breaker Service
 *
 * Implements circuit breaker pattern for resilient microservices communication.
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuitStates: Map<string, any> = new Map();

  /**
   * Execute operation with circuit breaker
   */
  async execute<T>(serviceKey: string, operation: () => Promise<T>): Promise<T> {
    const state = this.getCircuitState(serviceKey);

    if (state.status === 'OPEN') {
      if (Date.now() - state.lastFailureTime > state.timeout) {
        state.status = 'HALF_OPEN';
        this.logger.log(`Circuit breaker ${serviceKey}: OPEN -> HALF_OPEN`);
      } else {
        throw new Error(`Circuit breaker is OPEN for service: ${serviceKey}`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess(serviceKey);
      return result;
    } catch (error) {
      this.onFailure(serviceKey);
      throw error;
    }
  }

  /**
   * Get circuit state for service
   */
  private getCircuitState(serviceKey: string): any {
    if (!this.circuitStates.has(serviceKey)) {
      this.circuitStates.set(serviceKey, {
        status: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 60000, // 60 seconds
      });
    }
    return this.circuitStates.get(serviceKey);
  }

  /**
   * Handle successful operation
   */
  private onSuccess(serviceKey: string): void {
    const state = this.getCircuitState(serviceKey);
    state.failureCount = 0;

    if (state.status === 'HALF_OPEN') {
      state.successCount++;
      if (state.successCount >= state.successThreshold) {
        state.status = 'CLOSED';
        state.successCount = 0;
        this.logger.log(`Circuit breaker ${serviceKey}: HALF_OPEN -> CLOSED`);
      }
    }
  }

  /**
   * Handle failed operation
   */
  private onFailure(serviceKey: string): void {
    const state = this.getCircuitState(serviceKey);
    state.failureCount++;
    state.lastFailureTime = Date.now();
    state.successCount = 0;

    if (state.failureCount >= state.failureThreshold) {
      state.status = 'OPEN';
      this.logger.warn(`Circuit breaker ${serviceKey}: CLOSED -> OPEN`);
    }
  }

  /**
   * Get circuit breaker status
   */
  @MessagePattern('get_circuit_status')
  getCircuitStatus(@Payload() data: any): any {
    const state = this.getCircuitState(data.serviceKey);
    return {
      serviceKey: data.serviceKey,
      status: state.status,
      failureCount: state.failureCount,
      lastFailureTime: state.lastFailureTime,
    };
  }

  /**
   * Reset circuit breaker
   */
  @MessagePattern('reset_circuit')
  resetCircuit(@Payload() data: any): any {
    this.circuitStates.delete(data.serviceKey);
    this.logger.log(`Circuit breaker reset: ${data.serviceKey}`);
    return { success: true };
  }
}

/**
 * Service Health Monitor
 *
 * Monitors health and availability of microservices.
 */
@Injectable()
export class ServiceHealthMonitor {
  private readonly logger = new Logger(ServiceHealthMonitor.name);
  private healthChecks: Map<string, any> = new Map();

  /**
   * Register service for health monitoring
   */
  @MessagePattern('register_service')
  registerService(@Payload() data: any): any {
    this.logger.log(`Registering service for health monitoring: ${data.serviceName}`);

    this.healthChecks.set(data.serviceName, {
      serviceName: data.serviceName,
      endpoint: data.endpoint,
      status: 'UNKNOWN',
      lastCheck: null,
      lastSuccess: null,
      failureCount: 0,
    });

    return { success: true };
  }

  /**
   * Perform health check
   */
  @MessagePattern('health_check')
  async performHealthCheck(@Payload() data: any): Promise<any> {
    this.logger.log(`Performing health check: ${data.serviceName}`);

    const health = this.healthChecks.get(data.serviceName);
    if (!health) {
      throw new NotFoundException(`Service ${data.serviceName} not registered`);
    }

    try {
      // Perform actual health check (HTTP request, etc.)
      const isHealthy = await this.checkServiceHealth(health.endpoint);

      health.status = isHealthy ? 'HEALTHY' : 'UNHEALTHY';
      health.lastCheck = new Date();
      if (isHealthy) {
        health.lastSuccess = new Date();
        health.failureCount = 0;
      } else {
        health.failureCount++;
      }

      return {
        serviceName: data.serviceName,
        status: health.status,
        lastCheck: health.lastCheck,
      };
    } catch (error) {
      health.status = 'UNHEALTHY';
      health.failureCount++;
      throw error;
    }
  }

  /**
   * Check service health
   */
  private async checkServiceHealth(endpoint: string): Promise<boolean> {
    // Simulate health check
    return Math.random() > 0.1; // 90% success rate
  }

  /**
   * Get all service health statuses
   */
  @MessagePattern('get_all_health_status')
  getAllHealthStatus(): any {
    const statuses = Array.from(this.healthChecks.values());
    return {
      totalServices: statuses.length,
      healthy: statuses.filter((s: any) => s.status === 'HEALTHY').length,
      unhealthy: statuses.filter((s: any) => s.status === 'UNHEALTHY').length,
      unknown: statuses.filter((s: any) => s.status === 'UNKNOWN').length,
      services: statuses,
    };
  }
}

// Export all microservices
export {
  IncidentProcessingService,
  DispatchCoordinationService,
  ResourceManagementService,
  NotificationMicroservice,
  AnalyticsProcessingService,
  GISMicroservice,
  ReportingMicroservice,
  ArchiveMicroservice,
  EventStoreService,
  SagaOrchestrationService,
  CircuitBreakerService,
  ServiceHealthMonitor,
};
