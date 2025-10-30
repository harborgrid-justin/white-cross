'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  ArrowLeftIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/**
 * Message in a communication thread
 */
interface ThreadMessage {
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
 * Communication thread
 */
interface CommunicationThread {
  id: string;
  subject?: string;
  type: 'email' | 'sms' | 'chat' | 'mixed';
  participants: Array<{
    id: string;
    name: string;
    role: string;
    relationship?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    is_active: boolean;
    last_seen?: string;
  }>;
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
 * Props for the CommunicationThreads component
 */
interface CommunicationThreadsProps {
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
 * CommunicationThreads component for managing threaded conversations
 * 
 * Features:
 * - Real-time threaded conversations
 * - Multi-participant support (group conversations)
 * - Message delivery status tracking
 * - File attachment support
 * - Thread management (close, archive, priority)
 * - Unread message indicators
 * - Message search and filtering
 * - Typing indicators
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
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThreadInfo, setShowThreadInfo] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);

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

  // Load threads
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

  // Filter threads based on search
  const filteredThreads = useCallback(() => {
    if (!searchQuery) return threads;
    
    const searchLower = searchQuery.toLowerCase();
    return threads.filter(thread =>
      (thread.subject && thread.subject.toLowerCase().includes(searchLower)) ||
      thread.participants.some(p => p.name.toLowerCase().includes(searchLower)) ||
      thread.messages.some(m => m.content.toLowerCase().includes(searchLower)) ||
      (thread.metadata.student_name && thread.metadata.student_name.toLowerCase().includes(searchLower))
    );
  }, [threads, searchQuery]);

  // Handle thread selection
  const handleThreadSelect = (thread: CommunicationThread): void => {
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
  };

  // Handle sending message
  const handleSendMessage = (): void => {
    if (!selectedThread || (!newMessage.trim() && attachments.length === 0)) return;

    const message: ThreadMessage = {
      id: `msg-${Date.now()}`,
      thread_id: selectedThread.id,
      content: newMessage.trim(),
      sender: {
        id: 'current-user',
        name: 'Current User',
        role: 'School Staff'
      },
      message_type: attachments.length > 0 ? 'attachment' : 'text',
      attachments: attachments.length > 0 ? attachments.map((file, index) => ({
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
      messages: [...selectedThread.messages, message],
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
    onMessageSent?.(selectedThread.id, newMessage.trim(), attachments);

    // Clear input
    setNewMessage('');
    setAttachments([]);
  };

  // Handle file attachment
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  // Remove attachment
  const removeAttachment = (index: number): void => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Get priority color
  const getPriorityColor = (priority: CommunicationThread['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status color
  const getStatusColor = (status: CommunicationThread['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      case 'archived':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  const filtered = filteredThreads();

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
        {/* Threads List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search conversations"
              />
            </div>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filtered.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedThread?.id === thread.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {thread.subject || `${thread.type.charAt(0).toUpperCase() + thread.type.slice(1)} Thread`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {thread.metadata.student_name}
                        </p>
                      </div>
                      {thread.metadata.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {thread.metadata.unread_count}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(thread.priority)}`}>
                        {thread.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(thread.status)}`}>
                        {thread.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {thread.participants.length} participant{thread.participants.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(thread.metadata.last_activity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {thread.messages.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {thread.messages[thread.messages.length - 1].content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedThread(null)}
                      className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedThread.subject || `${selectedThread.type.charAt(0).toUpperCase() + selectedThread.type.slice(1)} Thread`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedThread.metadata.student_name} • {selectedThread.participants.length} participants
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowThreadInfo(!showThreadInfo)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                      aria-label="Thread information"
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                      aria-label="More options"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.sender.id === 'current-user' 
                        ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                        : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                    } px-4 py-2`}>
                      {message.sender.id !== 'current-user' && (
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {message.sender.name}
                        </p>
                      )}
                      
                      <p className="text-sm">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 text-xs">
                              <PaperClipIcon className="h-3 w-3" />
                              <span>{attachment.name} ({formatFileSize(attachment.size)})</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-75">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                        {message.sender.id === 'current-user' && message.metadata.delivery_status && (
                          <div className="flex items-center space-x-1">
                            {message.metadata.delivery_status === 'read' ? (
                              <div className="flex space-x-0.5">
                                <CheckIcon className="h-3 w-3" />
                                <CheckIcon className="h-3 w-3 -ml-1" />
                              </div>
                            ) : message.metadata.delivery_status === 'delivered' ? (
                              <CheckIcon className="h-3 w-3" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {selectedThread.status === 'active' && (
                <div className="p-4 border-t border-gray-200">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-1">
                          <PaperClipIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={2}
                        aria-label="Message input"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="file-input"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-input"
                        className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                      >
                        <PaperClipIcon className="h-5 w-5" />
                      </label>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() && attachments.length === 0}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send message"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thread Info Sidebar */}
      {showThreadInfo && selectedThread && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Thread Information</h3>
              <button
                onClick={() => setShowThreadInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Participants */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Participants</h4>
              <div className="space-y-2">
                {selectedThread.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {participant.is_active && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thread Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedThread.status)}`}>
                    {selectedThread.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedThread.priority)}`}>
                    {selectedThread.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{selectedThread.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">
                    {new Date(selectedThread.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
              <div className="space-y-2">
                {selectedThread.status === 'active' && (
                  <button
                    onClick={() => onThreadClose?.(selectedThread.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close Thread
                  </button>
                )}
                <button
                  onClick={() => onThreadArchive?.(selectedThread.id)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Archive Thread
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationThreads;
