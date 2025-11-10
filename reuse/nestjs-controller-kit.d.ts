/**
 * LOC: N1C2K3T4L5
 * File: /reuse/nestjs-controller-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - Controllers requiring advanced route handling
 *   - Custom decorator implementations
 *   - File upload and streaming endpoints
 */
/**
 * File: /reuse/nestjs-controller-kit.ts
 * Locator: WC-UTL-NCTRL-001
 * Purpose: NestJS Controller Kit - Comprehensive controller utilities and decorators
 *
 * Upstream: @nestjs/common, @nestjs/swagger, @nestjs/platform-express, class-transformer, class-validator
 * Downstream: All NestJS controllers, route handlers, file uploads, streaming responses
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express, Multer
 * Exports: 45 controller utility functions for routing, decorators, requests, responses, files, streaming
 *
 * LLM Context: Production-grade NestJS controller toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for route decorators, parameter decorators, custom decorators,
 * request handling, response formatting, HTTP status helpers, error responses, file upload handling,
 * streaming responses, route guards, interceptors, and controller composition. HIPAA-compliant with
 * comprehensive audit logging, PHI protection, and healthcare-specific validation.
 */
import { HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Readable } from 'stream';
import { ClassConstructor } from 'class-transformer';
/**
 * Route configuration for dynamic route creation
 */
export interface RouteConfig {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
    summary?: string;
    description?: string;
    tags?: string[];
    deprecated?: boolean;
}
/**
 * HTTP status code helpers
 */
export type HttpStatusCode = keyof typeof HttpStatus;
/**
 * Response transformation options
 */
export interface TransformOptions {
    excludeExtraneousValues?: boolean;
    enableImplicitConversion?: boolean;
    groups?: string[];
}
/**
 * File upload metadata
 */
export interface UploadedFileMetadata {
    originalName: string;
    filename: string;
    size: number;
    mimetype: string;
    path?: string;
    uploadedAt: Date;
    uploadedBy?: string;
}
/**
 * Streaming options for large responses
 */
export interface StreamingOptions {
    chunkSize?: number;
    highWaterMark?: number;
    encoding?: BufferEncoding;
}
/**
 * API response metadata
 */
export interface ResponseMetadata {
    requestId?: string;
    timestamp: string;
    duration?: number;
    version?: string;
}
/**
 * Controller method metadata
 */
export interface MethodMetadata {
    controllerName: string;
    methodName: string;
    httpMethod: string;
    path: string;
    isPublic?: boolean;
    requiresAuth?: boolean;
}
/**
 * Creates a GET route with standardized API documentation.
 *
 * @param {string} path - Route path
 * @param {string} summary - Operation summary
 * @param {any} responseType - Response DTO class
 * @returns {MethodDecorator} Composed route decorator
 *
 * @example
 * ```typescript
 * @ApiGet('users/:id', 'Get user by ID', UserResponseDto)
 * async getUser(@Param('id') id: string) {
 *   return this.usersService.findOne(id);
 * }
 * ```
 */
export declare function ApiGet(path: string, summary: string, responseType?: any): MethodDecorator;
/**
 * Creates a POST route with standardized API documentation.
 *
 * @param {string} path - Route path
 * @param {string} summary - Operation summary
 * @param {any} responseType - Response DTO class
 * @param {any} bodyType - Request body DTO class
 * @returns {MethodDecorator} Composed route decorator
 *
 * @example
 * ```typescript
 * @ApiPost('users', 'Create new user', UserResponseDto, CreateUserDto)
 * @HttpCode(201)
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export declare function ApiPost(path: string, summary: string, responseType?: any, bodyType?: any): MethodDecorator;
/**
 * Creates a PUT route with standardized API documentation.
 *
 * @param {string} path - Route path
 * @param {string} summary - Operation summary
 * @param {any} responseType - Response DTO class
 * @param {any} bodyType - Request body DTO class
 * @returns {MethodDecorator} Composed route decorator
 *
 * @example
 * ```typescript
 * @ApiPut('users/:id', 'Update user', UserResponseDto, UpdateUserDto)
 * async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
 *   return this.usersService.update(id, dto);
 * }
 * ```
 */
