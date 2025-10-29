# Architecture Notes - Messaging State Management

**Agent**: State Management Architect
**Task ID**: MS8G2V
**Date**: 2025-10-29

## References to Other Agent Work

- **TypeScript Architect (TS9A4F)**: Following type safety standards with full TypeScript coverage
- **UI/UX Architect (UX4R7K)**: Aligned with component patterns for messaging UI integration

## High-level Design Decisions

### State Library Selection

**Zustand for Local/Client State**
- Lightweight footprint for frequently changing state (typing indicators, presence)
- No boilerplate - simple, intuitive API
- Built-in middleware for devtools and persistence
- Excellent performance for high-frequency updates
- Native TypeScript support

**React Query for Server State**
- Already integrated in the project
- Perfect separation of concerns - server state vs. client state
- Built-in infinite scroll for message pagination
- Optimistic updates with automatic rollback
- Background refetching and cache invalidation
- Stale-while-revalidate pattern

### State Architecture

**Separation of Concerns**:
1. **Message Store**: Message cache, drafts, optimistic updates
2. **Conversation Store**: Conversation list, current conversation, filters
3. **Typing Store**: Typing indicators with auto-cleanup
4. **Presence Store**: User online/offline status

**Why Separate Stores?**
- Independent update cycles (typing changes more frequently than messages)
- Prevents unnecessary re-renders
- Clear domain boundaries
- Easier testing and maintenance

## Integration Patterns

### Zustand + React Query Integration

