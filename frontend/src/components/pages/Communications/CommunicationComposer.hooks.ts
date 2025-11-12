import { useState, useRef, useEffect, useCallback } from 'react';
import { CommunicationType, CommunicationPriority } from './CommunicationCard';
import {
  CommunicationRecipient,
  CommunicationComposerAttachment,
  CommunicationTemplate
} from './CommunicationComposer.types';

/**
 * Hook for managing communication state
 */
export const useCommunicationState = (
  initialType: CommunicationType,
  initialSubject: string,
  initialContent: string,
  initialRecipients: CommunicationRecipient[]
) => {
  const [communicationType, setCommunicationType] = useState<CommunicationType>(initialType);
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [priority, setPriority] = useState<CommunicationPriority>('normal');
  const [scheduledAt, setScheduledAt] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  return {
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
  };
};

/**
 * Hook for managing recipients
 */
export const useRecipients = (initialRecipients: CommunicationRecipient[]) => {
  const [recipients, setRecipients] = useState<CommunicationRecipient[]>(initialRecipients);
  const [recipientSearch, setRecipientSearch] = useState('');

  const handleAddRecipient = useCallback((recipient: CommunicationRecipient) => {
    setRecipients(prev => [...prev, recipient]);
    setRecipientSearch('');
  }, []);

  const handleRemoveRecipient = useCallback((recipientId: string) => {
    setRecipients(prev => prev.filter(r => r.id !== recipientId));
  }, []);

  return {
    recipients,
    recipientSearch,
    setRecipientSearch,
    handleAddRecipient,
    handleRemoveRecipient
  };
};

/**
 * Hook for managing attachments
 */
export const useAttachments = (
  maxAttachmentSize: number,
  allowedAttachmentTypes: string[]
) => {
  const [attachments, setAttachments] = useState<CommunicationComposerAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileReadersRef = useRef<FileReader[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxAttachmentSize) {
        const formatFileSize = (bytes: number) => {
          if (bytes === 0) return '0 Bytes';
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxAttachmentSize)}.`);
        return;
      }

      // Check file type
      const isAllowedType = allowedAttachmentTypes.some(allowedType => {
        if (allowedType.endsWith('/*')) {
          const baseType = allowedType.replace('/*', '');
          return file.type.startsWith(baseType);
        }
        return file.type === allowedType;
      });

      if (!isAllowedType) {
        alert(`File type ${file.type} is not allowed.`);
        return;
      }

      const attachment: CommunicationComposerAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadStatus: 'pending'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        fileReadersRef.current.push(reader);

        reader.onload = (e: ProgressEvent<FileReader>) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => prev.map(a => a.id === attachment.id ? attachment : a));
        };

        reader.onerror = () => {
          console.error('Failed to read file:', file.name);
        };

        reader.readAsDataURL(file);
      }

      setAttachments(prev => [...prev, attachment]);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [maxAttachmentSize, allowedAttachmentTypes]);

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  }, []);

  // Cleanup file readers on unmount
  useEffect(() => {
    return () => {
      fileReadersRef.current.forEach(reader => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      });
      fileReadersRef.current = [];
    };
  }, []);

  return {
    attachments,
    fileInputRef,
    handleFileSelect,
    handleRemoveAttachment
  };
};

/**
 * Hook for managing tags
 */
export const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
    }
    setTagInput('');
  }, [tags]);

  const handleTagKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddTag(tagInput);
    }
  }, [tagInput, handleAddTag]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  return {
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleTagKeyPress,
    handleRemoveTag
  };
};

/**
 * Hook for auto-saving draft
 */
export const useAutoSaveDraft = (
  subject: string,
  content: string,
  recipientsLength: number,
  isDraft: boolean,
  handleSaveDraft: () => void
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((subject || content || recipientsLength) && !isDraft) {
        handleSaveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timer);
  }, [subject, content, recipientsLength, isDraft, handleSaveDraft]);
};

/**
 * Hook for template selection
 */
export const useTemplateSelection = (
  setCommunicationType: (type: CommunicationType) => void,
  setSubject: (subject: string) => void,
  setContent: (content: string) => void,
  setShowTemplates: (show: boolean) => void,
  onTemplateSelect?: (template: CommunicationTemplate) => void
) => {
  const handleTemplateSelect = useCallback((template: CommunicationTemplate) => {
    setCommunicationType(template.type);
    setSubject(template.subject);
    setContent(template.content);
    setShowTemplates(false);
    onTemplateSelect?.(template);
  }, [setCommunicationType, setSubject, setContent, setShowTemplates, onTemplateSelect]);

  return { handleTemplateSelect };
};
