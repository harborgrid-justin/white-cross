/**
 * LOC: PP004MSG
 * Parent Portal Messaging Service
 * 
 * Bidirectional secure messaging between school nurses and parents/guardians
 * HIPAA-compliant message handling with read receipts and attachments
 * 
 * UPSTREAM (imports from):
 *   - database models
 *   - logger utility
 *   - audit service
 *   - communication service
 * 
 * DOWNSTREAM (imported by):
 *   - parent portal routes
 *   - communication routes
 *   - notification system
 */

import { logger } from '../../utils/logger';
import { AuditService } from '../auditService';

/**
 * Message Priority Levels
 */
export enum MessagePriority {
  LOW = 'LOW',           // General information
  NORMAL = 'NORMAL',     // Standard communication
  HIGH = 'HIGH',         // Important but not urgent
  URGENT = 'URGENT'      // Requires immediate attention
}

/**
 * Message Status
 */
export enum MessageStatus {
  DRAFT = 'DRAFT',           // Saved but not sent
  SENT = 'SENT',             // Sent to recipient
  DELIVERED = 'DELIVERED',   // Confirmed delivered
  READ = 'READ',             // Recipient has read
  ARCHIVED = 'ARCHIVED',     // Archived by sender/recipient
  DELETED = 'DELETED'        // Soft deleted
}

/**
 * Message Category
 */
export enum MessageCategory {
  GENERAL = 'GENERAL',                     // General communication
  HEALTH_UPDATE = 'HEALTH_UPDATE',         // Student health information
  MEDICATION = 'MEDICATION',               // Medication-related
  APPOINTMENT = 'APPOINTMENT',             // Appointment scheduling
  INCIDENT = 'INCIDENT',                   // Incident notifications
  CONSENT = 'CONSENT',                     // Consent forms
  SCREENING = 'SCREENING',                 // Screening results
  IMMUNIZATION = 'IMMUNIZATION',           // Vaccination records
  EMERGENCY = 'EMERGENCY',                 // Emergency situations
  ABSENCE = 'ABSENCE',                     // Absence notifications
  FOLLOW_UP = 'FOLLOW_UP',                 // Follow-up required
  QUESTION = 'QUESTION'                    // Parent questions
}

/**
 * Message Participant
 */
export interface MessageParticipant {
  userId: string;
  userType: 'NURSE' | 'PARENT' | 'GUARDIAN' | 'ADMIN';
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

/**
 * Message Attachment
 */
export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
  isScanned: boolean; // Virus scan status
  isPHI: boolean;     // Contains Protected Health Information
}

/**
 * Message
 */
export interface Message {
  id: string;
  threadId?: string; // For conversation threading
  
  // Participants
  senderId: string;
  senderInfo: MessageParticipant;
  recipientIds: string[];
  recipients: MessageParticipant[];
  
  // Content
  subject: string;
  body: string;
  category: MessageCategory;
  priority: MessagePriority;
  
  // Student context (if applicable)
  studentId?: string;
  studentName?: string;
  
  // Attachments
  attachments: MessageAttachment[];
  
  // Status tracking
  status: MessageStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  readBy?: string[];
  
  // Metadata
  isEncrypted: boolean;
  requiresResponse: boolean;
  responseDeadline?: Date;
  tags?: string[];
  
  // Reply/Forward
  replyToMessageId?: string;
  forwardedFromMessageId?: string;
  
  // Flags
  isStarred: boolean;
  isArchived: boolean;
  requiresAction: boolean;
  actionCompleted: boolean;
  
  // Audit trail
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  schoolId?: string;
  
  // HIPAA compliance
  containsPHI: boolean;
  accessLog: {
    userId: string;
    accessedAt: Date;
    action: string;
  }[];
}

/**
 * Message Thread (Conversation)
 */
export interface MessageThread {
  id: string;
  subject: string;
  category: MessageCategory;
  participants: MessageParticipant[];
  messages: Message[];
  lastMessageAt: Date;
  lastMessageBy: string;
  unreadCount: Map<string, number>; // unread count per user
  isArchived: boolean;
  studentId?: string;
  createdAt: Date;
}

