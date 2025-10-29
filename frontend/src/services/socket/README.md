# Socket.io Messaging Client Service

Comprehensive Socket.io client service for real-time messaging in the White Cross Healthcare Platform.

## Features

- **JWT Authentication** - Secure connection with JWT tokens
- **Auto-Reconnection** - Exponential backoff reconnection strategy
- **Connection State Management** - Track connection lifecycle
- **Heartbeat/Ping-Pong** - Connection health monitoring
- **Event-Driven Architecture** - Type-safe event handling
- **Offline Message Queue** - Queue messages when offline with persistence
- **Message Deduplication** - Prevent duplicate message delivery
- **Retry Logic** - Automatic retry for failed messages
- **TypeScript Support** - Full type safety with no 'any' types
- **React Hooks** - Easy integration with React components

## Architecture

```
services/socket/
├── socket.service.ts       # Main Socket.io client wrapper
├── socket-manager.ts       # Connection lifecycle management
├── socket-events.ts        # Event type definitions and handlers
├── socket-config.ts        # Configuration
├── socket.types.ts         # TypeScript types
├── socket-queue.ts         # Offline message queue
└── index.ts               # Exports

hooks/socket/
├── useSocket.ts           # Main socket hook
├── useSocketEvent.ts      # Event subscription hook
├── useSocketConnection.ts # Connection state hook
└── index.ts              # Exports
```

## Installation

The Socket.io client is already installed:

```bash
npm install socket.io-client@^4.8.1
```

## Configuration

Configure via environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
```

## Usage

### Basic Setup

```typescript
import { useSocket, useSocketEvent, SocketEvent } from '@/hooks/socket';

function ChatComponent() {
  const { isConnected, sendMessage, connectionState } = useSocket({
    autoConnect: true,
    token: authToken
  });

  // Subscribe to message received events
  useSocketEvent(SocketEvent.MESSAGE_RECEIVED, (data) => {
    console.log('New message:', data.message);
    addMessageToUI(data.message);
  });

  // Send a message
  const handleSend = async () => {
    await sendMessage({
      conversationId: '123',
      content: 'Hello!',
      type: 'text'
    });
  };

  return (
    <div>
      <ConnectionStatus state={connectionState} />
      <button onClick={handleSend} disabled={!isConnected}>
        Send Message
      </button>
    </div>
  );
}
```

### Connection Management

```typescript
import { useSocketConnection } from '@/hooks/socket';

