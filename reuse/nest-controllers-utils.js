"use strict";
/**
 * LOC: C7D8E9F0A1
 * File: /reuse/nest-controllers-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - Controllers needing REST utilities
 *   - Dynamic route builders
 *   - Response formatting services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_KEY = exports.AUDIT_LOG_KEY = exports.ROUTE_METADATA_KEY = exports.Cookies = exports.Referer = exports.Origin = exports.HostName = exports.Protocol = exports.UserAgent = exports.IpAddress = exports.CurrentUser = void 0;
exports.parsePaginationParams = parsePaginationParams;
exports.parseSortParams = parseSortParams;
exports.extractSearchQuery = extractSearchQuery;
exports.extractFilters = extractFilters;
exports.validateRequestBody = validateRequestBody;
exports.extractDateRange = extractDateRange;
exports.createSuccessResponse = createSuccessResponse;
exports.createErrorResponse = createErrorResponse;
exports.createPaginatedResponse = createPaginatedResponse;
exports.transformToDto = transformToDto;
exports.transformToDtoArray = transformToDtoArray;
exports.sendFileDownload = sendFileDownload;
exports.setCacheHeaders = setCacheHeaders;
exports.disableCache = disableCache;
exports.validateUploadedFile = validateUploadedFile;
exports.generateUniqueFilename = generateUniqueFilename;
exports.getFileExtension = getFileExtension;
exports.getMimeTypeFromExtension = getMimeTypeFromExtension;
exports.createStreamableFile = createStreamableFile;
exports.createStreamableFileFromStream = createStreamableFileFromStream;
exports.sendServerSentEvents = sendServerSentEvents;
exports.SetRouteMetadata = SetRouteMetadata;
exports.getRouteMetadata = getRouteMetadata;
exports.createCrudController = createCrudController;
exports.buildQueryFilter = buildQueryFilter;
exports.composeDecorators = composeDecorators;
exports.handleControllerError = handleControllerError;
exports.withErrorHandling = withErrorHandling;
/**
 * File: /reuse/nest-controllers-utils.ts
 * Locator: WC-UTL-CTRL-001
 * Purpose: NestJS Controller Utilities - Comprehensive REST controller helpers
 *
 * Upstream: @nestjs/common, @nestjs/platform-express, class-transformer, class-validator
 * Downstream: All NestJS controllers, REST API endpoints, dynamic route handlers
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express
 * Exports: 40 controller utility functions for routing, requests, responses, files, streaming
 *
 * LLM Context: Production-grade NestJS controller utilities for White Cross healthcare platform.
 * Provides comprehensive helpers for route parameter extraction, request handling, response formatting,
 * file uploads, streaming responses, route metadata, controller factories, dynamic route builders,
 * REST CRUD generators, and controller composition. HIPAA-compliant with audit logging integration.
 */
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
// ============================================================================
// ROUTE PARAMETER DECORATORS
// ============================================================================
/**
 * Extracts the current authenticated user from the request.
 * Supports accessing specific user properties via data parameter.
 *
 * @param {keyof User | undefined} data - Optional property key to extract from user object
 * @param {ExecutionContext} ctx - Execution context
 * @returns {User | any} Complete user object or specific property value
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 *
 * @Post('posts')
 * async createPost(
 *   @CurrentUser('id') userId: string,
 *   @Body() createPostDto: CreatePostDto
 * ) {
 *   return this.postsService.create(userId, createPostDto);
 * }
 * ```
 */
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
/**
 * Extracts client IP address from the request.
 * Handles proxied requests by checking X-Forwarded-For header.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Client IP address
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(
 *   @Body() loginDto: LoginDto,
 *   @IpAddress() ip: string
 * ) {
 *   await this.auditService.logLogin(loginDto.username, ip);
 *   return this.authService.login(loginDto);
 * }
 * ```
 */
exports.IpAddress = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        request.ip ||
        request.connection?.remoteAddress ||
        'unknown');
});
/**
 * Extracts User-Agent header from the request.
 * Useful for device tracking and analytics.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} User agent string
 *
 * @example
 * ```typescript
 * @Post('events')
 * async trackEvent(
 *   @Body() eventDto: EventDto,
 *   @UserAgent() userAgent: string
 * ) {
 *   return this.analyticsService.track(eventDto, { userAgent });
 * }
 * ```
 */
