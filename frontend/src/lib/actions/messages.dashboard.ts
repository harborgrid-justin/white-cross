/**
 * @fileoverview Message Dashboard Functions
 * @module lib/actions/messages.dashboard
 *
 * Dashboard-specific functions for message statistics and analytics.
 * Provides comprehensive metrics and recent message data for dashboard displays.
 */

'use server';

import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { getMessages, getMessageThreads } from './messages.cache';

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive messages statistics for dashboard
 * @returns Promise<MessagesStats> Statistics object with message metrics
 */
export async function getMessagesStats(): Promise<{
  totalMessages: number;
  unreadMessages: number;
  emergencyMessages: number;
  medicalMessages: number;
  parentCommunications: number;
  staffNotifications: number;
  encryptedMessages: number;
  requiresAcknowledgment: number;
  todayMessages: number;
  urgentMessages: number;
  activeThreads: number;
  archivedMessages: number;
}> {
  try {
    console.log('[Messages] Loading message statistics');

    // Get messages and threads data
    const messages = await getMessages();
    const threads = await getMessageThreads();

    // Calculate today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate statistics based on message schema properties
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(m => !m.isRead).length;
    const emergencyMessages = messages.filter(m => m.category === 'emergency').length;
    const medicalMessages = messages.filter(m => m.category === 'medical').length;
    const parentCommunications = messages.filter(m => m.category === 'notification').length; // Closest match
    const staffNotifications = messages.filter(m => m.category === 'administrative').length;
    const encryptedMessages = messages.filter(m => m.hasAttachments).length; // Proxy for encrypted
    const requiresAcknowledgment = messages.filter(m => m.priority === 'urgent').length; // Proxy
    const todayMessages = messages.filter(m => {
      const messageDate = new Date(m.createdAt);
      messageDate.setHours(0, 0, 0, 0);
      return messageDate.getTime() === today.getTime();
    }).length;
    const urgentMessages = messages.filter(m => m.priority === 'urgent').length;
    const activeThreads = threads.filter(t => !t.isArchived).length;
    const archivedMessages = messages.filter(m => m.status === 'archived').length;

    const stats = {
      totalMessages,
      unreadMessages,
      emergencyMessages,
      medicalMessages,
      parentCommunications,
      staffNotifications,
      encryptedMessages,
      requiresAcknowledgment,
      todayMessages,
      urgentMessages,
      activeThreads,
      archivedMessages,
    };

    console.log('[Messages] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'messages_dashboard_stats',
      details: 'Retrieved message dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[Messages] Error calculating stats:', error);
    return {
      totalMessages: 0,
      unreadMessages: 0,
      emergencyMessages: 0,
      medicalMessages: 0,
      parentCommunications: 0,
      staffNotifications: 0,
      encryptedMessages: 0,
      requiresAcknowledgment: 0,
      todayMessages: 0,
      urgentMessages: 0,
      activeThreads: 0,
      archivedMessages: 0,
    };
  }
}

/**
 * Get messages dashboard data with recent messages and priority information
 * @returns Promise<MessagesDashboardData> Dashboard data with recent messages and priorities
 */
export async function getMessagesDashboardData(): Promise<{
  recentMessages: Array<{
    id: string;
    subject: string;
    type: string;
    priority: string;
    isRead: boolean;
    from: string;
    timestamp: string;
    isEncrypted: boolean;
    requiresAcknowledgment: boolean;
  }>;
  priorityMessages: Array<{
    id: string;
    subject: string;
    priority: 'high' | 'urgent' | 'emergency';
    type: string;
    timestamp: string;
    from: string;
  }>;
  messagesByType: {
    emergency: number;
    medical: number;
    parent_communication: number;
    staff_notification: number;
    appointment: number;
    incident: number;
    general: number;
  };
  acknowledgmentsPending: number;
  encryptedMessageCount: number;
  stats: {
    totalMessages: number;
    unreadMessages: number;
    emergencyMessages: number;
    medicalMessages: number;
    parentCommunications: number;
    staffNotifications: number;
    encryptedMessages: number;
    requiresAcknowledgment: number;
    todayMessages: number;
    urgentMessages: number;
    activeThreads: number;
    archivedMessages: number;
  };
}> {
  try {
    // Get stats and messages data
    const stats = await getMessagesStats();
    const messages = await getMessages();

    // Sort messages by date descending and get recent messages (last 10)
    const sortedMessages = messages
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentMessages = sortedMessages.map(message => ({
      id: message.id,
      subject: message.subject,
      type: message.category,
      priority: message.priority,
      isRead: message.isRead,
      from: message.fromUserName || 'Unknown',
      timestamp: message.createdAt,
      isEncrypted: message.hasAttachments, // Proxy for encrypted
      requiresAcknowledgment: message.priority === 'urgent', // Proxy
    }));

    // Get priority messages (high, urgent)
    const priorityMessages = messages
      .filter(m => ['high', 'urgent'].includes(m.priority))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(message => ({
        id: message.id,
        subject: message.subject,
        priority: message.priority as 'high' | 'urgent' | 'emergency',
        type: message.category,
        timestamp: message.createdAt,
        from: message.fromUserName || 'Unknown',
      }));

    // Calculate messages by type (using category)
    const messagesByType = {
      emergency: messages.filter(m => m.category === 'emergency').length,
      medical: messages.filter(m => m.category === 'medical').length,
      parent_communication: messages.filter(m => m.category === 'notification').length,
      staff_notification: messages.filter(m => m.category === 'administrative').length,
      appointment: messages.filter(m => m.category === 'announcement').length,
      incident: messages.filter(m => m.category === 'emergency').length,
      general: messages.filter(m => m.category === 'general').length,
    };

    const acknowledgmentsPending = messages.filter(m => m.priority === 'urgent').length;
    const encryptedMessageCount = messages.filter(m => m.hasAttachments).length;

    const dashboardData = {
      recentMessages,
      priorityMessages,
      messagesByType,
      acknowledgmentsPending,
      encryptedMessageCount,
      stats,
    };

    console.log('[Messages] Dashboard data prepared:', {
      recentCount: recentMessages.length,
      priorityCount: priorityMessages.length,
      acknowledgmentsPending,
      encryptedMessageCount,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'messages_dashboard_data',
      details: 'Retrieved message dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[Messages] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentMessages: [],
      priorityMessages: [],
      messagesByType: {
        emergency: 0,
        medical: 0,
        parent_communication: 0,
        staff_notification: 0,
        appointment: 0,
        incident: 0,
        general: 0,
      },
      acknowledgmentsPending: 0,
      encryptedMessageCount: 0,
      stats: await getMessagesStats(), // Will return safe defaults
    };
  }
}
