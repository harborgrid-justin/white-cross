/**
 * Broadcast Message DTO
 *
 * Generic Data Transfer Object for WebSocket broadcast messages.
 * Ensures all broadcast messages include a timestamp for event ordering.
 *
 * @class BroadcastMessageDto
 */

/**
 * Generic JSON-serializable value type
 * Represents any value that can be safely sent over WebSocket
 */
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

/**
 * JSON object type
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON array type
 */
export type JsonArray = JsonValue[];

export class BroadcastMessageDto {
  /**
   * Message payload data (structure varies by event type)
   * Accepts any JSON-serializable data
   */
  [key: string]: JsonValue;

  /**
   * ISO timestamp when the message was created
   */
  timestamp: string;

  constructor(data: JsonObject) {
    Object.assign(this, data);
    this.timestamp = new Date().toISOString();
  }
}
