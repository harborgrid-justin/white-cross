import { PunchListItemCategory, PunchListItemPriority } from '../types/closeout.types';
export declare class CreatePunchListItemDto {
    closeoutId: string;
    itemNumber: string;
    title: string;
    description: string;
    location: string;
    category: PunchListItemCategory;
    priority: PunchListItemPriority;
    reportedById: string;
    reportedByName: string;
    contractorResponsible: string;
    assignedToId?: string;
    assignedToName?: string;
    dueDate?: Date;
    estimatedHours?: number;
    estimatedCost?: number;
    tags?: string[];
    metadata?: Record<string, any>;
}
//# sourceMappingURL=create-punch-list-item.dto.d.ts.map