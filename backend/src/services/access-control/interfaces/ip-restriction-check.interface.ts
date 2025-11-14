import { IpRestrictionType } from '../dto/create-ip-restriction.dto';

/**
 * Interface for IP restriction check result
 */
export interface IpRestrictionCheckResult {
  isRestricted: boolean;
  type?: IpRestrictionType;
  reason?: string;
}
