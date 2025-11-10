import { CloseoutDocumentType } from '../types/closeout.types';
export declare class CreateCloseoutDocumentDto {
    closeoutId: string;
    documentType: CloseoutDocumentType;
    title: string;
    description?: string;
    documentNumber?: string;
    required?: boolean;
    relatedEquipment?: string;
    relatedSystem?: string;
    manufacturer?: string;
    modelNumber?: string;
    trainingTopic?: string;
    trainingDuration?: number;
    tags?: string[];
    metadata?: Record<string, any>;
}
//# sourceMappingURL=create-closeout-document.dto.d.ts.map