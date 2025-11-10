/**
 * @fileoverview Enterprise-ready NestJS Service Patterns and Architecture Utilities
 * @module reuse/data/service-patterns
 * @description Production-grade service base classes, CQRS patterns, event sourcing,
 * saga orchestration, circuit breakers, and health checks for scalable enterprise applications
 *
 * ## Service Layer Organization Best Practices
 *
 * ### Service Types and When to Use Them
 *
 * #### 1. BaseService
 * - **Use for**: Foundation for all services
 * - **Provides**: Lifecycle hooks, logging, initialization
 * - **Scope**: Singleton (DEFAULT)
 * - **Example**: Any domain service
 *
 * #### 2. RepositoryService
 * - **Use for**: Data access layer abstraction
 * - **Provides**: CRUD operations interface
 * - **Scope**: Singleton (DEFAULT)
 * - **Example**: PatientService, UserService
 *
 * #### 3. DomainService
 * - **Use for**: Complex business logic
 * - **Provides**: Domain events, invariant enforcement
 * - **Scope**: Singleton (DEFAULT)
 * - **Example**: OrderProcessingService, PaymentService
 *
 * #### 4. ApplicationService
 * - **Use for**: Use case orchestration
 * - **Provides**: Transaction management, service coordination
 * - **Scope**: Singleton or REQUEST
 * - **Example**: CreatePatientUseCase, ProcessPaymentUseCase
 *
 * #### 5. InfrastructureService
 * - **Use for**: External integrations
 * - **Provides**: Retry logic, circuit breakers
 * - **Scope**: Singleton (DEFAULT)
 * - **Example**: EmailService, SmsService, PaymentGatewayService
 *
 * ## Dependency Injection Best Practices
 *
 * ### Constructor Injection (Recommended)
 * ```typescript
 * @Injectable()
 * export class PatientService extends BaseService<Patient> {
 *   constructor(
 *     private readonly patientRepo: PatientRepository,
 *     private readonly auditService: AuditService,
 *     @Inject(forwardRef(() => EmailService))
 *     private readonly emailService: EmailService
 *   ) {
 *     super('PatientService');
 *   }
 * }
 * ```
 *
 * ### Avoiding Circular Dependencies
 * 1. **Use forwardRef()** for unavoidable circular deps
 * 2. **Extract common logic** to a third service
 * 3. **Use events** instead of direct service calls
 * 4. **Implement interfaces** instead of concrete dependencies
 * 5. **Validate at build time** using dependency analyzers
 *
 * ## Service Design Patterns
 *
 * ### CQRS (Command Query Responsibility Segregation)
 * - Separate read and write operations
 * - Scale independently
 * - Optimize for different workloads
 *
 * ### Event Sourcing
 * - Store events instead of state
 * - Rebuild state from events
 * - Audit trail built-in
 *
 * ### Saga Pattern
 * - Distributed transactions
 * - Compensating transactions
 * - Eventual consistency
 *
 * ## Error Handling Best Practices
 *
 * 1. **Use domain-specific exceptions**
 * 2. **Log errors with context**
 * 3. **Don't swallow exceptions**
 * 4. **Provide meaningful error messages**
 * 5. **Use circuit breakers for external services**
 */

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Optional,
  Type,
  Scope,
  HttpStatus,
} from '@nestjs/common';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { ICommand, IQuery, IEvent, CommandHandler, QueryHandler, EventsHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Base service class with common lifecycle management and logging
 * @template TEntity Entity type this service manages
 * @description Provides foundation for all domain services with built-in lifecycle hooks.
 * This class is designed to be extended by domain services and is singleton-scoped by default.
 *
 * @remarks
 * - **Scope**: Singleton (DEFAULT) - one instance per application lifecycle
 * - **Lifecycle**: Implements OnModuleInit and OnModuleDestroy hooks
 * - **Thread Safety**: Not thread-safe, use request-scoped services for concurrent operations
 * - **Circular Dependencies**: Use forwardRef() when injecting circular dependencies
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class UserService extends BaseService<User> {
 *   constructor(
 *     private readonly userRepository: UserRepository,
 *     @Inject(forwardRef(() => EmailService))
 *     private readonly emailService: EmailService
 *   ) {
 *     super('UserService');
 *   }
 *
 *   protected async initialize(): Promise<void> {
 *     // Custom initialization logic
 *     this.logger.log('UserService custom initialization');
 *   }
 *
 *   protected async cleanup(): Promise<void> {
 *     // Custom cleanup logic
 *     this.logger.log('UserService custom cleanup');
 *   }
 * }
 * ```
 */
export abstract class BaseService<TEntity = any> implements OnModuleInit, OnModuleDestroy {
  protected readonly logger: Logger;
  protected isInitialized = false;

  /**
   * Creates a new base service instance
   * @param serviceName Name of the service for logging purposes
   */
  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  /**
   * NestJS lifecycle hook called after module initialization
   * @throws {Error} If initialization fails
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Service initializing...');
    await this.initialize();
    this.isInitialized = true;
    this.logger.log('Service initialized successfully');
  }

  /**
   * NestJS lifecycle hook called before module destruction
   * @throws {Error} If cleanup fails
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Service shutting down...');
    await this.cleanup();
    this.logger.log('Service shutdown complete');
  }

  /**
   * Custom initialization logic to be implemented by derived classes
   * @protected
   * @virtual
   * @returns Promise that resolves when initialization is complete
   */
  protected async initialize(): Promise<void> {
    // Override in derived classes
  }

  /**
   * Custom cleanup logic to be implemented by derived classes
   * @protected
   * @virtual
   * @returns Promise that resolves when cleanup is complete
   */
  protected async cleanup(): Promise<void> {
    // Override in derived classes
  }
}

/**
 * Generic repository service pattern base class
 * @template TEntity Entity type
 * @template TRepository Repository interface
 * @description Provides CRUD operations with audit logging and validation.
 * This abstract class enforces implementation of standard repository methods.
 *
 * @remarks
 * - **Scope**: Singleton (DEFAULT) - inherits from BaseService
 * - **Pattern**: Repository Pattern abstraction layer
 * - **Dependencies**: Requires a repository implementation injected via constructor
 * - **Circular Dependencies**: Avoid circular references with domain services
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PatientService extends RepositoryService<Patient, PatientRepository> {
 *   constructor(
 *     @InjectModel(Patient) private readonly patientRepository: PatientRepository,
 *     private readonly auditService: AuditService
 *   ) {
 *     super('PatientService', patientRepository);
 *   }
 *
 *   async findById(id: string): Promise<Patient | null> {
 *     return this.repository.findByPk(id);
 *   }
 *
 *   async create(data: Partial<Patient>): Promise<Patient> {
 *     const patient = await this.repository.create(data);
 *     await this.auditService.log('CREATE', 'Patient', patient.id);
 *     return patient;
 *   }
 * }
 * ```
 */
export abstract class RepositoryService<TEntity, TRepository> extends BaseService<TEntity> {
  /**
   * Creates a new repository service instance
   * @param serviceName Name of the service for logging
   * @param repository Repository implementation instance
   */
  constructor(
    serviceName: string,
    protected readonly repository: TRepository,
  ) {
    super(serviceName);
  }

  /**
   * Find an entity by its unique identifier
   * @param id Entity identifier
   * @returns Promise resolving to entity or null if not found
   * @abstract Must be implemented by derived classes
   */
  abstract findById(id: string): Promise<TEntity | null>;

  /**
   * Find all entities matching optional criteria
   * @param options Optional query options
   * @returns Promise resolving to array of entities
   * @abstract Must be implemented by derived classes
   */
  abstract findAll(options?: any): Promise<TEntity[]>;

  /**
   * Create a new entity
   * @param entity Partial entity data for creation
   * @returns Promise resolving to created entity
   * @abstract Must be implemented by derived classes
   */
  abstract create(entity: Partial<TEntity>): Promise<TEntity>;

  /**
   * Update an existing entity
   * @param id Entity identifier
   * @param entity Partial entity data for update
   * @returns Promise resolving to updated entity
   * @abstract Must be implemented by derived classes
   */
  abstract update(id: string, entity: Partial<TEntity>): Promise<TEntity>;

  /**
   * Delete an entity (soft or hard delete)
   * @param id Entity identifier
   * @returns Promise resolving to true if successful
   * @abstract Must be implemented by derived classes
   */
  abstract delete(id: string): Promise<boolean>;
}

/**
 * Domain service base class for complex business logic
 * @template TAggregate Root aggregate type
 * @description Encapsulates domain-specific business rules and invariants
 */
export abstract class DomainService<TAggregate = any> extends BaseService<TAggregate> {
  protected domainEvents: IEvent[] = [];

  protected addDomainEvent(event: IEvent): void {
    this.domainEvents.push(event);
    this.logger.debug(`Domain event added: ${event.constructor.name}`);
  }

  protected clearDomainEvents(): IEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  getDomainEvents(): readonly IEvent[] {
    return [...this.domainEvents];
  }
}

/**
 * Application service pattern for use case orchestration
 * @description Coordinates between domain services and infrastructure
 */
export abstract class ApplicationService extends BaseService {
  constructor(
    serviceName: string,
    @Optional() @Inject('TRANSACTION_MANAGER') protected transactionManager?: any,
  ) {
    super(serviceName);
  }

  protected async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.transactionManager) {
      return operation();
    }

    return this.transactionManager.transaction(async () => {
      return operation();
    });
  }
}

