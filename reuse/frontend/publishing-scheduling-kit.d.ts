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
import type { ReactNode } from 'react';
/**
 * Publishing status enumeration
 */
export declare enum PublishingStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    PUBLISHING = "publishing",
    PUBLISHED = "published",
    UNPUBLISHED = "unpublished",
    FAILED = "failed",
    EMBARGOED = "embargoed",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
/**
 * Publishing channel types
 */
export declare enum PublishingChannel {
    WEB = "web",
    MOBILE = "mobile",
    EMAIL = "email",
    RSS = "rss",
    SOCIAL_MEDIA = "social_media",
    API = "api",
    PRINT = "print"
}
/**
 * Recurrence frequency
 */
export declare enum RecurrenceFrequency {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    CUSTOM = "custom"
}
/**
 * Publishing priority levels
 */
export declare enum PublishingPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
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
        minAdvanceNotice?: number;
        maxFutureSchedule?: number;
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
export declare function usePublish(options?: PublishOptions): {
    publish: any;
    isPublishing: any;
    error: any;
    publication: any;
};
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
export declare function useUnpublish(): {
    unpublish: any;
    isUnpublishing: any;
    error: any;
};
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
export declare function useSchedulePublish(options?: ScheduleOptions): {
    schedulePublish: any;
    isScheduling: any;
    error: any;
    schedule: any;
};
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
export declare function usePublishingCalendar(params?: {
    startDate?: Date;
    endDate?: Date;
    channels?: PublishingChannel[];
}): {
    events: any;
    isLoading: any;
    error: any;
    refetch: any;
};
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
export declare function useContentSchedule(contentId: string): {
    schedules: any;
    isLoading: any;
    error: any;
    refetch: any;
    updateSchedule: any;
};
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
export declare function useTimelineView(initialGroupBy?: 'hour' | 'day' | 'week' | 'month'): {
    timeline: any;
    groupBy: any;
    setGroupBy: any;
};
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
export declare function useScheduleManager(): {
    schedules: any;
    isLoading: any;
    error: any;
    createSchedule: any;
    updateSchedule: any;
    deleteSchedule: any;
    refetch: any;
};
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
export declare function useCalendarView(initialView?: 'month' | 'week' | 'day'): {
    view: any;
    setView: any;
    currentDate: any;
    navigateToDate: any;
    navigateNext: any;
    navigatePrevious: any;
    navigateToToday: any;
};
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
export declare function usePublishNow(options?: PublishOptions): {
    publishNow: any;
    isPublishing: any;
    error: any;
    publication: any;
};
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
export declare function usePublishLater(options?: ScheduleOptions): {
    publishLater: any;
    isScheduling: any;
    error: any;
    schedule: any;
};
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
export declare function usePublishRecurring(options?: ScheduleOptions): {
    createRecurring: any;
    cancelRecurring: any;
    recurringSchedules: any;
    isCreating: any;
    error: any;
};
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
export declare function useEmbargoContent(contentId: string): {
    embargos: any;
    isLoading: any;
    error: any;
    createEmbargo: any;
    removeEmbargo: any;
    updateEmbargo: any;
    refetch: any;
};
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
export declare function useUnpublishAt(): {
    scheduleUnpublish: any;
    cancelUnpublish: any;
    isScheduling: any;
    error: any;
};
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
export declare function useExpireContent(): {
    setExpiration: any;
    removeExpiration: any;
    isUpdating: any;
    error: any;
};
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
export declare function usePreviewScheduled(scheduleId: string): {
    preview: any;
    isLoading: any;
    error: any;
    generatePreview: any;
};
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
export declare function useViewScheduled(scheduleId: string): {
    schedule: any;
    isLoading: any;
    error: any;
    refetch: any;
};
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
export declare function useEditScheduled(scheduleId: string): {
    schedule: any;
    isLoading: any;
    isUpdating: any;
    error: any;
    updateSchedule: any;
    refetch: any;
};
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
export declare function useTimezoneHandling(initialTimezone?: TimeZone): {
    currentTimezone: any;
    availableTimezones: any;
    setTimezone: any;
    convertToTimezone: any;
    formatInTimezone: any;
};
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
export declare function useDateTimeSelector(options?: {
    minDate?: Date;
    maxDate?: Date;
    timezone?: TimeZone;
    excludeDates?: Date[];
}): {
    selectedDate: any;
    setDate: any;
    resetDate: any;
    isValid: any;
    validationError: any;
    timezone: any;
};
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
export declare function usePublishingRules(): {
    rules: any;
    isLoading: any;
    error: any;
    createRule: any;
    updateRule: any;
    deleteRule: any;
    evaluateRules: any;
    refetch: any;
};
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
export declare function usePublishingPolicies(): {
    policies: any;
    isLoading: any;
    error: any;
    createPolicy: any;
    validateAgainstPolicy: any;
    refetch: any;
};
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
export declare function useMultiChannelPublish(): {
    publishToChannels: any;
    isPublishing: any;
    progress: any;
    results: any;
    error: any;
};
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
export declare function useCrossPlatformPublish(): {
    publishCrossPlatform: any;
    platforms: any;
    platformConfigs: any;
    isPublishing: any;
    progress: any;
    results: any;
};
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
export declare function usePublishingQueue(): {
    queue: any;
    isLoading: any;
    error: any;
    addToQueue: any;
    removeFromQueue: any;
    reorderQueue: any;
    retryFailed: any;
    refetch: any;
};
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
export declare function usePublishingStatus(contentId: string): {
    status: any;
    statusHistory: any;
    isMonitoring: any;
    startMonitoring: any;
    stopMonitoring: any;
    refetch: any;
};
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
export declare function usePublishingNotifications(): {
    notifications: any;
    unreadCount: any;
    isLoading: any;
    error: any;
    markAsRead: any;
    markAllAsRead: any;
    clearAll: any;
    addNotification: any;
    refetch: any;
};
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
export declare function usePublishingAlerts(): {
    alerts: any;
    allAlerts: any;
    criticalAlerts: any;
    hasActiveAlerts: any;
    addAlert: any;
    dismissAlert: any;
    clearDismissed: any;
};
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
export declare function useRescheduleContent(): {
    reschedule: any;
    bulkReschedule: any;
    isRescheduling: any;
    error: any;
};
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
export declare function useCancelSchedule(): {
    cancelSchedule: any;
    bulkCancel: any;
    isCanceling: any;
    error: any;
};
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
export declare function PublishNow({ contentId, channels, onSuccess, onError, children, className, }: {
    contentId: string;
    channels?: PublishingChannel[];
    onSuccess?: (publication: Publication) => void;
    onError?: (error: Error) => void;
    children?: ReactNode;
    className?: string;
}): any;
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
export declare function PublishLater({ contentId, onScheduled, children, className, }: {
    contentId: string;
    onScheduled?: (schedule: PublishingSchedule) => void;
    children?: ReactNode;
    className?: string;
}): any;
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
export declare function ScheduleManager({ onScheduleClick, className, }: {
    onScheduleClick?: (schedule: PublishingSchedule) => void;
    className?: string;
}): any;
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
export declare function CalendarView({ onEventClick, className, }: {
    onEventClick?: (event: CalendarEvent) => void;
    className?: string;
}): any;
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
export declare function TimelineView({ groupBy, onItemClick, className, }: {
    groupBy?: 'hour' | 'day' | 'week' | 'month';
    onItemClick?: (schedule: PublishingSchedule) => void;
    className?: string;
}): boolean;
/**
 * Utility: Format publishing date with timezone
 */
