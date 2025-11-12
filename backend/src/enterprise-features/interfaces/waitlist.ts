import { WaitlistPriority, WaitlistStatus } from './enums';

export interface WaitlistEntry {
  id: string;
  studentId: string;
  appointmentType: string;
  priority: WaitlistPriority;
  addedAt: Date;
  status: WaitlistStatus;
  notes?: string;
}

export interface WaitlistPriorityResult {
  high: WaitlistEntry[];
  routine: WaitlistEntry[];
  totalCount: number;
}