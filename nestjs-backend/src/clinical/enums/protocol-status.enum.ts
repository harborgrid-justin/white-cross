/**
 * Clinical Protocol Status Enum
 * Represents the activation status of clinical protocols
 */
export enum ProtocolStatus {
  /** Protocol is in draft mode */
  DRAFT = 'draft',

  /** Protocol is active and can be used */
  ACTIVE = 'active',

  /** Protocol is inactive/archived */
  INACTIVE = 'inactive',

  /** Protocol is under review for updates */
  UNDER_REVIEW = 'under_review',

  /** Protocol has been deprecated */
  DEPRECATED = 'deprecated',
}