/**
 * Message Template
 */
export interface MessageTemplate {
  id: string;
  name: string;
  category: MessageCategory;
  subject: string;
  body: string;
  variables: string[]; // Placeholders like {{studentName}}
  requiresAttachment: boolean;
  defaultPriority: MessagePriority;
  createdBy: string;
  isActive: boolean;
}

/**
 * Message Filter Options
 */
export interface MessageFilterOptions {
  userId?: string;
  category?: MessageCategory;
  priority?: MessagePriority;
  status?: MessageStatus;
  studentId?: string;
  unreadOnly?: boolean;
  starredOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
}

/**
 * Notification Preferences
 */
export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notifyOnNewMessage: boolean;
  notifyOnReply: boolean;
  notifyOnUrgent: boolean;
  quietHoursStart?: string; // HH:MM format
  quietHoursEnd?: string;
}

/**
 * Parent Portal Messaging Service
 */
export class ParentPortalMessaging {
  
  // In-memory storage (replace with database in production)
  private static messages: Message[] = [];
  private static threads: MessageThread[] = [];
  private static templates: MessageTemplate[] = [];
  private static preferences: Map<string, NotificationPreferences> = new Map();
  
  /**
   * Send a new message
   */
  static async sendMessage(params: {
    senderId: string;
    senderInfo: MessageParticipant;
    recipientIds: string[];
    recipients: MessageParticipant[];
    subject: string;
    body: string;
    category: MessageCategory;
    priority?: MessagePriority;
    studentId?: string;
    studentName?: string;
    attachments?: MessageAttachment[];
    requiresResponse?: boolean;
    responseDeadline?: Date;
    threadId?: string;
    replyToMessageId?: string;
    containsPHI?: boolean;
  }): Promise<Message> {
    try {
      const message: Message = {
        id: this.generateMessageId(),
        threadId: params.threadId || this.generateThreadId(),
        senderId: params.senderId,
        senderInfo: params.senderInfo,
        recipientIds: params.recipientIds,
        recipients: params.recipients,
        subject: params.subject,
        body: params.body,
        category: params.category,
        priority: params.priority || MessagePriority.NORMAL,
        studentId: params.studentId,
        studentName: params.studentName,
        attachments: params.attachments || [],
        status: MessageStatus.SENT,
        sentAt: new Date(),
        readBy: [],
        isEncrypted: true, // All messages encrypted in production
        requiresResponse: params.requiresResponse || false,
        responseDeadline: params.responseDeadline,
        replyToMessageId: params.replyToMessageId,
        isStarred: false,
        isArchived: false,
        requiresAction: params.requiresResponse || false,
        actionCompleted: false,
        createdAt: new Date(),
        containsPHI: params.containsPHI || false,
        accessLog: [{
          userId: params.senderId,
          accessedAt: new Date(),
          action: 'SENT'
        }]
      };
      
      this.messages.push(message);
      
      // Update or create thread
      await this.updateThread(message);
      
      // Send notifications
      await this.sendNotifications(message);
      
      // Audit log
      await AuditService.logAction({
        userId: params.senderId,
        action: 'SEND_MESSAGE',
        resourceType: 'Message',
        resourceId: message.id,
        details: {
          recipientCount: params.recipientIds.length,
          category: params.category,
          priority: message.priority,
          studentId: params.studentId,
          containsPHI: message.containsPHI
        }
      });
      
      logger.info('Message sent', {
        messageId: message.id,
        senderId: params.senderId,
        recipientCount: params.recipientIds.length,
        category: params.category,
        priority: message.priority
      });
      
      return message;
      
    } catch (error) {
      logger.error('Error sending message', { error, params });
      throw new Error('Failed to send message');
    }
  }
  