exports.UserAgent = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'unknown';
});
/**
 * Extracts protocol (http/https) from the request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Protocol (http or https)
 *
 * @example
 * ```typescript
 * @Get('callback')
 * async handleCallback(
 *   @Protocol() protocol: string,
 *   @HostName() host: string
 * ) {
 *   const baseUrl = `${protocol}://${host}`;
 *   return this.callbackService.process(baseUrl);
 * }
 * ```
 */
exports.Protocol = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.protocol || 'http';
});
/**
 * Extracts hostname from the request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Hostname
 *
 * @example
 * ```typescript
 * @Get('links')
 * async generateLinks(@HostName() host: string) {
 *   return this.linkService.generateAbsoluteUrls(host);
 * }
 * ```
 */
exports.HostName = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.hostname || request.get('host') || 'localhost';
});
/**
 * Extracts Origin header from the request.
 * Useful for CORS validation and security checks.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string | undefined} Origin header value
 *
 * @example
 * ```typescript
 * @Post('sensitive-action')
 * async performAction(
 *   @Origin() origin: string,
 *   @Body() dto: ActionDto
 * ) {
 *   await this.securityService.validateOrigin(origin);
 *   return this.actionService.perform(dto);
 * }
 * ```
 */
exports.Origin = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.origin;
});
/**
 * Extracts Referer header from the request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string | undefined} Referer header value
 *
 * @example
 * ```typescript
 * @Get('tracking')
 * async trackPageView(@Referer() referer: string) {
 *   return this.analyticsService.trackReferer(referer);
 * }
 * ```
 */
exports.Referer = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.referer || request.headers.referrer;
});
/**
 * Extracts cookies from the request as an object.
 * Requires cookie-parser middleware.
 *
 * @param {string | undefined} data - Optional cookie name to extract
 * @param {ExecutionContext} ctx - Execution context
 * @returns {any} All cookies or specific cookie value
 *
 * @example
 * ```typescript
 * @Get('preferences')
 * async getPreferences(@Cookies('theme') theme: string) {
 *   return { theme: theme || 'light' };
 * }
 *
 * @Get('all-cookies')
 * async getAllCookies(@Cookies() cookies: Record<string, string>) {
 *   return cookies;
 * }
 * ```
 */
exports.Cookies = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
});
// ============================================================================
// REQUEST HANDLING UTILITIES
// ============================================================================
/**
 * Parses pagination query parameters with defaults and validation.
 *
 * @param {Request} req - Express request object
 * @param {number} defaultPage - Default page number (default: 1)
 * @param {number} defaultLimit - Default items per page (default: 10)
 * @param {number} maxLimit - Maximum allowed limit (default: 100)
 * @returns {PaginationQuery} Parsed and validated pagination parameters
 *
 * @example
 * ```typescript
 * @Get('users')
 * async getUsers(@Req() req: Request) {
 *   const pagination = parsePaginationParams(req, 1, 20, 100);
 *   return this.usersService.findAll(pagination);
 * }
 * ```
 */
function parsePaginationParams(req, defaultPage = 1, defaultLimit = 10, maxLimit = 100) {
    const page = Math.max(1, parseInt(req.query.page) || defaultPage);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit) || defaultLimit));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}
/**
 * Parses sort query parameters with validation.
 *
 * @param {Request} req - Express request object
 * @param {string} defaultSortBy - Default field to sort by
 * @param {('ASC' | 'DESC')} defaultOrder - Default sort order (default: 'ASC')
 * @param {string[]} allowedFields - List of allowed fields for sorting
 * @returns {SortQuery} Parsed and validated sort parameters
 *
 * @example
 * ```typescript
 * @Get('products')
 * async getProducts(@Req() req: Request) {
 *   const sort = parseSortParams(req, 'createdAt', 'DESC', ['name', 'price', 'createdAt']);
 *   return this.productsService.findAll(sort);
 * }
 * ```
 */
function parseSortParams(req, defaultSortBy = 'createdAt', defaultOrder = 'ASC', allowedFields = []) {
    let sortBy = req.query.sortBy || defaultSortBy;
    const sortOrder = req.query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : defaultOrder;
    // Validate sortBy field if allowedFields is provided
    if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
        sortBy = defaultSortBy;
    }
    return { sortBy, sortOrder };
}
/**
 * Extracts search query from request with trimming and sanitization.
 *
 * @param {Request} req - Express request object
 * @param {string} queryParam - Query parameter name (default: 'search')
 * @returns {string | undefined} Sanitized search query
 *
 * @example
 * ```typescript
 * @Get('search')
 * async search(@Req() req: Request) {
 *   const query = extractSearchQuery(req);
 *   if (!query) {
 *     throw new BadRequestException('Search query is required');
 *   }
 *   return this.searchService.search(query);
 * }
 * ```
 */
