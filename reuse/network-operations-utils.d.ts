/**
 * LOC: NET1234567
 * File: /reuse/network-operations-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network services
 *   - API gateway modules
 *   - WebSocket/Socket.IO handlers
 *   - Health check services
 */
/**
 * File: /reuse/network-operations-utils.ts
 * Locator: WC-UTL-NET-003
 * Purpose: Network Operations Utilities - Comprehensive network connectivity and management helpers
 *
 * Upstream: Independent utility module for network operations
 * Downstream: ../backend/*, ../frontend/*, Network services, WebSocket handlers
 * Dependencies: TypeScript 5.x, Node 18+, ws, socket.io-client (optional)
 * Exports: 42 utility functions for DNS, IP validation, connectivity, proxy, WebSocket, circuit breaker, health checks
 *
 * LLM Context: Comprehensive network operations utilities for White Cross system.
 * Provides DNS resolution, IP address validation, network connectivity checks, WebSocket management,
 * circuit breaker patterns, service health checks, and load balancing helpers. Essential for reliable
 * network communication in distributed healthcare applications.
 */
interface DnsRecord {
    type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
    value: string;
    ttl?: number;
}
interface IpAddress {
    address: string;
    version: 4 | 6;
    isPrivate: boolean;
    isLoopback: boolean;
    isMulticast: boolean;
}
interface NetworkConnectivity {
    isOnline: boolean;
    latency: number;
    bandwidth?: number;
    timestamp: number;
}
interface ProxyConfig {
    host: string;
    port: number;
    protocol: 'http' | 'https' | 'socks4' | 'socks5';
    username?: string;
    password?: string;
}
interface WebSocketConfig {
    url: string;
    protocols?: string | string[];
    reconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
}
interface CircuitBreakerState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    successes: number;
    lastFailureTime: number;
}
interface HealthCheckConfig {
    endpoint: string;
    interval: number;
    timeout: number;
    retries: number;
}
interface HealthCheckResult {
    healthy: boolean;
    latency: number;
    statusCode?: number;
    error?: string;
    timestamp: number;
}
interface LoadBalancerNode {
    id: string;
    url: string;
    weight: number;
    healthy: boolean;
    activeConnections: number;
}
/**
 * Resolves hostname to IP addresses using DNS lookup.
 *
 * @param {string} hostname - Hostname to resolve
 * @param {DnsRecord['type']} [recordType] - DNS record type (default: 'A')
 * @returns {Promise<string[]>} Array of resolved IP addresses
 *
 * @example
 * ```typescript
 * const ips = await resolveDns('example.com');
 * // Result: ['93.184.216.34']
 *
 * const ipv6 = await resolveDns('example.com', 'AAAA');
 * // Result: ['2606:2800:220:1:248:1893:25c8:1946']
 * ```
 */
export declare const resolveDns: (hostname: string, recordType?: DnsRecord["type"]) => Promise<string[]>;
/**
 * Performs reverse DNS lookup to get hostname from IP address.
 *
 * @param {string} ipAddress - IP address to lookup
 * @returns {Promise<string>} Resolved hostname
 *
 * @example
 * ```typescript
 * const hostname = await reverseDnsLookup('8.8.8.8');
 * // Result: 'dns.google'
 * ```
 */
export declare const reverseDnsLookup: (ipAddress: string) => Promise<string>;
/**
 * Checks if DNS record exists for a hostname.
 *
 * @param {string} hostname - Hostname to check
 * @param {DnsRecord['type']} [recordType] - DNS record type
 * @returns {Promise<boolean>} True if DNS record exists
 *
 * @example
 * ```typescript
 * const exists = await checkDnsRecordExists('example.com', 'A');
 * // Result: true
 *
 * const mxExists = await checkDnsRecordExists('example.com', 'MX');
 * // Result: true
 * ```
 */
