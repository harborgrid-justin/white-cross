import { Model } from 'sequelize-typescript';
import { PaymentStatus } from '../types/contract.types';
import { ConstructionContract } from './construction-contract.model';
export declare class PaymentApplication extends Model<PaymentApplication> {
    id: string;
    contractId: string;
    applicationNumber: number;
    periodStartDate: Date;
    periodEndDate: Date;
    status: PaymentStatus;
    scheduledValue: number;
    workCompleted: number;
    storedMaterials: number;
    totalCompleted: number;
    previouslyPaid: number;
    currentPaymentDue: number;
    retainageWithheld: number;
    netPayment: number;
    percentComplete: number;
    submittedDate: Date;
    reviewedDate?: Date;
    approvedDate?: Date;
    paidDate?: Date;
    reviewedBy?: string;
    approvedBy?: string;
    notes?: string;
    attachments?: string[];
    createdBy: string;
    contract: ConstructionContract;
}
//# sourceMappingURL=payment-application.model.d.ts.map