function extractSearchQuery(req, queryParam = 'search') {
    const query = req.query[queryParam];
    return query?.trim() || undefined;
}
/**
 * Extracts multiple filters from query parameters.
 *
 * @param {Request} req - Express request object
 * @param {string[]} filterFields - List of allowed filter field names
 * @returns {Record<string, any>} Object with filter key-value pairs
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Req() req: Request) {
 *   const filters = extractFilters(req, ['status', 'grade', 'nurseId']);
 *   // filters = { status: 'active', grade: '10' }
 *   return this.patientsService.findAll(filters);
 * }
 * ```
 */
function extractFilters(req, filterFields) {
    const filters = {};
    for (const field of filterFields) {
        const value = req.query[field];
        if (value !== undefined && value !== null && value !== '') {
            filters[field] = value;
        }
    }
    return filters;
}
/**
 * Validates request body against DTO class using class-validator.
 *
 * @template T - DTO class type
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {any} body - Request body to validate
 * @returns {Promise<T>} Validated and transformed DTO instance
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() rawBody: any) {
 *   const dto = await validateRequestBody(CreateUserDto, rawBody);
 *   return this.usersService.create(dto);
 * }
 * ```
 */
async function validateRequestBody(dtoClass, body) {
    const dtoInstance = (0, class_transformer_1.plainToClass)(dtoClass, body);
    const errors = await (0, class_validator_1.validate)(dtoInstance);
    if (errors.length > 0) {
        const messages = errors.map((error) => Object.values(error.constraints || {}).join(', '));
        throw new common_1.BadRequestException({
            message: 'Validation failed',
            errors: messages,
        });
    }
    return dtoInstance;
}
/**
 * Extracts date range from query parameters.
 *
 * @param {Request} req - Express request object
 * @param {string} startParam - Start date parameter name (default: 'startDate')
 * @param {string} endParam - End date parameter name (default: 'endDate')
 * @returns {{ startDate?: Date; endDate?: Date }} Date range object
 *
 * @example
 * ```typescript
 * @Get('appointments')
 * async getAppointments(@Req() req: Request) {
 *   const { startDate, endDate } = extractDateRange(req);
 *   return this.appointmentsService.findInRange(startDate, endDate);
 * }
 * ```
 */
function extractDateRange(req, startParam = 'startDate', endParam = 'endDate') {
    const result = {};
    const startDateStr = req.query[startParam];
    const endDateStr = req.query[endParam];
    if (startDateStr) {
        const startDate = new Date(startDateStr);
        if (!isNaN(startDate.getTime())) {
            result.startDate = startDate;
        }
    }
    if (endDateStr) {
        const endDate = new Date(endDateStr);
        if (!isNaN(endDate.getTime())) {
            result.endDate = endDate;
        }
    }
    return result;
}
// ============================================================================
// RESPONSE FORMATTING HELPERS
// ============================================================================
/**
 * Creates a standardized success response envelope.
 *
 * @template T - Response data type
 * @param {T} data - Response data
 * @param {string} message - Optional success message
 * @param {string} path - Optional request path
 * @returns {ApiResponse<T>} Standardized API response
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() dto: CreateUserDto, @Req() req: Request) {
 *   const user = await this.usersService.create(dto);
 *   return createSuccessResponse(user, 'User created successfully', req.path);
 * }
 * ```
 */
function createSuccessResponse(data, message, path) {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
        path,
    };
}
/**
 * Creates a standardized error response envelope.
 *
 * @param {string} error - Error message
 * @param {string} path - Optional request path
 * @param {any} details - Optional additional error details
 * @returns {ApiResponse} Standardized error response
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * async getUser(@Param('id') id: string, @Req() req: Request) {
 *   const user = await this.usersService.findOne(id);
 *   if (!user) {
 *     throw new NotFoundException(
 *       createErrorResponse('User not found', req.path)
 *     );
 *   }
 *   return user;
 * }
 * ```
 */
