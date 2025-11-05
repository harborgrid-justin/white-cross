/**
 * @fileoverview Messaging API Type Definitions for Healthcare Communications
 * @module services/messaging/types
 * @category Services
 *
 * Comprehensive type definitions for the healthcare messaging system supporting secure,
 * real-time communications between healthcare providers, staff, and patients.
 *
 * Key Features:
 * - **Message Types**: Text, image, file, and system messages
 * - **Delivery Tracking**: Send → Delivered → Read receipt workflow
 * - **Conversation Management**: Direct, group, and channel conversations
 * - **Encryption Support**: End-to-end encryption metadata for PHI protection
 * - **Search & Filtering**: Advanced message and conversation queries
 *
 * Healthcare Compliance:
 * - **HIPAA Compliant**: All messages can be encrypted for PHI protection
 * - **Audit Trail**: Timestamps track message lifecycle (created, delivered, read)
 * - **Access Control**: Participant-based conversation access
 * - **Data Retention**: Archival and deletion support for compliance
 *
 * Message Lifecycle:
 * 1. **sending**: Client submitting message to server
 * 2. **sent**: Server acknowledged and stored message
 * 3. **delivered**: Message delivered to recipient's device
 * 4. **read**: Recipient has viewed the message
 * 5. **failed**: Message delivery failed, requires retry
 *
 * @example
 * ```typescript
 * // Create and send a message
 * const newMessage: CreateMessageDto = {
 *   conversationId: 'conv-123',
 *   content: 'Patient vitals updated: BP 120/80',
 *   type: 'text'
 * };
 *
 * // Message with encryption
 * const encryptedMessage: MessageDto = {
 *   id: 'msg-456',
 *   conversationId: 'conv-123',
 *   senderId: 'user-789',
 *   content: '<encrypted-content>',
 *   type: 'text',
 *   status: 'delivered',
 *   metadata: { encrypted: true },
 *   createdAt: '2025-11-05T10:30:00Z'
 * };
 * ```
 *
 * @see {@link module:services/messaging/messageApi} for message operations
 * @see {@link module:services/messaging/conversationApi} for conversation operations
 * @see {@link module:services/messaging/encryptionApi} for encryption operations
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
 * Conversation Data Transfer Object
 *
 * Represents a messaging conversation (direct, group, or channel) with participant
 * information, preferences, and encryption settings.
 *
 * **Conversation Types:**
 * - **direct**: One-on-one conversation between two users
 * - **group**: Private group with multiple participants
 * - **channel**: Broadcast channel (one-to-many communication)
 *
 * **Healthcare Features:**
 * - Participant roles track healthcare professional types
 * - Encryption can be enabled for PHI-sensitive conversations
 * - Muting prevents non-urgent notifications
 * - Archiving supports data retention policies
 *
 * **State Management:**
 * - `isPinned`: Keep conversation at top of list
 * - `isMuted`: Suppress notifications
 * - `isArchived`: Hide from active list
 * - `unreadCount`: Track unread messages for current user
 *
 * @interface ConversationDto
 * @property {string} id - Unique conversation identifier
 * @property {'direct' | 'group' | 'channel'} type - Conversation type
 * @property {string} [name] - Conversation name (required for group/channel, omitted for direct)
 * @property {Array<object>} participants - Conversation participants
 * @property {string} participants[].id - Participant user ID
 * @property {string} participants[].name - Participant display name
 * @property {string} [participants[].avatar] - Participant avatar URL
 * @property {string} [participants[].role] - Healthcare role (e.g., "Nurse", "Doctor", "Admin")
 * @property {MessageDto} [lastMessage] - Most recent message in conversation
 * @property {number} unreadCount - Number of unread messages for current user
 * @property {boolean} isPinned - Whether conversation is pinned to top
 * @property {boolean} isMuted - Whether notifications are muted
 * @property {boolean} isArchived - Whether conversation is archived
 * @property {object} [metadata] - Optional conversation metadata
 * @property {string} [metadata.description] - Conversation description
 * @property {string} [metadata.avatar] - Group/channel avatar URL
 * @property {boolean} [metadata.encryptionEnabled] - Whether end-to-end encryption is enabled
 * @property {string} createdAt - ISO 8601 timestamp when conversation was created
 * @property {string} updatedAt - ISO 8601 timestamp of last update
 *
 * @example
 * ```typescript
 * // Direct conversation between nurse and doctor
 * const directConversation: ConversationDto = {
 *   id: 'conv-123',
 *   type: 'direct',
 *   participants: [
 *     { id: 'user-456', name: 'Dr. Smith', role: 'Doctor' },
 *     { id: 'user-789', name: 'Nurse Johnson', role: 'Nurse' }
 *   ],
 *   lastMessage: {
 *     id: 'msg-999',
 *     conversationId: 'conv-123',
 *     senderId: 'user-456',
 *     content: 'Patient ready for discharge',
 *     type: 'text',
 *     status: 'read',
 *     createdAt: '2025-11-05T14:30:00Z'
 *   },
 *   unreadCount: 0,
 *   isPinned: true,
 *   isMuted: false,
 *   isArchived: false,
 *   metadata: { encryptionEnabled: true },
 *   createdAt: '2025-11-01T09:00:00Z',
 *   updatedAt: '2025-11-05T14:30:00Z'
 * };
 *
 * // Group conversation for care team
 * const groupConversation: ConversationDto = {
 *   id: 'conv-456',
 *   type: 'group',
 *   name: 'Ward A Care Team',
 *   participants: [
 *     { id: 'user-101', name: 'Dr. Williams', role: 'Doctor' },
 *     { id: 'user-102', name: 'Nurse Davis', role: 'Nurse' },
 *     { id: 'user-103', name: 'Nurse Miller', role: 'Nurse' }
 *   ],
 *   unreadCount: 3,
 *   isPinned: false,
 *   isMuted: false,
 *   isArchived: false,
 *   metadata: {
 *     description: 'Coordination for Ward A patients',
 *     encryptionEnabled: true
 *   },
 *   createdAt: '2025-10-15T08:00:00Z',
 *   updatedAt: '2025-11-05T15:00:00Z'
 * };
 * ```
 *
 * @see {@link CreateConversationDto} for creating new conversations
 * @see {@link UpdateConversationDto} for updating conversation settings
 */
