/**
 * @fileoverview Conversation Type Definitions
 * @module services/messaging/types/conversation
 * @category Services
 *
 * Type definitions for healthcare conversation management, including
 * conversation types, participant management, and filtering capabilities.
 *
 * **Conversation Types:**
 * - **direct**: One-on-one conversation between two users
 * - **group**: Private group with multiple participants
 * - **channel**: Broadcast channel (one-to-many communication)
 *
 * @see {@link module:services/messaging/conversationApi} for conversation operations
 */

import type { MessageDto } from './message.types';

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
