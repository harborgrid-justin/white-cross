# Architecture Notes - Messaging UI Components

**Task ID**: MG5X2Y
**Agent**: Frontend Message UI Components Architect
**Date**: October 29, 2025

---

## References to Other Agent Work

- **UX4R7K - UX Review**: Accessibility patterns, WCAG compliance, design consistency
- **TS9A4F - TypeScript Setup**: TypeScript configuration and patterns
- **Existing Components**: Button, Card, Avatar, Skeleton patterns

---

## High-Level Design Decisions

### Component Architecture
- **Atomic Design**: Organize from atoms (MessageStatus) to organisms (MessagingLayout)
- **Composition Pattern**: Build complex components from simpler primitives
- **Separation of Concerns**: Chat UI separate from existing email UI
- **Client Components**: All components use 'use client' for interactivity

### Design System Integration
- **Tailwind CSS**: Use existing color palette (primary, secondary, gray scales)
- **Dark Mode**: Support dark mode throughout (dark: prefix)
- **Responsive**: Mobile-first breakpoints (sm, md, lg, xl)
- **Typography**: Follow existing font sizes and weights

### State Management Strategy
- **Local State**: Use useState for component-specific state
- **Optimistic Updates**: Show sent messages immediately before server confirmation
- **Real-time Sync**: Prepare for WebSocket/Socket.io integration
- **Error Handling**: Graceful degradation and retry mechanisms

---

## Component Hierarchy

```
MessagingLayout (Organism)
├── ConversationList (Organism)
│   ├── ConversationItem (Molecule)
│   │   ├── Avatar (Atom)
│   │   ├── MessageTimestamp (Atom)
│   │   └── UnreadBadge (Atom)
│   └── ConnectionStatusIndicator (Molecule)
├── ConversationView (Organism)
│   ├── ConversationHeader (Molecule)
│   │   ├── Avatar (Atom)
│   │   └── EncryptionBadge (Atom)
│   ├── MessageList (Organism)
│   │   ├── MessageItem (Molecule)
│   │   │   ├── Avatar (Atom)
│   │   │   ├── MessageTimestamp (Atom)
│   │   │   ├── MessageStatus (Atom)
│   │   │   └── EncryptionBadge (Atom)
│   │   └── TypingIndicator (Molecule)
│   └── MessageInput/MessageComposer (Organism)
│       ├── AttachmentPreview (Molecule)
│       └── EmojiPicker (Molecule)
```

---

## Integration Patterns

### Real-time Message Display
- **Infinite Scroll**: Load older messages on scroll up
- **Virtual Scrolling**: Render only visible messages for performance
- **Auto-scroll**: Scroll to bottom on new messages (with user scroll detection)
- **Optimistic UI**: Show message immediately, update with server response

### Message Grouping
- **Date Headers**: Group messages by date
- **Sender Grouping**: Collapse consecutive messages from same sender
- **System Messages**: Special styling for system notifications

### Attachment Handling
- **Preview**: Show thumbnails for images, icons for files
- **Upload Progress**: Display progress bars during upload
- **Download**: Click to download or view full size
- **Validation**: File type and size validation

---

## User Experience Strategies

### Chat Interface Pattern
- **Bubble Design**: Distinct bubbles for sent/received messages
- **Visual Alignment**: Sent messages right-aligned, received left-aligned
- **Timestamps**: Relative times (2m ago, 1h ago) with full date on hover
- **Status Indicators**: Sending/sent/delivered/read indicators

### Conversation List Pattern
- **Recent First**: Sort by most recent activity
- **Unread Count**: Badge with unread message count
- **Preview**: Show last message preview (truncated)
- **Pinned**: Option to pin important conversations

### Typing Awareness
- **Typing Indicator**: Animated dots when someone is typing
- **Multiple Users**: Show "Alice and Bob are typing..."
- **Timeout**: Clear indicator after inactivity

### Loading States
- **Skeleton Screens**: Use Skeleton component during initial load
- **Inline Loading**: Spinner for pagination/infinite scroll
- **Progressive Enhancement**: Show content as it arrives

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Tab, Enter, Escape for all actions
- **Screen Reader**: ARIA labels, roles, and live regions

### Keyboard Shortcuts
- **Compose**: Ctrl/Cmd + K to start new conversation
- **Send**: Enter to send message (Shift+Enter for newline)
- **Navigation**: Arrow keys to navigate conversation list
- **Search**: Ctrl/Cmd + F to search messages

