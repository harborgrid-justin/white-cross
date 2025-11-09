import { Model } from 'sequelize-typescript';
import { QualityPlanStatus } from '../types/quality.types';
export declare class QualityPlan extends Model {
    id: number;
    projectId: number;
    projectName: string;
    planNumber: string;
    title: string;
    description: string;
    scope: string;
    applicableStandards: string[];
    qualityObjectives: string[];
    acceptanceCriteria: Record<string, any>;
    inspectionFrequency: string;
    testingRequirements: string[];
    documentationRequirements: string[];
    responsiblePerson: string;
    contactInfo: string;
    status: QualityPlanStatus;
    approvedBy?: string;
    approvedAt?: Date;
    effectiveDate: Date;
    expirationDate?: Date;
    version: number;
    metadata: Record<string, any>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=quality-plan.model.d.ts.map