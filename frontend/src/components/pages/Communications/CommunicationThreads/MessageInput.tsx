/**
 * WF-COMP-317 | MessageInput.tsx - Message input component for chat
 * Purpose: Handle message composition and file attachments
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: MessageInput component | Key Features: Text input, file uploads, send handling
 * Last Updated: 2025-11-11 | File Type: .tsx
 * Critical Path: User input → Validation → File handling → Send callback
 * LLM Context: Message input component, part of modular communication architecture
 */

'use client';

import React, { useState, useCallback } from 'react';
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import type { MessageInputProps } from './types';

/**
 * MessageInput component for composing and sending messages
 * 
 * Features:
 * - Multi-line text input with Enter handling
 * - File attachment support
 * - Attachment preview and removal
 * - Send button with validation
 * - Disabled state handling
 * - File size formatting
 * 
 * @component
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((index: number): void => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle send message
  const handleSend = useCallback((): void => {
    if (disabled || (!message.trim() && attachments.length === 0)) return;

    onSendMessage(message.trim(), attachments);
    
    // Clear input and attachments
    setMessage('');
    setAttachments([]);
  }, [message, attachments, onSendMessage, disabled]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if send is enabled
  const canSend = !disabled && (message.trim().length > 0 || attachments.length > 0);

  return (
    <div className={`p-4 border-t border-gray-200 bg-white ${className}`}>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-1"
            >
              <PaperClipIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 truncate max-w-40">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(file.size)})
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-3">
        {/* Text Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            rows={2}
            maxLength={2000} // Reasonable message limit
            aria-label="Message input"
          />
          {message.length > 1800 && (
            <div className="text-xs text-gray-500 mt-1 text-right">
              {2000 - message.length} characters remaining
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* File Upload */}
          <input
            type="file"
            id="file-input"
            multiple
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.txt"
          />
          <label
            htmlFor="file-input"
            className={`p-2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            aria-label="Attach file"
          >
            <PaperClipIcon className="h-5 w-5" />
          </label>
          
          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              canSend 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Help Text */}
      <div className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default MessageInput;