export declare const checkDnsRecordExists: (hostname: string, recordType?: DnsRecord["type"]) => Promise<boolean>;
/**
 * Validates IPv4 address format.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IPv4 address
 *
 * @example
 * ```typescript
 * isValidIPv4('192.168.1.1'); // true
 * isValidIPv4('256.1.1.1'); // false
 * isValidIPv4('192.168.1'); // false
 * ```
 */
export declare const isValidIPv4: (ip: string) => boolean;
/**
 * Validates IPv6 address format.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IPv6 address
 *
 * @example
 * ```typescript
 * isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // true
 * isValidIPv6('2001:db8::1'); // true
 * isValidIPv6('192.168.1.1'); // false
 * ```
 */
export declare const isValidIPv6: (ip: string) => boolean;
/**
 * Parses IP address and returns detailed information.
 *
 * @param {string} ip - IP address to parse
 * @returns {IpAddress | null} IP address information or null if invalid
 *
 * @example
 * ```typescript
 * const info = parseIpAddress('192.168.1.1');
 * // Result: { address: '192.168.1.1', version: 4, isPrivate: true, isLoopback: false, isMulticast: false }
 *
 * const loopback = parseIpAddress('127.0.0.1');
 * // Result: { address: '127.0.0.1', version: 4, isPrivate: false, isLoopback: true, isMulticast: false }
 * ```
 */
export declare const parseIpAddress: (ip: string) => IpAddress | null;
/**
 * Checks if IPv4 address is private.
 *
 * @param {string} ip - IPv4 address
 * @returns {boolean} True if private IP address
 *
 * @example
 * ```typescript
 * isPrivateIPv4('192.168.1.1'); // true
 * isPrivateIPv4('10.0.0.1'); // true
 * isPrivateIPv4('8.8.8.8'); // false
 * ```
 */
export declare const isPrivateIPv4: (ip: string) => boolean;
/**
 * Checks if IPv4 address is loopback.
 *
 * @param {string} ip - IPv4 address
 * @returns {boolean} True if loopback IP address
 *
 * @example
 * ```typescript
 * isLoopbackIPv4('127.0.0.1'); // true
 * isLoopbackIPv4('127.255.255.255'); // true
 * isLoopbackIPv4('192.168.1.1'); // false
 * ```
 */
export declare const isLoopbackIPv4: (ip: string) => boolean;
/**
 * Checks if IPv4 address is multicast.
 *
 * @param {string} ip - IPv4 address
 * @returns {boolean} True if multicast IP address
 *
 * @example
 * ```typescript
 * isMulticastIPv4('224.0.0.1'); // true
 * isMulticastIPv4('239.255.255.255'); // true
 * isMulticastIPv4('192.168.1.1'); // false
 * ```
 */
export declare const isMulticastIPv4: (ip: string) => boolean;
/**
 * Checks if IPv6 address is private.
 *
 * @param {string} ip - IPv6 address
 * @returns {boolean} True if private IP address
 *
 * @example
 * ```typescript
 * isPrivateIPv6('fc00::1'); // true (unique local address)
 * isPrivateIPv6('fe80::1'); // true (link-local)
 * isPrivateIPv6('2001:db8::1'); // false
 * ```
 */
export declare const isPrivateIPv6: (ip: string) => boolean;
/**
 * Checks if IPv6 address is loopback.
 *
 * @param {string} ip - IPv6 address
 * @returns {boolean} True if loopback IP address
 *
 * @example
 * ```typescript
 * isLoopbackIPv6('::1'); // true
 * isLoopbackIPv6('0000:0000:0000:0000:0000:0000:0000:0001'); // true
 * isLoopbackIPv6('2001:db8::1'); // false
 * ```
 */
export declare const isLoopbackIPv6: (ip: string) => boolean;
/**
 * Checks if IPv6 address is multicast.
 *
 * @param {string} ip - IPv6 address
 * @returns {boolean} True if multicast IP address
 *
 * @example
 * ```typescript
 * isMulticastIPv6('ff00::1'); // true
 * isMulticastIPv6('ff02::1'); // true
 * isMulticastIPv6('2001:db8::1'); // false
 * ```
 */