export declare function ApiPut(path: string, summary: string, responseType?: any, bodyType?: any): MethodDecorator;
/**
 * Creates a PATCH route with standardized API documentation.
 *
 * @param {string} path - Route path
 * @param {string} summary - Operation summary
 * @param {any} responseType - Response DTO class
 * @param {any} bodyType - Request body DTO class
 * @returns {MethodDecorator} Composed route decorator
 *
 * @example
 * ```typescript
 * @ApiPatch('users/:id', 'Partially update user', UserResponseDto, PatchUserDto)
 * async patchUser(@Param('id') id: string, @Body() dto: PatchUserDto) {
 *   return this.usersService.patch(id, dto);
 * }
 * ```
 */
export declare function ApiPatch(path: string, summary: string, responseType?: any, bodyType?: any): MethodDecorator;
/**
 * Creates a DELETE route with standardized API documentation.
 *
 * @param {string} path - Route path
 * @param {string} summary - Operation summary
 * @returns {MethodDecorator} Composed route decorator
 *
 * @example
 * ```typescript
 * @ApiDelete('users/:id', 'Delete user')
 * @HttpCode(204)
 * async deleteUser(@Param('id') id: string) {
 *   await this.usersService.remove(id);
 * }
 * ```
 */
export declare function ApiDelete(path: string, summary: string): MethodDecorator;
/**
 * Creates a file upload route with proper documentation.
 *
 * @param {string} summary - Operation summary
 * @param {string} fieldName - Form field name for file upload
 * @param {boolean} multiple - Whether multiple files are allowed
 * @returns {MethodDecorator} Composed route decorator
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @ApiFileUpload('Upload medical document', 'file', false)
 * @UseInterceptors(FileInterceptor('file'))
 * async uploadFile(@UploadedFile() file: Express.Multer.File) {
 *   return this.filesService.save(file);
 * }
 * ```
 */
export declare function ApiFileUpload(summary: string, fieldName: string, multiple?: boolean): MethodDecorator;
/**
 * Extracts request ID from headers or generates a new one.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Request ID
 *
 * @example
 * ```typescript
 * @Post('events')
 * async createEvent(
 *   @RequestId() requestId: string,
 *   @Body() dto: CreateEventDto
 * ) {
 *   await this.auditService.log(requestId, 'EVENT_CREATED');
 *   return this.eventsService.create(dto);
 * }
 * ```
 */
export declare const RequestId: any;
/**
 * Extracts tenant ID from request headers or user context.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string | undefined} Tenant ID
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@TenantId() tenantId: string) {
 *   return this.patientsService.findByTenant(tenantId);
 * }
 * ```
 */
export declare const TenantId: any;
/**
 * Extracts organization ID from request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string | undefined} Organization ID
 *
 * @example
 * ```typescript
 * @Get('departments')
 * async getDepartments(@OrganizationId() orgId: string) {
 *   return this.departmentsService.findByOrganization(orgId);
 * }
 * ```
 */
export declare const OrganizationId: any;
/**
 * Extracts Accept-Language header for i18n.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Language code (default: 'en')
 *
 * @example
 * ```typescript
 * @Get('welcome')
 * async getWelcomeMessage(@Language() lang: string) {
 *   return this.i18nService.translate('welcome', lang);
 * }
 * ```
 */
export declare const Language: any;
/**
 * Extracts timezone from request headers or defaults to UTC.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Timezone identifier
 *
 * @example
 * ```typescript
 * @Get('appointments')
 * async getAppointments(@Timezone() timezone: string) {
 *   return this.appointmentsService.findByTimezone(timezone);
 * }
 * ```
 */
export declare const Timezone: any;
/**
 * Extracts API version from headers or URL.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} API version
 *
 * @example
 * ```typescript
 * @Get('data')
 * async getData(@ApiVersion() version: string) {
 *   return this.dataService.getByVersion(version);
 * }
 * ```
 */
