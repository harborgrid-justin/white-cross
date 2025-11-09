import { CloseoutStatus, InspectionResult, PaymentStatus } from '../types/closeout.types';
export declare class UpdateConstructionCloseoutDto {
    status?: CloseoutStatus;
    substantialCompletionDate?: Date;
    finalCompletionDate?: Date;
    certificateOfOccupancyDate?: Date;
    finalInspectionScheduled?: boolean;
    finalInspectionDate?: Date;
    finalInspectionResult?: InspectionResult;
    ownerTrainingRequired?: boolean;
    ownerTrainingCompleted?: boolean;
    ownerTrainingDate?: Date;
    finalPaymentStatus?: PaymentStatus;
    finalPaymentDate?: Date;
    lessonsLearnedCompleted?: boolean;
    notes?: string;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=update-construction-closeout.dto.d.ts.map