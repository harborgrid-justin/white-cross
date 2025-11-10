import { Model } from 'sequelize-typescript';
import { BidStatus } from '../types/bid.types';
import { BidSolicitation } from './bid-solicitation.model';
export declare class BidSubmission extends Model<BidSubmission> {
    id: string;
    solicitationId: string;
    vendorId: string;
    vendorName: string;
    bidNumber: string;
    submittalDate: Date;
    bidAmount: number;
    bidBondAmount?: number;
    bidBondProvider?: string;
    technicalScore?: number;
    financialScore?: number;
    totalScore?: number;
    rank?: number;
    status: BidStatus;
    responsiveness: boolean;
    responsibility: boolean;
    scheduleProposed: number;
    alternatesProvided: boolean;
    valueEngineeringProposals: any[];
    clarifications: any[];
    evaluationNotes?: string;
    metadata: Record<string, any>;
    solicitation: BidSolicitation;
}
//# sourceMappingURL=bid-submission.model.d.ts.map