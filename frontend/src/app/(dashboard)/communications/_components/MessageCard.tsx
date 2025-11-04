/**
 * @fileoverview Message Card Component - Individual message display
 * @module app/(dashboard)/communications/_components/MessageCard
 * @category Communications - Components
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Reply,
  Forward,
  Users,
  Clock,
  Send,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { type Message } from '@/lib/validations/message.schemas';
import {
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  getTypeIcon,
  getTypeColor,
  formatMessageDate
} from './communications.utils';

interface MessageCardProps {
  message: Message;
  onView?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
}

export function MessageCard({
  message,
  onView,
  onReply,
  onForward
}: MessageCardProps) {
  const TypeIcon = getTypeIcon(message.type);
  const isEmergency = message.priority === 'urgent';

  return (
    <div
      className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
        isEmergency ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Message Header */}
          <div className="flex items-center gap-3 mb-2">
            <TypeIcon className={`h-5 w-5 ${getTypeColor(message.type)}`} />
            <h4
              className={`text-lg font-medium ${
                isEmergency ? 'text-red-900' : 'text-gray-900'
              }`}
            >
              {message.subject || 'No Subject'}
            </h4>
            <Badge variant={getStatusBadgeVariant(message.status)} className="text-xs">
              {message.status}
            </Badge>
            <Badge variant={getPriorityBadgeVariant(message.priority)} className="text-xs">
              {message.priority}
            </Badge>
            {isEmergency && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>

          {/* Message Body */}
          <p
            className={`text-sm mb-3 ${
              isEmergency ? 'text-red-800' : 'text-gray-600'
            }`}
          >
            {message.body || 'No content'}
          </p>

          {/* Message Metadata */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {message.recipientIds?.length || 0} recipient
                {(message.recipientIds?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatMessageDate(message.sentAt || message.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Send className="h-4 w-4" />
              <span>From: {message.senderName}</span>
            </div>
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Has attachments</span>
              </div>
            )}
          </div>

          {/* Recipients Summary */}
          {message.recipients && message.recipients.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Recipients:</p>
              <div className="flex flex-wrap gap-2">
                {message.recipients.slice(0, 3).map((recipient) => (
                  <div key={recipient.id} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-600">{recipient.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Recipient
                    </Badge>
                  </div>
                ))}
                {message.recipients.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{message.recipients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(message.id)}
            aria-label="View message"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReply?.(message.id)}
            aria-label="Reply to message"
          >
            <Reply className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onForward?.(message.id)}
            aria-label="Forward message"
          >
            <Forward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
