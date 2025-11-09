/**
 * @fileoverview Database Connection Kit
 * @module core/database/connection-kit
 *
 * Production-ready database connection management including connection pooling,
 * retry logic, health checks, and multi-database support.
 *
 * @example Create a connection
 * ```typescript
 * const connectionKit = new ConnectionKit({
 *   dialect: 'postgres',
 *   host: 'localhost',
 *   port: 5432,
 *   database: 'mydb',
 *   username: 'user',
 *   password: 'pass'
 * });
 *
 * await connectionKit.connect();
 * ```
 */
import type { SequelizeInstance } from './sequelize';
/**
 * Database dialect types
 */
export type DatabaseDialect = 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';
/**
 * Connection configuration
 */
export interface ConnectionConfig {
    /** Database dialect */
    dialect: DatabaseDialect;
    /** Database host */
    host?: string;
    /** Database port */
    port?: number;
    /** Database name */
    database: string;
    /** Database username */
    username?: string;
    /** Database password */
    password?: string;
    /** SQLite storage path */
    storage?: string;
    /** Connection pool configuration */
    pool?: {
        max?: number;
        min?: number;
        acquire?: number;
        idle?: number;
    };
    /** Enable SSL/TLS */
    ssl?: boolean;
    /** Logging function */
    logging?: boolean | ((sql: string, timing?: number) => void);
    /** Timezone */
    timezone?: string;
    /** Retry configuration */
    retry?: {
        max?: number;
        match?: RegExp[];
    };
}
/**
 * Connection status
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
/**
 * Connection health metrics
 */
export interface ConnectionHealth {
    status: ConnectionStatus;
    uptime: number;
    lastCheck: Date;
    connectionCount: number;
    activeQueries: number;
    errors: number;
}
/**
 * Database Connection Kit
 *
 * Manages database connections with pooling, health checks, and retry logic.
 */
export default class ConnectionKit {
    private config;
    private connection;
    private status;
    private connectedAt;
    private healthCheckInterval;
    private errorCount;
    private queryCount;
    constructor(config: ConnectionConfig);
    /**
     * Validate connection configuration
     */
    private validateConfig;
    /**
     * Connect to database
     */
    connect(): Promise<void>;
    /**
     * Disconnect from database
     */
    disconnect(): Promise<void>;
    /**
     * Test database connection
     */
    testConnection(): Promise<boolean>;
    /**
     * Start health check interval
     */
    private startHealthCheck;
    /**
     * Stop health check interval
     */
    private stopHealthCheck;
    /**
     * Reconnect to database
     */
    reconnect(): Promise<void>;
    /**
     * Get connection health metrics
     */
    getHealth(): ConnectionHealth;
    /**
     * Get connection status
     */
    getStatus(): ConnectionStatus;
    /**
     * Get Sequelize instance
     */
    getConnection(): SequelizeInstance | null;
    /**
     * Execute with retry logic
     */
    executeWithRetry<T>(fn: () => Promise<T>, maxRetries?: number): Promise<T>;
    /**
     * Delay utility
     */
    private delay;
    /**
     * Get connection configuration (without sensitive data)
     */
    getConfig(): Partial<ConnectionConfig>;
}
/**
 * Multi-database connection manager
 */
export declare class MultiDatabaseManager {
    private connections;
    private primaryConnection;
    /**
     * Add a database connection
     */
    addConnection(name: string, config: ConnectionConfig, isPrimary?: boolean): void;
    /**
     * Get a connection by name
     */
    getConnection(name?: string): ConnectionKit | null;
    /**
     * Get primary connection
     */
    getPrimaryConnection(): ConnectionKit | null;
    /**
     * Connect all databases
     */
    connectAll(): Promise<void>;
    /**
     * Disconnect all databases
     */
    disconnectAll(): Promise<void>;
    /**
     * Get health status of all connections
     */
    getHealthStatus(): Map<string, ConnectionHealth>;
    /**
     * Remove a connection
     */
    removeConnection(name: string): Promise<void>;
    /**
     * Get all connection names
     */
    getConnectionNames(): string[];
}
/**
 * Connection pool monitor
 */
export declare class ConnectionPoolMonitor {
    private connection;
    private metrics;
    constructor(connection: ConnectionKit);
    /**
     * Track query execution
     */
    trackQuery<T>(fn: () => Promise<T>, slowThreshold?: number): Promise<T>;
    /**
     * Update average query time
     */
    private updateAverageQueryTime;
    /**
     * Get metrics
     */
    getMetrics(): {
        successRate: number;
        totalQueries: number;
        successfulQueries: number;
        failedQueries: number;
        avgQueryTime: number;
        slowQueries: number;
    };
    /**
     * Reset metrics
     */
    resetMetrics(): void;
}
/**
 * Connection factory
 */
export declare class ConnectionFactory {
    /**
     * Create connection from environment variables
     */
    static fromEnvironment(): ConnectionKit;
    /**
     * Create connection from URL
     */
    static fromURL(url: string): ConnectionKit;
    /**
     * Create SQLite connection
     */
    static createSQLite(storage: string): ConnectionKit;
}
/**
 * Create connection kit instance
 */
export declare function createConnectionKit(config: ConnectionConfig): ConnectionKit;
export { ConnectionKit };
//# sourceMappingURL=connection-kit.d.ts.map