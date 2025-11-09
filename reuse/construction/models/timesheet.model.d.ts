import { Model } from 'sequelize-typescript';
import { TimesheetStatus, LaborCraft } from '../types/labor.types';
export declare class Timesheet extends Model {
    id: string;
    workerId: string;
    projectId: string;
    weekEnding: Date;
    status: TimesheetStatus;
    regularHours: number;
    overtimeHours: number;
    doubleTimeHours: number;
    totalWages: number;
    craft: LaborCraft;
    hourlyRate: number;
    prevailingWageRate: number;
    isPrevailingWage: boolean;
    approvedBy: string;
    approvedAt: Date;
    rejectionReason: string;
    dailyEntries: Array<any>;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=timesheet.model.d.ts.map