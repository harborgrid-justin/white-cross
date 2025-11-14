import { IpRestrictionType } from '../enums/ip-restriction-type.enum';

/**
 * IP Restriction Rule Interface
 * Defines the structure of an IP restriction rule
 */
export interface IPRestrictionRule {
  id: string;
  type: IpRestrictionType;
  ipAddress?: string; // Single IP or CIDR notation
  ipRange?: { start: string; end: string };
  countries?: string[]; // ISO country codes for geo restrictions
  reason: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}
