#!/usr/bin/env node
/**
 * Script to Fix 'any' Types - Version 3 (Correct Placement)
 *
 * This script properly places type definitions AFTER imports, not within them.
 */

const fs = require('fs');
const path = require('path');

function findInsertPosition(content) {
  // Find the position after all imports but before class declarations
  const lines = content.split('\n');
  let lastImportLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') || line.startsWith('import{')) {
      lastImportLine = i;
    }
    // Stop if we hit a class, interface, or export declaration
    if (line.startsWith('export class') || line.startsWith('export interface') ||
        line.startsWith('@Injectable') || line.startsWith('@Catch')) {
      break;
    }
  }

  if (lastImportLine === -1) return 0;

  // Find the next empty line after the last import
  for (let i = lastImportLine + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      return i;
    }
  }

  return lastImportLine + 1;
}

function insertTypes(content, typesDefinition) {
  const lines = content.split('\n');
  const insertLineIndex = findInsertPosition(content);

  lines.splice(insertLineIndex + 1, 0, '', typesDefinition, '');
  return lines.join('\n');
}

const fixes = [
  // Redis Adapter
  {
    file: 'src/infrastructure/websocket/adapters/redis-io.adapter.ts',
    replacements: [
      { from: /const clientConfig: any =/, to: 'const clientConfig: RedisClientConfig =' },
      { from: /createIOServer\(port: number, options\?: ServerOptions\): any/, to: 'createIOServer(port: number, options?: ServerOptions): Server' },
    ],
    addImports: "import { Server, ServerOptions } from 'socket.io';\nimport type { RedisClientConfig } from '../types/redis-config.types';",
    replaceImports: {
      from: "import { ServerOptions } from 'socket.io';",
      to: "import { Server, ServerOptions } from 'socket.io';\nimport type { RedisClientConfig } from '../types/redis-config.types';"
    }
  },

  // Admin Gateway
  {
    file: 'src/infrastructure/websocket/gateways/admin.gateway.ts',
    replacements: [
      { from: /trend: any;/, to: 'trend: TrendData;' },
      { from: /result: any;/, to: 'result: unknown;' },
      { from: /params\?: any\s*}/g, to: 'params?: Record<string, unknown> }' },
      { from: /calculateTrend\(\): any/, to: 'calculateTrend(): TrendData' },
      { from: /executeAdminTool\(toolId: string, params\?: any\): Promise<any>/, to: 'executeAdminTool(toolId: string, params?: Record<string, unknown>): Promise<unknown>' },
    ],
    types: `/**
 * Trend data for metrics
 */
interface TrendData {
  value: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}`
  },

  // WebSocket Service
  {
    file: 'src/infrastructure/websocket/websocket.service.ts',
    replacements: [
      { from: /broadcastToRoom\(room: string, event: string, data: any\): Promise<void>/, to: 'broadcastToRoom(room: string, event: string, data: unknown): Promise<void>' },
      { from: /sendAlert\(\s*organizationId: string,\s*alert: any,/g, to: 'sendAlert(\n    organizationId: string,\n    alert: AlertData,' },
      { from: /sendUserNotification\(userId: string, notification: any\): Promise<void>/, to: 'sendUserNotification(userId: string, notification: NotificationData): Promise<void>' },
      { from: /sendReminder\(\s*userIds: string\[\],\s*reminder: any,/g, to: 'sendReminder(\n    userIds: string[],\n    reminder: ReminderData,' },
      { from: /sendEmergencyAlert\(\s*alert: any,/g, to: 'sendEmergencyAlert(\n    alert: AlertData,' },
      { from: /broadcastAlert\(\s*organizationId: string,\s*data: any,/g, to: 'broadcastAlert(\n    organizationId: string,\n    data: unknown,' },
      { from: /broadcastNotification\(\s*userId: string,\s*data: any,/g, to: 'broadcastNotification(\n    userId: string,\n    data: unknown,' },
      { from: /broadcastReminder\(\s*userIds: string\[\],\s*data: any,/g, to: 'broadcastReminder(\n    userIds: string[],\n    data: unknown,' },
      { from: /broadcastEmergencyAlert\(\s*data: any,/g, to: 'broadcastEmergencyAlert(\n    data: unknown,' },
    ],
    types: `/**
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
}`
  },

  // Monitoring Service
  {
    file: 'src/infrastructure/monitoring/monitoring.service.ts',
    replacements: [
      { from: /private cacheService\?: any;/, to: 'private cacheService?: CacheServiceInterface;' },
      { from: /private websocketService\?: any;/, to: 'private websocketService?: WebSocketServiceInterface;' },
      { from: /private queueManagerService\?: any;/, to: 'private queueManagerService?: MessageQueueServiceInterface;' },
      { from: /private circuitBreakerService\?: any;/, to: 'private circuitBreakerService?: CircuitBreakerServiceInterface;' },
      { from: /setCacheService\(cacheService: any\): void/, to: 'setCacheService(cacheService: CacheServiceInterface | undefined): void' },
      { from: /setWebSocketService\(websocketService: any\): void/, to: 'setWebSocketService(websocketService: WebSocketServiceInterface | undefined): void' },
      { from: /setQueueManagerService\(queueManagerService: any\): void/, to: 'setQueueManagerService(queueManagerService: MessageQueueServiceInterface | undefined): void' },
      { from: /setCircuitBreakerService\(circuitBreakerService: any\): void/, to: 'setCircuitBreakerService(circuitBreakerService: CircuitBreakerServiceInterface | undefined): void' },
      { from: /\(stats: any\)/g, to: '(stats: Record<string, unknown>)' },
    ],
    types: `/**
 * Service interfaces for optional dependencies
 */
interface CacheServiceInterface {
  getStats?(): Promise<Record<string, unknown>>;
}

interface WebSocketServiceInterface {
  getStats?(): Record<string, unknown>;
}

interface MessageQueueServiceInterface {
  getStats?(): Record<string, unknown>;
}

interface CircuitBreakerServiceInterface {
  getStats?(): Record<string, unknown>;
}`
  },
];

console.log('Applying fixes...\n');

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

  // Handle import replacements
  if (fix.replaceImports) {
    if (content.includes(fix.replaceImports.from)) {
      content = content.replace(fix.replaceImports.from, fix.replaceImports.to);
      fileModified = true;
    }
  } else if (fix.addImports) {
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, nextLineIndex + 1) + fix.addImports + '\n' + content.slice(nextLineIndex + 1);
      fileModified = true;
    }
  }

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

  // Add types in correct position
  if (fix.types && fileModified) {
    content = insertTypes(content, fix.types);
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
