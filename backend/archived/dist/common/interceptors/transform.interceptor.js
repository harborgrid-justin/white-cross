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
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("./base.interceptor");
let TransformInterceptor = class TransformInterceptor extends base_interceptor_1.BaseInterceptor {
    constructor() {
        super();
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const { handler, controller } = this.getHandlerInfo(context);
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data &&
                typeof data === 'object' &&
                'success' in data &&
                'statusCode' in data) {
                return data;
            }
            const meta = {
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
                requestId: request.headers['x-request-id'],
            };
            if (data && typeof data === 'object' && 'meta' in data) {
                const { meta: dataMeta, ...rest } = data;
                Object.assign(meta, dataMeta);
                data = rest;
            }
            const statusCode = response.statusCode || common_1.HttpStatus.OK;
            const standardResponse = {
                success: true,
                statusCode,
                message: this.getDefaultMessage(statusCode, request.method),
                data,
                meta,
            };
            this.logResponse('debug', `Response transformed in ${controller}.${handler}`, {
                statusCode,
                hasData: !!data,
                controller,
                handler,
            });
            return standardResponse;
        }));
    }
    getDefaultMessage(statusCode, method) {
        if (statusCode === common_1.HttpStatus.CREATED) {
            return 'Resource created successfully';
        }
        if (statusCode === common_1.HttpStatus.NO_CONTENT) {
            return 'Resource deleted successfully';
        }
        switch (method) {
            case 'GET':
                return 'Data retrieved successfully';
            case 'POST':
                return 'Resource created successfully';
            case 'PUT':
            case 'PATCH':
                return 'Resource updated successfully';
            case 'DELETE':
                return 'Resource deleted successfully';
            default:
                return 'Operation completed successfully';
        }
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map