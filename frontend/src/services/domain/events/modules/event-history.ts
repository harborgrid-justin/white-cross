/**
 * EventBus - History Management Module
 * 
 * Manages event history and audit trail including storage, retrieval, and
 * filtering of published events. Provides comprehensive audit capabilities
 * for compliance and debugging purposes.
 * 
 * @module services/domain/events/modules/event-history
 */

import type {
  DomainEventInterface,
  EventHistoryEntry,
  HistoryManagerInterface
} from './types';

/**
 * History Manager Implementation
 * 
 * Manages event history with efficient circular buffer storage, filtering
 * capabilities, and audit trail functionality. Optimized for minimal memory
 * footprint while maintaining comprehensive event tracking.
 */
export class HistoryManager implements HistoryManagerInterface {
  /** Circular buffer of event history entries */
  private history: EventHistoryEntry[] = [];

  /** Maximum number of entries to maintain */
  private maxSize: number;

  /** Current position in circular buffer */
  private currentIndex: number = 0;

  /** Whether buffer has wrapped around */
  private hasWrapped: boolean = false;

  /**
   * Create new history manager
   */
  constructor(maxSize: number = 1000) {
    this.maxSize = Math.max(1, maxSize); // Ensure at least 1 entry
  }

  /**
   * Add event entry to history
   */
  public addEntry(entry: EventHistoryEntry): void {
    // Add to circular buffer
    this.history[this.currentIndex] = entry;
    
    // Move to next position
    this.currentIndex = (this.currentIndex + 1) % this.maxSize;
    
    // Track if we've wrapped around
    if (this.currentIndex === 0) {
      this.hasWrapped = true;
    }
  }

  /**
   * Get all history entries in chronological order
   */
  public getHistory(): EventHistoryEntry[] {
    if (this.history.length === 0) {
      return [];
    }

    if (!this.hasWrapped) {
      // Haven't filled buffer yet, return from start to current
      return this.history.slice(0, this.currentIndex);
    }

    // Buffer is full, return in chronological order
    // Start from current position (oldest) and wrap around
    const older = this.history.slice(this.currentIndex);
    const newer = this.history.slice(0, this.currentIndex);
    
    return [...older, ...newer];
  }

  /**
   * Get history entries for specific event type
   */
  public getHistoryByType(eventType: string): EventHistoryEntry[] {
    return this.getHistory().filter(entry => entry.event.eventType === eventType);
  }

  /**
   * Clear all history entries
   */
  public clear(): void {
    this.history = [];
    this.currentIndex = 0;
    this.hasWrapped = false;
  }

  /**
   * Get current number of entries in history
   */
  public getSize(): number {
    return this.hasWrapped ? this.maxSize : this.currentIndex;
  }

  /**
   * Get maximum history size
   */
  public getMaxSize(): number {
    return this.maxSize;
  }

  /**
   * Update maximum history size
   */
  public setMaxSize(maxSize: number): void {
    const newMaxSize = Math.max(1, maxSize);
    
    if (newMaxSize === this.maxSize) {
      return; // No change needed
    }

    if (newMaxSize > this.maxSize) {
      // Expanding buffer - allocate new space
      this.expandBuffer(newMaxSize);
    } else {
      // Shrinking buffer - keep most recent entries
      this.shrinkBuffer(newMaxSize);
    }
    
    this.maxSize = newMaxSize;
  }

  /**
   * Expand history buffer to larger size
   */
  private expandBuffer(newMaxSize: number): void {
    // Get current entries in order
    const currentEntries = this.getHistory();
    
    // Create new buffer
    this.history = new Array(newMaxSize);
    
    // Copy existing entries to start of new buffer
    currentEntries.forEach((entry, index) => {
      this.history[index] = entry;
    });
    
    // Update pointers
    this.currentIndex = currentEntries.length;
    this.hasWrapped = false;
  }

  /**
   * Shrink history buffer to smaller size
   */
  private shrinkBuffer(newMaxSize: number): void {
    // Get most recent entries that fit in new size
    const allEntries = this.getHistory();
    const recentEntries = allEntries.slice(-newMaxSize);
    
    // Create new buffer
    this.history = new Array(newMaxSize);
    
    // Copy recent entries
    recentEntries.forEach((entry, index) => {
      this.history[index] = entry;
    });
    
    // Update pointers
    this.currentIndex = recentEntries.length;
    this.hasWrapped = this.currentIndex === newMaxSize;
  }

