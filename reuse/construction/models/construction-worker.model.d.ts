import { Model } from 'sequelize-typescript';
import { LaborCraft, UnionStatus } from '../types/labor.types';
export declare class ConstructionWorker extends Model {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    primaryCraft: LaborCraft;
    secondaryCrafts: LaborCraft[];
    unionStatus: UnionStatus;
    unionLocal: string;
    unionCardNumber: string;
    isApprentice: boolean;
    apprenticeshipYear: number;
    certifications: Array<any>;
    safetyTraining: Array<any>;
    baseHourlyRate: number;
    emergencyContact: string;
    emergencyPhone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=construction-worker.model.d.ts.map