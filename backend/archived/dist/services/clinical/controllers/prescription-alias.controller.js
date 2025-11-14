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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionAliasController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
const base_1 = require("../../../common/base");
let PrescriptionAliasController = class PrescriptionAliasController extends base_1.BaseController {
    httpService;
    configService;
    constructor(httpService, configService) {
        super('PrescriptionAliasController');
        this.httpService = httpService;
        this.configService = configService;
    }
    async forwardToClinicalPrescriptions(req, res) {
        try {
            const path = req.path.replace('/prescriptions', '');
            const newPath = `/clinical/prescriptions${path}`;
            const baseUrl = this.configService.get('API_BASE_URL', 'http://localhost:3000');
            const fullUrl = `${baseUrl}${newPath}`;
            res.setHeader('X-Prescription-Alias', 'true');
            res.setHeader('X-Original-Path', req.path);
            res.setHeader('X-Forwarded-To', newPath);
            this.logInfo(`Forwarding ${req.method} request from ${req.path} to ${newPath}`);
            const queryString = new URLSearchParams(req.query).toString();
            const urlWithQuery = queryString ? `${fullUrl}?${queryString}` : fullUrl;
            let response;
            switch (req.method.toUpperCase()) {
                case 'GET':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(urlWithQuery, {
                        headers: this.forwardHeaders(req),
                        validateStatus: () => true,
                    }));
                    break;
                case 'POST':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(fullUrl, req.body, {
                        headers: this.forwardHeaders(req),
                        params: req.query,
                        validateStatus: () => true,
                    }));
                    break;
                case 'PATCH':
                case 'PUT':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(fullUrl, req.body, {
                        headers: this.forwardHeaders(req),
                        params: req.query,
                        validateStatus: () => true,
                    }));
                    break;
                case 'DELETE':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(fullUrl, {
                        headers: this.forwardHeaders(req),
                        params: req.query,
                        data: req.body,
                        validateStatus: () => true,
                    }));
                    break;
                default:
                    return res.status(405).json({
                        error: 'Method Not Allowed',
                        message: `HTTP method ${req.method} is not supported`,
                    });
            }
            Object.entries(response.headers).forEach(([key, value]) => {
                if (this.shouldForwardResponseHeader(key)) {
                    res.setHeader(key, value);
                }
            });
            return res.status(response.status).json(response.data);
        }
        catch (error) {
            this.logError(`Failed to forward prescription request: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to forward request to prescription service',
                details: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    forwardHeaders(req) {
        const headersToForward = {};
        if (req.headers.authorization) {
            headersToForward['authorization'] = req.headers.authorization;
        }
        if (req.headers['content-type']) {
            headersToForward['content-type'] = req.headers['content-type'];
        }
        if (req.headers['accept']) {
            headersToForward['accept'] = req.headers['accept'];
        }
        if (req.headers['user-agent']) {
            headersToForward['user-agent'] = req.headers['user-agent'];
        }
        headersToForward['X-Forwarded-From'] = 'PrescriptionAliasController';
        headersToForward['X-Internal-Forward'] = 'true';
        return headersToForward;
    }
    shouldForwardResponseHeader(headerName) {
        const lowerHeaderName = headerName.toLowerCase();
        const skipHeaders = [
            'connection',
            'keep-alive',
            'transfer-encoding',
            'upgrade',
            'host',
        ];
        return !skipHeaders.includes(lowerHeaderName);
    }
};
exports.PrescriptionAliasController = PrescriptionAliasController;
__decorate([
    openapi.ApiOperation({ summary: "Catch-all route handler that forwards all requests to /clinical/prescriptions\n\nThis uses the @All() decorator to match all HTTP methods and a wildcard\nparameter to match any path under /prescriptions.\n\nThe handler then internally forwards the request to the actual prescription\ncontroller at /clinical/prescriptions maintaining all original request data." }),
    (0, common_1.All)('*'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionAliasController.prototype, "forwardToClinicalPrescriptions", null);
exports.PrescriptionAliasController = PrescriptionAliasController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('prescriptions'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], PrescriptionAliasController);
//# sourceMappingURL=prescription-alias.controller.js.map