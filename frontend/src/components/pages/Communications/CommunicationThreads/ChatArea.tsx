/**
 * WF-COMP-317 | ChatArea.tsx - Main chat interface component
 * Purpose: Display messages and handle chat interactions
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: ChatArea component | Key Features: Message display, chat header, input handling
 * Last Updated: 2025-11-11 | File Type: .tsx
 * Critical Path: Thread data → Message rendering → User input → Send actions
 * LLM Context: Chat area component, part of modular communication architecture
 */

'use client';

import React from 'react';
import { 
  ArrowLeftIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

import MessageInput from './MessageInput';
import type { ChatAreaProps, ThreadMessage } from './types';

/**
 * MessageBubble component for individual message display
 */
interface MessageBubbleProps {
  message: ThreadMessage;
  isFromCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isFromCurrentUser }) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${
        isFromCurrentUser 
          ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
          : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
      } px-4 py-2`}>
        {!isFromCurrentUser && (
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
          {isFromCurrentUser && message.metadata.delivery_status && (
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
  );
};

/**
 * ChatArea component for displaying and managing chat interface
 * 
 * Features:
 * - Chat header with thread info
 * - Message display with bubbles
 * - Message input integration
 * - Back navigation for mobile
 * - Thread actions menu
 * - Empty state handling
 * 
 * @component
 */
export const ChatArea: React.FC<ChatAreaProps> = ({
  thread,
  onSendMessage,
  onThreadClose,
  onThreadArchive,
  onBackClick,
  className = ''
}) => {
  // Handle message send
  const handleSendMessage = (message: string, attachments?: File[]): void => {
    if (!thread) return;
    onSendMessage(message, attachments);
  };

  // Handle info button click
  const handleInfoClick = (): void => {
    // This would typically open a thread info sidebar
    // For now, we'll just log the action
    console.log('Thread info clicked for thread:', thread?.id);
  };

  // Handle options menu click
  const handleOptionsClick = (): void => {
    // This would typically open an options menu
    console.log('Options clicked for thread:', thread?.id);
  };

  if (!thread) {
    return (
      <div className={`bg-white rounded-lg shadow flex flex-col ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow flex flex-col ${className}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackClick}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Go back to thread list"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {thread.subject || `${thread.type.charAt(0).toUpperCase() + thread.type.slice(1)} Thread`}
              </h3>
              <p className="text-sm text-gray-500">
                {thread.metadata.student_name} • {thread.participants.length} participants
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInfoClick}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Thread information"
            >
              <InformationCircleIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleOptionsClick}
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
        {thread.messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          thread.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isFromCurrentUser={message.sender.id === 'current-user'}
            />
          ))
        )}
      </div>

      {/* Message Input */}
      {thread.status === 'active' ? (
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder="Type your message..."
        />
      ) : (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            This conversation is {thread.status}. You cannot send new messages.
          </p>
          {thread.status === 'closed' && (
            <div className="flex justify-center space-x-2 mt-2">
              <button
                onClick={() => onThreadClose?.(thread.id)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reopen Thread
              </button>
              <button
                onClick={() => onThreadArchive?.(thread.id)}
                className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Archive Thread
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatArea;