  /**
   * Reply to a message
   */
  static async replyToMessage(
    messageId: string,
    reply: {
      senderId: string;
      senderInfo: MessageParticipant;
      body: string;
      attachments?: MessageAttachment[];
    }
  ): Promise<Message> {
    try {
      const originalMessage = this.messages.find(m => m.id === messageId);
      
      if (!originalMessage) {
        throw new Error('Original message not found');
      }
      
      // Reply goes to original sender
      const replyMessage = await this.sendMessage({
        senderId: reply.senderId,
        senderInfo: reply.senderInfo,
        recipientIds: [originalMessage.senderId],
        recipients: [originalMessage.senderInfo],
        subject: `Re: ${originalMessage.subject}`,
        body: reply.body,
        category: originalMessage.category,
        priority: originalMessage.priority,
        studentId: originalMessage.studentId,
        studentName: originalMessage.studentName,
        attachments: reply.attachments,
        threadId: originalMessage.threadId,
        replyToMessageId: messageId,
        containsPHI: originalMessage.containsPHI
      });
      
      // Mark original as action completed if it required response
      if (originalMessage.requiresResponse) {
        originalMessage.actionCompleted = true;
        originalMessage.updatedAt = new Date();
      }
      
      return replyMessage;
      
    } catch (error) {
      logger.error('Error replying to message', { error, messageId });
      throw error;
    }
  }
  
