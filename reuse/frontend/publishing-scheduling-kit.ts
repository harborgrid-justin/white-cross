/**
 * @fileoverview Publishing & Scheduling Kit - Enterprise Content Publishing System
 * @module reuse/frontend/publishing-scheduling-kit
 * @description 40+ React hooks for content publishing, scheduling, embargos, and multi-channel distribution.
 * Supports complex publishing workflows, recurring schedules, timezone handling, and cross-platform publishing.
 *
 * @example
 * ```tsx
 * import {
 *   usePublish,
 *   useSchedulePublish,
 *   usePublishingCalendar,
 *   PublishNow
 * } from './publishing-scheduling-kit';
 *
 * function ArticleEditor() {
 *   const { publish, isPublishing } = usePublish();
 *   const { calendar, events } = usePublishingCalendar();
 *
 *   return <PublishNow content={article} onPublish={publish} />;
 * }
 * ```
 *
 * @author HarborGrid Engineering
 * @version 1.0.0
 * @license MIT
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

/* ============================================================================
 * TYPE DEFINITIONS
 * ========================================================================= */

/**
 * Publishing status enumeration
 */
export enum PublishingStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  FAILED = 'failed',
  EMBARGOED = 'embargoed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * Publishing channel types
 */
export enum PublishingChannel {
  WEB = 'web',
  MOBILE = 'mobile',
  EMAIL = 'email',
  RSS = 'rss',
  SOCIAL_MEDIA = 'social_media',
  API = 'api',
  PRINT = 'print',
}

/**
 * Recurrence frequency
 */
export enum RecurrenceFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

/**
 * Publishing priority levels
 */
export enum PublishingPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Timezone information
 */
export interface TimeZone {
  /** IANA timezone identifier */
  id: string;
  /** Display name */
  name: string;
  /** UTC offset in minutes */
  offset: number;
  /** Abbreviated timezone code */
  abbreviation: string;
}

/**
 * Recurrence rule configuration
 */
export interface RecurrenceRule {
  /** Recurrence frequency */
  frequency: RecurrenceFrequency;
  /** Interval between occurrences */
  interval: number;
  /** Days of week (0-6, Sunday-Saturday) */
  byDayOfWeek?: number[];
  /** Days of month (1-31) */
  byDayOfMonth?: number[];
  /** Months of year (1-12) */
  byMonth?: number[];
  /** End date for recurrence */
  until?: Date;
  /** Number of occurrences */
  count?: number;
}

/**
 * Publishing schedule configuration
 */
export interface PublishingSchedule {
  /** Schedule ID */
  id: string;
  /** Content ID to publish */
  contentId: string;
  /** Scheduled publish date/time */
  publishAt: Date;
  /** Optional unpublish date/time */
  unpublishAt?: Date;
  /** Timezone for schedule */
  timezone: TimeZone;
  /** Recurrence rule */
  recurrence?: RecurrenceRule;
  /** Publishing channels */
  channels: PublishingChannel[];
  /** Schedule status */
  status: PublishingStatus;
  /** Priority level */
  priority: PublishingPriority;
  /** Created by user ID */
  createdBy: string;
  /** Created timestamp */
  createdAt: Date;
  /** Last modified timestamp */
  updatedAt: Date;
}

/**
 * Embargo configuration
 */
export interface Embargo {
  /** Embargo ID */
  id: string;
  /** Content ID under embargo */
  contentId: string;
  /** Embargo start date */
  startDate: Date;
  /** Embargo end date */
  endDate: Date;
  /** Embargo reason */
  reason: string;
  /** Geographic restrictions */
  geoRestrictions?: string[];
  /** Channel restrictions */
  channelRestrictions?: PublishingChannel[];
  /** Embargo status */
  isActive: boolean;
}

/**
 * Publication record
 */
export interface Publication {
  /** Publication ID */
  id: string;
  /** Content ID */
  contentId: string;
  /** Content version */
  version: number;
  /** Publication date/time */
  publishedAt: Date;
  /** Unpublish date/time */
  unpublishedAt?: Date;
  /** Expiration date/time */
  expiresAt?: Date;
  /** Publishing channels */
  channels: PublishingChannel[];
  /** Current status */
  status: PublishingStatus;
  /** Publication URL */
  url?: string;
  /** Publisher user ID */
  publishedBy: string;
  /** Publication metadata */
  metadata: Record<string, any>;
}

/**
 * Publishing rule configuration
 */
export interface PublishingRule {
  /** Rule ID */
  id: string;
  /** Rule name */
  name: string;
  /** Rule description */
  description: string;
  /** Conditions that trigger the rule */
  conditions: PublishingCondition[];
  /** Actions to execute */
  actions: PublishingAction[];
  /** Priority order */
  priority: number;
  /** Whether rule is enabled */
  enabled: boolean;
}

/**
 * Publishing condition
 */
export interface PublishingCondition {
  /** Condition type */
  type: 'content_type' | 'author' | 'category' | 'tag' | 'custom';
  /** Comparison operator */
  operator: 'equals' | 'not_equals' | 'contains' | 'matches';
  /** Value to compare */
  value: any;
}

/**
 * Publishing action
 */
export interface PublishingAction {
  /** Action type */
  type: 'require_approval' | 'auto_publish' | 'notify' | 'assign_channels';
  /** Action parameters */
  params: Record<string, any>;
}

/**
 * Publishing policy
 */
export interface PublishingPolicy {
  /** Policy ID */
  id: string;
  /** Policy name */
  name: string;
  /** Approval workflow required */
  requiresApproval: boolean;
  /** Minimum approval count */
  minApprovals?: number;
  /** Allowed channels */
  allowedChannels: PublishingChannel[];
  /** Allowed users/roles */
  allowedPublishers: string[];
  /** Scheduling restrictions */
  schedulingRestrictions?: {
    minAdvanceNotice?: number; // minutes
    maxFutureSchedule?: number; // days
    blackoutDates?: Date[];
  };
}

/**
 * Calendar event for publishing
 */
export interface CalendarEvent {
  /** Event ID */
  id: string;
  /** Event title */
  title: string;
  /** Event start date */
  start: Date;
  /** Event end date */
  end?: Date;
  /** Related schedule */
  schedule?: PublishingSchedule;
  /** Related publication */
  publication?: Publication;
  /** Event type */
  type: 'scheduled' | 'published' | 'embargo' | 'expiration';
  /** Event color for calendar display */
  color?: string;
}

/**
 * Publishing queue item
 */
export interface QueueItem {
  /** Queue item ID */
  id: string;
  /** Schedule reference */
  schedule: PublishingSchedule;
  /** Queue position */
  position: number;
  /** Estimated publish time */
  estimatedPublishTime: Date;
  /** Retry count */
  retryCount: number;
  /** Last error if any */
  lastError?: string;
}

/**
 * Publishing notification
 */
export interface PublishingNotification {
  /** Notification ID */
  id: string;
  /** Notification type */
  type: 'success' | 'warning' | 'error' | 'info';
  /** Notification message */
  message: string;
  /** Related content ID */
  contentId?: string;
  /** Related schedule ID */
  scheduleId?: string;
  /** Timestamp */
  timestamp: Date;
  /** Whether notification was read */
  read: boolean;
}

/**
 * Multi-channel publishing configuration
 */
export interface MultiChannelConfig {
  /** Channels to publish to */
  channels: PublishingChannel[];
  /** Channel-specific configurations */
  channelConfigs: Map<PublishingChannel, Record<string, any>>;
  /** Whether to publish simultaneously */
  simultaneous: boolean;
  /** Fallback strategy on failure */
  fallbackStrategy: 'continue' | 'rollback' | 'retry';
}

/**
 * Hook options for publishing operations
 */
export interface PublishOptions {
  /** Channels to publish to */
  channels?: PublishingChannel[];
  /** Immediate publish or schedule */
  immediate?: boolean;
  /** Success callback */
  onSuccess?: (publication: Publication) => void;
  /** Error callback */
  onError?: (error: Error) => void;
  /** Publish metadata */
  metadata?: Record<string, any>;
}