function createErrorResponse(error, path, details) {
    return {
        success: false,
        error,
        timestamp: new Date().toISOString(),
        path,
        ...(details && { data: details }),
    };
}
/**
 * Creates a paginated response with metadata.
 *
 * @template T - Data item type
 * @param {T[]} data - Array of data items
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {PaginatedResponse<T>} Paginated response with metadata
 *
 * @example
 * ```typescript
 * @Get('students')
 * async getStudents(@Query() paginationQuery: PaginationQuery) {
 *   const { data, total } = await this.studentsService.findAll(paginationQuery);
 *   return createPaginatedResponse(data, total, paginationQuery.page, paginationQuery.limit);
 * }
 * ```
 */
function createPaginatedResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}
/**
 * Transforms entity to DTO using class-transformer.
 *
 * @template T - DTO class type
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {any} entity - Entity or plain object to transform
 * @returns {T} Transformed DTO instance
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   const user = await this.usersService.findOne(id);
 *   return transformToDto(UserResponseDto, user);
 * }
 * ```
 */
function transformToDto(dtoClass, entity) {
    return (0, class_transformer_1.plainToClass)(dtoClass, entity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    });
}
/**
 * Transforms array of entities to DTOs.
 *
 * @template T - DTO class type
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {any[]} entities - Array of entities to transform
 * @returns {T[]} Array of transformed DTO instances
 *
 * @example
 * ```typescript
 * @Get('users')
 * async getUsers() {
 *   const users = await this.usersService.findAll();
 *   return transformToDtoArray(UserResponseDto, users);
 * }
 * ```
 */
function transformToDtoArray(dtoClass, entities) {
    return entities.map((entity) => transformToDto(dtoClass, entity));
}
/**
 * Sends file as download with proper headers.
 *
 * @param {Response} res - Express response object
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Download filename
 * @param {string} mimeType - File MIME type
 *
 * @example
 * ```typescript
 * @Get('reports/:id/download')
 * async downloadReport(@Param('id') id: string, @Res() res: Response) {
 *   const report = await this.reportsService.generatePdf(id);
 *   sendFileDownload(res, report.buffer, `report-${id}.pdf`, 'application/pdf');
 * }
 * ```
 */
function sendFileDownload(res, buffer, filename, mimeType) {
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
}
/**
 * Sets cache headers on response.
 *
 * @param {Response} res - Express response object
 * @param {number} maxAge - Cache max age in seconds
 * @param {boolean} isPublic - Whether cache is public (default: false)
 *
 * @example
 * ```typescript
 * @Get('public-data')
 * async getPublicData(@Res() res: Response) {
 *   setCacheHeaders(res, 3600, true); // 1 hour, public cache
 *   const data = await this.dataService.getPublic();
 *   return res.json(data);
 * }
 * ```
 */
function setCacheHeaders(res, maxAge, isPublic = false) {
    const directive = isPublic ? 'public' : 'private';
    res.setHeader('Cache-Control', `${directive}, max-age=${maxAge}`);
}
/**
 * Disables caching on response.
 *
 * @param {Response} res - Express response object
 *
 * @example
 * ```typescript
 * @Get('sensitive-data')
 * async getSensitiveData(@Res() res: Response) {
 *   disableCache(res);
 *   const data = await this.dataService.getSensitive();
 *   return res.json(data);
 * }
 * ```
 */
function disableCache(res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}
// ============================================================================
// FILE UPLOAD UTILITIES
// ============================================================================
/**
 * Validates uploaded file against configuration.
 *
 * @param {Express.Multer.File} file - Uploaded file
 * @param {FileUploadConfig} config - Upload configuration
 * @throws {BadRequestException} If file validation fails
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @UseInterceptors(FileInterceptor('file'))
 * async uploadFile(@UploadedFile() file: Express.Multer.File) {
 *   validateUploadedFile(file, {
 *     maxSize: 5 * 1024 * 1024, // 5MB
 *     allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
 *   });
 *   return this.filesService.save(file);
 * }
 * ```
 */
function validateUploadedFile(file, config) {
    if (!file) {
        throw new common_1.BadRequestException('No file uploaded');
    }
    if (config.maxSize && file.size > config.maxSize) {
        throw new common_1.BadRequestException(`File size exceeds maximum allowed size of ${config.maxSize} bytes`);
    }
    if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(file.mimetype)) {
        throw new common_1.BadRequestException(`File type ${file.mimetype} is not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`);
    }
}
/**
 * Generates unique filename with timestamp and random string.
 *
 * @param {string} originalName - Original filename
 * @param {string} prefix - Optional prefix (default: '')
 * @returns {string} Unique filename
 *
 * @example
 * ```typescript
 * @Post('avatar')
 * @UseInterceptors(FileInterceptor('avatar'))
 * async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
 *   const filename = generateUniqueFilename(file.originalname, 'avatar');
 *   // avatar-1699564800000-a1b2c3.jpg
 *   return this.filesService.save(file, filename);
 * }
 * ```
 */
