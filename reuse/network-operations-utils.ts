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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// DNS RESOLUTION HELPERS
// ============================================================================

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
export const resolveDns = async (
  hostname: string,
  recordType: DnsRecord['type'] = 'A',
): Promise<string[]> => {
  try {
    // Note: In browser environment, this would need to use a DNS-over-HTTPS service
    // For Node.js, we'd use dns.promises.resolve
    const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=${recordType}`);
    const data = await response.json();
    return data.Answer?.map((record: any) => record.data) || [];
  } catch (error: any) {
    throw new Error(`DNS resolution failed for ${hostname}: ${error.message}`);
  }
};

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
export const reverseDnsLookup = async (ipAddress: string): Promise<string> => {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${ipAddress}&type=PTR`);
    const data = await response.json();
    return data.Answer?.[0]?.data || ipAddress;
  } catch (error: any) {
    throw new Error(`Reverse DNS lookup failed for ${ipAddress}: ${error.message}`);
  }
};

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
export const checkDnsRecordExists = async (
  hostname: string,
  recordType: DnsRecord['type'] = 'A',
): Promise<boolean> => {
  try {
    const records = await resolveDns(hostname, recordType);
    return records.length > 0;
  } catch (error) {
    return false;
  }
};

// ============================================================================
// IP ADDRESS VALIDATION AND PARSING
// ============================================================================

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
export const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

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
export const isValidIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
};

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
export const parseIpAddress = (ip: string): IpAddress | null => {
  if (isValidIPv4(ip)) {
    return {
      address: ip,
      version: 4,
      isPrivate: isPrivateIPv4(ip),
      isLoopback: isLoopbackIPv4(ip),
      isMulticast: isMulticastIPv4(ip),
    };
  } else if (isValidIPv6(ip)) {
    return {
      address: ip,
      version: 6,
      isPrivate: isPrivateIPv6(ip),
      isLoopback: isLoopbackIPv6(ip),
      isMulticast: isMulticastIPv6(ip),
    };
  }
  return null;
};

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
export const isPrivateIPv4 = (ip: string): boolean => {
  const parts = ip.split('.').map(Number);
  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
};

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
export const isLoopbackIPv4 = (ip: string): boolean => {
  return ip.startsWith('127.');
};

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
export const isMulticastIPv4 = (ip: string): boolean => {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  return firstOctet >= 224 && firstOctet <= 239;
};

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
export const isPrivateIPv6 = (ip: string): boolean => {
  const lower = ip.toLowerCase();
  return lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80');
};

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
export const isLoopbackIPv6 = (ip: string): boolean => {
  return ip === '::1' || ip === '0000:0000:0000:0000:0000:0000:0000:0001';
};

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
export const isMulticastIPv6 = (ip: string): boolean => {
  return ip.toLowerCase().startsWith('ff');
};

// ============================================================================
// NETWORK CONNECTIVITY CHECKS
// ============================================================================

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
export const checkNetworkConnectivity = async (
  endpoint: string = 'https://dns.google/resolve?name=google.com',
  timeout: number = 5000,
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

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
export const measureNetworkLatency = async (
  endpoint: string,
  samples: number = 3,
): Promise<number> => {
  const latencies: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    try {
      await fetch(endpoint, { method: 'HEAD' });
      const end = performance.now();
      latencies.push(end - start);
    } catch (error) {
      // Skip failed samples
    }
  }

  if (latencies.length === 0) {
    throw new Error('Failed to measure network latency');
  }

  return latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
};

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
export const getNetworkStatus = async (
  endpoint?: string,
): Promise<NetworkConnectivity> => {
  const isOnline = await checkNetworkConnectivity(endpoint);
  let latency = 0;

  if (isOnline && endpoint) {
    try {
      latency = await measureNetworkLatency(endpoint, 1);
    } catch (error) {
      latency = -1;
    }
  }

  return {
    isOnline,
    latency,
    timestamp: Date.now(),
  };
};

