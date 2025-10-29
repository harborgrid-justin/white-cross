# Messaging State Management

Comprehensive state management for the White Cross messaging platform using Zustand and React Query.

## Overview

This implementation provides a robust, type-safe state management solution that separates:
- **Local/Client State** (Zustand): Drafts, typing indicators, presence, UI state
- **Server State** (React Query): Messages, conversations, API mutations

## Quick Start

### Basic Usage

```typescript
import { useMessages, useSendMessage } from '@/hooks/queries';
import { useConversationStore, useTypingStore } from '@/stores/messaging';

function MessageList({ conversationId }: { conversationId: string }) {
  // Fetch messages with infinite scroll
  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useMessages({ conversationId });

  // Send message mutation
  const sendMessage = useSendMessage();

  // Get typing indicators
  const typingText = useTypingStore(
    (state) => state.getTypingText(conversationId, currentUserId)
  );

  const handleSend = (content: string) => {
    sendMessage.mutate({
      conversationId,
      content,
      type: 'text',
    });
  };

  return (
    <div>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {typingText && <div>{typingText}</div>}
      <MessageInput onSend={handleSend} />
    </div>
  );
}
```

### Conversation List

```typescript
import { useConversations } from '@/hooks/queries';
import { useConversationStore } from '@/stores/messaging';

function ConversationList() {
  // Fetch conversations
  const { conversations, isLoading } = useConversations();

  // Get current conversation from store
  const currentConversationId = useConversationStore(
    (state) => state.currentConversationId
  );

  // Set current conversation
  const setCurrentConversation = useConversationStore(
    (state) => state.setCurrentConversation
  );

  return (
    <div>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === currentConversationId}
          onClick={() => setCurrentConversation(conv.id)}
        />
      ))}
    </div>
  );
}
```

### Real-time Updates

```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initializeSocketSync } from '@/lib/messaging';
import { io } from 'socket.io-client';

function MessagingProvider({ children, userId }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io('ws://localhost:3001');

    // Initialize WebSocket synchronization
    const syncManager = initializeSocketSync(queryClient, socket, userId);

    return () => {
      syncManager.cleanup();
      socket.disconnect();
    };
  }, [queryClient, userId]);

  return <>{children}</>;
}
```

### Drafts

```typescript
import { useMessageStore } from '@/stores/messaging';

function MessageInput({ conversationId }) {
  const saveDraft = useMessageStore((state) => state.saveDraft);
  const getDraft = useMessageStore((state) => state.getDraft);
  const clearDraft = useMessageStore((state) => state.clearDraft);

  const [content, setContent] = useState(() => {
    const draft = getDraft(conversationId);
    return draft?.content || '';
  });

  const handleChange = (value: string) => {
    setContent(value);
    saveDraft(conversationId, value);
  };

  const handleSend = () => {
    // Send message...
    clearDraft(conversationId);
    setContent('');
  };

  return <textarea value={content} onChange={(e) => handleChange(e.target.value)} />;
}
```

### Typing Indicators

```typescript
import { useTypingStore } from '@/stores/messaging';
import { getSocketSync } from '@/lib/messaging';
import { useDebounce } from '@/hooks/useDebounce';

function MessageInput({ conversationId }) {
  const [content, setContent] = useState('');
  const debouncedContent = useDebounce(content, 300);

  useEffect(() => {
    const socket = getSocketSync();
    if (!socket) return;

    // Emit typing indicator
    socket.emitTyping(conversationId, content.length > 0);

    return () => {
      socket.emitTyping(conversationId, false);
    };
  }, [conversationId, debouncedContent]);

  return <input value={content} onChange={(e) => setContent(e.target.value)} />;
}
```

### Presence Status

```typescript
import { usePresenceStore } from '@/stores/messaging';
import { getSocketSync } from '@/lib/messaging';

function StatusSelector() {
  const updatePresence = (status: 'online' | 'away' | 'busy') => {
    const socket = getSocketSync();
    socket?.updatePresence(status);
  };

  return (
    <select onChange={(e) => updatePresence(e.target.value as any)}>
      <option value="online">Online</option>
      <option value="away">Away</option>
      <option value="busy">Busy</option>
    </select>
  );
}

function UserAvatar({ userId }) {
  const presence = usePresenceStore((state) => state.getPresence(userId));
  const isOnline = presence?.status === 'online';

  return (
    <div>
      <img src={avatar} alt={name} />
      {isOnline && <OnlineBadge />}
    </div>
  );
}
```

