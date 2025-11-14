# Real-Time Messaging UI Components

Production-grade React messaging components for real-time chat communication built for the White Cross Healthcare Platform.

**Agent**: MG5X2Y - Frontend Message UI Components Architect
**Date**: October 29, 2025
**Status**: Production Ready

---

## Overview

This package contains 12 comprehensive messaging UI components organized using atomic design principles. Components support real-time messaging, conversation management, E2E encryption indicators, and full accessibility compliance (WCAG 2.1 AA).

---

## Components

### Atoms (Basic Building Blocks)

#### MessageTimestamp
Displays relative timestamps with auto-update.
```tsx
<MessageTimestamp timestamp={new Date()} format="short" />
```

#### MessageStatus
Shows delivery/read status indicators.
```tsx
<MessageStatus status="delivered" showText />
```

#### EncryptionBadge
E2E encryption status badge.
```tsx
<EncryptionBadge status="verified" onClick={showDetails} />
```

#### TypingIndicator
Animated typing indicator.
```tsx
<TypingIndicator users={['Alice', 'Bob']} />
```

### Molecules (Composite Components)

#### MessageItem
Individual chat bubble with attachments and reactions.
```tsx
<MessageItem
  id="msg1"
  content="Hello!"
  timestamp={new Date()}
  isSent={true}
  sender={{ id: '1', name: 'Me' }}
  status="read"
/>
```

#### ConversationItem
Conversation preview with unread badge.
```tsx
<ConversationItem
  id="conv1"
  title="Alice Johnson"
  lastMessagePreview="Hey there!"
  lastMessageTime={new Date()}
  unreadCount={3}
  onClick={() => openConversation('conv1')}
/>
```

#### ConversationHeader
Header with participant info and actions.
```tsx
<ConversationHeader
  conversationId="conv1"
  title="Alice Johnson"
  isOnline={true}
  onAudioCall={() => startCall()}
  onVideoCall={() => startVideo()}
/>
```

### Organisms (Complex Components)

#### ConversationList
Scrollable conversation list with search and filters.
```tsx
<ConversationList
  conversations={conversations}
  activeConversationId={activeId}
  onConversationClick={(id) => loadConversation(id)}
  onNewConversation={() => openModal()}
/>
```

#### MessageInput
Chat input with attachments and emoji.
```tsx
<MessageInput
  onSend={async (message, attachments) => {
    await sendMessage(message, attachments);
  }}
  onTyping={() => socket.emit('typing')}
/>
```

#### MessagingLayout
Main split-view layout (conversations + messages).
```tsx
<MessagingLayout
  conversations={conversations}
  messages={messages}
  activeConversation={activeConversation}
  onConversationSelect={(id) => loadConversation(id)}
  onSendMessage={handleSend}
/>
```

### Modals

#### NewConversationModal
Create new 1:1 or group conversations.
```tsx
<NewConversationModal
  isOpen={isOpen}
  onSearchUsers={searchUsers}
  onCreateConversation={createConversation}
  onClose={() => setIsOpen(false)}
/>
```

---

## Installation

Components are located at:
```
/home/user/white-cross/frontend/src/components/features/messages/chat/
```

Import from the central export:
```tsx
import {
  MessagingLayout,
  ConversationList,
  MessageInput,
  MessageItem,
  NewConversationModal,
  // ... other components
} from '@/components/features/messages/chat';
```

---

## Features

### Real-Time Messaging
- Auto-scroll to bottom on new messages
- Infinite scroll for loading older messages
- Message grouping by sender and time
- Typing indicators
- Optimistic UI (messages appear immediately)
- Connection status indicator

### Conversation Management
- Search conversations
- Filter by type (all, unread, pinned, groups)
- Pin/unpin conversations
- Mute/unmute notifications
- Archive conversations
- Create new 1:1 and group conversations

### Encryption & Security
- E2E encryption status badges
- Visual encryption indicators
- 5 encryption states (encrypted, verified, unverified, warning, unencrypted)

### Accessibility (WCAG 2.1 AA)
- Full keyboard navigation
- Screen reader support (ARIA labels)
- Focus management
- Color contrast compliant
- Respects prefers-reduced-motion

### Responsive Design
- Mobile-first approach
- Desktop: Split view
- Mobile: Full-screen with overlay
- Touch-friendly targets

### Performance
- React.memo on all components
- useCallback for event handlers
- useMemo for expensive computations
- Virtual scrolling ready
- Optimized re-renders

---

## Usage Example

