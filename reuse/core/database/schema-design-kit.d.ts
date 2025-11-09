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
export type FieldType = 'STRING' | 'TEXT' | 'INTEGER' | 'BIGINT' | 'FLOAT' | 'DOUBLE' | 'DECIMAL' | 'BOOLEAN' | 'DATE' | 'DATEONLY' | 'TIME' | 'UUID' | 'JSON' | 'JSONB' | 'ARRAY' | 'ENUM' | 'BLOB';
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
    field?: string;
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
    static createSchema(fields: Record<string, FieldDefinition>, options?: Omit<SchemaDefinition, 'fields'>): SchemaDefinition;
    /**
     * Validate field definitions
     */
    private static validateFields;
    /**
     * Create common field types
     */
    static fields: {
        /**
         * Primary key field (auto-increment integer)
         */
        id(): FieldDefinition;
        /**
         * UUID primary key
         */
        uuid(): FieldDefinition;
        /**
         * String field
         */
        string(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Text field
         */
        text(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Integer field
         */
        integer(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Float field
         */
        float(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Boolean field
         */
        boolean(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Date field
         */
        date(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * JSON field
         */
        json(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Email field with validation
         */
        email(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * URL field with validation
         */
        url(options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Foreign key field
         */
        foreignKey(model: string, options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Enum field
         */
        enum(values: string[], options?: Partial<FieldDefinition>): FieldDefinition;
        /**
         * Timestamp fields (created_at, updated_at)
         */
        timestamps(): Record<string, FieldDefinition>;
        /**
         * Soft delete field
         */
        deletedAt(): FieldDefinition;
    };
    /**
     * Create index definition
     */
    static createIndex(fields: string[], options?: Omit<IndexDefinition, 'fields'>): IndexDefinition;
    /**
     * Common index patterns
     */
    static indexes: {
        /**
         * Unique index
         */
        unique(fields: string[], options?: Partial<IndexDefinition>): IndexDefinition;
        /**
         * Composite index
         */
        composite(fields: string[], options?: Partial<IndexDefinition>): IndexDefinition;
        /**
         * Full-text index
         */
        fullText(fields: string[], options?: Partial<IndexDefinition>): IndexDefinition;
        /**
         * Hash index
         */
        hash(field: string, options?: Partial<IndexDefinition>): IndexDefinition;
    };
    /**
     * Validate schema definition
     */
    static validateSchema(schema: SchemaDefinition): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Generate SQL DDL from schema
     */
    static generateDDL(tableName: string, schema: SchemaDefinition, dialect?: 'postgres' | 'mysql' | 'sqlite'): string;
    /**
     * Generate index DDL
     */
    private static generateIndexDDL;
    /**
     * Format default value for SQL
     */
    private static formatDefaultValue;
}
/**
 * Schema builder for fluent API
 */
export declare class SchemaBuilder {
    private fields;
    private indexes;
    private options;
    /**
     * Add a field
     */
    addField(name: string, definition: FieldDefinition): this;
    /**
     * Add multiple fields
     */
    addFields(fields: Record<string, FieldDefinition>): this;
    /**
     * Add an index
     */
    addIndex(index: IndexDefinition): this;
    /**
     * Enable timestamps
     */
    withTimestamps(): this;
    /**
     * Enable soft deletes
     */
    withSoftDeletes(): this;
    /**
     * Set table name
     */
    tableName(name: string): this;
    /**
     * Build the schema
     */
    build(): SchemaDefinition;
}
/**
 * Common schema patterns
 */
export declare class SchemaPatterns {
    /**
     * User schema pattern
     */
    static user(): SchemaDefinition;
    /**
     * Audit schema pattern
     */
    static auditLog(): SchemaDefinition;
    /**
     * Settings schema pattern
     */
    static settings(): SchemaDefinition;
}
/**
 * Create schema builder instance
 */
export declare function createSchemaBuilder(): SchemaBuilder;
export { SchemaDesignKit };
//# sourceMappingURL=schema-design-kit.d.ts.map