```
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐         ┌─────────────────┐       │
│  │  React Query    │         │    Zustand      │       │
│  │   Hooks         │         │    Stores       │       │
│  │                 │         │                 │       │
│  │ • useMessages   │◄────────┤ • messageStore  │       │
│  │ • useSendMsg    │         │ • convStore     │       │
│  │ • useConvos     │         │ • typingStore   │       │
│  └────────┬────────┘         └─────────┬───────┘       │
│           │                            │                │
│           │   ┌────────────────────┐   │                │
│           └───┤  SocketSyncManager ├───┘                │
│               └─────────┬──────────┘                    │
│                         │                               │
├─────────────────────────┼───────────────────────────────┤
│                         │                               │
│                    ┌────▼─────┐                         │
│                    │ WebSocket│                         │
│                    └──────────┘                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Sending a Message (Optimistic Update)**:
1. User sends message → `useSendMessage` mutation
2. Optimistic message created with temp ID
3. Added to Zustand store immediately (instant UI update)
4. Added to React Query cache
5. API call sent
6. On success: Replace temp ID with real message ID
7. On error: Rollback optimistic message

**Receiving a Message (WebSocket)**:
1. WebSocket event received
2. SocketSyncManager processes event
3. Updates Zustand store
4. Updates React Query cache
5. Components re-render automatically

### API Integration

All API services extend `BaseApiService` for consistency:
- CRUD operations
- Zod validation
- Type safety
- Error handling

API Services:
- **MessageApi**: Message CRUD, search, reactions
- **ConversationApi**: Conversation management, participants
- **EncryptionApi**: E2E encryption key exchange

### State Persistence Strategy

**What We Persist**:
- Message drafts (localStorage via Zustand persist)

**What We Don't Persist**:
- Message cache (fetched on load)
- Typing indicators (ephemeral)
- Presence status (real-time only)
- Conversations (fetched on load)

**Why?**
- Avoid stale data
- Reduce storage usage
- Maintain data consistency
- Drafts are valuable user input that should survive refreshes

### State Synchronization

**WebSocket Events → State Updates**:

| Event                | Zustand Store        | React Query Cache    |
|---------------------|---------------------|---------------------|
| `message:new`       | messageStore        | messageKeys.list    |
| `message:updated`   | messageStore        | messageKeys.list    |
| `message:deleted`   | messageStore        | messageKeys.list    |
| `message:delivered` | messageStore        | messageKeys.list    |
| `message:read`      | messageStore        | messageKeys.list    |
| `typing:start`      | typingStore         | -                   |
| `typing:stop`       | typingStore         | -                   |
| `presence:update`   | presenceStore       | -                   |
| `conversation:new`  | conversationStore   | conversationKeys    |

### Cache Invalidation Strategy

**Aggressive Invalidation**:
- Unread counts: After every message send/receive
- Conversations: After new conversation or conversation update

**Conservative Invalidation**:
- Message list: Only on explicit user action (pull-to-refresh)
- Rely on WebSocket updates for real-time sync

**Background Refetch**:
- Unread count: Every 30 seconds
- Conversations: On window focus
- Messages: On window focus

## State Architecture Details

### Message Store

**State**:
- `messagesByConversation`: Record<conversationId, Message[]>
- `drafts`: Record<conversationId, Draft>
- `optimisticMessages`: Record<tempId, Message>
- `selectedMessage`: Message | null
- `isLoadingMessages`: Record<conversationId, boolean>

**Key Features**:
- Optimistic updates with rollback
- Draft persistence
- Delivery confirmation tracking
- Duplicate prevention

### Conversation Store

**State**:
- `conversations`: Conversation[]
- `currentConversationId`: string | null
- `filter`: ConversationFilter
- `sortBy`: 'recent' | 'unread' | 'name'

**Key Features**:
- Filtering and sorting
- Pin/mute/archive actions
- Unread count tracking
- Last message updates

### Typing Store

**State**:
- `typingByConversation`: Record<conversationId, TypingIndicator[]>

**Key Features**:
- Auto-cleanup of stale indicators (5s timeout)
- Multiple simultaneous typers
- Background cleanup interval (2s)

### Presence Store

**State**:
- `presenceByUserId`: Record<userId, UserPresence>
- `currentUserPresence`: UserPresence | null

**Key Features**:
- Online/offline/away/busy status
- Custom status messages
- Last seen timestamps
- Bulk updates

## Performance Considerations

### Re-render Optimization

**Zustand**:
- Selector-based subscriptions (only re-render on selected state change)
- Shallow comparison for objects
- Split stores prevent unnecessary updates

**React Query**:
- Structural sharing in cache
- Stale-while-revalidate pattern
- Selective cache updates
- Query key granularity

### Memory Management

**Message Cache**:
- Limited by React Query `gcTime` (30 minutes)
- Infinite scroll pages garbage collected when inactive

**Typing Indicators**:
- Auto-cleanup after 5 seconds
- Background cleanup interval prevents memory leaks

**Optimistic Messages**:
- Removed from map after confirmation/rollback
- No memory leaks from failed messages

### Code Splitting

All messaging state is lazy-loadable:
- Stores can be imported on-demand
- React Query hooks are tree-shakeable
- API services are separate modules

## Developer Experience

### DevTools

**Zustand DevTools**:
- All stores integrated with Redux DevTools
- Time-travel debugging
- Action history
- State inspection

**React Query DevTools**:
- Query inspection
- Cache visualization
- Mutation tracking
- Network waterfall

### TypeScript Integration

**100% Type Coverage**:
- All stores fully typed
- API DTOs with Zod schemas
- React Query hooks with generics
- No `any` types (except necessary escape hatches)

**Type Safety Benefits**:
- Autocomplete in IDE
- Compile-time error detection
- Refactoring confidence
- Self-documenting code

### Testing Strategy

**Unit Tests**:
- Store actions and selectors
- API service methods
- Sync manager event handlers

**Integration Tests**:
- React Query + Zustand integration
- WebSocket synchronization
- Optimistic update flows

**E2E Tests**:
- Send/receive messages
- Real-time updates
- Offline/online scenarios

## Migration Path

**From Existing Redux State**:
1. Keep existing Redux for other domains
2. New messaging feature uses Zustand + React Query
3. Gradual migration if needed
4. No conflicts - they coexist peacefully

**Future Enhancements**:
- IndexedDB for offline message cache
- Service Worker for background sync
- Push notifications integration
- Voice/video call state management
