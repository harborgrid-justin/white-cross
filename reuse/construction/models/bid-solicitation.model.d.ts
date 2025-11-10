import { Model } from 'sequelize-typescript';
import { BidSolicitationStatus, ProcurementMethod, AwardMethod } from '../types/bid.types';
import { BidSubmission } from './bid-submission.model';
export declare class BidSolicitation extends Model<BidSolicitation> {
    id: string;
    solicitationNumber: string;
    projectId: string;
    title: string;
    description: string;
    procurementMethod: ProcurementMethod;
    awardMethod: AwardMethod;
    estimatedValue: number;
    publishedDate?: Date;
    openingDate: Date;
    closingDate: Date;
    prebidMeetingDate?: Date;
    prebidMeetingLocation?: string;
    status: BidSolicitationStatus;
    bondRequirement: boolean;
    bondPercentage?: number;
    insuranceRequirements: string[];
    evaluationCriteria: any[];
    smallBusinessGoals?: number;
    dbeGoals?: number;
    documents: any[];
    addenda: any[];
    metadata: Record<string, any>;
    createdBy: string;
    updatedBy?: string;
    submissions: BidSubmission[];
}
//# sourceMappingURL=bid-solicitation.model.d.ts.map