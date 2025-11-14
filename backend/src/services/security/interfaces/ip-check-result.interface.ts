import { IPRestrictionRule } from './ip-restriction-rule.interface';

/**
 * IP Check Result Interface
 * Result of IP address access validation
 */
export interface IPCheckResult {
  allowed: boolean;
  reason?: string;
  matchedRule?: IPRestrictionRule;
  location?: {
    country: string;
    city: string;
    region: string;
  } | null;
}
