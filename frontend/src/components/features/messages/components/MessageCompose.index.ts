// Main component
export { MessageCompose } from './MessageCompose';

// Types
export type {
  Recipient,
  Attachment,
  MessageTemplate,
  ComposeMessage,
  MessageComposeProps,
  PriorityOption,
} from './MessageCompose.types';

// Constants
export { priorityOptions, MAX_FILE_SIZE, MIN_SEARCH_LENGTH } from './MessageCompose.constants';

// Utilities
export { formatBytes, validateEmail, insertTextAtCursor } from './MessageCompose.utils';

// Hook
export { useMessageCompose } from './useMessageCompose';

// Subcomponents (exported for testing or advanced usage)
export { MessageHeader } from './MessageHeader';
export { RecipientField } from './RecipientField';
export { MessageToolbar } from './MessageToolbar';
export { MessageEditor } from './MessageEditor';
export type { MessageEditorRef } from './MessageEditor';
export { AdvancedOptions } from './AdvancedOptions';
export { AttachmentList } from './AttachmentList';
export { ComposeActions } from './ComposeActions';