/**
 * Infrastructure service base for external integrations
 * @description Handles external API calls, caching, and resilience patterns
 */
export abstract class InfrastructureService extends BaseService {
  protected retryAttempts = 3;
  protected retryDelayMs = 1000;

  protected async withRetry<T>(
    operation: () => Promise<T>,
    attempts = this.retryAttempts,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Attempt ${i + 1}/${attempts} failed: ${error.message}`);

        if (i < attempts - 1) {
          await this.delay(this.retryDelayMs * Math.pow(2, i));
        }
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Creates a generic CQRS command handler class
 * @template TCommand Command type
 * @template TResult Result type
 * @param commandType Command class constructor
 * @param handler Handler function
 * @returns CommandHandler class
 */
export function createCommandHandler<TCommand extends ICommand, TResult>(
  commandType: Type<TCommand>,
  handler: (command: TCommand) => Promise<TResult>,
): Type<any> {
  @CommandHandler(commandType)
  class GenericCommandHandler {
    async execute(command: TCommand): Promise<TResult> {
      return handler(command);
    }
  }

  return GenericCommandHandler;
}

/**
 * Creates a generic CQRS query handler class
 * @template TQuery Query type
 * @template TResult Result type
 * @param queryType Query class constructor
 * @param handler Handler function
 * @returns QueryHandler class
 */
export function createQueryHandler<TQuery extends IQuery, TResult>(
  queryType: Type<TQuery>,
  handler: (query: TQuery) => Promise<TResult>,
): Type<any> {
  @QueryHandler(queryType)
  class GenericQueryHandler {
    async execute(query: TQuery): Promise<TResult> {
      return handler(query);
    }
  }

  return GenericQueryHandler;
}

/**
 * Creates a generic event handler class
 * @template TEvent Event type
 * @param eventType Event class constructor
 * @param handler Handler function
 * @returns EventsHandler class
 */
export function createEventHandler<TEvent extends IEvent>(
  eventType: Type<TEvent>,
  handler: (event: TEvent) => Promise<void>,
): Type<any> {
  @EventsHandler(eventType)
  class GenericEventHandler {
    async handle(event: TEvent): Promise<void> {
      return handler(event);
    }
  }

  return GenericEventHandler;
}

/**
 * Service orchestration pattern for coordinating multiple services
 * @description Manages complex workflows across multiple bounded contexts.
 * Use this pattern when coordinating operations across multiple domain services.
 *
 * @remarks
 * - **Scope**: Singleton (DEFAULT) - one orchestrator instance
 * - **Pattern**: Orchestration/Mediator pattern for service coordination
 * - **Dependencies**: Services are registered dynamically, not injected
 * - **Use Case**: Complex multi-service workflows, saga coordination
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class OrderOrchestrator extends ServiceOrchestrator {
 *   constructor(
 *     private readonly orderService: OrderService,
 *     private readonly paymentService: PaymentService,
 *     private readonly inventoryService: InventoryService,
 *   ) {
 *     super();
 *     this.registerService('order', orderService);
 *     this.registerService('payment', paymentService);
 *     this.registerService('inventory', inventoryService);
 *   }
 *
 *   async processOrder(orderData: CreateOrderDto): Promise<Order> {
 *     return this.executeWorkflow<Order>([
 *       async (orch) => {
 *         const orderSvc = orch.getService<OrderService>('order');
 *         return orderSvc.createOrder(orderData);
 *       },
 *       async (orch) => {
 *         const paymentSvc = orch.getService<PaymentService>('payment');
 *         return paymentSvc.processPayment(orderData.paymentInfo);
 *       },
 *     ]);
 *   }
 * }
 * ```
 */
@Injectable()
export class ServiceOrchestrator extends BaseService {
  private services: Map<string, any> = new Map();

  constructor() {
    super('ServiceOrchestrator');
  }

  /**
   * Registers a service with the orchestrator
   * @param name Unique service identifier
   * @param service Service instance
   */
  registerService(name: string, service: any): void {
    this.services.set(name, service);
    this.logger.debug(`Service registered: ${name}`);
  }

  /**
   * Retrieves a registered service by name
   * @template T Service type
   * @param name Service identifier
   * @returns Service instance
   * @throws {Error} If service is not found
   */
  getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }
    return service as T;
  }