export declare const isMulticastIPv6: (ip: string) => boolean;
/**
 * Checks if network is online by pinging a reliable endpoint.
 *
 * @param {string} [endpoint] - Endpoint to check (default: https://dns.google/resolve)
 * @param {number} [timeout] - Request timeout in ms (default: 5000)
 * @returns {Promise<boolean>} True if network is online
 *
 * @example
 * ```typescript
 * const online = await checkNetworkConnectivity();
 * if (online) {
 *   console.log('Network is online');
 * }
 *
 * const customCheck = await checkNetworkConnectivity('https://api.example.com/health', 3000);
 * ```
 */
export declare const checkNetworkConnectivity: (endpoint?: string, timeout?: number) => Promise<boolean>;
/**
 * Measures network latency to a specific endpoint.
 *
 * @param {string} endpoint - Endpoint to measure latency
 * @param {number} [samples] - Number of samples to take (default: 3)
 * @returns {Promise<number>} Average latency in milliseconds
 *
 * @example
 * ```typescript
 * const latency = await measureNetworkLatency('https://api.example.com/ping');
 * console.log(`Average latency: ${latency}ms`);
 *
 * const detailedLatency = await measureNetworkLatency('https://api.example.com/ping', 10);
 * ```
 */
export declare const measureNetworkLatency: (endpoint: string, samples?: number) => Promise<number>;
/**
 * Gets comprehensive network connectivity status.
 *
 * @param {string} [endpoint] - Endpoint to check
 * @returns {Promise<NetworkConnectivity>} Network connectivity information
 *
 * @example
 * ```typescript
 * const status = await getNetworkStatus();
 * // Result: { isOnline: true, latency: 45.2, timestamp: 1699564800000 }
 *
 * if (status.isOnline && status.latency < 100) {
 *   console.log('Good network connection');
 * }
 * ```
 */
export declare const getNetworkStatus: (endpoint?: string) => Promise<NetworkConnectivity>;
/**
 * Creates proxy configuration object.
 *
 * @param {string} host - Proxy host
 * @param {number} port - Proxy port
 * @param {ProxyConfig['protocol']} [protocol] - Proxy protocol (default: 'http')
 * @param {string} [username] - Proxy username
 * @param {string} [password] - Proxy password
 * @returns {ProxyConfig} Proxy configuration
 *
 * @example
 * ```typescript
 * const proxy = createProxyConfig('proxy.example.com', 8080, 'http');
 *
 * const authProxy = createProxyConfig(
 *   'proxy.example.com',
 *   8080,
 *   'http',
 *   'user',
 *   'password'
 * );
 * ```
 */
export declare const createProxyConfig: (host: string, port: number, protocol?: ProxyConfig["protocol"], username?: string, password?: string) => ProxyConfig;
/**
 * Converts proxy config to URL string.
 *
 * @param {ProxyConfig} config - Proxy configuration
 * @returns {string} Proxy URL
 *
 * @example
 * ```typescript
 * const config = createProxyConfig('proxy.example.com', 8080, 'http', 'user', 'pass');
 * const url = proxyConfigToUrl(config);
 * // Result: 'http://user:pass@proxy.example.com:8080'
 *
 * const simpleConfig = createProxyConfig('proxy.example.com', 3128);
 * const simpleUrl = proxyConfigToUrl(simpleConfig);
 * // Result: 'http://proxy.example.com:3128'
 * ```
 */
