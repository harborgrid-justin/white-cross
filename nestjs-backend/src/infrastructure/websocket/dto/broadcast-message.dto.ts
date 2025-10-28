/**
 * Broadcast Message DTO
 *
 * Generic Data Transfer Object for WebSocket broadcast messages.
 * Ensures all broadcast messages include a timestamp for event ordering.
 *
 * @class BroadcastMessageDto
 */
export class BroadcastMessageDto {
  /**
   * Message payload data (structure varies by event type)
   */
  [key: string]: any;

  /**
   * ISO timestamp when the message was created
   */
  timestamp: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
    this.timestamp = new Date().toISOString();
  }
}
