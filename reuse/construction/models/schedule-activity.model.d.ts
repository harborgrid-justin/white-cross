import { Model } from 'sequelize-typescript';
import { DurationType, ActivityStatus, ConstraintType } from '../types/schedule.types';
export declare class ScheduleActivity extends Model {
    id: string;
    projectId: string;
    activityId: string;
    activityCode: string;
    activityName: string;
    description: string;
    discipline: string;
    phase: string;
    workPackageId?: string;
    duration: number;
    durationType: DurationType;
    plannedStartDate: Date;
    plannedFinishDate: Date;
    actualStartDate?: Date;
    actualFinishDate?: Date;
    forecastStartDate?: Date;
    forecastFinishDate?: Date;
    earlyStartDate?: Date;
    earlyFinishDate?: Date;
    lateStartDate?: Date;
    lateFinishDate?: Date;
    totalFloat: number;
    freeFloat: number;
    status: ActivityStatus;
    percentComplete: number;
    constraintType?: ConstraintType;
    constraintDate?: Date;
    isCritical: boolean;
    isMilestone: boolean;
    baselineStartDate?: Date;
    baselineFinishDate?: Date;
    baselineDuration?: number;
    metadata: Record<string, any>;
}
//# sourceMappingURL=schedule-activity.model.d.ts.map