/**
 * IP Restriction Types
 * Defines how IP addresses are restricted or allowed
 */
export enum IpRestrictionType {
  WHITELIST = 'whitelist',
  BLACKLIST = 'blacklist',
  GEO_RESTRICTION = 'geo_restriction',
}
