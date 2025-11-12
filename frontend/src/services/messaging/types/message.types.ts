/**
 * @fileoverview Message Type Definitions
 * @module services/messaging/types/message
 * @category Services
 *
 * Type definitions for healthcare messaging system messages, including
 * message lifecycle, delivery tracking, and search capabilities.
 *
 * **Message Status Flow:**
 * 1. **sending**: Client submitting message to server
 * 2. **sent**: Server acknowledged and stored message
 * 3. **delivered**: Message delivered to recipient's device
 * 4. **read**: Recipient has viewed the message
 * 5. **failed**: Message delivery failed, requires retry
 *
 * @see {@link module:services/messaging/messageApi} for message operations
 */

/**
 * Message Data Transfer Object
 *
 * Represents a message in a healthcare conversation with full delivery tracking,
 * encryption metadata, and PHI protection features.
 *
 * **Message Status Flow:**
 * - `sending`: Message being sent to server
 * - `sent`: Server confirmed receipt and storage
 * - `delivered`: Delivered to recipient's device
 * - `read`: Recipient viewed the message
 * - `failed`: Delivery failed, may require retry
 *
 * **Healthcare Considerations:**
 * - Messages may contain PHI and should be encrypted when `metadata.encrypted` is true
 * - All timestamps are ISO 8601 for audit compliance
 * - Status transitions are tracked for delivery confirmation
 * - Reply threads maintain conversation context
 *
 * @interface MessageDto
 * @property {string} id - Unique message identifier (server-assigned)
 * @property {string} [_tempId] - Temporary client-side ID for optimistic updates before server response
 * @property {string} conversationId - Parent conversation identifier
 * @property {string} senderId - User ID of message sender
 * @property {string} content - Message content (encrypted if metadata.encrypted is true)
 * @property {'text' | 'image' | 'file' | 'system'} type - Message content type
 * @property {'sending' | 'sent' | 'delivered' | 'read' | 'failed'} status - Current delivery status
 * @property {object} [metadata] - Optional message metadata
 * @property {string} [metadata.fileName] - Filename for file/image messages
 * @property {number} [metadata.fileSize] - File size in bytes for file/image messages
 * @property {string} [metadata.fileUrl] - URL to access file/image content
 * @property {boolean} [metadata.encrypted] - Whether message content is end-to-end encrypted
 * @property {string} [replyTo] - Message ID being replied to (for threading)
 * @property {string} createdAt - ISO 8601 timestamp when message was created
 * @property {string} [updatedAt] - ISO 8601 timestamp of last update
 * @property {string} [deliveredAt] - ISO 8601 timestamp when delivered to recipient
 * @property {string} [readAt] - ISO 8601 timestamp when read by recipient
 *
 * @example
 * ```typescript
 * // Text message with delivery tracking
 * const textMessage: MessageDto = {
 *   id: 'msg-123',
 *   conversationId: 'conv-456',
 *   senderId: 'nurse-789',
 *   content: 'Patient BP: 120/80, stable',
 *   type: 'text',
 *   status: 'read',
 *   createdAt: '2025-11-05T10:30:00Z',
 *   deliveredAt: '2025-11-05T10:30:02Z',
 *   readAt: '2025-11-05T10:31:00Z'
 * };
 *
 * // Encrypted message with PHI
 * const encryptedMessage: MessageDto = {
 *   id: 'msg-124',
 *   conversationId: 'conv-456',
 *   senderId: 'doctor-101',
 *   content: '<encrypted-base64-content>',
 *   type: 'text',
 *   status: 'delivered',
 *   metadata: { encrypted: true },
 *   createdAt: '2025-11-05T10:32:00Z',
 *   deliveredAt: '2025-11-05T10:32:01Z'
 * };
 *
 * // File message
 * const fileMessage: MessageDto = {
 *   id: 'msg-125',
 *   conversationId: 'conv-456',
 *   senderId: 'nurse-789',
 *   content: 'Patient chart attachment',
 *   type: 'file',
 *   status: 'sent',
 *   metadata: {
 *     fileName: 'patient-chart.pdf',
 *     fileSize: 245760,
 *     fileUrl: 'https://storage.example.com/files/patient-chart.pdf',
 *     encrypted: true
 *   },
 *   createdAt: '2025-11-05T10:35:00Z'
 * };
 * ```
 *
 * @see {@link CreateMessageDto} for creating new messages
 * @see {@link UpdateMessageDto} for updating message status/content
 */
export interface MessageDto {
  id: string;
  _tempId?: string; // Temporary ID for optimistic updates before server response
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    encrypted?: boolean;
  };
  replyTo?: string;
  createdAt: string;
  updatedAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

