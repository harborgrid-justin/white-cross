/**
 * LOC: SCHEMAMGMT001
 * File: schema-management-tools.ts
 * Purpose: Enterprise schema management, versioning, and validation
 */

import { Injectable, Logger } from "@nestjs/common";
import { SchemaOperationsService } from "../schema-operations-kit";
import { ValidationOperationsService } from "../validation-operations-kit";

export interface ISchemaDefinition {
  name: string;
  version: string;
  tables: ITableDefinition[];
  relationships: IRelationshipDefinition[];
  indexes: IIndexDefinition[];
  constraints: IConstraintDefinition[];
}

export interface ITableDefinition {
  name: string;
  columns: IColumnDefinition[];
  primaryKey: string[];
  timestamps: boolean;
  softDeletes: boolean;
}

export interface IColumnDefinition {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: any;
  unique: boolean;
  autoIncrement: boolean;
}

export interface IRelationshipDefinition {
  type: "one-to-one" | "one-to-many" | "many-to-many";
  sourceTable: string;
  targetTable: string;
  foreignKey: string;
  references: string;
}

export interface IIndexDefinition {
  name: string;
  table: string;
  columns: string[];
  unique: boolean;
  type: "btree" | "hash" | "gin" | "gist";
}

export interface IConstraintDefinition {
  name: string;
  table: string;
  type: "check" | "unique" | "foreign_key";
  definition: string;
}

@Injectable()
export class SchemaManagementService {
  private readonly logger = new Logger(SchemaManagementService.name);
  private readonly schemas: Map<string, ISchemaDefinition> = new Map();

  constructor(
    private readonly schemaOpsService: SchemaOperationsService,
    private readonly validationService: ValidationOperationsService,
  ) {}

  /**
   * Register a schema definition
   */
  registerSchema(schema: ISchemaDefinition): void {
    this.logger.log(`Registering schema: ${schema.name} v${schema.version}`);
    this.schemas.set(schema.name, schema);
  }

  /**
   * Validate schema definition
   */
  async validateSchema(schema: ISchemaDefinition): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate table names are unique
    const tableNames = new Set();
    for (const table of schema.tables) {
      if (tableNames.has(table.name)) {
        errors.push(`Duplicate table name: ${table.name}`);
      }
      tableNames.add(table.name);

      // Validate column names are unique within table
      const columnNames = new Set();
      for (const column of table.columns) {
        if (columnNames.has(column.name)) {
          errors.push(`Duplicate column name in ${table.name}: ${column.name}`);
        }
        columnNames.add(column.name);
      }
    }