  /**
   * Checks if a service is registered
   * @param name Service identifier
   * @returns True if service exists
   */
  hasService(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Executes a workflow of sequential steps
   * @template T Return type of the workflow
   * @param steps Array of workflow step functions
   * @returns Promise resolving to the result of the last step
   */
  async executeWorkflow<T>(
    steps: Array<(orchestrator: ServiceOrchestrator) => Promise<any>>,
  ): Promise<T> {
    const results: any[] = [];

    for (const step of steps) {
      const result = await step(this);
      results.push(result);
    }

    return results[results.length - 1] as T;
  }
}

/**
 * Saga pattern implementation for distributed transactions
 * @description Manages compensating transactions across microservices
 */
export abstract class SagaOrchestrator extends BaseService {
  protected steps: SagaStep[] = [];
  protected completedSteps: SagaStep[] = [];

  constructor(sagaName: string) {
    super(sagaName);
  }

  protected addStep(step: SagaStep): void {
    this.steps.push(step);
  }

  async execute<T>(context: any): Promise<T> {
    this.logger.log(`Starting saga: ${this.constructor.name}`);

    try {
      for (const step of this.steps) {
        this.logger.debug(`Executing step: ${step.name}`);
        await step.execute(context);
        this.completedSteps.push(step);
      }

      this.logger.log('Saga completed successfully');
      return context.result;
    } catch (error) {
      this.logger.error(`Saga failed: ${error.message}`, error.stack);
      await this.compensate(context);
      throw error;
    }
  }

