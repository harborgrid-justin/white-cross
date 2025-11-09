import { Model } from 'sequelize-typescript';
import { ConstructionProjectStatus, ProjectPhase, ProjectPriority, DeliveryMethod } from '../types/project.types';
import { ProjectBaseline } from './project-baseline.model';
import { ChangeOrder } from './change-order.model';
export declare class ConstructionProject extends Model<ConstructionProject> {
    id: string;
    projectNumber: string;
    projectName: string;
    description: string;
    status: ConstructionProjectStatus;
    currentPhase: ProjectPhase;
    priority: ProjectPriority;
    deliveryMethod: DeliveryMethod;
    projectManagerId: string;
    sponsorId?: string;
    contractorId?: string;
    totalBudget: number;
    committedCost: number;
    actualCost: number;
    forecastedCost: number;
    contingencyReserve: number;
    managementReserve: number;
    baselineEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    progressPercentage: number;
    earnedValue: number;
    plannedValue: number;
    metadata?: Record<string, any>;
    createdBy: string;
    updatedBy: string;
    baselines: ProjectBaseline[];
    changeOrders: ChangeOrder[];
}
//# sourceMappingURL=project.model.d.ts.map