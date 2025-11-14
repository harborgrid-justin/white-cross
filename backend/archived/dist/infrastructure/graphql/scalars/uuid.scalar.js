"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDScalar = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
let UUIDScalar = class UUIDScalar {
    description = 'Universally Unique Identifier (UUID v4)';
    uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    parseValue(value) {
        return this.validateUUID(value);
    }
    serialize(value) {
        if (!value) {
            return value;
        }
        return this.validateUUID(value);
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            return this.validateUUID(ast.value);
        }
        throw new Error('UUID must be a string');
    }
    validateUUID(value) {
        if (!value) {
            throw new Error('UUID must be a non-empty string');
        }
        const normalizedUUID = value.toLowerCase().trim();
        if (!this.uuidV4Regex.test(normalizedUUID)) {
            throw new Error(`Invalid UUID v4 format: ${value}. Expected format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`);
        }
        return normalizedUUID;
    }
};
exports.UUIDScalar = UUIDScalar;
exports.UUIDScalar = UUIDScalar = __decorate([
    (0, graphql_1.Scalar)('UUID')
], UUIDScalar);
//# sourceMappingURL=uuid.scalar.js.map