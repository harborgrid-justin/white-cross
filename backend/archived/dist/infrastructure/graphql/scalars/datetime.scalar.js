"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeScalar = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
let DateTimeScalar = class DateTimeScalar {
    description = 'ISO 8601 DateTime string (e.g., 2024-01-15T10:30:00Z)';
    parseValue(value) {
        if (!value) {
            throw new Error('DateTime cannot be null or undefined');
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid DateTime value: ${value}`);
        }
        return date;
    }
    serialize(value) {
        if (false) {
            throw new Error('DateTime must be a Date object');
        }
        if (isNaN(value.getTime())) {
            throw new Error('Invalid Date object');
        }
        return value.toISOString();
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            return this.parseValue(ast.value);
        }
        if (ast.kind === graphql_2.Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        throw new Error('DateTime must be a string or integer');
    }
};
exports.DateTimeScalar = DateTimeScalar;
exports.DateTimeScalar = DateTimeScalar = __decorate([
    (0, graphql_1.Scalar)('DateTime', () => Date)
], DateTimeScalar);
//# sourceMappingURL=datetime.scalar.js.map