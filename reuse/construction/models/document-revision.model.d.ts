import { Model } from 'sequelize-typescript';
import { RevisionType } from '../types/document.types';
import { ConstructionDocument } from './construction-document.model';
export declare class DocumentRevision extends Model {
    id: string;
    documentId: string;
    revisionNumber: string;
    revisionType: RevisionType;
    description: string;
    fileUrl: string;
    createdBy: string;
    revisionDate: Date;
    changes: Array<{
        section: string;
        description: string;
        reason: string;
    }>;
    superseded: boolean;
    supersededDate: Date;
    document: ConstructionDocument;
}
//# sourceMappingURL=document-revision.model.d.ts.map