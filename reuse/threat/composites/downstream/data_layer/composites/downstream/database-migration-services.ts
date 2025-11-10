/**
 * LOC: DBMIGRATE001
 * File: database-migration-services.ts
 * Purpose: Enterprise-grade database migration management for threat intelligence platform
 * 
 * UPSTREAM: SchemaOperationsService, TransactionOperationsService, DataPersistenceService
 * DOWNSTREAM: Infrastructure automation, DevOps pipelines, Schema versioning systems
 */

import { Injectable, Logger } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsBoolean } from "class-validator";
import { SchemaOperationsService } from "../schema-operations-kit";
import { TransactionOperationsService } from "../transaction-operations-kit";
import { DataPersistenceService } from "../data-persistence-kit";

export enum MigrationType {
  CREATE_TABLE = "CREATE_TABLE",
  ALTER_TABLE = "ALTER_TABLE",
  DROP_TABLE = "DROP_TABLE",
  ADD_COLUMN = "ADD_COLUMN",
  MODIFY_COLUMN = "MODIFY_COLUMN",
  DROP_COLUMN = "DROP_COLUMN",
  CREATE_INDEX = "CREATE_INDEX",
  DROP_INDEX = "DROP_INDEX",
  ADD_CONSTRAINT = "ADD_CONSTRAINT",
  DROP_CONSTRAINT = "DROP_CONSTRAINT",
  DATA_MIGRATION = "DATA_MIGRATION",
}

export enum MigrationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  ROLLED_BACK = "ROLLED_BACK",
}