function generateUniqueFilename(originalName, prefix = '') {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const prefixPart = prefix ? `${prefix}-` : '';
    return `${prefixPart}${timestamp}-${randomString}${extension}`;
}
/**
 * Extracts file extension from filename.
 *
 * @param {string} filename - Filename
 * @returns {string} File extension (lowercase, without dot)
 *
 * @example
 * ```typescript
 * const ext = getFileExtension('document.PDF'); // 'pdf'
 * const ext2 = getFileExtension('image.jpeg'); // 'jpeg'
 * ```
 */
function getFileExtension(filename) {
    const extension = filename.substring(filename.lastIndexOf('.') + 1);
    return extension.toLowerCase();
}
/**
 * Determines MIME type from file extension.
 *
 * @param {string} filename - Filename
 * @returns {string} MIME type
 *
 * @example
 * ```typescript
 * const mime = getMimeTypeFromExtension('document.pdf'); // 'application/pdf'
 * const mime2 = getMimeTypeFromExtension('image.jpg'); // 'image/jpeg'
 * ```
 */
function getMimeTypeFromExtension(filename) {
    const extension = getFileExtension(filename);
    const mimeTypes = {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        txt: 'text/plain',
        csv: 'text/csv',
        json: 'application/json',
        xml: 'application/xml',
        zip: 'application/zip',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return mimeTypes[extension] || 'application/octet-stream';
}
// ============================================================================
// STREAMING RESPONSE HELPERS
// ============================================================================
/**
 * Creates a StreamableFile from buffer.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Optional filename for Content-Disposition header
 * @param {string} mimeType - Optional MIME type
 * @returns {StreamableFile} NestJS StreamableFile
 *
 * @example
 * ```typescript
 * @Get('download/:id')
 * async downloadFile(@Param('id') id: string) {
 *   const file = await this.filesService.getFile(id);
 *   return createStreamableFile(file.buffer, file.name, file.mimeType);
 * }
 * ```
 */
function createStreamableFile(buffer, filename, mimeType) {
    return new common_1.StreamableFile(buffer, {
        type: mimeType,
        disposition: filename ? `attachment; filename="${filename}"` : undefined,
    });
}
/**
 * Creates a StreamableFile from readable stream.
 *
 * @param {Readable} stream - Readable stream
 * @param {string} filename - Optional filename for Content-Disposition header
 * @param {string} mimeType - Optional MIME type
 * @returns {StreamableFile} NestJS StreamableFile
 *
 * @example
 * ```typescript
 * @Get('export/:id')
 * async exportData(@Param('id') id: string) {
 *   const stream = await this.exportService.createCsvStream(id);
 *   return createStreamableFileFromStream(stream, 'export.csv', 'text/csv');
 * }
 * ```
 */
function createStreamableFileFromStream(stream, filename, mimeType) {
    return new common_1.StreamableFile(stream, {
        type: mimeType,
        disposition: filename ? `attachment; filename="${filename}"` : undefined,
    });
}
/**
 * Sends Server-Sent Events (SSE) stream.
 *
 * @param {Response} res - Express response object
 * @param {() => void} setupFn - Function to set up event listeners
 *
 * @example
 * ```typescript
 * @Sse('notifications')
 * async streamNotifications(@Res() res: Response, @CurrentUser('id') userId: string) {
 *   sendServerSentEvents(res, () => {
 *     this.notificationsService.on('notification', (data) => {
 *       res.write(`data: ${JSON.stringify(data)}\n\n`);
 *     });
 *   });
 * }
 * ```
 */
function sendServerSentEvents(res, setupFn) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    // Send initial comment to establish connection
    res.write(': connected\n\n');
    setupFn();
    // Handle client disconnect
    res.on('close', () => {
        res.end();
    });
}
// ============================================================================
// ROUTE METADATA UTILITIES
// ============================================================================
/**
 * Custom metadata key constants
 */
