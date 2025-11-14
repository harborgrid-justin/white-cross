"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAddressScalar = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
let EmailAddressScalar = class EmailAddressScalar {
    description = 'Valid email address (RFC 5322 compliant)';
    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    strictEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    parseValue(value) {
        return this.validateAndNormalizeEmail(value);
    }
    serialize(value) {
        if (!value) {
            return value;
        }
        return this.validateAndNormalizeEmail(value);
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            return this.validateAndNormalizeEmail(ast.value);
        }
        throw new Error('EmailAddress must be a string');
    }
    validateAndNormalizeEmail(value) {
        if (!value) {
            throw new Error('EmailAddress must be a non-empty string');
        }
        const normalizedEmail = value.trim().toLowerCase();
        if (!this.emailRegex.test(normalizedEmail)) {
            throw new Error(`Invalid email address format: ${value}`);
        }
        const [localPart, domain] = normalizedEmail.split('@');
        if (localPart.length > 64) {
            throw new Error('Email local part exceeds maximum length of 64 characters');
        }
        if (domain.length > 255) {
            throw new Error('Email domain exceeds maximum length of 255 characters');
        }
        if (normalizedEmail.includes('..')) {
            throw new Error('Email address cannot contain consecutive dots');
        }
        const domainParts = domain.split('.');
        if (domainParts.length < 2 ||
            domainParts[domainParts.length - 1].length < 2) {
            throw new Error('Email domain must have a valid top-level domain');
        }
        return normalizedEmail;
    }
};
exports.EmailAddressScalar = EmailAddressScalar;
exports.EmailAddressScalar = EmailAddressScalar = __decorate([
    (0, graphql_1.Scalar)('EmailAddress')
], EmailAddressScalar);
//# sourceMappingURL=email-address.scalar.js.map