export declare const ApiVersion: any;
/**
 * Extracts full request URL.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Full URL
 *
 * @example
 * ```typescript
 * @Post('webhooks')
 * async handleWebhook(@FullUrl() url: string, @Body() payload: any) {
 *   await this.webhooksService.log(url, payload);
 *   return { received: true };
 * }
 * ```
 */
export declare const FullUrl: any;
/**
 * Extracts query parameters as validated DTO.
 *
 * @param {ClassConstructor<T>} dtoClass - DTO class for transformation
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('search')
 * async search(@QueryDto(SearchQueryDto) query: SearchQueryDto) {
 *   return this.searchService.search(query);
 * }
 * ```
 */
export declare function QueryDto<T extends object>(dtoClass: ClassConstructor<T>): any;
/**
 * Extracts client information from request.
 *
 * @param {Request} req - Express request object
 * @returns {object} Client information (IP, user agent, platform)
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@Req() req: Request, @Body() dto: LoginDto) {
 *   const clientInfo = extractClientInfo(req);
 *   return this.authService.login(dto, clientInfo);
 * }
 * ```
 */
export declare function extractClientInfo(req: Request): {
    ip: string;
    userAgent: string;
    platform?: string;
    browser?: string;
};
/**
 * Checks if request accepts JSON response.
 *
 * @param {Request} req - Express request object
 * @returns {boolean} True if client accepts JSON
 *
 * @example
 * ```typescript
 * @Get('data')
 * async getData(@Req() req: Request) {
 *   if (!isJsonAccepted(req)) {
 *     throw new BadRequestException('JSON response required');
 *   }
 *   return this.dataService.getData();
 * }
 * ```
 */
export declare function isJsonAccepted(req: Request): boolean;
/**
 * Checks if request is from mobile device.
 *
 * @param {Request} req - Express request object
 * @returns {boolean} True if mobile device
 *
 * @example
 * ```typescript
 * @Get('dashboard')
 * async getDashboard(@Req() req: Request) {
 *   const isMobile = isMobileRequest(req);
 *   return this.dashboardService.getData(isMobile);
 * }
 * ```
 */
export declare function isMobileRequest(req: Request): boolean;
/**
 * Extracts authentication token from Authorization header.
 *
 * @param {Request} req - Express request object
 * @param {string} scheme - Authentication scheme (default: 'Bearer')
 * @returns {string | undefined} Token if present
 *
 * @example
 * ```typescript
 * @Get('protected')
 * async getProtected(@Req() req: Request) {
 *   const token = extractAuthToken(req);
 *   if (!token) {
 *     throw new UnauthorizedException('Token required');
 *   }
 *   return this.authService.validateToken(token);
 * }
 * ```
 */
export declare function extractAuthToken(req: Request, scheme?: string): string | undefined;
/**
 * Validates content type matches expected type.
 *
 * @param {Request} req - Express request object
 * @param {string} expectedType - Expected content type
 * @throws {BadRequestException} If content type doesn't match
 *
 * @example
 * ```typescript
 * @Post('data')
 * async postData(@Req() req: Request, @Body() data: any) {
 *   validateContentType(req, 'application/json');
 *   return this.dataService.process(data);
 * }
 * ```
 */
export declare function validateContentType(req: Request, expectedType: string): void;
/**
 * Parses range header for partial content requests.
 *
 * @param {Request} req - Express request object
 * @param {number} totalSize - Total content size
 * @returns {{ start: number; end: number } | undefined} Range object or undefined
 *
 * @example
 * ```typescript
 * @Get('video/:id')
 * async getVideo(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
 *   const video = await this.videosService.findOne(id);
 *   const range = parseRangeHeader(req, video.size);
 *   if (range) {
 *     return this.videosService.streamPartial(video, range, res);
 *   }
 *   return this.videosService.stream(video, res);
 * }
 * ```
 */
export declare function parseRangeHeader(req: Request, totalSize: number): {
    start: number;
    end: number;
} | undefined;
/**
 * Creates standardized success response with metadata.
 *
 * @template T - Response data type
 * @param {T} data - Response data
 * @param {ResponseMetadata} metadata - Response metadata
 * @returns {object} Formatted response
 *
 * @example
 * ```typescript
 * @Get('users')
 * async getUsers(@RequestId() requestId: string) {
 *   const users = await this.usersService.findAll();
 *   return formatSuccessResponse(users, {
 *     requestId,
 *     timestamp: new Date().toISOString(),
 *     version: '1.0'
 *   });
 * }
 * ```
 */
