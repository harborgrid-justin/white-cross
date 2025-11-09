import { Model } from 'sequelize-typescript';
export declare class DailySiteLog extends Model {
    id: string;
    siteId: string;
    logDate: Date;
    submittedBy: string;
    workPerformed: string;
    crewCount: number;
    equipmentUsed: string[];
    materialsDelivered: any[];
    inspections: any[];
    visitorLog: any[];
    delaysEncountered: any[];
    safetyObservations?: string;
    weatherConditions: any;
    weatherImpact: boolean;
    hoursWorked: number;
    overtimeHours: number;
    productivityRating?: number;
    notes?: string;
    photoUrls: string[];
    approvedBy?: string;
    approvedAt?: Date;
    submittedAt: Date;
}
//# sourceMappingURL=daily-site-log.model.d.ts.map