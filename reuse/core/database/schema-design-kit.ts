/**
 * @fileoverview Schema Design Kit
 * @module core/database/schema-design-kit
 *
 * Production-ready schema design utilities including field definitions,
 * validators, indexes, and database design patterns.
 *
 * @example Define a schema
 * ```typescript
 * const userSchema = SchemaDesignKit.createSchema({
 *   id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
 *   email: { type: 'STRING', unique: true, validate: { isEmail: true } },
 *   age: { type: 'INTEGER', validate: { min: 0, max: 150 } }
 * });
 * ```
 */

/**
 * Field data types
 */
export type FieldType =
  | 'STRING'
  | 'TEXT'
  | 'INTEGER'
  | 'BIGINT'
  | 'FLOAT'
  | 'DOUBLE'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATEONLY'
  | 'TIME'
  | 'UUID'
  | 'JSON'
  | 'JSONB'
  | 'ARRAY'
  | 'ENUM'
  | 'BLOB';

/**
 * Field validation rules
 */
export interface FieldValidation {
  isEmail?: boolean;
  isUrl?: boolean;
  isIP?: boolean;
  isAlpha?: boolean;
  isAlphanumeric?: boolean;
  isNumeric?: boolean;
  isInt?: boolean;
  isFloat?: boolean;
  isDecimal?: boolean;
  isLowercase?: boolean;
  isUppercase?: boolean;
  notNull?: boolean;
  notEmpty?: boolean;
  equals?: any;
  contains?: string;
  notIn?: any[];
  isIn?: any[];
  notContains?: string;
  len?: [number, number];
  min?: number;
  max?: number;
  is?: RegExp | string;
  not?: RegExp | string;
  custom?: (value: any) => boolean | Promise<boolean>;
}

/**
 * Field definition
 */
export interface FieldDefinition {
  type: FieldType | string;
  allowNull?: boolean;
  defaultValue?: any;
  unique?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  validate?: FieldValidation;
  comment?: string;
  field?: string; // Database column name if different
  get?: () => any;
  set?: (value: any) => void;
}

/**
 * Index definition
 */
export interface IndexDefinition {
  name?: string;
  fields: string[];
  unique?: boolean;
  type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
  where?: Record<string, any>;
  concurrently?: boolean;
}

/**
 * Schema definition
 */
export interface SchemaDefinition {
  fields: Record<string, FieldDefinition>;
  indexes?: IndexDefinition[];
  timestamps?: boolean;
  paranoid?: boolean;
  underscored?: boolean;
  tableName?: string;
  comment?: string;
}

/**
 * Schema Design Kit
 *
 * Provides utilities for designing database schemas with validation and best practices.
 */
export default class SchemaDesignKit {
  /**
   * Create a schema definition
   */
  static createSchema(
    fields: Record<string, FieldDefinition>,
    options: Omit<SchemaDefinition, 'fields'> = {}
  ): SchemaDefinition {
    return {
      fields: this.validateFields(fields),
      timestamps: true,
      paranoid: false,
      underscored: true,
      ...options,
    };
  }

  /**
   * Validate field definitions
   */
  private static validateFields(
    fields: Record<string, FieldDefinition>
  ): Record<string, FieldDefinition> {
    const validated: Record<string, FieldDefinition> = {};

    for (const [name, field] of Object.entries(fields)) {
      // Validate field name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        throw new Error(`Invalid field name: ${name}`);
      }

      // Validate field type
      if (!field.type) {
        throw new Error(`Field ${name} must have a type`);
      }

      validated[name] = field;
    }

