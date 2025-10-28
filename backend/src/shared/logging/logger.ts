/**
 * Logger utility
 * Simple logging utility for the application
 */

export interface LogObject {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  timestamp: Date;
  [key: string]: any;
}

export class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  info(message: string, meta?: any) {
    console.log(`[${this.name}] INFO: ${message}`, meta || '');
  }

  warn(message: string, meta?: any) {
    console.warn(`[${this.name}] WARN: ${message}`, meta || '');
  }

  error(message: string, meta?: any) {
    console.error(`[${this.name}] ERROR: ${message}`, meta || '');
  }

  debug(message: string, meta?: any) {
    console.debug(`[${this.name}] DEBUG: ${message}`, meta || '');
  }
}

export const logger = new Logger('App');
