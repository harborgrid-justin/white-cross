/**
 * WF-COMP-317 | CommunicationThreads/types.ts - Communication thread types
 * Purpose: Type definitions for communication thread components
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Type safety for communication system
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Type definitions → Component props → State management → UI rendering
 * LLM Context: Types module for communication threads, part of modular architecture
 */

/**
 * Communication Threads Types Module
 * Comprehensive type definitions for threaded communication system
 * Used across all communication thread components for type safety
 */

/**
 * Message in a communication thread
 */
export interface ThreadMessage {
  id: string;
  thread_id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  message_type: 'text' | 'attachment' | 'system';
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
  }>;
  metadata: {
    delivery_status?: 'sent' | 'delivered' | 'read' | 'failed';
    read_at?: string;
    edited_at?: string;
    reply_to?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Thread participant information
 */
export interface ThreadParticipant {
  id: string;
  name: string;
  role: string;
  relationship?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  last_seen?: string;
}

/**
 * Communication thread
 */
export interface CommunicationThread {
  id: string;
  subject?: string;
  type: 'email' | 'sms' | 'chat' | 'mixed';
  participants: ThreadParticipant[];
  messages: ThreadMessage[];
  status: 'active' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'emergency' | 'routine' | 'appointment' | 'medication' | 'general';
  metadata: {
    student_id?: string;
    student_name?: string;
    unread_count: number;
    last_activity: string;
    created_by: string;
    auto_close_at?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Props for the main CommunicationThreads component
 */
export interface CommunicationThreadsProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Student ID to filter threads for specific student */
  studentId?: string;
  /** Thread ID to open specific thread */
  threadId?: string;
  /** Callback when thread is selected */
  onThreadSelect?: (thread: CommunicationThread) => void;
  /** Callback when message is sent */
  onMessageSent?: (threadId: string, message: string, attachments?: File[]) => void;
  /** Callback when thread is closed */
  onThreadClose?: (threadId: string) => void;
  /** Callback when thread is archived */
  onThreadArchive?: (threadId: string) => void;
}

/**
 * Props for ThreadList component
 */
export interface ThreadListProps {
  threads: CommunicationThread[];
  selectedThread: CommunicationThread | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onThreadSelect: (thread: CommunicationThread) => void;
  className?: string;
}

/**
 * Props for ChatArea component
 */
export interface ChatAreaProps {
  thread: CommunicationThread | null;
  onSendMessage: (message: string, attachments?: File[]) => void;
  onThreadClose?: (threadId: string) => void;
  onThreadArchive?: (threadId: string) => void;
  onBackClick: () => void;
  className?: string;
}

/**
 * Props for MessageInput component
 */
export interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Props for ThreadInfoSidebar component
 */
export interface ThreadInfoSidebarProps {
  thread: CommunicationThread;
  isOpen: boolean;
  onClose: () => void;
  onThreadClose?: (threadId: string) => void;
  onThreadArchive?: (threadId: string) => void;
  className?: string;
}

/**
 * Props for MessageBubble component
 */
export interface MessageBubbleProps {
  message: ThreadMessage;
  isFromCurrentUser: boolean;
  className?: string;
}

/**
 * Utility type for priority styling
 */
export type PriorityLevel = CommunicationThread['priority'];

/**
 * Utility type for status styling  
 */
export type ThreadStatus = CommunicationThread['status'];

/**
 * Utility type for message delivery status
 */
export type DeliveryStatus = ThreadMessage['metadata']['delivery_status'];

/**
 * Hook state for managing threads
 */
export interface UseThreadsState {
  threads: CommunicationThread[];
  selectedThread: CommunicationThread | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook actions for thread management
 */
export interface UseThreadsActions {
  loadThreads: (studentId?: string) => Promise<void>;
  selectThread: (thread: CommunicationThread) => void;
  sendMessage: (threadId: string, content: string, attachments?: File[]) => Promise<void>;
  closeThread: (threadId: string) => Promise<void>;
  archiveThread: (threadId: string) => Promise<void>;
  markAsRead: (threadId: string) => Promise<void>;
}

/**
 * Complete threads hook return type
 */
export type UseThreadsReturn = UseThreadsState & UseThreadsActions;
