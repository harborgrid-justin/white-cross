/**
 * Enhanced WebSocket Gateway
 *
 * Example of how to enhance the existing gateway with:
 * - OnGatewayInit lifecycle hook
 * - Connection-level middleware
 * - Validation pipes
 * - Logging interceptors
 * - Transform interceptors
 *
 * This file serves as a reference implementation for improving the existing gateway.
 *
 * @class EnhancedWebSocketGateway
 */
import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import {
  Logger,
  UseGuards,
  UseFilters,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { AuthenticatedSocket } from './interfaces';
import { WsJwtAuthGuard } from './guards';
import { WsExceptionFilter } from './filters/ws-exception.filter';
import { WsValidationPipe } from './pipes/ws-validation.pipe';
import { WsLoggingInterceptor } from './interceptors/ws-logging.interceptor';
import { WsTransformInterceptor } from './interceptors/ws-transform.interceptor';
import { RateLimiterService } from './services';
import { createWsAuthMiddleware } from './middleware/ws-auth.middleware';
import {
  SendMessageDto,
  EditMessageDto,
  DeleteMessageDto,
  JoinConversationDto,
  TypingIndicatorInputDto,
} from './dto';

/**
 * Enhanced WebSocket Gateway with full lifecycle management
 */
@UseFilters(new WsExceptionFilter())
@UseInterceptors(WsLoggingInterceptor, WsTransformInterceptor)
@NestWebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  namespace: '/enhanced',
})
export class EnhancedWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EnhancedWebSocketGateway.name);

  constructor(
    private readonly rateLimiter: RateLimiterService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gateway initialization lifecycle hook
   * Called once when the gateway is initialized
   *
   * @param server - The Socket.io server instance
   */
  afterInit(server: Server): void {
    this.logger.log('Enhanced WebSocket Gateway initialized');

    // Apply authentication middleware to all connections
    server.use(createWsAuthMiddleware(this.jwtService, this.configService));

    // Log server configuration
    this.logger.log(`Server listening on namespace: ${server.name}`);
    this.logger.log(`Transports: ${JSON.stringify(server._opts?.transports)}`);

    // Set up any additional server-level configuration
    this.configureServer(server);
  }

  /**
   * Handles new WebSocket connections
   * Called after successful authentication middleware
   *
   * @param client - The authenticated socket client
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    const user = client.user;

    if (!user) {
      this.logger.warn(`Connection rejected: No user data (socket: ${client.id})`);
      client.disconnect();
      return;
    }

    this.logger.log(
      `Client connected: ${client.id} (user: ${user.userId}, org: ${user.organizationId})`,
    );

    try {
      // Join organization and user rooms
      const orgRoom = `org:${user.organizationId}`;
      const userRoom = `user:${user.userId}`;

      await client.join(orgRoom);
      await client.join(userRoom);

      this.logger.log(`Socket ${client.id} joined rooms: ${orgRoom}, ${userRoom}`);

      // Send connection confirmation
      client.emit('connection:confirmed', {
        socketId: client.id,
        userId: user.userId,
        organizationId: user.organizationId,
        connectedAt: new Date().toISOString(),
      });

      // Broadcast user online status
      this.server.to(orgRoom).emit('presence:update', {
        userId: user.userId,
        status: 'online',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Connection setup error for ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * Handles client disconnection
   *
   * @param client - The disconnecting socket client
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const user = client.user;

    if (user) {
      const orgRoom = `org:${user.organizationId}`;

      // Broadcast user offline status
      this.server.to(orgRoom).emit('presence:update', {
        userId: user.userId,
        status: 'offline',
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        `Client disconnected: ${client.id} (user: ${user.userId})`,
      );
    } else {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }

  /**
   * Handles ping requests for connection health checks
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): { pong: string } {
    return { pong: new Date().toISOString() };
  }

  /**
   * Handles sending new messages with validation
   */
  @UseGuards(WsJwtAuthGuard)
  @UsePipes(new WsValidationPipe())
  @SubscribeMessage('message:send')
  async handleMessageSend(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<{ success: boolean; messageId: string }> {
    const user = client.user;

    // Rate limiting
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:send');
    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }

    // Broadcast to conversation room
    const room = `conversation:${dto.conversationId}`;
    this.server.to(room).emit('message:new', {
      messageId: dto.messageId,
      conversationId: dto.conversationId,
      senderId: user.userId,
      content: dto.content,
      metadata: dto.metadata,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      messageId: dto.messageId,
    };
  }

  /**
   * Handles editing messages with validation
   */
  @UseGuards(WsJwtAuthGuard)
  @UsePipes(new WsValidationPipe())
  @SubscribeMessage('message:edit')
  async handleMessageEdit(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: EditMessageDto,
  ): Promise<{ success: boolean }> {
    const user = client.user;

    // Rate limiting
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:edit');
    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }

    // Broadcast edit to conversation room
    const room = `conversation:${dto.conversationId}`;
    this.server.to(room).emit('message:edited', {
      messageId: dto.messageId,
      conversationId: dto.conversationId,
      content: dto.content,
      editedAt: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Handles deleting messages with validation
   */
  @UseGuards(WsJwtAuthGuard)
  @UsePipes(new WsValidationPipe())
  @SubscribeMessage('message:delete')
  async handleMessageDelete(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: DeleteMessageDto,
  ): Promise<{ success: boolean }> {
    const user = client.user;

    // Rate limiting
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:delete');
    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }

    // Broadcast delete to conversation room
    const room = `conversation:${dto.conversationId}`;
    this.server.to(room).emit('message:deleted', {
      messageId: dto.messageId,
      conversationId: dto.conversationId,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Handles joining conversations with validation
   */
  @UseGuards(WsJwtAuthGuard)
  @UsePipes(new WsValidationPipe())
  @SubscribeMessage('conversation:join')
  async handleConversationJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: JoinConversationDto,
  ): Promise<{ success: boolean; conversationId: string }> {
    const user = client.user;

    // TODO: Validate user has access to conversation

    const room = `conversation:${dto.conversationId}`;
    await client.join(room);

    this.logger.log(
      `User ${user.userId} joined conversation ${dto.conversationId}`,
    );

    // Notify other participants
    client.to(room).emit('conversation:user-joined', {
      userId: user.userId,
      conversationId: dto.conversationId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      conversationId: dto.conversationId,
    };
  }

  /**
   * Handles typing indicators with validation
   */
  @UseGuards(WsJwtAuthGuard)
  @UsePipes(new WsValidationPipe())
  @SubscribeMessage('typing:indicator')
  async handleTypingIndicator(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: TypingIndicatorInputDto,
  ): Promise<void> {
    const user = client.user;

    // Rate limiting (silent failure for typing)
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:typing');
    if (!allowed) {
      return; // Silently ignore
    }

    // Broadcast to conversation (excluding sender)
    const room = `conversation:${dto.conversationId}`;
    client.to(room).emit('typing:update', {
      userId: user.userId,
      conversationId: dto.conversationId,
      isTyping: dto.isTyping,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Configures additional server settings
   *
   * @param server - The Socket.io server
   */
  private configureServer(server: Server): void {
    // Set maximum listeners to prevent memory leak warnings
    server.sockets.setMaxListeners(100);

    // Configure adapter settings if needed
    // Example: server.adapter.opts.key = 'custom-key';

    this.logger.log('Server configuration completed');
  }
}