export declare function formatPublishDate(date: Date, timezone: TimeZone, format?: 'short' | 'long' | 'relative'): string;
/**
 * Utility: Validate schedule against business rules
 */
export declare function validateSchedule(schedule: Partial<PublishingSchedule>, policy?: PublishingPolicy): {
    valid: boolean;
    errors: string[];
};
/**
 * Utility: Calculate next recurrence date
 */
export declare function calculateNextRecurrence(baseDate: Date, recurrence: RecurrenceRule): Date | null;
/**
 * Default export with all hooks and components
 */
declare const _default: {
    usePublish: typeof usePublish;
    useUnpublish: typeof useUnpublish;
    useSchedulePublish: typeof useSchedulePublish;
    usePublishingCalendar: typeof usePublishingCalendar;
    useContentSchedule: typeof useContentSchedule;
    useTimelineView: typeof useTimelineView;
    useScheduleManager: typeof useScheduleManager;
    useCalendarView: typeof useCalendarView;
    usePublishNow: typeof usePublishNow;
    usePublishLater: typeof usePublishLater;
    usePublishRecurring: typeof usePublishRecurring;
    useEmbargoContent: typeof useEmbargoContent;
    useUnpublishAt: typeof useUnpublishAt;
    useExpireContent: typeof useExpireContent;
    usePreviewScheduled: typeof usePreviewScheduled;
    useViewScheduled: typeof useViewScheduled;
    useEditScheduled: typeof useEditScheduled;
    useTimezoneHandling: typeof useTimezoneHandling;
    useDateTimeSelector: typeof useDateTimeSelector;
    usePublishingRules: typeof usePublishingRules;
    usePublishingPolicies: typeof usePublishingPolicies;
    useMultiChannelPublish: typeof useMultiChannelPublish;
    useCrossPlatformPublish: typeof useCrossPlatformPublish;
    usePublishingQueue: typeof usePublishingQueue;
    usePublishingStatus: typeof usePublishingStatus;
    usePublishingNotifications: typeof usePublishingNotifications;
    usePublishingAlerts: typeof usePublishingAlerts;
    useRescheduleContent: typeof useRescheduleContent;
    useCancelSchedule: typeof useCancelSchedule;
    PublishNow: typeof PublishNow;
    PublishLater: typeof PublishLater;
    ScheduleManager: typeof ScheduleManager;
    CalendarView: typeof CalendarView;
    TimelineView: typeof TimelineView;
    formatPublishDate: typeof formatPublishDate;
    validateSchedule: typeof validateSchedule;
    calculateNextRecurrence: typeof calculateNextRecurrence;
};
export default _default;
//# sourceMappingURL=publishing-scheduling-kit.d.ts.map