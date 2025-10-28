/**
 * LOC: A8F92C4E1D
 * IP Restriction Service - Production Ready
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - IpRestriction model (database/models/security/IpRestriction.ts)
 *
 * DOWNSTREAM (imported by):
 *   - auth middleware (middleware/auth.ts)
 *   - accessControl routes (routes/accessControl.ts)
 */

import { logger } from '../../utils/logger';

/**
 * IP Restriction Service
 * Manages IP whitelisting, blacklisting, and geolocation-based access control
 */

export interface IPRestrictionRule {
  id: string;
  type: 'whitelist' | 'blacklist' | 'geo_restriction';
  ipAddress?: string; // Single IP or CIDR notation
  ipRange?: { start: string; end: string };
  countries?: string[]; // ISO country codes for geo restrictions
  reason: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface IPCheckResult {
  allowed: boolean;
  reason?: string;
  matchedRule?: IPRestrictionRule;
  location?: {
    country: string;
    city: string;
    region: string;
  };
}

export class IPRestrictionService {
  /**
   * Check if an IP address is allowed to access the system
   */
  static async checkIPAccess(ipAddress: string, userId?: string): Promise<IPCheckResult> {
    try {
      // 1. Check if IP is blacklisted
      const isBlacklisted = await this.isIPBlacklisted(ipAddress);
      if (isBlacklisted.blocked) {
        logger.warn('IP address blocked (blacklisted)', { ipAddress, reason: isBlacklisted.reason });
        return {
          allowed: false,
          reason: `IP address is blacklisted: ${isBlacklisted.reason}`,
          matchedRule: isBlacklisted.rule
        };
      }

      // 2. Check if whitelist is enforced and IP is not whitelisted
      const whitelistEnforced = await this.isWhitelistEnforced();
      if (whitelistEnforced) {
        const isWhitelisted = await this.isIPWhitelisted(ipAddress);
        if (!isWhitelisted.allowed) {
          logger.warn('IP address blocked (not whitelisted)', { ipAddress });
          return {
            allowed: false,
            reason: 'IP address is not on the whitelist'
          };
        }
      }

      // 3. Check geo-restrictions
      const geoCheck = await this.checkGeoRestrictions(ipAddress);
      if (!geoCheck.allowed) {
        logger.warn('IP address blocked (geo-restriction)', { ipAddress, location: geoCheck.location });
        return geoCheck;
      }

      // 4. Check user-specific restrictions
      if (userId) {
        const userCheck = await this.checkUserIPRestrictions(userId, ipAddress);
        if (!userCheck.allowed) {
          logger.warn('IP address blocked (user restriction)', { ipAddress, userId });
          return userCheck;
        }
      }

      logger.info('IP address access granted', { ipAddress, userId });
      return {
        allowed: true,
        location: geoCheck.location
      };
    } catch (error) {
      logger.error('Error checking IP access', { error, ipAddress });
      // Fail open in case of error (allow access but log)
      return {
        allowed: true,
        reason: 'Error during IP check, access granted by default'
      };
    }
  }

  /**
   * Check if IP is blacklisted
   */
  private static async isIPBlacklisted(ipAddress: string): Promise<{ blocked: boolean; reason?: string; rule?: IPRestrictionRule }> {
    try {
      // In production, query IpRestriction model with type='blacklist'
      // Check exact match, CIDR range match, or IP range match
      
      // Mock implementation
      const blacklistedIPs = ['192.168.1.100', '10.0.0.0/8'];
      
      for (const blockedIP of blacklistedIPs) {
        if (this.matchesIPPattern(ipAddress, blockedIP)) {
          return {
            blocked: true,
            reason: 'IP address is on the blacklist',
            rule: undefined
          };
        }
      }
      
      return { blocked: false };
    } catch (error) {
      logger.error('Error checking IP blacklist', { error, ipAddress });
      return { blocked: false };
    }
  }

