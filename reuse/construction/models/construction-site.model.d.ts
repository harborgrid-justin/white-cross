import { Model } from 'sequelize-typescript';
import { SiteStatus } from '../types/site.types';
export declare class ConstructionSite extends Model {
    id: string;
    projectId: string;
    siteName: string;
    siteAddress: string;
    siteManager: string;
    siteManagerContact: string;
    startDate: Date;
    estimatedEndDate: Date;
    actualEndDate?: Date;
    status: SiteStatus;
    accessRestrictions?: string;
    parkingInstructions?: string;
    securityRequirements?: string;
    emergencyPhone: string;
    nearestHospital?: string;
    permitNumber?: string;
    insurancePolicy?: string;
    latitude?: number;
    longitude?: number;
    totalArea?: number;
    fenceInstalled: boolean;
    signsInstalled: boolean;
    utilitiesMarked: boolean;
    metadata: Record<string, any>;
}
//# sourceMappingURL=construction-site.model.d.ts.map