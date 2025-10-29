'use client';

import { useState } from 'react';
import {
  Reply,
  ReplyAll,
  Forward,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  Flag,
  Tag,
  Move,
  Printer,
  Download,
  Share
} from 'lucide-react';

interface Message {
  id: string;
  isStarred: boolean;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  tags?: string[];
}

interface MessageActionsProps {
  message: Message;
  selectedMessageIds?: string[];
  onReply: (messageId: string) => void;
  onReplyAll: (messageId: string) => void;
  onForward: (messageId: string) => void;
  onStar: (messageId: string) => void;
  onArchive: (messageIds: string[]) => void;
  onDelete: (messageIds: string[]) => void;
  onMarkAsRead: (messageIds: string[]) => void;
  onMarkAsUnread: (messageIds: string[]) => void;
  onSetPriority: (messageIds: string[], priority: Message['priority']) => void;
  onSetCategory: (messageIds: string[], category: string) => void;
  onMove: (messageIds: string[], folder: string) => void;
  onPrint: (messageId: string) => void;
  onDownload: (messageId: string) => void;
  onShare: (messageId: string) => void;
  onExport: (messageIds: string[]) => void;
  variant?: 'toolbar' | 'dropdown' | 'compact';
  showLabels?: boolean;
}

const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
  { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
  { value: 'high', label: 'High Priority', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent Priority', color: 'text-red-600' },
];

const folderOptions = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'sent', label: 'Sent' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'archive', label: 'Archive' },
  { value: 'trash', label: 'Trash' },
];

const categoryOptions = [
  { value: 'general', label: 'General' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'project', label: 'Project' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'announcement', label: 'Announcement' },
];

// ActionButton component defined outside the render function
const ActionButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  className = '', 
  disabled = false,
  showLabel = false,
  variant = 'toolbar',
  'aria-label': ariaLabel
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  disabled?: boolean;
  showLabel?: boolean;
  variant?: string;
  'aria-label'?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 
      hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    aria-label={ariaLabel || label}
  >
    <Icon className="h-4 w-4" />
    {(showLabel || variant === 'dropdown') && <span>{label}</span>}
  </button>
);