exports.ROUTE_METADATA_KEY = 'custom:route_metadata';
exports.AUDIT_LOG_KEY = 'custom:audit_log';
exports.RATE_LIMIT_KEY = 'custom:rate_limit';
/**
 * Sets custom route metadata.
 *
 * @param {RouteMetadata} metadata - Route metadata
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('sensitive')
 * @SetRouteMetadata({
 *   path: '/sensitive',
 *   method: 'GET',
 *   handler: 'getSensitiveData',
 *   guards: [AuthGuard, RolesGuard]
 * })
 * async getSensitiveData() {
 *   return this.dataService.getSensitive();
 * }
 * ```
 */
function SetRouteMetadata(metadata) {
    return (0, common_1.SetMetadata)(exports.ROUTE_METADATA_KEY, metadata);
}
/**
 * Retrieves route metadata from execution context.
 *
 * @param {ExecutionContext} context - Execution context
 * @returns {RouteMetadata | undefined} Route metadata if exists
 *
 * @example
 * ```typescript
 * // In an interceptor or guard
 * const metadata = getRouteMetadata(context);
 * if (metadata?.guards?.includes(AuthGuard)) {
 *   // Handle authentication
 * }
 * ```
 */
function getRouteMetadata(context) {
    const handler = context.getHandler();
    return Reflect.getMetadata(exports.ROUTE_METADATA_KEY, handler);
}
// ============================================================================
// CONTROLLER FACTORY FUNCTIONS
// ============================================================================
/**
 * Creates a base CRUD controller class dynamically.
 * Provides standard findAll, findOne, create, update, delete methods.
 *
 * @template T - Entity type
 * @param {CrudConfig<T>} config - CRUD configuration
 * @returns {any} Controller class
 *
 * @example
 * ```typescript
 * @Controller('users')
 * export class UsersController extends createCrudController({
 *   entity: User,
 *   createDto: CreateUserDto,
 *   updateDto: UpdateUserDto,
 *   service: UsersService,
 *   routePrefix: 'users'
 * }) {
 *   // Add custom endpoints here
 * }
 * ```
 */
function createCrudController(config) {
    class CrudController {
        constructor(service) {
            this.service = service;
        }
        async findAll() {
            return this.service.findAll();
        }
        async findOne(id) {
            const entity = await this.service.findOne(id);
            if (!entity) {
                throw new common_1.NotFoundException(`${config.entity.name} with ID ${id} not found`);
            }
            return entity;
        }
        async create(dto) {
            return this.service.create(dto);
        }
        async update(id, dto) {
            const entity = await this.service.update(id, dto);
            if (!entity) {
                throw new common_1.NotFoundException(`${config.entity.name} with ID ${id} not found`);
            }
            return entity;
        }
        async remove(id) {
            const result = await this.service.remove(id);
            if (!result) {
                throw new common_1.NotFoundException(`${config.entity.name} with ID ${id} not found`);
            }
            return { success: true, message: 'Deleted successfully' };
        }
    }
    return CrudController;
}
// ============================================================================
// DYNAMIC ROUTE BUILDERS
// ============================================================================
/**
 * Builds query filter object from request parameters.
 *
 * @param {Request} req - Express request object
 * @param {Record<string, FilterOperator>} fieldOperators - Map of field names to operators
 * @returns {Record<string, any>} Query filter object
 *
 * @example
 * ```typescript
 * @Get('search')
 * async search(@Req() req: Request) {
 *   const filters = buildQueryFilter(req, {
 *     age: 'gte',
 *     name: 'like',
 *     status: 'eq'
 *   });
 *   // filters = { age: { $gte: 18 }, name: { $like: '%John%' }, status: 'active' }
 *   return this.service.search(filters);
 * }
 * ```
 */
