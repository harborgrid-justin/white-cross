/**
 * Valid relationship types for emergency contacts
 * Defines allowed relationships to ensure data consistency
 */
export const VALID_RELATIONSHIPS = [
  'PARENT',
  'GUARDIAN',
  'SIBLING',
  'GRANDPARENT',
  'AUNT_UNCLE',
  'FAMILY_FRIEND',
  'NEIGHBOR',
  'OTHER'
] as const;

/**
 * Type definition for relationship types
 */
export type RelationshipType = typeof VALID_RELATIONSHIPS[number];