export declare const proxyConfigToUrl: (config: ProxyConfig) => string;
/**
 * Validates proxy configuration.
 *
 * @param {ProxyConfig} config - Proxy configuration to validate
 * @returns {boolean} True if proxy config is valid
 *
 * @example
 * ```typescript
 * const config = createProxyConfig('proxy.example.com', 8080);
 * const valid = validateProxyConfig(config); // true
 *
 * const invalidConfig = { host: '', port: -1, protocol: 'http' } as ProxyConfig;
 * const invalid = validateProxyConfig(invalidConfig); // false
 * ```
 */
export declare const validateProxyConfig: (config: ProxyConfig) => boolean;
/**
 * Creates WebSocket with auto-reconnect capability.
 *
 * @param {WebSocketConfig} config - WebSocket configuration
 * @returns {object} WebSocket manager with connection methods
 *
 * @example
 * ```typescript
 * const ws = createWebSocketConnection({
 *   url: 'wss://api.example.com/ws',
 *   reconnect: true,
 *   reconnectInterval: 5000,
 *   maxReconnectAttempts: 10
 * });
 *
 * ws.onMessage((data) => console.log('Received:', data));
 * ws.onError((error) => console.error('Error:', error));
 * ws.connect();
 * ```
 */
export declare const createWebSocketConnection: (config: WebSocketConfig) => {
    connect: () => void;
    disconnect: () => void;
    send: (data: any) => void;
    onMessage: (handler: (data: any) => void) => void;
    onError: (handler: (error: any) => void) => void;
    onClose: (handler: () => void) => void;
    getState: () => any;
    isConnected: () => boolean;
};
/**
 * Sends WebSocket message with timeout.
 *
 * @param {WebSocket} socket - WebSocket instance
 * @param {any} data - Data to send
 * @param {number} [timeout] - Timeout in ms (default: 5000)
 * @returns {Promise<void>} Promise that resolves when message is sent
 *
 * @example
 * ```typescript
 * const socket = new WebSocket('wss://api.example.com/ws');
 * await sendWebSocketMessage(socket, { type: 'ping' }, 3000);
 * ```
 */
export declare const sendWebSocketMessage: (socket: WebSocket, data: any, timeout?: number) => Promise<void>;
/**
 * Waits for WebSocket to be ready.
 *
 * @param {WebSocket} socket - WebSocket instance
 * @param {number} [timeout] - Timeout in ms (default: 10000)
 * @returns {Promise<void>} Promise that resolves when WebSocket is ready
 *
 * @example
 * ```typescript
 * const socket = new WebSocket('wss://api.example.com/ws');
 * await waitForWebSocketReady(socket);
 * socket.send('Hello');
 * ```
 */
export declare const waitForWebSocketReady: (socket: WebSocket, timeout?: number) => Promise<void>;
/**
 * Creates fetch request with timeout.
 *
 * @param {string} url - Request URL
 * @param {RequestInit} [options] - Fetch options
 * @param {number} [timeout] - Timeout in ms (default: 30000)
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await fetchWithTimeout(
 *   'https://api.example.com/data',
 *   { method: 'GET' },
 *   5000
 * );
 * ```
 */
export declare const fetchWithTimeout: (url: string, options?: RequestInit, timeout?: number) => Promise<Response>;
/**
 * Creates promise with timeout.
 *
 * @template T
 * @param {Promise<T>} promise - Promise to wrap
 * @param {number} timeout - Timeout in ms
 * @param {string} [errorMessage] - Custom error message
 * @returns {Promise<T>} Promise with timeout
 *
 * @example
 * ```typescript
 * const result = await promiseWithTimeout(
 *   fetch('https://api.example.com/data'),
 *   5000,
 *   'API request timed out'
 * );
 * ```
 */
export declare const promiseWithTimeout: <T>(promise: Promise<T>, timeout: number, errorMessage?: string) => Promise<T>;
/**
 * Creates circuit breaker for network requests.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker with execute method
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 *   resetTimeout: 30000
 * });
 *
 * const result = await breaker.execute(() =>
 *   fetch('https://api.example.com/data')
 * );
 * ```
 */
