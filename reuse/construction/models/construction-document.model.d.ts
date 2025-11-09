import { Model } from 'sequelize-typescript';
import { DocumentType, DocumentDiscipline, DocumentStatus, RetentionPeriod } from '../types/document.types';
import { DocumentRevision } from './document-revision.model';
import { DocumentDistribution } from './document-distribution.model';
export declare class ConstructionDocument extends Model {
    id: string;
    documentNumber: string;
    title: string;
    documentType: DocumentType;
    discipline: DocumentDiscipline;
    status: DocumentStatus;
    projectId: string;
    revision: string;
    description: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    parentDocumentId: string;
    createdBy: string;
    approvedBy: string;
    approvedAt: Date;
    issuedDate: Date;
    effectiveDate: Date;
    expirationDate: Date;
    tags: string[];
    metadata: Record<string, any>;
    isLatestRevision: boolean;
    requiresAcknowledgment: boolean;
    retentionPeriod: RetentionPeriod;
    revisions: DocumentRevision[];
    distributions: DocumentDistribution[];
}
//# sourceMappingURL=construction-document.model.d.ts.map