export declare function formatSuccessResponse<T>(data: T, metadata?: ResponseMetadata): {
    success: true;
    data: T;
    meta: ResponseMetadata;
};
/**
 * Creates standardized error response with details.
 *
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Optional error details
 * @param {ResponseMetadata} metadata - Response metadata
 * @returns {object} Formatted error response
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * async getUser(@Param('id') id: string, @RequestId() requestId: string) {
 *   const user = await this.usersService.findOne(id);
 *   if (!user) {
 *     throw new NotFoundException(
 *       formatErrorResponse('User not found', 404, null, { requestId })
 *     );
 *   }
 *   return user;
 * }
 * ```
 */
export declare function formatErrorResponse(error: string, statusCode: number, details?: any, metadata?: ResponseMetadata): {
    success: false;
    error: string;
    statusCode: number;
    details?: any;
    meta: ResponseMetadata;
};
/**
 * Sends JSON response with custom status code.
 *
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response data
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
 *   const user = await this.usersService.create(dto);
 *   sendJsonResponse(res, 201, { success: true, data: user });
 * }
 * ```
 */
export declare function sendJsonResponse(res: Response, statusCode: number, data: any): void;
/**
 * Sends no content response (204).
 *
 * @param {Response} res - Express response object
 *
 * @example
 * ```typescript
 * @Delete('users/:id')
 * async deleteUser(@Param('id') id: string, @Res() res: Response) {
 *   await this.usersService.remove(id);
 *   sendNoContent(res);
 * }
 * ```
 */
export declare function sendNoContent(res: Response): void;
/**
 * Sends created response (201) with location header.
 *
 * @param {Response} res - Express response object
 * @param {string} location - Resource location URL
 * @param {any} data - Response data
 *
 * @example
 * ```typescript
 * @Post('patients')
 * async createPatient(@Body() dto: CreatePatientDto, @Res() res: Response) {
 *   const patient = await this.patientsService.create(dto);
 *   sendCreated(res, `/api/patients/${patient.id}`, patient);
 * }
 * ```
 */
export declare function sendCreated(res: Response, location: string, data: any): void;
/**
 * Sends accepted response (202) for async operations.
 *
 * @param {Response} res - Express response object
 * @param {string} jobId - Job/task identifier
 * @param {string} statusUrl - URL to check job status
 *
 * @example
 * ```typescript
 * @Post('reports/generate')
 * async generateReport(@Body() dto: GenerateReportDto, @Res() res: Response) {
 *   const job = await this.reportsService.queueGeneration(dto);
 *   sendAccepted(res, job.id, `/api/reports/status/${job.id}`);
 * }
 * ```
 */
export declare function sendAccepted(res: Response, jobId: string, statusUrl: string): void;
/**
 * Sends partial content response (206) with range headers.
 *
 * @param {Response} res - Express response object
 * @param {Buffer} chunk - Content chunk
 * @param {number} start - Start byte position
 * @param {number} end - End byte position
 * @param {number} total - Total content size
 * @param {string} contentType - Content MIME type
 *
 * @example
 * ```typescript
 * @Get('videos/:id')
 * async streamVideo(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
 *   const video = await this.videosService.findOne(id);
 *   const range = parseRangeHeader(req, video.size);
 *   if (range) {
 *     const chunk = await this.videosService.getChunk(id, range.start, range.end);
 *     sendPartialContent(res, chunk, range.start, range.end, video.size, 'video/mp4');
 *   }
 * }
 * ```
 */
