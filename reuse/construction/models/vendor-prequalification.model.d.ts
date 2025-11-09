import { Model } from 'sequelize-typescript';
import { VendorQualificationStatus } from '../types/bid.types';
export declare class VendorPrequalification extends Model<VendorPrequalification> {
    id: string;
    vendorId: string;
    vendorName: string;
    qualificationNumber: string;
    workCategories: string[];
    maxProjectValue: number;
    bondingCapacity: number;
    insuranceCoverage: number;
    pastProjectCount: number;
    pastProjectValue: number;
    safetyRating: number;
    qualityRating: number;
    performanceRating: number;
    financialStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    qualificationStatus: VendorQualificationStatus;
    qualifiedDate?: Date;
    expirationDate?: Date;
    certifications: string[];
    licenses: string[];
    metadata: Record<string, any>;
}
//# sourceMappingURL=vendor-prequalification.model.d.ts.map