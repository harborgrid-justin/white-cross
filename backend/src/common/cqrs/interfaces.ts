/**
 * CQRS (Command Query Responsibility Segregation) Infrastructure
 *
 * Provides separation of concerns between commands (write operations) and queries (read operations)
 * for the White Cross healthcare platform, enabling better scalability and maintainability.
 */

export interface ICommand {
  readonly type: string;
}

export interface IQuery {
  readonly type: string;
}

export interface ICommandResult {
  success: boolean;
  data?: any;
  error?: string;
  correlationId?: string;
}

export interface IQueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  correlationId?: string;
  totalCount?: number;
  pageInfo?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ICommandHandler<TCommand extends ICommand> {
  execute(command: TCommand): Promise<ICommandResult>;
}

export interface IQueryHandler<TQuery extends IQuery, TResult = any> {
  execute(query: TQuery): Promise<IQueryResult<TResult>>;
}

export interface ICommandBus {
  execute<TCommand extends ICommand>(command: TCommand): Promise<ICommandResult>;
}

export interface IQueryBus {
  execute<TQuery extends IQuery, TResult = any>(query: TQuery): Promise<IQueryResult<TResult>>;
}

export interface IEvent {
  readonly type: string;
  readonly aggregateId: string;
  readonly timestamp: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly metadata?: Record<string, any>;
}

export interface IEventHandler<TEvent extends IEvent> {
  handle(event: TEvent): Promise<void>;
}

export interface IEventBus {
  publish(event: IEvent): Promise<void>;
  subscribe<TEvent extends IEvent>(eventType: string, handler: IEventHandler<TEvent>): void;
}