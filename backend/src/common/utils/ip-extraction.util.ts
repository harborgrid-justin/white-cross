/**
 * @fileoverview IP Address Extraction Utility
 * @module common/utils/ip-extraction
 * @description Centralized utility for extracting client IP addresses from requests,
 * handling proxies, load balancers, and direct connections consistently.
 *
 * @security Critical for audit logging, rate limiting, and IP restrictions
 * @compliance HIPAA 164.312(b) - Audit controls require accurate IP tracking
 */

import { Request } from 'express';
import { Logger } from '@nestjs/common';

/**
 * IP Extraction Utility
 *
 * Provides consistent IP address extraction across the application.
 * Handles various proxy configurations and fallback scenarios.
 */
export class IpExtractionUtil {
  private static readonly logger = new Logger(IpExtractionUtil.name);

  /**
   * Extract client IP address from HTTP request
   *
   * Priority order:
   * 1. X-Forwarded-For (first IP in chain) - for proxies/load balancers
   * 2. X-Real-IP - for reverse proxies
   * 3. Direct connection IP
   *
   * @param request - Express request object
   * @returns Client IP address or 'unknown' if cannot be determined
   *
   * @example
   * const ip = IpExtractionUtil.extractIpAddress(request);
   * console.log(`Request from: ${ip}`);
   */
  static extractIpAddress(request: Request): string {
    // Check X-Forwarded-For header (for proxies/load balancers)
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = (typeof forwardedFor === 'string' ? forwardedFor : forwardedFor[0])
        .split(',')
        .map((ip: string) => ip.trim());

      if (ips.length > 0 && this.isValidIp(ips[0])) {
        return ips[0];
      }
    }

    // Check X-Real-IP header (for reverse proxies)
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      const ip = typeof realIp === 'string' ? realIp : realIp[0];
      if (this.isValidIp(ip)) {
        return ip;
      }
    }

    // Fall back to connection remote address
    const connectionIp =
      request.ip ||
      request.socket?.remoteAddress ||
      (request as any).connection?.remoteAddress;

    if (connectionIp && this.isValidIp(connectionIp)) {
      return connectionIp;
    }

    this.logger.warn('Unable to determine client IP address', {
      headers: {
        'x-forwarded-for': forwardedFor,
        'x-real-ip': realIp,
      },
      connectionIp,
    });

    return 'unknown';
  }

  /**
   * Extract IP address with additional metadata
   *
   * @param request - Express request object
   * @returns IP address with metadata about extraction method
   */
  static extractIpAddressWithMetadata(request: Request): {
    ip: string;
    source: 'x-forwarded-for' | 'x-real-ip' | 'direct' | 'unknown';
    proxied: boolean;
  } {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = (typeof forwardedFor === 'string' ? forwardedFor : forwardedFor[0])
        .split(',')
        .map((ip: string) => ip.trim());

      if (ips.length > 0 && this.isValidIp(ips[0])) {
        return {
          ip: ips[0],
          source: 'x-forwarded-for',
          proxied: true,
        };
      }
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      const ip = typeof realIp === 'string' ? realIp : realIp[0];
      if (this.isValidIp(ip)) {
        return {
          ip,
          source: 'x-real-ip',
          proxied: true,
        };
      }
    }

    const connectionIp =
      request.ip ||
      request.socket?.remoteAddress ||
      (request as any).connection?.remoteAddress;

    if (connectionIp && this.isValidIp(connectionIp)) {
      return {
        ip: connectionIp,
        source: 'direct',
        proxied: false,
      };
    }

    return {
      ip: 'unknown',
      source: 'unknown',
      proxied: false,
    };
  }

  /**
   * Validate IP address format (IPv4 or IPv6)
   *
   * @param ip - IP address string to validate
   * @returns true if valid IPv4 or IPv6 address
   */
  private static isValidIp(ip: string): boolean {
    if (!ip || ip === 'unknown') {
      return false;
    }

    // Remove IPv6 prefix if present (::ffff:192.168.1.1 → 192.168.1.1)
    const cleanIp = ip.replace(/^::ffff:/, '');

    // IPv4 regex
    const ipv4Regex =
      /^(\d{1,3}\.){3}\d{1,3}$/;

    // IPv6 regex (simplified)
    const ipv6Regex =
      /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^::1$|^fe80::/;

    return ipv4Regex.test(cleanIp) || ipv6Regex.test(ip);
  }

  /**
   * Check if IP address is from a private network
   *
   * @param ip - IP address to check
   * @returns true if private IP (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
   */
  static isPrivateIp(ip: string): boolean {
    if (!ip || ip === 'unknown') {
      return false;
    }

    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) {
      return false; // Not IPv4
    }

    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) {
      return true;
    }

    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
      return true;
    }

    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) {
      return true;
    }

    // 127.0.0.0 - 127.255.255.255 (loopback)
    if (parts[0] === 127) {
      return true;
    }

    return false;
  }

  /**
   * Anonymize IP address for logging (GDPR/privacy compliance)
   *
   * @param ip - IP address to anonymize
   * @param keepOctets - Number of octets to keep (default: 2)
   * @returns Anonymized IP address (e.g., 192.168.xxx.xxx)
   *
   * @example
   * IpExtractionUtil.anonymizeIp('192.168.1.1'); // Returns: '192.168.xxx.xxx'
   * IpExtractionUtil.anonymizeIp('192.168.1.1', 3); // Returns: '192.168.1.xxx'
   */
  static anonymizeIp(ip: string, keepOctets: number = 2): string {
    if (!ip || ip === 'unknown') {
      return 'unknown';
    }

    const parts = ip.split('.');
    if (parts.length !== 4) {
      return ip; // Not IPv4, return as-is
    }

    const anonymized = parts.map((part, index) =>
      index < keepOctets ? part : 'xxx'
    );

    return anonymized.join('.');
  }
}
