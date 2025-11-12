'use client';

import { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { MessageComposeProps, MessageTemplate } from './MessageCompose.types';
import { useMessageCompose } from './useMessageCompose';
import { insertTextAtCursor } from './MessageCompose.utils';
import { MessageHeader } from './MessageHeader';
import { RecipientField } from './RecipientField';
import { MessageToolbar } from './MessageToolbar';
import { MessageEditor, MessageEditorRef } from './MessageEditor';
import { AdvancedOptions } from './AdvancedOptions';
import { AttachmentList } from './AttachmentList';
import { ComposeActions } from './ComposeActions';

export function MessageCompose({
  onSend,
  onSaveDraft,
  onCancel,
  onAttachmentUpload,
  onSearchRecipients,
  recipients = [],
  subject = '',
  content = '',
  replyToId,
  forwardFromId,
  templates = [],
  availableTags = [],
  isDraftMode = false,
  className = '',
}: MessageComposeProps) {
  const {
    message,
    updateMessage,
    recipientSearch,
    searchResults,
    showRecipientSearch,
    errors,
    setErrors,
    validateMessage,
    handleRecipientSearch,
    addRecipient,
    removeRecipient,
    handleFileUpload,
    removeAttachment,
    toggleTag,
    getRecipientsByType,
  } = useMessageCompose({
    initialRecipients: recipients,
    initialSubject: subject,
    initialContent: content,
    replyToId,
    forwardFromId,
    onAttachmentUpload,
    onSearchRecipients,
  });

  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<MessageEditorRef | null>(null);

  const handleSend = async () => {
    const validationErrors = validateMessage();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(message);
    } catch {
      setErrors({ general: 'Failed to send message. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await onSaveDraft(message);
    } catch {
      setErrors({ general: 'Failed to save draft. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachmentSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    await handleFileUpload(files);

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t: MessageTemplate) => t.id === templateId);
    if (template) {
      updateMessage({
        subject: template.subject,
        content: template.content,
      });
      setSelectedTemplate(templateId);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const editor = editorRef.current;
    if (!editor) return;

    const { start, end } = editor.getSelectionRange();
    const { newContent, newCursorPos } = insertTextAtCursor(
      message.content,
      start,
      end,
      before,
      after
    );

    updateMessage({ content: newContent });

    // Set cursor position
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <MessageHeader
        isDraftMode={isDraftMode}
        replyToId={replyToId}
        forwardFromId={forwardFromId}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onCancel={onCancel}
      />

      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center text-red-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{errors.general}</span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Templates */}
        {templates.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Template:</label>
            <select
              value={selectedTemplate}
              onChange={(e) => applyTemplate(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select message template"
            >
              <option value="">Choose a template...</option>
              {templates.map((template: MessageTemplate) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Recipients */}
        <RecipientField
          recipientSearch={recipientSearch}
          searchResults={searchResults}
          showRecipientSearch={showRecipientSearch}
          recipients={message.recipients}
          showCc={showCc}
          showBcc={showBcc}
          errors={errors.recipients}
          onSearchChange={handleRecipientSearch}
          onAddRecipient={addRecipient}
          onRemoveRecipient={removeRecipient}
          onToggleCc={() => setShowCc(!showCc)}
          onToggleBcc={() => setShowBcc(!showBcc)}
          getRecipientsByType={getRecipientsByType}
        />

        {/* Subject */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 w-12">Subject:</label>
            <input
              type="text"
              placeholder="Enter subject..."
              value={message.subject}
              onChange={(e) => updateMessage({ subject: e.target.value })}
              className={`flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.subject && (
            <p className="text-sm text-red-600 ml-14">{errors.subject}</p>
          )}
        </div>

        {/* Toolbar */}
        {!isPreviewMode && (
          <MessageToolbar
            showAdvanced={showAdvanced}
            onInsertText={insertText}
            onAttachmentSelect={handleAttachmentSelect}
            onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
          />
        )}

        {/* Content */}
        <MessageEditor
          ref={editorRef}
          content={message.content}
          isPreviewMode={isPreviewMode}
          error={errors.content}
          onContentChange={(content) => updateMessage({ content })}
        />

        {/* Advanced Options */}
        {showAdvanced && (
          <AdvancedOptions
            message={message}
            availableTags={availableTags}
            onUpdateMessage={updateMessage}
            onToggleTag={toggleTag}
          />
        )}

        {/* Attachments */}
        <AttachmentList
          attachments={message.attachments}
          error={errors.attachments}
          onRemoveAttachment={removeAttachment}
        />
      </div>

      {/* Actions */}
      <ComposeActions
        message={message}
        isSending={isSending}
        isSaving={isSaving}
        onSend={handleSend}
        onSaveDraft={handleSaveDraft}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Select files to attach"
      />
    </div>
  );
}
