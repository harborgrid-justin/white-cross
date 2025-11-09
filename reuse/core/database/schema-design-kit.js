"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaDesignKit = exports.SchemaPatterns = exports.SchemaBuilder = void 0;
exports.createSchemaBuilder = createSchemaBuilder;
/**
 * Schema Design Kit
 *
 * Provides utilities for designing database schemas with validation and best practices.
 */
class SchemaDesignKit {
    /**
     * Create a schema definition
     */
    static createSchema(fields, options = {}) {
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
    static validateFields(fields) {
        const validated = {};
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
     * Create index definition
     */
    static createIndex(fields, options = {}) {
        return {
            fields,
            unique: false,
            type: 'BTREE',
            ...options,
        };
    }
    /**
     * Validate schema definition
     */
    static validateSchema(schema) {
        const errors = [];
        const warnings = [];
        // Check for primary key
        const hasPrimaryKey = Object.values(schema.fields).some(field => field.primaryKey);
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
    static generateDDL(tableName, schema, dialect = 'postgres') {
        const lines = [];
        lines.push(`CREATE TABLE ${tableName} (`);
        // Field definitions
        const fieldDefs = [];
        for (const [name, field] of Object.entries(schema.fields)) {
            const parts = [`  ${name} ${field.type}`];
            if (field.primaryKey) {
                parts.push('PRIMARY KEY');
            }
            if (field.autoIncrement && dialect === 'postgres') {
                parts.push('GENERATED ALWAYS AS IDENTITY');
            }
            else if (field.autoIncrement && dialect === 'mysql') {
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
    static generateIndexDDL(tableName, index, dialect) {
        const indexName = index.name || `${tableName}_${index.fields.join('_')}_idx`;
        const unique = index.unique ? 'UNIQUE ' : '';
        const type = index.type ? `USING ${index.type}` : '';
        return `CREATE ${unique}INDEX ${indexName} ON ${tableName} ${type} (${index.fields.join(', ')});`;
    }
    /**
     * Format default value for SQL
     */
    static formatDefaultValue(value) {
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
exports.SchemaDesignKit = SchemaDesignKit;
/**
 * Create common field types
 */
SchemaDesignKit.fields = {
    /**
     * Primary key field (auto-increment integer)
     */
    id() {
        return {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true,
        };
    },
    /**
     * UUID primary key
     */
    uuid() {
        return {
            type: 'UUID',
            primaryKey: true,
            defaultValue: 'uuid_generate_v4()',
        };
    },
    /**
     * String field
     */
    string(options = {}) {
        return {
            type: 'STRING',
            allowNull: false,
            ...options,
        };
    },
    /**
     * Text field
     */
    text(options = {}) {
        return {
            type: 'TEXT',
            allowNull: false,
            ...options,
        };
    },
    /**
     * Integer field
     */
    integer(options = {}) {
        return {
            type: 'INTEGER',
            allowNull: false,
            ...options,
        };
    },
    /**
     * Float field
     */
    float(options = {}) {
        return {
            type: 'FLOAT',
            allowNull: false,
            ...options,
        };
    },
    /**
     * Boolean field
     */
    boolean(options = {}) {
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
    date(options = {}) {
        return {
            type: 'DATE',
            allowNull: false,
            ...options,
        };
    },
    /**
     * JSON field
     */
    json(options = {}) {
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
    email(options = {}) {
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
    url(options = {}) {
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
    foreignKey(model, options = {}) {
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
    enum(values, options = {}) {
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
    timestamps() {
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
    deletedAt() {
        return {
            type: 'DATE',
            allowNull: true,
            defaultValue: null,
        };
    },
};
/**
 * Common index patterns
 */
SchemaDesignKit.indexes = {
    /**
     * Unique index
     */
    unique(fields, options = {}) {
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
    composite(fields, options = {}) {
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
    fullText(fields, options = {}) {
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
    hash(field, options = {}) {
        return {
            fields: [field],
            unique: false,
            type: 'HASH',
            ...options,
        };
    },
};
exports.default = SchemaDesignKit;
/**
 * Schema builder for fluent API
 */
class SchemaBuilder {
    constructor() {
        this.fields = {};
        this.indexes = [];
        this.options = {};
    }
    /**
     * Add a field
     */
    addField(name, definition) {
        this.fields[name] = definition;
        return this;
    }
    /**
     * Add multiple fields
     */
    addFields(fields) {
        this.fields = { ...this.fields, ...fields };
        return this;
    }
    /**
     * Add an index
     */
    addIndex(index) {
        this.indexes.push(index);
        return this;
    }
    /**
     * Enable timestamps
     */
    withTimestamps() {
        this.options.timestamps = true;
        return this;
    }
    /**
     * Enable soft deletes
     */
    withSoftDeletes() {
        this.options.paranoid = true;
        return this;
    }
    /**
     * Set table name
     */
    tableName(name) {
        this.options.tableName = name;
        return this;
    }
    /**
     * Build the schema
     */
    build() {
        return SchemaDesignKit.createSchema(this.fields, {
            ...this.options,
            indexes: this.indexes,
        });
    }
}
exports.SchemaBuilder = SchemaBuilder;
/**
 * Common schema patterns
 */
class SchemaPatterns {
    /**
     * User schema pattern
     */
    static user() {
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
    static auditLog() {
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
    static settings() {
        return SchemaDesignKit.createSchema({
            id: SchemaDesignKit.fields.id(),
            user_id: SchemaDesignKit.fields.foreignKey('users', { unique: true }),
            preferences: SchemaDesignKit.fields.json({ defaultValue: {} }),
            notifications: SchemaDesignKit.fields.boolean({ defaultValue: true }),
            theme: SchemaDesignKit.fields.enum(['light', 'dark'], { defaultValue: 'light' }),
        });
    }
}
exports.SchemaPatterns = SchemaPatterns;
/**
 * Create schema builder instance
 */
function createSchemaBuilder() {
    return new SchemaBuilder();
}
//# sourceMappingURL=schema-design-kit.js.map