### Screen Reader Support
- **Message List**: role="log" with aria-live="polite"
- **New Messages**: Announce new messages to screen readers
- **Status Updates**: Announce typing indicators and status changes
- **Buttons**: Clear aria-labels for icon-only buttons

### Focus Management
- **Modal Dialogs**: Trap focus within modals
- **Message Sent**: Keep focus in input after sending
- **Escape to Close**: Escape key closes modals and dialogs

---

## Design Tools and Workflow

### Component Documentation
- **JSDoc Comments**: Comprehensive documentation for all components
- **Props Interface**: TypeScript interfaces with clear descriptions
- **Usage Examples**: Include usage examples in comments
- **File Headers**: Include WF-* identifiers and metadata

### Component Structure Pattern
```typescript
'use client';

/**
 * WF-MSG-XXX | ComponentName.tsx - Description
 * Purpose: Clear purpose statement
 * Dependencies: List dependencies
 * Features: Key features
 * Last Updated: Date
 */

// Imports
import React from 'react';
import { SomeIcon } from 'lucide-react';

// TypeScript Interfaces
interface ComponentProps {
  // Props with JSDoc comments
}

// Helper functions/constants
const HELPER_CONSTANT = 'value';

// Main Component
export const ComponentName = React.memo<ComponentProps>(({
  prop1,
  prop2,
  ...props
}) => {
  // Component logic

  return (
    // JSX
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

### Styling Patterns
- **Tailwind Classes**: Use Tailwind utility classes
- **clsx/twMerge**: Combine classes with cn() utility
- **Conditional Styling**: Use clsx for conditional classes
- **Dark Mode**: Always include dark: variants
- **Responsive**: Include mobile breakpoints

### Performance Optimization
- **React.memo**: Memoize components to prevent re-renders
- **useCallback**: Memoize callbacks passed to children
- **useMemo**: Memoize expensive computations
- **Virtual Scrolling**: Use windowing for large lists
- **Lazy Loading**: Code split heavy components

---

## Security Considerations

### Content Sanitization
- **XSS Prevention**: Sanitize user-generated content
- **Link Preview**: Validate URLs before preview
- **File Upload**: Validate file types and sizes

### Encryption Indicators
- **E2E Badge**: Clear visual indicator of encryption status
- **Key Verification**: UI for verifying encryption keys
- **Status Messages**: Show encryption setup status

---

## Testing Strategy

### Component Testing
- **Unit Tests**: Test individual components with Jest
- **Accessibility Tests**: Use jest-axe for a11y testing
- **Snapshot Tests**: Capture component snapshots
- **Integration Tests**: Test component interactions

### User Testing
- **Keyboard Navigation**: Manual test all keyboard shortcuts
- **Screen Reader**: Test with NVDA/JAWS/VoiceOver
- **Mobile**: Test on real devices (iOS/Android)
- **Dark Mode**: Verify all components in dark mode

---

## File Organization

```
/components/features/messages/
├── index.ts                          # Exports
├── components/                        # Existing email components
│   ├── MessageList.tsx
│   ├── MessageCompose.tsx
│   └── ...
├── chat/                             # New chat components
│   ├── atoms/
│   │   ├── MessageTimestamp.tsx
│   │   ├── MessageStatus.tsx
│   │   ├── EncryptionBadge.tsx
│   │   └── TypingIndicator.tsx
│   ├── molecules/
│   │   ├── MessageItem.tsx
│   │   ├── ConversationItem.tsx
│   │   ├── ConversationHeader.tsx
│   │   ├── AttachmentPreview.tsx
│   │   └── EmojiPicker.tsx
│   ├── organisms/
│   │   ├── ConversationList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageComposer.tsx
│   │   └── MessagingLayout.tsx
│   └── modals/
│       ├── NewConversationModal.tsx
│       ├── AddParticipantsDialog.tsx
│       ├── ConversationSettingsModal.tsx
│       └── KeyVerificationDialog.tsx
```

---

## Future Enhancements

- Message reactions (emoji reactions)
- Message forwarding
- Message search within conversation
- Voice messages
- Video messages
- Screen sharing indicators
- File preview (PDF, Office docs)
- Rich link previews
- Message pinning
- Thread replies
- Message editing
- Message deletion (with tombstone)

---

**Status**: Architecture planning complete
**Next Step**: Begin component implementation
