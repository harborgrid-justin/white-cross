'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Save,
  X,
  ChevronDown,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface Recipient {
  id: string;
  email: string;
  name?: string;
  type: 'to' | 'cc' | 'bcc';
}

interface Attachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  url?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables?: string[];
}

interface MessageComposeProps {
  onSend: (message: ComposeMessage) => Promise<void>;
  onSaveDraft: (message: ComposeMessage) => Promise<void>;
  onCancel: () => void;
  onAttachmentUpload: (file: File) => Promise<Attachment>;
  onSearchRecipients: (query: string) => Promise<Recipient[]>;
  recipients?: Recipient[];
  subject?: string;
  content?: string;
  replyToId?: string;
  forwardFromId?: string;
  templates?: MessageTemplate[];
  availableTags?: string[];
  isDraftMode?: boolean;
  className?: string;
}

interface ComposeMessage {
  recipients: Recipient[];
  subject: string;
  content: string;
  attachments: Attachment[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags: string[];
  scheduledSendTime?: string;
  isConfidential: boolean;
  readReceiptRequested: boolean;
  replyToId?: string;
  forwardFromId?: string;
}

const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
  { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
  { value: 'high', label: 'High Priority', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent Priority', color: 'text-red-600' },
];

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
  const [message, setMessage] = useState<ComposeMessage>({
    recipients,
    subject,
    content,
    attachments: [],
    priority: 'normal',
    tags: [],
    isConfidential: false,
    readReceiptRequested: false,
    replyToId,
    forwardFromId,
  });

  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Recipient[]>([]);
  const [showRecipientSearch, setShowRecipientSearch] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const validateMessage = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (message.recipients.filter(r => r.type === 'to').length === 0) {
      newErrors.recipients = 'At least one recipient is required';
    }

    if (!message.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!message.content.trim()) {
      newErrors.content = 'Message content is required';
    }

    // Check for valid email formats
    const invalidEmails = message.recipients.filter(r => 
      !r.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    );
    if (invalidEmails.length > 0) {
      newErrors.recipients = `Invalid email addresses: ${invalidEmails.map(r => r.email).join(', ')}`;
    }

    return newErrors;
  };

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
    
    for (const file of files) {
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        setErrors(prev => ({ ...prev, attachments: `File ${file.name} is too large. Maximum size is 25MB.` }));
        continue;
      }

