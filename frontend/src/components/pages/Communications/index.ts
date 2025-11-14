/**
 * Communications Module Components
 * 
 * This barrel file exports all communication-related components for easy importing
 * throughout the application. The Communications module handles all aspects of
 * communication management in the healthcare system.
 * 
 * Components included:
 * - CommunicationCard: Display component for individual communication items
 * - CommunicationHeader: Header component with search, filters, and actions
 * - CommunicationList: List view for multiple communications with filtering
 * - CommunicationDetail: Detailed view for individual communications
 * - CommunicationComposer: Component for creating new communications
 * - CommunicationTemplates: Template management for standardized messages
 * - CommunicationHistory: Communication history and audit trail
 * - CommunicationThreads: Threaded conversation management
 * - CommunicationNotifications: Notification preferences and delivery status
 * - CommunicationAnalytics: Analytics and reporting for communications
 * 
 * @example
 * ```tsx
 * import { 
 *   CommunicationCard, 
 *   CommunicationList, 
 *   CommunicationComposer 
 * } from '@/components/pages/Communications';
 * ```
 */

// Communication display and management components
export { default as CommunicationCard } from './CommunicationCard';
export { default as CommunicationHeader } from './CommunicationHeader';
export { default as CommunicationList } from './CommunicationList';
export { default as CommunicationDetail } from './CommunicationDetail';

// Communication creation and templates
export { default as CommunicationComposer } from './CommunicationComposer';
export { default as CommunicationTemplates } from './CommunicationTemplates';

// Communication tracking and management
export { default as CommunicationHistory } from './CommunicationHistory';
export { default as CommunicationThreads } from './CommunicationThreads';
export { default as CommunicationNotifications } from './CommunicationNotifications';

// Communication analytics and reporting
export { default as CommunicationAnalytics } from './CommunicationAnalytics';

// Type exports for external use
export type { 
  Communication,
  CommunicationStatus,
  CommunicationType,
  CommunicationPriority,
  CommunicationCategory 
} from './CommunicationCard';

export type { 
  CommunicationTemplate,
  TemplateVariable,
  TemplateCategory 
} from './CommunicationTemplates';

export type { 
  CommunicationThread,
  ThreadMessage 
} from './CommunicationThreads';

export type { 
  CommunicationNotification,
  NotificationPreference 
} from './CommunicationNotifications';

export type {
  CommunicationMetrics,
  AnalyticsDataPoint,
  TimeSeriesData,
  CommunicationAnalyticsProps,
  SelectedMetric,
  SelectedTimeframe
} from './types';
