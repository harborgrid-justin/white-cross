"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperationDoc = createOperationDoc;
exports.createCrudOperation = createCrudOperation;
exports.createAsyncOperation = createAsyncOperation;
exports.createBatchOperation = createBatchOperation;
exports.createDeprecatedOperation = createDeprecatedOperation;
exports.createIdempotentOperation = createIdempotentOperation;
exports.createVersionedOperation = createVersionedOperation;
exports.createExperimentalOperation = createExperimentalOperation;
exports.createInternalOperation = createInternalOperation;
exports.createPublicOperation = createPublicOperation;
exports.createControllerTags = createControllerTags;
exports.createGroupedTags = createGroupedTags;
exports.createVersionedTags = createVersionedTags;
exports.createPriorityTags = createPriorityTags;
exports.createCategorizedTags = createCategorizedTags;
exports.createTagWithDocs = createTagWithDocs;
exports.createConditionalTags = createConditionalTags;
exports.createMultiLanguageTags = createMultiLanguageTags;
exports.createRequestExample = createRequestExample;
exports.createResponseExample = createResponseExample;
exports.createMultipleRequestExamples = createMultipleRequestExamples;
exports.createMultipleResponseExamples = createMultipleResponseExamples;
exports.createErrorExamples = createErrorExamples;
exports.createSuccessExamples = createSuccessExamples;
exports.createPaginatedExample = createPaginatedExample;
exports.createAsyncExample = createAsyncExample;
exports.createCallbackDefinition = createCallbackDefinition;
exports.createMultipleCallbacks = createMultipleCallbacks;
exports.createAsyncCallback = createAsyncCallback;
exports.createRetryCallback = createRetryCallback;
exports.createSignedCallback = createSignedCallback;
exports.createConditionalCallback = createConditionalCallback;
exports.createCallbackSecurity = createCallbackSecurity;
exports.createWebhookDoc = createWebhookDoc;
exports.createWebhookSubscription = createWebhookSubscription;
exports.createWebhookPayload = createWebhookPayload;
exports.createWebhookDelivery = createWebhookDelivery;
exports.createWebhookSecurity = createWebhookSecurity;
exports.createWebhookFiltering = createWebhookFiltering;
exports.createWebhookRateLimit = createWebhookRateLimit;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createOperationDoc(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description,
            ...(options.operationId && { operationId: options.operationId }),
            ...(options.deprecated && { deprecated: options.deprecated }),
        }),
    ];
    if (options.tags && options.tags.length > 0) {
        decorators.push((0, swagger_1.ApiTags)(...options.tags));
    }
    if (options.externalDocs) {
        decorators.push((0, swagger_1.ApiExtension)('x-external-docs', {
            url: options.externalDocs.url,
            description: options.externalDocs.description,
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function createCrudOperation(operation, resourceName, tags = []) {
    const operationDocs = {
        create: {
            summary: `Create ${resourceName}`,
            description: `Creates a new ${resourceName} resource`,
        },
        read: {
            summary: `Get ${resourceName}`,
            description: `Retrieves a specific ${resourceName} by identifier`,
        },
        update: {
            summary: `Update ${resourceName}`,
            description: `Updates an existing ${resourceName} resource`,
        },
        delete: {
            summary: `Delete ${resourceName}`,
            description: `Deletes a ${resourceName} resource`,
        },
        list: {
            summary: `List ${resourceName}s`,
            description: `Retrieves a list of ${resourceName} resources with pagination`,
        },
    };
    const doc = operationDocs[operation];
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: doc.summary,
        description: doc.description,
        operationId: `${operation}${resourceName.replace(/\s+/g, '')}`,
    }), (0, swagger_1.ApiTags)(...tags));
}
function createAsyncOperation(summary, description, estimatedDuration) {
    const fullDescription = estimatedDuration
        ? `${description}\n\n**Estimated Duration:** ${estimatedDuration}\n\nThis is an asynchronous operation. Check the status URL in the response for completion.`
        : `${description}\n\nThis is an asynchronous operation.`;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: `${summary} (Async)`,
        description: fullDescription,
    }), (0, swagger_1.ApiExtension)('x-async-operation', {
        estimatedDuration,
        async: true,
    }));
}
function createBatchOperation(summary, description, maxItems = 1000) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: `${summary} (Batch)`,
        description: `${description}\n\n**Maximum Items:** ${maxItems}\n\nReturns 207 Multi-Status with individual operation results.`,
    }), (0, swagger_1.ApiExtension)('x-batch-operation', {
        maxItems,
        multiStatus: true,
    }));
}
function createDeprecatedOperation(summary, description, deprecationReason, alternativeEndpoint, sunsetDate) {
    let fullDescription = `**⚠️ DEPRECATED:** ${deprecationReason}\n\n${description}`;
    if (alternativeEndpoint) {
        fullDescription += `\n\n**Alternative:** Use \`${alternativeEndpoint}\` instead.`;
    }
    if (sunsetDate) {
        fullDescription += `\n\n**Sunset Date:** ${sunsetDate}`;
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: fullDescription,
        deprecated: true,
    }), (0, swagger_1.ApiExtension)('x-deprecation', {
        reason: deprecationReason,
        alternative: alternativeEndpoint,
        sunsetDate,
    }));
}
function createIdempotentOperation(summary, description, idempotencyKeyHeader = 'Idempotency-Key') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: `${description}\n\n**Idempotent Operation:** Safe to retry with same \`${idempotencyKeyHeader}\` header.`,
    }), (0, swagger_1.ApiExtension)('x-idempotent', {
        idempotencyKeyHeader,
        safe: true,
    }));
}
function createVersionedOperation(summary, description, version, tags = []) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: `${summary} (${version})`,
        description: `${description}\n\n**API Version:** ${version}`,
        operationId: `${summary.replace(/\s+/g, '')}${version}`,
    }), (0, swagger_1.ApiTags)(...tags), (0, swagger_1.ApiExtension)('x-api-version', version));
}
function createExperimentalOperation(summary, description, stabilityLevel = 'beta') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: `${summary} (${stabilityLevel.toUpperCase()})`,
        description: `**⚠️ ${stabilityLevel.toUpperCase()}:** This endpoint is experimental and may change.\n\n${description}`,
    }), (0, swagger_1.ApiExtension)('x-stability', {
        level: stabilityLevel,
        experimental: true,
    }));
}
function createInternalOperation(summary, description, internalTeam) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: `${summary} (Internal)`,
        description: `**🔒 INTERNAL:** Not for external use.\n\n${description}${internalTeam ? `\n\n**Team:** ${internalTeam}` : ''}`,
    }), (0, swagger_1.ApiExtension)('x-internal', {
        internal: true,
        team: internalTeam,
    }));
}
function createPublicOperation(summary, description, rateLimits) {
    const fullDescription = `**🌐 PUBLIC:** No authentication required.\n\n${description}${rateLimits ? `\n\n**Rate Limits:** ${rateLimits}` : ''}`;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: fullDescription,
    }), (0, swagger_1.ApiExtension)('x-public', {
        public: true,
        rateLimits,
    }));
}
function createControllerTags(tags) {
    return (0, swagger_1.ApiTags)(...tags);
}
function createGroupedTags(group, tags) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...Object.keys(tags)), (0, swagger_1.ApiExtension)('x-tag-group', {
        name: group,
        tags: Object.entries(tags).map(([name, description]) => ({
            name,
            description,
        })),
    }));
}
function createVersionedTags(version, tags) {
    const versionedTags = tags.map(tag => `${version}/${tag}`);
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...versionedTags), (0, swagger_1.ApiExtension)('x-api-version', version), (0, swagger_1.ApiExtension)('x-original-tags', tags));
}
function createPriorityTags(tagPriorities) {
    const tags = Object.keys(tagPriorities);
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...tags), (0, swagger_1.ApiExtension)('x-tag-priorities', tagPriorities));
}
function createCategorizedTags(category, tags, icon) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...tags), (0, swagger_1.ApiExtension)('x-category', {
        name: category,
        tags,
        icon,
    }));
}
function createTagWithDocs(tag, externalDocs) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tag), (0, swagger_1.ApiExtension)('x-tag-docs', {
        tag,
        externalDocs,
    }));
}
function createConditionalTags(defaultTags, conditionalTags) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...defaultTags), (0, swagger_1.ApiExtension)('x-conditional-tags', {
        default: defaultTags,
        conditional: conditionalTags,
    }));
}
function createMultiLanguageTags(tags, translations) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...tags), (0, swagger_1.ApiExtension)('x-tag-translations', translations));
}
function createRequestExample(example) {
    return (0, swagger_1.ApiExtension)('x-request-example', {
        summary: example.summary,
        description: example.description,
        value: example.value,
    });
}
function createResponseExample(statusCode, example) {
    return (0, swagger_1.ApiExtension)(`x-response-example-${statusCode}`, {
        summary: example.summary,
        description: example.description,
        value: example.value,
    });
}
function createMultipleRequestExamples(examples) {
    return (0, swagger_1.ApiExtension)('x-request-examples', examples);
}
function createMultipleResponseExamples(statusCode, examples) {
    return (0, swagger_1.ApiExtension)(`x-response-examples-${statusCode}`, examples);
}
function createErrorExamples(errorExamples) {
    return (0, swagger_1.ApiExtension)('x-error-examples', errorExamples);
}
function createSuccessExamples(examples) {
    return (0, swagger_1.ApiExtension)('x-success-examples', examples);
}
function createPaginatedExample(itemExample, page = 1, totalItems = 100) {
    const limit = 20;
    const totalPages = Math.ceil(totalItems / limit);
    return (0, swagger_1.ApiExtension)('x-paginated-example', {
        summary: 'Paginated response example',
        value: {
            data: Array(Math.min(limit, totalItems)).fill(itemExample),
            pagination: {
                page,
                limit,
                total: totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        },
    });
}
function createAsyncExample(jobId, statusUrl) {
    return (0, swagger_1.ApiExtension)('x-async-example', {
        summary: 'Async operation accepted',
        value: {
            success: true,
            message: 'Job accepted for processing',
            jobId,
            statusUrl,
            estimatedCompletion: '2024-01-15T10:45:00Z',
        },
    });
}
function createCallbackDefinition(callback) {
    const decorators = [
        (0, swagger_1.ApiExtension)('x-callback', {
            name: callback.name,
            url: callback.url,
            method: callback.method,
            description: callback.description,
        }),
    ];
    if (callback.requestBody) {
        decorators.push((0, swagger_1.ApiExtraModels)(callback.requestBody));
    }
    if (callback.responseType) {
        decorators.push((0, swagger_1.ApiExtraModels)(callback.responseType));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function createMultipleCallbacks(callbacks) {
    const decorators = callbacks.map(callback => (0, swagger_1.ApiExtension)(`x-callback-${callback.name}`, {
        url: callback.url,
        method: callback.method,
        description: callback.description,
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function createAsyncCallback(callbackUrl, eventTypes) {
    return (0, swagger_1.ApiExtension)('x-async-callback', {
        callbackUrl,
        eventTypes,
        description: `Callbacks sent for: ${eventTypes.join(', ')}`,
    });
}
function createRetryCallback(maxRetries = 3, retryDelay = 1000, backoffMultiplier = 2) {
    return (0, swagger_1.ApiExtension)('x-callback-retry', {
        maxRetries,
        retryDelay,
        backoffMultiplier,
        description: `Retries up to ${maxRetries} times with exponential backoff`,
    });
}
function createSignedCallback(signatureHeader = 'X-Signature', algorithm = 'HMAC-SHA256') {
    return (0, swagger_1.ApiExtension)('x-callback-signature', {
        header: signatureHeader,
        algorithm,
        description: `Callbacks include ${signatureHeader} header with ${algorithm} signature`,
    });
}
function createConditionalCallback(condition, callbackUrl) {
    return (0, swagger_1.ApiExtension)('x-conditional-callback', {
        condition,
        callbackUrl,
        description: `Callback triggered when: ${condition}`,
    });
}
function createCallbackSecurity(authType, headerName = 'Authorization') {
    return (0, swagger_1.ApiExtension)('x-callback-security', {
        type: authType,
        header: headerName,
        description: `Callbacks require ${authType} authentication in ${headerName} header`,
    });
}
function createWebhookDoc(webhook) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-webhook', {
        name: webhook.name,
        method: webhook.method,
        description: webhook.description,
        signatureHeader: webhook.signatureHeader,
        signatureAlgorithm: webhook.signatureAlgorithm,
    }), (0, swagger_1.ApiExtraModels)(webhook.payloadType), (0, swagger_1.ApiConsumes)('application/json'), (0, swagger_1.ApiProduces)('application/json'));
}
function createWebhookSubscription(events, subscriptionEndpoint) {
    return (0, swagger_1.ApiExtension)('x-webhook-subscription', {
        events,
        subscriptionEndpoint,
        description: `Subscribe to events: ${events.join(', ')}`,
    });
}
function createWebhookPayload(eventName, payloadType, metadata) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-webhook-payload', {
        event: eventName,
        metadata,
    }), (0, swagger_1.ApiExtraModels)(payloadType));
}
function createWebhookDelivery(maxRetries = 3, timeout = 30000, retryStrategy) {
    return (0, swagger_1.ApiExtension)('x-webhook-delivery', {
        maxRetries,
        timeout,
        retryStrategy,
        description: `Max retries: ${maxRetries}, Timeout: ${timeout}ms`,
    });
}
function createWebhookSecurity(signatureHeader, algorithm, secretRotation) {
    return (0, swagger_1.ApiExtension)('x-webhook-security', {
        signatureHeader,
        algorithm,
        secretRotation,
        description: `Verify ${signatureHeader} using ${algorithm}`,
    });
}
function createWebhookFiltering(filters) {
    return (0, swagger_1.ApiExtension)('x-webhook-filtering', {
        filters,
        description: 'Configure webhook filtering by: ' + Object.keys(filters).join(', '),
    });
}
function createWebhookRateLimit(limit, period, burstSize) {
    return (0, swagger_1.ApiExtension)('x-webhook-rate-limit', {
        limit,
        period,
        burstSize,
        description: `Rate limit: ${limit} webhooks per ${period}${burstSize ? `, burst: ${burstSize}` : ''}`,
    });
}
//# sourceMappingURL=swagger-endpoint-documentation.service.js.map