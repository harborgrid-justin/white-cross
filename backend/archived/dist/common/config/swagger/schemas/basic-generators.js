"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStringSchema = generateStringSchema;
exports.generateNumericSchema = generateNumericSchema;
exports.generateBooleanSchema = generateBooleanSchema;
exports.generateArraySchema = generateArraySchema;
exports.generateObjectSchema = generateObjectSchema;
exports.generateRefSchema = generateRefSchema;
function generateStringSchema(description, options = {}) {
    const schema = {
        type: 'string',
        description,
    };
    if (options.format) {
        schema.format = options.format;
    }
    if (options.minLength !== undefined) {
        schema.minLength = options.minLength;
    }
    if (options.maxLength !== undefined) {
        schema.maxLength = options.maxLength;
    }
    if (options.pattern) {
        schema.pattern = options.pattern;
    }
    if (options.example !== undefined) {
        schema.example = options.example;
    }
    if (options.default !== undefined) {
        schema.default = options.default;
    }
    if (options.enum && options.enum.length > 0) {
        schema.enum = options.enum;
    }
    return schema;
}
function generateNumericSchema(description, options = {}) {
    const schema = {
        type: options.type || 'number',
        description,
    };
    if (options.format) {
        schema.format = options.format;
    }
    if (options.minimum !== undefined) {
        schema.minimum = options.minimum;
    }
    if (options.maximum !== undefined) {
        schema.maximum = options.maximum;
    }
    if (options.exclusiveMinimum !== undefined) {
        schema.exclusiveMinimum = options.exclusiveMinimum;
    }
    if (options.exclusiveMaximum !== undefined) {
        schema.exclusiveMaximum = options.exclusiveMaximum;
    }
    if (options.multipleOf !== undefined) {
        schema.multipleOf = options.multipleOf;
    }
    if (options.example !== undefined) {
        schema.example = options.example;
    }
    if (options.default !== undefined) {
        schema.default = options.default;
    }
    return schema;
}
function generateBooleanSchema(description, defaultValue, example) {
    const schema = {
        type: 'boolean',
        description,
    };
    if (defaultValue !== undefined) {
        schema.default = defaultValue;
    }
    if (example !== undefined) {
        schema.example = example;
    }
    return schema;
}
function generateArraySchema(description, itemSchema, options = {}) {
    const schema = {
        type: 'array',
        description,
        items: itemSchema,
    };
    if (options.minItems !== undefined) {
        schema.minItems = options.minItems;
    }
    if (options.maxItems !== undefined) {
        schema.maxItems = options.maxItems;
    }
    if (options.uniqueItems !== undefined) {
        schema.uniqueItems = options.uniqueItems;
    }
    if (options.example !== undefined) {
        schema.example = options.example;
    }
    if (options.default !== undefined) {
        schema.default = options.default;
    }
    return schema;
}
function generateObjectSchema(description, properties, requiredFields = [], options = {}) {
    const schema = {
        type: 'object',
        description,
        properties,
    };
    if (requiredFields.length > 0) {
        schema.required = requiredFields;
    }
    if (options.additionalProperties !== undefined) {
        schema.additionalProperties = options.additionalProperties;
    }
    if (options.minProperties !== undefined) {
        schema.minProperties = options.minProperties;
    }
    if (options.maxProperties !== undefined) {
        schema.maxProperties = options.maxProperties;
    }
    if (options.example !== undefined) {
        schema.example = options.example;
    }
    return schema;
}
function generateRefSchema(schemaName, description) {
    const schema = {
        $ref: `#/components/schemas/${schemaName}`,
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
//# sourceMappingURL=basic-generators.js.map