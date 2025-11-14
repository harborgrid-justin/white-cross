"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let WsValidationPipe = class WsValidationPipe {
    async transform(value, metadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metadata.metatype, value);
        const errors = await (0, class_validator_1.validate)(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            validationError: {
                target: false,
                value: false,
            },
        });
        if (errors.length > 0) {
            throw new websockets_1.WsException({
                type: 'VALIDATION_ERROR',
                message: 'Message validation failed',
                details: this.formatErrors(errors),
            });
        }
        return object;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    formatErrors(errors) {
        return errors.flatMap((error) => {
            if (error.constraints) {
                return Object.values(error.constraints);
            }
            if (error.children && error.children.length > 0) {
                return this.formatErrors(error.children);
            }
            return [`${error.property} failed validation`];
        });
    }
};
exports.WsValidationPipe = WsValidationPipe;
exports.WsValidationPipe = WsValidationPipe = __decorate([
    (0, common_1.Injectable)()
], WsValidationPipe);
//# sourceMappingURL=ws-validation.pipe.js.map