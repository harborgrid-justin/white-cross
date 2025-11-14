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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFindAll = handleFindAll;
exports.handleFindOne = handleFindOne;
exports.handleCreate = handleCreate;
exports.handleUpdate = handleUpdate;
exports.handleDelete = handleDelete;
exports.handleSoftDelete = handleSoftDelete;
exports.handleBulkCreate = handleBulkCreate;
exports.handleBulkUpdate = handleBulkUpdate;
exports.handleBulkDelete = handleBulkDelete;
exports.handleBatchRequests = handleBatchRequests;
exports.handleSequentialBatch = handleSequentialBatch;
exports.handleFileUpload = handleFileUpload;
exports.handleMultipleFileUploads = handleMultipleFileUploads;
exports.handleChunkedUpload = handleChunkedUpload;
exports.finalizeChunkedUpload = finalizeChunkedUpload;
exports.handleFileDownload = handleFileDownload;
exports.handleMultipartForm = handleMultipartForm;
exports.extractPaginationOptions = extractPaginationOptions;
exports.extractSortOptions = extractSortOptions;
exports.extractFilterOptions = extractFilterOptions;
exports.applyFilters = applyFilters;
exports.handleSearch = handleSearch;
exports.handleAdvancedSearch = handleAdvancedSearch;
exports.handleCSVExport = handleCSVExport;
exports.handleJSONExport = handleJSONExport;
exports.handleStreamedExport = handleStreamedExport;
exports.handleCSVImport = handleCSVImport;
exports.handleJSONImport = handleJSONImport;
exports.validateWebhookSignature = validateWebhookSignature;
exports.handleWebhook = handleWebhook;
exports.sendWebhook = sendWebhook;
exports.handleSSE = handleSSE;
exports.formatSSEMessage = formatSSEMessage;
exports.createIntervalSSEStream = createIntervalSSEStream;
exports.handleLongPolling = handleLongPolling;
exports.handleConditionalLongPolling = handleConditionalLongPolling;
exports.handleStateChangeLongPolling = handleStateChangeLongPolling;
exports.generateUploadId = generateUploadId;
exports.calculateFileHash = calculateFileHash;
exports.validateFileExtension = validateFileExtension;
exports.sanitizeFilename = sanitizeFilename;
exports.createResponseEnvelope = createResponseEnvelope;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const fs_1 = require("fs");
const csv_parse_1 = require("csv-parse");
const csv_stringify_1 = require("csv-stringify");
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
async function handleFindAll(service, options) {
    const { pagination = { page: 1, limit: 10 }, sort, filter } = options;
    const [data, total] = await Promise.all([
        service.findAll(options),
        service.count(filter),
    ]);
    const totalPages = Math.ceil(total / pagination.limit);
    return {
        data,
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages,
            hasNextPage: pagination.page < totalPages,
            hasPreviousPage: pagination.page > 1,
        },
    };
}
async function handleFindOne(service, id) {
    const entity = await service.findOne(id);
    if (!entity) {
        throw new common_1.NotFoundException(`Resource with ID ${id} not found`);
    }
    return entity;
}
async function handleCreate(service, data) {
    try {
        return await service.create(data);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new common_1.BadRequestException(`Failed to create resource: ${errorMessage}`);
    }
}
async function handleUpdate(service, id, data) {
    await handleFindOne(service, id);
    try {
        return await service.update(id, data);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new common_1.BadRequestException(`Failed to update resource: ${errorMessage}`);
    }
}
async function handleDelete(service, id) {
    await handleFindOne(service, id);
    try {
        await service.delete(id);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new common_1.InternalServerErrorException(`Failed to delete resource: ${errorMessage}`);
    }
}
async function handleSoftDelete(service, id) {
    const entity = await handleFindOne(service, id);
    return await service.update(id, {
        deletedAt: new Date(),
    });
}
async function handleBulkCreate(service, items) {
    const result = {
        successful: [],
        failed: [],
        summary: {
            total: items.length,
            successCount: 0,
            failureCount: 0,
        },
    };
    for (let i = 0; i < items.length; i++) {
        try {
            const created = await service.create(items[i]);
            result.successful.push(created);
            result.summary.successCount++;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            result.failed.push({
                index: i,
                data: items[i],
                error: errorMessage,
            });
            result.summary.failureCount++;
        }
    }
    return result;
}
async function handleBulkUpdate(service, updates) {
    const result = {
        successful: [],
        failed: [],
        summary: {
            total: updates.length,
            successCount: 0,
            failureCount: 0,
        },
    };
    for (let i = 0; i < updates.length; i++) {
        try {
            const updated = await service.update(updates[i].id, updates[i].data);
            result.successful.push(updated);
            result.summary.successCount++;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            result.failed.push({
                index: i,
                data: updates[i],
                error: errorMessage,
            });
            result.summary.failureCount++;
        }
    }
    return result;
}
async function handleBulkDelete(service, ids) {
    const result = {
        successful: ids,
        failed: [],
        summary: {
            total: ids.length,
            successCount: 0,
            failureCount: 0,
        },
    };
    for (let i = 0; i < ids.length; i++) {
        try {
            await service.delete(ids[i]);
            result.summary.successCount++;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            result.failed.push({
                index: i,
                data: { id: ids[i] },
                error: errorMessage,
            });
            result.summary.failureCount++;
        }
    }
    return result;
}
async function handleBatchRequests(requests, processor, concurrency = 5) {
    const result = {
        successful: [],
        failed: [],
        summary: {
            total: requests.length,
            successCount: 0,
            failureCount: 0,
        },
    };
    const chunks = [];
    for (let i = 0; i < requests.length; i += concurrency) {
        chunks.push(requests.slice(i, i + concurrency));
    }
    let index = 0;
    for (const chunk of chunks) {
        const results = await Promise.allSettled(chunk.map((item) => processor(item)));
        results.forEach((promiseResult, chunkIndex) => {
            const currentIndex = index + chunkIndex;
            if (promiseResult.status === 'fulfilled') {
                result.successful.push(promiseResult.value);
                result.summary.successCount++;
            }
            else {
                const errorMessage = promiseResult.reason instanceof Error
                    ? promiseResult.reason.message
                    : 'Unknown error occurred';
                result.failed.push({
                    index: currentIndex,
                    data: chunk[chunkIndex],
                    error: errorMessage,
                });
                result.summary.failureCount++;
            }
        });
        index += chunk.length;
    }
    return result;
}
async function handleSequentialBatch(requests, processor, maxRetries = 3) {
    const result = {
        successful: [],
        failed: [],
        summary: {
            total: requests.length,
            successCount: 0,
            failureCount: 0,
        },
    };
    for (let i = 0; i < requests.length; i++) {
        let retries = 0;
        let success = false;
        while (retries < maxRetries && !success) {
            try {
                const response = await processor(requests[i]);
                result.successful.push(response);
                result.summary.successCount++;
                success = true;
            }
            catch (error) {
                retries++;
                if (retries >= maxRetries) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    result.failed.push({
                        index: i,
                        data: requests[i],
                        error: `Failed after ${maxRetries} retries: ${errorMessage}`,
                    });
                    result.summary.failureCount++;
                }
                else {
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
                }
            }
        }
    }
    return result;
}
async function handleFileUpload(file, uploadDir = './uploads', allowedMimeTypes, maxSize) {
    if (!file) {
        throw new common_1.BadRequestException('No file provided');
    }
    if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
        throw new common_1.BadRequestException(`File type ${file.mimetype} not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }
    if (maxSize && file.size > maxSize) {
        throw new common_1.BadRequestException(`File size ${file.size} exceeds maximum allowed size ${maxSize}`);
    }
    const fileExt = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${fileExt}`;
    const filePath = path.join(uploadDir, filename);
    await fs_1.promises.mkdir(uploadDir, { recursive: true });
    const hash = crypto.createHash('sha256');
    const fileStream = (0, fs_1.createReadStream)(file.path);
    fileStream.on('data', (chunk) => hash.update(chunk));
    return new Promise((resolve, reject) => {
        fileStream.on('end', async () => {
            try {
                await fs_1.promises.rename(file.path, filePath);
                resolve({
                    filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    path: filePath,
                    hash: hash.digest('hex'),
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                reject(new common_1.InternalServerErrorException(`Failed to save file: ${errorMessage}`));
            }
        });
        fileStream.on('error', (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            reject(new common_1.InternalServerErrorException(`Failed to read file: ${errorMessage}`));
        });
    });
}
async function handleMultipleFileUploads(files, uploadDir = './uploads', allowedMimeTypes, maxSize) {
    if (!files || files.length === 0) {
        throw new common_1.BadRequestException('No files provided');
    }
    const results = [];
    for (const file of files) {
        const result = await handleFileUpload(file, uploadDir, allowedMimeTypes, maxSize);
        results.push(result);
    }
    return results;
}
async function handleChunkedUpload(chunk, metadata, uploadDir = './uploads/chunks') {
    await fs_1.promises.mkdir(uploadDir, { recursive: true });
    const chunkPath = path.join(uploadDir, `${metadata.uploadId}_${metadata.chunkIndex}`);
    await fs_1.promises.writeFile(chunkPath, chunk);
    const expectedChunks = metadata.totalChunks;
    const uploadedChunks = await fs_1.promises.readdir(uploadDir);
    const relevantChunks = uploadedChunks.filter((file) => file.startsWith(metadata.uploadId));
    const completed = relevantChunks.length === expectedChunks;
    const progress = (relevantChunks.length / expectedChunks) * 100;
    return {
        uploadId: metadata.uploadId,
        completed,
        progress,
    };
}
async function finalizeChunkedUpload(uploadId, filename, totalChunks, chunkDir = './uploads/chunks', finalDir = './uploads') {
    await fs_1.promises.mkdir(finalDir, { recursive: true });
    const finalPath = path.join(finalDir, filename);
    const writeStream = (0, fs_1.createWriteStream)(finalPath);
    const hash = crypto.createHash('sha256');
    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(chunkDir, `${uploadId}_${i}`);
        const chunkData = await fs_1.promises.readFile(chunkPath);
        hash.update(chunkData);
        writeStream.write(chunkData);
        await fs_1.promises.unlink(chunkPath);
    }
    writeStream.end();
    return new Promise((resolve, reject) => {
        writeStream.on('finish', async () => {
            const stats = await fs_1.promises.stat(finalPath);
            resolve({
                filename,
                originalName: filename,
                mimeType: 'application/octet-stream',
                size: stats.size,
                path: finalPath,
                hash: hash.digest('hex'),
            });
        });
        writeStream.on('error', (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            reject(new common_1.InternalServerErrorException(`Failed to finalize upload: ${errorMessage}`));
        });
    });
}
async function handleFileDownload(filePath, res, filename, inline = false) {
    try {
        await fs_1.promises.access(filePath);
    }
    catch {
        throw new common_1.NotFoundException('File not found');
    }
    const stats = await fs_1.promises.stat(filePath);
    const fileStream = (0, fs_1.createReadStream)(filePath);
    const disposition = inline ? 'inline' : 'attachment';
    const downloadFilename = filename || path.basename(filePath);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `${disposition}; filename="${downloadFilename}"`);
    fileStream.pipe(res);
}
async function handleMultipartForm(files, fields, validator) {
    const uploadedFiles = await handleMultipleFileUploads(files);
    const parsedData = fields;
    if (validator) {
        const isValid = await validator(parsedData);
        if (!isValid) {
            throw new common_1.BadRequestException('Form validation failed');
        }
    }
    return {
        files: uploadedFiles,
        data: parsedData,
    };
}
function extractPaginationOptions(query, defaultLimit = 10, maxLimit = 100) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}
function extractSortOptions(query, allowedFields = []) {
    const sortParam = query.sort;
    if (!sortParam) {
        return [];
    }
    const sortOptions = [];
    const sortPairs = sortParam.split(',');
    for (const pair of sortPairs) {
        const [field, order] = pair.split(':');
        if (allowedFields.length > 0 && !allowedFields.includes(field)) {
            throw new common_1.BadRequestException(`Sorting by field '${field}' is not allowed`);
        }
        const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        sortOptions.push({
            field,
            order: sortOrder,
        });
    }
    return sortOptions;
}
function extractFilterOptions(query, allowedFields = []) {
    const filters = {};
    const reservedParams = ['page', 'limit', 'sort', 'search', 'offset'];
    for (const [key, value] of Object.entries(query)) {
        if (reservedParams.includes(key)) {
            continue;
        }
        if (allowedFields.length > 0 && !allowedFields.includes(key)) {
            continue;
        }
        if (key.includes('[')) {
            const match = key.match(/^(\w+)\[(\w+)\]$/);
            if (match) {
                const [, field, operator] = match;
                if (!filters[field]) {
                    filters[field] = {};
                }
                filters[field][operator] = value;
            }
        }
        else {
            filters[key] = value;
        }
    }
    return filters;
}
function applyFilters(data, filters) {
    return data.filter((item) => {
        for (const [key, value] of Object.entries(filters)) {
            if (typeof value === 'object' && value !== null) {
                for (const [operator, operatorValue] of Object.entries(value)) {
                    const itemValue = item[key];
                    switch (operator) {
                        case 'eq':
                            if (itemValue !== operatorValue)
                                return false;
                            break;
                        case 'ne':
                            if (itemValue === operatorValue)
                                return false;
                            break;
                        case 'gt':
                            if (!(itemValue > operatorValue))
                                return false;
                            break;
                        case 'gte':
                            if (!(itemValue >= operatorValue))
                                return false;
                            break;
                        case 'lt':
                            if (!(itemValue < operatorValue))
                                return false;
                            break;
                        case 'lte':
                            if (!(itemValue <= operatorValue))
                                return false;
                            break;
                        case 'like':
                            if (!String(itemValue).includes(String(operatorValue).replace(/%/g, ''))) {
                                return false;
                            }
                            break;
                        case 'in':
                            if (!Array.isArray(operatorValue) || !operatorValue.includes(itemValue)) {
                                return false;
                            }
                            break;
                    }
                }
            }
            else {
                if (item[key] !== value)
                    return false;
            }
        }
        return true;
    });
}
function handleSearch(data, searchQuery, searchFields) {
    if (!searchQuery) {
        return data;
    }
    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
        return searchFields.some((field) => {
            const value = item[field];
            if (value == null)
                return false;
            return String(value).toLowerCase().includes(query);
        });
    });
}
function handleAdvancedSearch(data, searchParams) {
    return data.filter((item) => {
        return Object.entries(searchParams).every(([field, query]) => {
            const value = item[field];
            if (value == null)
                return false;
            return String(value).toLowerCase().includes(query.toLowerCase());
        });
    });
}
async function handleCSVExport(data, res, options = { format: 'csv' }) {
    const filename = options.filename || `export-${Date.now()}.csv`;
    const stringifier = (0, csv_stringify_1.stringify)({
        header: options.includeHeaders !== false,
        columns: options.fields,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    stringifier.pipe(res);
    for (const row of data) {
        stringifier.write(row);
    }
    stringifier.end();
}
async function handleJSONExport(data, res, options = { format: 'json' }) {
    const filename = options.filename || `export-${Date.now()}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const exportData = options.fields
        ? data.map((item) => {
            const filtered = {};
            options.fields.forEach((field) => {
                filtered[field] = item[field];
            });
            return filtered;
        })
        : data;
    res.send(JSON.stringify(exportData, null, 2));
}
async function handleStreamedExport(dataStream, res, format = 'json', filename) {
    const exportFilename = filename || `export-${Date.now()}.${format}`;
    if (format === 'csv') {
        const stringifier = (0, csv_stringify_1.stringify)({ header: true });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
        dataStream.pipe(stringifier).pipe(res);
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
        dataStream.pipe(res);
    }
}
async function handleCSVImport(filePath, validator) {
    const result = {
        imported: [],
        errors: [],
        summary: {
            totalRows: 0,
            importedCount: 0,
            errorCount: 0,
        },
    };
    const parser = (0, csv_parse_1.parse)({
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    const fileStream = (0, fs_1.createReadStream)(filePath);
    let rowNumber = 0;
    return new Promise((resolve, reject) => {
        fileStream
            .pipe(parser)
            .on('data', async (row) => {
            rowNumber++;
            result.summary.totalRows++;
            try {
                const validatedRow = await validator(row);
                result.imported.push(validatedRow);
                result.summary.importedCount++;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                result.errors.push({
                    row: rowNumber,
                    data: row,
                    error: errorMessage,
                });
                result.summary.errorCount++;
            }
        })
            .on('end', () => {
            resolve(result);
        })
            .on('error', (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            reject(new common_1.InternalServerErrorException(`Failed to parse CSV: ${errorMessage}`));
        });
    });
}
async function handleJSONImport(filePath, validator) {
    const result = {
        imported: [],
        errors: [],
        summary: {
            totalRows: 0,
            importedCount: 0,
            errorCount: 0,
        },
    };
    const fileContent = await fs_1.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (!Array.isArray(data)) {
        throw new common_1.BadRequestException('JSON file must contain an array');
    }
    result.summary.totalRows = data.length;
    for (let i = 0; i < data.length; i++) {
        try {
            const validatedItem = await validator(data[i]);
            result.imported.push(validatedItem);
            result.summary.importedCount++;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            result.errors.push({
                row: i + 1,
                data: data[i],
                error: errorMessage,
            });
            result.summary.errorCount++;
        }
    }
    return result;
}
function validateWebhookSignature(payload, signature, secret, algorithm = 'sha256') {
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature));
}
async function handleWebhook(req, secret, processor) {
    const signature = req.headers['x-webhook-signature'];
    if (!signature) {
        throw new common_1.BadRequestException('Missing webhook signature');
    }
    const payload = JSON.stringify(req.body);
    if (!validateWebhookSignature(payload, signature, secret)) {
        throw new common_1.BadRequestException('Invalid webhook signature');
    }
    const webhookPayload = {
        event: req.body.event,
        timestamp: new Date(req.body.timestamp || Date.now()),
        data: req.body.data,
        signature,
    };
    try {
        await processor(webhookPayload);
        return { success: true, message: 'Webhook processed successfully' };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new common_1.InternalServerErrorException(`Webhook processing failed: ${errorMessage}`);
    }
}
async function sendWebhook(url, payload, secret) {
    const payloadString = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadString);
    const signature = hmac.digest('hex');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
            },
            body: payloadString,
        });
        return {
            success: response.ok,
            statusCode: response.status,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new common_1.InternalServerErrorException(`Failed to send webhook: ${errorMessage}`);
    }
}
function handleSSE(res, messageStream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.write('data: {"type":"connected"}\n\n');
    const subscription = messageStream.subscribe({
        next: (message) => {
            const sseMessage = formatSSEMessage(message);
            res.write(sseMessage);
        },
        error: (error) => {
            console.error('SSE error:', error);
            res.end();
        },
        complete: () => {
            res.end();
        },
    });
    res.on('close', () => {
        subscription.unsubscribe();
    });
}
function formatSSEMessage(message) {
    let formatted = '';
    if (message.id) {
        formatted += `id: ${message.id}\n`;
    }
    if (message.event) {
        formatted += `event: ${message.event}\n`;
    }
    if (message.retry) {
        formatted += `retry: ${message.retry}\n`;
    }
    const data = typeof message.data === 'string'
        ? message.data
        : JSON.stringify(message.data);
    formatted += `data: ${data}\n\n`;
    return formatted;
}
function createIntervalSSEStream(dataProvider, intervalMs = 1000) {
    return new rxjs_1.Observable((subscriber) => {
        const intervalId = setInterval(async () => {
            try {
                const data = await dataProvider();
                subscriber.next({
                    event: 'message',
                    data,
                });
            }
            catch (error) {
                subscriber.error(error);
            }
        }, intervalMs);
        return () => {
            clearInterval(intervalId);
        };
    });
}
async function handleLongPolling(dataProvider, options = { timeout: 30000, interval: 1000 }) {
    const startTime = Date.now();
    while (Date.now() - startTime < options.timeout) {
        const data = await dataProvider();
        if (data !== null) {
            return data;
        }
        await new Promise((resolve) => setTimeout(resolve, options.interval));
    }
    return null;
}
async function handleConditionalLongPolling(dataProvider, condition, options = { timeout: 30000, interval: 1000 }) {
    const startTime = Date.now();
    while (Date.now() - startTime < options.timeout) {
        const data = await dataProvider();
        if (condition(data)) {
            return data;
        }
        await new Promise((resolve) => setTimeout(resolve, options.interval));
    }
    return null;
}
async function handleStateChangeLongPolling(currentState, stateProvider, options = { timeout: 30000, interval: 1000 }) {
    return handleConditionalLongPolling(stateProvider, (newState) => JSON.stringify(newState) !== JSON.stringify(currentState), options);
}
function generateUploadId() {
    return crypto.randomUUID();
}
async function calculateFileHash(filePath) {
    const hash = crypto.createHash('sha256');
    const stream = (0, fs_1.createReadStream)(filePath);
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}
function validateFileExtension(filename, allowedExtensions) {
    const ext = path.extname(filename).toLowerCase();
    return allowedExtensions.includes(ext);
}
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}
function createResponseEnvelope(data, statusCode = common_1.HttpStatus.OK, message = 'Success') {
    return {
        success: statusCode >= 200 && statusCode < 300,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=request-handlers.service.js.map