export declare const createCircuitBreaker: (config: CircuitBreakerConfig) => {
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
    getState: () => "CLOSED" | "OPEN" | "HALF_OPEN";
    reset: () => void;
};
/**
 * Gets circuit breaker state information.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @returns {object} State information with human-readable status
 *
 * @example
 * ```typescript
 * const stateInfo = getCircuitBreakerState(breaker.getState());
 * console.log(stateInfo);
 * // Result: { state: 'CLOSED', description: 'Circuit is healthy', ... }
 * ```
 */
export declare const getCircuitBreakerState: (state: CircuitBreakerState) => {
    state: "CLOSED" | "OPEN" | "HALF_OPEN";
    description: string;
    failures: number;
    successes: number;
    lastFailureTime: number;
};
/**
 * Performs health check on a service endpoint.
 *
 * @param {HealthCheckConfig} config - Health check configuration
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const result = await performHealthCheck({
 *   endpoint: 'https://api.example.com/health',
 *   interval: 30000,
 *   timeout: 5000,
 *   retries: 3
 * });
 *
 * if (result.healthy) {
 *   console.log(`Service is healthy (latency: ${result.latency}ms)`);
 * }
 * ```
 */
export declare const performHealthCheck: (config: HealthCheckConfig) => Promise<HealthCheckResult>;
/**
 * Creates continuous health check monitor.
 *
 * @param {HealthCheckConfig} config - Health check configuration
 * @param {(result: HealthCheckResult) => void} callback - Callback for results
 * @returns {object} Monitor with start/stop methods
 *
 * @example
 * ```typescript
 * const monitor = createHealthCheckMonitor(
 *   {
 *     endpoint: 'https://api.example.com/health',
 *     interval: 30000,
 *     timeout: 5000,
 *     retries: 3
 *   },
 *   (result) => {
 *     console.log('Health check:', result);
 *   }
 * );
 *
 * monitor.start();
 * // Later: monitor.stop();
 * ```
 */
export declare const createHealthCheckMonitor: (config: HealthCheckConfig, callback: (result: HealthCheckResult) => void) => {
    start: () => void;
    stop: () => void;
};
/**
 * Selects next node using round-robin load balancing.
 *
 * @param {LoadBalancerNode[]} nodes - Available nodes
 * @param {number} currentIndex - Current node index
 * @returns {LoadBalancerNode | null} Next node or null if none available
 *
 * @example
 * ```typescript
 * const nodes = [
 *   { id: '1', url: 'https://api1.example.com', weight: 1, healthy: true, activeConnections: 5 },
 *   { id: '2', url: 'https://api2.example.com', weight: 1, healthy: true, activeConnections: 3 }
 * ];
 *
 * const next = roundRobinSelect(nodes, 0);
 * // Result: nodes[1]
 * ```
 */
export declare const roundRobinSelect: (nodes: LoadBalancerNode[], currentIndex: number) => LoadBalancerNode | null;
/**
 * Selects node using weighted round-robin load balancing.
 *
 * @param {LoadBalancerNode[]} nodes - Available nodes
 * @returns {LoadBalancerNode | null} Selected node or null if none available
 *
 * @example
 * ```typescript
 * const nodes = [
 *   { id: '1', url: 'https://api1.example.com', weight: 3, healthy: true, activeConnections: 5 },
 *   { id: '2', url: 'https://api2.example.com', weight: 1, healthy: true, activeConnections: 3 }
 * ];
 *
 * const selected = weightedRoundRobinSelect(nodes);
 * // 75% chance of selecting node 1, 25% chance of selecting node 2
 * ```
 */