  /**
   * Mark message as read
   */
  static async markAsRead(messageId: string, userId: string): Promise<Message> {
    try {
      const message = this.messages.find(m => m.id === messageId);
      
      if (!message) {
        throw new Error('Message not found');
      }
      
      // Only mark if user is a recipient
      if (!message.recipientIds.includes(userId)) {
        throw new Error('User is not a recipient of this message');
      }
      
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
        
        // If all recipients have read, update status
        if (message.readBy.length === message.recipientIds.length) {
          message.status = MessageStatus.READ;
          message.readAt = new Date();
        }
      }
      
      // Log access
      message.accessLog.push({
        userId,
        accessedAt: new Date(),
        action: 'READ'
      });
      
      message.updatedAt = new Date();
      
      logger.info('Message marked as read', { messageId, userId });
      
      return message;
      
    } catch (error) {
      logger.error('Error marking message as read', { error, messageId, userId });
      throw error;
    }
  }
  
  /**
   * Get inbox messages for a user
   */
  static async getInbox(userId: string, filters?: MessageFilterOptions): Promise<Message[]> {
    try {
      let messages = this.messages.filter(m => 
        m.recipientIds.includes(userId) && 
        m.status !== MessageStatus.DELETED &&
        !m.isArchived
      );
      
      // Apply filters
      if (filters) {
        if (filters.category) {
          messages = messages.filter(m => m.category === filters.category);
        }
        
        if (filters.priority) {
          messages = messages.filter(m => m.priority === filters.priority);
        }
        
        if (filters.studentId) {
          messages = messages.filter(m => m.studentId === filters.studentId);
        }
        
        if (filters.unreadOnly) {
          messages = messages.filter(m => !m.readBy.includes(userId));
        }
        
        if (filters.starredOnly) {
          messages = messages.filter(m => m.isStarred);
        }
        
        if (filters.startDate) {
          messages = messages.filter(m => m.createdAt >= filters.startDate!);
        }
        
        if (filters.endDate) {
          messages = messages.filter(m => m.createdAt <= filters.endDate!);
        }
        
        if (filters.searchText) {
          const searchLower = filters.searchText.toLowerCase();
          messages = messages.filter(m => 
            m.subject.toLowerCase().includes(searchLower) ||
            m.body.toLowerCase().includes(searchLower)
          );
        }
      }
      
      // Sort by date, newest first
      messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return messages;
      
    } catch (error) {
      logger.error('Error getting inbox', { error, userId });
      throw error;
    }
  }
  
  /**
   * Get sent messages for a user
   */
  static async getSentMessages(userId: string, filters?: MessageFilterOptions): Promise<Message[]> {
    try {
      let messages = this.messages.filter(m => 
        m.senderId === userId && 
        m.status !== MessageStatus.DELETED &&
        m.status !== MessageStatus.DRAFT
      );
      
      // Apply same filters as inbox
      if (filters) {
        if (filters.category) {
          messages = messages.filter(m => m.category === filters.category);
        }
        if (filters.studentId) {
          messages = messages.filter(m => m.studentId === filters.studentId);
        }
        if (filters.startDate) {
          messages = messages.filter(m => m.createdAt >= filters.startDate!);
        }
        if (filters.endDate) {
          messages = messages.filter(m => m.createdAt <= filters.endDate!);
        }
      }
      
      messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return messages;
      
    } catch (error) {
      logger.error('Error getting sent messages', { error, userId });
      throw error;
    }
  }
  
  /**
   * Get unread message count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return this.messages.filter(m => 
      m.recipientIds.includes(userId) &&
      !m.readBy.includes(userId) &&
      m.status !== MessageStatus.DELETED &&
      !m.isArchived
    ).length;
  }
  
  /**
   * Get conversation thread
   */
  static async getThread(threadId: string, userId: string): Promise<MessageThread | null> {
    try {
      const thread = this.threads.find(t => t.id === threadId);
      
      if (!thread) {
        return null;
      }
      
      // Verify user is a participant
      const isParticipant = thread.participants.some(p => p.userId === userId);
      
      if (!isParticipant) {
        throw new Error('User is not a participant in this thread');
      }
      
      // Load all messages in thread
      const threadMessages = this.messages.filter(m => m.threadId === threadId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      
      thread.messages = threadMessages;
      
      return thread;
      
    } catch (error) {
      logger.error('Error getting thread', { error, threadId, userId });
      throw error;
    }
  }
  
  /**
   * Search messages
   */
  static async searchMessages(userId: string, searchText: string, options?: MessageFilterOptions): Promise<Message[]> {
    const filters: MessageFilterOptions = {
      ...options,
      searchText
    };
    
    return this.getInbox(userId, filters);
  }
  
  /**
   * Archive message
   */
  static async archiveMessage(messageId: string, userId: string): Promise<Message> {
    const message = this.messages.find(m => m.id === messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }
    
    message.isArchived = true;
    message.updatedAt = new Date();
    
    logger.info('Message archived', { messageId, userId });
    
    return message;
  }
  
  /**
   * Star/unstar message
   */
  static async toggleStar(messageId: string, userId: string): Promise<Message> {
    const message = this.messages.find(m => m.id === messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }
    
    message.isStarred = !message.isStarred;
    message.updatedAt = new Date();
    
    return message;
  }
  
  /**
   * Create message template
   */
  static async createTemplate(template: Omit<MessageTemplate, 'id' | 'isActive'>): Promise<MessageTemplate> {
    const newTemplate: MessageTemplate = {
      ...template,
      id: this.generateTemplateId(),
      isActive: true
    };
    
    this.templates.push(newTemplate);
    
    logger.info('Message template created', { templateId: newTemplate.id, name: template.name });
    
    return newTemplate;
  }
  
  /**
   * Get message templates
   */
  static async getTemplates(category?: MessageCategory): Promise<MessageTemplate[]> {
    let templates = this.templates.filter(t => t.isActive);
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }
    
    return templates;
  }
  
  /**
   * Apply template with variable substitution
   */
  static async applyTemplate(
    templateId: string,
    variables: { [key: string]: string }
  ): Promise<{ subject: string; body: string }> {
    const template = this.templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    let subject = template.subject;
    let body = template.body;
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return { subject, body };
  }
  
  /**
   * Get notification preferences
   */
  static async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    let prefs = this.preferences.get(userId);
    
    if (!prefs) {
      // Default preferences
      prefs = {
        userId,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notifyOnNewMessage: true,
        notifyOnReply: true,
        notifyOnUrgent: true
      };
      this.preferences.set(userId, prefs);
    }
    
    return prefs;
  }
  
  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(preferences: NotificationPreferences): Promise<NotificationPreferences> {
    this.preferences.set(preferences.userId, preferences);
    
    logger.info('Notification preferences updated', { userId: preferences.userId });
    
    return preferences;
  }
  
  /**
   * Get message statistics
   */
  static async getStatistics(userId: string, dateRange: { start: Date; end: Date }): Promise<any> {
    const userMessages = this.messages.filter(m => 
      (m.senderId === userId || m.recipientIds.includes(userId)) &&
      m.createdAt >= dateRange.start &&
      m.createdAt <= dateRange.end
    );
    
    const sent = userMessages.filter(m => m.senderId === userId).length;
    const received = userMessages.filter(m => m.recipientIds.includes(userId)).length;
    const unread = userMessages.filter(m => 
      m.recipientIds.includes(userId) && !m.readBy.includes(userId)
    ).length;
    
    // By category
    const byCategory: any = {};
    Object.values(MessageCategory).forEach(cat => {
      byCategory[cat] = userMessages.filter(m => m.category === cat).length;
    });
    
    // By priority
    const byPriority: any = {};
    Object.values(MessagePriority).forEach(pri => {
      byPriority[pri] = userMessages.filter(m => m.priority === pri).length;
    });
    
    // Response time for messages requiring response
    const responseTimes: number[] = [];
    for (const msg of userMessages.filter(m => m.requiresResponse && m.actionCompleted)) {
      const replies = this.messages.filter(m => m.replyToMessageId === msg.id);
      if (replies.length > 0) {
        const responseTime = replies[0].createdAt.getTime() - msg.createdAt.getTime();
        responseTimes.push(responseTime / (1000 * 60 * 60)); // Convert to hours
      }
    }
    
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    
    return {
      period: dateRange,
      totalMessages: userMessages.length,
      sent,
      received,
      unread,
      byCategory,
      byPriority,
      averageResponseTimeHours: avgResponseTime.toFixed(2)
    };
  }
  
  // === Private helper methods ===
  
  private static generateMessageId(): string {
    return `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static generateThreadId(): string {
    return `THR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static generateTemplateId(): string {
    return `TPL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static async updateThread(message: Message): Promise<void> {
    let thread = this.threads.find(t => t.id === message.threadId);
    
    if (!thread) {
      // Create new thread
      thread = {
        id: message.threadId!,
        subject: message.subject,
        category: message.category,
        participants: [message.senderInfo, ...message.recipients],
        messages: [],
        lastMessageAt: message.createdAt,
        lastMessageBy: message.senderId,
        unreadCount: new Map(),
        isArchived: false,
        studentId: message.studentId,
        createdAt: message.createdAt
      };
      
      // Initialize unread counts
      for (const participant of thread.participants) {
        thread.unreadCount.set(participant.userId, 0);
      }
      
      this.threads.push(thread);
    }
    
    // Update thread
    thread.lastMessageAt = message.createdAt;
    thread.lastMessageBy = message.senderId;
    
    // Increment unread count for all recipients
    for (const recipientId of message.recipientIds) {
      const current = thread.unreadCount.get(recipientId) || 0;
      thread.unreadCount.set(recipientId, current + 1);
    }
  }
  
  private static async sendNotifications(message: Message): Promise<void> {
    // Send notifications to all recipients based on their preferences
    for (const recipientId of message.recipientIds) {
      const prefs = await this.getNotificationPreferences(recipientId);
      
      // Check if we should notify
      if (!prefs.notifyOnNewMessage && message.priority !== MessagePriority.URGENT) {
        continue;
      }
      
      if (message.priority === MessagePriority.URGENT && prefs.notifyOnUrgent) {
        // Send all notification types for urgent messages
        logger.info('Sending urgent message notifications', { recipientId, messageId: message.id });
        // TODO: Integrate with communication service
      } else if (prefs.emailNotifications) {
        // Send email notification
        logger.info('Sending email notification', { recipientId, messageId: message.id });
        // TODO: Integrate with email service
      }
      
      if (prefs.pushNotifications) {
        // Send push notification
        logger.info('Sending push notification', { recipientId, messageId: message.id });
        // TODO: Integrate with push notification service
      }
    }
  }
}