// ============================================================================
// PROXY CONFIGURATION
// ============================================================================

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
export const createProxyConfig = (
  host: string,
  port: number,
  protocol: ProxyConfig['protocol'] = 'http',
  username?: string,
  password?: string,
): ProxyConfig => {
  return {
    host,
    port,
    protocol,
    username,
    password,
  };
};

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
export const proxyConfigToUrl = (config: ProxyConfig): string => {
  const { protocol, username, password, host, port } = config;
  const auth = username && password ? `${username}:${password}@` : '';
  return `${protocol}://${auth}${host}:${port}`;
};

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
export const validateProxyConfig = (config: ProxyConfig): boolean => {
  if (!config.host || config.host.trim() === '') return false;
  if (config.port < 1 || config.port > 65535) return false;
  if (!['http', 'https', 'socks4', 'socks5'].includes(config.protocol)) return false;
  return true;
};

// ============================================================================
// WEBSOCKET CONNECTION MANAGEMENT
// ============================================================================

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
export const createWebSocketConnection = (config: WebSocketConfig) => {
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  let messageHandlers: Array<(data: any) => void> = [];
  let errorHandlers: Array<(error: any) => void> = [];
  let closeHandlers: Array<() => void> = [];

  const connect = () => {
    socket = new WebSocket(config.url, config.protocols);

    socket.onopen = () => {
      reconnectAttempts = 0;
    };

    socket.onmessage = (event) => {
      messageHandlers.forEach(handler => handler(event.data));
    };

    socket.onerror = (error) => {
      errorHandlers.forEach(handler => handler(error));
    };

    socket.onclose = () => {
      closeHandlers.forEach(handler => handler());

      if (config.reconnect && reconnectAttempts < (config.maxReconnectAttempts || Infinity)) {
        reconnectAttempts++;
        setTimeout(connect, config.reconnectInterval || 5000);
      }
    };
  };

  return {
    connect,
    disconnect: () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    },
    send: (data: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      }
    },
    onMessage: (handler: (data: any) => void) => {
      messageHandlers.push(handler);
    },
    onError: (handler: (error: any) => void) => {
      errorHandlers.push(handler);
    },
    onClose: (handler: () => void) => {
      closeHandlers.push(handler);
    },
    getState: () => socket?.readyState,
    isConnected: () => socket?.readyState === WebSocket.OPEN,
  };
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
export const sendWebSocketMessage = async (
  socket: WebSocket,
  data: any,
  timeout: number = 5000,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (socket.readyState !== WebSocket.OPEN) {
      reject(new Error('WebSocket is not open'));
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error('WebSocket send timeout'));
    }, timeout);

    try {
      socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      clearTimeout(timeoutId);
      resolve();
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};

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
export const waitForWebSocketReady = async (
  socket: WebSocket,
  timeout: number = 10000,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (socket.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error('WebSocket ready timeout'));
    }, timeout);

    socket.addEventListener('open', () => {
      clearTimeout(timeoutId);
      resolve();
    });

    socket.addEventListener('error', (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
};

// ============================================================================
// NETWORK TIMEOUT MANAGEMENT
// ============================================================================

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
export const fetchWithTimeout = async (
  url: string,
  options?: RequestInit,
  timeout: number = 30000,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

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
export const promiseWithTimeout = <T>(
  promise: Promise<T>,
  timeout: number,
  errorMessage?: string,
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(errorMessage || `Operation timeout after ${timeout}ms`)),
        timeout,
      ),
    ),
  ]);
};

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

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
export const createCircuitBreaker = (config: CircuitBreakerConfig) => {
  const state: CircuitBreakerState = {
    state: 'CLOSED',
    failures: 0,
    successes: 0,
    lastFailureTime: 0,
  };

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (state.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - state.lastFailureTime;
      if (timeSinceLastFailure >= config.resetTimeout) {
        state.state = 'HALF_OPEN';
        state.successes = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await promiseWithTimeout(fn(), config.timeout);

      if (state.state === 'HALF_OPEN') {
        state.successes++;
        if (state.successes >= config.successThreshold) {
          state.state = 'CLOSED';
          state.failures = 0;
        }
      } else {
        state.failures = 0;
      }

      return result;
    } catch (error) {
      state.failures++;
      state.lastFailureTime = Date.now();

      if (state.failures >= config.failureThreshold) {
        state.state = 'OPEN';
      }

      throw error;
    }
  };

  return {
    execute,
    getState: () => state.state,
    reset: () => {
      state.state = 'CLOSED';
      state.failures = 0;
      state.successes = 0;
      state.lastFailureTime = 0;
    },
  };
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
export const getCircuitBreakerState = (state: CircuitBreakerState) => {
  const descriptions = {
    CLOSED: 'Circuit is healthy and allowing requests',
    OPEN: 'Circuit is broken and blocking requests',
    HALF_OPEN: 'Circuit is testing if service has recovered',
  };

  return {
    state: state.state,
    description: descriptions[state.state],
    failures: state.failures,
    successes: state.successes,
    lastFailureTime: state.lastFailureTime,
  };
};

// ============================================================================
// SERVICE HEALTH CHECKS
// ============================================================================

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
export const performHealthCheck = async (
  config: HealthCheckConfig,
): Promise<HealthCheckResult> => {
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    const start = performance.now();
    try {
      const response = await fetchWithTimeout(config.endpoint, { method: 'GET' }, config.timeout);
      const latency = performance.now() - start;

      return {
        healthy: response.ok,
        latency,
        statusCode: response.status,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      lastError = error.message;
    }
  }

  return {
    healthy: false,
    latency: -1,
    error: lastError,
    timestamp: Date.now(),
  };
};

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
export const createHealthCheckMonitor = (
  config: HealthCheckConfig,
  callback: (result: HealthCheckResult) => void,
) => {
  let intervalId: NodeJS.Timeout | null = null;

  const start = () => {
    if (intervalId) return;

    const check = async () => {
      const result = await performHealthCheck(config);
      callback(result);
    };

    check(); // Initial check
    intervalId = setInterval(check, config.interval);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
};

// ============================================================================
// LOAD BALANCING HELPERS
// ============================================================================

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
export const roundRobinSelect = (
  nodes: LoadBalancerNode[],
  currentIndex: number,
): LoadBalancerNode | null => {
  const healthyNodes = nodes.filter(node => node.healthy);
  if (healthyNodes.length === 0) return null;

  const nextIndex = (currentIndex + 1) % healthyNodes.length;
  return healthyNodes[nextIndex];
};

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
export const weightedRoundRobinSelect = (
  nodes: LoadBalancerNode[],
): LoadBalancerNode | null => {
  const healthyNodes = nodes.filter(node => node.healthy);
  if (healthyNodes.length === 0) return null;

  const totalWeight = healthyNodes.reduce((sum, node) => sum + node.weight, 0);
  let random = Math.random() * totalWeight;

  for (const node of healthyNodes) {
    random -= node.weight;
    if (random <= 0) {
      return node;
    }
  }

  return healthyNodes[0];
};

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
export const leastConnectionsSelect = (
  nodes: LoadBalancerNode[],
): LoadBalancerNode | null => {
  const healthyNodes = nodes.filter(node => node.healthy);
  if (healthyNodes.length === 0) return null;

  return healthyNodes.reduce((min, node) =>
    node.activeConnections < min.activeConnections ? node : min,
  );
};

export default {
  // DNS resolution
  resolveDns,
  reverseDnsLookup,
  checkDnsRecordExists,

  // IP validation
  isValidIPv4,
  isValidIPv6,
  parseIpAddress,
  isPrivateIPv4,
  isLoopbackIPv4,
  isMulticastIPv4,
  isPrivateIPv6,
  isLoopbackIPv6,
  isMulticastIPv6,

  // Network connectivity
  checkNetworkConnectivity,
  measureNetworkLatency,
  getNetworkStatus,

  // Proxy configuration
  createProxyConfig,
  proxyConfigToUrl,
  validateProxyConfig,

  // WebSocket management
  createWebSocketConnection,
  sendWebSocketMessage,
  waitForWebSocketReady,

  // Network timeout
  fetchWithTimeout,
  promiseWithTimeout,

  // Circuit breaker
  createCircuitBreaker,
  getCircuitBreakerState,

  // Health checks
  performHealthCheck,
  createHealthCheckMonitor,

  // Load balancing
  roundRobinSelect,
  weightedRoundRobinSelect,
  leastConnectionsSelect,
};
