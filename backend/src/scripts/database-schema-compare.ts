/**
 * Database Schema Comparison Script
 * 
 * This script exports the actual database schema and compares it with 
 * the Sequelize model definitions to identify mismatches, missing columns,
 * incorrect data types, and other inconsistencies.
 */

import * as dotenv from 'dotenv';
import { Sequelize, QueryTypes } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Load environment variables from .env file
dotenv.config();

interface DatabaseColumn {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
}

interface DatabaseIndex {
  table_name: string;
  index_name: string;
  column_name: string;
  is_unique: boolean;
  index_type: string;
}

interface ModelColumn {
  name: string;
  type: string;
  allowNull: boolean;
  defaultValue?: any;
  unique?: boolean;
  primaryKey?: boolean;
}

interface ModelInfo {
  tableName: string;
  columns: ModelColumn[];
  indexes: string[];
}

class DatabaseSchemaComparer {
  private sequelize: Sequelize;
  private outputDir: string;

  constructor() {
    // Use connection string for Neon PostgreSQL (more reliable)
    const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
    
    console.log('🔗 Connecting to Neon PostgreSQL...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    
    this.sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 20000,
      },
    });

    this.outputDir = path.join(__dirname, '../../reports/schema-comparison');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Export database schema information
   */
  async exportDatabaseSchema(): Promise<{
    tables: string[];
    columns: DatabaseColumn[];
    indexes: DatabaseIndex[];
  }> {
    console.log('📊 Exporting database schema...');

    // Get all tables
    const tables = await this.sequelize.query<{ table_name: string }>(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
      `,
      { type: QueryTypes.SELECT }
    );

    // Get all columns with detailed information
    const columns = await this.sequelize.query<DatabaseColumn>(
      `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
      `,
      { type: QueryTypes.SELECT }
    );

    // Get all indexes
    const indexes = await this.sequelize.query<DatabaseIndex>(
      `
      SELECT DISTINCT
        t.relname as table_name,
        i.indexname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique,
        am.amname as index_type
      FROM pg_indexes i
      JOIN pg_class c ON c.relname = i.indexname
      JOIN pg_index ix ON ix.indexrelid = c.oid
      JOIN pg_class t ON t.oid = ix.indrelid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      JOIN pg_am am ON am.oid = c.relam
      JOIN information_schema.tables ist ON ist.table_name = t.relname
      WHERE ist.table_schema = 'public'
      AND t.relname NOT LIKE 'pg_%'
      ORDER BY t.relname, i.indexname, a.attname;
      `,
      { type: QueryTypes.SELECT }
    );

    return {
      tables: tables.map(t => t.table_name),
      columns,
      indexes
    };
  }

  /**
   * Parse Sequelize model files to extract model information
   */
  async parseModelDefinitions(): Promise<ModelInfo[]> {
    console.log('🔍 Parsing Sequelize model definitions...');

    const modelFiles = await glob('src/database/models/*.model.ts', { 
      cwd: path.join(__dirname, '../../') 
    });

    const models: ModelInfo[] = [];

    for (const modelFile of modelFiles) {
      try {
        const fullPath = path.join(__dirname, '../../', modelFile);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Extract table name
        const tableNameMatch = content.match(/tableName:\s*['"`]([^'"`]+)['"`]/);
        if (!tableNameMatch) continue;

        const tableName = tableNameMatch[1];
        
        // Extract column definitions
        const columns = this.extractColumnsFromModel(content);
        
        // Extract index definitions
        const indexes = this.extractIndexesFromModel(content);

        models.push({
          tableName,
          columns,
          indexes
        });

      } catch (error) {
        console.warn(`⚠️  Error parsing model file ${modelFile}:`, error);
      }
    }

    return models;
  }

  /**
   * Extract column information from model content
   */
  private extractColumnsFromModel(content: string): ModelColumn[] {
    const columns: ModelColumn[] = [];
    
    // Look for @Column decorators and their associated properties
    const columnRegex = /@Column\s*\(([^)]*)\)\s*(?:\/\/.*?)?\s*(?:declare\s+)?(\w+)[!?]?\s*:\s*([^;]+);/gs;
    
    let match;
    while ((match = columnRegex.exec(content)) !== null) {
      const columnConfig = match[1];
      const columnName = match[2];
      const columnType = match[3];

      // Skip if it's not a real column (like methods or getters)
      if (columnName === 'createdAt' || columnName === 'updatedAt') {
        continue;
      }

      // Parse column configuration
      const allowNull = !columnConfig.includes('allowNull: false');
      const unique = columnConfig.includes('unique: true');
      
      // Extract DataType
      let dataType = 'unknown';
      const typeMatch = columnConfig.match(/type:\s*DataType\.(\w+)(?:\([^)]*\))?/);
      if (typeMatch) {
        dataType = typeMatch[1];
      } else if (columnConfig.includes('DataType.')) {
        const directTypeMatch = columnConfig.match(/DataType\.(\w+)/);
        if (directTypeMatch) {
          dataType = directTypeMatch[1];
        }
      }

      columns.push({
        name: columnName,
        type: dataType,
        allowNull,
        unique,
        primaryKey: content.includes(`@PrimaryKey`) && content.indexOf(`@PrimaryKey`) < content.indexOf(columnName)
      });
    }

    return columns;
  }

  /**
   * Extract index information from model content
   */
  private extractIndexesFromModel(content: string): string[] {
    const indexes: string[] = [];
    
    // Look for indexes array in @Table decorator
    const indexMatch = content.match(/indexes:\s*\[([\s\S]*?)\]/);
    if (indexMatch) {
      const indexContent = indexMatch[1];
      
      // Extract index names
      const nameMatches = indexContent.match(/name:\s*['"`]([^'"`]+)['"`]/g);
      if (nameMatches) {
        nameMatches.forEach(nameMatch => {
          const name = nameMatch.match(/['"`]([^'"`]+)['"`]/)?.[1];
          if (name) {
            indexes.push(name);
          }
        });
      }
    }

    return indexes;
  }

  /**
   * Compare database schema with model definitions
   */
  async compareSchemas() {
    console.log('🔄 Starting database schema comparison...');
    
    try {
      // Test database connection
      await this.sequelize.authenticate();
      console.log('✅ Database connection established');

      // Export database schema
      const dbSchema = await this.exportDatabaseSchema();
      
      // Parse model definitions
      const modelDefinitions = await this.parseModelDefinitions();

      // Perform comparison
      const comparison = this.performComparison(dbSchema, modelDefinitions);

      // Generate reports
      await this.generateReports(dbSchema, modelDefinitions, comparison);

      console.log('✅ Schema comparison completed successfully');
      console.log(`📄 Reports saved to: ${this.outputDir}`);

    } catch (error) {
      console.error('❌ Error during schema comparison:', error);
      throw error;
    } finally {
      await this.sequelize.close();
    }
  }

  /**
   * Perform the actual comparison between database and models
   */
  private performComparison(
    dbSchema: { tables: string[]; columns: DatabaseColumn[]; indexes: DatabaseIndex[] },
    modelDefinitions: ModelInfo[]
  ) {
    const issues = {
      missingTables: [] as string[],
      extraTables: [] as string[],
      missingColumns: [] as { table: string; column: string }[],
      extraColumns: [] as { table: string; column: string }[],
      typeMatches: [] as { table: string; column: string; dbType: string; modelType: string }[],
      missingIndexes: [] as string[],
      extraIndexes: [] as string[]
    };

    const modelTableNames = new Set(modelDefinitions.map(m => m.tableName));
    const dbTableNames = new Set(dbSchema.tables);

    // Check for missing/extra tables
    modelDefinitions.forEach(model => {
      if (!dbTableNames.has(model.tableName)) {
        issues.missingTables.push(model.tableName);
      }
    });

    dbSchema.tables.forEach(table => {
      if (!modelTableNames.has(table)) {
        issues.extraTables.push(table);
      }
    });

    // Check columns for each table
    modelDefinitions.forEach(model => {
      const dbColumns = dbSchema.columns.filter(col => col.table_name === model.tableName);
      const dbColumnNames = new Set(dbColumns.map(col => col.column_name));
      
      // Check for missing columns in database
      model.columns.forEach(modelCol => {
        if (!dbColumnNames.has(modelCol.name)) {
          issues.missingColumns.push({ table: model.tableName, column: modelCol.name });
        } else {
          // Check data type mismatches
          const dbCol = dbColumns.find(col => col.column_name === modelCol.name);
          if (dbCol) {
            const dbType = this.normalizeDataType(dbCol.data_type);
            const modelType = this.normalizeDataType(modelCol.type);
            
            if (dbType !== modelType) {
              issues.typeMatches.push({
                table: model.tableName,
                column: modelCol.name,
                dbType: dbCol.data_type,
                modelType: modelCol.type
              });
            }
          }
        }
      });

      // Check for extra columns in database
      dbColumns.forEach(dbCol => {
        const modelColumnNames = new Set(model.columns.map(col => col.name));
        if (!modelColumnNames.has(dbCol.column_name) && 
            !['createdAt', 'updatedAt', 'deletedAt'].includes(dbCol.column_name)) {
          issues.extraColumns.push({ table: model.tableName, column: dbCol.column_name });
        }
      });
    });

    return issues;
  }

  /**
   * Normalize data types for comparison
   */
  private normalizeDataType(type: string): string {
    const typeMap: Record<string, string> = {
      'character varying': 'STRING',
      'varchar': 'STRING',
      'text': 'TEXT',
      'integer': 'INTEGER',
      'bigint': 'BIGINT',
      'boolean': 'BOOLEAN',
      'timestamp with time zone': 'DATE',
      'timestamp without time zone': 'DATE',
      'date': 'DATEONLY',
      'numeric': 'DECIMAL',
      'decimal': 'DECIMAL',
      'uuid': 'UUID',
      'jsonb': 'JSONB',
      'json': 'JSON'
    };

    const normalized = typeMap[type.toLowerCase()] || type.toUpperCase();
    return normalized;
  }

  /**
   * Generate comparison reports
   */
  private async generateReports(
    dbSchema: { tables: string[]; columns: DatabaseColumn[]; indexes: DatabaseIndex[] },
    modelDefinitions: ModelInfo[],
    comparison: any
  ) {
    // Generate database schema export
    const dbSchemaReport = {
      timestamp: new Date().toISOString(),
      tables: dbSchema.tables,
      totalColumns: dbSchema.columns.length,
      totalIndexes: dbSchema.indexes.length,
      columns: dbSchema.columns,
      indexes: dbSchema.indexes
    };

    // Generate model definitions report
    const modelReport = {
      timestamp: new Date().toISOString(),
      models: modelDefinitions,
      totalModels: modelDefinitions.length,
      totalColumns: modelDefinitions.reduce((sum, model) => sum + model.columns.length, 0)
    };

    // Generate comparison report
    const comparisonReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: Object.values(comparison).reduce((sum: number, arr: any[]) => sum + arr.length, 0),
        missingTablesCount: comparison.missingTables.length,
        extraTablesCount: comparison.extraTables.length,
        missingColumnsCount: comparison.missingColumns.length,
        extraColumnsCount: comparison.extraColumns.length,
        typeMismatchesCount: comparison.typeMatches.length
      },
      issues: comparison,
      recommendations: this.generateRecommendations(comparison)
    };

    // Write reports to files
    fs.writeFileSync(
      path.join(this.outputDir, 'database-schema.json'),
      JSON.stringify(dbSchemaReport, null, 2)
    );

    fs.writeFileSync(
      path.join(this.outputDir, 'model-definitions.json'),
      JSON.stringify(modelReport, null, 2)
    );

    fs.writeFileSync(
      path.join(this.outputDir, 'comparison-report.json'),
      JSON.stringify(comparisonReport, null, 2)
    );

    // Generate human-readable summary
    const summary = this.generateHumanReadableSummary(comparisonReport);
    fs.writeFileSync(
      path.join(this.outputDir, 'COMPARISON-SUMMARY.md'),
      summary
    );

    console.log(`📊 Database Schema: ${dbSchema.tables.length} tables, ${dbSchema.columns.length} columns`);
    console.log(`🔧 Model Definitions: ${modelDefinitions.length} models`);
    console.log(`⚠️  Total Issues Found: ${comparisonReport.summary.totalIssues}`);
  }

  /**
   * Generate recommendations based on comparison results
   */
  private generateRecommendations(comparison: any): string[] {
    const recommendations: string[] = [];

    if (comparison.missingTables.length > 0) {
      recommendations.push(
        `Create missing tables: ${comparison.missingTables.join(', ')}`
      );
    }

    if (comparison.extraTables.length > 0) {
      recommendations.push(
        `Consider removing unused tables: ${comparison.extraTables.join(', ')}`
      );
    }

    if (comparison.missingColumns.length > 0) {
      recommendations.push(
        `Add missing columns to database or remove from models`
      );
    }

    if (comparison.typeMatches.length > 0) {
      recommendations.push(
        `Fix data type mismatches between database and models`
      );
    }

    return recommendations;
  }

  /**
   * Generate human-readable summary report
   */
  private generateHumanReadableSummary(report: any): string {
    let summary = `# Database Schema Comparison Report\n\n`;
    summary += `**Generated:** ${report.timestamp}\n\n`;
    
    summary += `## Summary\n\n`;
    summary += `- **Total Issues:** ${report.summary.totalIssues}\n`;
    summary += `- **Missing Tables:** ${report.summary.missingTablesCount}\n`;
    summary += `- **Extra Tables:** ${report.summary.extraTablesCount}\n`;
    summary += `- **Missing Columns:** ${report.summary.missingColumnsCount}\n`;
    summary += `- **Extra Columns:** ${report.summary.extraColumnsCount}\n`;
    summary += `- **Type Mismatches:** ${report.summary.typeMismatchesCount}\n\n`;

    if (report.issues.missingTables.length > 0) {
      summary += `## Missing Tables\n\n`;
      report.issues.missingTables.forEach((table: string) => {
        summary += `- ${table}\n`;
      });
      summary += `\n`;
    }

    if (report.issues.extraTables.length > 0) {
      summary += `## Extra Tables in Database\n\n`;
      report.issues.extraTables.forEach((table: string) => {
        summary += `- ${table}\n`;
      });
      summary += `\n`;
    }

    if (report.issues.missingColumns.length > 0) {
      summary += `## Missing Columns\n\n`;
      report.issues.missingColumns.forEach((issue: any) => {
        summary += `- **${issue.table}:** ${issue.column}\n`;
      });
      summary += `\n`;
    }

    if (report.issues.extraColumns.length > 0) {
      summary += `## Extra Columns in Database\n\n`;
      report.issues.extraColumns.forEach((issue: any) => {
        summary += `- **${issue.table}:** ${issue.column}\n`;
      });
      summary += `\n`;
    }

    if (report.issues.typeMatches.length > 0) {
      summary += `## Data Type Mismatches\n\n`;
      report.issues.typeMatches.forEach((issue: any) => {
        summary += `- **${issue.table}.${issue.column}:** DB=${issue.dbType}, Model=${issue.modelType}\n`;
      });
      summary += `\n`;
    }

    if (report.recommendations.length > 0) {
      summary += `## Recommendations\n\n`;
      report.recommendations.forEach((rec: string) => {
        summary += `- ${rec}\n`;
      });
      summary += `\n`;
    }

    return summary;
  }
}

// Main execution
async function main() {
  const comparer = new DatabaseSchemaComparer();
  
  try {
    await comparer.compareSchemas();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { DatabaseSchemaComparer };
