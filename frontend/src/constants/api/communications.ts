/**
 * @fileoverview Communications API Endpoints
 * @module constants/api/communications
 * @category API - Communications
 * 
 * Messages, broadcasts, alerts, notifications, and template endpoint definitions.
 */

// ==========================================
// MESSAGES
// ==========================================
export const MESSAGES_ENDPOINTS = {
  BASE: `/api/v1/communications/messages`,
  BY_ID: (id: string) => `/api/v1/communications/messages/${id}`,
  SEND: `/api/v1/communications/messages/send`,
  INBOX: `/api/v1/communications/messages/inbox`,
  SENT: `/api/v1/communications/messages/sent`,
  UNREAD: `/api/v1/communications/messages/unread`,
  MARK_READ: (id: string) => `/api/v1/communications/messages/${id}/mark-read`,
  MARK_UNREAD: (id: string) => `/api/v1/communications/messages/${id}/mark-unread`,
  DELETE: (id: string) => `/api/v1/communications/messages/${id}`,
  THREAD: (id: string) => `/api/v1/communications/messages/thread/${id}`,
  ATTACHMENTS: (id: string) => `/api/v1/communications/messages/${id}/attachments`,
} as const;

// ==========================================
// BROADCASTS
// ==========================================
export const BROADCASTS_ENDPOINTS = {
  BASE: `/api/v1/broadcasts`,
  BY_ID: (id: string) => `/api/v1/broadcasts/${id}`,
  SEND: `/api/v1/broadcasts/send`,
  SCHEDULE: `/api/v1/broadcasts/schedule`,
  RECIPIENTS: (id: string) => `/api/v1/broadcasts/${id}/recipients`,
  CANCEL: (id: string) => `/api/v1/broadcasts/${id}/cancel`,
  DUPLICATE: (id: string) => `/api/v1/broadcasts/${id}/duplicate`,
  DELIVERY_STATUS: (id: string) => `/api/v1/broadcasts/${id}/delivery-status`,
  DRAFTS: `/api/v1/broadcasts/drafts`,
  SCHEDULED: `/api/v1/broadcasts/scheduled`,
} as const;

// ==========================================
// ALERTS
// ==========================================
export const ALERTS_ENDPOINTS = {
  BASE: `/api/v1/alerts`,
  BY_ID: (id: string) => `/api/v1/alerts/${id}`,
  ACTIVE: `/api/v1/alerts/active`,
  ACKNOWLEDGE: (id: string) => `/api/v1/alerts/${id}/acknowledge`,
  DISMISS: (id: string) => `/api/v1/alerts/${id}/dismiss`,
  MEDICATION_REMINDERS: `/api/v1/alerts/medication-reminders`,
  APPOINTMENT_REMINDERS: `/api/v1/alerts/appointment-reminders`,
  EMERGENCY: `/api/v1/alerts/emergency`,
  BY_TYPE: (type: string) => `/api/v1/alerts/type/${type}`,
} as const;

// ==========================================
// NOTIFICATIONS
// ==========================================
export const NOTIFICATIONS_ENDPOINTS = {
  BASE: `/api/v1/notifications`,
  BY_ID: (id: string) => `/api/v1/notifications/${id}`,
  UNREAD: `/api/v1/notifications/unread`,
  MARK_READ: (id: string) => `/api/v1/notifications/${id}/mark-read`,
  MARK_ALL_READ: `/api/v1/notifications/mark-all-read`,
  PREFERENCES: `/api/v1/notifications/preferences`,
  TEST_PUSH: `/api/v1/notifications/test-push`,
  PUSH_SUBSCRIBE: `/api/v1/notifications/push-subscribe`,
  PUSH_UNSUBSCRIBE: `/api/v1/notifications/push-unsubscribe`,
  PUSH_SUBSCRIPTION: `/api/v1/notifications/push-subscription`,
} as const;

// ==========================================
// CONVERSATIONS
// ==========================================
export const CONVERSATIONS_ENDPOINTS = {
  BASE: `/api/v1/conversations`,
  BY_ID: (id: string) => `/api/v1/conversations/${id}`,
  BY_USER: (userId: string) => `/api/v1/conversations/user/${userId}`,
  MESSAGES: (conversationId: string) => `/api/v1/conversations/${conversationId}/messages`,
  PARTICIPANTS: (conversationId: string) => `/api/v1/conversations/${conversationId}/participants`,
  ADD_PARTICIPANT: (conversationId: string) => `/api/v1/conversations/${conversationId}/participants`,
  REMOVE_PARTICIPANT: (conversationId: string, userId: string) =>
    `/api/v1/conversations/${conversationId}/participants/${userId}`,
  ARCHIVE: (id: string) => `/api/v1/conversations/${id}/archive`,
  UNARCHIVE: (id: string) => `/api/v1/conversations/${id}/unarchive`,
} as const;

// ==========================================
// TEMPLATES
// ==========================================
export const TEMPLATES_ENDPOINTS = {
  BASE: `/api/v1/templates`,
  BY_ID: (id: string) => `/api/v1/templates/${id}`,
  BY_CATEGORY: (category: string) => `/api/v1/templates/category/${category}`,
  RENDER: (id: string) => `/api/v1/templates/${id}/render`,
  CATEGORIES: `/api/v1/templates/categories`,
} as const;

// ==========================================
// DOCUMENTS
// ==========================================
export const DOCUMENTS_ENDPOINTS = {
  BASE: `/api/v1/documents`,
  BY_ID: (id: string) => `/api/v1/documents/${id}`,
  UPLOAD: `/api/v1/documents/upload`,
  DOWNLOAD: (id: string) => `/api/v1/documents/${id}/download`,
  PREVIEW: (id: string) => `/api/v1/documents/${id}/preview`,
  SIGN: (id: string) => `/api/v1/documents/${id}/sign`,
  VERIFY_SIGNATURE: (id: string) => `/api/v1/documents/${id}/verify-signature`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/documents`,
  BY_TYPE: (type: string) => `/api/v1/documents/type/${type}`,
  TEMPLATES: `/api/v1/documents/templates`,
} as const;