export declare function sendPartialContent(res: Response, chunk: Buffer, start: number, end: number, total: number, contentType: string): void;
/**
 * Throws 400 Bad Request with custom message.
 *
 * @param {string} message - Error message
 * @param {any} details - Optional error details
 * @throws {BadRequestException} Bad request exception
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() dto: CreateUserDto) {
 *   if (!dto.email) {
 *     throwBadRequest('Email is required');
 *   }
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export declare function throwBadRequest(message: string, details?: any): never;
/**
 * Throws 401 Unauthorized with custom message.
 *
 * @param {string} message - Error message
 * @throws {UnauthorizedException} Unauthorized exception
 *
 * @example
 * ```typescript
 * @Get('protected')
 * async getProtected(@Req() req: Request) {
 *   const token = extractAuthToken(req);
 *   if (!token) {
 *     throwUnauthorized('Authentication required');
 *   }
 *   return this.dataService.getProtected();
 * }
 * ```
 */
export declare function throwUnauthorized(message?: string): never;
/**
 * Throws 403 Forbidden with custom message.
 *
 * @param {string} message - Error message
 * @throws {ForbiddenException} Forbidden exception
 *
 * @example
 * ```typescript
 * @Delete('users/:id')
 * async deleteUser(@Param('id') id: string, @CurrentUser() user: User) {
 *   if (user.role !== 'admin') {
 *     throwForbidden('Admin access required');
 *   }
 *   await this.usersService.remove(id);
 * }
 * ```
 */
export declare function throwForbidden(message?: string): never;
/**
 * Throws 404 Not Found with custom message.
 *
 * @param {string} resource - Resource name
 * @param {string} identifier - Resource identifier
 * @throws {NotFoundException} Not found exception
 *
 * @example
 * ```typescript
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   const patient = await this.patientsService.findOne(id);
 *   if (!patient) {
 *     throwNotFound('Patient', id);
 *   }
 *   return patient;
 * }
 * ```
 */
export declare function throwNotFound(resource: string, identifier?: string): never;
/**
 * Throws 409 Conflict with custom message.
 *
 * @param {string} message - Error message
 * @throws {ConflictException} Conflict exception
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() dto: CreateUserDto) {
 *   const existing = await this.usersService.findByEmail(dto.email);
 *   if (existing) {
 *     throwConflict('User with this email already exists');
 *   }
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export declare function throwConflict(message: string): never;
/**
 * Throws 500 Internal Server Error with custom message.
 *
 * @param {string} message - Error message
 * @param {any} error - Original error object
 * @throws {InternalServerErrorException} Internal server error exception
 *
 * @example
 * ```typescript
 * @Get('data')
 * async getData() {
 *   try {
 *     return await this.dataService.getData();
 *   } catch (error) {
 *     throwInternalError('Failed to fetch data', error);
 *   }
 * }
 * ```
 */
export declare function throwInternalError(message: string, error?: any): never;
/**
 * Creates file upload metadata from uploaded file.
 *
 * @param {Express.Multer.File} file - Uploaded file
 * @param {string} uploadedBy - User identifier who uploaded the file
 * @returns {UploadedFileMetadata} File metadata
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @UseInterceptors(FileInterceptor('file'))
 * async uploadFile(
 *   @UploadedFile() file: Express.Multer.File,
 *   @CurrentUser('id') userId: string
 * ) {
 *   const metadata = createFileMetadata(file, userId);
 *   return this.filesService.saveMetadata(metadata);
 * }
 * ```
 */
export declare function createFileMetadata(file: Express.Multer.File, uploadedBy?: string): UploadedFileMetadata;
/**
 * Validates multiple uploaded files.
 *
 * @param {Express.Multer.File[]} files - Uploaded files array
 * @param {number} maxFiles - Maximum number of files allowed
 * @param {number} maxSize - Maximum size per file in bytes
 * @param {string[]} allowedMimeTypes - Allowed MIME types
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * @Post('upload-multiple')
 * @UseInterceptors(FilesInterceptor('files', 10))
 * async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
 *   validateMultipleFiles(files, 10, 5 * 1024 * 1024, ['image/jpeg', 'image/png']);
 *   return this.filesService.saveAll(files);
 * }
 * ```
 */
