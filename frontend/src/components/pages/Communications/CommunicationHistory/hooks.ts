/**
 * Custom hooks for Communication History components
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CommunicationRecord, HistoryFilters } from './types';
import { filterAndSortCommunications } from './utils';

/**
 * Mock communication data - replace with actual API calls
 */
const mockCommunications: CommunicationRecord[] = [
  {
    id: '1',
    type: 'email',
    subject: 'Appointment Reminder - Sarah Johnson',
    content: 'Dear Mrs. Johnson,\n\nThis is a reminder that Sarah has an appointment scheduled for tomorrow at 2:00 PM.\n\nPlease ensure she arrives 15 minutes early.\n\nBest regards,\nWellness Center',
    sender: {
      id: 'nurse-1',
      name: 'Lisa Chen',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: 'parent-1',
        name: 'Mary Johnson',
        email: 'mary.johnson@email.com',
        relationship: 'Mother'
      }
    ],
    status: 'read',
    priority: 'medium',
    category: 'appointment',
    thread_id: 'thread-1',
    metadata: {
      student_id: 'student-1',
      student_name: 'Sarah Johnson',
      template_id: 'template-1',
      read_at: '2024-03-25T10:30:00Z'
    },
    created_at: '2024-03-25T08:00:00Z',
    updated_at: '2024-03-25T10:30:00Z'
  },
  {
    id: '2',
    type: 'sms',
    content: 'Sarah received her medication (Albuterol 2 puffs) at 11:45 AM. Administered by Nurse Chen. Any concerns? Reply STOP to opt out.',
    sender: {
      id: 'nurse-1',
      name: 'Lisa Chen',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: 'parent-1',
        name: 'Mary Johnson',
        phone: '(555) 123-4567',
        relationship: 'Mother'
      }
    ],
    status: 'delivered',
    priority: 'high',
    category: 'medication',
    metadata: {
      student_id: 'student-1',
      student_name: 'Sarah Johnson',
      delivery_provider: 'Twilio',
      delivery_attempts: 1
    },
    created_at: '2024-03-25T11:45:00Z',
    updated_at: '2024-03-25T11:46:00Z'
  },
  {
    id: '3',
    type: 'phone',
    content: 'Emergency call regarding Michael\'s allergic reaction. Parents notified and student transported to hospital.',
    sender: {
      id: 'nurse-2',
      name: 'Robert Davis',
      role: 'Head Nurse'
    },
    recipients: [
      {
        id: 'parent-2',
        name: 'David Smith',
        phone: '(555) 987-6543',
        relationship: 'Father'
      }
    ],
    status: 'sent',
    priority: 'urgent',
    category: 'emergency',
    metadata: {
      student_id: 'student-2',
      student_name: 'Michael Smith'
    },
    created_at: '2024-03-24T14:20:00Z',
    updated_at: '2024-03-24T14:25:00Z'
  },
  {
    id: '4',
    type: 'email',
    subject: 'Monthly Health Summary - Emma Wilson',
    content: 'Dear Mr. Wilson,\n\nPlease find attached Emma\'s monthly health summary for March 2024.\n\nBest regards,\nWellness Center',
    sender: {
      id: 'nurse-1',
      name: 'Lisa Chen',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: 'parent-3',
        name: 'John Wilson',
        email: 'john.wilson@email.com',
        relationship: 'Father'
      }
    ],
    status: 'failed',
    priority: 'low',
    category: 'routine',
    attachments: [
      {
        id: 'att-1',
        name: 'health_summary_march_2024.pdf',
        type: 'application/pdf',
        size: 245760
      }
    ],
    metadata: {
      student_id: 'student-3',
      student_name: 'Emma Wilson',
      delivery_attempts: 3
    },
    created_at: '2024-03-20T09:00:00Z',
    updated_at: '2024-03-20T09:15:00Z'
  }
];

/**
 * Hook for managing communication history data
 */
export interface UseCommunicationHistoryReturn {
  communications: CommunicationRecord[];
  isLoading: boolean;
  error: string | undefined;
  refetch: () => void;
}

export const useCommunicationHistory = (
  studentId?: string
): UseCommunicationHistoryReturn => {
  const [communications, setCommunications] = useState<CommunicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadCommunications = useCallback(() => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Simulate API call delay
      setTimeout(() => {
        let data = [...mockCommunications];

        // Filter by student if specified
        if (studentId) {
          data = data.filter(comm => comm.metadata.student_id === studentId);
        }

        setCommunications(data);
        setIsLoading(false);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load communications');
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadCommunications();
  }, [loadCommunications]);

  return {
    communications,
    isLoading,
    error,
    refetch: loadCommunications
  };
};

/**
 * Hook for managing history filters state and logic
 */
export interface UseHistoryFiltersReturn {
  filters: HistoryFilters;
  setFilter: <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) => void;
  clearFilters: () => void;
  getFilteredCommunications: (communications: CommunicationRecord[]) => CommunicationRecord[];
}

export const useHistoryFilters = (
  studentId?: string
): UseHistoryFiltersReturn => {
  const [filters, setFilters] = useState<HistoryFilters>({
    search: '',
    type: '',
    status: '',
    priority: '',
    category: '',
    sender: '',
    student: studentId || '',
    dateRange: {
      start: '',
      end: ''
    },
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const setFilter = useCallback(<K extends keyof HistoryFilters>(
    key: K,
    value: HistoryFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: '',
      status: '',
      priority: '',
      category: '',
      sender: '',
      student: studentId || '',
      dateRange: { start: '', end: '' },
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  }, [studentId]);

  const getFilteredCommunications = useCallback((communications: CommunicationRecord[]) => {
    return filterAndSortCommunications(communications, filters);
  }, [filters]);

  return {
    filters,
    setFilter,
    clearFilters,
    getFilteredCommunications
  };
};

/**
 * Hook for managing record selection state
 */
export interface UseRecordSelectionReturn {
  selectedRecords: Set<string>;
  toggleRecord: (id: string) => void;
  toggleAll: (records: CommunicationRecord[]) => void;
  clearSelection: () => void;
  isRecordSelected: (id: string) => boolean;
}

export const useRecordSelection = (): UseRecordSelectionReturn => {
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  const toggleRecord = useCallback((id: string) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback((records: CommunicationRecord[]) => {
    setSelectedRecords(prev => {
      if (prev.size === records.length) {
        return new Set();
      } else {
        return new Set(records.map(r => r.id));
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRecords(new Set());
  }, []);

  const isRecordSelected = useCallback((id: string) => {
    return selectedRecords.has(id);
  }, [selectedRecords]);

  return {
    selectedRecords,
    toggleRecord,
    toggleAll,
    clearSelection,
    isRecordSelected
  };
};
