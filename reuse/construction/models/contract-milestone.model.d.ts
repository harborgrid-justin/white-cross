import { Model } from 'sequelize-typescript';
import { MilestoneStatus } from '../types/contract.types';
import { ConstructionContract } from './construction-contract.model';
export declare class ContractMilestone extends Model<ContractMilestone> {
    id: string;
    contractId: string;
    name: string;
    description: string;
    status: MilestoneStatus;
    scheduledDate: Date;
    actualDate?: Date;
    paymentPercentage: number;
    paymentAmount: number;
    isPaid: boolean;
    deliverables: string[];
    acceptanceCriteria: string[];
    verifiedBy?: string;
    verifiedDate?: Date;
    notes?: string;
    contract: ConstructionContract;
}
//# sourceMappingURL=contract-milestone.model.d.ts.map