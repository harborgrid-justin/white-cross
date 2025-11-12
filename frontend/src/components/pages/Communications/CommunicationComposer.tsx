'use client';

import React, { useCallback } from 'react';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CommunicationType, CommunicationPriority } from './CommunicationCard';
import {
  CommunicationComposerProps,
  CommunicationTemplate
} from './CommunicationComposer.types';
import { getTypeIcon } from './CommunicationComposer.utils';
import {
  useCommunicationState,
  useRecipients,
  useAttachments,
  useTags,
  useAutoSaveDraft,
  useTemplateSelection
} from './CommunicationComposer.hooks';
import RecipientSelector from './RecipientSelector';
import AttachmentManager from './AttachmentManager';
import ContentEditor from './ContentEditor';

// Re-export types for backward compatibility
export type {
  CommunicationRecipient,
  CommunicationComposerAttachment,
  CommunicationTemplate
} from './CommunicationComposer.types';

/**
 * CommunicationComposer Component
 *
 * A comprehensive composer component for creating new communications with support
 * for multiple types, recipients, attachments, templates, and scheduling.
 *
 * Features:
 * - Multiple communication types (email, SMS, phone, chat)
 * - Recipient selection with autocomplete
 * - Rich text content editor
 * - File attachment support with progress tracking
 * - Communication templates
 * - Priority and scheduling options
 * - Draft saving functionality
 * - Tag management
 * - Preview mode
 * - Accessibility compliant with ARIA attributes
 * - HIPAA-compliant handling of sensitive data
 *
 * @param props - The component props
 * @returns The rendered CommunicationComposer component
 */
const CommunicationComposer: React.FC<CommunicationComposerProps> = ({
  type = 'email',
  availableRecipients = [],
  templates = [],
  initialRecipients = [],
  initialSubject = '',
  initialContent = '',
  isReply = false,
  originalCommunication,
  isForward = false,
  loading = false,
  error,
  maxAttachmentSize = 10 * 1024 * 1024, // 10MB
  allowedAttachmentTypes = [
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  showScheduling = true,
  onSend,
  onSaveDraft,
  onCancel,
  onTemplateSelect,
  className = ''
}) => {
  // State management hooks
  const {
    communicationType,
    setCommunicationType,
    subject,
    setSubject,
    content,
    setContent,
    priority,
    setPriority,
    scheduledAt,
    setScheduledAt,
    showPreview,
    setShowPreview,
    showTemplates,
    setShowTemplates,
    isDraft,
    setIsDraft,
    contentRef
  } = useCommunicationState(type, initialSubject, initialContent, initialRecipients);

  const {
    recipients,
    recipientSearch,
    setRecipientSearch,
    handleAddRecipient,
    handleRemoveRecipient
  } = useRecipients(initialRecipients);

  const {
    attachments,
    fileInputRef,
    handleFileSelect,
    handleRemoveAttachment
  } = useAttachments(maxAttachmentSize, allowedAttachmentTypes);

  const {
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleTagKeyPress,
    handleRemoveTag
  } = useTags();

  /**
   * Handle save draft
   */
  const handleSaveDraft = useCallback(() => {
    setIsDraft(true);
    onSaveDraft?.({
      type: communicationType,
      recipients,
      subject,
      content,
      priority,
      attachments,
      scheduledAt: scheduledAt || undefined,
      tags
    });
  }, [communicationType, recipients, subject, content, priority, attachments, scheduledAt, tags, onSaveDraft, setIsDraft]);

  // Auto-save draft hook
  useAutoSaveDraft(subject, content, recipients.length, isDraft, handleSaveDraft);

  // Template selection hook
  const { handleTemplateSelect } = useTemplateSelection(
    setCommunicationType,
    setSubject,
    setContent,
    setShowTemplates,
    onTemplateSelect
  );

  /**
   * Handle send communication
   */
  const handleSend = useCallback(() => {
    if (!recipients.length) {
      alert('Please select at least one recipient.');
      return;
    }

    if (!subject.trim() && communicationType === 'email') {
      alert('Please enter a subject.');
      return;
    }

    if (!content.trim()) {
      alert('Please enter message content.');
      return;
    }

    onSend?.({
      type: communicationType,
      recipients,
      subject,
      content,
      priority,
      attachments,
      scheduledAt: scheduledAt || undefined,
      tags
    });
  }, [recipients, subject, communicationType, content, priority, attachments, scheduledAt, tags, onSend]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isReply ? 'Reply' : isForward ? 'Forward' : 'New Communication'}
            </h2>
            {isDraft && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                <ClockIcon className="h-3 w-3 mr-1" />
                Draft Saved
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Type Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {(['email', 'sms', 'phone', 'chat'] as CommunicationType[]).map((typeOption) => (
                <button
                  key={typeOption}
                  onClick={() => setCommunicationType(typeOption)}
                  className={`p-2 rounded ${
                    communicationType === typeOption
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label={`Set type to ${typeOption}`}
                >
                  {getTypeIcon(typeOption)}
                </button>
              ))}
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                aria-label="Cancel composition"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Recipients */}
        <RecipientSelector
          recipients={recipients}
          availableRecipients={availableRecipients}
          recipientSearch={recipientSearch}
          onRecipientSearchChange={setRecipientSearch}
          onAddRecipient={handleAddRecipient}
          onRemoveRecipient={handleRemoveRecipient}
        />

        {/* Subject (for email) */}
        {communicationType === 'email' && (
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Priority and Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPriority(e.target.value as CommunicationPriority)
                }
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Scheduling */}
            {showScheduling && (
              <div>
                <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <input
                  type="datetime-local"
                  id="scheduledAt"
                  value={scheduledAt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduledAt(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}
          </div>

        </div>

        {/* Content Editor with Templates and Tags */}
        <ContentEditor
          content={content}
          onContentChange={setContent}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showTemplates={showTemplates}
          onToggleTemplates={() => setShowTemplates(!showTemplates)}
          templates={templates}
          onTemplateSelect={handleTemplateSelect}
          tags={tags}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onTagKeyPress={handleTagKeyPress}
          onRemoveTag={handleRemoveTag}
          contentRef={contentRef}
        />

        {/* Attachments */}
        <AttachmentManager
          attachments={attachments}
          allowedAttachmentTypes={allowedAttachmentTypes}
          maxAttachmentSize={maxAttachmentSize}
          onFileSelect={handleFileSelect}
          onRemoveAttachment={handleRemoveAttachment}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{content.length} characters</span>
            {attachments.length > 0 && (
              <span className="text-sm text-gray-500">
                • {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !recipients.length || !content.trim()}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>{scheduledAt ? 'Schedule' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationComposer;