export declare function validateMultipleFiles(files: Express.Multer.File[], maxFiles: number, maxSize: number, allowedMimeTypes: string[]): void;
/**
 * Generates safe filename from original filename.
 *
 * @param {string} originalName - Original filename
 * @param {boolean} preserveExtension - Whether to preserve file extension
 * @returns {string} Safe filename
 *
 * @example
 * ```typescript
 * const safeName = sanitizeFilename('my document!@#.pdf', true);
 * // Returns: 'my-document.pdf'
 * ```
 */
export declare function sanitizeFilename(originalName: string, preserveExtension?: boolean): string;
/**
 * Creates readable stream from array of data chunks.
 *
 * @template T - Data type
 * @param {T[]} data - Array of data items
 * @param {StreamingOptions} options - Streaming options
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * @Get('export')
 * async exportData(@Res() res: Response) {
 *   const data = await this.dataService.getAll();
 *   const stream = createDataStream(data, { chunkSize: 100 });
 *   stream.pipe(res);
 * }
 * ```
 */
export declare function createDataStream<T>(data: T[], options?: StreamingOptions): Readable;
/**
 * Converts async generator to readable stream.
 *
 * @template T - Data type
 * @param {AsyncGenerator<T>} generator - Async generator
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * @Get('stream-data')
 * async streamData(@Res() res: Response) {
 *   const generator = this.dataService.generateData();
 *   const stream = generatorToStream(generator);
 *   stream.pipe(res);
 * }
 * ```
 */
export declare function generatorToStream<T>(generator: AsyncGenerator<T>): Readable;
/**
 * Creates CSV stream from array of objects.
 *
 * @template T - Object type
 * @param {T[]} data - Array of objects
 * @param {string[]} headers - CSV headers
 * @returns {Readable} CSV stream
 *
 * @example
 * ```typescript
 * @Get('export.csv')
 * async exportCsv(@Res() res: Response) {
 *   const patients = await this.patientsService.findAll();
 *   const stream = createCsvStream(patients, ['id', 'name', 'email', 'phone']);
 *   res.setHeader('Content-Type', 'text/csv');
 *   res.setHeader('Content-Disposition', 'attachment; filename="patients.csv"');
 *   stream.pipe(res);
 * }
 * ```
 */
export declare function createCsvStream<T extends Record<string, any>>(data: T[], headers: string[]): Readable;
declare const _default: {
    ApiGet: typeof ApiGet;
    ApiPost: typeof ApiPost;
    ApiPut: typeof ApiPut;
    ApiPatch: typeof ApiPatch;
    ApiDelete: typeof ApiDelete;
    ApiFileUpload: typeof ApiFileUpload;
    RequestId: any;
    TenantId: any;
    OrganizationId: any;
    Language: any;
    Timezone: any;
    ApiVersion: any;
    FullUrl: any;
    QueryDto: typeof QueryDto;
    extractClientInfo: typeof extractClientInfo;
    isJsonAccepted: typeof isJsonAccepted;
    isMobileRequest: typeof isMobileRequest;
    extractAuthToken: typeof extractAuthToken;
    validateContentType: typeof validateContentType;
    parseRangeHeader: typeof parseRangeHeader;
    formatSuccessResponse: typeof formatSuccessResponse;
    formatErrorResponse: typeof formatErrorResponse;
    sendJsonResponse: typeof sendJsonResponse;
    sendNoContent: typeof sendNoContent;
    sendCreated: typeof sendCreated;
    sendAccepted: typeof sendAccepted;
    sendPartialContent: typeof sendPartialContent;
    throwBadRequest: typeof throwBadRequest;
    throwUnauthorized: typeof throwUnauthorized;
    throwForbidden: typeof throwForbidden;
    throwNotFound: typeof throwNotFound;
    throwConflict: typeof throwConflict;
    throwInternalError: typeof throwInternalError;
    createFileMetadata: typeof createFileMetadata;
    validateMultipleFiles: typeof validateMultipleFiles;
    sanitizeFilename: typeof sanitizeFilename;
    createDataStream: typeof createDataStream;
    generatorToStream: typeof generatorToStream;
    createCsvStream: typeof createCsvStream;
};
export default _default;
//# sourceMappingURL=nestjs-controller-kit.d.ts.map