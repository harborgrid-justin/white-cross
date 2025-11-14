/**
 * CQRS Module
 *
 * Main module that provides CQRS infrastructure for the White Cross healthcare platform.
 */

import { Module } from '@nestjs/common';
import { CommandBus } from './command-bus';
import { QueryBus } from './query-bus';

@Module({
  providers: [
    CommandBus,
    QueryBus,
    {
      provide: 'COMMAND_BUS',
      useExisting: CommandBus,
    },
    {
      provide: 'QUERY_BUS',
      useExisting: QueryBus,
    },
  ],
  exports: [CommandBus, QueryBus, 'COMMAND_BUS', 'QUERY_BUS'],
})
export class CqrsModule {}

/**
 * CQRS Service
 *
 * Service that provides easy access to command and query buses
 * and handles registration of handlers.
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from './interfaces';

@Injectable()
export class CqrsService implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  onModuleInit() {
    // Register healthcare command and query handlers here
    // This would be done in specific modules that implement the handlers
  }

  /**
   * Execute a command
   */
  async executeCommand(command: any) {
    return this.commandBus.execute(command);
  }

  /**
   * Execute a query
   */
  async executeQuery(query: any) {
    return this.queryBus.execute(query);
  }

  /**
   * Register a command handler
   */
  registerCommandHandler(commandType: string, handler: ICommandHandler<any>) {
    this.commandBus.registerHandler(commandType, handler);
  }

  /**
   * Register a query handler
   */
  registerQueryHandler(queryType: string, handler: IQueryHandler<any, any>) {
    this.queryBus.registerHandler(queryType, handler);
  }

  /**
   * Get CQRS statistics
   */
  getStatistics() {
    return {
      commands: {
        registered: this.commandBus.getRegisteredCommands(),
        count: this.commandBus.getRegisteredCommands().length,
      },
      queries: {
        registered: this.queryBus.getRegisteredQueries(),
        count: this.queryBus.getRegisteredQueries().length,
        cacheStats: this.queryBus.getCacheStats(),
      },
    };
  }
}
