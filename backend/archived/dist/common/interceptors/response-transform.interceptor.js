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
exports.ResponseTransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("./base.interceptor");
let ResponseTransformInterceptor = class ResponseTransformInterceptor extends base_interceptor_1.BaseInterceptor {
    constructor() {
        super();
    }
    intercept(context, next) {
        const { handler, controller } = this.getHandlerInfo(context);
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (this.isAlreadyFormatted(data)) {
                return data;
            }
            const hasPagination = data && typeof data === 'object' && 'pagination' in data;
            const response = {
                success: true,
                data: hasPagination ? data.data : data,
                timestamp: new Date().toISOString(),
            };
            if (hasPagination) {
                response.pagination = data.pagination;
            }
            if (data && typeof data === 'object' && 'message' in data) {
                response.message = data.message;
            }
            this.logResponse('debug', `Response transformed in ${controller}.${handler}`, {
                hasPagination,
                hasMessage: !!response.message,
                controller,
                handler,
            });
            return response;
        }));
    }
    isAlreadyFormatted(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        if ('success' in data) {
            return true;
        }
        if ('data' in data && 'statusCode' in data) {
            return true;
        }
        return false;
    }
};
exports.ResponseTransformInterceptor = ResponseTransformInterceptor;
exports.ResponseTransformInterceptor = ResponseTransformInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResponseTransformInterceptor);
//# sourceMappingURL=response-transform.interceptor.js.map