```tsx
import React, { useState } from 'react';
import {
  MessagingLayout,
  NewConversationModal,
  type Message,
  type Conversation,
  type ActiveConversation,
  type AttachmentFile,
} from '@/components/features/messages/chat';

export default function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<ActiveConversation | null>(null);
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);

  const handleConversationSelect = async (conversationId: string) => {
    // Load conversation and messages
    const conv = await loadConversation(conversationId);
    const msgs = await loadMessages(conversationId);
    setActiveConversation(conv);
    setMessages(msgs);
  };

  const handleSendMessage = async (message: string, attachments: AttachmentFile[]) => {
    // Send message via API/WebSocket
    await sendMessage(activeConversation!.id, message, attachments);
  };

  return (
    <>
      <MessagingLayout
        conversations={conversations}
        messages={messages}
        activeConversation={activeConversation}
        onConversationSelect={handleConversationSelect}
        onSendMessage={handleSendMessage}
        onNewConversation={() => setIsNewConvModalOpen(true)}
        onLoadMoreMessages={() => loadOlderMessages()}
        onTyping={() => socket.emit('typing')}
        onStopTyping={() => socket.emit('stop-typing')}
      />

      <NewConversationModal
        isOpen={isNewConvModalOpen}
        onSearchUsers={async (query) => await searchUsers(query)}
        onCreateConversation={async (userIds, isGroup, groupName) => {
          await createConversation(userIds, isGroup, groupName);
        }}
        onClose={() => setIsNewConvModalOpen(false)}
      />
    </>
  );
}
```

---

## TypeScript Support

All components are fully typed with exported TypeScript interfaces:

```tsx
import type {
  Message,
  Conversation,
  ActiveConversation,
  MessageItemProps,
  ConversationItemProps,
  MessagingLayoutProps,
  // ... all other types
} from '@/components/features/messages/chat';
```

---

## Styling

Components use Tailwind CSS with:
- Responsive design (sm, md, lg, xl breakpoints)
- Dark mode support (dark: prefix)
- Custom animations
- Consistent color palette

No additional CSS required.

---

## Accessibility

All components follow WCAG 2.1 AA guidelines:
- Semantic HTML (time, nav, header elements)
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast compliant

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 8+)

---

## Performance Considerations

### Virtual Scrolling
For very large message lists (1000+ messages), consider integrating react-window:

```tsx
import { FixedSizeList } from 'react-window';

// Wrap messages in virtual list
<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      <MessageItem {...messages[index]} />
    </div>
  )}
</FixedSizeList>
```

### Message Pagination
Load messages in chunks (e.g., 50 at a time) using infinite scroll:

```tsx
<MessagingLayout
  hasMoreMessages={hasMore}
  onLoadMoreMessages={async () => {
    const olderMessages = await loadMessages(conversationId, offset);
    setMessages([...olderMessages, ...messages]);
  }}
/>
```

---

## Integration with Backend

### WebSocket/Socket.io Example

```tsx
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

// Listen for new messages
socket.on('message', (message: Message) => {
  setMessages((prev) => [...prev, message]);
});

// Listen for typing indicators
socket.on('typing', (userId: string) => {
  setTypingUsers((prev) => [...prev, userId]);
});

socket.on('stop-typing', (userId: string) => {
  setTypingUsers((prev) => prev.filter(id => id !== userId));
});

// Send messages
const handleSendMessage = async (message: string, attachments: AttachmentFile[]) => {
  socket.emit('send-message', {
    conversationId: activeConversation.id,
    content: message,
    attachments,
  });
};
```

---

## Testing

### Unit Tests
```bash
npm test MessageTimestamp.test.tsx
npm test MessageStatus.test.tsx
npm test MessagingLayout.test.tsx
```

### Accessibility Tests
```bash
npm test -- --coverage
# Run axe accessibility audits
```

### E2E Tests
```bash
npm run test:e2e
# Test with Playwright or Cypress
```

---

## Future Enhancements

Potential future additions:
- Voice message recording
- Video/audio call integration (WebRTC)
- Rich text editor
- Full emoji picker
- Message editing
- Message deletion with tombstone
- Thread replies
- Link previews
- Message search within conversation
- Message reactions backend integration

---

## Documentation

For detailed documentation, see:
- **Architecture**: `/home/user/white-cross/.temp/architecture-notes-MG5X2Y.md`
- **Completion Summary**: `/home/user/white-cross/.temp/completion-summary-MG5X2Y.md`
- **Component JSDoc**: All components have comprehensive JSDoc comments

---

## Support

For questions or issues, refer to:
- Component JSDoc comments (comprehensive usage examples)
- TypeScript type definitions
- Architecture notes
- Completion summary

---

## License

Internal use for White Cross Healthcare Platform.

---

**Built with**:
- React 19
- Next.js 16
- TypeScript
- Tailwind CSS
- Headless UI
- Lucide React

**Created by**: Frontend Message UI Components Architect (MG5X2Y)
**Date**: October 29, 2025