/**
 * Hook options for scheduling operations
 */
export interface ScheduleOptions {
  /** Timezone for schedule */
  timezone?: TimeZone;
  /** Recurrence rule */
  recurrence?: RecurrenceRule;
  /** Priority level */
  priority?: PublishingPriority;
  /** Success callback */
  onSuccess?: (schedule: PublishingSchedule) => void;
  /** Error callback */
  onError?: (error: Error) => void;
}

/* ============================================================================
 * CORE PUBLISHING HOOKS
 * ========================================================================= */

/**
 * Hook for publishing content
 *
 * @description Manages the publishing process with support for immediate and scheduled publishing
 *
 * @example
 * ```tsx
 * function PublishButton() {
 *   const { publish, isPublishing, error } = usePublish({
 *     channels: [PublishingChannel.WEB, PublishingChannel.MOBILE],
 *     onSuccess: (pub) => console.log('Published:', pub.id)
 *   });
 *
 *   return (
 *     <button onClick={() => publish('content-123')} disabled={isPublishing}>
 *       {isPublishing ? 'Publishing...' : 'Publish'}
 *     </button>
 *   );
 * }
 * ```
 */
export function usePublish(options: PublishOptions = {}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [publication, setPublication] = useState<Publication | null>(null);

  const publish = useCallback(async (contentId: string, publishOptions?: Partial<PublishOptions>) => {
    setIsPublishing(true);
    setError(null);

    try {
      // Merge options
      const finalOptions = { ...options, ...publishOptions };

      // Simulate API call
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          channels: finalOptions.channels || [PublishingChannel.WEB],
          metadata: finalOptions.metadata,
        }),
      });

      if (!response.ok) throw new Error('Publishing failed');

      const pub: Publication = await response.json();
      setPublication(pub);

      finalOptions.onSuccess?.(pub);
      return pub;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsPublishing(false);
    }
  }, [options]);

  return {
    publish,
    isPublishing,
    error,
    publication,
  };
}

/**
 * Hook for unpublishing content
 *
 * @description Removes published content from specified channels
 *
 * @example
 * ```tsx
 * function UnpublishButton({ publicationId }: { publicationId: string }) {
 *   const { unpublish, isUnpublishing } = useUnpublish();
 *
 *   return (
 *     <button onClick={() => unpublish(publicationId)}>
 *       {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useUnpublish() {
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unpublish = useCallback(async (
    publicationId: string,
    channels?: PublishingChannel[]
  ) => {
    setIsUnpublishing(true);
    setError(null);

    try {
      const response = await fetch(`/api/publish/${publicationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels }),
      });

      if (!response.ok) throw new Error('Unpublishing failed');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsUnpublishing(false);
    }
  }, []);

  return {
    unpublish,
    isUnpublishing,
    error,
  };
}

/**
 * Hook for scheduling content publication
 *
 * @description Creates and manages scheduled publications with timezone support
 *
 * @example
 * ```tsx
 * function SchedulePublisher() {
 *   const { schedulePublish, isScheduling, schedule } = useSchedulePublish({
 *     timezone: { id: 'America/New_York', name: 'EST', offset: -300, abbreviation: 'EST' },
 *     priority: PublishingPriority.HIGH
 *   });
 *
 *   const handleSchedule = async () => {
 *     await schedulePublish('content-123', new Date('2025-12-01T10:00:00'));
 *   };
 *
 *   return <button onClick={handleSchedule}>Schedule</button>;
 * }
 * ```
 */
export function useSchedulePublish(options: ScheduleOptions = {}) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [schedule, setSchedule] = useState<PublishingSchedule | null>(null);

  const schedulePublish = useCallback(async (
    contentId: string,
    publishAt: Date,
    scheduleOptions?: Partial<ScheduleOptions>
  ) => {
    setIsScheduling(true);
    setError(null);

    try {
      const finalOptions = { ...options, ...scheduleOptions };

      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          publishAt: publishAt.toISOString(),
          timezone: finalOptions.timezone,
          recurrence: finalOptions.recurrence,
          priority: finalOptions.priority || PublishingPriority.NORMAL,
        }),
      });

      if (!response.ok) throw new Error('Scheduling failed');

      const sched: PublishingSchedule = await response.json();
      setSchedule(sched);

      finalOptions.onSuccess?.(sched);
      return sched;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsScheduling(false);
    }
  }, [options]);

  return {
    schedulePublish,
    isScheduling,
    error,
    schedule,
  };
}

/* ============================================================================
 * CALENDAR & TIMELINE HOOKS
 * ========================================================================= */

/**
 * Hook for managing publishing calendar
 *
 * @description Fetches and manages calendar events for scheduled and published content
 *
 * @example
 * ```tsx
 * function PublishingCalendar() {
 *   const { events, isLoading, refetch } = usePublishingCalendar({
 *     startDate: new Date('2025-11-01'),
 *     endDate: new Date('2025-11-30')
 *   });
 *
 *   return (
 *     <div>
 *       {events.map(event => (
 *         <div key={event.id}>{event.title} - {event.start.toLocaleString()}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublishingCalendar(params?: {
  startDate?: Date;
  endDate?: Date;
  channels?: PublishingChannel[];
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.set('start', params.startDate.toISOString());
      if (params?.endDate) queryParams.set('end', params.endDate.toISOString());
      if (params?.channels) queryParams.set('channels', params.channels.join(','));

      const response = await fetch(`/api/calendar?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch calendar');

      const data: CalendarEvent[] = await response.json();
      setEvents(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [params?.startDate, params?.endDate, params?.channels]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
}

/**
 * Hook for managing content schedule
 *
 * @description Fetches and manages schedules for specific content
 *
 * @example
 * ```tsx
 * function ContentScheduleList({ contentId }: { contentId: string }) {
 *   const { schedules, isLoading, updateSchedule } = useContentSchedule(contentId);
 *
 *   return (
 *     <div>
 *       {schedules.map(schedule => (
 *         <div key={schedule.id}>
 *           Scheduled for: {schedule.publishAt.toLocaleString()}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useContentSchedule(contentId: string) {
  const [schedules, setSchedules] = useState<PublishingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${contentId}/schedules`);
      if (!response.ok) throw new Error('Failed to fetch schedules');

      const data: PublishingSchedule[] = await response.json();
      setSchedules(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const updateSchedule = useCallback(async (
    scheduleId: string,
    updates: Partial<PublishingSchedule>
  ) => {
    try {
      const response = await fetch(`/api/schedule/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update schedule');

      await fetchSchedules();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  }, [fetchSchedules]);

  return {
    schedules,
    isLoading,
    error,
    refetch: fetchSchedules,
    updateSchedule,
  };
}

/**
 * Hook for managing schedule timeline view
 *
 * @description Provides timeline-based view of scheduled content
 *
 * @example
 * ```tsx
 * function TimelineView() {
 *   const { timeline, groupBy, setGroupBy } = useTimelineView();
 *
 *   return (
 *     <div>
 *       <select value={groupBy} onChange={e => setGroupBy(e.target.value as any)}>
 *         <option value="day">Day</option>
 *         <option value="week">Week</option>
 *       </select>
 *       {timeline.map(group => (
 *         <div key={group.label}>{group.items.length} items</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTimelineView(initialGroupBy: 'hour' | 'day' | 'week' | 'month' = 'day') {
  const [groupBy, setGroupBy] = useState<'hour' | 'day' | 'week' | 'month'>(initialGroupBy);
  const [timeline, setTimeline] = useState<Array<{
    label: string;
    date: Date;
    items: PublishingSchedule[];
  }>>([]);

  const { events } = usePublishingCalendar();

  useEffect(() => {
    // Group events by time period
    const grouped = new Map<string, PublishingSchedule[]>();

    events.forEach(event => {
      if (!event.schedule) return;

      const date = new Date(event.start);
      let key: string;

      switch (groupBy) {
        case 'hour':
          key = date.toISOString().slice(0, 13);
          break;
        case 'day':
          key = date.toISOString().slice(0, 10);
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().slice(0, 10);
          break;
        case 'month':
          key = date.toISOString().slice(0, 7);
          break;
      }

      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(event.schedule);
    });

    const timelineData = Array.from(grouped.entries()).map(([label, items]) => ({
      label,
      date: new Date(label),
      items,
    }));

    timelineData.sort((a, b) => a.date.getTime() - b.date.getTime());
    setTimeline(timelineData);
  }, [events, groupBy]);

  return {
    timeline,
    groupBy,
    setGroupBy,
  };
}

/* ============================================================================
 * SCHEDULE MANAGEMENT COMPONENTS/HOOKS
 * ========================================================================= */

