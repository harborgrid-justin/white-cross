import { DocumentStatus } from '../types/closeout.types';
export declare class UpdateCloseoutDocumentDto {
    status?: DocumentStatus;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    version?: string;
    reviewComments?: string;
    rejectionReason?: string;
    expirationDate?: Date;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=update-closeout-document.dto.d.ts.map