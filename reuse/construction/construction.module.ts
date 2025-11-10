
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ConstructionProject } from './models/project.model';
import { ProjectBaseline } from './models/project-baseline.model';
import { ChangeOrder } from './models/change-order.model';
import { ProgressService } from './progress.service';
import { BidSolicitation } from './models/bid-solicitation.model';
import { BidSubmission } from './models/bid-submission.model';
import { VendorPrequalification } from './models/vendor-prequalification.model';
import { ChangeRequest } from './models/change-request.model';
import { ConstructionContract } from './models/construction-contract.model';
import { PaymentApplication } from './models/payment-application.model';
import { ContractAmendment } from './models/contract-amendment.model';
import { ContractMilestone } from './models/contract-milestone.model';
import { CostEstimate } from './models/cost-estimate.model';
import { CostTracking } from './models/cost-tracking.model';
import { CostChangeOrder } from './models/cost-change-order.model';
import { ConstructionDocument } from './models/construction-document.model';
import { DocumentRevision } from './models/document-revision.model';
import { DocumentDistribution } from './models/document-distribution.model';
import { ConstructionEquipment } from './models/construction-equipment.model';
import { EquipmentMaintenanceRecord } from './models/equipment-maintenance-record.model';
import { EquipmentAllocation } from './models/equipment-allocation.model';
import { ConstructionInspection } from './models/construction-inspection.model';
import { InspectionDeficiency } from './models/inspection-deficiency.model';
import { InspectionChecklistItem } from './models/inspection-checklist-item.model';
import { LaborPlan } from './models/labor-plan.model';
import { Timesheet } from './models/timesheet.model';
import { ConstructionWorker } from './models/construction-worker.model';
import { ConstructionMaterial } from './models/construction-material.model';
import { MaterialRequisition } from './models/material-requisition.model';
import { MaterialTransaction } from './models/material-transaction.model';
import { QualityPlan } from './models/quality-plan.model';
import { QualityInspection } from './models/quality-inspection.model';
import { QualityDeficiency } from './models/quality-deficiency.model';
import { SafetyPlan } from './models/safety-plan.model';
import { SafetyIncident } from './models/safety-incident.model';
import { SafetyInspection } from './models/safety-inspection.model';
import { ScheduleActivity } from './models/schedule-activity.model';
import { ActivityRelationship } from './models/activity-relationship.model';
import { ResourceAssignment } from './models/resource-assignment.model';
import { ConstructionSite } from './models/construction-site.model';
import { DailySiteLog } from './models/daily-site-log.model';
import { SiteSafetyIncident } from './models/site-safety-incident.model';
import { ConstructionSubmittal } from './models/construction-submittal.model';
import { SubmittalReview } from './models/submittal-review.model';
import { SubmittalWorkflow } from './models/submittal-workflow.model';
import { ConstructionWarranty } from './models/construction-warranty.model';
import { WarrantyClaim } from './models/warranty-claim.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ConstructionProject,
      ProjectBaseline,
      ChangeOrder,
      BidSolicitation,
      BidSubmission,
      VendorPrequalification,
      ChangeRequest,
      ConstructionContract,
      PaymentApplication,
      ContractAmendment,
      ContractMilestone,
      CostEstimate,
      CostTracking,
      CostChangeOrder,
      ConstructionDocument,
      DocumentRevision,
      DocumentDistribution,
      ConstructionEquipment,
      EquipmentMaintenanceRecord,
      EquipmentAllocation,
      ConstructionInspection,
      InspectionDeficiency,
      InspectionChecklistItem,
      LaborPlan,
      Timesheet,
      ConstructionWorker,
      ConstructionMaterial,
      MaterialRequisition,
      MaterialTransaction,
      QualityPlan,
      QualityInspection,
      QualityDeficiency,
      SafetyPlan,
      SafetyIncident,
      SafetyInspection,
      ScheduleActivity,
      ActivityRelationship,
      ResourceAssignment,
      ConstructionSite,
      DailySiteLog,
      SiteSafetyIncident,
      ConstructionSubmittal,
      SubmittalReview,
      SubmittalWorkflow,
      ConstructionWarranty,
      WarrantyClaim,
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProgressService],
  exports: [ProjectService, ProgressService, SequelizeModule],
})
export class ConstructionModule {}
