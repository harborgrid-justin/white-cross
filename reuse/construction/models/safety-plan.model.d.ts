import { Model } from 'sequelize-typescript';
import { SafetyPlanStatus } from '../types/safety.types';
export declare class SafetyPlan extends Model {
    id: number;
    projectId: number;
    projectName: string;
    planNumber: string;
    title: string;
    description: string;
    scope: string;
    applicableRegulations: string[];
    safetyObjectives: string[];
    emergencyContacts: Record<string, any>[];
    evacuationProcedures: string;
    ppeRequirements: string[];
    hazardMitigationStrategies: string[];
    trainingRequirements: string[];
    inspectionSchedule: string;
    safetyOfficer: string;
    competentPersons: string[];
    status: SafetyPlanStatus;
    approvedBy?: string;
    approvedAt?: Date;
    effectiveDate: Date;
    reviewDate: Date;
    version: number;
    metadata: Record<string, any>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=safety-plan.model.d.ts.map