/**
 * Connection Confirmed DTO
 *
 * Data Transfer Object sent to clients upon successful WebSocket connection.
 * Provides connection metadata and confirmation details.
 *
 * @class ConnectionConfirmedDto
 */
export class ConnectionConfirmedDto {
  /**
   * Unique socket identifier
   */
  socketId: string;

  /**
   * Authenticated user identifier
   */
  userId: string;

  /**
   * Organization identifier
   */
  organizationId: string;

  /**
   * ISO timestamp of connection establishment
   */
  connectedAt: string;

  constructor(partial: Partial<ConnectionConfirmedDto>) {
    Object.assign(this, partial);
  }
}