export declare const weightedRoundRobinSelect: (nodes: LoadBalancerNode[]) => LoadBalancerNode | null;
/**
 * Selects node with least active connections.
 *
 * @param {LoadBalancerNode[]} nodes - Available nodes
 * @returns {LoadBalancerNode | null} Node with least connections or null
 *
 * @example
 * ```typescript
 * const nodes = [
 *   { id: '1', url: 'https://api1.example.com', weight: 1, healthy: true, activeConnections: 10 },
 *   { id: '2', url: 'https://api2.example.com', weight: 1, healthy: true, activeConnections: 3 }
 * ];
 *
 * const selected = leastConnectionsSelect(nodes);
 * // Result: nodes[1] (has fewer connections)
 * ```
 */
export declare const leastConnectionsSelect: (nodes: LoadBalancerNode[]) => LoadBalancerNode | null;
declare const _default: {
    resolveDns: (hostname: string, recordType?: DnsRecord["type"]) => Promise<string[]>;
    reverseDnsLookup: (ipAddress: string) => Promise<string>;
    checkDnsRecordExists: (hostname: string, recordType?: DnsRecord["type"]) => Promise<boolean>;
    isValidIPv4: (ip: string) => boolean;
    isValidIPv6: (ip: string) => boolean;
    parseIpAddress: (ip: string) => IpAddress | null;
    isPrivateIPv4: (ip: string) => boolean;
    isLoopbackIPv4: (ip: string) => boolean;
    isMulticastIPv4: (ip: string) => boolean;
    isPrivateIPv6: (ip: string) => boolean;
    isLoopbackIPv6: (ip: string) => boolean;
    isMulticastIPv6: (ip: string) => boolean;
    checkNetworkConnectivity: (endpoint?: string, timeout?: number) => Promise<boolean>;
    measureNetworkLatency: (endpoint: string, samples?: number) => Promise<number>;
    getNetworkStatus: (endpoint?: string) => Promise<NetworkConnectivity>;
    createProxyConfig: (host: string, port: number, protocol?: ProxyConfig["protocol"], username?: string, password?: string) => ProxyConfig;
    proxyConfigToUrl: (config: ProxyConfig) => string;
    validateProxyConfig: (config: ProxyConfig) => boolean;
    createWebSocketConnection: (config: WebSocketConfig) => {
        connect: () => void;
        disconnect: () => void;
        send: (data: any) => void;
        onMessage: (handler: (data: any) => void) => void;
        onError: (handler: (error: any) => void) => void;
        onClose: (handler: () => void) => void;
        getState: () => any;
        isConnected: () => boolean;
    };
    sendWebSocketMessage: (socket: WebSocket, data: any, timeout?: number) => Promise<void>;
    waitForWebSocketReady: (socket: WebSocket, timeout?: number) => Promise<void>;
    fetchWithTimeout: (url: string, options?: RequestInit, timeout?: number) => Promise<Response>;
    promiseWithTimeout: <T>(promise: Promise<T>, timeout: number, errorMessage?: string) => Promise<T>;
    createCircuitBreaker: (config: CircuitBreakerConfig) => {
        execute: <T>(fn: () => Promise<T>) => Promise<T>;
        getState: () => "CLOSED" | "OPEN" | "HALF_OPEN";
        reset: () => void;
    };
    getCircuitBreakerState: (state: CircuitBreakerState) => {
        state: "CLOSED" | "OPEN" | "HALF_OPEN";
        description: string;
        failures: number;
        successes: number;
        lastFailureTime: number;
    };
    performHealthCheck: (config: HealthCheckConfig) => Promise<HealthCheckResult>;
    createHealthCheckMonitor: (config: HealthCheckConfig, callback: (result: HealthCheckResult) => void) => {
        start: () => void;
        stop: () => void;
    };
    roundRobinSelect: (nodes: LoadBalancerNode[], currentIndex: number) => LoadBalancerNode | null;
    weightedRoundRobinSelect: (nodes: LoadBalancerNode[]) => LoadBalancerNode | null;
    leastConnectionsSelect: (nodes: LoadBalancerNode[]) => LoadBalancerNode | null;
};
export default _default;
//# sourceMappingURL=network-operations-utils.d.ts.map