"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileDownloadResponse = createFileDownloadResponse;
exports.createStreamingFileResponse = createStreamingFileResponse;
exports.createZipDownloadResponse = createZipDownloadResponse;
exports.createCsvExportResponse = createCsvExportResponse;
exports.createExcelExportResponse = createExcelExportResponse;
exports.createImageResponse = createImageResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createFileDownloadResponse(mimeType, filename, description = 'File download') {
    const headers = {
        'Content-Type': {
            description: 'File MIME type',
            schema: { type: 'string' },
            example: mimeType,
        },
    };
    if (filename) {
        headers['Content-Disposition'] = {
            description: 'File disposition',
            schema: { type: 'string' },
            example: `attachment; filename="${filename}"`,
        };
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiProduces)(mimeType), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        content: {
            [mimeType]: {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
        headers,
    }));
}
function createStreamingFileResponse(mimeType, description = 'Streaming file response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiProduces)(mimeType), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        content: {
            [mimeType]: {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
        headers: {
            'Content-Type': {
                description: 'Stream content type',
                schema: { type: 'string' },
                example: mimeType,
            },
            'Transfer-Encoding': {
                description: 'Transfer encoding',
                schema: { type: 'string' },
                example: 'chunked',
            },
            'Cache-Control': {
                description: 'Cache directives',
                schema: { type: 'string' },
                example: 'no-cache',
            },
        },
    }));
}
function createZipDownloadResponse(description = 'ZIP archive download', filename = 'archive.zip') {
    return createFileDownloadResponse('application/zip', filename, description);
}
function createCsvExportResponse(description = 'CSV export', filename = 'export.csv') {
    return createFileDownloadResponse('text/csv', filename, description);
}
function createExcelExportResponse(description = 'Excel export', filename = 'export.xlsx') {
    return createFileDownloadResponse('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename, description);
}
function createImageResponse(format = 'jpeg', description = 'Image response') {
    const mimeType = `image/${format}`;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiProduces)(mimeType), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        content: {
            [mimeType]: {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
        headers: {
            'Content-Type': {
                description: 'Image MIME type',
                schema: { type: 'string' },
                example: mimeType,
            },
            'Cache-Control': {
                description: 'Image cache directives',
                schema: { type: 'string' },
                example: 'public, max-age=31536000',
            },
            'ETag': {
                description: 'Image version tag',
                schema: { type: 'string' },
            },
        },
    }));
}
//# sourceMappingURL=file-builders.js.map