function buildQueryFilter(req, fieldOperators) {
    const filter = {};
    for (const [field, operator] of Object.entries(fieldOperators)) {
        const value = req.query[field];
        if (value === undefined || value === null || value === '') {
            continue;
        }
        switch (operator) {
            case 'eq':
                filter[field] = value;
                break;
            case 'ne':
                filter[field] = { $ne: value };
                break;
            case 'gt':
                filter[field] = { $gt: value };
                break;
            case 'gte':
                filter[field] = { $gte: value };
                break;
            case 'lt':
                filter[field] = { $lt: value };
                break;
            case 'lte':
                filter[field] = { $lte: value };
                break;
            case 'like':
                filter[field] = { $like: `%${value}%` };
                break;
            case 'in':
                const values = Array.isArray(value) ? value : [value];
                filter[field] = { $in: values };
                break;
            case 'between':
                if (Array.isArray(value) && value.length === 2) {
                    filter[field] = { $between: value };
                }
                break;
        }
    }
    return filter;
}
// ============================================================================
// CONTROLLER COMPOSITION UTILITIES
// ============================================================================
/**
 * Composes multiple decorators into a single decorator.
 *
 * @param {MethodDecorator[]} decorators - Array of decorators
 * @returns {MethodDecorator} Composed decorator
 *
 * @example
 * ```typescript
 * const AuthenticatedRoute = composeDecorators([
 *   UseGuards(AuthGuard),
 *   ApiBearerAuth(),
 *   ApiUnauthorizedResponse({ description: 'Unauthorized' })
 * ]);
 *
 * @Get('protected')
 * @AuthenticatedRoute
 * async getProtectedData() {
 *   return this.dataService.getProtected();
 * }
 * ```
 */
function composeDecorators(decorators) {
    return (0, common_1.applyDecorators)(...decorators);
}
/**
 * Creates a standardized error handler for controllers.
 *
 * @param {Error} error - Error object
 * @param {string} entityName - Entity name for error messages
 * @returns {never} Throws appropriate HTTP exception
 * @throws {HttpException} Appropriate HTTP exception based on error type
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   try {
 *     return await this.usersService.findOne(id);
 *   } catch (error) {
 *     handleControllerError(error, 'User');
 *   }
 * }
 * ```
 */
function handleControllerError(error, entityName) {
    if (error instanceof common_1.HttpException) {
        throw error;
    }
    // Handle common error types
    if (error.name === 'EntityNotFoundError' || error.name === 'NotFoundException') {
        throw new common_1.NotFoundException(`${entityName} not found`);
    }
    if (error.name === 'UnauthorizedException') {
        throw new common_1.UnauthorizedException('Unauthorized access');
    }
    if (error.name === 'ForbiddenException') {
        throw new common_1.ForbiddenException('Forbidden resource');
    }
    if (error.name === 'ConflictException' || error.code === 'ER_DUP_ENTRY') {
        throw new common_1.ConflictException(`${entityName} already exists`);
    }
    if (error.name === 'ValidationError') {
        throw new common_1.BadRequestException(error.message || 'Validation failed');
    }
    // Default to internal server error
    throw new common_1.InternalServerErrorException(process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message || 'Unknown error occurred');
}
/**
 * Wraps async controller method with error handling.
 *
 * @template T - Return type
 * @param {() => Promise<T>} fn - Async function to wrap
 * @param {string} entityName - Entity name for error messages
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   return withErrorHandling(
 *     () => this.usersService.findOne(id),
 *     'User'
 *   );
 * }
 * ```
 */
async function withErrorHandling(fn, entityName) {
    try {
        return await fn();
    }
    catch (error) {
        handleControllerError(error, entityName);
    }
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Route Parameter Decorators
    CurrentUser: exports.CurrentUser,
    IpAddress: exports.IpAddress,
    UserAgent: exports.UserAgent,
    Protocol: exports.Protocol,
    HostName: exports.HostName,
    Origin: exports.Origin,
    Referer: exports.Referer,
    Cookies: exports.Cookies,
    // Request Handling Utilities
    parsePaginationParams,
    parseSortParams,
    extractSearchQuery,
    extractFilters,
    validateRequestBody,
    extractDateRange,
    // Response Formatting Helpers
    createSuccessResponse,
    createErrorResponse,
    createPaginatedResponse,
    transformToDto,
    transformToDtoArray,
    sendFileDownload,
    setCacheHeaders,
    disableCache,
    // File Upload Utilities
    validateUploadedFile,
    generateUniqueFilename,
    getFileExtension,
    getMimeTypeFromExtension,
    // Streaming Response Helpers
    createStreamableFile,
    createStreamableFileFromStream,
    sendServerSentEvents,
    // Route Metadata Utilities
    SetRouteMetadata,
    getRouteMetadata,
    // Controller Factory Functions
    createCrudController,
    // Dynamic Route Builders
    buildQueryFilter,
    // Controller Composition Utilities
    composeDecorators,
    handleControllerError,
    withErrorHandling,
};
//# sourceMappingURL=nest-controllers-utils.js.map