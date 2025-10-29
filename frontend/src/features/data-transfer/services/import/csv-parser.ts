/**
 * CSV Parser Service with Streaming Support
 *
 * High-performance CSV parser for large files with streaming,
 * validation, and transformation capabilities.
 */

import type { FieldMapping, FieldTransform, ImportProgress } from '../../types';

// ============================================================================
// Types
// ============================================================================

export interface CSVParserOptions {
  delimiter: string;
  hasHeader: boolean;
  encoding: string;
  batchSize: number;
  skipEmptyLines: boolean;
}

export interface ParseResult {
  data: Array<Record<string, unknown>>;
  errors: Array<{ row: number; message: string }>;
  totalRows: number;
}

export type ProgressCallback = (progress: Partial<ImportProgress>) => void;

// ============================================================================
// CSV Parser
// ============================================================================

export class CSVParser {
  private options: CSVParserOptions;
  private progressCallback?: ProgressCallback;

  constructor(options: Partial<CSVParserOptions> = {}) {
    this.options = {
      delimiter: options.delimiter ?? ',',
      hasHeader: options.hasHeader ?? true,
      encoding: options.encoding ?? 'utf-8',
      batchSize: options.batchSize ?? 1000,
      skipEmptyLines: options.skipEmptyLines ?? true,
    };
  }

  /**
   * Parses CSV file with streaming for large files
   */
  async parseFile(
    file: File,
    fieldMapping: FieldMapping,
    onProgress?: ProgressCallback
  ): Promise<ParseResult> {
    this.progressCallback = onProgress;

    const text = await file.text();
    return this.parseText(text, fieldMapping);
  }

  /**
   * Parses CSV text content
   */
  async parseText(
    text: string,
    fieldMapping: FieldMapping
  ): Promise<ParseResult> {
    const lines = this.splitIntoLines(text);
    const data: Array<Record<string, unknown>> = [];
    const errors: Array<{ row: number; message: string }> = [];

    let headers: string[] = [];
    let startIndex = 0;

    // Extract headers if present
    if (this.options.hasHeader && lines.length > 0) {
      headers = this.parseLine(lines[0]);
      startIndex = 1;
    } else {
      // Generate default headers if not present
      const firstLine = this.parseLine(lines[0] || '');
      headers = firstLine.map((_, i) => `column_${i + 1}`);
    }

    const totalRows = lines.length - startIndex;

    // Process in batches
    for (let i = startIndex; i < lines.length; i += this.options.batchSize) {
      const batch = lines.slice(i, Math.min(i + this.options.batchSize, lines.length));

      for (let j = 0; j < batch.length; j++) {
        const rowNumber = i + j + 1;
        const line = batch[j];

        // Skip empty lines
        if (this.options.skipEmptyLines && !line.trim()) {
          continue;
        }

        try {
          const values = this.parseLine(line);

          // Create record object
          const record: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            record[header] = values[index] ?? '';
          });

          // Apply field mapping and transformations
          const mappedRecord = this.applyMapping(record, fieldMapping);
          data.push(mappedRecord);
        } catch (error) {
          errors.push({
            row: rowNumber,
            message: error instanceof Error ? error.message : 'Parse error',
          });
        }
      }