### Search Messages

```typescript
import { useMessageSearch } from '@/hooks/queries';

function MessageSearch({ conversationId }) {
  const [query, setQuery] = useState('');

  const {
    messages,
    isSearching,
    hasQuery,
  } = useMessageSearch(query, {
    conversationId,
    debounceMs: 300,
    minQueryLength: 2,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search messages..."
      />
      {isSearching && <Spinner />}
      {hasQuery && (
        <ul>
          {messages.map((msg) => (
            <MessageSearchResult key={msg.id} message={msg} />
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Unread Count Badge

```typescript
import { useUnreadCount } from '@/hooks/queries';

function UnreadBadge() {
  const { totalUnread } = useUnreadCount({
    refetchInterval: 30000, // Poll every 30 seconds
  });

  if (totalUnread === 0) return null;

  return <span className="badge">{totalUnread}</span>;
}
```

### Advanced Selectors

```typescript
import { useCombinedSelectors } from '@/lib/messaging';

function ConversationHeader({ conversationId, currentUserId }) {
  const selectors = useCombinedSelectors();
  const enriched = selectors.getEnrichedConversation(conversationId, currentUserId);

  if (!enriched) return null;

  return (
    <div>
      <h2>{enriched.displayName}</h2>
      <p>
        {enriched.onlineParticipants.length} online,{' '}
        {enriched.typingText || 'No one typing'}
      </p>
    </div>
  );
}
```

## Architecture

### Stores

- **messageStore**: Message cache, drafts, optimistic updates
- **conversationStore**: Conversation list, filters, current conversation
- **typingStore**: Typing indicators with auto-cleanup
- **presenceStore**: User online/offline status

### React Query Hooks

- **useMessages**: Infinite scroll message history
- **useConversations**: Conversation list with filters
- **useSendMessage**: Send message with optimistic updates
- **useMessageSearch**: Debounced message search
- **useUnreadCount**: Real-time unread count tracking

### API Services

- **messageApi**: Message CRUD operations
- **conversationApi**: Conversation management
- **encryptionApi**: E2E encryption key exchange

### Utilities

- **SocketSyncManager**: WebSocket event synchronization
- **Selectors**: Memoized data access and computed values

## Key Features

✅ **Optimistic Updates** - Instant UI feedback
✅ **Infinite Scroll** - Paginated message history
✅ **Real-time Sync** - WebSocket integration
✅ **Type Safety** - 100% TypeScript coverage
✅ **Draft Persistence** - Never lose message drafts
✅ **Typing Indicators** - Live typing status
✅ **Presence System** - Online/offline tracking
✅ **Search** - Full-text message search
✅ **Cache Management** - Efficient memory usage
✅ **DevTools** - Redux DevTools + React Query DevTools

## Performance

- Zustand: Minimal re-renders via selector subscriptions
- React Query: Structural sharing and stale-while-revalidate
- Typing indicators: Auto-cleanup prevents memory leaks
- Message cache: Garbage collected after 30 minutes of inactivity

## Testing

```typescript
// Test Zustand store
import { useMessageStore } from '@/stores/messaging';

test('adds message to store', () => {
  const store = useMessageStore.getState();
  store.addMessage('conv-1', mockMessage);
  expect(store.getMessages('conv-1')).toHaveLength(1);
});

// Test React Query hook
import { renderHook, waitFor } from '@testing-library/react';
import { useMessages } from '@/hooks/queries';

test('fetches messages', async () => {
  const { result } = renderHook(() => useMessages({ conversationId: 'conv-1' }));

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.messages).toHaveLength(10);
});
```

## Migration from Redux

This implementation coexists with Redux - no migration required. Simply use Zustand stores for new messaging features while keeping existing Redux state for other domains.

## License

Internal use only - White Cross Healthcare Platform
