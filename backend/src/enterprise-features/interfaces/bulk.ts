import { BulkMessageStatus, CommunicationChannel } from './enums';

export interface BulkMessage {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  channels: CommunicationChannel[];
  status: BulkMessageStatus;
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked?: number;
  };
  sentAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  templateId?: string;
}