      // Report progress
      if (this.progressCallback) {
        this.progressCallback({
          currentRow: i + batch.length - startIndex,
          totalRows,
          percentage: ((i + batch.length - startIndex) / totalRows) * 100,
          status: 'processing',
        });
      }
    }

    return { data, errors, totalRows };
  }

  /**
   * Parses a single CSV line, handling quoted fields
   */
  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === this.options.delimiter && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());

    return result;
  }

  /**
   * Splits text into lines, handling different line endings
   */
  private splitIntoLines(text: string): string[] {
    // Normalize line endings
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized.split('\n');
  }

  /**
   * Applies field mapping and transformations
   */
  private applyMapping(
    record: Record<string, unknown>,
    fieldMapping: FieldMapping
  ): Record<string, unknown> {
    const mapped: Record<string, unknown> = {};

    for (const mapping of fieldMapping.mappings) {
      const value = record[mapping.sourceField];

      // Apply transformation if specified
      const transformedValue = mapping.transform
        ? this.applyTransform(value, mapping.transform)
        : value;

      mapped[mapping.targetField] = transformedValue;
    }

    return mapped;
  }

  /**
   * Applies a field transformation
   */
  private applyTransform(value: unknown, transform: FieldTransform): unknown {
    if (value === undefined || value === null) {
      return value;
    }

    switch (transform.type) {
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;

      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;

      case 'trim':
        return typeof value === 'string' ? value.trim() : value;

      case 'date':
        return this.parseDate(value, transform.format);

      case 'number':
        const num = Number(value);
        if (isNaN(num)) return value;
        return transform.decimals !== undefined
          ? Number(num.toFixed(transform.decimals))
          : num;

      case 'boolean':
        const str = String(value).toLowerCase();
        if (transform.trueValues.some((v) => v.toLowerCase() === str)) {
          return true;
        }
        if (transform.falseValues.some((v) => v.toLowerCase() === str)) {
          return false;
        }
        return value;

      case 'split':
        if (typeof value === 'string') {
          const parts = value.split(transform.delimiter);
          return parts[transform.index] ?? value;
        }
        return value;

      case 'regex':
        if (typeof value === 'string') {
          const regex = new RegExp(transform.pattern, 'g');
          return value.replace(regex, transform.replacement);
        }
        return value;

      case 'custom':
        try {
          return transform.fn(value);
        } catch {
          return value;
        }

      default:
        return value;
    }
  }

  /**
   * Parses a date string according to format
   */
  private parseDate(value: unknown, format: string): Date | unknown {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value !== 'string') {
      return value;
    }

    // Simple date parsing - can be enhanced with a library like date-fns
    const dateFormats: Record<string, (str: string) => Date | null> = {
      'YYYY-MM-DD': (str) => {
        const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return null;
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      },
      'MM/DD/YYYY': (str) => {
        const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return null;
        return new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
      },
      'DD/MM/YYYY': (str) => {
        const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return null;
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
      },
    };

    const parser = dateFormats[format];
    if (parser) {
      const date = parser(value);
      return date ?? value;
    }

    // Fallback to standard Date parsing
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  }
}

// ============================================================================
// Streaming CSV Parser (for very large files)
// ============================================================================

export class StreamingCSVParser {
  private options: CSVParserOptions;

  constructor(options: Partial<CSVParserOptions> = {}) {
    this.options = {
      delimiter: options.delimiter ?? ',',
      hasHeader: options.hasHeader ?? true,
      encoding: options.encoding ?? 'utf-8',
      batchSize: options.batchSize ?? 1000,
      skipEmptyLines: options.skipEmptyLines ?? true,
    };
  }

  /**
   * Parses CSV file using Web Streams API for memory efficiency
   */
  async *parseFileStream(
    file: File,
    fieldMapping: FieldMapping
  ): AsyncGenerator<Record<string, unknown>[], void, void> {
    const stream = file.stream();
    const reader = stream.getReader();
    const decoder = new TextDecoder(this.options.encoding);

    let buffer = '';
    let headers: string[] = [];
    let isFirstChunk = true;
    let batch: Array<Record<string, unknown>> = [];

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process remaining buffer
          if (buffer.trim()) {
            const record = this.processLine(buffer, headers, fieldMapping);
            if (record) {
              batch.push(record);
            }
          }

          // Yield final batch
          if (batch.length > 0) {
            yield batch;
          }

          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (this.options.skipEmptyLines && !line.trim()) {
            continue;
          }

          // Handle header
          if (isFirstChunk && this.options.hasHeader) {
            headers = this.parseLine(line);
            isFirstChunk = false;
            continue;
          }

          const record = this.processLine(line, headers, fieldMapping);
          if (record) {
            batch.push(record);

            // Yield batch when it reaches the batch size
            if (batch.length >= this.options.batchSize) {
              yield batch;
              batch = [];
            }
          }
        }

        if (isFirstChunk && !this.options.hasHeader) {
          // Generate default headers
          headers = Array.from({ length: lines[0]?.split(this.options.delimiter).length ?? 0 }, (_, i) => `column_${i + 1}`);
          isFirstChunk = false;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Parses a single line
   */
  private parseLine(line: string): string[] {
    const parser = new CSVParser({ delimiter: this.options.delimiter });
    return (parser as unknown as { parseLine: (line: string) => string[] }).parseLine(line);
  }

  /**
   * Processes a single line into a record
   */
  private processLine(
    line: string,
    headers: string[],
    fieldMapping: FieldMapping
  ): Record<string, unknown> | null {
    try {
      const values = this.parseLine(line);
      const record: Record<string, unknown> = {};

      headers.forEach((header, index) => {
        record[header] = values[index] ?? '';
      });

      // Apply mapping
      const parser = new CSVParser();
      return (parser as unknown as { applyMapping: (record: Record<string, unknown>, mapping: FieldMapping) => Record<string, unknown> }).applyMapping(record, fieldMapping);
    } catch {
      return null;
    }
  }
}
