"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTOperation = exports.LinkRelation = void 0;
exports.createGetRoute = createGetRoute;
exports.createPostRoute = createPostRoute;
exports.createPutRoute = createPutRoute;
exports.createPatchRoute = createPatchRoute;
exports.createDeleteRoute = createDeleteRoute;
exports.createRESTfulRoutes = createRESTfulRoutes;
exports.createNestedResourceRoutes = createNestedResourceRoutes;
exports.createBulkOperationRoutes = createBulkOperationRoutes;
exports.createSearchRoutes = createSearchRoutes;
exports.generateResourceLinks = generateResourceLinks;
exports.generatePaginationLinks = generatePaginationLinks;
exports.wrapWithHATEOAS = wrapWithHATEOAS;
exports.generateRelatedResourceLinks = generateRelatedResourceLinks;
exports.generateActionLinks = generateActionLinks;
exports.createVersionedRoute = createVersionedRoute;
exports.createDeprecatedRoute = createDeprecatedRoute;
exports.createExperimentalRoute = createExperimentalRoute;
exports.createHealthCheckRoute = createHealthCheckRoute;
exports.createMetricsRoute = createMetricsRoute;
exports.createWebhookRoute = createWebhookRoute;
exports.createFileUploadRoute = createFileUploadRoute;
exports.createFileDownloadRoute = createFileDownloadRoute;
exports.createExportRoute = createExportRoute;
exports.createImportRoute = createImportRoute;
exports.composeRouteDecorators = composeRouteDecorators;
exports.createAuthenticatedRoute = createAuthenticatedRoute;
exports.createCachedRoute = createCachedRoute;
exports.createRateLimitedRoute = createRateLimitedRoute;
exports.createPaginatedRoute = createPaginatedRoute;
exports.createSortedRoute = createSortedRoute;
exports.createFilteredRoute = createFilteredRoute;
exports.createBatchRoute = createBatchRoute;
exports.createAsyncJobRoute = createAsyncJobRoute;
exports.createJobStatusRoute = createJobStatusRoute;
exports.generateControllerMetadata = generateControllerMetadata;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
var LinkRelation;
(function (LinkRelation) {
    LinkRelation["SELF"] = "self";
    LinkRelation["COLLECTION"] = "collection";
    LinkRelation["FIRST"] = "first";
    LinkRelation["LAST"] = "last";
    LinkRelation["NEXT"] = "next";
    LinkRelation["PREV"] = "prev";
    LinkRelation["RELATED"] = "related";
    LinkRelation["PARENT"] = "parent";
    LinkRelation["CHILD"] = "child";
    LinkRelation["CREATE"] = "create";
    LinkRelation["UPDATE"] = "update";
    LinkRelation["DELETE"] = "delete";
    LinkRelation["SEARCH"] = "search";
    LinkRelation["EDIT"] = "edit";
})(LinkRelation || (exports.LinkRelation = LinkRelation = {}));
var RESTOperation;
(function (RESTOperation) {
    RESTOperation["LIST"] = "list";
    RESTOperation["GET"] = "get";
    RESTOperation["CREATE"] = "create";
    RESTOperation["UPDATE"] = "update";
    RESTOperation["PATCH"] = "patch";
    RESTOperation["DELETE"] = "delete";
    RESTOperation["BULK_CREATE"] = "bulk_create";
    RESTOperation["BULK_UPDATE"] = "bulk_update";
    RESTOperation["BULK_DELETE"] = "bulk_delete";
    RESTOperation["SEARCH"] = "search";
    RESTOperation["COUNT"] = "count";
})(RESTOperation || (exports.RESTOperation = RESTOperation = {}));
function createGetRoute(path, summary, description) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary, description }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request processed successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid parameters' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
}
function createPostRoute(path, summary, description) {
    return (0, common_1.applyDecorators)((0, common_1.Post)(path), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary, description }), (0, swagger_1.ApiCreatedResponse)({ description: 'Resource created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - resource already exists' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
}
function createPutRoute(path, summary, description) {
    return (0, common_1.applyDecorators)((0, common_1.Put)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary, description }), (0, swagger_1.ApiOkResponse)({ description: 'Resource updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
}
function createPatchRoute(path, summary, description) {
    return (0, common_1.applyDecorators)((0, common_1.Patch)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary, description }), (0, swagger_1.ApiOkResponse)({ description: 'Resource partially updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
}
function createDeleteRoute(path, summary, description) {
    return (0, common_1.applyDecorators)((0, common_1.Delete)(path), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary, description }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Resource deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - resource has dependencies' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
}
function createRESTfulRoutes(config) {
    const { name, path, idParam = 'id', enabledOperations } = config;
    const routes = {};
    const isEnabled = (op) => !enabledOperations || enabledOperations.includes(op);
    if (isEnabled(RESTOperation.LIST)) {
        routes.list = createGetRoute('', `List all ${name}s`, `Retrieves paginated list of ${name}s`);
    }
    if (isEnabled(RESTOperation.GET)) {
        routes.get = createGetRoute(`:${idParam}`, `Get ${name} by ID`, `Retrieves a single ${name}`);
    }
    if (isEnabled(RESTOperation.CREATE)) {
        routes.create = createPostRoute('', `Create ${name}`, `Creates a new ${name}`);
    }
    if (isEnabled(RESTOperation.UPDATE)) {
        routes.update = createPutRoute(`:${idParam}`, `Update ${name}`, `Updates an existing ${name}`);
    }
    if (isEnabled(RESTOperation.PATCH)) {
        routes.patch = createPatchRoute(`:${idParam}`, `Partially update ${name}`, `Partially updates a ${name}`);
    }
    if (isEnabled(RESTOperation.DELETE)) {
        routes.delete = createDeleteRoute(`:${idParam}`, `Delete ${name}`, `Deletes a ${name}`);
    }
    return routes;
}
function createNestedResourceRoutes(parentResource, childResource, parentIdParam = `${parentResource}Id`, childIdParam = `${childResource}Id`) {
    return {
        listChildren: createGetRoute(`:${parentIdParam}/${childResource}s`, `List ${childResource}s for ${parentResource}`, `Retrieves all ${childResource}s belonging to a specific ${parentResource}`),
        getChild: createGetRoute(`:${parentIdParam}/${childResource}s/:${childIdParam}`, `Get ${childResource} of ${parentResource}`, `Retrieves a specific ${childResource} belonging to a ${parentResource}`),
        createChild: createPostRoute(`:${parentIdParam}/${childResource}s`, `Create ${childResource} for ${parentResource}`, `Creates a new ${childResource} under a specific ${parentResource}`),
        updateChild: createPutRoute(`:${parentIdParam}/${childResource}s/:${childIdParam}`, `Update ${childResource} of ${parentResource}`, `Updates a ${childResource} belonging to a ${parentResource}`),
        deleteChild: createDeleteRoute(`:${parentIdParam}/${childResource}s/:${childIdParam}`, `Delete ${childResource} of ${parentResource}`, `Deletes a ${childResource} from a ${parentResource}`),
    };
}
function createBulkOperationRoutes(resourceName) {
    return {
        bulkCreate: createPostRoute('bulk', `Bulk create ${resourceName}s`, `Creates multiple ${resourceName}s in a single request`),
        bulkUpdate: createPutRoute('bulk', `Bulk update ${resourceName}s`, `Updates multiple ${resourceName}s in a single request`),
        bulkDelete: (0, common_1.applyDecorators)((0, common_1.Delete)('bulk'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
            summary: `Bulk delete ${resourceName}s`,
            description: `Deletes multiple ${resourceName}s in a single request`,
        }), (0, swagger_1.ApiOkResponse)({ description: 'Resources deleted successfully' })),
    };
}
function createSearchRoutes(resourceName) {
    return {
        search: (0, common_1.applyDecorators)((0, common_1.Get)('search'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
            summary: `Search ${resourceName}s`,
            description: `Performs full-text search across ${resourceName}s`,
        }), (0, swagger_1.ApiQuery)({ name: 'q', required: true, description: 'Search query' }), (0, swagger_1.ApiOkResponse)({ description: 'Search results retrieved successfully' })),
        advancedSearch: (0, common_1.applyDecorators)((0, common_1.Post)('search'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
            summary: `Advanced search ${resourceName}s`,
            description: `Performs advanced search with complex criteria`,
        }), (0, swagger_1.ApiOkResponse)({ description: 'Search results retrieved successfully' })),
        count: (0, common_1.applyDecorators)((0, common_1.Get)('count'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
            summary: `Count ${resourceName}s`,
            description: `Returns the total count of ${resourceName}s matching criteria`,
        }), (0, swagger_1.ApiOkResponse)({ description: 'Count retrieved successfully' })),
    };
}
function generateResourceLinks(resource, resourceName, baseUrl, id) {
    const resourceUrl = `${baseUrl}/${resourceName}/${id}`;
    return [
        {
            rel: LinkRelation.SELF,
            href: resourceUrl,
            method: 'GET',
            type: 'application/json',
        },
        {
            rel: LinkRelation.COLLECTION,
            href: `${baseUrl}/${resourceName}`,
            method: 'GET',
            type: 'application/json',
        },
        {
            rel: LinkRelation.UPDATE,
            href: resourceUrl,
            method: 'PUT',
            type: 'application/json',
        },
        {
            rel: LinkRelation.DELETE,
            href: resourceUrl,
            method: 'DELETE',
        },
    ];
}
function generatePaginationLinks(baseUrl, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const links = [];
    links.push({
        rel: LinkRelation.SELF,
        href: `${baseUrl}?page=${page}&limit=${limit}`,
        method: 'GET',
    });
    if (page > 1) {
        links.push({
            rel: LinkRelation.FIRST,
            href: `${baseUrl}?page=1&limit=${limit}`,
            method: 'GET',
        });
    }
    if (page > 1) {
        links.push({
            rel: LinkRelation.PREV,
            href: `${baseUrl}?page=${page - 1}&limit=${limit}`,
            method: 'GET',
        });
    }
    if (page < totalPages) {
        links.push({
            rel: LinkRelation.NEXT,
            href: `${baseUrl}?page=${page + 1}&limit=${limit}`,
            method: 'GET',
        });
    }
    if (page < totalPages) {
        links.push({
            rel: LinkRelation.LAST,
            href: `${baseUrl}?page=${totalPages}&limit=${limit}`,
            method: 'GET',
        });
    }
    return links;
}
function wrapWithHATEOAS(data, links, embedded) {
    const resource = {
        data,
        _links: links,
    };
    if (embedded && Object.keys(embedded).length > 0) {
        resource._embedded = embedded;
    }
    return resource;
}
function generateRelatedResourceLinks(parentUrl, relations) {
    return Object.entries(relations).map(([name, config]) => ({
        rel: LinkRelation.RELATED,
        href: `${parentUrl}/${config.path}`,
        method: 'GET',
        type: 'application/json',
        title: name,
        ...(config.count !== undefined && { count: config.count }),
    }));
}
function generateActionLinks(resourceUrl, actions) {
    return Object.entries(actions).map(([action, method]) => ({
        rel: action,
        href: `${resourceUrl}/${action}`,
        method,
        type: 'application/json',
    }));
}
function createVersionedRoute(version, path, method, summary) {
    const methodDecorators = {
        GET: common_1.Get,
        POST: common_1.Post,
        PUT: common_1.Put,
        PATCH: common_1.Patch,
        DELETE: common_1.Delete,
    };
    return (0, common_1.applyDecorators)(methodDecorators[method](path), (0, common_1.SetMetadata)('version', version), (0, common_1.Header)('X-API-Version', version), (0, swagger_1.ApiOperation)({ summary }), (0, swagger_1.ApiTags)(version));
}
function createDeprecatedRoute(path, method, deprecatedSince, removeInVersion, migrateTo) {
    const methodDecorators = {
        GET: common_1.Get,
        POST: common_1.Post,
        PUT: common_1.Put,
        PATCH: common_1.Patch,
        DELETE: common_1.Delete,
    };
    const headers = [
        (0, common_1.Header)('X-Deprecated', 'true'),
        (0, common_1.Header)('X-Deprecated-Since', deprecatedSince),
        (0, common_1.Header)('X-Remove-In-Version', removeInVersion),
    ];
    if (migrateTo) {
        headers.push((0, common_1.Header)('X-Migrate-To', migrateTo));
    }
    return (0, common_1.applyDecorators)(methodDecorators[method](path), (0, swagger_1.ApiOperation)({
        deprecated: true,
        summary: `DEPRECATED: Will be removed in ${removeInVersion}`,
        description: `This endpoint is deprecated since ${deprecatedSince}. ${migrateTo ? `Please use ${migrateTo} instead.` : ''}`,
    }), ...headers);
}
function createExperimentalRoute(path, method, summary) {
    const methodDecorators = {
        GET: common_1.Get,
        POST: common_1.Post,
        PUT: common_1.Put,
        PATCH: common_1.Patch,
        DELETE: common_1.Delete,
    };
    return (0, common_1.applyDecorators)(methodDecorators[method](path), (0, common_1.Header)('X-Experimental', 'true'), (0, common_1.Header)('X-Stability', 'beta'), (0, swagger_1.ApiOperation)({
        summary: `[EXPERIMENTAL] ${summary}`,
        description: 'This endpoint is experimental and may change without notice.',
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Experimental feature response' }));
}
function createHealthCheckRoute(detailed = false) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(detailed ? 'health/detailed' : 'health'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
        summary: detailed ? 'Detailed health check' : 'Health check',
        description: detailed
            ? 'Returns detailed health status including all service dependencies'
            : 'Returns basic health status',
    }), (0, swagger_1.ApiOkResponse)({
        description: 'Service is healthy',
        schema: {
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', format: 'date-time' },
                ...(detailed && {
                    services: { type: 'object', additionalProperties: { type: 'object' } },
                }),
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable' }));
}
function createMetricsRoute(metricsType = 'json') {
    return (0, common_1.applyDecorators)((0, common_1.Get)('metrics'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Header)('Content-Type', metricsType === 'prometheus' ? 'text/plain' : 'application/json'), (0, swagger_1.ApiOperation)({
        summary: 'Application metrics',
        description: `Returns application metrics in ${metricsType} format`,
    }), (0, swagger_1.ApiOkResponse)({ description: 'Metrics retrieved successfully' }));
}
function createWebhookRoute(webhookName, requireSignature = true) {
    return (0, common_1.applyDecorators)((0, common_1.Post)(`webhooks/${webhookName}`), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
        summary: `${webhookName} webhook`,
        description: `Receives and processes ${webhookName} webhook events`,
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }), ...(requireSignature
        ? [(0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid webhook signature' })]
        : []));
}
function createFileUploadRoute(fieldName = 'file', multiple = false) {
    return (0, common_1.applyDecorators)((0, common_1.Post)('upload'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
        summary: multiple ? 'Upload multiple files' : 'Upload file',
        description: `Upload ${multiple ? 'multiple files' : 'a file'} to the server`,
    }), (0, swagger_1.ApiCreatedResponse)({ description: 'File(s) uploaded successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or file type not allowed' }), (0, swagger_1.ApiResponse)({ status: 413, description: 'File too large' }));
}
function createFileDownloadRoute(inline = false) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(':fileId/download'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Header)('Content-Disposition', inline ? 'inline' : 'attachment'), (0, swagger_1.ApiOperation)({
        summary: inline ? 'View file' : 'Download file',
        description: `${inline ? 'Displays' : 'Downloads'} file from the server`,
    }), (0, swagger_1.ApiParam)({ name: 'fileId', description: 'File identifier' }), (0, swagger_1.ApiOkResponse)({ description: 'File retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'File not found' }));
}
function createExportRoute(format, resourceName) {
    const contentTypes = {
        csv: 'text/csv',
        json: 'application/json',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return (0, common_1.applyDecorators)((0, common_1.Get)(`export/${format}`), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Header)('Content-Type', contentTypes[format]), (0, common_1.Header)('Content-Disposition', `attachment; filename="${resourceName}.${format}"`), (0, swagger_1.ApiOperation)({
        summary: `Export ${resourceName} as ${format.toUpperCase()}`,
        description: `Exports ${resourceName} data in ${format.toUpperCase()} format`,
    }), (0, swagger_1.ApiOkResponse)({ description: 'Data exported successfully' }));
}
function createImportRoute(format, resourceName) {
    return (0, common_1.applyDecorators)((0, common_1.Post)(`import/${format}`), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
        summary: `Import ${resourceName} from ${format.toUpperCase()}`,
        description: `Imports ${resourceName} data from ${format.toUpperCase()} file`,
    }), (0, swagger_1.ApiCreatedResponse)({
        description: 'Data imported successfully',
        schema: {
            properties: {
                imported: { type: 'number' },
                failed: { type: 'number' },
                errors: { type: 'array', items: { type: 'object' } },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file format or data' }));
}
function composeRouteDecorators(decorators) {
    return (0, common_1.applyDecorators)(...decorators);
}
function createAuthenticatedRoute(path, method, roles, summary) {
    const methodDecorators = {
        GET: common_1.Get,
        POST: common_1.Post,
        PUT: common_1.Put,
        PATCH: common_1.Patch,
        DELETE: common_1.Delete,
    };
    return (0, common_1.applyDecorators)(methodDecorators[method](path), (0, common_1.SetMetadata)('roles', roles), (0, swagger_1.ApiOperation)({ summary }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }));
}
function createCachedRoute(path, ttl, summary) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Header)('Cache-Control', `public, max-age=${ttl}`), (0, swagger_1.ApiOperation)({ summary, description: `Cached for ${ttl} seconds` }), (0, swagger_1.ApiOkResponse)({ description: 'Data retrieved successfully (may be cached)' }));
}
function createRateLimitedRoute(path, method, limit, ttl, summary) {
    const methodDecorators = {
        GET: common_1.Get,
        POST: common_1.Post,
        PUT: common_1.Put,
        PATCH: common_1.Patch,
        DELETE: common_1.Delete,
    };
    return (0, common_1.applyDecorators)(methodDecorators[method](path), (0, common_1.SetMetadata)('rateLimit', { limit, ttl }), (0, swagger_1.ApiOperation)({
        summary,
        description: `Rate limited to ${limit} requests per ${ttl} seconds`,
    }), (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many requests - rate limit exceeded' }));
}
function createPaginatedRoute(path, summary, defaultLimit = 10, maxLimit = 100) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary }), (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }), (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})`,
    }), (0, swagger_1.ApiOkResponse)({
        description: 'Paginated results retrieved successfully',
        schema: {
            properties: {
                data: { type: 'array', items: { type: 'object' } },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    }));
}
function createSortedRoute(path, summary, allowedFields) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary }), (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        type: String,
        description: `Sort format: field:order (e.g., name:asc). Allowed fields: ${allowedFields.join(', ')}`,
    }), (0, swagger_1.ApiOkResponse)({ description: 'Sorted results retrieved successfully' }));
}
function createFilteredRoute(path, summary, filterableFields) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(path), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
        summary,
        description: `Filterable fields: ${filterableFields.join(', ')}. Use operators like field[eq]=value, field[like]=%value%`,
    }), (0, swagger_1.ApiOkResponse)({ description: 'Filtered results retrieved successfully' }));
}
function createBatchRoute(resourceName, operation) {
    const methodMap = {
        create: common_1.Post,
        update: common_1.Put,
        delete: common_1.Delete,
    };
    return (0, common_1.applyDecorators)(methodMap[operation]('batch'), (0, common_1.HttpCode)(operation === 'create' ? common_1.HttpStatus.CREATED : common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
        summary: `Batch ${operation} ${resourceName}s`,
        description: `Performs ${operation} operation on multiple ${resourceName}s`,
    }), (0, swagger_1.ApiResponse)({
        status: operation === 'create' ? 201 : 200,
        description: 'Batch operation completed',
        schema: {
            properties: {
                successful: { type: 'array', items: { type: 'object' } },
                failed: { type: 'array', items: { type: 'object' } },
                summary: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        successCount: { type: 'number' },
                        failureCount: { type: 'number' },
                    },
                },
            },
        },
    }));
}
function createAsyncJobRoute(path, jobName) {
    return (0, common_1.applyDecorators)((0, common_1.Post)(path), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED), (0, swagger_1.ApiOperation)({
        summary: `Start ${jobName} job`,
        description: `Initiates an asynchronous ${jobName} job and returns job ID`,
    }), (0, swagger_1.ApiResponse)({
        status: 202,
        description: 'Job accepted and queued',
        schema: {
            properties: {
                jobId: { type: 'string' },
                status: { type: 'string', example: 'queued' },
                estimatedDuration: { type: 'number' },
            },
        },
    }));
}
function createJobStatusRoute() {
    return (0, common_1.applyDecorators)((0, common_1.Get)('jobs/:jobId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
        summary: 'Get job status',
        description: 'Retrieves the current status of an asynchronous job',
    }), (0, swagger_1.ApiParam)({ name: 'jobId', description: 'Job identifier' }), (0, swagger_1.ApiOkResponse)({
        description: 'Job status retrieved successfully',
        schema: {
            properties: {
                jobId: { type: 'string' },
                status: { type: 'string', enum: ['queued', 'processing', 'completed', 'failed'] },
                progress: { type: 'number', minimum: 0, maximum: 100 },
                result: { type: 'object' },
                error: { type: 'string' },
            },
        },
    }));
}
function generateControllerMetadata(name, description, version, tags) {
    const decorators = [
        (0, common_1.Controller)(version ? `${version}/${name.toLowerCase()}` : name.toLowerCase()),
        (0, swagger_1.ApiTags)(...(tags || [name])),
    ];
    if (version) {
        decorators.push((0, common_1.SetMetadata)('version', version));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=controller-route-factories.service.js.map