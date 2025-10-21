/**
 * Communication Domain Types
 */

export interface CommunicationStats {
  totalMessages: number;
  unreadCount: number;
}

export interface UseCommunicationReturn {
  stats: CommunicationStats;
}