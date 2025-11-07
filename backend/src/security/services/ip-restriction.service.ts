import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IpRestrictionEntity } from '../entities';
import { IpRestrictionType } from '../enums';
import { IPCheckResult, IPRestrictionRule } from '../interfaces';
import { SecurityCreateIpRestrictionDto, UpdateIpRestrictionDto } from '../dto';

/**
 * IP Restriction Service
 * Manages IP whitelisting, blacklisting, and geolocation-based access control
 */
@Injectable()
export class IpRestrictionService {
  private readonly logger = new Logger(IpRestrictionService.name);

  constructor(
    @InjectModel(IpRestrictionEntity)
    private readonly ipRestrictionModel: typeof IpRestrictionEntity,
  ) {}

  /**
   * Check if an IP address is allowed to access the system
   */
  async checkIPAccess(ipAddress: string, userId?: string): Promise<IPCheckResult> {
    try {
      // 1. Check if IP is blacklisted
      const isBlacklisted = await this.isIPBlacklisted(ipAddress);
      if (isBlacklisted.blocked) {
        this.logger.warn('IP address blocked (blacklisted)', {
          ipAddress,
          reason: isBlacklisted.reason,
        });
        return {
          allowed: false,
          reason: `IP address is blacklisted: ${isBlacklisted.reason}`,
          matchedRule: isBlacklisted.rule,
        };
      }

      // 2. Check if whitelist is enforced and IP is not whitelisted
      const whitelistEnforced = await this.isWhitelistEnforced();
      if (whitelistEnforced) {
        const isWhitelisted = await this.isIPWhitelisted(ipAddress);
        if (!isWhitelisted.allowed) {
          this.logger.warn('IP address blocked (not whitelisted)', {
            ipAddress,
          });
          return {
            allowed: false,
            reason: 'IP address is not on the whitelist',
          };
        }
      }

      // 3. Check geo-restrictions
      const geoCheck = await this.checkGeoRestrictions(ipAddress);
      if (!geoCheck.allowed) {
        this.logger.warn('IP address blocked (geo-restriction)', {
          ipAddress,
          location: geoCheck.location,
        });
        return geoCheck;
      }

      // 4. Check user-specific restrictions
      if (userId) {
        const userCheck = await this.checkUserIPRestrictions(userId, ipAddress);
        if (!userCheck.allowed) {
          this.logger.warn('IP address blocked (user restriction)', {
            ipAddress,
            userId,
          });
          return userCheck;
        }
      }

      this.logger.log('IP address access granted', { ipAddress, userId });
      return {
        allowed: true,
        location: geoCheck.location,
      };
    } catch (error) {
      this.logger.error('Error checking IP access', { error, ipAddress });
      // Fail open in case of error (allow access but log)
      return {
        allowed: true,
        reason: 'Error during IP check, access granted by default',
      };
    }
  }

  /**
   * Check if IP is blacklisted
   */
  private async isIPBlacklisted(ipAddress: string): Promise<{
    blocked: boolean;
    reason?: string;
    rule?: IPRestrictionRule;
  }> {
    try {
      const blacklistRules = await this.ipRestrictionModel.findAll({
        where: {
          type: IpRestrictionType.BLACKLIST,
          isActive: true,
        },
      });

      for (const rule of blacklistRules) {
        if (this.matchesRestriction(ipAddress, rule)) {
          return {
            blocked: true,
            reason: rule.reason,
            rule: this.entityToRule(rule),
          };
        }
      }

      return { blocked: false };
    } catch (error) {
      this.logger.error('Error checking IP blacklist', { error, ipAddress });
      return { blocked: false };
    }
  }

