import {
  Reminder,
  ReminderStatus,
  ReminderType,
  ReminderFrequency,
  ReminderFilters,
  ReminderStats,
  ReminderInstance,
  RecurrencePattern,
  CreateReminderInput,
  UpdateReminderInput,
  CreateReminderSchema,
  UpdateReminderSchema,
} from '../types/reminder';

/**
 * ReminderService
 *
 * Manages reminder scheduling, recurrence, and lifecycle
 */
export class ReminderService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1/reminders') {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new reminder
   */
  async create(input: CreateReminderInput): Promise<Reminder> {
    // Validate input
    const validated = CreateReminderSchema.parse(input);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      throw new Error(`Failed to create reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get reminders for a user with optional filters
   */
  async getReminders(
    userId: string,
    filters?: ReminderFilters
  ): Promise<Reminder[]> {
    const params = new URLSearchParams();
    params.append('userId', userId);

    if (filters) {
      if (filters.types?.length) {
        params.append('types', filters.types.join(','));
      }
      if (filters.statuses?.length) {
        params.append('statuses', filters.statuses.join(','));
      }
      if (filters.priorities?.length) {
        params.append('priorities', filters.priorities.join(','));
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate.toISOString());
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch reminders: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single reminder by ID
   */
  async getById(id: string): Promise<Reminder> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update a reminder
   */
  async update(id: string, input: UpdateReminderInput): Promise<Reminder> {
    // Validate input
    const validated = UpdateReminderSchema.parse(input);

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      throw new Error(`Failed to update reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete a reminder
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete reminder: ${response.statusText}`);
    }
  }

  /**
   * Pause a reminder
   */
  async pause(id: string): Promise<Reminder> {
    const response = await fetch(`${this.baseUrl}/${id}/pause`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to pause reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Resume a paused reminder
   */
  async resume(id: string): Promise<Reminder> {
    const response = await fetch(`${this.baseUrl}/${id}/resume`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to resume reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Complete a reminder
   */
  async complete(id: string): Promise<Reminder> {
    const response = await fetch(`${this.baseUrl}/${id}/complete`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to complete reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Snooze a reminder
   */
  async snooze(id: string, snoozedUntil: Date): Promise<Reminder> {
    const response = await fetch(`${this.baseUrl}/${id}/snooze`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ snoozedUntil }),
    });

    if (!response.ok) {
      throw new Error(`Failed to snooze reminder: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get upcoming reminders
   */
  async getUpcoming(userId: string, hours: number = 24): Promise<Reminder[]> {
    const response = await fetch(
      `${this.baseUrl}/upcoming?userId=${userId}&hours=${hours}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch upcoming reminders: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get overdue reminders
   */
  async getOverdue(userId: string): Promise<Reminder[]> {
    const response = await fetch(`${this.baseUrl}/overdue?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch overdue reminders: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get reminder statistics
   */
  async getStats(userId: string): Promise<ReminderStats> {
    const response = await fetch(`${this.baseUrl}/stats?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch reminder stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get reminder instances (for recurring reminders)
   */
  async getInstances(
    reminderId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ReminderInstance[]> {
    const params = new URLSearchParams();
    if (startDate) {
      params.append('startDate', startDate.toISOString());
    }
    if (endDate) {
      params.append('endDate', endDate.toISOString());
    }

    const response = await fetch(
      `${this.baseUrl}/${reminderId}/instances?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reminder instances: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Calculate next occurrence for recurring reminder
   */
  calculateNextOccurrence(
    lastOccurrence: Date,
    recurrence: RecurrencePattern
  ): Date | null {
    const next = new Date(lastOccurrence);

    switch (recurrence.frequency) {
      case ReminderFrequency.DAILY:
        next.setDate(next.getDate() + recurrence.interval);
        break;

      case ReminderFrequency.WEEKLY:
        next.setDate(next.getDate() + recurrence.interval * 7);
        // Adjust to specific days of week if specified
        if (recurrence.daysOfWeek?.length) {
          const currentDay = next.getDay();
          const targetDays = recurrence.daysOfWeek.sort();
          let daysToAdd = 0;

          for (const day of targetDays) {
            if (day > currentDay) {
              daysToAdd = day - currentDay;
              break;
            }
          }

          if (daysToAdd === 0) {
            daysToAdd = 7 - currentDay + targetDays[0];
          }

          next.setDate(next.getDate() + daysToAdd);
        }
        break;

      case ReminderFrequency.MONTHLY:
        next.setMonth(next.getMonth() + recurrence.interval);
        // Set to specific day of month if specified
        if (recurrence.dayOfMonth) {
          next.setDate(recurrence.dayOfMonth);
        }
        break;

      case ReminderFrequency.ONCE:
        return null; // No next occurrence for one-time reminders

      default:
        return null;
    }

    // Check if we've exceeded the end date or max occurrences
    if (recurrence.endDate && next > recurrence.endDate) {
      return null;
    }

    return next;
  }

  /**
   * Validate recurrence pattern
   */
  validateRecurrence(recurrence: RecurrencePattern): boolean {
    if (recurrence.interval < 1) {
      return false;
    }

    if (
      recurrence.frequency === ReminderFrequency.WEEKLY &&
      (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0)
    ) {
      return false;
    }

    if (
      recurrence.frequency === ReminderFrequency.MONTHLY &&
      (!recurrence.dayOfMonth || recurrence.dayOfMonth < 1 || recurrence.dayOfMonth > 31)
    ) {
      return false;
    }

    if (recurrence.endDate && recurrence.occurrences) {
      // Can't have both end date and max occurrences
      return false;
    }

    return true;
  }

  /**
   * Generate reminder instances for a date range
   */
  generateInstances(
    reminder: Reminder,
    startDate: Date,
    endDate: Date
  ): ReminderInstance[] {
    if (!reminder.recurrence || reminder.recurrence.frequency === ReminderFrequency.ONCE) {
      // Single instance
      if (reminder.scheduledAt >= startDate && reminder.scheduledAt <= endDate) {
        return [
          {
            id: `${reminder.id}-0`,
            reminderId: reminder.id,
            reminder,
            scheduledAt: reminder.scheduledAt,
          },
        ];
      }
      return [];
    }

    const instances: ReminderInstance[] = [];
    let currentDate = new Date(reminder.scheduledAt);
    let instanceCount = 0;

    while (currentDate <= endDate) {
      if (currentDate >= startDate) {
        instances.push({
          id: `${reminder.id}-${instanceCount}`,
          reminderId: reminder.id,
          reminder,
          scheduledAt: new Date(currentDate),
        });
      }

      const next = this.calculateNextOccurrence(currentDate, reminder.recurrence);
      if (!next) {
        break;
      }

      currentDate = next;
      instanceCount++;

      // Safety limit
      if (instanceCount >= 1000) {
        break;
      }

      // Check max occurrences
      if (
        reminder.recurrence.occurrences &&
        instanceCount >= reminder.recurrence.occurrences
      ) {
        break;
      }
    }

    return instances;
  }
}

// Singleton instance
export const reminderService = new ReminderService();
