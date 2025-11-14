#!/usr/bin/env node
/**
 * Script to Fix All 'any' Types in Infrastructure Module
 *
 * This script systematically replaces 'any' types with proper TypeScript types
 * across the infrastructure module (websocket, monitoring, queue, cache, graphql).
 */

const fs = require('fs');
const path = require('path');

// Define fixes for each file pattern
const fixes = [
  // Admin Gateway fixes
  {
    file: 'src/infrastructure/websocket/gateways/admin.gateway.ts',
    replacements: [
      { from: /trend:\s*any;/, to: 'trend: TrendData;' },
      { from: /result:\s*any;/, to: 'result: unknown;' },
      { from: /params\?:\s*any\s*}\s*\)/, to: 'params?: Record<string, unknown> })', global: true },
      { from: /calculateTrend\(\):\s*any\s*{/, to: 'calculateTrend(): TrendData {' },
      { from: /executeAdminTool\(toolId: string, params\?:\s*any\):\s*Promise<any>/, to: 'executeAdminTool(toolId: string, params?: Record<string, unknown>): Promise<unknown>' },
    ],
    addImports: [
      "type { JsonValue } from '../dto/broadcast-message.dto';",
    ],
    addTypes: `
/**
 * Trend data for metrics
 */
interface TrendData {
  value: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}
`
  },

  // JWT Auth Guard fixes
  {
    file: 'src/infrastructure/websocket/guards/ws-jwt-auth.guard.ts',
    replacements: [
      { from: /mapToAuthPayload\(payload:\s*any\):\s*AuthPayload/, to: 'mapToAuthPayload(payload: JwtPayload): AuthPayload' },
    ],
    addTypes: `
/**
 * JWT payload structure
 */
interface JwtPayload {
  sub?: string;
  userId?: string;
  id?: string;
  organizationId?: string;
  schoolId?: string;
  districtId?: string;
  role?: string;
  email?: string;
  [key: string]: unknown;
}
`
  },

  // Transform Interceptor fixes
  {
    file: 'src/infrastructure/websocket/interceptors/ws-transform.interceptor.ts',
    replacements: [
      { from: /transformResponse\(data:\s*any\):\s*any/, to: 'transformResponse(data: unknown): unknown' },
      { from: /sanitizeObject\(obj:\s*any\):\s*any/, to: 'sanitizeObject(obj: unknown): unknown' },
      { from: /const sanitized:\s*any\s*=\s*{};/, to: 'const sanitized: Record<string, unknown> = {};' },
    ],
  },

  // Validation Pipe fixes
  {
    file: 'src/infrastructure/websocket/pipes/ws-validation.pipe.ts',
    replacements: [
      { from: /transform\(value:\s*any,\s*metadata:\s*ArgumentMetadata\):\s*Promise<any>/, to: 'transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown>' },
    ],
  },

  // WebSocket Module fixes
  {
    file: 'src/infrastructure/websocket/websocket.module.ts',
    replacements: [
      { from: /sendAlert\(organizationId: string, alert:\s*any\)/, to: 'sendAlert(organizationId: string, alert: Record<string, unknown>)' },
    ],
  },

  // Monitoring Controller fixes
  {
    file: 'src/infrastructure/monitoring/monitoring.controller.ts',
    replacements: [
      { from: /data:\s*any;/g, to: 'data: Record<string, unknown>;' },
    ],
  },

  // Monitoring Service fixes
  {
    file: 'src/infrastructure/monitoring/monitoring.service.ts',
    replacements: [
      { from: /private cacheService\?:\s*any;/, to: 'private cacheService?: CacheService;' },
      { from: /private websocketService\?:\s*any;/, to: 'private websocketService?: WebSocketService;' },
      { from: /private queueManagerService\?:\s*any;/, to: 'private queueManagerService?: MessageQueueService;' },
      { from: /private circuitBreakerService\?:\s*any;/, to: 'private circuitBreakerService?: CircuitBreakerService;' },
      { from: /setCacheService\(cacheService:\s*any\)/, to: 'setCacheService(cacheService: CacheService | undefined)' },
      { from: /setWebSocketService\(websocketService:\s*any\)/, to: 'setWebSocketService(websocketService: WebSocketService | undefined)' },
      { from: /setQueueManagerService\(queueManagerService:\s*any\)/, to: 'setQueueManagerService(queueManagerService: MessageQueueService | undefined)' },
      { from: /setCircuitBreakerService\(circuitBreakerService:\s*any\)/, to: 'setCircuitBreakerService(circuitBreakerService: CircuitBreakerService | undefined)' },
      { from: /\(stats:\s*any\)/g, to: '(stats: Record<string, unknown>)' },
    ],
    addTypes: `
// Forward declarations for optional services
interface CacheService {
  getStats?(): Promise<Record<string, unknown>>;
}

interface WebSocketService {
  getStats?(): Record<string, unknown>;
}

interface MessageQueueService {
  getStats?(): Record<string, unknown>;
}

interface CircuitBreakerService {
  getStats?(): Record<string, unknown>;
}
`
  },

  // Query Monitor Service fixes
  {
    file: 'src/infrastructure/monitoring/query-monitor.service.ts',
    replacements: [
      { from: /details:\s*any;/, to: 'details: QueryDetails;' },
      { from: /\(options:\s*any,\s*query:\s*any\)/g, to: '(options: unknown, query: unknown)' },
    ],
    addTypes: `
/**
 * Query details for monitoring
 */
interface QueryDetails {
  sql?: string;
  type?: string;
  table?: string;
  [key: string]: unknown;
}
`
  },

  // Sentry Service fixes
  {
    file: 'src/infrastructure/monitoring/sentry.service.ts',
    replacements: [
      { from: /sanitizeValue\(value:\s*any\):\s*any/, to: 'sanitizeValue(value: unknown): unknown' },
      { from: /const sanitized:\s*any\s*=\s*{};/, to: 'const sanitized: Record<string, unknown> = {};' },
    ],
  },

  // Queue Metrics Interface fixes
  {
    file: 'src/infrastructure/queue/interfaces/queue-metrics.interface.ts',
    replacements: [
      { from: /data:\s*any;/, to: 'data: unknown;' },
    ],
  },

  // Message Queue Service fixes
  {
    file: 'src/infrastructure/queue/message-queue.service.ts',
    replacements: [
      { from: /buildJobOptions\(queueName:\s*QueueName,\s*options\?:\s*QueueJobOptions\):\s*any/, to: 'buildJobOptions(queueName: QueueName, options?: QueueJobOptions): JobOptions' },
    ],
    addImports: [
      "import type { JobOptions } from 'bullmq';",
    ],
  },

  // Cache Statistics Service fixes
  {
    file: 'src/infrastructure/cache/cache-statistics.service.ts',
    replacements: [
      { from: /handleCacheWarm\(payload:\s*any\)/, to: 'handleCacheWarm(payload: CacheWarmPayload)' },
    ],
    addTypes: `
/**
 * Cache warm event payload
 */
interface CacheWarmPayload {
  keys?: string[];
  pattern?: string;
  count?: number;
  [key: string]: unknown;
}
`
  },

  // Cache Warming Service fixes
  {
    file: 'src/infrastructure/cache/cache-warming.service.ts',
    replacements: [
      { from: /handleCacheMiss\(payload:\s*any\)/, to: 'handleCacheMiss(payload: CacheMissPayload)' },
    ],
    addTypes: `
/**
 * Cache miss event payload
 */
interface CacheMissPayload {
  key?: string;
  context?: string;
  [key: string]: unknown;
}
`
  },

  // Cache Interfaces fixes
  {
    file: 'src/infrastructure/cache/cache.interfaces.ts',
    replacements: [
      { from: /loader:\s*\(\)\s*=>\s*Promise<Array<{\s*key:\s*string;\s*value:\s*any;/, to: 'loader: () => Promise<Array<{ key: string; value: unknown;' },
      { from: /keyGenerator:\s*\(context:\s*any\)/, to: 'keyGenerator: (context: CacheContext)' },
      { from: /handler\?:\s*\(context:\s*any\)/, to: 'handler?: (context: CacheContext)' },
      { from: /skip\?:\s*\(context:\s*any\)/, to: 'skip?: (context: CacheContext)' },
    ],
    addTypes: `
/**
 * Cache context for operations
 */
export interface CacheContext {
  key?: string;
  operation?: string;
  userId?: string;
  [key: string]: unknown;
}
`
  },

  // Rate Limiter Service fixes
  {
    file: 'src/infrastructure/cache/rate-limiter.service.ts',
    replacements: [
      { from: /checkLimit\(configName:\s*string,\s*context:\s*any\)/, to: 'checkLimit(configName: string, context: RateLimitContext)' },
    ],
    addTypes: `
/**
 * Rate limit context
 */
interface RateLimitContext {
  userId?: string;
  ip?: string;
  organizationId?: string;
  [key: string]: unknown;
}
`
  },

  // GraphQL DTO fixes
  {
    file: 'src/infrastructure/graphql/dto/contact.dto.ts',
    replacements: [
      { from: /customFields\?:\s*any;/g, to: 'customFields?: Record<string, unknown>;' },
      { from: /byType:\s*any;/, to: 'byType: Record<string, number>;' },
    ],
  },

  {
    file: 'src/infrastructure/graphql/dto/health-record.dto.ts',
    replacements: [
      { from: /metadata\?:\s*any;/g, to: 'metadata?: Record<string, unknown>;' },
    ],
  },
];

console.log('Starting to fix any types in infrastructure module...\n');

let totalFixed = 0;
let filesProcessed = 0;

fixes.forEach(fix => {
  const filePath = path.join(__dirname, '..', fix.file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${fix.file} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;
  let fixCount = 0;

  // Apply replacements
  fix.replacements.forEach(replacement => {
    const regex = replacement.global ? replacement.from : new RegExp(replacement.from.source, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement.to);
      fixCount += matches.length;
      fileModified = true;
    }
  });

  // Add types if needed
  if (fix.addTypes && fileModified) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      const insertPosition = content.indexOf('\n', nextLineIndex + 1);
      content = content.slice(0, insertPosition) + '\n' + fix.addTypes + content.slice(insertPosition);
    }
  }

  // Add imports if needed
  if (fix.addImports && fileModified) {
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      const insertPosition = nextLineIndex + 1;
      fix.addImports.forEach(importStatement => {
        content = content.slice(0, insertPosition) + importStatement + '\n' + content.slice(insertPosition);
      });
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} any types in ${fix.file}`);
    totalFixed += fixCount;
    filesProcessed++;
  } else {
    console.log(`ℹ️  No changes needed for ${fix.file}`);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} any types across ${filesProcessed} files.`);
