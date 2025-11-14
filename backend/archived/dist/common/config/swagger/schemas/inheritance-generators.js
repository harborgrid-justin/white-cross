"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExtendedSchema = generateExtendedSchema;
exports.generateAllOfSchema = generateAllOfSchema;
exports.generateOneOfSchema = generateOneOfSchema;
exports.generateAnyOfSchema = generateAnyOfSchema;
exports.generateNotSchema = generateNotSchema;
exports.generateMixinSchema = generateMixinSchema;
function generateExtendedSchema(baseSchemaRef, additionalProperties, description) {
    const schema = {
        allOf: [
            { $ref: baseSchemaRef },
            {
                type: 'object',
                properties: additionalProperties,
            },
        ],
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generateAllOfSchema(schemas, description) {
    const schema = {
        allOf: schemas,
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generateOneOfSchema(schemas, discriminator, description) {
    const schema = {
        oneOf: schemas,
    };
    if (discriminator) {
        schema.discriminator = discriminator;
    }
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generateAnyOfSchema(schemas, description) {
    const schema = {
        anyOf: schemas,
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generateNotSchema(notSchema, description) {
    const schema = {
        not: notSchema,
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generateMixinSchema(baseSchema, mixins, additionalProperties, description) {
    const schemas = [baseSchema, ...mixins];
    if (additionalProperties && Object.keys(additionalProperties).length > 0) {
        schemas.push({
            type: 'object',
            properties: additionalProperties,
        });
    }
    return generateAllOfSchema(schemas, description);
}
//# sourceMappingURL=inheritance-generators.js.map