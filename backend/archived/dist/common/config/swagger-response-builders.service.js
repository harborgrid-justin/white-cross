"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerResponseBuildersService = void 0;
const common_1 = require("@nestjs/common");
const successBuilders = __importStar(require("./swagger/responses/success-builders"));
const errorBuilders = __importStar(require("./swagger/responses/error-builders"));
const paginationBuilders = __importStar(require("./swagger/responses/pagination-builders"));
const fileBuilders = __importStar(require("./swagger/responses/file-builders"));
const headerUtilities = __importStar(require("./swagger/responses/header-utilities"));
const base_1 = require("../base");
__exportStar(require("./swagger/responses"), exports);
let SwaggerResponseBuildersService = class SwaggerResponseBuildersService extends base_1.BaseService {
    constructor() {
        super("SwaggerResponseBuildersService");
    }
    get success() {
        return {
            createSuccessResponse: successBuilders.createSuccessResponse,
            createCreatedResponse: successBuilders.createCreatedResponse,
            createAcceptedResponse: successBuilders.createAcceptedResponse,
            createNoContentResponse: successBuilders.createNoContentResponse,
            createPartialContentResponse: successBuilders.createPartialContentResponse,
            createMultiStatusResponse: successBuilders.createMultiStatusResponse,
            createNotModifiedResponse: successBuilders.createNotModifiedResponse,
            createSuccessResponseWithHeaders: successBuilders.createSuccessResponseWithHeaders,
        };
    }
    get error() {
        return {
            createBadRequestError: errorBuilders.createBadRequestError,
            createUnauthorizedError: errorBuilders.createUnauthorizedError,
            createForbiddenError: errorBuilders.createForbiddenError,
            createNotFoundError: errorBuilders.createNotFoundError,
            createConflictError: errorBuilders.createConflictError,
            createGoneError: errorBuilders.createGoneError,
            createUnprocessableEntityError: errorBuilders.createUnprocessableEntityError,
            createTooManyRequestsError: errorBuilders.createTooManyRequestsError,
            createInternalServerError: errorBuilders.createInternalServerError,
            createServiceUnavailableError: errorBuilders.createServiceUnavailableError,
        };
    }
    get pagination() {
        return {
            createCursorPaginatedResponse: paginationBuilders.createCursorPaginatedResponse,
            createOffsetPaginatedResponse: paginationBuilders.createOffsetPaginatedResponse,
            createLinkHeaderPaginatedResponse: paginationBuilders.createLinkHeaderPaginatedResponse,
            createKeysetPaginatedResponse: paginationBuilders.createKeysetPaginatedResponse,
            createInfiniteScrollResponse: paginationBuilders.createInfiniteScrollResponse,
            createBatchPaginatedResponse: paginationBuilders.createBatchPaginatedResponse,
            createGroupedPaginatedResponse: paginationBuilders.createGroupedPaginatedResponse,
            createAggregatedPaginatedResponse: paginationBuilders.createAggregatedPaginatedResponse,
        };
    }
    get file() {
        return {
            createFileDownloadResponse: fileBuilders.createFileDownloadResponse,
            createStreamingFileResponse: fileBuilders.createStreamingFileResponse,
            createZipDownloadResponse: fileBuilders.createZipDownloadResponse,
            createCsvExportResponse: fileBuilders.createCsvExportResponse,
            createExcelExportResponse: fileBuilders.createExcelExportResponse,
            createImageResponse: fileBuilders.createImageResponse,
        };
    }
    get headers() {
        return {
            createCorsHeaders: headerUtilities.createCorsHeaders,
            createCacheControlHeaders: headerUtilities.createCacheControlHeaders,
            createSecurityHeaders: headerUtilities.createSecurityHeaders,
            createContentDispositionHeader: headerUtilities.createContentDispositionHeader,
            createETagHeader: headerUtilities.createETagHeader,
            createLastModifiedHeader: headerUtilities.createLastModifiedHeader,
            createTrackingHeaders: headerUtilities.createTrackingHeaders,
            createRateLimitHeaders: headerUtilities.createRateLimitHeaders,
            createPaginationHeaders: headerUtilities.createPaginationHeaders,
            createDeprecationHeaders: headerUtilities.createDeprecationHeaders,
        };
    }
    createCustomResponse(type, status, description, options) {
        return successBuilders.createSuccessResponse(type, description, options?.isArray);
    }
};
exports.SwaggerResponseBuildersService = SwaggerResponseBuildersService;
exports.SwaggerResponseBuildersService = SwaggerResponseBuildersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SwaggerResponseBuildersService);
//# sourceMappingURL=swagger-response-builders.service.js.map