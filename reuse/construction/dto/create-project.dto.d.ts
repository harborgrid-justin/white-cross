import { ProjectPriority, DeliveryMethod } from '../types/project.types';
export declare class CreateConstructionProjectDto {
    projectName: string;
    description: string;
    priority: ProjectPriority;
    deliveryMethod: DeliveryMethod;
    projectManagerId: string;
    totalBudget: number;
    baselineEndDate: Date;
    districtCode?: string;
}
//# sourceMappingURL=create-project.dto.d.ts.map