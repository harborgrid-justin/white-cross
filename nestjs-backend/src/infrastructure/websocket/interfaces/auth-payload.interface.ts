/**
 * WebSocket Authentication Payload Interface
 *
 * Represents the JWT payload structure for authenticated WebSocket connections.
 * This interface ensures type safety for user data attached to WebSocket connections.
 *
 * @interface AuthPayload
 */
export interface AuthPayload {
  /**
   * Unique identifier for the user
   */
  userId: string;

  /**
   * Organization identifier for multi-tenant isolation
   */
  organizationId: string;

  /**
   * User's role within the organization
   */
  role: string;

  /**
   * User's email address
   */
  email: string;
}
