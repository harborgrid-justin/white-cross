"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerSchemaGeneratorsService = void 0;
const common_1 = require("@nestjs/common");
const schemas_1 = require("./swagger/schemas");
let SwaggerSchemaGeneratorsService = class SwaggerSchemaGeneratorsService {
    generateStringSchema(description, options) {
        return (0, schemas_1.generateStringSchema)(description, options);
    }
    generateNumericSchema(description, options) {
        return (0, schemas_1.generateNumericSchema)(description, options);
    }
    generateBooleanSchema(description, defaultValue, example) {
        return (0, schemas_1.generateBooleanSchema)(description, defaultValue, example);
    }
    generateArraySchema(description, itemSchema, options) {
        return (0, schemas_1.generateArraySchema)(description, itemSchema, options);
    }
    generateExtendedSchema(baseSchema, extensions, description) {
        return (0, schemas_1.generateExtendedSchema)(baseSchema, extensions, description);
    }
    generateMixinSchema(baseSchema, mixins, description) {
        return (0, schemas_1.generateMixinSchema)(baseSchema, mixins, description);
    }
    generatePolymorphicSchema(config) {
        return (0, schemas_1.generatePolymorphicSchema)(config);
    }
    generateDiscriminator(propertyName, mapping) {
        return (0, schemas_1.generateDiscriminator)(propertyName, mapping);
    }
    generatePolymorphicBaseSchema(discriminator, baseProperties, description) {
        return (0, schemas_1.generatePolymorphicBaseSchema)(discriminator, baseProperties, description);
    }
    generatePolymorphicSubtype(baseSchema, subtypeName, additionalProperties, discriminatorValue) {
        return (0, schemas_1.generatePolymorphicSubtype)(baseSchema, subtypeName, additionalProperties, discriminatorValue);
    }
    generatePolymorphicUnion(schemas, discriminator, description) {
        return (0, schemas_1.generatePolymorphicUnion)(schemas, discriminator, description);
    }
};
exports.SwaggerSchemaGeneratorsService = SwaggerSchemaGeneratorsService;
exports.SwaggerSchemaGeneratorsService = SwaggerSchemaGeneratorsService = __decorate([
    (0, common_1.Injectable)()
], SwaggerSchemaGeneratorsService);
//# sourceMappingURL=swagger-schema-generators.service.js.map