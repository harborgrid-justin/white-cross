/**
 * WF-COMP-317 | CommunicationThreads/index.tsx - Main communication threads component
 * Purpose: Main orchestrator component for threaded communications
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: CommunicationThreads component | Key Features: Thread management, messaging
 * Last Updated: 2025-11-11 | File Type: .tsx
 * Critical Path: Data loading → State management → Component orchestration → User interactions
 * LLM Context: Main communication threads orchestrator, refactored from monolithic component
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import ThreadList from './ThreadList';
import ChatArea from './ChatArea';
import type { 
  CommunicationThreadsProps, 
  CommunicationThread, 
  ThreadMessage 
} from './types';

/**
 * CommunicationThreads component for managing threaded conversations
 * 
 * This is the main orchestrator component that has been refactored from a monolithic
 * 893-line component into a modular architecture with focused responsibilities:
 * 
 * - ThreadList: Handles thread listing and search
 * - ChatArea: Manages message display and input
 * - MessageInput: Handles message composition
 * - Types: Centralized type definitions
 * 
 * Features:
 * - Real-time threaded conversations
 * - Multi-participant support (group conversations)
 * - Message delivery status tracking
 * - File attachment support
 * - Thread management (close, archive, priority)
 * - Unread message indicators
 * - Message search and filtering
 * - Auto-refresh and real-time updates
 * 
 * @component
 * @example
 * ```tsx
 * <CommunicationThreads
 *   studentId="student-123"
 *   threadId="thread-456"
 *   onThreadSelect={(thread) => handleThreadSelect(thread)}
 *   onMessageSent={(threadId, message) => handleMessageSent(threadId, message)}
 *   onThreadClose={(threadId) => handleThreadClose(threadId)}
 * />
 * ```
 */