export interface IMigrationDefinition {
  id: string;
  version: string;
  name: string;
  type: MigrationType;
  up: () => Promise<void>;
  down: () => Promise<void>;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface IMigrationResult {
  success: boolean;
  migrationId: string;
  version: string;
  executionTime: number;
  status: MigrationStatus;
  error?: string;
  rollbackAvailable: boolean;
}

export class CreateMigrationDto {
  @ApiProperty({ description: "Migration name", example: "add_threat_severity_column" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Migration type", enum: MigrationType })
  @IsEnum(MigrationType)
  type: MigrationType;

  @ApiProperty({ description: "SQL up script", example: "ALTER TABLE threats ADD COLUMN severity VARCHAR(20)" })
  @IsString()
  @IsNotEmpty()
  upScript: string;

  @ApiProperty({ description: "SQL down script", example: "ALTER TABLE threats DROP COLUMN severity" })
  @IsString()
  @IsNotEmpty()
  downScript: string;

  @ApiPropertyOptional({ description: "Migration dependencies", type: [String] })
  @IsArray()
  @IsOptional()
  dependencies?: string[];
}

@Injectable()
export class DatabaseMigrationService {
  private readonly logger = new Logger(DatabaseMigrationService.name);
  private readonly migrations: Map<string, IMigrationDefinition> = new Map();
  private readonly executedMigrations: Set<string> = new Set();

  constructor(
    private readonly schemaService: SchemaOperationsService,
    private readonly transactionService: TransactionOperationsService,
    private readonly persistenceService: DataPersistenceService,
  ) {
    this.initializeMigrationTracking();
  }

  /**
   * Register a migration definition
   */
  registerMigration(migration: IMigrationDefinition): void {
    this.logger.log(`Registering migration: ${migration.name} (v${migration.version})`);
    this.migrations.set(migration.id, migration);
  }

  /**
   * Execute all pending migrations
   */
  async runPendingMigrations(): Promise<IMigrationResult[]> {
    this.logger.log("Running pending migrations...");
    const results: IMigrationResult[] = [];

    const pendingMigrations = await this.getPendingMigrations();
    const sortedMigrations = this.topologicalSort(pendingMigrations);

    for (const migration of sortedMigrations) {
      const result = await this.executeMigration(migration);
      results.push(result);

      if (!result.success) {
        this.logger.error(`Migration failed: ${migration.name}, stopping execution`);
        break;
      }
    }

    return results;
  }

  /**
   * Execute a specific migration
   */
  async executeMigration(migration: IMigrationDefinition): Promise<IMigrationResult> {
    const startTime = Date.now();
    this.logger.log(`Executing migration: ${migration.name} (v${migration.version})`);

    try {
      // Create migration record
      await this.createMigrationRecord(migration, MigrationStatus.IN_PROGRESS);

      // Execute migration in transaction
      await this.transactionService.executeInTransaction(async (transaction) => {
        await migration.up();
        return true;
      });

      // Mark as completed
      await this.updateMigrationRecord(migration.id, MigrationStatus.COMPLETED);
      this.executedMigrations.add(migration.id);

      return {
        success: true,
        migrationId: migration.id,
        version: migration.version,
        executionTime: Date.now() - startTime,
        status: MigrationStatus.COMPLETED,
        rollbackAvailable: true,
      };
    } catch (error) {
      this.logger.error(`Migration execution failed: ${error.message}`, error.stack);
      await this.updateMigrationRecord(migration.id, MigrationStatus.FAILED);

      return {
        success: false,
        migrationId: migration.id,
        version: migration.version,
        executionTime: Date.now() - startTime,
        status: MigrationStatus.FAILED,
        error: error.message,
        rollbackAvailable: true,
      };
    }
  }

  /**
   * Rollback a specific migration
   */
  async rollbackMigration(migrationId: string): Promise<IMigrationResult> {
    const startTime = Date.now();
    const migration = this.migrations.get(migrationId);

    if (!migration) {
      throw new Error(`Migration not found: ${migrationId}`);
    }

    this.logger.log(`Rolling back migration: ${migration.name} (v${migration.version})`);

    try {
      await this.transactionService.executeInTransaction(async (transaction) => {
        await migration.down();
        return true;
      });

      await this.updateMigrationRecord(migration.id, MigrationStatus.ROLLED_BACK);
      this.executedMigrations.delete(migration.id);

      return {
        success: true,
        migrationId: migration.id,
        version: migration.version,
        executionTime: Date.now() - startTime,
        status: MigrationStatus.ROLLED_BACK,
        rollbackAvailable: false,
      };
    } catch (error) {
      this.logger.error(`Rollback failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get migration status and history
   */
  async getMigrationStatus(): Promise<{
    total: number;
    executed: number;
    pending: number;
    failed: number;
    history: any[];
  }> {
    const history = await this.getMigrationHistory();
    const executed = history.filter(m => m.status === MigrationStatus.COMPLETED).length;
    const failed = history.filter(m => m.status === MigrationStatus.FAILED).length;
    const pending = this.migrations.size - executed;

    return {
      total: this.migrations.size,
      executed,
      pending,
      failed,
      history,
    };
  }

  /**
   * Create table migration with proper schema
   */
  async createTableMigration(tableName: string, columns: any[]): Promise<void> {
    this.logger.log(`Creating table migration: ${tableName}`);
    await this.schemaService.createTable(tableName, columns);
  }

  /**
   * Alter table migration with column changes
   */
  async alterTableMigration(tableName: string, changes: any): Promise<void> {
    this.logger.log(`Altering table: ${tableName}`);
    
    if (changes.addColumns) {
      for (const column of changes.addColumns) {
        await this.schemaService.addColumn(tableName, column.name, column.type, column.options);
      }
    }

    if (changes.modifyColumns) {
      for (const column of changes.modifyColumns) {
        await this.schemaService.modifyColumn(tableName, column.name, column.newType, column.options);
      }
    }

    if (changes.dropColumns) {
      for (const columnName of changes.dropColumns) {
        await this.schemaService.dropColumn(tableName, columnName);
      }
    }
  }

  /**
   * Create indexes for performance optimization
   */
  async createIndexMigration(tableName: string, indexName: string, columns: string[], unique: boolean = false): Promise<void> {
    this.logger.log(`Creating index: ${indexName} on ${tableName}`);
    await this.schemaService.createIndex(tableName, indexName, columns, { unique });
  }

  /**
   * Data migration with transformation
   */
  async dataMigration(sourceTable: string, targetTable: string, transformFn: (data: any) => any): Promise<void> {
    this.logger.log(`Migrating data from ${sourceTable} to ${targetTable}`);
    
    // Retrieve all data from source
    const sourceData = await this.persistenceService.findAll(sourceTable);
    
    // Transform and insert into target
    for (const record of sourceData) {
      const transformed = transformFn(record);
      await this.persistenceService.createRecord(targetTable, transformed);
    }
  }

  // Private helper methods

  private async initializeMigrationTracking(): Promise<void> {
    // Create migrations tracking table if it doesn't exist
    try {
      await this.schemaService.createTable("schema_migrations", [
        { name: "id", type: "UUID", primaryKey: true },
        { name: "version", type: "VARCHAR(255)", unique: true },
        { name: "name", type: "VARCHAR(255)" },
        { name: "type", type: "VARCHAR(50)" },
        { name: "status", type: "VARCHAR(50)" },
        { name: "executedAt", type: "TIMESTAMP" },
        { name: "executionTime", type: "INTEGER" },
        { name: "rollbackAvailable", type: "BOOLEAN" },
      ]);
    } catch (error) {
      // Table might already exist
      this.logger.debug("Migration tracking table already exists");
    }
  }

  private async getPendingMigrations(): Promise<IMigrationDefinition[]> {
    const pending: IMigrationDefinition[] = [];
    
    for (const [id, migration] of this.migrations) {
      if (!this.executedMigrations.has(id)) {
        pending.push(migration);
      }
    }

    return pending;
  }

  private topologicalSort(migrations: IMigrationDefinition[]): IMigrationDefinition[] {
    // Sort migrations based on version and dependencies
    return migrations.sort((a, b) => {
      if (a.version < b.version) return -1;
      if (a.version > b.version) return 1;
      return 0;
    });
  }

  private async createMigrationRecord(migration: IMigrationDefinition, status: MigrationStatus): Promise<void> {
    await this.persistenceService.createRecord("schema_migrations", {
      id: migration.id,
      version: migration.version,
      name: migration.name,
      type: migration.type,
      status,
      executedAt: new Date(),
      rollbackAvailable: true,
    });
  }

  private async updateMigrationRecord(migrationId: string, status: MigrationStatus): Promise<void> {
    await this.persistenceService.updateRecord("schema_migrations", migrationId, {
      status,
      executedAt: new Date(),
    });
  }

  private async getMigrationHistory(): Promise<any[]> {
    return this.persistenceService.findAll("schema_migrations");
  }
}

export { DatabaseMigrationService };
