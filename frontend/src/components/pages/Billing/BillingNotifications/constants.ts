/**
 * Constants and default data for Billing Notifications
 */

import {
  CheckCircle,
  AlertTriangle,
  Mail,
  Eye,
  X,
  Bell,
  Info,
  FileText,
  Building,
  MessageSquare,
  BellRing,
  Zap
} from 'lucide-react';

import type {
  BillingNotification,
  NotificationTemplate,
  NotificationType,
  NotificationPriority,
  NotificationChannel
} from './types';

/**
 * Type configuration mapping
 */
export const TYPE_CONFIGS: Record<NotificationType, {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  label: string;
}> = {
  'payment-received': {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100',
    label: 'Payment Received'
  },
  'payment-overdue': {
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-100',
    label: 'Payment Overdue'
  },
  'invoice-sent': {
    icon: Mail,
    color: 'text-blue-600 bg-blue-100',
    label: 'Invoice Sent'
  },
  'invoice-viewed': {
    icon: Eye,
    color: 'text-purple-600 bg-purple-100',
    label: 'Invoice Viewed'
  },
  'payment-failed': {
    icon: X,
    color: 'text-red-600 bg-red-100',
    label: 'Payment Failed'
  },
  'reminder-sent': {
    icon: Bell,
    color: 'text-orange-600 bg-orange-100',
    label: 'Reminder Sent'
  },
  'system-alert': {
    icon: Info,
    color: 'text-gray-600 bg-gray-100',
    label: 'System Alert'
  },
  'billing-update': {
    icon: FileText,
    color: 'text-indigo-600 bg-indigo-100',
    label: 'Billing Update'
  },
  'collection-notice': {
    icon: Building,
    color: 'text-red-600 bg-red-100',
    label: 'Collection Notice'
  }
};

/**
 * Priority configuration mapping
 */
export const PRIORITY_CONFIGS: Record<NotificationPriority, {
  color: string;
  dot: string;
}> = {
  low: { color: 'text-gray-600', dot: 'bg-gray-400' },
  medium: { color: 'text-blue-600', dot: 'bg-blue-400' },
  high: { color: 'text-orange-600', dot: 'bg-orange-400' },
  urgent: { color: 'text-red-600', dot: 'bg-red-400' }
};

/**
 * Channel icon mapping
 */
export const CHANNEL_ICONS: Record<NotificationChannel, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  email: Mail,
  sms: MessageSquare,
  'in-app': Bell,
  push: BellRing,
  webhook: Zap
};

/**
 * Default mock notifications
 */
export const DEFAULT_NOTIFICATIONS: BillingNotification[] = [
  {
    id: 'NOT-001',
    type: 'payment-received',
    title: 'Payment Received',
    message: 'Payment of $350.00 received from Sarah Johnson for Invoice #INV-2024-001',
    priority: 'medium',
    status: 'unread',
    channels: ['email', 'in-app'],
    patientId: 'PAT-001',
    patientName: 'Sarah Johnson',
    invoiceId: 'INV-001',
    invoiceNumber: 'INV-2024-001',
    amount: 350,
    createdAt: '2024-10-30T10:30:00Z',
    deliveryStatus: { email: 'delivered', push: 'sent' }
  },
  {
    id: 'NOT-002',
    type: 'payment-overdue',
    title: 'Payment Overdue',
    message: 'Invoice #INV-2024-002 for Michael Chen is 5 days overdue. Amount: $275.00',
    priority: 'high',
    status: 'read',
    channels: ['email', 'sms'],
    patientId: 'PAT-002',
    patientName: 'Michael Chen',
    invoiceId: 'INV-002',
    invoiceNumber: 'INV-2024-002',
    amount: 275,
    createdAt: '2024-10-28T14:15:00Z',
    readAt: '2024-10-28T16:45:00Z',
    deliveryStatus: { email: 'delivered', sms: 'delivered' }
  },
  {
    id: 'NOT-003',
    type: 'invoice-sent',
    title: 'Invoice Sent',
    message: 'Invoice #INV-2024-003 has been sent to Emily Rodriguez',
    priority: 'low',
    status: 'starred',
    channels: ['in-app'],
    patientId: 'PAT-003',
    patientName: 'Emily Rodriguez',
    invoiceId: 'INV-003',
    invoiceNumber: 'INV-2024-003',
    amount: 420,
    createdAt: '2024-10-29T09:22:00Z',
    starredAt: '2024-10-29T11:30:00Z'
  }
];

/**
 * Default notification templates
 */
export const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Payment Reminder',
    type: 'payment-overdue',
    subject: 'Payment Reminder - Invoice {{invoiceNumber}}',
    content: 'Dear {{patientName}}, this is a friendly reminder that Invoice {{invoiceNumber}} for ${{amount}} is now overdue.',
    channels: ['email', 'sms'],
    enabled: true,
    schedule: {
      enabled: true,
      delay: 7,
      unit: 'days',
      repeat: { enabled: true, interval: 7, maxRepeats: 3 }
    }
  },
  {
    id: 'TPL-002',
    name: 'Invoice Delivery',
    type: 'invoice-sent',
    subject: 'Your Invoice is Ready - {{invoiceNumber}}',
    content: 'Dear {{patientName}}, your invoice {{invoiceNumber}} for ${{amount}} is now available.',
    channels: ['email'],
    enabled: true
  }
];