    // Validate relationships reference existing tables
    for (const rel of schema.relationships) {
      if (!tableNames.has(rel.sourceTable)) {
        errors.push(`Relationship references non-existent source table: ${rel.sourceTable}`);
      }
      if (!tableNames.has(rel.targetTable)) {
        errors.push(`Relationship references non-existent target table: ${rel.targetTable}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generate schema from existing database
   */
  async introspectSchema(databaseName: string): Promise<ISchemaDefinition> {
    this.logger.log(`Introspecting schema from database: ${databaseName}`);
    
    const tables = await this.schemaOpsService.listTables();
    const tableDefinitions: ITableDefinition[] = [];

    for (const tableName of tables) {
      const columns = await this.schemaOpsService.getTableSchema(tableName);
      const columnDefs: IColumnDefinition[] = columns.map(col => ({
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        defaultValue: col.defaultValue,
        unique: col.unique || false,
        autoIncrement: col.autoIncrement || false,
      }));

      tableDefinitions.push({
        name: tableName,
        columns: columnDefs,
        primaryKey: columns.filter(c => c.primaryKey).map(c => c.name),
        timestamps: columns.some(c => c.name === "createdAt"),
        softDeletes: columns.some(c => c.name === "deletedAt"),
      });
    }

    return {
      name: databaseName,
      version: "1.0.0",
      tables: tableDefinitions,
      relationships: [],
      indexes: [],
      constraints: [],
    };
  }

  /**
   * Compare two schema versions and generate diff
   */
  async compareSchemas(oldSchema: ISchemaDefinition, newSchema: ISchemaDefinition): Promise<{
    tablesAdded: string[];
    tablesRemoved: string[];
    tablesModified: Array<{ table: string; changes: any }>;
  }> {
    const diff = {
      tablesAdded: [] as string[],
      tablesRemoved: [] as string[],
      tablesModified: [] as Array<{ table: string; changes: any }>,
    };

    const oldTables = new Set(oldSchema.tables.map(t => t.name));
    const newTables = new Set(newSchema.tables.map(t => t.name));

    // Find added tables
    for (const table of newSchema.tables) {
      if (!oldTables.has(table.name)) {
        diff.tablesAdded.push(table.name);
      }
    }

    // Find removed tables
    for (const table of oldSchema.tables) {
      if (!newTables.has(table.name)) {
        diff.tablesRemoved.push(table.name);
      }
    }

    // Find modified tables
    for (const newTable of newSchema.tables) {
      const oldTable = oldSchema.tables.find(t => t.name === newTable.name);
      if (oldTable) {
        const changes = this.compareTableDefinitions(oldTable, newTable);
        if (Object.keys(changes).length > 0) {
          diff.tablesModified.push({ table: newTable.name, changes });
        }
      }
    }

    return diff;
  }

  /**
   * Export schema as SQL DDL
   */
  async exportSchemaAsDDL(schema: ISchemaDefinition): Promise<string> {
    let ddl = `-- Schema: ${schema.name} v${schema.version}\n\n`;

    for (const table of schema.tables) {
      ddl += this.generateCreateTableDDL(table);
      ddl += "\n\n";
    }

    for (const index of schema.indexes) {
      ddl += this.generateCreateIndexDDL(index);
      ddl += "\n";
    }

    return ddl;
  }

  /**
   * Sync schema to database
   */
  async syncSchemaToDatabase(schema: ISchemaDefinition): Promise<void> {
    this.logger.log(`Syncing schema ${schema.name} to database`);

    for (const table of schema.tables) {
      const exists = await this.schemaOpsService.tableExists(table.name);
      
      if (!exists) {
        await this.schemaOpsService.createTable(table.name, table.columns);
      } else {
        // Update existing table structure
        await this.updateTableStructure(table);
      }
    }

    // Create indexes
    for (const index of schema.indexes) {
      await this.schemaOpsService.createIndex(index.table, index.name, index.columns, { unique: index.unique });
    }
  }

  // Private helper methods

  private compareTableDefinitions(oldTable: ITableDefinition, newTable: ITableDefinition): any {
    const changes: any = {};

    // Compare columns
    const oldCols = new Set(oldTable.columns.map(c => c.name));
    const newCols = new Set(newTable.columns.map(c => c.name));

    const columnsAdded = newTable.columns.filter(c => !oldCols.has(c.name));
    const columnsRemoved = oldTable.columns.filter(c => !newCols.has(c.name));

    if (columnsAdded.length > 0) changes.columnsAdded = columnsAdded;
    if (columnsRemoved.length > 0) changes.columnsRemoved = columnsRemoved;

    return changes;
  }

  private generateCreateTableDDL(table: ITableDefinition): string {
    let ddl = `CREATE TABLE ${table.name} (\n`;
    
    const columnDefs = table.columns.map(col => {
      let def = `  ${col.name} ${col.type}`;
      if (!col.nullable) def += " NOT NULL";
      if (col.unique) def += " UNIQUE";
      if (col.defaultValue !== undefined) def += ` DEFAULT ${col.defaultValue}`;
      return def;
    });

    ddl += columnDefs.join(",\n");
    
    if (table.primaryKey.length > 0) {
      ddl += `,\n  PRIMARY KEY (${table.primaryKey.join(", ")})`;
    }

    ddl += "\n);";
    return ddl;
  }

  private generateCreateIndexDDL(index: IIndexDefinition): string {
    const unique = index.unique ? "UNIQUE " : "";
    return `CREATE ${unique}INDEX ${index.name} ON ${index.table} (${index.columns.join(", ")});`;
  }

  private async updateTableStructure(table: ITableDefinition): Promise<void> {
    // Logic to alter existing table structure
    this.logger.debug(`Updating table structure: ${table.name}`);
  }
}

export { SchemaManagementService };
