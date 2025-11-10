import { Model } from 'sequelize-typescript';
import { ResourceType } from '../types/schedule.types';
export declare class ResourceAssignment extends Model {
    id: string;
    projectId: string;
    activityId: string;
    resourceId: string;
    resourceName: string;
    resourceType: ResourceType;
    unitsRequired: number;
    unitsAvailable: number;
    utilizationPercent: number;
    costPerUnit: number;
    totalCost: number;
    assignmentDate: Date;
    startDate: Date;
    endDate: Date;
    isOverallocated: boolean;
    metadata: Record<string, any>;
}
//# sourceMappingURL=resource-assignment.model.d.ts.map