/**
 * Hook for schedule manager functionality
 *
 * @description Provides comprehensive schedule management capabilities
 *
 * @example
 * ```tsx
 * function ScheduleManager() {
 *   const {
 *     schedules,
 *     createSchedule,
 *     updateSchedule,
 *     deleteSchedule
 *   } = useScheduleManager();
 *
 *   return <div>Managing {schedules.length} schedules</div>;
 * }
 * ```
 */
export function useScheduleManager() {
  const [schedules, setSchedules] = useState<PublishingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/schedules');
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createSchedule = useCallback(async (
    schedule: Omit<PublishingSchedule, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const response = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) throw new Error('Failed to create schedule');
    await fetchSchedules();
    return response.json();
  }, [fetchSchedules]);

  const updateSchedule = useCallback(async (
    id: string,
    updates: Partial<PublishingSchedule>
  ) => {
    const response = await fetch(`/api/schedules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update schedule');
    await fetchSchedules();
  }, [fetchSchedules]);

  const deleteSchedule = useCallback(async (id: string) => {
    const response = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete schedule');
    await fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refetch: fetchSchedules,
  };
}

/**
 * Hook for calendar view configuration
 *
 * @description Manages calendar view settings and interactions
 *
 * @example
 * ```tsx
 * function CalendarView() {
 *   const { view, setView, currentDate, navigateToDate } = useCalendarView();
 *
 *   return (
 *     <div>
 *       <select value={view} onChange={e => setView(e.target.value as any)}>
 *         <option value="month">Month</option>
 *         <option value="week">Week</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCalendarView(initialView: 'month' | 'week' | 'day' = 'month') {
  const [view, setView] = useState<'month' | 'week' | 'day'>(initialView);
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const navigateNext = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, view]);

  const navigatePrevious = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, view]);

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    view,
    setView,
    currentDate,
    navigateToDate,
    navigateNext,
    navigatePrevious,
    navigateToToday,
  };
}

/* ============================================================================
 * PUBLISHING MODES
 * ========================================================================= */

/**
 * Hook for immediate publishing (Publish Now)
 *
 * @description Handles immediate content publishing without scheduling
 *
 * @example
 * ```tsx
 * function PublishNowButton({ contentId }: { contentId: string }) {
 *   const { publishNow, isPublishing } = usePublishNow();
 *
 *   return (
 *     <button onClick={() => publishNow(contentId)} disabled={isPublishing}>
 *       Publish Now
 *     </button>
 *   );
 * }
 * ```
 */
export function usePublishNow(options?: PublishOptions) {
  const { publish, isPublishing, error, publication } = usePublish({
    ...options,
    immediate: true,
  });

  const publishNow = useCallback(async (contentId: string) => {
    return publish(contentId);
  }, [publish]);

  return {
    publishNow,
    isPublishing,
    error,
    publication,
  };
}

/**
 * Hook for scheduled publishing (Publish Later)
 *
 * @description Schedules content for future publication
 *
 * @example
 * ```tsx
 * function PublishLaterForm({ contentId }: { contentId: string }) {
 *   const { publishLater, isScheduling } = usePublishLater();
 *   const [date, setDate] = useState(new Date());
 *
 *   return (
 *     <form onSubmit={() => publishLater(contentId, date)}>
 *       <input type="datetime-local" onChange={e => setDate(new Date(e.target.value))} />
 *       <button type="submit">Schedule</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function usePublishLater(options?: ScheduleOptions) {
  const { schedulePublish, isScheduling, error, schedule } = useSchedulePublish(options);

  const publishLater = useCallback(async (
    contentId: string,
    publishAt: Date,
    unpublishAt?: Date
  ) => {
    const sched = await schedulePublish(contentId, publishAt);

    // If unpublish date provided, create unpublish schedule
    if (unpublishAt && sched) {
      await fetch(`/api/schedule/${sched.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unpublishAt: unpublishAt.toISOString() }),
      });
    }

    return sched;
  }, [schedulePublish]);

  return {
    publishLater,
    isScheduling,
    error,
    schedule,
  };
}

/**
 * Hook for recurring publication schedules
 *
 * @description Creates and manages recurring publication schedules
 *
 * @example
 * ```tsx
 * function RecurringPublisher() {
 *   const { createRecurring, isCreating } = usePublishRecurring();
 *
 *   const scheduleWeekly = async () => {
 *     await createRecurring('content-123', {
 *       frequency: RecurrenceFrequency.WEEKLY,
 *       interval: 1,
 *       byDayOfWeek: [1], // Every Monday
 *       count: 12 // 12 occurrences
 *     }, new Date('2025-11-10T10:00:00'));
 *   };
 *
 *   return <button onClick={scheduleWeekly}>Schedule Weekly</button>;
 * }
 * ```
 */
export function usePublishRecurring(options?: ScheduleOptions) {
  const { schedulePublish, isScheduling, error } = useSchedulePublish(options);
  const [recurringSchedules, setRecurringSchedules] = useState<PublishingSchedule[]>([]);

  const createRecurring = useCallback(async (
    contentId: string,
    recurrence: RecurrenceRule,
    startDate: Date
  ) => {
    const schedule = await schedulePublish(contentId, startDate, { recurrence });
    if (schedule) {
      setRecurringSchedules(prev => [...prev, schedule]);
    }
    return schedule;
  }, [schedulePublish]);

  const cancelRecurring = useCallback(async (scheduleId: string) => {
    await fetch(`/api/schedule/${scheduleId}`, {
      method: 'DELETE',
    });
    setRecurringSchedules(prev => prev.filter(s => s.id !== scheduleId));
  }, []);

  return {
    createRecurring,
    cancelRecurring,
    recurringSchedules,
    isCreating: isScheduling,
    error,
  };
}

/* ============================================================================
 * CONTENT LIFECYCLE MANAGEMENT
 * ========================================================================= */

/**
 * Hook for embargo management
 *
 * @description Creates and manages content embargos with geographic and channel restrictions
 *
 * @example
 * ```tsx
 * function EmbargoManager({ contentId }: { contentId: string }) {
 *   const { createEmbargo, removeEmbargo, embargos } = useEmbargoContent(contentId);
 *
 *   const addEmbargo = async () => {
 *     await createEmbargo({
 *       startDate: new Date(),
 *       endDate: new Date('2025-12-31'),
 *       reason: 'Legal review pending',
 *       geoRestrictions: ['US', 'CA']
 *     });
 *   };
 *
 *   return <button onClick={addEmbargo}>Add Embargo</button>;
 * }
 * ```
 */