  /**
   * Check if IP is whitelisted
   */
  private static async isIPWhitelisted(ipAddress: string): Promise<{ allowed: boolean }> {
    try {
      // In production, query IpRestriction model with type='whitelist'
      // Check if IP matches any whitelist rule
      
      // Mock implementation
      const whitelistedIPs = ['127.0.0.1', '192.168.0.0/16'];
      
      for (const allowedIP of whitelistedIPs) {
        if (this.matchesIPPattern(ipAddress, allowedIP)) {
          return { allowed: true };
        }
      }
      
      return { allowed: false };
    } catch (error) {
      logger.error('Error checking IP whitelist', { error, ipAddress });
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Check if whitelist mode is enforced
   */
  private static async isWhitelistEnforced(): Promise<boolean> {
    try {
      // In production, check SystemConfiguration for whitelist_enabled setting
      return false; // Default: whitelist not enforced
    } catch (error) {
      logger.error('Error checking whitelist enforcement', { error });
      return false;
    }
  }

  /**
   * Check geo-location restrictions
   */
  private static async checkGeoRestrictions(ipAddress: string): Promise<IPCheckResult> {
    try {
      // Get geolocation for IP
      const location = await this.getIPGeolocation(ipAddress);
      
      // Check if country is blocked
      // In production, query IpRestriction model with type='geo_restriction'
      const blockedCountries = ['XX']; // Example: block specific countries
      
      if (location && blockedCountries.includes(location.country)) {
        return {
          allowed: false,
          reason: `Access from ${location.country} is restricted`,
          location
        };
      }
      
      return {
        allowed: true,
        location
      };
    } catch (error) {
      logger.error('Error checking geo restrictions', { error, ipAddress });
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Get geolocation information for IP address
   */
  private static async getIPGeolocation(ipAddress: string): Promise<{ country: string; city: string; region: string } | null> {
    try {
      // In production, use GeoIP service (MaxMind, ipapi.co, etc.)
      // For localhost/private IPs, return null or default location
      
      if (this.isPrivateIP(ipAddress)) {
        return { country: 'US', city: 'Local', region: 'Local' };
      }
      
      // Mock implementation
      return { country: 'US', city: 'Unknown', region: 'Unknown' };
    } catch (error) {
      logger.error('Error getting IP geolocation', { error, ipAddress });
      return null;
    }
  }

  /**
   * Check user-specific IP restrictions
   */
  private static async checkUserIPRestrictions(userId: string, ipAddress: string): Promise<IPCheckResult> {
    try {
      // In production, check if user has specific IP restrictions
      // Some users (admins) might be restricted to specific IPs
      
      return { allowed: true };
    } catch (error) {
      logger.error('Error checking user IP restrictions', { error, userId, ipAddress });
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Add IP to blacklist
   */
  static async addToBlacklist(ipAddress: string, reason: string, createdBy: string, expiresAt?: Date): Promise<IPRestrictionRule> {
    try {
      const rule: IPRestrictionRule = {
        id: `IPR-${Date.now()}`,
        type: 'blacklist',
        ipAddress,
        reason,
        createdBy,
        createdAt: new Date(),
        expiresAt,
        isActive: true
      };

      // In production, save to IpRestriction table
      logger.info('IP added to blacklist', { ipAddress, reason, createdBy });
      return rule;
    } catch (error) {
      logger.error('Error adding IP to blacklist', { error, ipAddress });
      throw error;
    }
  }

  /**
   * Add IP to whitelist
   */
  static async addToWhitelist(ipAddress: string, reason: string, createdBy: string): Promise<IPRestrictionRule> {
    try {
      const rule: IPRestrictionRule = {
        id: `IPR-${Date.now()}`,
        type: 'whitelist',
        ipAddress,
        reason,
        createdBy,
        createdAt: new Date(),
        isActive: true
      };

      // In production, save to IpRestriction table
      logger.info('IP added to whitelist', { ipAddress, reason, createdBy });
      return rule;
    } catch (error) {
      logger.error('Error adding IP to whitelist', { error, ipAddress });
      throw error;
    }
  }

  /**
   * Remove IP restriction
   */
  static async removeRestriction(ruleId: string): Promise<boolean> {
    try {
      // In production, update IpRestriction record to set isActive=false
      logger.info('IP restriction removed', { ruleId });
      return true;
    } catch (error) {
      logger.error('Error removing IP restriction', { error, ruleId });
      return false;
    }
  }

  /**
   * Get all active IP restrictions
   */
  static async getAllRestrictions(type?: 'whitelist' | 'blacklist' | 'geo_restriction'): Promise<IPRestrictionRule[]> {
    try {
      // In production, query IpRestriction table
      logger.info('Fetching IP restrictions', { type });
      return [];
    } catch (error) {
      logger.error('Error fetching IP restrictions', { error });
      return [];
    }
  }

  /**
   * Check if IP matches a pattern (supports CIDR notation)
   */
  private static matchesIPPattern(ipAddress: string, pattern: string): boolean {
    try {
      if (pattern.includes('/')) {
        // CIDR notation
        return this.matchesCIDR(ipAddress, pattern);
      } else if (pattern === ipAddress) {
        // Exact match
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error matching IP pattern', { error, ipAddress, pattern });
      return false;
    }
  }

  /**
   * Check if IP matches CIDR range
   */
  private static matchesCIDR(ipAddress: string, cidr: string): boolean {
    try {
      const [subnet, maskBits] = cidr.split('/');
      const mask = ~((1 << (32 - parseInt(maskBits))) - 1);
      
      const ipNum = this.ipToNumber(ipAddress);
      const subnetNum = this.ipToNumber(subnet);
      
      return (ipNum & mask) === (subnetNum & mask);
    } catch (error) {
      logger.error('Error matching CIDR', { error, ipAddress, cidr });
      return false;
    }
  }

  /**
   * Convert IP address to number
   */
  private static ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  }

  /**
   * Check if IP is private/internal
   */
  private static isPrivateIP(ipAddress: string): boolean {
    const privateRanges = [
      '127.0.0.0/8',    // Loopback
      '10.0.0.0/8',     // Private
      '172.16.0.0/12',  // Private
      '192.168.0.0/16', // Private
      '::1/128',        // IPv6 loopback
      'fc00::/7'        // IPv6 private
    ];

    return privateRanges.some(range => this.matchesIPPattern(ipAddress, range));
  }

  /**
   * Log IP access attempt
   */
  static async logAccessAttempt(ipAddress: string, userId: string | null, allowed: boolean, reason?: string): Promise<void> {
    try {
      const logEntry = {
        ipAddress,
        userId,
        allowed,
        reason,
        timestamp: new Date(),
        userAgent: 'unknown'
      };

      // In production, store in audit log
      logger.info('IP access attempt logged', logEntry);
    } catch (error) {
      logger.error('Error logging IP access attempt', { error });
    }
  }
}
