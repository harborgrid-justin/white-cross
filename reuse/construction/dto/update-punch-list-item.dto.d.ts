import { PunchListItemStatus } from '../types/closeout.types';
export declare class UpdatePunchListItemDto {
    status?: PunchListItemStatus;
    assignedToId?: string;
    assignedToName?: string;
    dueDate?: Date;
    actualHours?: number;
    actualCost?: number;
    resolutionNotes?: string;
    rejectionReason?: string;
    requiresReinspection?: boolean;
    photoUrls?: string[];
    attachmentUrls?: string[];
    metadata?: Record<string, any>;
}
//# sourceMappingURL=update-punch-list-item.dto.d.ts.map