  /**
   * Get history entries within time range
   */
  public getHistoryByTimeRange(startTime: Date, endTime: Date): EventHistoryEntry[] {
    return this.getHistory().filter(entry => 
      entry.publishedAt >= startTime && entry.publishedAt <= endTime
    );
  }

  /**
   * Get recent history entries
   */
  public getRecentHistory(count: number): EventHistoryEntry[] {
    const allHistory = this.getHistory();
    return allHistory.slice(-Math.abs(count));
  }

  /**
   * Search history by event metadata
   */
  public searchByMetadata(key: string, value: unknown): EventHistoryEntry[] {
    return this.getHistory().filter(entry => 
      entry.event.metadata[key] === value
    );
  }

  /**
   * Get history statistics
   */
  public getHistoryStats(): HistoryStats {
    const history = this.getHistory();
    
    if (history.length === 0) {
      return {
        totalEntries: 0,
        oldestEntry: null,
        newestEntry: null,
        eventTypeDistribution: {},
        averageHandlerCount: 0,
        averageSuccessRate: 0,
        averageDuration: 0
      };
    }

    // Calculate statistics
    const eventTypeDistribution: Record<string, number> = {};
    let totalHandlers = 0;
    let totalSuccesses = 0;
    let totalDuration = 0;

    history.forEach(entry => {
      const eventType = entry.event.eventType;
      eventTypeDistribution[eventType] = (eventTypeDistribution[eventType] || 0) + 1;
      
      totalHandlers += entry.handlerCount;
      totalSuccesses += entry.successCount;
      totalDuration += entry.duration;
    });

    const averageHandlerCount = totalHandlers / history.length;
    const averageSuccessRate = totalHandlers > 0 ? (totalSuccesses / totalHandlers) * 100 : 0;
    const averageDuration = totalDuration / history.length;

    return {
      totalEntries: history.length,
      oldestEntry: history.length > 0 ? history[0].publishedAt : null,
      newestEntry: history.length > 0 ? history[history.length - 1].publishedAt : null,
      eventTypeDistribution,
      averageHandlerCount,
      averageSuccessRate,
      averageDuration
    };
  }
}

/**
 * History Statistics Interface
 */
export interface HistoryStats {
  /** Total number of entries in history */
  totalEntries: number;

  /** Timestamp of oldest entry */
  oldestEntry: Date | null;

  /** Timestamp of newest entry */
  newestEntry: Date | null;

  /** Distribution of events by type */
  eventTypeDistribution: Record<string, number>;

  /** Average number of handlers per event */
  averageHandlerCount: number;

  /** Average handler success rate as percentage */
  averageSuccessRate: number;

  /** Average event processing duration */
  averageDuration: number;
}

/**
 * History utility functions for analysis and reporting
 */