export interface ConversationDto {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  }>;
  lastMessage?: MessageDto;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  metadata?: {
    description?: string;
    avatar?: string;
    encryptionEnabled?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Conversation Data Transfer Object
 *
 * Input data for creating a new conversation. Validates participant requirements
 * and initializes conversation settings.
 *
 * **Creation Requirements:**
 * - At least one participant ID required (plus creator)
 * - Group/channel conversations require a name
 * - Direct conversations auto-generate name from participants
 * - Encryption must be enabled at creation (cannot be changed later for security)
 *
 * **Healthcare Security:**
 * - Consider enabling encryption for PHI-sensitive conversations
 * - Validate participant access permissions before creation
 * - All participants must have appropriate healthcare roles
 *
 * @interface CreateConversationDto
 * @property {'direct' | 'group' | 'channel'} type - Conversation type
 * @property {string} [name] - Conversation name (required for group/channel)
 * @property {string[]} participantIds - Array of user IDs to include (minimum 1, plus creator)
 * @property {object} [metadata] - Optional conversation metadata
 * @property {string} [metadata.description] - Conversation description or purpose
 * @property {string} [metadata.avatar] - Group/channel avatar URL
 * @property {boolean} [metadata.encryptionEnabled] - Enable end-to-end encryption (default: false)
 *
 * @example
 * ```typescript
 * // Create direct conversation with another user
 * const directChat: CreateConversationDto = {
 *   type: 'direct',
 *   participantIds: ['user-doctor-123']
 * };
 *
 * // Create encrypted group for care team
 * const careTeam: CreateConversationDto = {
 *   type: 'group',
 *   name: 'ICU Care Team',
 *   participantIds: ['user-nurse-456', 'user-doctor-789', 'user-specialist-101'],
 *   metadata: {
 *     description: 'Coordination for ICU patients',
 *     encryptionEnabled: true
 *   }
 * };
 *
 * // Create announcement channel
 * const announcements: CreateConversationDto = {
 *   type: 'channel',
 *   name: 'Hospital Announcements',
 *   participantIds: ['user-admin-555'],
 *   metadata: {
 *     description: 'Official hospital-wide announcements'
 *   }
 * };
 * ```
 *
 * @see {@link ConversationDto} for the created conversation structure
 */
export interface CreateConversationDto {
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participantIds: string[];
  metadata?: {
    description?: string;
    avatar?: string;
    encryptionEnabled?: boolean;
  };
}

/**
 * Update Conversation Data Transfer Object
 *
 * Input data for updating conversation settings and preferences.
 *
 * **Update Capabilities:**
 * - Change conversation name (group/channel only)
 * - Toggle pinned status for prioritization
 * - Mute/unmute notifications
 * - Archive/unarchive conversations
 * - Update description and avatar
 *
 * **Restrictions:**
 * - Cannot change conversation type after creation
 * - Cannot modify encryption settings after creation
 * - Cannot modify participant list (use dedicated participant methods)
 *
 * @interface UpdateConversationDto
 * @property {string} [name] - Updated conversation name (group/channel only)
 * @property {boolean} [isPinned] - Pin conversation to top of list
 * @property {boolean} [isMuted] - Mute notifications for this conversation
 * @property {boolean} [isArchived] - Archive conversation (hide from active list)
 * @property {object} [metadata] - Updated conversation metadata
 * @property {string} [metadata.description] - Updated description
 * @property {string} [metadata.avatar] - Updated avatar URL
 *
 * @example
 * ```typescript
 * // Pin important conversation
 * const pinUpdate: UpdateConversationDto = {
 *   isPinned: true
 * };
 *
 * // Mute non-urgent group
 * const muteUpdate: UpdateConversationDto = {
 *   isMuted: true
 * };
 *
 * // Update group details
 * const detailsUpdate: UpdateConversationDto = {
 *   name: 'Ward A Evening Shift',
 *   metadata: {
 *     description: 'Evening shift coordination for Ward A'
 *   }
 * };
 * ```
 *
 * @see {@link ConversationDto} for the updated conversation structure
 */
export interface UpdateConversationDto {
  name?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  metadata?: {
    description?: string;
    avatar?: string;
  };
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

/**
 * Encryption Key Data Transfer Object
 *
 * Represents a public encryption key for end-to-end encrypted conversations.
 * Keys are exchanged between participants to enable secure messaging.
 *
 * **Key Management:**
 * - Keys are conversation-specific
 * - Public keys are shared, private keys stay on client devices
 * - Key rotation is supported for enhanced security
 * - Algorithm specifies encryption method (e.g., RSA-2048, AES-256)
 *
 * **Healthcare Security:**
 * - Keys enable HIPAA-compliant PHI encryption
 * - Key IDs track which key version encrypted each message
 * - Server stores public keys only (zero-knowledge architecture)
 * - Key rotation ensures forward secrecy
 *
 * @interface EncryptionKeyDto
 * @property {string} conversationId - Conversation this key belongs to
 * @property {string} publicKey - Base64-encoded public key
 * @property {string} keyId - Unique key identifier for version tracking
 * @property {string} algorithm - Encryption algorithm (e.g., "RSA-2048", "AES-256-GCM")
 *
 * @example
 * ```typescript
 * const encryptionKey: EncryptionKeyDto = {
 *   conversationId: 'conv-123',
 *   publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
 *   keyId: 'key-v1-abc123',
 *   algorithm: 'RSA-2048'
 * };
 * ```
 *
 * @see {@link module:services/messaging/encryptionApi} for key management operations
 */
export interface EncryptionKeyDto {
  conversationId: string;
  publicKey: string;
  keyId: string;
  algorithm: string;
}

/**
 * Conversation Filters
 *
 * Query parameters for filtering and searching conversations.
 *
 * **Filtering Options:**
 * - Filter by conversation type
 * - Search conversation names
 * - Include/exclude archived conversations
 * - Pagination support
 *
 * **Default Behavior:**
 * - Shows active (non-archived) conversations only
 * - Ordered by last message time (most recent first)
 * - Default page size typically 20 conversations
 *
 * @interface ConversationFilters
 * @property {'direct' | 'group' | 'channel'} [type] - Filter by conversation type
 * @property {string} [search] - Search conversation names (case-insensitive)
 * @property {boolean} [showArchived=false] - Include archived conversations in results
 * @property {number} [page=1] - Page number for pagination
 * @property {number} [limit=20] - Results per page
 *
 * @example
 * ```typescript
 * // Get all group conversations
 * const groupFilter: ConversationFilters = {
 *   type: 'group'
 * };
 *
 * // Search conversations by name
 * const searchFilter: ConversationFilters = {
 *   search: 'care team',
 *   page: 1,
 *   limit: 50
 * };
 *
 * // Include archived conversations
 * const archivedFilter: ConversationFilters = {
 *   showArchived: true
 * };
 * ```
 */
export interface ConversationFilters {
  type?: 'direct' | 'group' | 'channel';
  search?: string;
  showArchived?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Unread Count Response
 *
 * Response containing unread message counts across all conversations.
 * Used for notification badges and conversation list indicators.
 *
 * **Count Calculation:**
 * - Only counts messages after user's last read timestamp
 * - Excludes muted conversations (configurable)
 * - Resets when user views conversation
 * - Updates in real-time via WebSocket
 *
 * **Healthcare Usage:**
 * - Helps prioritize urgent communications
 * - Critical for time-sensitive patient care coordination
 * - May differentiate between urgent and normal unread counts
 *
 * @interface UnreadCountResponse
 * @property {number} total - Total unread messages across all conversations
 * @property {Array<object>} byConversation - Unread counts per conversation
 * @property {string} byConversation[].conversationId - Conversation identifier
 * @property {number} byConversation[].count - Unread message count for this conversation
 *
 * @example
 * ```typescript
 * const unreadCounts: UnreadCountResponse = {
 *   total: 15,
 *   byConversation: [
 *     { conversationId: 'conv-123', count: 5 },
 *     { conversationId: 'conv-456', count: 3 },
 *     { conversationId: 'conv-789', count: 7 }
 *   ]
 * };
 *
 * // Display total badge
 * console.log(`You have ${unreadCounts.total} unread messages`);
 *
 * // Show per-conversation badges
 * unreadCounts.byConversation.forEach(conv => {
 *   console.log(`Conversation ${conv.conversationId}: ${conv.count} unread`);
 * });
 * ```
 */
export interface UnreadCountResponse {
  total: number;
  byConversation: Array<{
    conversationId: string;
    count: number;
  }>;
}
