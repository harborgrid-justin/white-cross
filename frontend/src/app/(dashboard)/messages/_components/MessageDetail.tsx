/**
 * MessageDetail Component
 * Modal for displaying full message details
 */

'use client';

import React, { useEffect } from 'react';
import { X, Reply, Forward, CheckCircle, Archive, Paperclip, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HealthcareMessage } from './types/message.types';
import { getPriorityBadgeColor, getTypeIcon } from './utils/messageHelpers';
import { formatFileSize } from './utils/messageFormatters';

interface MessageDetailProps {
  message: HealthcareMessage | null;
  onClose: () => void;
  onAcknowledge: (messageId: string) => void;
  onArchive: (messageId: string) => void;
}

/**
 * Message detail modal component
 * Shows full message content, metadata, and attachments
 */
export const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  onClose,
  onAcknowledge,
  onArchive
}) => {
  // Handle keyboard escape to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (message) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const handleAcknowledgeAndClose = () => {
    onAcknowledge(message.id);
    onClose();
  };

  const handleArchiveAndClose = () => {
    onArchive(message.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-detail-title"
    >
      <Card
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(message.type)}
            <div>
              <h2 id="message-detail-title" className="font-semibold text-gray-900">
                {message.subject}
              </h2>
              <p className="text-sm text-gray-600">
                From: {message.from.name} ({message.from.role})
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close message detail"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Message Metadata */}
          <div className="grid gap-4 md:grid-cols-2 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Priority</p>
              <Badge className={getPriorityBadgeColor(message.priority)}>
                {message.priority.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Type</p>
              <p className="text-sm text-gray-900 capitalize">
                {message.type.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Sent</p>
              <p className="text-sm text-gray-900">
                {message.timestamp.toLocaleString()}
              </p>
            </div>
            {message.relatedStudent && (
              <div>
                <p className="text-sm font-medium text-gray-700">Related Student</p>
                <p className="text-sm text-gray-900">{message.relatedStudent.name}</p>
              </div>
            )}
          </div>

          {/* Recipients */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Recipients</h3>
            <div className="space-y-1">
              <div>
                <span className="text-sm font-medium text-gray-700">To: </span>
                <span className="text-sm text-gray-900">
                  {message.to.map((recipient) => `${recipient.name} (${recipient.role})`).join(', ')}
                </span>
              </div>
              {message.cc && message.cc.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">CC: </span>
                  <span className="text-sm text-gray-900">
                    {message.cc.map((recipient) => `${recipient.name} (${recipient.role})`).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="prose prose-sm max-w-none mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Message</h3>
            <p className="whitespace-pre-wrap text-gray-700">{message.content}</p>
          </div>

          {/* Tags */}
          {message.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {message.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Attachments</h3>
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(attachment.size)} • {attachment.type}
                          {attachment.isEncrypted && (
                            <span className="ml-2 text-green-600">Encrypted</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" aria-label={`Download ${attachment.name}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" onClick={onClose}>
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </div>
          <div className="flex gap-2">
            {message.requiresAcknowledgment && !message.acknowledgedAt && (
              <Button variant="default" onClick={handleAcknowledgeAndClose}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            <Button variant="outline" onClick={handleArchiveAndClose}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