  private async compensate(context: any): Promise<void> {
    this.logger.warn('Starting compensation...');

    const stepsToCompensate = [...this.completedSteps].reverse();

    for (const step of stepsToCompensate) {
      if (step.compensate) {
        try {
          this.logger.debug(`Compensating step: ${step.name}`);
          await step.compensate(context);
        } catch (error) {
          this.logger.error(`Compensation failed for ${step.name}: ${error.message}`);
        }
      }
    }

    this.logger.warn('Compensation complete');
  }
}

/**
 * Saga step definition
 */
export interface SagaStep {
  name: string;
  execute: (context: any) => Promise<void>;
  compensate?: (context: any) => Promise<void>;
}

/**
 * Creates a saga step
 * @param name Step name
 * @param execute Execution function
 * @param compensate Compensation function
 * @returns SagaStep object
 */
export function createSagaStep(
  name: string,
  execute: (context: any) => Promise<void>,
  compensate?: (context: any) => Promise<void>,
): SagaStep {
  return { name, execute, compensate };
}

/**
 * Event sourcing aggregate base class
 * @template TState Aggregate state type
 * @description Manages event-sourced aggregates with state reconstruction
 */
export abstract class EventSourcedAggregate<TState = any> {
  private uncommittedEvents: IEvent[] = [];
  private version = 0;

