export interface Recipient {
  id: string;
  email: string;
  name?: string;
  type: 'to' | 'cc' | 'bcc';
}

export interface Attachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  url?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables?: string[];
}

export interface ComposeMessage {
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

export interface MessageComposeProps {
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

export interface PriorityOption {
  value: 'low' | 'normal' | 'high' | 'urgent';
  label: string;
  color: string;
}
