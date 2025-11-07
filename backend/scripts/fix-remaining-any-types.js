#!/usr/bin/env node
/**
 * Script to Fix Remaining 'any' Types in Infrastructure Module
 *
 * This script handles the remaining any types that the first pass missed.
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // Admin Gateway - MessageBody decorator
  {
    file: 'src/infrastructure/websocket/gateways/admin.gateway.ts',
    replacements: [
      { from: /@MessageBody\(\) data: { toolId: string; params\?: any },/, to: '@MessageBody() data: { toolId: string; params?: Record<string, unknown> },' },
    ],
  },

  // WS Logging Interceptor
  {
    file: 'src/infrastructure/websocket/interceptors/ws-logging.interceptor.ts',
    replacements: [
      { from: /getDataKeys\(data: any\): string\[\]/, to: 'getDataKeys(data: unknown): string[]' },
    ],
  },

  // WS Auth Middleware
  {
    file: 'src/infrastructure/websocket/middleware/ws-auth.middleware.ts',
    replacements: [
      { from: /function mapToAuthPayload\(payload: any\): AuthPayload/, to: 'function mapToAuthPayload(payload: JwtPayload): AuthPayload' },
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

  // Admin Metrics Service
  {
    file: 'src/infrastructure/websocket/services/admin-metrics.service.ts',
    replacements: [
      { from: /private previousCpuInfo: any = null;/, to: 'private previousCpuInfo: CpuInfo | null = null;' },
      { from: /private previousNetworkStats: any = null;/, to: 'private previousNetworkStats: NetworkStats | null = null;' },
    ],
    addTypes: `
/**
 * CPU information structure
 */
interface CpuInfo {
  times: {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
  };
  [key: string]: unknown;
}

/**
 * Network statistics structure
 */
interface NetworkStats {
  [interface: string]: {
    rx_bytes?: number;
    tx_bytes?: number;
    [key: string]: unknown;
  };
}
`
  },

  // WebSocket Service
  {
    file: 'src/infrastructure/websocket/websocket.service.ts',
    replacements: [
      { from: /broadcastToRoom\(room: string, event: string, data: any\): Promise<void>/, to: 'broadcastToRoom(room: string, event: string, data: unknown): Promise<void>' },
      { from: /alert: any,/g, to: 'alert: AlertData,' },
      { from: /notification: any\)/g, to: 'notification: NotificationData)' },
      { from: /reminder: any,/g, to: 'reminder: ReminderData,' },
      { from: /data: any,/g, to: 'data: unknown,' },
    ],
    addTypes: `
/**
 * Alert data structure
 */
interface AlertData {
  id?: string;
  message: string;
  severity?: string;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Notification data structure
 */
interface NotificationData {
  id?: string;
  title?: string;
  message: string;
  type?: string;
  [key: string]: unknown;
}

/**
 * Reminder data structure
 */
interface ReminderData {
  id?: string;
  message: string;
  dueDate?: string;
  [key: string]: unknown;
}
`
  },

  // Message Queue Service - return type
  {
    file: 'src/infrastructure/queue/message-queue.service.ts',
    replacements: [
      { from: /\): any {/, to: '): JobOptions {' },
    ],
  },

  // Cache Interfaces - loader value
  {
    file: 'src/infrastructure/cache/cache.interfaces.ts',
    replacements: [
      { from: /Array<{ key: string; value: any; options\?: CacheOptions }>/, to: 'Array<{ key: string; value: unknown; options?: CacheOptions }>' },
    ],
  },

  // PHI Sanitizer
  {
    file: 'src/infrastructure/graphql/errors/phi-sanitizer.ts',
    replacements: [
      { from: /export function sanitizeGraphQLError\(error: any\): any/, to: 'export function sanitizeGraphQLError(error: GraphQLError): SanitizedGraphQLError' },
      { from: /\(validationError: any\) =>/, to: '(validationError: ValidationError) =>' },
    ],
    addTypes: `
/**
 * Sanitized GraphQL error structure
 */
interface SanitizedGraphQLError {
  message: string;
  locations?: unknown[];
  path?: unknown[];
  extensions?: Record<string, unknown>;
}

/**
 * Validation error structure
 */
interface ValidationError {
  message?: string;
  property?: string;
  constraints?: Record<string, string>;
  [key: string]: unknown;
}
`
  },

  // GraphQL Module
  {
    file: 'src/infrastructure/graphql/graphql.module.ts',
    replacements: [
      { from: /onConnect: \(context: any\) =>/, to: 'onConnect: (context: Record<string, unknown>) =>' },
      { from: /onDisconnect: \(context: any\) =>/, to: 'onDisconnect: (context: Record<string, unknown>) =>' },
    ],
  },

  // Field Authorization Guard
  {
    file: 'src/infrastructure/graphql/guards/field-authorization.guard.ts',
    replacements: [
      { from: /return \(target: any, propertyKey: string, descriptor: PropertyDescriptor\)/, to: 'return (target: object, propertyKey: string, descriptor: PropertyDescriptor)' },
      { from: /descriptor.value = async function \(...args: any\[\]\)/, to: 'descriptor.value = async function (...args: unknown[])' },
    ],
  },

  // GQL Auth Guard
  {
    file: 'src/infrastructure/graphql/guards/gql-auth.guard.ts',
    replacements: [
      { from: /err: any,/g, to: 'err: Error | null,' },
      { from: /user: any,/g, to: 'user: PassportUser | null,' },
      { from: /info: any,/g, to: 'info: unknown,' },
      { from: /private extractTokenFromRequest\(request: any\): string \| null/, to: 'private extractTokenFromRequest(request: IncomingRequest): string | null' },
      { from: /private decodeToken\(token: string\): any/, to: 'private decodeToken(token: string): JwtPayload | null' },
    ],
    addTypes: `
/**
 * Passport user structure
 */
interface PassportUser {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Incoming request structure
 */
interface IncomingRequest {
  headers?: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
  cookies?: Record<string, string>;
  query?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * JWT payload structure
 */
interface JwtPayload {
  sub?: string;
  userId?: string;
  organizationId?: string;
  role?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}
`
  },

  // PubSub Module
  {
    file: 'src/infrastructure/graphql/pubsub/pubsub.module.ts',
    replacements: [
      { from: /serializer: \(value: any\) => JSON.stringify\(value\),/, to: 'serializer: (value: unknown) => JSON.stringify(value),' },
    ],
  },

  // Contact Resolver
  {
    file: 'src/infrastructure/graphql/resolvers/contact.resolver.ts',
    replacements: [
      { from: /@Context\(\) context\?: any,/, to: '@Context() context?: GraphQLContext,' },
      { from: /const serviceFilters: any = {};/, to: 'const serviceFilters: Record<string, unknown> = {};' },
    ],
    addTypes: `
/**
 * GraphQL context structure
 */
interface GraphQLContext {
  req?: {
    user?: {
      userId: string;
      organizationId: string;
      role: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
`
  },
];

console.log('Fixing remaining any types in infrastructure module...\n');

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
    const regex = new RegExp(replacement.from.source || replacement.from, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement.to);
      fixCount += matches.length;
      fileModified = true;
    }
  });

  // Add types if needed
  if (fix.addTypes && fileModified) {
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      const insertPosition = content.indexOf('\n', nextLineIndex + 1);
      if (insertPosition !== -1) {
        content = content.slice(0, insertPosition) + '\n' + fix.addTypes + content.slice(insertPosition);
      }
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} any types in ${fix.file}`);
    totalFixed += fixCount;
    filesProcessed++;
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} additional any types across ${filesProcessed} files.`);
