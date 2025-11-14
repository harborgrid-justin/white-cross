import { applyDecorators } from '@nestjs/common';
import { ApiProduces, ApiResponse } from '@nestjs/swagger';
import { HeaderDefinition } from './types';
/**
 * Creates file download response.
 * Binary file download with content disposition.
 *
 * @param mimeType - File MIME type
 * @param filename - Default filename
 * @param description - Response description
 * @returns File download response decorator
 *
 * @example
 * ```typescript
 * @createFileDownloadResponse('application/pdf', 'report.pdf', 'PDF report download')
 * async downloadReport(@Param('id') id: string) {
 *   return this.reportService.generatePdf(id);
 * }
 * ```
 */
export function createFileDownloadResponse(
  mimeType: string,
  filename?: string,
  description = 'File download',
) {
  const headers: Record<string, HeaderDefinition> = {
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
  return applyDecorators(
    ApiProduces(mimeType),
    ApiResponse({
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
    })
  );
}
/**
 * Creates streaming file response.
 * Chunked file streaming response.
 *
 * @param mimeType - File MIME type
 * @param description - Response description
 * @returns Streaming file response decorator
 *
 * @example
 * ```typescript
 * @createStreamingFileResponse('video/mp4', 'Video stream')
 * async streamVideo(@Param('id') id: string, @Res() res: Response) {
 *   return this.videoService.streamFile(id, res);
 * }
 * ```
 */
export function createStreamingFileResponse(
  mimeType: string,
  description = 'Streaming file response',
) {
  return applyDecorators(
    ApiProduces(mimeType),
    ApiResponse({
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
    })
  );
}
/**
 * Creates ZIP archive download response.
 * Multiple files packaged as ZIP.
 *
 * @param description - Response description
 * @param filename - ZIP filename
 * @returns ZIP download response decorator
 *
 * @example
 * ```typescript
 * @createZipDownloadResponse('Download multiple files', 'documents.zip')
 * async downloadBatch(@Body() fileIds: string[]) {
 *   return this.fileService.createZip(fileIds);
 * }
 * ```
 */
export function createZipDownloadResponse(
  description = 'ZIP archive download',
  filename = 'archive.zip',
) {
  return createFileDownloadResponse('application/zip', filename, description);
}
/**
 * Creates CSV export response.
 * CSV file export for data download.
 *
 * @param description - Response description
 * @param filename - CSV filename
 * @returns CSV export response decorator
 *
 * @example
 * ```typescript
 * @createCsvExportResponse('Export users to CSV', 'users.csv')
 * async exportUsers(@Query() filters: UserFilterDto) {
 *   return this.userService.exportToCsv(filters);
 * }
 * ```
 */
export function createCsvExportResponse(description = 'CSV export', filename = 'export.csv') {
  return createFileDownloadResponse('text/csv', filename, description);
}
/**
 * Creates Excel export response.
 * Excel spreadsheet export.
 *
 * @param description - Response description
 * @param filename - Excel filename
 * @returns Excel export response decorator
 *
 * @example
 * ```typescript
 * @createExcelExportResponse('Export to Excel', 'report.xlsx')
 * async exportToExcel(@Query() params: ExportParams) {
 *   return this.exportService.generateExcel(params);
 * }
 * ```
 */
export function createExcelExportResponse(description = 'Excel export', filename = 'export.xlsx') {
  return createFileDownloadResponse(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filename,
    description,
  );
}
/**
 * Creates image response with transformations.
 * Image download with transformation metadata.
 *
 * @param format - Image format (jpeg, png, webp)
 * @param description - Response description
 * @returns Image response decorator
 *
 * @example
 * ```typescript
 * @createImageResponse('jpeg', 'Transformed image')
 * async getImage(@Param('id') id: string, @Query() transform: ImageTransformDto) {
 *   return this.imageService.transform(id, transform);
 * }
 * ```
 */
export function createImageResponse(
  format: 'jpeg' | 'png' | 'webp' | 'gif' = 'jpeg',
  description = 'Image response',
) {
  const mimeType = `image/${format}`;
  return applyDecorators(
    ApiProduces(mimeType),
    ApiResponse({
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
    })
  );
}