  /**
   * Check if IP is whitelisted
   */
  private async isIPWhitelisted(ipAddress: string): Promise<{
    allowed: boolean;
  }> {
    try {
      const whitelistRules = await this.ipRestrictionModel.findAll({
        where: {
          type: IpRestrictionType.WHITELIST,
          isActive: true,
        },
      });

      for (const rule of whitelistRules) {
        if (this.matchesRestriction(ipAddress, rule)) {
          return { allowed: true };
        }
      }

      return { allowed: false };
    } catch (error) {
      this.logger.error('Error checking IP whitelist', { error, ipAddress });
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Check if whitelist mode is enforced
   */
  private async isWhitelistEnforced(): Promise<boolean> {
    try {
      // In production, check SystemConfiguration for whitelist_enabled setting
      // For now, return false by default
      return false;
    } catch (error) {
      this.logger.error('Error checking whitelist enforcement', { error });
      return false;
    }
  }

  /**
   * Check geo-location restrictions
   */
  private async checkGeoRestrictions(ipAddress: string): Promise<IPCheckResult> {
    try {
      // Get geolocation for IP
      const location = await this.getIPGeolocation(ipAddress);

      // Check if country is blocked
      const geoRestrictions = await this.ipRestrictionModel.findAll({
        where: {
          type: IpRestrictionType.GEO_RESTRICTION,
          isActive: true,
        },
      });

      if (location) {
        for (const rule of geoRestrictions) {
          if (rule.countries?.includes(location.country)) {
            return {
              allowed: false,
              reason: `Access from ${location.country} is restricted`,
              location,
            };
          }
        }
      }

      return {
        allowed: true,
        location,
      };
    } catch (error) {
      this.logger.error('Error checking geo restrictions', {
        error,
        ipAddress,
      });
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Get geolocation information for IP address
   */
  private async getIPGeolocation(ipAddress: string): Promise<{
    country: string;
    city: string;
    region: string;
  } | null> {
    try {
      // In production, use GeoIP service (MaxMind, ipapi.co, etc.)
      // For localhost/private IPs, return null or default location

      if (this.isPrivateIP(ipAddress)) {
        return { country: 'US', city: 'Local', region: 'Local' };
      }

      // Mock implementation - integrate with actual GeoIP service
      return { country: 'US', city: 'Unknown', region: 'Unknown' };
    } catch (error) {
      this.logger.error('Error getting IP geolocation', { error, ipAddress });
      return null;
    }
  }

  /**
   * Check user-specific IP restrictions
   */
  private async checkUserIPRestrictions(userId: string, ipAddress: string): Promise<IPCheckResult> {
    try {
      // In production, check if user has specific IP restrictions
      // Some users (admins) might be restricted to specific IPs
      return { allowed: true };
    } catch (error) {
      this.logger.error('Error checking user IP restrictions', {
        error,
        userId,
        ipAddress,
      });
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Check if IP matches a restriction rule
   */
  private matchesRestriction(ipAddress: string, rule: IpRestrictionEntity): boolean {
    if (rule.ipAddress) {
      return this.matchesIPPattern(ipAddress, rule.ipAddress);
    }

    if (rule.ipRange) {
      return this.matchesIPRange(ipAddress, rule.ipRange.start, rule.ipRange.end);
    }

    return false;
  }

  /**
   * Check if IP matches a pattern (supports CIDR notation)
   */
  private matchesIPPattern(ipAddress: string, pattern: string): boolean {
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
      this.logger.error('Error matching IP pattern', {
        error,
        ipAddress,
        pattern,
      });
      return false;
    }
  }

  /**
   * Check if IP matches CIDR range
   */
  private matchesCIDR(ipAddress: string, cidr: string): boolean {
    try {
      const [subnet, maskBits] = cidr.split('/');
      const mask = ~((1 << (32 - parseInt(maskBits))) - 1);

      const ipNum = this.ipToNumber(ipAddress);
      const subnetNum = this.ipToNumber(subnet);

      return (ipNum & mask) === (subnetNum & mask);
    } catch (error) {
      this.logger.error('Error matching CIDR', { error, ipAddress, cidr });
      return false;
    }
  }

  /**
   * Check if IP is within a range
   */
  private matchesIPRange(ipAddress: string, startIP: string, endIP: string): boolean {
    try {
      const ipNum = this.ipToNumber(ipAddress);
      const startNum = this.ipToNumber(startIP);
      const endNum = this.ipToNumber(endIP);

      return ipNum >= startNum && ipNum <= endNum;
    } catch (error) {
      this.logger.error('Error matching IP range', { error, ipAddress });
      return false;
    }
  }

  /**
   * Convert IP address to number
   */
  private ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  }

  /**
   * Check if IP is private/internal
   */
  private isPrivateIP(ipAddress: string): boolean {
    const privateRanges = [
      '127.0.0.0/8', // Loopback
      '10.0.0.0/8', // Private
      '172.16.0.0/12', // Private
      '192.168.0.0/16', // Private
    ];

    return privateRanges.some((range) => this.matchesIPPattern(ipAddress, range));
  }

  /**
   * Add IP to blacklist
   */
  async addToBlacklist(dto: SecurityCreateIpRestrictionDto): Promise<IpRestrictionEntity> {
    try {
      const restriction = await this.ipRestrictionModel.create({
        ...dto,
        type: IpRestrictionType.BLACKLIST,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      });
      this.logger.log('IP added to blacklist', {
        ipAddress: dto.ipAddress,
        reason: dto.reason,
      });
      return restriction;
    } catch (error) {
      this.logger.error('Error adding IP to blacklist', { error, dto });
      throw error;
    }
  }

  /**
   * Add IP to whitelist
   */
  async addToWhitelist(dto: SecurityCreateIpRestrictionDto): Promise<IpRestrictionEntity> {
    try {
      const restriction = await this.ipRestrictionModel.create({
        ...dto,
        type: IpRestrictionType.WHITELIST,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      });
      this.logger.log('IP added to whitelist', {
        ipAddress: dto.ipAddress,
        reason: dto.reason,
      });
      return restriction;
    } catch (error) {
      this.logger.error('Error adding IP to whitelist', { error, dto });
      throw error;
    }
  }

  /**
   * Remove IP restriction
   */
  async removeRestriction(ruleId: string): Promise<boolean> {
    try {
      await this.ipRestrictionModel.update({ isActive: false }, { where: { id: ruleId } });
      this.logger.log('IP restriction removed', { ruleId });
      return true;
    } catch (error) {
      this.logger.error('Error removing IP restriction', { error, ruleId });
      return false;
    }
  }

  /**
   * Get all active IP restrictions
   */
  async getAllRestrictions(type?: IpRestrictionType): Promise<IpRestrictionEntity[]> {
    try {
      const where: any = { isActive: true };
      if (type) {
        where.type = type;
      }

      return await this.ipRestrictionModel.findAll({ where });
    } catch (error) {
      this.logger.error('Error fetching IP restrictions', { error });
      return [];
    }
  }

  /**
   * Update IP restriction
   */
  async updateRestriction(id: string, dto: UpdateIpRestrictionDto): Promise<IpRestrictionEntity> {
    const restriction = await this.ipRestrictionModel.findByPk(id);

    if (!restriction) {
      throw new Error('IP restriction not found');
    }

    Object.assign(restriction, dto);
    return await restriction.save();
  }

  /**
   * Convert entity to rule interface
   */
  private entityToRule(entity: IpRestrictionEntity): IPRestrictionRule {
    return {
      id: entity.id,
      type: entity.type,
      ipAddress: entity.ipAddress,
      ipRange: entity.ipRange,
      countries: entity.countries,
      reason: entity.reason,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      expiresAt: entity.expiresAt,
      isActive: entity.isActive,
    };
  }

  /**
   * Log IP access attempt
   */
  async logAccessAttempt(
    ipAddress: string,
    userId: string | null,
    allowed: boolean,
    reason?: string,
  ): Promise<void> {
    try {
      const logEntry = {
        ipAddress,
        userId,
        allowed,
        reason,
        timestamp: new Date(),
      };

      // In production, store in audit log
      this.logger.log('IP access attempt logged', logEntry);
    } catch (error) {
      this.logger.error('Error logging IP access attempt', { error });
    }
  }
}
