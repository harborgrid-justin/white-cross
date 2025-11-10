import { Model } from 'sequelize-typescript';
import { DistributionStatus } from '../types/document.types';
import { ConstructionDocument } from './construction-document.model';
export declare class DocumentDistribution extends Model {
    id: string;
    documentId: string;
    recipientId: string;
    recipientName: string;
    recipientEmail: string;
    recipientOrganization: string;
    status: DistributionStatus;
    sentAt: Date;
    deliveredAt: Date;
    acknowledgedAt: Date;
    deliveryMethod: string;
    notes: string;
    distributedBy: string;
    requiresSignature: boolean;
    signatureUrl: string;
    document: ConstructionDocument;
}
//# sourceMappingURL=document-distribution.model.d.ts.map