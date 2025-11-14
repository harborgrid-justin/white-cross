"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMappingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("./base.interceptor");
const sequelize_1 = require("sequelize");
let ErrorMappingInterceptor = class ErrorMappingInterceptor extends base_interceptor_1.BaseInterceptor {
    constructor() {
        super();
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            if (error instanceof common_1.HttpException) {
                return (0, rxjs_1.throwError)(() => error);
            }
            const mappedError = this.mapError(error);
            const { handler, controller } = this.getHandlerInfo(context);
            this.logError(`Error mapped in ${controller}.${handler}`, error, {
                originalError: error.name,
                mappedStatus: mappedError.getStatus(),
                controller,
                handler,
                errorCode: mappedError.getResponse()?.errorCode,
            });
            return (0, rxjs_1.throwError)(() => mappedError);
        }));
    }
    mapError(error) {
        if (error instanceof sequelize_1.UniqueConstraintError) {
            return new common_1.HttpException({
                error: 'Conflict',
                message: this.getUniqueConstraintMessage(error),
                errorCode: 'BUSINESS_002',
                details: error.errors?.map((e) => ({
                    field: e.path,
                    value: e.value,
                    message: 'Must be unique',
                })),
            }, common_1.HttpStatus.CONFLICT);
        }
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            return new common_1.HttpException({
                error: 'Bad Request',
                message: 'Referenced resource does not exist',
                errorCode: 'VALID_003',
                details: {
                    table: error.table,
                },
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (error instanceof sequelize_1.ValidationError) {
            return new common_1.HttpException({
                error: 'Unprocessable Entity',
                message: 'Validation failed',
                errorCode: 'VALID_002',
                details: error.errors?.map((e) => ({
                    field: e.path,
                    message: e.message,
                    value: e.value,
                })),
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (error instanceof sequelize_1.QueryError) {
            return new common_1.HttpException({
                error: 'Internal Server Error',
                message: 'Database operation failed',
                errorCode: 'SYSTEM_003',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (error.name === 'SequelizeConnectionError' ||
            error.name === 'SequelizeConnectionRefusedError') {
            return new common_1.HttpException({
                error: 'Service Unavailable',
                message: 'Database connection unavailable. Please try again later.',
                errorCode: 'SYSTEM_002',
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
            return new common_1.HttpException({
                error: 'Request Timeout',
                message: 'Request took too long to process',
                errorCode: 'SYSTEM_004',
            }, common_1.HttpStatus.REQUEST_TIMEOUT);
        }
        if (error.message?.toLowerCase().includes('not found')) {
            return new common_1.HttpException({
                error: 'Not Found',
                message: error.message,
                errorCode: 'BUSINESS_001',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (error.message?.toLowerCase().includes('unauthorized') ||
            error.message?.toLowerCase().includes('authentication')) {
            return new common_1.HttpException({
                error: 'Unauthorized',
                message: 'Authentication required',
                errorCode: 'AUTH_005',
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (error.message?.toLowerCase().includes('forbidden') ||
            error.message?.toLowerCase().includes('permission')) {
            return new common_1.HttpException({
                error: 'Forbidden',
                message: 'Insufficient permissions',
                errorCode: 'AUTHZ_001',
            }, common_1.HttpStatus.FORBIDDEN);
        }
        return new common_1.HttpException({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : error.message,
            errorCode: 'SYSTEM_001',
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    getUniqueConstraintMessage(error) {
        const fields = error.errors?.map((e) => e.path).join(', ');
        if (fields) {
            return `A resource with this ${fields} already exists`;
        }
        return 'Resource already exists';
    }
};
exports.ErrorMappingInterceptor = ErrorMappingInterceptor;
exports.ErrorMappingInterceptor = ErrorMappingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ErrorMappingInterceptor);
//# sourceMappingURL=error-mapping.interceptor.js.map