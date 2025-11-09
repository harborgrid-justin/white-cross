import { Model } from 'sequelize-typescript';
import { AmendmentStatus } from '../types/contract.types';
import { ConstructionContract } from './construction-contract.model';
export declare class ContractAmendment extends Model<ContractAmendment> {
    id: string;
    contractId: string;
    amendmentNumber: number;
    title: string;
    description: string;
    status: AmendmentStatus;
    changeType: 'scope' | 'time' | 'cost' | 'terms' | 'multiple';
    costImpact: number;
    timeImpact: number;
    newCompletionDate?: Date;
    newContractAmount?: number;
    justification: string;
    requestedBy: string;
    requestedDate: Date;
    reviewedBy?: string;
    reviewedDate?: Date;
    approvedBy?: string;
    approvedDate?: Date;
    executedDate?: Date;
    effectiveDate?: Date;
    attachments?: string[];
    contract: ConstructionContract;
}
//# sourceMappingURL=contract-amendment.model.d.ts.map