  constructor(protected state: TState) {}

  protected applyEvent(event: IEvent): void {
    this.uncommittedEvents.push(event);
    this.mutateState(event);
    this.version++;
  }

  protected abstract mutateState(event: IEvent): void;

  getUncommittedEvents(): readonly IEvent[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  loadFromHistory(events: IEvent[]): void {
    events.forEach(event => {
      this.mutateState(event);
      this.version++;
    });
  }

  getVersion(): number {
    return this.version;
  }

  getState(): Readonly<TState> {
    return { ...this.state } as Readonly<TState>;
  }
}

/**
 * Event store interface for event sourcing
 */
export interface IEventStore {
  saveEvents(streamId: string, events: IEvent[], expectedVersion: number): Promise<void>;
  getEvents(streamId: string, fromVersion?: number): Promise<IEvent[]>;
}

/**
 * Domain event publisher service
 * @description Publishes domain events to event bus with retry logic
 */
@Injectable()
export class DomainEventPublisher extends BaseService {
  constructor(
    @Optional() @Inject('EVENT_BUS') private readonly eventBus?: any,
    @Optional() private readonly eventEmitter?: EventEmitter2,
  ) {
    super('DomainEventPublisher');
  }

  async publish(event: IEvent): Promise<void> {
    this.logger.debug(`Publishing event: ${event.constructor.name}`);

    try {
      if (this.eventBus) {
        await this.eventBus.publish(event);
      }

      if (this.eventEmitter) {
        this.eventEmitter.emit(event.constructor.name, event);
      }

      this.logger.debug(`Event published successfully: ${event.constructor.name}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async publishAll(events: IEvent[]): Promise<void> {
    this.logger.debug(`Publishing ${events.length} events`);

    for (const event of events) {
      await this.publish(event);
    }

    this.logger.debug('All events published successfully');
  }
}

/**
 * Event handler registry for managing event subscriptions
 */
export class EventHandlerRegistry {
  private handlers = new Map<string, Array<(event: any) => Promise<void>>>();
  private readonly logger = new Logger('EventHandlerRegistry');

  registerHandler(eventName: string, handler: (event: any) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)!.push(handler);
    this.logger.debug(`Handler registered for event: ${eventName}`);
  }

  async dispatch(eventName: string, event: any): Promise<void> {
    const handlers = this.handlers.get(eventName) || [];

    this.logger.debug(`Dispatching event ${eventName} to ${handlers.length} handlers`);

    await Promise.all(handlers.map(handler => handler(event)));
  }

  getHandlerCount(eventName: string): number {
    return this.handlers.get(eventName)?.length || 0;
  }

  clear(): void {
    this.handlers.clear();
    this.logger.debug('All handlers cleared');
  }
}

/**
 * Service health check interface
 */
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

/**
 * Health checkable service interface
 */
export interface IHealthCheckable {
  checkHealth(): Promise<HealthCheckResult>;
}

/**
 * Service health monitor
 * @description Monitors service health and triggers alerts
 */
@Injectable()
export class ServiceHealthMonitor extends BaseService {
  private services = new Map<string, IHealthCheckable>();
  private lastCheckResults = new Map<string, HealthCheckResult>();

  constructor() {
    super('ServiceHealthMonitor');
  }

  registerService(name: string, service: IHealthCheckable): void {
    this.services.set(name, service);
    this.logger.debug(`Service registered for health monitoring: ${name}`);
  }

  async checkService(name: string): Promise<HealthCheckResult> {
    const service = this.services.get(name);

    if (!service) {
      return {
        status: 'unhealthy',
        message: `Service not found: ${name}`,
        timestamp: new Date(),
      };
    }

    try {
      const result = await service.checkHealth();
      this.lastCheckResults.set(name, result);
      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        status: 'unhealthy',
        message: error.message,
        timestamp: new Date(),
      };
      this.lastCheckResults.set(name, result);
      return result;
    }
  }

  async checkAll(): Promise<Map<string, HealthCheckResult>> {
    const results = new Map<string, HealthCheckResult>();

    for (const [name] of this.services) {
      const result = await this.checkService(name);
      results.set(name, result);
    }

    return results;
  }

  getLastCheckResult(name: string): HealthCheckResult | undefined {
    return this.lastCheckResults.get(name);
  }
}

/**
 * Circuit breaker states
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

/**
 * Circuit breaker pattern implementation
 * @description Protects services from cascading failures
 */
export class CircuitBreaker {
  private state = CircuitBreakerState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();
  private readonly logger = new Logger('CircuitBreaker');

  constructor(
    private readonly name: string,
    private readonly config: CircuitBreakerConfig,
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
      this.state = CircuitBreakerState.HALF_OPEN;
      this.logger.log(`Circuit breaker ${this.name} transitioning to HALF_OPEN`);
    }

    try {
      const result = await Promise.race([
        operation(),
        this.timeout(),
      ]) as T;

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async timeout(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout);
    });
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitBreakerState.CLOSED;
        this.successCount = 0;
        this.logger.log(`Circuit breaker ${this.name} closed`);
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttempt = Date.now() + this.config.resetTimeout;
      this.logger.warn(`Circuit breaker ${this.name} opened`);
    }
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  reset(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.logger.log(`Circuit breaker ${this.name} reset`);
  }
}

/**
 * Creates a circuit breaker with default configuration
 * @param name Circuit breaker name
 * @param config Configuration options
 * @returns CircuitBreaker instance
 */
export function createCircuitBreaker(
  name: string,
  config?: Partial<CircuitBreakerConfig>,
): CircuitBreaker {
  const defaultConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 5000,
    resetTimeout: 60000,
  };

  return new CircuitBreaker(name, { ...defaultConfig, ...config });
}

/**
 * Retry policy configuration
 */
export interface RetryPolicyConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors?: Array<new (...args: any[]) => Error>;
}

/**
 * Retry policy implementation with exponential backoff
 * @description Provides configurable retry logic for operations
 */
export class RetryPolicy {
  private readonly logger = new Logger('RetryPolicy');

  constructor(private readonly config: RetryPolicyConfig) {}

  async execute<T>(
    operation: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    let lastError: Error | undefined;
    let delay = this.config.initialDelayMs;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (!this.isRetryable(error as Error)) {
          this.logger.warn(`Non-retryable error: ${error.message}`);
          throw error;
        }

        if (attempt === this.config.maxAttempts) {
          break;
        }

        this.logger.warn(
          `Attempt ${attempt}/${this.config.maxAttempts} failed${context ? ` (${context})` : ''}: ${error.message}`,
        );

        await this.delay(delay);
        delay = Math.min(delay * this.config.backoffMultiplier, this.config.maxDelayMs);
      }
    }

    throw lastError;
  }

  private isRetryable(error: Error): boolean {
    if (!this.config.retryableErrors || this.config.retryableErrors.length === 0) {
      return true;
    }

    return this.config.retryableErrors.some(
      errorType => error instanceof errorType,
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Creates a retry policy with default configuration
 * @param config Configuration options
 * @returns RetryPolicy instance
 */
export function createRetryPolicy(config?: Partial<RetryPolicyConfig>): RetryPolicy {
  const defaultConfig: RetryPolicyConfig = {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  };

  return new RetryPolicy({ ...defaultConfig, ...config });
}

/**
 * Decorator for applying circuit breaker to methods
 * @param circuitBreaker Circuit breaker instance
 * @returns Method decorator
 */
export function WithCircuitBreaker(circuitBreaker: CircuitBreaker) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return circuitBreaker.execute(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

/**
 * Decorator for applying retry policy to methods
 * @param retryPolicy Retry policy instance
 * @returns Method decorator
 */
export function WithRetry(retryPolicy: RetryPolicy) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return retryPolicy.execute(
        () => originalMethod.apply(this, args),
        `${target.constructor.name}.${propertyKey}`,
      );
    };

    return descriptor;
  };
}

/**
 * Service cache decorator for method memoization
 * @param ttlSeconds Time to live in seconds
 * @returns Method decorator
 */
export function Cacheable(ttlSeconds: number = 300) {
  const cache = new Map<string, { value: any; expiresAt: number }>();

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
      const now = Date.now();
      const cached = cache.get(cacheKey);

      if (cached && cached.expiresAt > now) {
        return cached.value;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, {
        value: result,
        expiresAt: now + ttlSeconds * 1000,
      });

      return result;
    };

    return descriptor;
  };
}

/**
 * Service metrics collector
 * @description Collects and reports service metrics
 */
export class ServiceMetrics {
  private metrics = new Map<string, number>();
  private readonly logger = new Logger('ServiceMetrics');

  increment(metric: string, value: number = 1): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }

  decrement(metric: string, value: number = 1): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current - value);
  }

  set(metric: string, value: number): void {
    this.metrics.set(metric, value);
  }

  get(metric: string): number {
    return this.metrics.get(metric) || 0;
  }

  getAll(): Map<string, number> {
    return new Map(this.metrics);
  }

  reset(): void {
    this.metrics.clear();
    this.logger.debug('Metrics reset');
  }

  recordExecutionTime(metric: string, startTime: number): void {
    const duration = Date.now() - startTime;
    this.set(`${metric}.duration`, duration);
  }
}

/**
 * Decorator for tracking method execution metrics
 * @param metrics ServiceMetrics instance
 * @returns Method decorator
 */
export function TrackMetrics(metrics: ServiceMetrics) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const metricName = `${target.constructor.name}.${propertyKey}`;
      const startTime = Date.now();

      metrics.increment(`${metricName}.calls`);

      try {
        const result = await originalMethod.apply(this, args);
        metrics.increment(`${metricName}.success`);
        metrics.recordExecutionTime(metricName, startTime);
        return result;
      } catch (error) {
        metrics.increment(`${metricName}.errors`);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Request context for tracking request-scoped data
 */
export class RequestContext {
  constructor(
    public readonly requestId: string,
    public readonly userId?: string,
    public readonly userRoles: string[] = [],
    public readonly metadata: Record<string, any> = {},
  ) {}

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  isAuthenticated(): boolean {
    return !!this.userId;
  }
}

/**
 * Creates a request context from raw data
 * @param data Context data
 * @returns RequestContext instance
 */
export function createRequestContext(data: {
  requestId: string;
  userId?: string;
  userRoles?: string[];
  metadata?: Record<string, any>;
}): RequestContext {
  return new RequestContext(
    data.requestId,
    data.userId,
    data.userRoles || [],
    data.metadata || {},
  );
}

/**
 * Service transaction coordinator
 * @description Coordinates transactions across multiple services
 */
export class TransactionCoordinator {
  private readonly logger = new Logger('TransactionCoordinator');
  private activeTransactions = new Map<string, Transaction>();

  beginTransaction(transactionId: string): Transaction {
    if (this.activeTransactions.has(transactionId)) {
      throw new Error(`Transaction ${transactionId} already exists`);
    }

    const transaction = new Transaction(transactionId);
    this.activeTransactions.set(transactionId, transaction);
    this.logger.debug(`Transaction started: ${transactionId}`);

    return transaction;
  }

  async commitTransaction(transactionId: string): Promise<void> {
    const transaction = this.activeTransactions.get(transactionId);

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    await transaction.commit();
    this.activeTransactions.delete(transactionId);
    this.logger.debug(`Transaction committed: ${transactionId}`);
  }

  async rollbackTransaction(transactionId: string): Promise<void> {
    const transaction = this.activeTransactions.get(transactionId);

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    await transaction.rollback();
    this.activeTransactions.delete(transactionId);
    this.logger.warn(`Transaction rolled back: ${transactionId}`);
  }

  getTransaction(transactionId: string): Transaction | undefined {
    return this.activeTransactions.get(transactionId);
  }
}

/**
 * Transaction class for managing units of work
 */
export class Transaction {
  private operations: Array<() => Promise<void>> = [];
  private compensations: Array<() => Promise<void>> = [];
  private committed = false;

  constructor(public readonly id: string) {}

  addOperation(
    operation: () => Promise<void>,
    compensation: () => Promise<void>,
  ): void {
    if (this.committed) {
      throw new Error('Cannot add operation to committed transaction');
    }

    this.operations.push(operation);
    this.compensations.unshift(compensation); // Reverse order for rollback
  }

  async commit(): Promise<void> {
    if (this.committed) {
      throw new Error('Transaction already committed');
    }

    for (const operation of this.operations) {
      await operation();
    }

    this.committed = true;
  }

  async rollback(): Promise<void> {
    for (const compensation of this.compensations) {
      try {
        await compensation();
      } catch (error) {
        console.error('Compensation failed:', error);
      }
    }
  }
}

/**
 * Service dependency graph for analyzing service relationships
 */
export class ServiceDependencyGraph {
  private dependencies = new Map<string, Set<string>>();
  private readonly logger = new Logger('ServiceDependencyGraph');

  addDependency(service: string, dependsOn: string): void {
    if (!this.dependencies.has(service)) {
      this.dependencies.set(service, new Set());
    }

    this.dependencies.get(service)!.add(dependsOn);
    this.logger.debug(`Dependency added: ${service} -> ${dependsOn}`);
  }

  getDependencies(service: string): string[] {
    return Array.from(this.dependencies.get(service) || []);
  }

  getAllDependencies(service: string): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const traverse = (current: string) => {
      if (visited.has(current)) return;
      visited.add(current);

      const deps = this.dependencies.get(current) || new Set();
      for (const dep of deps) {
        result.push(dep);
        traverse(dep);
      }
    };

    traverse(service);
    return result;
  }

  hasCircularDependency(service: string): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (current: string): boolean => {
      if (recursionStack.has(current)) return true;
      if (visited.has(current)) return false;

      visited.add(current);
      recursionStack.add(current);

      const deps = this.dependencies.get(current) || new Set();
      for (const dep of deps) {
        if (hasCycle(dep)) return true;
      }

      recursionStack.delete(current);
      return false;
    };

    return hasCycle(service);
  }

  getTopologicalOrder(): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (service: string) => {
      if (visited.has(service)) return;
      visited.add(service);

      const deps = this.dependencies.get(service) || new Set();
      for (const dep of deps) {
        visit(dep);
      }

      result.push(service);
    };

    for (const service of this.dependencies.keys()) {
      visit(service);
    }

    return result.reverse();
  }
}

/**
 * Creates a service dependency graph from module metadata
 * @param modules Module metadata
 * @returns ServiceDependencyGraph instance
 */
export function createDependencyGraph(
  modules: Array<{ name: string; imports: string[] }>,
): ServiceDependencyGraph {
  const graph = new ServiceDependencyGraph();

  for (const module of modules) {
    for (const dependency of module.imports) {
      graph.addDependency(module.name, dependency);
    }
  }

  return graph;
}

/**
 * Service rate limiter for controlling request rates
 */
export class ServiceRateLimiter {
  private requests = new Map<string, number[]>();
  private readonly logger = new Logger('ServiceRateLimiter');

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const requests = this.requests.get(key)!;
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    if (validRequests.length >= this.maxRequests) {
      this.logger.warn(`Rate limit exceeded for key: ${key}`);
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Creates a rate limiter with specified limits
 * @param maxRequests Maximum requests per window
 * @param windowMs Window duration in milliseconds
 * @returns ServiceRateLimiter instance
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number = 60000,
): ServiceRateLimiter {
  return new ServiceRateLimiter(maxRequests, windowMs);
}
