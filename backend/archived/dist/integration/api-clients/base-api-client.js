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
var BaseApiClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiClient = void 0;
const common_1 = require("@nestjs/common");
let BaseApiClient = BaseApiClient_1 = class BaseApiClient {
    config;
    logger = new common_1.Logger(BaseApiClient_1.name);
    constructor(config) {
        this.config = config;
    }
    async get(path, config) {
        return this.request('GET', path, undefined, config);
    }
    async post(path, data, config) {
        return this.request('POST', path, data, config);
    }
    async put(path, data, config) {
        return this.request('PUT', path, data, config);
    }
    async delete(path, config) {
        return this.request('DELETE', path, undefined, config);
    }
    async request(method, path, data, config) {
        const mergedConfig = { ...this.config, ...config };
        const url = `${mergedConfig.baseUrl}${path}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...mergedConfig.headers,
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        let lastError = null;
        const maxAttempts = (mergedConfig.retryAttempts || 0) + 1;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await fetch(url, options);
                const responseData = await response.json();
                const headers = {};
                response.headers.forEach((value, key) => {
                    headers[key] = value;
                });
                return {
                    data: responseData,
                    status: response.status,
                    headers,
                };
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Request attempt ${attempt + 1}/${maxAttempts} failed: ${error}`);
                if (attempt < maxAttempts - 1) {
                    await this.delay(mergedConfig.retryDelay || 1000);
                }
            }
        }
        throw lastError;
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.BaseApiClient = BaseApiClient;
exports.BaseApiClient = BaseApiClient = BaseApiClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], BaseApiClient);
//# sourceMappingURL=base-api-client.js.map