export function useEmbargoContent(contentId: string) {
  const [embargos, setEmbargos] = useState<Embargo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmbargos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/content/${contentId}/embargos`);
      if (!response.ok) throw new Error('Failed to fetch embargos');
      const data = await response.json();
      setEmbargos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    fetchEmbargos();
  }, [fetchEmbargos]);

  const createEmbargo = useCallback(async (
    embargo: Omit<Embargo, 'id' | 'contentId' | 'isActive'>
  ) => {
    const response = await fetch(`/api/content/${contentId}/embargos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...embargo, contentId }),
    });
    if (!response.ok) throw new Error('Failed to create embargo');
    await fetchEmbargos();
    return response.json();
  }, [contentId, fetchEmbargos]);

  const removeEmbargo = useCallback(async (embargoId: string) => {
    const response = await fetch(`/api/embargos/${embargoId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove embargo');
    await fetchEmbargos();
  }, [fetchEmbargos]);

  const updateEmbargo = useCallback(async (
    embargoId: string,
    updates: Partial<Embargo>
  ) => {
    const response = await fetch(`/api/embargos/${embargoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update embargo');
    await fetchEmbargos();
  }, [fetchEmbargos]);

  return {
    embargos,
    isLoading,
    error,
    createEmbargo,
    removeEmbargo,
    updateEmbargo,
    refetch: fetchEmbargos,
  };
}

/**
 * Hook for scheduling content unpublishing
 *
 * @description Schedules content to be unpublished at a specific time
 *
 * @example
 * ```tsx
 * function UnpublishScheduler({ publicationId }: { publicationId: string }) {
 *   const { scheduleUnpublish, isScheduling } = useUnpublishAt();
 *
 *   return (
 *     <button onClick={() => scheduleUnpublish(publicationId, new Date('2025-12-31'))}>
 *       Schedule Unpublish
 *     </button>
 *   );
 * }
 * ```
 */
export function useUnpublishAt() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scheduleUnpublish = useCallback(async (
    publicationId: string,
    unpublishAt: Date
  ) => {
    setIsScheduling(true);
    setError(null);

    try {
      const response = await fetch(`/api/publications/${publicationId}/unpublish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unpublishAt: unpublishAt.toISOString() }),
      });

      if (!response.ok) throw new Error('Failed to schedule unpublish');
      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsScheduling(false);
    }
  }, []);

  const cancelUnpublish = useCallback(async (publicationId: string) => {
    const response = await fetch(`/api/publications/${publicationId}/unpublish`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to cancel unpublish');
  }, []);

  return {
    scheduleUnpublish,
    cancelUnpublish,
    isScheduling,
    error,
  };
}

/**
 * Hook for content expiration management
 *
 * @description Sets expiration dates for published content
 *
 * @example
 * ```tsx
 * function ExpirationManager({ publicationId }: { publicationId: string }) {
 *   const { setExpiration, removeExpiration } = useExpireContent();
 *
 *   return (
 *     <button onClick={() => setExpiration(publicationId, new Date('2025-12-31'))}>
 *       Set Expiration
 *     </button>
 *   );
 * }
 * ```
 */
export function useExpireContent() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setExpiration = useCallback(async (
    publicationId: string,
    expiresAt: Date
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/publications/${publicationId}/expiration`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresAt: expiresAt.toISOString() }),
      });

      if (!response.ok) throw new Error('Failed to set expiration');
      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const removeExpiration = useCallback(async (publicationId: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/publications/${publicationId}/expiration`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove expiration');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    setExpiration,
    removeExpiration,
    isUpdating,
    error,
  };
}

/* ============================================================================
 * PREVIEW & EDITING HOOKS
 * ========================================================================= */

/**
 * Hook for previewing scheduled content
 *
 * @description Generates preview of how content will appear when published
 *
 * @example
 * ```tsx
 * function ScheduledPreview({ scheduleId }: { scheduleId: string }) {
 *   const { preview, isLoading, generatePreview } = usePreviewScheduled(scheduleId);
 *
 *   return (
 *     <div>
 *       {isLoading ? 'Loading...' : <div dangerouslySetInnerHTML={{ __html: preview }} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePreviewScheduled(scheduleId: string) {
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePreview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/schedule/${scheduleId}/preview`);
      if (!response.ok) throw new Error('Failed to generate preview');

      const data = await response.json();
      setPreview(data.html || data.preview);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  return {
    preview,
    isLoading,
    error,
    generatePreview,
  };
}

/**
 * Hook for viewing scheduled content details
 *
 * @description Fetches and displays scheduled content information
 *
 * @example
 * ```tsx
 * function ScheduleDetails({ scheduleId }: { scheduleId: string }) {
 *   const { schedule, isLoading } = useViewScheduled(scheduleId);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h3>Scheduled for: {schedule?.publishAt.toLocaleString()}</h3>
 *       <p>Status: {schedule?.status}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useViewScheduled(scheduleId: string) {
  const [schedule, setSchedule] = useState<PublishingSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/schedule/${scheduleId}`);
      if (!response.ok) throw new Error('Failed to fetch schedule');

      const data = await response.json();
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    isLoading,
    error,
    refetch: fetchSchedule,
  };
}

/**
 * Hook for editing scheduled content
 *
 * @description Provides interface for modifying scheduled publications
 *
 * @example
 * ```tsx
 * function ScheduleEditor({ scheduleId }: { scheduleId: string }) {
 *   const { schedule, updateSchedule, isUpdating } = useEditScheduled(scheduleId);
 *
 *   const handleUpdate = async (newDate: Date) => {
 *     await updateSchedule({ publishAt: newDate });
 *   };
 *
 *   return <button onClick={() => handleUpdate(new Date())}>Update</button>;
 * }
 * ```
 */
export function useEditScheduled(scheduleId: string) {
  const { schedule, isLoading, refetch } = useViewScheduled(scheduleId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSchedule = useCallback(async (
    updates: Partial<PublishingSchedule>
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/schedule/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update schedule');

      await refetch();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [scheduleId, refetch]);

  return {
    schedule,
    isLoading,
    isUpdating,
    error,
    updateSchedule,
    refetch,
  };
}

/* ============================================================================
 * TIMEZONE & DATETIME UTILITIES
 * ========================================================================= */

/**
 * Hook for timezone handling
 *
 * @description Manages timezone selection and conversion
 *
 * @example
 * ```tsx
 * function TimezoneSelector() {
 *   const {
 *     currentTimezone,
 *     availableTimezones,
 *     setTimezone,
 *     convertToTimezone
 *   } = useTimezoneHandling();
 *
 *   return (
 *     <select
 *       value={currentTimezone.id}
 *       onChange={e => setTimezone(availableTimezones.find(tz => tz.id === e.target.value)!)}
 *     >
 *       {availableTimezones.map(tz => (
 *         <option key={tz.id} value={tz.id}>{tz.name}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useTimezoneHandling(initialTimezone?: TimeZone) {
  const [currentTimezone, setCurrentTimezone] = useState<TimeZone>(
    initialTimezone || {
      id: 'UTC',
      name: 'Coordinated Universal Time',
      offset: 0,
      abbreviation: 'UTC',
    }
  );

  const availableTimezones = useMemo<TimeZone[]>(() => [
    { id: 'UTC', name: 'Coordinated Universal Time', offset: 0, abbreviation: 'UTC' },
    { id: 'America/New_York', name: 'Eastern Time', offset: -300, abbreviation: 'EST' },
    { id: 'America/Chicago', name: 'Central Time', offset: -360, abbreviation: 'CST' },
    { id: 'America/Denver', name: 'Mountain Time', offset: -420, abbreviation: 'MST' },
    { id: 'America/Los_Angeles', name: 'Pacific Time', offset: -480, abbreviation: 'PST' },
    { id: 'Europe/London', name: 'British Time', offset: 0, abbreviation: 'GMT' },
    { id: 'Europe/Paris', name: 'Central European Time', offset: 60, abbreviation: 'CET' },
    { id: 'Asia/Tokyo', name: 'Japan Time', offset: 540, abbreviation: 'JST' },
    { id: 'Asia/Shanghai', name: 'China Time', offset: 480, abbreviation: 'CST' },
    { id: 'Australia/Sydney', name: 'Australian Eastern Time', offset: 600, abbreviation: 'AEST' },
  ], []);

  const convertToTimezone = useCallback((date: Date, targetTimezone: TimeZone): Date => {
    const utcTime = date.getTime();
    const targetOffset = targetTimezone.offset * 60 * 1000;
    return new Date(utcTime + targetOffset);
  }, []);

  const formatInTimezone = useCallback((
    date: Date,
    timezone: TimeZone = currentTimezone,
    format: 'short' | 'long' | 'iso' = 'long'
  ): string => {
    const convertedDate = convertToTimezone(date, timezone);

    switch (format) {
      case 'short':
        return convertedDate.toLocaleString('en-US', {
          timeZone: timezone.id,
          dateStyle: 'short',
          timeStyle: 'short',
        });
      case 'long':
        return convertedDate.toLocaleString('en-US', {
          timeZone: timezone.id,
          dateStyle: 'long',
          timeStyle: 'long',
        });
      case 'iso':
        return convertedDate.toISOString();
      default:
        return convertedDate.toString();
    }
  }, [currentTimezone, convertToTimezone]);

  return {
    currentTimezone,
    availableTimezones,
    setTimezone: setCurrentTimezone,
    convertToTimezone,
    formatInTimezone,
  };
}

/**
 * Hook for datetime selection with validation
 *
 * @description Provides datetime picker functionality with timezone support and validation
 *
 * @example
 * ```tsx
 * function DateTimePicker() {
 *   const {
 *     selectedDate,
 *     setDate,
 *     isValid,
 *     validationError
 *   } = useDateTimeSelector({
 *     minDate: new Date(),
 *     maxDate: new Date('2026-01-01')
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         type="datetime-local"
 *         onChange={e => setDate(new Date(e.target.value))}
 *       />
 *       {!isValid && <span>{validationError}</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDateTimeSelector(options?: {
  minDate?: Date;
  maxDate?: Date;
  timezone?: TimeZone;
  excludeDates?: Date[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const { currentTimezone } = useTimezoneHandling(options?.timezone);

  const isValid = useMemo(() => {
    if (!selectedDate) return false;

    if (options?.minDate && selectedDate < options.minDate) {
      setValidationError(`Date must be after ${options.minDate.toLocaleString()}`);
      return false;
    }

    if (options?.maxDate && selectedDate > options.maxDate) {
      setValidationError(`Date must be before ${options.maxDate.toLocaleString()}`);
      return false;
    }

    if (options?.excludeDates?.some(d =>
      d.toDateString() === selectedDate.toDateString()
    )) {
      setValidationError('This date is not available');
      return false;
    }

    setValidationError('');
    return true;
  }, [selectedDate, options]);

  const setDate = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const resetDate = useCallback(() => {
    setSelectedDate(null);
    setValidationError('');
  }, []);

  return {
    selectedDate,
    setDate,
    resetDate,
    isValid,
    validationError,
    timezone: currentTimezone,
  };
}

/* ============================================================================
 * RULES & POLICIES
 * ========================================================================= */

/**
 * Hook for managing publishing rules
 *
 * @description Creates and manages automated publishing rules
 *
 * @example
 * ```tsx
 * function RulesManager() {
 *   const { rules, createRule, updateRule, deleteRule } = usePublishingRules();
 *
 *   const addAutoPublishRule = async () => {
 *     await createRule({
 *       name: 'Auto-publish blog posts',
 *       description: 'Automatically publish blog posts from approved authors',
 *       conditions: [
 *         { type: 'content_type', operator: 'equals', value: 'blog_post' },
 *         { type: 'author', operator: 'equals', value: 'approved_author_id' }
 *       ],
 *       actions: [
 *         { type: 'auto_publish', params: { channels: ['web'] } }
 *       ],
 *       priority: 1,
 *       enabled: true
 *     });
 *   };
 *
 *   return <button onClick={addAutoPublishRule}>Add Rule</button>;
 * }
 * ```
 */
export function usePublishingRules() {
  const [rules, setRules] = useState<PublishingRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/publishing-rules');
      if (!response.ok) throw new Error('Failed to fetch rules');
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = useCallback(async (
    rule: Omit<PublishingRule, 'id'>
  ) => {
    const response = await fetch('/api/publishing-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    if (!response.ok) throw new Error('Failed to create rule');
    await fetchRules();
    return response.json();
  }, [fetchRules]);

  const updateRule = useCallback(async (
    id: string,
    updates: Partial<PublishingRule>
  ) => {
    const response = await fetch(`/api/publishing-rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update rule');
    await fetchRules();
  }, [fetchRules]);

  const deleteRule = useCallback(async (id: string) => {
    const response = await fetch(`/api/publishing-rules/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rule');
    await fetchRules();
  }, [fetchRules]);

  const evaluateRules = useCallback((contentMetadata: Record<string, any>): PublishingRule[] => {
    return rules
      .filter(rule => rule.enabled)
      .filter(rule => {
        return rule.conditions.every(condition => {
          const value = contentMetadata[condition.type];
          switch (condition.operator) {
            case 'equals':
              return value === condition.value;
            case 'not_equals':
              return value !== condition.value;
            case 'contains':
              return String(value).includes(String(condition.value));
            case 'matches':
              return new RegExp(condition.value).test(String(value));
            default:
              return false;
          }
        });
      })
      .sort((a, b) => a.priority - b.priority);
  }, [rules]);

  return {
    rules,
    isLoading,
    error,
    createRule,
    updateRule,
    deleteRule,
    evaluateRules,
    refetch: fetchRules,
  };
}

/**
 * Hook for managing publishing policies
 *
 * @description Manages organizational publishing policies and restrictions
 *
 * @example
 * ```tsx
 * function PolicyManager() {
 *   const { policies, createPolicy, validateAgainstPolicy } = usePublishingPolicies();
 *
 *   const checkPolicy = async (contentId: string, channels: PublishingChannel[]) => {
 *     const validation = await validateAgainstPolicy(contentId, channels);
 *     if (!validation.allowed) {
 *       alert(`Policy violation: ${validation.reason}`);
 *     }
 *   };
 *
 *   return <div>Managing {policies.length} policies</div>;
 * }
 * ```
 */
export function usePublishingPolicies() {
  const [policies, setPolicies] = useState<PublishingPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/publishing-policies');
      if (!response.ok) throw new Error('Failed to fetch policies');
      const data = await response.json();
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const createPolicy = useCallback(async (
    policy: Omit<PublishingPolicy, 'id'>
  ) => {
    const response = await fetch('/api/publishing-policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy),
    });
    if (!response.ok) throw new Error('Failed to create policy');
    await fetchPolicies();
    return response.json();
  }, [fetchPolicies]);

  const validateAgainstPolicy = useCallback(async (
    contentId: string,
    channels: PublishingChannel[],
    publisherId?: string
  ): Promise<{ allowed: boolean; reason?: string; policy?: PublishingPolicy }> => {
    const applicablePolicies = policies.filter(policy =>
      channels.some(channel => policy.allowedChannels.includes(channel))
    );

    for (const policy of applicablePolicies) {
      // Check publisher permissions
      if (publisherId && !policy.allowedPublishers.includes(publisherId)) {
        return {
          allowed: false,
          reason: 'Publisher not authorized by policy',
          policy,
        };
      }

      // Check channel restrictions
      const unauthorizedChannels = channels.filter(
        channel => !policy.allowedChannels.includes(channel)
      );
      if (unauthorizedChannels.length > 0) {
        return {
          allowed: false,
          reason: `Channels not allowed: ${unauthorizedChannels.join(', ')}`,
          policy,
        };
      }
    }

    return { allowed: true };
  }, [policies]);

  return {
    policies,
    isLoading,
    error,
    createPolicy,
    validateAgainstPolicy,
    refetch: fetchPolicies,
  };
}

/* ============================================================================
 * MULTI-CHANNEL PUBLISHING
 * ========================================================================= */

/**
 * Hook for multi-channel publishing
 *
 * @description Publishes content across multiple channels simultaneously or sequentially
 *
 * @example
 * ```tsx
 * function MultiChannelPublisher() {
 *   const { publishToChannels, progress, isPublishing } = useMultiChannelPublish();
 *
 *   const publish = async () => {
 *     await publishToChannels('content-123', {
 *       channels: [
 *         PublishingChannel.WEB,
 *         PublishingChannel.MOBILE,
 *         PublishingChannel.EMAIL
 *       ],
 *       channelConfigs: new Map([
 *         [PublishingChannel.EMAIL, { template: 'newsletter' }],
 *         [PublishingChannel.SOCIAL_MEDIA, { platforms: ['twitter', 'facebook'] }]
 *       ]),
 *       simultaneous: true,
 *       fallbackStrategy: 'continue'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={publish}>Publish to All Channels</button>
 *       <progress value={progress.completed} max={progress.total} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultiChannelPublish() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0, failed: 0 });
  const [results, setResults] = useState<Map<PublishingChannel, Publication | Error>>(new Map());
  const [error, setError] = useState<Error | null>(null);

  const publishToChannels = useCallback(async (
    contentId: string,
    config: MultiChannelConfig
  ) => {
    setIsPublishing(true);
    setError(null);
    setProgress({ completed: 0, total: config.channels.length, failed: 0 });
    setResults(new Map());

    const publishResults = new Map<PublishingChannel, Publication | Error>();

    try {
      if (config.simultaneous) {
        // Publish to all channels simultaneously
        const promises = config.channels.map(async channel => {
          try {
            const channelConfig = config.channelConfigs.get(channel) || {};
            const response = await fetch('/api/publish', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contentId,
                channels: [channel],
                config: channelConfig,
              }),
            });

            if (!response.ok) throw new Error(`Failed to publish to ${channel}`);

            const publication = await response.json();
            publishResults.set(channel, publication);

            setProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
            return { channel, publication };
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error');
            publishResults.set(channel, error);

            setProgress(prev => ({
              ...prev,
              completed: prev.completed + 1,
              failed: prev.failed + 1
            }));

            if (config.fallbackStrategy === 'rollback') {
              throw error;
            }

            return { channel, error };
          }
        });

        await Promise.all(promises);
      } else {
        // Publish to channels sequentially
        for (const channel of config.channels) {
          try {
            const channelConfig = config.channelConfigs.get(channel) || {};
            const response = await fetch('/api/publish', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contentId,
                channels: [channel],
                config: channelConfig,
              }),
            });

            if (!response.ok) throw new Error(`Failed to publish to ${channel}`);

            const publication = await response.json();
            publishResults.set(channel, publication);

            setProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error');
            publishResults.set(channel, error);

            setProgress(prev => ({
              ...prev,
              completed: prev.completed + 1,
              failed: prev.failed + 1
            }));

            if (config.fallbackStrategy === 'rollback') {
              // Rollback previous publications
              await rollbackPublications(Array.from(publishResults.keys()));
              throw error;
            }
          }
        }
      }

      setResults(publishResults);
      return publishResults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Multi-channel publishing failed');
      setError(error);
      throw error;
    } finally {
      setIsPublishing(false);
    }
  }, []);

  const rollbackPublications = async (channels: PublishingChannel[]) => {
    // Implement rollback logic
    const promises = channels.map(channel =>
      fetch(`/api/publish/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      })
    );
    await Promise.all(promises);
  };

  return {
    publishToChannels,
    isPublishing,
    progress,
    results,
    error,
  };
}

/**
 * Hook for cross-platform publishing coordination
 *
 * @description Coordinates publishing across different platforms with platform-specific configurations
 *
 * @example
 * ```tsx
 * function CrossPlatformPublisher() {
 *   const { publishCrossPlatform, platforms } = useCrossPlatformPublish();
 *
 *   const publish = async () => {
 *     await publishCrossPlatform('content-123', {
 *       web: { seo: true, amp: true },
 *       mobile: { pushNotification: true },
 *       social: { platforms: ['twitter', 'linkedin'], autoPost: true }
 *     });
 *   };
 *
 *   return <button onClick={publish}>Publish Everywhere</button>;
 * }
 * ```
 */
export function useCrossPlatformPublish() {
  const { publishToChannels, isPublishing, progress, results } = useMultiChannelPublish();
  const [platformConfigs, setPlatformConfigs] = useState<Map<string, any>>(new Map());

  const publishCrossPlatform = useCallback(async (
    contentId: string,
    platformSettings: Record<string, any>
  ) => {
    // Map platform settings to channels
    const channelConfigs = new Map<PublishingChannel, Record<string, any>>();
    const channels: PublishingChannel[] = [];

    if (platformSettings.web) {
      channels.push(PublishingChannel.WEB);
      channelConfigs.set(PublishingChannel.WEB, platformSettings.web);
    }

    if (platformSettings.mobile) {
      channels.push(PublishingChannel.MOBILE);
      channelConfigs.set(PublishingChannel.MOBILE, platformSettings.mobile);
    }

    if (platformSettings.email) {
      channels.push(PublishingChannel.EMAIL);
      channelConfigs.set(PublishingChannel.EMAIL, platformSettings.email);
    }

    if (platformSettings.social) {
      channels.push(PublishingChannel.SOCIAL_MEDIA);
      channelConfigs.set(PublishingChannel.SOCIAL_MEDIA, platformSettings.social);
    }

    if (platformSettings.rss) {
      channels.push(PublishingChannel.RSS);
      channelConfigs.set(PublishingChannel.RSS, platformSettings.rss);
    }

    setPlatformConfigs(channelConfigs);

    return publishToChannels(contentId, {
      channels,
      channelConfigs,
      simultaneous: true,
      fallbackStrategy: 'continue',
    });
  }, [publishToChannels]);

  const platforms = useMemo(() => ({
    web: PublishingChannel.WEB,
    mobile: PublishingChannel.MOBILE,
    email: PublishingChannel.EMAIL,
    social: PublishingChannel.SOCIAL_MEDIA,
    rss: PublishingChannel.RSS,
    api: PublishingChannel.API,
    print: PublishingChannel.PRINT,
  }), []);

  return {
    publishCrossPlatform,
    platforms,
    platformConfigs,
    isPublishing,
    progress,
    results,
  };
}

/* ============================================================================
 * QUEUE & STATUS MANAGEMENT
 * ========================================================================= */

/**
 * Hook for managing publishing queue
 *
 * @description Manages the queue of scheduled publications
 *
 * @example
 * ```tsx
 * function PublishingQueue() {
 *   const { queue, isLoading, removeFromQueue, reorderQueue } = usePublishingQueue();
 *
 *   return (
 *     <div>
 *       <h3>Publishing Queue ({queue.length} items)</h3>
 *       {queue.map(item => (
 *         <div key={item.id}>
 *           Position {item.position}: {item.schedule.contentId}
 *           <button onClick={() => removeFromQueue(item.id)}>Remove</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublishingQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/publishing-queue');
      if (!response.ok) throw new Error('Failed to fetch queue');
      const data = await response.json();
      setQueue(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();

    // Poll for queue updates every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const addToQueue = useCallback(async (schedule: PublishingSchedule) => {
    const response = await fetch('/api/publishing-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId: schedule.id }),
    });
    if (!response.ok) throw new Error('Failed to add to queue');
    await fetchQueue();
  }, [fetchQueue]);

  const removeFromQueue = useCallback(async (queueItemId: string) => {
    const response = await fetch(`/api/publishing-queue/${queueItemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove from queue');
    await fetchQueue();
  }, [fetchQueue]);

  const reorderQueue = useCallback(async (
    queueItemId: string,
    newPosition: number
  ) => {
    const response = await fetch(`/api/publishing-queue/${queueItemId}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position: newPosition }),
    });
    if (!response.ok) throw new Error('Failed to reorder queue');
    await fetchQueue();
  }, [fetchQueue]);

  const retryFailed = useCallback(async (queueItemId: string) => {
    const response = await fetch(`/api/publishing-queue/${queueItemId}/retry`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to retry');
    await fetchQueue();
  }, [fetchQueue]);

  return {
    queue,
    isLoading,
    error,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    retryFailed,
    refetch: fetchQueue,
  };
}

/**
 * Hook for monitoring publishing status
 *
 * @description Real-time monitoring of publishing operations
 *
 * @example
 * ```tsx
 * function StatusMonitor({ contentId }: { contentId: string }) {
 *   const { status, isMonitoring, startMonitoring, stopMonitoring } = usePublishingStatus(contentId);
 *
 *   useEffect(() => {
 *     startMonitoring();
 *     return () => stopMonitoring();
 *   }, []);
 *
 *   return <div>Status: {status}</div>;
 * }
 * ```
 */
export function usePublishingStatus(contentId: string) {
  const [status, setStatus] = useState<PublishingStatus>(PublishingStatus.DRAFT);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [statusHistory, setStatusHistory] = useState<Array<{
    status: PublishingStatus;
    timestamp: Date;
  }>>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/content/${contentId}/status`);
      if (!response.ok) throw new Error('Failed to fetch status');

      const data = await response.json();
      setStatus(data.status);

      setStatusHistory(prev => [...prev, {
        status: data.status,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error('Status fetch error:', err);
    }
  }, [contentId]);

  const startMonitoring = useCallback((pollInterval: number = 5000) => {
    setIsMonitoring(true);
    fetchStatus();

    intervalRef.current = setInterval(fetchStatus, pollInterval);
  }, [fetchStatus]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    status,
    statusHistory,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    refetch: fetchStatus,
  };
}

/* ============================================================================
 * NOTIFICATIONS & ALERTS
 * ========================================================================= */

/**
 * Hook for publishing notifications
 *
 * @description Manages notifications for publishing events
 *
 * @example
 * ```tsx
 * function NotificationCenter() {
 *   const {
 *     notifications,
 *     unreadCount,
 *     markAsRead,
 *     clearAll
 *   } = usePublishingNotifications();
 *
 *   return (
 *     <div>
 *       <h3>Notifications ({unreadCount} unread)</h3>
 *       {notifications.map(notif => (
 *         <div key={notif.id} onClick={() => markAsRead(notif.id)}>
 *           {notif.message}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublishingNotifications() {
  const [notifications, setNotifications] = useState<PublishingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/publishing');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (notificationId: string) => {
    await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await fetch('/api/notifications/read-all', {
      method: 'PATCH',
    });
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const clearAll = useCallback(async () => {
    await fetch('/api/notifications', {
      method: 'DELETE',
    });
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: Omit<PublishingNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: PublishingNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification,
    refetch: fetchNotifications,
  };
}

/**
 * Hook for publishing alerts and warnings
 *
 * @description Manages critical alerts for publishing operations
 *
 * @example
 * ```tsx
 * function AlertSystem() {
 *   const { alerts, dismissAlert, hasActiveAlerts } = usePublishingAlerts();
 *
 *   return (
 *     <div>
 *       {hasActiveAlerts && <div className="alert-badge">!</div>}
 *       {alerts.map(alert => (
 *         <div key={alert.id} className={`alert alert-${alert.severity}`}>
 *           {alert.message}
 *           <button onClick={() => dismissAlert(alert.id)}>Dismiss</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublishingAlerts() {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    timestamp: Date;
    contentId?: string;
    scheduleId?: string;
    dismissed: boolean;
  }>>([]);

  const addAlert = useCallback((alert: {
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    contentId?: string;
    scheduleId?: string;
  }) => {
    const newAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      dismissed: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  }, []);

  const clearDismissed = useCallback(() => {
    setAlerts(prev => prev.filter(alert => !alert.dismissed));
  }, []);

  const activeAlerts = useMemo(() =>
    alerts.filter(alert => !alert.dismissed),
    [alerts]
  );

  const hasActiveAlerts = useMemo(() =>
    activeAlerts.length > 0,
    [activeAlerts]
  );

  const criticalAlerts = useMemo(() =>
    activeAlerts.filter(alert => alert.severity === 'critical'),
    [activeAlerts]
  );

  return {
    alerts: activeAlerts,
    allAlerts: alerts,
    criticalAlerts,
    hasActiveAlerts,
    addAlert,
    dismissAlert,
    clearDismissed,
  };
}

/* ============================================================================
 * SCHEDULE MODIFICATION HOOKS
 * ========================================================================= */

/**
 * Hook for rescheduling content
 *
 * @description Reschedules published or scheduled content to a new date/time
 *
 * @example
 * ```tsx
 * function RescheduleButton({ scheduleId }: { scheduleId: string }) {
 *   const { reschedule, isRescheduling } = useRescheduleContent();
 *
 *   const handleReschedule = async () => {
 *     const newDate = new Date('2025-12-15T10:00:00');
 *     await reschedule(scheduleId, newDate);
 *   };
 *
 *   return (
 *     <button onClick={handleReschedule} disabled={isRescheduling}>
 *       Reschedule
 *     </button>
 *   );
 * }
 * ```
 */
export function useRescheduleContent() {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reschedule = useCallback(async (
    scheduleId: string,
    newPublishAt: Date,
    options?: {
      preserveRecurrence?: boolean;
      notifySubscribers?: boolean;
    }
  ) => {
    setIsRescheduling(true);
    setError(null);

    try {
      const response = await fetch(`/api/schedule/${scheduleId}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishAt: newPublishAt.toISOString(),
          preserveRecurrence: options?.preserveRecurrence ?? false,
          notifySubscribers: options?.notifySubscribers ?? true,
        }),
      });

      if (!response.ok) throw new Error('Failed to reschedule');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsRescheduling(false);
    }
  }, []);

  const bulkReschedule = useCallback(async (
    scheduleIds: string[],
    newPublishAt: Date
  ) => {
    setIsRescheduling(true);
    setError(null);

    try {
      const response = await fetch('/api/schedule/bulk-reschedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleIds,
          publishAt: newPublishAt.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to bulk reschedule');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsRescheduling(false);
    }
  }, []);

  return {
    reschedule,
    bulkReschedule,
    isRescheduling,
    error,
  };
}

/**
 * Hook for canceling scheduled publications
 *
 * @description Cancels scheduled publications before they go live
 *
 * @example
 * ```tsx
 * function CancelScheduleButton({ scheduleId }: { scheduleId: string }) {
 *   const { cancelSchedule, isCanceling } = useCancelSchedule();
 *
 *   const handleCancel = async () => {
 *     if (confirm('Are you sure you want to cancel this schedule?')) {
 *       await cancelSchedule(scheduleId, 'User requested cancellation');
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleCancel} disabled={isCanceling}>
 *       Cancel Schedule
 *     </button>
 *   );
 * }
 * ```
 */
export function useCancelSchedule() {
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelSchedule = useCallback(async (
    scheduleId: string,
    reason?: string
  ) => {
    setIsCanceling(true);
    setError(null);

    try {
      const response = await fetch(`/api/schedule/${scheduleId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error('Failed to cancel schedule');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsCanceling(false);
    }
  }, []);

  const bulkCancel = useCallback(async (
    scheduleIds: string[],
    reason?: string
  ) => {
    setIsCanceling(true);
    setError(null);

    try {
      const response = await fetch('/api/schedule/bulk-cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleIds, reason }),
      });

      if (!response.ok) throw new Error('Failed to bulk cancel');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsCanceling(false);
    }
  }, []);

  return {
    cancelSchedule,
    bulkCancel,
    isCanceling,
    error,
  };
}

/* ============================================================================
 * COMPONENT EXPORTS & UTILITIES
 * ========================================================================= */

/**
 * Component: PublishNow - Immediate publish button component
 *
 * @example
 * ```tsx
 * <PublishNow
 *   contentId="content-123"
 *   channels={[PublishingChannel.WEB, PublishingChannel.MOBILE]}
 *   onSuccess={(pub) => console.log('Published!', pub)}
 * />
 * ```
 */
export function PublishNow({
  contentId,
  channels,
  onSuccess,
  onError,
  children,
  className,
}: {
  contentId: string;
  channels?: PublishingChannel[];
  onSuccess?: (publication: Publication) => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
  className?: string;
}) {
  const { publishNow, isPublishing } = usePublishNow({ channels, onSuccess, onError });

  return (
    <button
      onClick={() => publishNow(contentId)}
      disabled={isPublishing}
      className={className}
      aria-busy={isPublishing}
    >
      {children || (isPublishing ? 'Publishing...' : 'Publish Now')}
    </button>
  );
}

/**
 * Component: PublishLater - Scheduled publish form component
 *
 * @example
 * ```tsx
 * <PublishLater
 *   contentId="content-123"
 *   onScheduled={(schedule) => console.log('Scheduled!', schedule)}
 * />
 * ```
 */
export function PublishLater({
  contentId,
  onScheduled,
  children,
  className,
}: {
  contentId: string;
  onScheduled?: (schedule: PublishingSchedule) => void;
  children?: ReactNode;
  className?: string;
}) {
  const { publishLater, isScheduling } = usePublishLater({
    onSuccess: onScheduled,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSchedule = async () => {
    await publishLater(contentId, selectedDate);
  };

  return (
    <div className={className}>
      {children || (
        <>
          <input
            type="datetime-local"
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            disabled={isScheduling}
          />
          <button onClick={handleSchedule} disabled={isScheduling}>
            {isScheduling ? 'Scheduling...' : 'Schedule'}
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Component: ScheduleManager - Full schedule management interface
 *
 * @example
 * ```tsx
 * <ScheduleManager
 *   onScheduleClick={(schedule) => navigate(`/schedule/${schedule.id}`)}
 * />
 * ```
 */
export function ScheduleManager({
  onScheduleClick,
  className,
}: {
  onScheduleClick?: (schedule: PublishingSchedule) => void;
  className?: string;
}) {
  const { schedules, isLoading, deleteSchedule } = useScheduleManager();

  if (isLoading) return <div>Loading schedules...</div>;

  return (
    <div className={className}>
      <h3>Schedule Manager ({schedules.length} schedules)</h3>
      <div>
        {schedules.map(schedule => (
          <div key={schedule.id} onClick={() => onScheduleClick?.(schedule)}>
            <strong>{schedule.contentId}</strong>
            <p>Scheduled: {schedule.publishAt.toLocaleString()}</p>
            <p>Status: {schedule.status}</p>
            <button onClick={(e) => {
              e.stopPropagation();
              deleteSchedule(schedule.id);
            }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component: CalendarView - Calendar visualization of schedules
 *
 * @example
 * ```tsx
 * <CalendarView
 *   onEventClick={(event) => console.log('Event clicked', event)}
 * />
 * ```
 */
export function CalendarView({
  onEventClick,
  className,
}: {
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}) {
  const { view, setView, currentDate, navigateNext, navigatePrevious } = useCalendarView();
  const { events, isLoading } = usePublishingCalendar();

  if (isLoading) return <div>Loading calendar...</div>;

  return (
    <div className={className}>
      <div>
        <button onClick={navigatePrevious}>Previous</button>
        <span>{currentDate.toLocaleDateString()}</span>
        <button onClick={navigateNext}>Next</button>
        <select value={view} onChange={e => setView(e.target.value as any)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <div>
        {events.map(event => (
          <div key={event.id} onClick={() => onEventClick?.(event)}>
            <strong>{event.title}</strong>
            <p>{event.start.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component: TimelineView - Timeline visualization of schedules
 *
 * @example
 * ```tsx
 * <TimelineView
 *   groupBy="day"
 *   onItemClick={(schedule) => console.log('Schedule clicked', schedule)}
 * />
 * ```
 */
export function TimelineView({
  groupBy = 'day',
  onItemClick,
  className,
}: {
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  onItemClick?: (schedule: PublishingSchedule) => void;
  className?: string;
}) {
  const { timeline, setGroupBy } = useTimelineView(groupBy);

  return (
    <div className={className}>
      <select value={groupBy} onChange={e => setGroupBy(e.target.value as any)}>
        <option value="hour">Hour</option>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      <div>
        {timeline.map(group => (
          <div key={group.label}>
            <h4>{group.date.toLocaleDateString()}</h4>
            <div>
              {group.items.map(item => (
                <div key={item.id} onClick={() => onItemClick?.(item)}>
                  {item.contentId} - {item.publishAt.toLocaleTimeString()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * UTILITY FUNCTIONS
 * ========================================================================= */

/**
 * Utility: Format publishing date with timezone
 */
export function formatPublishDate(
  date: Date,
  timezone: TimeZone,
  format: 'short' | 'long' | 'relative' = 'long'
): string {
  if (format === 'relative') {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (diff > 0) return 'soon';
    return 'past';
  }

  return date.toLocaleString('en-US', {
    timeZone: timezone.id,
    dateStyle: format === 'short' ? 'short' : 'long',
    timeStyle: format === 'short' ? 'short' : 'long',
  });
}

/**
 * Utility: Validate schedule against business rules
 */
export function validateSchedule(
  schedule: Partial<PublishingSchedule>,
  policy?: PublishingPolicy
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!schedule.publishAt) {
    errors.push('Publish date is required');
  } else if (schedule.publishAt < new Date()) {
    errors.push('Publish date must be in the future');
  }

  if (policy?.schedulingRestrictions) {
    const { minAdvanceNotice, maxFutureSchedule, blackoutDates } = policy.schedulingRestrictions;

    if (minAdvanceNotice && schedule.publishAt) {
      const minDate = new Date(Date.now() + minAdvanceNotice * 60 * 1000);
      if (schedule.publishAt < minDate) {
        errors.push(`Schedule must be at least ${minAdvanceNotice} minutes in advance`);
      }
    }

    if (maxFutureSchedule && schedule.publishAt) {
      const maxDate = new Date(Date.now() + maxFutureSchedule * 24 * 60 * 60 * 1000);
      if (schedule.publishAt > maxDate) {
        errors.push(`Cannot schedule more than ${maxFutureSchedule} days in advance`);
      }
    }

    if (blackoutDates && schedule.publishAt) {
      const isBlackedOut = blackoutDates.some(
        blackout => blackout.toDateString() === schedule.publishAt!.toDateString()
      );
      if (isBlackedOut) {
        errors.push('Cannot schedule on this date (blackout period)');
      }
    }
  }

  if (schedule.unpublishAt && schedule.publishAt && schedule.unpublishAt <= schedule.publishAt) {
    errors.push('Unpublish date must be after publish date');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Utility: Calculate next recurrence date
 */
export function calculateNextRecurrence(
  baseDate: Date,
  recurrence: RecurrenceRule
): Date | null {
  const next = new Date(baseDate);

  switch (recurrence.frequency) {
    case RecurrenceFrequency.DAILY:
      next.setDate(next.getDate() + recurrence.interval);
      break;
    case RecurrenceFrequency.WEEKLY:
      next.setDate(next.getDate() + (7 * recurrence.interval));
      break;
    case RecurrenceFrequency.MONTHLY:
      next.setMonth(next.getMonth() + recurrence.interval);
      break;
    case RecurrenceFrequency.YEARLY:
      next.setFullYear(next.getFullYear() + recurrence.interval);
      break;
    default:
      return null;
  }

  if (recurrence.until && next > recurrence.until) {
    return null;
  }

  return next;
}

/**
 * Default export with all hooks and components
 */
export default {
  // Core hooks
  usePublish,
  useUnpublish,
  useSchedulePublish,

  // Calendar & Timeline
  usePublishingCalendar,
  useContentSchedule,
  useTimelineView,

  // Management
  useScheduleManager,
  useCalendarView,

  // Modes
  usePublishNow,
  usePublishLater,
  usePublishRecurring,

  // Lifecycle
  useEmbargoContent,
  useUnpublishAt,
  useExpireContent,

  // Preview & Edit
  usePreviewScheduled,
  useViewScheduled,
  useEditScheduled,

  // Timezone
  useTimezoneHandling,
  useDateTimeSelector,

  // Rules & Policies
  usePublishingRules,
  usePublishingPolicies,

  // Multi-channel
  useMultiChannelPublish,
  useCrossPlatformPublish,

  // Queue & Status
  usePublishingQueue,
  usePublishingStatus,

  // Notifications
  usePublishingNotifications,
  usePublishingAlerts,

  // Modifications
  useRescheduleContent,
  useCancelSchedule,

  // Components
  PublishNow,
  PublishLater,
  ScheduleManager,
  CalendarView,
  TimelineView,

  // Utilities
  formatPublishDate,
  validateSchedule,
  calculateNextRecurrence,
};