export const CommunicationThreads: React.FC<CommunicationThreadsProps> = ({
  className = '',
  isLoading = false,
  error,
  studentId,
  threadId,
  onThreadSelect,
  onMessageSent,
  onThreadClose,
  onThreadArchive
}): React.ReactElement => {
  // State management
  const [threads, setThreads] = useState<CommunicationThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<CommunicationThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const mockThreads: CommunicationThread[] = [
    {
      id: 'thread-1',
      subject: 'Sarah\'s Appointment Follow-up',
      type: 'email',
      participants: [
        {
          id: 'nurse-1',
          name: 'Lisa Chen',
          role: 'School Nurse',
          email: 'l.chen@school.edu',
          is_active: true,
          last_seen: '2024-03-25T14:30:00Z'
        },
        {
          id: 'parent-1',
          name: 'Mary Johnson',
          role: 'Parent',
          relationship: 'Mother',
          email: 'mary.johnson@email.com',
          is_active: false,
          last_seen: '2024-03-25T12:15:00Z'
        }
      ],
      messages: [
        {
          id: 'msg-1',
          thread_id: 'thread-1',
          content: 'Thank you for bringing Sarah in for her appointment today. Her blood pressure readings were normal, and we discussed the inhaler usage.',
          sender: {
            id: 'nurse-1',
            name: 'Lisa Chen',
            role: 'School Nurse'
          },
          message_type: 'text',
          metadata: {
            delivery_status: 'read',
            read_at: '2024-03-25T10:45:00Z'
          },
          created_at: '2024-03-25T10:30:00Z',
          updated_at: '2024-03-25T10:30:00Z'
        },
        {
          id: 'msg-2',
          thread_id: 'thread-1',
          content: 'Thank you for the update. Should we continue with the same inhaler dosage?',
          sender: {
            id: 'parent-1',
            name: 'Mary Johnson',
            role: 'Parent'
          },
          message_type: 'text',
          metadata: {
            delivery_status: 'delivered'
          },
          created_at: '2024-03-25T12:15:00Z',
          updated_at: '2024-03-25T12:15:00Z'
        }
      ],
      status: 'active',
      priority: 'medium',
      category: 'appointment',
      metadata: {
        student_id: 'student-1',
        student_name: 'Sarah Johnson',
        unread_count: 1,
        last_activity: '2024-03-25T12:15:00Z',
        created_by: 'nurse-1'
      },
      created_at: '2024-03-25T10:30:00Z',
      updated_at: '2024-03-25T12:15:00Z'
    },
    {
      id: 'thread-2',
      subject: 'Emergency: Michael\'s Allergic Reaction',
      type: 'mixed',
      participants: [
        {
          id: 'nurse-2',
          name: 'Robert Davis',
          role: 'Head Nurse',
          phone: '(555) 123-0001',
          is_active: true,
          last_seen: '2024-03-24T15:00:00Z'
        },
        {
          id: 'parent-2',
          name: 'David Smith',
          role: 'Parent',
          relationship: 'Father',
          phone: '(555) 987-6543',
          is_active: false,
          last_seen: '2024-03-24T14:45:00Z'
        },
        {
          id: 'doctor-1',
          name: 'Dr. Sarah Wilson',
          role: 'Emergency Physician',
          phone: '(555) 456-7890',
          is_active: false,
          last_seen: '2024-03-24T16:00:00Z'
        }
      ],
      messages: [
        {
          id: 'msg-3',
          thread_id: 'thread-2',
          content: 'Michael had an allergic reaction during lunch. We administered his EpiPen and called 911. He is conscious and breathing normally.',
          sender: {
            id: 'nurse-2',
            name: 'Robert Davis',
            role: 'Head Nurse'
          },
          message_type: 'text',
          metadata: {
            delivery_status: 'read',
            read_at: '2024-03-24T14:22:00Z'
          },
          created_at: '2024-03-24T14:20:00Z',
          updated_at: '2024-03-24T14:20:00Z'
        },
        {
          id: 'msg-4',
          thread_id: 'thread-2',
          content: 'OMG! I\'m on my way to the hospital now. Thank you for acting quickly!',
          sender: {
            id: 'parent-2',
            name: 'David Smith',
            role: 'Parent'
          },
          message_type: 'text',
          metadata: {
            delivery_status: 'read',
            read_at: '2024-03-24T14:25:00Z'
          },
          created_at: '2024-03-24T14:23:00Z',
          updated_at: '2024-03-24T14:23:00Z'
        },
        {
          id: 'msg-5',
          thread_id: 'thread-2',
          content: 'Michael is stable and responding well. We\'ll keep him under observation for the next few hours as a precaution.',
          sender: {
            id: 'doctor-1',
            name: 'Dr. Sarah Wilson',
            role: 'Emergency Physician'
          },
          message_type: 'text',
          metadata: {
            delivery_status: 'delivered'
          },
          created_at: '2024-03-24T16:00:00Z',
          updated_at: '2024-03-24T16:00:00Z'
        }
      ],
      status: 'closed',
      priority: 'urgent',
      category: 'emergency',
      metadata: {
        student_id: 'student-2',
        student_name: 'Michael Smith',
        unread_count: 0,
        last_activity: '2024-03-24T16:00:00Z',
        created_by: 'nurse-2'
      },
      created_at: '2024-03-24T14:20:00Z',
      updated_at: '2024-03-24T16:00:00Z'
    }
  ];

  // Load threads effect
  useEffect(() => {
    const loadThreads = () => {
      let data = [...mockThreads];
      
      // Filter by student if specified
      if (studentId) {
        data = data.filter(thread => thread.metadata.student_id === studentId);
      }
      
      setThreads(data);

      // Select thread if threadId provided
      if (threadId) {
        const thread = data.find(t => t.id === threadId);
        if (thread) {
          setSelectedThread(thread);
          onThreadSelect?.(thread);
        }
      }
    };
    
    loadThreads();
  }, [studentId, threadId, onThreadSelect]);

  // Handle thread selection
  const handleThreadSelect = useCallback((thread: CommunicationThread): void => {
    setSelectedThread(thread);
    onThreadSelect?.(thread);
    
    // Mark messages as read (in real app, make API call)
    if (thread.metadata.unread_count > 0) {
      const updatedThreads = threads.map(t => 
        t.id === thread.id 
          ? { ...t, metadata: { ...t.metadata, unread_count: 0 } }
          : t
      );
      setThreads(updatedThreads);
    }
  }, [threads, onThreadSelect]);

  // Handle sending message
  const handleSendMessage = useCallback((message: string, attachments?: File[]): void => {
    if (!selectedThread || (!message.trim() && (!attachments || attachments.length === 0))) return;

    const newMessage: ThreadMessage = {
      id: `msg-${Date.now()}`,
      thread_id: selectedThread.id,
      content: message.trim(),
      sender: {
        id: 'current-user',
        name: 'Current User',
        role: 'School Staff'
      },
      message_type: attachments && attachments.length > 0 ? 'attachment' : 'text',
      attachments: attachments && attachments.length > 0 ? attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size
      })) : undefined,
      metadata: {
        delivery_status: 'sent'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update thread with new message
    const updatedThread = {
      ...selectedThread,
      messages: [...selectedThread.messages, newMessage],
      metadata: {
        ...selectedThread.metadata,
        last_activity: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    setSelectedThread(updatedThread);
    
    // Update threads list
    const updatedThreads = threads.map(t => 
      t.id === selectedThread.id ? updatedThread : t
    );
    setThreads(updatedThreads);

    // Callback
    onMessageSent?.(selectedThread.id, message.trim(), attachments);
  }, [selectedThread, threads, onMessageSent]);

  // Handle back click (mobile)
  const handleBackClick = useCallback((): void => {
    setSelectedThread(null);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading communication threads</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
        {/* Thread List */}
        <div className={`lg:col-span-1 ${selectedThread ? 'hidden lg:block' : ''}`}>
          <ThreadList
            threads={threads}
            selectedThread={selectedThread}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onThreadSelect={handleThreadSelect}
          />
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-2 ${!selectedThread ? 'hidden lg:block' : ''}`}>
          <ChatArea
            thread={selectedThread}
            onSendMessage={handleSendMessage}
            onThreadClose={onThreadClose}
            onThreadArchive={onThreadArchive}
            onBackClick={handleBackClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunicationThreads;

// Re-export types for convenience
export type {
  CommunicationThreadsProps,
  CommunicationThread,
  ThreadMessage,
  ThreadParticipant
} from './types';
