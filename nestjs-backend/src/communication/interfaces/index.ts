import { MessageType, MessagePriority, DeliveryStatus } from '../enums';

export interface ChannelSendData {
  to: string;
  subject?: string;
  content: string;
  priority: MessagePriority;
  attachments?: string[];
}

export interface ChannelSendResult {
  externalId: string;
}

export interface MessageDeliveryStatusResult {
  messageId: string;
  recipientId: string;
  channel: MessageType;
  status: DeliveryStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string;
}

export interface DeliverySummary {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
}

export interface CommunicationStatistics {
  totalMessages: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
  deliveryStatus: Record<string, number>;
}
