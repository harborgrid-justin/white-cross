/**
 * Type definitions for Communication History components
 */

/**
 * Communication history record
 */
export interface CommunicationRecord {
  id: string;
  type: 'email' | 'sms' | 'phone' | 'chat';
  subject?: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    relationship?: string;
  }>;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'emergency' | 'routine' | 'appointment' | 'medication' | 'general';
  thread_id?: string;
  parent_id?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
  }>;
  metadata: {
    student_id?: string;
    student_name?: string;
    template_id?: string;
    scheduled_at?: string;
    delivery_attempts?: number;
    read_at?: string;
    delivery_provider?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Filter options for communication history
 */
export interface HistoryFilters {
  search: string;
  type: string;
  status: string;
  priority: string;
  category: string;
  sender: string;
  student: string;
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'created_at' | 'updated_at' | 'priority' | 'status';
  sortOrder: 'asc' | 'desc';
}

/**
 * Props for the CommunicationHistory component
 */
export interface CommunicationHistoryProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Student ID to filter communications for specific student */
  studentId?: string;
  /** Callback when communication is selected for viewing */
  onViewCommunication?: (record: CommunicationRecord) => void;
  /** Callback when communication is resent */
  onResendCommunication?: (recordId: string) => void;
  /** Callback when communication thread is opened */
  onOpenThread?: (threadId: string) => void;
}