function ConnectionIndicator() {
  const {
    isConnected,
    isReconnecting,
    hasError,
    metrics,
    reconnect
  } = useSocketConnection();

  if (hasError) {
    return (
      <div className="error">
        Connection error
        <button onClick={reconnect}>Retry</button>
      </div>
    );
  }

  if (isReconnecting) {
    return (
      <div className="warning">
        Reconnecting... (attempt {metrics.reconnectAttempts})
      </div>
    );
  }

  return (
    <div className={isConnected ? 'connected' : 'disconnected'}>
      {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      {metrics.latency && <span> ({metrics.latency}ms)</span>}
    </div>
  );
}
```

### Event Subscription

```typescript
import { useSocketEvent, SocketEvent } from '@/hooks/socket';

function ChatMessages() {
  // Message received
  useSocketEvent(SocketEvent.MESSAGE_RECEIVED, (data) => {
    console.log('New message:', data.message);
    addMessage(data.message);
  });

  // Message delivered
  useSocketEvent(SocketEvent.MESSAGE_DELIVERED, (data) => {
    console.log('Message delivered:', data.messageId);
    updateMessageStatus(data.messageId, 'delivered');
  });

  // Message read
  useSocketEvent(SocketEvent.MESSAGE_READ, (data) => {
    console.log('Message read:', data.messageId);
    updateMessageStatus(data.messageId, 'read');
  });

  // Typing indicator
  useSocketEvent(SocketEvent.MESSAGE_TYPING, (data) => {
    if (data.isTyping) {
      showTypingIndicator(data.userName);
    } else {
      hideTypingIndicator(data.userId);
    }
  });

  // Message edited
  useSocketEvent(SocketEvent.MESSAGE_EDITED, (data) => {
    updateMessageContent(data.messageId, data.newContent);
  });

  // Message deleted
  useSocketEvent(SocketEvent.MESSAGE_DELETED, (data) => {
    removeMessage(data.messageId);
  });

  return <div>Messages...</div>;
}
```

### Sending Messages

```typescript
const { sendMessage, sendTyping, markAsRead } = useSocket({
  autoConnect: true,
  token
});

// Send text message
await sendMessage({
  conversationId: '123',
  content: 'Hello!',
  type: 'text'
});

// Send typing indicator
sendTyping('123', true);  // User is typing
sendTyping('123', false); // User stopped typing

// Mark message as read
markAsRead('msg-456', '123');
```

### Offline Queue

Messages are automatically queued when offline and sent when connection is restored:

```typescript
const { queueSize, processQueue, clearQueue } = useSocket({ token });

// Check queue size
console.log('Queued messages:', queueSize);

// Manually process queue
await processQueue();

// Clear queue (removes all unsent messages)
clearQueue();
```

### Direct Service Usage (Advanced)

```typescript
import { socketService, SocketEvent } from '@/services/socket';

// Connect
socketService.connect(token);

// Subscribe to events
socketService.on(SocketEvent.MESSAGE_RECEIVED, (data) => {
  console.log('Message:', data.message);
});

// Send message
await socketService.sendMessage({
  conversationId: '123',
  content: 'Hello',
  type: 'text'
});

// Disconnect
socketService.disconnect();
```

## Event Types

### Connection Events

- `connection:confirmed` - Connection established and authenticated
- `connection:error` - Connection error occurred

### Message Events

- `message:received` - New message received
- `message:delivered` - Delivery confirmation
- `message:read` - Read receipt
- `message:typing` - Typing indicator
- `message:edited` - Message edited
- `message:deleted` - Message deleted
- `message:send` - Send message (client → server)

### Heartbeat Events

- `ping` - Heartbeat ping
- `pong` - Heartbeat pong

## TypeScript Types

All events have full TypeScript type definitions:

```typescript
interface MessageReceivedPayload {
  message: Message;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TypingPayload {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface MessageDeliveredPayload {
  messageId: string;
  conversationId: string;
  deliveredAt: Date | string;
  userId: string;
}
```

See `socket.types.ts` for all type definitions.

## Configuration Options

```typescript
interface SocketConfig {
  url: string;                    // WebSocket server URL
  path: string;                   // Socket.io path
  reconnection: {
    enabled: boolean;             // Enable auto-reconnection
    delay: number;                // Initial delay (1000ms)
    delayMax: number;             // Max delay (30000ms)
    attempts: number;             // Max attempts (10)
  };
  timeout: number;                // Connection timeout (20000ms)
  transports: string[];           // ['websocket', 'polling']
  heartbeatInterval: number;      // Ping interval (25000ms)
  heartbeatTimeout: number;       // Pong timeout (5000ms)
  debug: boolean;                 // Enable debug logging
  queue: {
    maxSize: number;              // Max queued messages (100)
    persistToStorage: boolean;    // Save to localStorage
    retryAttempts: number;        // Retry failed sends (3)
    retryDelay: number;           // Delay between retries (2000ms)
  };
  deduplicationWindow: number;    // Dedup window (60000ms)
}
```

## Connection States

```typescript
enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR'
}
```

## Best Practices

### 1. Always Use Hooks in Components

```typescript
// ✅ Good
function ChatComponent() {
  const { sendMessage } = useSocket({ autoConnect: true, token });
  useSocketEvent(SocketEvent.MESSAGE_RECEIVED, handleMessage);
}

// ❌ Avoid (unless you need direct service access)
function ChatComponent() {
  socketService.connect(token);
  socketService.on(SocketEvent.MESSAGE_RECEIVED, handleMessage);
}
```

### 2. Cleanup Event Listeners

The hooks automatically cleanup on unmount, but if using service directly:

```typescript
useEffect(() => {
  const handler = (data) => console.log(data);
  socketService.on(SocketEvent.MESSAGE_RECEIVED, handler);

  return () => {
    socketService.off(SocketEvent.MESSAGE_RECEIVED, handler);
  };
}, []);
```

### 3. Handle Connection States

```typescript
const { isConnected, connectionState } = useSocket({ token });

if (connectionState === ConnectionState.ERROR) {
  return <ErrorState />;
}

if (connectionState === ConnectionState.RECONNECTING) {
  return <ReconnectingState />;
}
```

### 4. Use Type-Safe Events

```typescript
// ✅ Type-safe
useSocketEvent(SocketEvent.MESSAGE_RECEIVED, (data: MessageReceivedPayload) => {
  console.log(data.message.content); // TypeScript knows the shape
});

// ❌ Not type-safe
useSocketEvent('message:received', (data: any) => {
  console.log(data.message.content);
});
```

## Memory Management

The service includes automatic memory leak prevention:

- Event listeners are cleaned up on unmount
- Deduplication cache is cleared after window expires
- Timers are cleared on disconnect
- WeakMaps prevent circular references

## Testing

```typescript
import { socketService } from '@/services/socket';

// Mock socket service in tests
jest.mock('@/services/socket', () => ({
  socketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    sendMessage: jest.fn().mockResolvedValue(undefined),
    isConnected: jest.fn().mockReturnValue(true)
  }
}));
```

## Troubleshooting

### Connection Issues

1. **Check backend is running**: `http://localhost:3001`
2. **Check token validity**: Ensure JWT token is not expired
3. **Check network**: Open browser DevTools → Network → WS
4. **Enable debug logging**: Set `NODE_ENV=development`

### Messages Not Sending

1. **Check connection state**: Use `useSocketConnection()`
2. **Check queue**: Messages queue when offline
3. **Check error logs**: Look for emit errors in console
4. **Verify payload**: Ensure message payload is valid

### Memory Leaks

1. **Use hooks**: They auto-cleanup
2. **Cleanup manually**: Remove listeners in useEffect cleanup
3. **Check event listeners**: Monitor with `eventNames()`

## Integration with Backend

The service connects to the backend WebSocket server at `http://localhost:3001`.

Backend should implement these events:
- Authenticate with JWT token on connection
- Handle `message:send` event
- Emit `message:received`, `message:delivered`, `message:read` events
- Implement `ping`/`pong` heartbeat
- Send `connection:confirmed` on successful auth

## Contributing

When adding new events:

1. Add event to `SocketEvent` enum in `socket.types.ts`
2. Create payload interface in `socket.types.ts`
3. Add to `SocketEventPayloadMap` for type safety
4. Register handler in `socket.service.ts`
5. Update this README

## License

Copyright © 2025 White Cross Healthcare Platform
