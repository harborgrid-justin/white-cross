/**
 * Command Bus Implementation
 *
 * Handles command execution with proper error handling, logging, and transaction management
 * for the White Cross healthcare platform.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  ICommand,
  ICommandResult,
  ICommandHandler,
  ICommandBus
} from './interfaces';

@Injectable()
export class CommandBus implements ICommandBus {
  private readonly logger = new Logger(CommandBus.name);
  private readonly handlers = new Map<string, ICommandHandler<any>>();

  constructor(
    @Inject('TRANSACTION_MANAGER') private readonly transactionManager?: any,
  ) {}

  /**
   * Register a command handler
   */
  registerHandler<TCommand extends ICommand>(
    commandType: string,
    handler: ICommandHandler<TCommand>
  ): void {
    this.handlers.set(commandType, handler);
    this.logger.log(`Registered command handler for: ${commandType}`);
  }

  /**
   * Execute a command
   */
  async execute<TCommand extends ICommand>(command: TCommand): Promise<ICommandResult> {
    const startTime = Date.now();
    const correlationId = this.generateCorrelationId();

    try {
      this.logger.log(`Executing command: ${command.type}`, {
        correlationId,
        commandType: command.type
      });

      const handler = this.handlers.get(command.type);
      if (!handler) {
        throw new Error(`No handler registered for command: ${command.type}`);
      }

      // Execute command within transaction if available
      let result: ICommandResult;
      if (this.transactionManager) {
        result = await this.transactionManager.executeInTransaction(
          () => handler.execute(command)
        );
      } else {
        result = await handler.execute(command);
      }

      const executionTime = Date.now() - startTime;
      this.logger.log(`Command executed successfully: ${command.type}`, {
        correlationId,
        executionTime,
        success: result.success
      });

      return {
        ...result,
        correlationId
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(`Command execution failed: ${command.type}`, {
        correlationId,
        executionTime,
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        correlationId
      };
    }
  }

  /**
   * Get registered command types
   */
  getRegisteredCommands(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if a command type is registered
   */
  hasHandler(commandType: string): boolean {
    return this.handlers.has(commandType);
  }

  /**
   * Generate correlation ID for request tracing
   */
  private generateCorrelationId(): string {
    return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}