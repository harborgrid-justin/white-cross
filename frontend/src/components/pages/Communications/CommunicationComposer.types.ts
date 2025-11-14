import { CommunicationType, CommunicationPriority } from './CommunicationCard';

/**
 * Communication recipient interface
 */
export interface CommunicationRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  avatar?: string;
}

/**
 * Communication attachment interface
 */
export interface CommunicationComposerAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed';
}

/**
 * Communication template interface
 */
export interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: CommunicationType;
  variables: string[];
}

/**
 * Props for the CommunicationComposer component
 */
export interface CommunicationComposerProps {
  /** Communication type */
  type?: CommunicationType;
  /** Available recipients */
  availableRecipients?: CommunicationRecipient[];
  /** Available templates */
  templates?: CommunicationTemplate[];
  /** Initial recipients */
  initialRecipients?: CommunicationRecipient[];
  /** Initial subject */
  initialSubject?: string;
  /** Initial content */
  initialContent?: string;
  /** Whether composer is in reply mode */
  isReply?: boolean;
  /** Original communication being replied to */
  originalCommunication?: Record<string, unknown>;
  /** Whether composer is in forward mode */
  isForward?: boolean;
  /** Whether composer is loading */
  loading?: boolean;
  /** Error message if any */
  error?: string;
  /** Maximum attachment size in bytes */
  maxAttachmentSize?: number;
  /** Allowed attachment types */
  allowedAttachmentTypes?: string[];
  /** Whether to show scheduling options */
  showScheduling?: boolean;
  /** Callback when communication is sent */
  onSend?: (data: {
    type: CommunicationType;
    recipients: CommunicationRecipient[];
    subject: string;
    content: string;
    priority: CommunicationPriority;
    attachments: CommunicationComposerAttachment[];
    scheduledAt?: string;
    tags: string[];
  }) => void;
  /** Callback when draft is saved */
  onSaveDraft?: (data: Record<string, unknown>) => void;
  /** Callback when composer is cancelled */
  onCancel?: () => void;
  /** Callback when template is selected */
  onTemplateSelect?: (template: CommunicationTemplate) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Props for RecipientSelector component
 */
export interface RecipientSelectorProps {
  recipients: CommunicationRecipient[];
  availableRecipients: CommunicationRecipient[];
  recipientSearch: string;
  onRecipientSearchChange: (search: string) => void;
  onAddRecipient: (recipient: CommunicationRecipient) => void;
  onRemoveRecipient: (recipientId: string) => void;
}

/**
 * Props for AttachmentManager component
 */
export interface AttachmentManagerProps {
  attachments: CommunicationComposerAttachment[];
  allowedAttachmentTypes: string[];
  maxAttachmentSize: number;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
}
