import { RecurrenceFrequency } from './enums';

export interface RecurringTemplate {
  id: string;
  name: string;
  appointmentType: string;
  recurrenceRule: {
    frequency: RecurrenceFrequency;
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
  };
  duration: number; // minutes
  participants: string[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}