export function MessageActions({
  message,
  selectedMessageIds = [],
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onMarkAsRead,
  onMarkAsUnread,
  onSetPriority,
  onSetCategory,
  onMove,
  onPrint,
  onDownload,
  onShare,
  onExport,
  variant = 'toolbar',
  showLabels = false,
}: MessageActionsProps) {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const messageIds = selectedMessageIds.length > 0 ? selectedMessageIds : [message.id];
  const isMultiSelect = selectedMessageIds.length > 1;

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-1">
        <ActionButton
          onClick={() => onStar(message.id)}
          icon={Star}
          label={message.isStarred ? 'Unstar' : 'Star'}
          className={message.isStarred ? 'text-yellow-500 hover:text-yellow-600' : ''}
          showLabel={showLabels}
          variant={variant}
        />
        <ActionButton
          onClick={() => onReply(message.id)}
          icon={Reply}
          label="Reply"
          disabled={isMultiSelect}
          showLabel={showLabels}
          variant={variant}
        />
        <ActionButton
          onClick={() => onArchive(messageIds)}
          icon={Archive}
          label="Archive"
          showLabel={showLabels}
          variant={variant}
        />
        <ActionButton
          onClick={() => onDelete(messageIds)}
          icon={Trash2}
          label="Delete"
          className="text-red-500 hover:text-red-600"
          showLabel={showLabels}
          variant={variant}
        />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded"
          aria-label="More actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMoreActions && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Message Actions
              </div>
              
              {!isMultiSelect && (
                <>
                  <ActionButton onClick={() => onReply(message.id)} icon={Reply} label="Reply" showLabel={showLabels} variant={variant} />
                  <ActionButton onClick={() => onReplyAll(message.id)} icon={ReplyAll} label="Reply All" showLabel={showLabels} variant={variant} />
                  <ActionButton onClick={() => onForward(message.id)} icon={Forward} label="Forward" showLabel={showLabels} variant={variant} />
                </>
              )}
              
              <ActionButton
                onClick={() => onStar(message.id)}
                icon={Star}
                label={message.isStarred ? 'Remove Star' : 'Add Star'}
                className={message.isStarred ? 'text-yellow-500' : ''}
                showLabel={showLabels}
                variant={variant}
              />
              
              <ActionButton
                onClick={() => message.isRead ? onMarkAsUnread(messageIds) : onMarkAsRead(messageIds)}
                icon={message.isRead ? EyeOff : Eye}
                label={message.isRead ? 'Mark as Unread' : 'Mark as Read'}
                showLabel={showLabels}
                variant={variant}
              />

              <div className="border-t border-gray-100 my-1" />

              {/* Priority submenu */}
              <div className="relative">
                <button
                  onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Flag className="h-4 w-4" />
                  <span>Set Priority</span>
                </button>
                {showPriorityMenu && (
                  <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border">
                    <div className="py-1">
                      {priorityOptions.map(priority => (
                        <button
                          key={priority.value}
                          onClick={() => {
                            onSetPriority(messageIds, priority.value as Message['priority']);
                            setShowPriorityMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${priority.color}`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category submenu */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Tag className="h-4 w-4" />
                  <span>Set Category</span>
                </button>
                {showCategoryMenu && (
                  <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border">
                    <div className="py-1">
                      {categoryOptions.map(category => (
                        <button
                          key={category.value}
                          onClick={() => {
                            onSetCategory(messageIds, category.value);
                            setShowCategoryMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Move submenu */}
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Move className="h-4 w-4" />
                  <span>Move to Folder</span>
                </button>
                {showMoveMenu && (
                  <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border">
                    <div className="py-1">
                      {folderOptions.map(folder => (
                        <button
                          key={folder.value}
                          onClick={() => {
                            onMove(messageIds, folder.value);
                            setShowMoveMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {folder.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 my-1" />

              <ActionButton onClick={() => onArchive(messageIds)} icon={Archive} label="Archive" showLabel={showLabels} variant={variant} />
              <ActionButton onClick={() => onDelete(messageIds)} icon={Trash2} label="Delete" className="text-red-600" showLabel={showLabels} variant={variant} />

              <div className="border-t border-gray-100 my-1" />

              {!isMultiSelect && (
                <>
                  <ActionButton onClick={() => onPrint(message.id)} icon={Printer} label="Print" showLabel={showLabels} variant={variant} />
                  <ActionButton onClick={() => onDownload(message.id)} icon={Download} label="Download" showLabel={showLabels} variant={variant} />
                  <ActionButton onClick={() => onShare(message.id)} icon={Share} label="Share" showLabel={showLabels} variant={variant} />
                </>
              )}

              <ActionButton onClick={() => onExport(messageIds)} icon={Download} label="Export" showLabel={showLabels} variant={variant} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default toolbar variant
  return (
    <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
      {/* Primary actions */}
      {!isMultiSelect && (
        <>
          <ActionButton onClick={() => onReply(message.id)} icon={Reply} label="Reply" showLabel={showLabels} variant={variant} />
          <ActionButton onClick={() => onReplyAll(message.id)} icon={ReplyAll} label="Reply All" showLabel={showLabels} variant={variant} />
          <ActionButton onClick={() => onForward(message.id)} icon={Forward} label="Forward" showLabel={showLabels} variant={variant} />
          <div className="h-4 border-l border-gray-300 mx-1" />
        </>
      )}

      <ActionButton
        onClick={() => onStar(message.id)}
        icon={Star}
        label={message.isStarred ? 'Unstar' : 'Star'}
        className={message.isStarred ? 'text-yellow-500 hover:text-yellow-600' : ''}
        showLabel={showLabels}
        variant={variant}
      />

      <ActionButton
        onClick={() => message.isRead ? onMarkAsUnread(messageIds) : onMarkAsRead(messageIds)}
        icon={message.isRead ? EyeOff : Eye}
        label={message.isRead ? 'Mark Unread' : 'Mark Read'}
        showLabel={showLabels}
        variant={variant}
      />

      <div className="h-4 border-l border-gray-300 mx-1" />

      <ActionButton onClick={() => onArchive(messageIds)} icon={Archive} label="Archive" showLabel={showLabels} variant={variant} />
      
      <ActionButton
        onClick={() => onDelete(messageIds)}
        icon={Trash2}
        label="Delete"
        className="text-red-500 hover:text-red-600"
        showLabel={showLabels}
        variant={variant}
      />

      {/* More actions dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded"
          aria-label="More actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMoreActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              {!isMultiSelect && (
                <>
                  <ActionButton onClick={() => onPrint(message.id)} icon={Printer} label="Print" />
                  <ActionButton onClick={() => onDownload(message.id)} icon={Download} label="Download" />
                  <ActionButton onClick={() => onShare(message.id)} icon={Share} label="Share" />
                  <div className="border-t border-gray-100 my-1" />
                </>
              )}
              
              <ActionButton onClick={() => onExport(messageIds)} icon={Download} label="Export" />
              
              <div className="border-t border-gray-100 my-1" />
              
              <div className="px-3 py-2">
                <select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSetPriority(messageIds, e.target.value as Message['priority'])}
                  className="w-full text-sm border-gray-300 rounded"
                  defaultValue={message.priority}
                  aria-label="Set message priority"
                >
                  <option value="">Set Priority</option>
                  {priorityOptions.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="px-3 py-2">
                <select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onMove(messageIds, e.target.value)}
                  className="w-full text-sm border-gray-300 rounded"
                  aria-label="Move message to folder"
                >
                  <option value="">Move to Folder</option>
                  {folderOptions.map(folder => (
                    <option key={folder.value} value={folder.value}>
                      {folder.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}