export class HistoryUtils {
  /**
   * Export history to JSON format
   */
  public static exportToJSON(history: EventHistoryEntry[]): string {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      totalEntries: history.length,
      entries: history.map(entry => ({
        eventId: entry.event.eventId,
        eventType: entry.event.eventType,
        timestamp: entry.event.timestamp.toISOString(),
        publishedAt: entry.publishedAt.toISOString(),
        handlerCount: entry.handlerCount,
        successCount: entry.successCount,
        failureCount: entry.failureCount,
        duration: entry.duration,
        metadata: entry.event.metadata
      }))
    }, null, 2);
  }

  /**
   * Export history to CSV format
   */
  public static exportToCSV(history: EventHistoryEntry[]): string {
    const headers = [
      'eventId',
      'eventType',
      'timestamp',
      'publishedAt',
      'handlerCount',
      'successCount',
      'failureCount',
      'duration'
    ];

    const rows = history.map(entry => [
      entry.event.eventId,
      entry.event.eventType,
      entry.event.timestamp.toISOString(),
      entry.publishedAt.toISOString(),
      entry.handlerCount.toString(),
      entry.successCount.toString(),
      entry.failureCount.toString(),
      entry.duration.toString()
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * Generate audit report from history
   */
  public static generateAuditReport(history: EventHistoryEntry[]): string {
    const stats = HistoryUtils.calculateHistoryStats(history);
    const lines: string[] = [];

    lines.push('=== Event History Audit Report ===');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Total Events: ${stats.totalEntries.toLocaleString()}`);

    if (stats.oldestEntry && stats.newestEntry) {
      const timeRange = stats.newestEntry.getTime() - stats.oldestEntry.getTime();
      const hours = (timeRange / (1000 * 60 * 60)).toFixed(1);
      lines.push(`Time Range: ${hours} hours`);
      lines.push(`Oldest Event: ${stats.oldestEntry.toISOString()}`);
      lines.push(`Newest Event: ${stats.newestEntry.toISOString()}`);
    }

    lines.push(`Average Handlers per Event: ${stats.averageHandlerCount.toFixed(1)}`);
    lines.push(`Average Success Rate: ${stats.averageSuccessRate.toFixed(1)}%`);
    lines.push(`Average Processing Time: ${stats.averageDuration.toFixed(0)}ms`);

    if (Object.keys(stats.eventTypeDistribution).length > 0) {
      lines.push('\n=== Event Type Distribution ===');
      const sortedTypes = Object.entries(stats.eventTypeDistribution)
        .sort(([, a], [, b]) => b - a);
        
      sortedTypes.forEach(([type, count]) => {
        const percentage = (count / stats.totalEntries * 100).toFixed(1);
        lines.push(`${type}: ${count.toLocaleString()} (${percentage}%)`);
      });
    }

    return lines.join('\n');
  }

  /**
   * Calculate statistics from history entries
   */
  public static calculateHistoryStats(history: EventHistoryEntry[]): HistoryStats {
    if (history.length === 0) {
      return {
        totalEntries: 0,
        oldestEntry: null,
        newestEntry: null,
        eventTypeDistribution: {},
        averageHandlerCount: 0,
        averageSuccessRate: 0,
        averageDuration: 0
      };
    }

    const eventTypeDistribution: Record<string, number> = {};
    let totalHandlers = 0;
    let totalSuccesses = 0;
    let totalDuration = 0;

    history.forEach(entry => {
      const eventType = entry.event.eventType;
      eventTypeDistribution[eventType] = (eventTypeDistribution[eventType] || 0) + 1;
      
      totalHandlers += entry.handlerCount;
      totalSuccesses += entry.successCount;
      totalDuration += entry.duration;
    });

    const averageHandlerCount = totalHandlers / history.length;
    const averageSuccessRate = totalHandlers > 0 ? (totalSuccesses / totalHandlers) * 100 : 0;
    const averageDuration = totalDuration / history.length;

    // Sort history by published time to find oldest/newest
    const sortedHistory = [...history].sort((a, b) => 
      a.publishedAt.getTime() - b.publishedAt.getTime()
    );

    return {
      totalEntries: history.length,
      oldestEntry: sortedHistory.length > 0 ? sortedHistory[0].publishedAt : null,
      newestEntry: sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].publishedAt : null,
      eventTypeDistribution,
      averageHandlerCount,
      averageSuccessRate,
      averageDuration
    };
  }

  /**
   * Find events with high failure rates
   */
  public static findProblematicEvents(
    history: EventHistoryEntry[], 
    failureThreshold: number = 0.1
  ): EventHistoryEntry[] {
    return history.filter(entry => {
      if (entry.handlerCount === 0) return false;
      const failureRate = entry.failureCount / entry.handlerCount;
      return failureRate >= failureThreshold;
    });
  }

  /**
   * Find slow events
   */
  public static findSlowEvents(
    history: EventHistoryEntry[], 
    durationThreshold: number = 1000
  ): EventHistoryEntry[] {
    return history.filter(entry => entry.duration >= durationThreshold);
  }

  /**
   * Group events by time window
   */
  public static groupByTimeWindow(
    history: EventHistoryEntry[],
    windowSizeMs: number = 60000 // 1 minute default
  ): Array<{ window: Date; events: EventHistoryEntry[] }> {
    const groups: Map<number, EventHistoryEntry[]> = new Map();

    history.forEach(entry => {
      const windowStart = Math.floor(entry.publishedAt.getTime() / windowSizeMs) * windowSizeMs;
      
      if (!groups.has(windowStart)) {
        groups.set(windowStart, []);
      }
      
      const group = groups.get(windowStart);
      if (group) {
        group.push(entry);
      }
    });

    return Array.from(groups.entries())
      .map(([windowStart, events]) => ({
        window: new Date(windowStart),
        events
      }))
      .sort((a, b) => a.window.getTime() - b.window.getTime());
  }
}

export { HistoryManager as default };