    return validated;
  }

  /**
   * Create common field types
   */
  static fields = {
    /**
     * Primary key field (auto-increment integer)
     */
    id(): FieldDefinition {
      return {
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      };
    },

    /**
     * UUID primary key
     */
    uuid(): FieldDefinition {
      return {
        type: 'UUID',
        primaryKey: true,
        defaultValue: 'uuid_generate_v4()',
      };
    },

    /**
     * String field
     */
    string(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'STRING',
        allowNull: false,
        ...options,
      };
    },

    /**
     * Text field
     */
    text(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'TEXT',
        allowNull: false,
        ...options,
      };
    },

    /**
     * Integer field
     */
    integer(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'INTEGER',
        allowNull: false,
        ...options,
      };
    },

    /**
     * Float field
     */
    float(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'FLOAT',
        allowNull: false,
        ...options,
      };
    },

    /**
     * Boolean field
     */
    boolean(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'BOOLEAN',
        allowNull: false,
        defaultValue: false,
        ...options,
      };
    },

    /**
     * Date field
     */
    date(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'DATE',
        allowNull: false,
        ...options,
      };
    },

    /**
     * JSON field
     */
    json(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'JSON',
        allowNull: true,
        defaultValue: null,
        ...options,
      };
    },

    /**
     * Email field with validation
     */
    email(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'STRING',
        allowNull: false,
        validate: {
          isEmail: true,
          ...options.validate,
        },
        ...options,
      };
    },

    /**
     * URL field with validation
     */
    url(options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: 'STRING',
        allowNull: false,
        validate: {
          isUrl: true,
          ...options.validate,
        },
        ...options,
      };
    },

    /**
     * Foreign key field
     */
    foreignKey(
      model: string,
      options: Partial<FieldDefinition> = {}
    ): FieldDefinition {
      return {
        type: 'INTEGER',
        allowNull: false,
        references: {
          model,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        ...options,
      };
    },

    /**
     * Enum field
     */
    enum(values: string[], options: Partial<FieldDefinition> = {}): FieldDefinition {
      return {
        type: `ENUM(${values.map(v => `'${v}'`).join(', ')})`,
        allowNull: false,
        validate: {
          isIn: [values],
          ...options.validate,
        },
        ...options,
      };
    },

    /**
     * Timestamp fields (created_at, updated_at)
     */
    timestamps(): Record<string, FieldDefinition> {
      return {
        created_at: {
          type: 'DATE',
          allowNull: false,
          defaultValue: 'NOW()',
        },
        updated_at: {
          type: 'DATE',
          allowNull: false,
          defaultValue: 'NOW()',
        },
      };
    },

    /**
     * Soft delete field
     */
    deletedAt(): FieldDefinition {
      return {
        type: 'DATE',
        allowNull: true,
        defaultValue: null,
      };
    },
  };

  /**
   * Create index definition
   */
  static createIndex(
    fields: string[],
    options: Omit<IndexDefinition, 'fields'> = {}
  ): IndexDefinition {
    return {
      fields,
      unique: false,
      type: 'BTREE',
      ...options,
    };
  }

  /**
   * Common index patterns
   */
  static indexes = {
    /**
     * Unique index
     */
    unique(fields: string[], options: Partial<IndexDefinition> = {}): IndexDefinition {
      return {
        fields,
        unique: true,
        type: 'BTREE',
        ...options,
      };
    },

    /**
     * Composite index
     */
    composite(fields: string[], options: Partial<IndexDefinition> = {}): IndexDefinition {
      return {
        fields,
        unique: false,
        type: 'BTREE',
        ...options,
      };
    },

    /**
     * Full-text index
     */
    fullText(fields: string[], options: Partial<IndexDefinition> = {}): IndexDefinition {
      return {
        fields,
        unique: false,
        type: 'GIN',
        ...options,
      };
    },

    /**
     * Hash index
     */
    hash(field: string, options: Partial<IndexDefinition> = {}): IndexDefinition {
      return {
        fields: [field],
        unique: false,
        type: 'HASH',
        ...options,
      };
    },
  };

  /**
   * Validate schema definition
   */
  static validateSchema(schema: SchemaDefinition): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for primary key
    const hasPrimaryKey = Object.values(schema.fields).some(
      field => field.primaryKey
    );
    if (!hasPrimaryKey) {
      errors.push('Schema must have a primary key');
    }

    // Check for duplicate field names
    const fieldNames = Object.keys(schema.fields);
    const uniqueNames = new Set(fieldNames);
    if (fieldNames.length !== uniqueNames.size) {
      errors.push('Schema has duplicate field names');
    }

    // Check for foreign key references
    for (const [name, field] of Object.entries(schema.fields)) {
      if (field.references && !field.references.model) {
        errors.push(`Foreign key ${name} must specify a model`);
      }
    }

    // Warnings for best practices
    if (!schema.timestamps) {
      warnings.push('Consider enabling timestamps for audit trail');
    }

    if (schema.indexes && schema.indexes.length === 0) {
      warnings.push('No indexes defined, consider adding indexes for performance');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate SQL DDL from schema
   */
  static generateDDL(
    tableName: string,
    schema: SchemaDefinition,
    dialect: 'postgres' | 'mysql' | 'sqlite' = 'postgres'
  ): string {
    const lines: string[] = [];
    lines.push(`CREATE TABLE ${tableName} (`);

    // Field definitions
    const fieldDefs: string[] = [];
    for (const [name, field] of Object.entries(schema.fields)) {
      const parts: string[] = [`  ${name} ${field.type}`];

      if (field.primaryKey) {
        parts.push('PRIMARY KEY');
      }

      if (field.autoIncrement && dialect === 'postgres') {
        parts.push('GENERATED ALWAYS AS IDENTITY');
      } else if (field.autoIncrement && dialect === 'mysql') {
        parts.push('AUTO_INCREMENT');
      }

      if (!field.allowNull) {
        parts.push('NOT NULL');
      }

      if (field.unique && !field.primaryKey) {
        parts.push('UNIQUE');
      }

      if (field.defaultValue !== undefined) {
        parts.push(`DEFAULT ${this.formatDefaultValue(field.defaultValue)}`);
      }

      if (field.comment) {
        parts.push(`COMMENT '${field.comment}'`);
      }

      fieldDefs.push(parts.join(' '));
    }

    lines.push(fieldDefs.join(',\n'));
    lines.push(');');

    // Index definitions
    if (schema.indexes) {
      for (const index of schema.indexes) {
        lines.push('');
        lines.push(this.generateIndexDDL(tableName, index, dialect));
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate index DDL
   */
  private static generateIndexDDL(
    tableName: string,
    index: IndexDefinition,
    dialect: string
  ): string {
    const indexName = index.name || `${tableName}_${index.fields.join('_')}_idx`;
    const unique = index.unique ? 'UNIQUE ' : '';
    const type = index.type ? `USING ${index.type}` : '';

    return `CREATE ${unique}INDEX ${indexName} ON ${tableName} ${type} (${index.fields.join(', ')});`;
  }

  /**
   * Format default value for SQL
   */
  private static formatDefaultValue(value: any): string {
    if (value === null) {
      return 'NULL';
    }
    if (typeof value === 'string') {
      return `'${value}'`;
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    return String(value);
  }
}

/**
 * Schema builder for fluent API
 */
export class SchemaBuilder {
  private fields: Record<string, FieldDefinition> = {};
  private indexes: IndexDefinition[] = [];
  private options: Omit<SchemaDefinition, 'fields'> = {};

  /**
   * Add a field
   */
  addField(name: string, definition: FieldDefinition): this {
    this.fields[name] = definition;
    return this;
  }

  /**
   * Add multiple fields
   */
  addFields(fields: Record<string, FieldDefinition>): this {
    this.fields = { ...this.fields, ...fields };
    return this;
  }

  /**
   * Add an index
   */
  addIndex(index: IndexDefinition): this {
    this.indexes.push(index);
    return this;
  }

  /**
   * Enable timestamps
   */
  withTimestamps(): this {
    this.options.timestamps = true;
    return this;
  }

  /**
   * Enable soft deletes
   */
  withSoftDeletes(): this {
    this.options.paranoid = true;
    return this;
  }

  /**
   * Set table name
   */
  tableName(name: string): this {
    this.options.tableName = name;
    return this;
  }

  /**
   * Build the schema
   */
  build(): SchemaDefinition {
    return SchemaDesignKit.createSchema(this.fields, {
      ...this.options,
      indexes: this.indexes,
    });
  }
}

/**
 * Common schema patterns
 */
export class SchemaPatterns {
  /**
   * User schema pattern
   */
  static user(): SchemaDefinition {
    return SchemaDesignKit.createSchema({
      id: SchemaDesignKit.fields.id(),
      email: SchemaDesignKit.fields.email({ unique: true }),
      password: SchemaDesignKit.fields.string(),
      first_name: SchemaDesignKit.fields.string(),
      last_name: SchemaDesignKit.fields.string(),
      is_active: SchemaDesignKit.fields.boolean({ defaultValue: true }),
      last_login: SchemaDesignKit.fields.date({ allowNull: true }),
    });
  }

  /**
   * Audit schema pattern
   */
  static auditLog(): SchemaDefinition {
    return SchemaDesignKit.createSchema({
      id: SchemaDesignKit.fields.id(),
      user_id: SchemaDesignKit.fields.foreignKey('users'),
      action: SchemaDesignKit.fields.string(),
      entity_type: SchemaDesignKit.fields.string(),
      entity_id: SchemaDesignKit.fields.integer(),
      old_values: SchemaDesignKit.fields.json({ allowNull: true }),
      new_values: SchemaDesignKit.fields.json({ allowNull: true }),
      ip_address: SchemaDesignKit.fields.string({ allowNull: true }),
      user_agent: SchemaDesignKit.fields.string({ allowNull: true }),
    });
  }

  /**
   * Settings schema pattern
   */
  static settings(): SchemaDefinition {
    return SchemaDesignKit.createSchema({
      id: SchemaDesignKit.fields.id(),
      user_id: SchemaDesignKit.fields.foreignKey('users', { unique: true }),
      preferences: SchemaDesignKit.fields.json({ defaultValue: {} }),
      notifications: SchemaDesignKit.fields.boolean({ defaultValue: true }),
      theme: SchemaDesignKit.fields.enum(['light', 'dark'], { defaultValue: 'light' }),
    });
  }
}

/**
 * Create schema builder instance
 */
export function createSchemaBuilder(): SchemaBuilder {
  return new SchemaBuilder();
}

export { SchemaDesignKit };
