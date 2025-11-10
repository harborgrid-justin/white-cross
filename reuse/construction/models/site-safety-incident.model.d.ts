import { Model } from 'sequelize-typescript';
import { IncidentType, IncidentSeverity, InvestigationStatus } from '../types/site.types';
export declare class SiteSafetyIncident extends Model {
    id: string;
    siteId: string;
    incidentDate: Date;
    incidentTime: string;
    incidentType: IncidentType;
    severity: IncidentSeverity;
    location: string;
    description: string;
    personnelInvolved: string[];
    witnessIds: string[];
    immediateAction: string;
    reportedBy: string;
    reportedAt: Date;
    investigationStatus: InvestigationStatus;
    investigator?: string;
    investigationStartDate?: Date;
    investigationCompletedDate?: Date;
    rootCause?: string;
    contributingFactors: string[];
    correctiveActions?: string;
    preventiveActions?: string;
    oshaRecordable: boolean;
    oshaReportNumber?: string;
    lostTimeDays: number;
    medicalTreatmentRequired: boolean;
    costEstimate?: number;
    photoUrls: string[];
    documentUrls: string[];
    closedAt?: Date;
    closedBy?: string;
    metadata: Record<string, any>;
}
//# sourceMappingURL=site-safety-incident.model.d.ts.map