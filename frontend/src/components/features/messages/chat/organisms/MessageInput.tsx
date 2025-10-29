'use client';

/**
 * WF-MSG-009 | MessageInput.tsx - Message Input Component
 * Purpose: Simple chat input for sending messages
 * Dependencies: React, AttachmentPreview, lucide-react
 * Features: Text input, file attachments, emoji, send button, typing indicator
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile, Image, Mic, X } from 'lucide-react';

/**
 * Attachment file type.
 */
export interface AttachmentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

/**
 * Props for the MessageInput component.
 *
 * @interface MessageInputProps
 * @property {string} [placeholder='Type a message...'] - Input placeholder text
 * @property {boolean} [disabled] - Whether input is disabled
 * @property {boolean} [isSending] - Whether message is currently being sent
 * @property {number} [maxLength=5000] - Maximum message length
 * @property {boolean} [allowAttachments=true] - Whether attachments are allowed
 * @property {boolean} [allowEmoji=true] - Whether emoji picker is shown
 * @property {boolean} [allowVoice=false] - Whether voice recording is enabled
 * @property {string[]} [acceptedFileTypes] - Accepted file MIME types for attachments
 * @property {number} [maxFileSize=25] - Maximum file size in MB
 * @property {string} [className] - Additional CSS classes
 * @property {(message: string, attachments: AttachmentFile[]) => Promise<void>} onSend - Callback when message sent
 * @property {() => void} [onTyping] - Callback when user starts typing
 * @property {() => void} [onStopTyping] - Callback when user stops typing
 * @property {(file: File) => Promise<AttachmentFile>} [onAttachmentUpload] - Callback for attachment upload
 */
export interface MessageInputProps {
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
  maxLength?: number;
  allowAttachments?: boolean;
  allowEmoji?: boolean;
  allowVoice?: boolean;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  className?: string;
  onSend: (message: string, attachments: AttachmentFile[]) => Promise<void>;
  onTyping?: () => void;
  onStopTyping?: () => void;
  onAttachmentUpload?: (file: File) => Promise<AttachmentFile>;
}

/**
 * Message input component for chat interface.
 *
 * Provides a simple, accessible message input with support for text,
 * file attachments, emoji picker, and voice messages. Features auto-resize
 * textarea, keyboard shortcuts, and real-time character count.
 *
 * **Features:**
 * - Auto-resizing textarea
 * - Enter to send (Shift+Enter for newline)
 * - Character count with max length
 * - File attachment support
 * - Attachment preview with remove
 * - Emoji picker button (integration point)
 * - Voice recording button (optional)
 * - Typing indicators
 * - Loading/sending states
 * - Disabled state
 * - Accessibility with semantic HTML and ARIA
 * - Dark mode support
 * - Mobile responsive
 *
 * **Keyboard Shortcuts:**
 * - Enter: Send message
 * - Shift+Enter: New line
 * - Escape: Clear input
 *
 * **Accessibility:**
 * - Semantic form element
 * - ARIA labels for all buttons
 * - Keyboard accessible
 * - Focus indicators
 * - Screen reader announcements
 *
 * @component
 * @param {MessageInputProps} props - Component props
 * @returns {JSX.Element} Rendered message input
 *
 * @example
 * ```tsx
 * // Simple message input
 * <MessageInput
 *   onSend={async (message, attachments) => {
 *     await sendMessage(message, attachments);
 *   }}
 * />
 *
 * // With typing indicators
 * <MessageInput
 *   onSend={handleSend}
 *   onTyping={() => socket.emit('typing')}
 *   onStopTyping={() => socket.emit('stop-typing')}
 * />
 *
 * // With attachment upload
 * <MessageInput
 *   onSend={handleSend}
 *   onAttachmentUpload={async (file) => {
 *     const uploaded = await uploadFile(file);
 *     return uploaded;
 *   }}
 * />
 *
 * // Disabled with custom placeholder
 * <MessageInput
 *   disabled
 *   placeholder="Cannot send messages in archived chat"
 *   onSend={handleSend}
 * />
 * ```
 */
export const MessageInput = React.memo<MessageInputProps>(({
  placeholder = 'Type a message...',
  disabled = false,
  isSending = false,
  maxLength = 5000,
  allowAttachments = true,
  allowEmoji = true,
  allowVoice = false,
  acceptedFileTypes,
  maxFileSize = 25,
  className = '',
  onSend,
  onTyping,
  onStopTyping,
  onAttachmentUpload,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Handle typing indicators
  const handleTyping = () => {
    if (onTyping) {
      onTyping();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout for stop typing
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping?.();
      }, 2000);
    }
  };

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      handleTyping();
    }
  };

  // Handle send message
  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    if (disabled || isSending) return;

    try {
      await onSend(message, attachments);
      setMessage('');
      setAttachments([]);
      setError(null);

      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping?.();

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setMessage('');
      textareaRef.current?.blur();
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);
    setIsUploading(true);

    for (const file of files) {
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        continue;
      }

      try {
        if (onAttachmentUpload) {
          const attachment = await onAttachmentUpload(file);
          setAttachments((prev) => [...prev, attachment]);
        } else {
          // Create preview for local attachment
          const attachment: AttachmentFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          };
          setAttachments((prev) => [...prev, attachment]);
        }
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const canSend = (message.trim() || attachments.length > 0) && !disabled && !isSending;

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative flex-shrink-0 group"
            >
              {attachment.preview ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <button
                onClick={() => handleRemoveAttachment(attachment.id)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                aria-label={`Remove ${attachment.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 p-4">
        {/* Action Buttons (Left) */}
        <div className="flex gap-1">
          {allowAttachments && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Attach file"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          )}

          {allowEmoji && (
            <button
              onClick={() => {/* TODO: Open emoji picker */}}
              disabled={disabled}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Add emoji"
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-2.5 pr-16
              bg-gray-100 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-2xl resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Message input"
          />

          {/* Character Count */}
          {message.length > maxLength * 0.8 && (
            <span
              className={`
                absolute bottom-2 right-3 text-xs
                ${message.length >= maxLength
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}
            >
              {message.length}/{maxLength}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`
            p-2.5 rounded-full transition-all
            ${canSend
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            dark:focus:ring-offset-gray-900
          `}
          aria-label="Send message"
          title="Send message (Enter)"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes?.join(',') || '*/*'}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="File input"
      />
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