      try {
        const attachment = await onAttachmentUpload(file);
        setMessage(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachment]
        }));
      } catch {
        setErrors(prev => ({ ...prev, attachments: `Failed to upload ${file.name}` }));
      }
    }

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setMessage(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  const handleRecipientSearch = useCallback(async (query: string) => {
    setRecipientSearch(query);
    
    if (query.length >= 2) {
      try {
        const results = await onSearchRecipients(query);
        setSearchResults(results);
        setShowRecipientSearch(true);
      } catch (error) {
        console.error('Failed to search recipients:', error);
      }
    } else {
      setSearchResults([]);
      setShowRecipientSearch(false);
    }
  }, [onSearchRecipients]);

  const addRecipient = (recipient: Recipient) => {
    if (!message.recipients.find(r => r.email === recipient.email)) {
      setMessage(prev => ({
        ...prev,
        recipients: [...prev.recipients, { ...recipient, type: 'to' }]
      }));
    }
    setRecipientSearch('');
    setShowRecipientSearch(false);
  };

  const removeRecipient = (recipientId: string) => {
    setMessage(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== recipientId)
    }));
  };



  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content,
      }));
      setSelectedTemplate(templateId);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.content.slice(start, end);
    const newText = before + selectedText + after;

    const newContent = 
      message.content.slice(0, start) + 
      newText + 
      message.content.slice(end);

    setMessage(prev => ({ ...prev, content: newContent }));

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRecipientsByType = (type: 'to' | 'cc' | 'bcc') => {
    return message.recipients.filter(r => r.type === type);
  };

  const toggleTag = (tag: string) => {
    setMessage(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {isDraftMode ? 'Edit Draft' : replyToId ? 'Reply' : forwardFromId ? 'Forward' : 'Compose Message'}
          </h2>
          {(replyToId || forwardFromId) && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {replyToId ? 'Reply' : 'Forward'}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title={isPreviewMode ? 'Edit mode' : 'Preview mode'}
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title="Close composer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => applyTemplate(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select message template"
            >
              <option value="">Choose a template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Recipients */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 w-12">To:</label>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter email addresses..."
                value={recipientSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRecipientSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Recipient Search Results */}
              {showRecipientSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {searchResults.map(recipient => (
                    <button
                      key={recipient.id}
                      onClick={() => addRecipient(recipient)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{recipient.name || recipient.email}</div>
                      {recipient.name && (
                        <div className="text-sm text-gray-500">{recipient.email}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCc(!showCc)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Cc
            </button>
            <button
              onClick={() => setShowBcc(!showBcc)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Bcc
            </button>
          </div>

          {/* Recipients List */}
          {message.recipients.length > 0 && (
            <div className="space-y-2">
              {/* To Recipients */}
              {getRecipientsByType('to').length > 0 && (
                <div className="flex items-start space-x-2">
                  <span className="text-sm text-gray-500 w-12 mt-1">To:</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {getRecipientsByType('to').map(recipient => (
                      <span key={recipient.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {recipient.name || recipient.email}
                        <button
                          onClick={() => removeRecipient(recipient.id)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          aria-label={`Remove ${recipient.email}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cc Recipients */}
              {showCc && getRecipientsByType('cc').length > 0 && (
                <div className="flex items-start space-x-2">
                  <span className="text-sm text-gray-500 w-12 mt-1">Cc:</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {getRecipientsByType('cc').map(recipient => (
                      <span key={recipient.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                        {recipient.name || recipient.email}
                        <button
                          onClick={() => removeRecipient(recipient.id)}
                          className="ml-1 text-gray-600 hover:text-gray-800"
                          aria-label={`Remove ${recipient.email} from Cc`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bcc Recipients */}
              {showBcc && getRecipientsByType('bcc').length > 0 && (
                <div className="flex items-start space-x-2">
                  <span className="text-sm text-gray-500 w-12 mt-1">Bcc:</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {getRecipientsByType('bcc').map(recipient => (
                      <span key={recipient.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                        {recipient.name || recipient.email}
                        <button
                          onClick={() => removeRecipient(recipient.id)}
                          className="ml-1 text-gray-600 hover:text-gray-800"
                          aria-label={`Remove ${recipient.email} from Bcc`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.recipients && (
            <p className="text-sm text-red-600">{errors.recipients}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 w-12">Subject:</label>
            <input
              type="text"
              placeholder="Enter subject..."
              value={message.subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(prev => ({ ...prev, subject: e.target.value }))}
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
          <div className="flex items-center justify-between py-2 border-y border-gray-200">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => insertText('**', '**')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertText('*', '*')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertText('> ', '')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertText('`', '`')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Code"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertText('- ', '')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="List"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleAttachmentSelect}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Attach files"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded ${showAdvanced ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                title="More options"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-1">
          {isPreviewMode ? (
            <div className="min-h-64 p-3 border border-gray-300 rounded bg-gray-50">
              <div className="prose prose-sm max-w-none">
                {message.content ? (
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                ) : (
                  <p className="text-gray-500 italic">No content</p>
                )}
              </div>
            </div>
          ) : (
            <textarea
              ref={editorRef}
              placeholder="Write your message..."
              value={message.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(prev => ({ ...prev, content: e.target.value }))}
              className={`w-full min-h-64 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          )}
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={message.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMessage(prev => ({ 
                    ...prev, 
                    priority: e.target.value as ComposeMessage['priority']
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select message priority"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scheduled Send */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Send</label>
                <input
                  type="datetime-local"
                  value={message.scheduledSendTime || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(prev => ({ 
                    ...prev, 
                    scheduledSendTime: e.target.value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Schedule message send time"
                />
              </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        message.tags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={message.isConfidential}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(prev => ({ 
                    ...prev, 
                    isConfidential: e.target.checked 
                  }))}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mark as confidential</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={message.readReceiptRequested}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(prev => ({ 
                    ...prev, 
                    readReceiptRequested: e.target.checked 
                  }))}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Request read receipt</span>
              </label>
            </div>
          </div>
        )}

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Attachments ({message.attachments.length})</h4>
            <div className="space-y-2">
              {message.attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                      <div className="text-xs text-gray-500">{formatBytes(attachment.size)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {attachment.uploadProgress < 100 && (
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-blue-600 h-2 rounded-full transition-all ${
                            attachment.uploadProgress === 100 ? 'w-full' :
                            attachment.uploadProgress >= 75 ? 'w-3/4' :
                            attachment.uploadProgress >= 50 ? 'w-1/2' :
                            attachment.uploadProgress >= 25 ? 'w-1/4' : 'w-1'
                          }`}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-400 hover:text-red-600"
                      title={`Remove ${attachment.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errors.attachments && (
              <p className="text-sm text-red-600">{errors.attachments}</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSend}
            disabled={isSending || !message.recipients.length || !message.subject || !message.content}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {message.scheduledSendTime ? 'Schedule' : 'Send'}
              </>
            )}
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {message.content && (
            <span>{message.content.length} characters</span>
          )}
          {message.attachments.length > 0 && (
            <span>• {message.attachments.length} attachment{message.attachments.length === 1 ? '' : 's'}</span>
          )}
        </div>
      </div>

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