import { useState, useCallback } from 'react';
import { ComposeMessage, Recipient, Attachment } from './MessageCompose.types';
import { validateEmail } from './MessageCompose.utils';
import { MAX_FILE_SIZE, MIN_SEARCH_LENGTH } from './MessageCompose.constants';

interface UseMessageComposeProps {
  initialRecipients?: Recipient[];
  initialSubject?: string;
  initialContent?: string;
  replyToId?: string;
  forwardFromId?: string;
  onAttachmentUpload: (file: File) => Promise<Attachment>;
  onSearchRecipients: (query: string) => Promise<Recipient[]>;
}

export function useMessageCompose({
  initialRecipients = [],
  initialSubject = '',
  initialContent = '',
  replyToId,
  forwardFromId,
  onAttachmentUpload,
  onSearchRecipients,
}: UseMessageComposeProps) {
  const [message, setMessage] = useState<ComposeMessage>({
    recipients: initialRecipients,
    subject: initialSubject,
    content: initialContent,
    attachments: [],
    priority: 'normal',
    tags: [],
    isConfidential: false,
    readReceiptRequested: false,
    replyToId,
    forwardFromId,
  });

  const [recipientSearch, setRecipientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Recipient[]>([]);
  const [showRecipientSearch, setShowRecipientSearch] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateMessage = useCallback((): Record<string, string> => {
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

    const invalidEmails = message.recipients.filter(r => !validateEmail(r.email));
    if (invalidEmails.length > 0) {
      newErrors.recipients = `Invalid email addresses: ${invalidEmails.map(r => r.email).join(', ')}`;
    }

    return newErrors;
  }, [message]);

  const handleRecipientSearch = useCallback(async (query: string) => {
    setRecipientSearch(query);

    if (query.length >= MIN_SEARCH_LENGTH) {
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

  const addRecipient = useCallback((recipient: Recipient) => {
    if (!message.recipients.find(r => r.email === recipient.email)) {
      setMessage(prev => ({
        ...prev,
        recipients: [...prev.recipients, { ...recipient, type: 'to' }]
      }));
    }
    setRecipientSearch('');
    setShowRecipientSearch(false);
  }, [message.recipients]);

  const removeRecipient = useCallback((recipientId: string) => {
    setMessage(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== recipientId)
    }));
  }, []);

  const handleFileUpload = useCallback(async (files: File[]) => {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          attachments: `File ${file.name} is too large. Maximum size is 25MB.`
        }));
        continue;
      }

      try {
        const attachment = await onAttachmentUpload(file);
        setMessage(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachment]
        }));
      } catch {
        setErrors(prev => ({
          ...prev,
          attachments: `Failed to upload ${file.name}`
        }));
      }
    }
  }, [onAttachmentUpload]);

  const removeAttachment = useCallback((attachmentId: string) => {
    setMessage(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  }, []);

  const updateMessage = useCallback((updates: Partial<ComposeMessage>) => {
    setMessage(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setMessage(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const getRecipientsByType = useCallback((type: 'to' | 'cc' | 'bcc') => {
    return message.recipients.filter(r => r.type === type);
  }, [message.recipients]);

  return {
    message,
    setMessage,
    updateMessage,
    recipientSearch,
    setRecipientSearch,
    searchResults,
    showRecipientSearch,
    setShowRecipientSearch,
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
  };
}