/**
 * Create Message Data Transfer Object
 *
 * Input data for creating a new message in a conversation. The server assigns
 * the message ID, timestamps, and initial status.
 *
 * **Content Requirements:**
 * - Content cannot be empty
 * - Maximum length typically 10,000 characters
 * - File/image messages should include metadata
 *
 * **Healthcare Security:**
 * - Content will be encrypted if conversation has encryption enabled
 * - PHI should only be sent in encrypted conversations
 * - File uploads must be validated and scanned
 *
 * @interface CreateMessageDto
 * @property {string} conversationId - Target conversation identifier
 * @property {string} content - Message content (text or file description)
 * @property {'text' | 'image' | 'file'} [type='text'] - Message type (defaults to text)
 * @property {string} [replyTo] - Message ID being replied to (for threading)
 * @property {object} [metadata] - Optional message metadata
 * @property {string} [metadata.fileName] - Filename for file/image uploads
 * @property {number} [metadata.fileSize] - File size in bytes
 * @property {string} [metadata.fileUrl] - Pre-uploaded file URL
 *
 * @example
 * ```typescript
 * // Simple text message
 * const textMessage: CreateMessageDto = {
 *   conversationId: 'conv-123',
 *   content: 'Patient vitals stable',
 *   type: 'text'
 * };
 *
 * // Reply to previous message
 * const reply: CreateMessageDto = {
 *   conversationId: 'conv-123',
 *   content: 'Acknowledged, will monitor',
 *   replyTo: 'msg-456'
 * };
 *
 * // File message with metadata
 * const fileMessage: CreateMessageDto = {
 *   conversationId: 'conv-123',
 *   content: 'Patient lab results attached',
 *   type: 'file',
 *   metadata: {
 *     fileName: 'lab-results.pdf',
 *     fileSize: 524288,
 *     fileUrl: 'https://storage.example.com/uploads/lab-results.pdf'
 *   }
 * };
 * ```
 *
 * @see {@link MessageDto} for the complete message structure after creation
 */
export interface CreateMessageDto {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  replyTo?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
  };
}

/**
 * Update Message Data Transfer Object
 *
 * Input data for updating an existing message. Supports content edits and status updates.
 *
 * **Update Restrictions:**
 * - Only message sender can edit content
 * - Status updates follow the progression: sent → delivered → read
 * - Cannot update system messages
 * - Edit history may be tracked for audit compliance
 *
 * **Healthcare Compliance:**
 * - Message edits are logged for audit trail
 * - Original content may be retained per retention policy
 * - Status updates confirm secure delivery of PHI
 *
 * @interface UpdateMessageDto
 * @property {string} [content] - Updated message content (for edits)
 * @property {'sent' | 'delivered' | 'read' | 'failed'} [status] - Updated delivery status
 *
 * @example
 * ```typescript
 * // Edit message content
 * const editContent: UpdateMessageDto = {
 *   content: 'Patient BP: 130/85 (corrected)'
 * };
 *
 * // Mark as delivered
 * const markDelivered: UpdateMessageDto = {
 *   status: 'delivered'
 * };
 *
 * // Mark as read
 * const markRead: UpdateMessageDto = {
 *   status: 'read'
 * };
 * ```
 *
 * @see {@link MessageDto} for the updated message structure
 */
export interface UpdateMessageDto {
  content?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

/**
 * Message Search Parameters
 *
 * Query parameters for searching messages across conversations. Supports
 * full-text search, filtering, and pagination.
 *
 * **Search Capabilities:**
 * - Full-text search across message content
 * - Filter by conversation, sender, or date range
 * - Pagination for large result sets
 * - Case-insensitive search
 *
 * **Healthcare Considerations:**
 * - Search respects user access permissions
 * - Only searches conversations user is participant in
 * - Encrypted messages may have limited searchability
 * - Search queries may be logged for audit compliance
 *
 * @interface MessageSearchParams
 * @property {string} query - Search query string (minimum 2 characters)
 * @property {string} [conversationId] - Limit search to specific conversation
 * @property {string} [senderId] - Filter by message sender
 * @property {string} [startDate] - ISO 8601 date to search from (inclusive)
 * @property {string} [endDate] - ISO 8601 date to search to (inclusive)
 * @property {number} [page=1] - Page number for pagination
 * @property {number} [limit=20] - Results per page
 *
 * @example
 * ```typescript
 * // Search all conversations
 * const simpleSearch: MessageSearchParams = {
 *   query: 'blood pressure'
 * };
 *
 * // Search specific conversation with date range
 * const detailedSearch: MessageSearchParams = {
 *   query: 'medication',
 *   conversationId: 'conv-123',
 *   startDate: '2025-11-01T00:00:00Z',
 *   endDate: '2025-11-05T23:59:59Z',
 *   page: 1,
 *   limit: 50
 * };
 *
 * // Search by sender
 * const senderSearch: MessageSearchParams = {
 *   query: 'vitals',
 *   senderId: 'nurse-456'
 * };
 * ```
 */
export interface MessageSearchParams {
  query: string;
  conversationId?: string;
  senderId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
