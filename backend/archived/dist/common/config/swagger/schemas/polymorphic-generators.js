"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePolymorphicSchema = generatePolymorphicSchema;
exports.generateDiscriminator = generateDiscriminator;
exports.generatePolymorphicBaseSchema = generatePolymorphicBaseSchema;
exports.generatePolymorphicSubtype = generatePolymorphicSubtype;
exports.generatePolymorphicUnion = generatePolymorphicUnion;
function generatePolymorphicSchema(discriminatorProperty, schemas, description) {
    const schemaRefs = Object.values(schemas).map(ref => ({ $ref: ref }));
    const schema = {
        oneOf: schemaRefs,
        discriminator: {
            propertyName: discriminatorProperty,
            mapping: schemas,
        },
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generateDiscriminator(discriminatorProperty, typeMapping) {
    const mapping = {};
    Object.entries(typeMapping).forEach(([key, schemaName]) => {
        mapping[key] = `#/components/schemas/${schemaName}`;
    });
    return {
        propertyName: discriminatorProperty,
        mapping,
    };
}
function generatePolymorphicBaseSchema(discriminatorProperty, discriminatorType, allowedValues, baseProperties, description) {
    const properties = {
        [discriminatorProperty]: discriminatorType === 'enum' && allowedValues
            ? { type: 'string', enum: allowedValues }
            : { type: 'string' },
    };
    if (baseProperties) {
        Object.assign(properties, baseProperties);
    }
    const schema = {
        type: 'object',
        required: [discriminatorProperty],
        properties,
        discriminator: {
            propertyName: discriminatorProperty,
        },
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generatePolymorphicSubtype(baseSchemaRef, discriminatorValue, subtypeProperties, description) {
    const schema = {
        allOf: [
            { $ref: baseSchemaRef },
            {
                type: 'object',
                properties: subtypeProperties,
            },
        ],
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
function generatePolymorphicUnion(discriminatorProperty, typeSchemas, description) {
    const schema = {
        oneOf: typeSchemas,
        discriminator: {
            propertyName: discriminatorProperty,
        },
    };
    if (description) {
        schema.description = description;
    }
    return schema;
}
//# sourceMappingURL=polymorphic-generators.js.map