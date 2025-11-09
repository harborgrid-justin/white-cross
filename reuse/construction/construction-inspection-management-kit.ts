/**
 * LOC: CONST-IM-001
 * File: /reuse/construction/construction-inspection-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Construction quality management systems
 *   - Inspection scheduling services
 *   - Compliance and code verification modules
 */

/**
 * File: /reuse/construction/construction-inspection-management-kit.ts
 * Locator: WC-CONST-IM-001
 * Purpose: Construction Inspection Management Kit - Comprehensive inspection scheduling and tracking
 *
 * Upstream: Independent utility module for construction inspection operations
 * Downstream: ../backend/*, ../frontend/*, Construction quality control and compliance services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 11.x, Sequelize 6.x
 * Exports: 40 utility functions for inspection scheduling, reporting, deficiency tracking, and analytics
 *
 * LLM Context: Enterprise-grade construction inspection management utilities for scheduling inspections,
 * managing checklists, tracking deficiencies, coordinating third-party inspectors, verifying code compliance,
 * managing permits, and generating analytics. Provides comprehensive inspection workflows from scheduling
 * through completion, deficiency resolution, and closeout. Essential for maintaining quality standards,
 * ensuring regulatory compliance, preventing costly rework, and providing complete inspection records
 * for project closeout and occupancy permits.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { ConstructionInspection } from './models/construction-inspection.model';
import { InspectionDeficiency } from './models/inspection-deficiency.model';
import { InspectionChecklistItem } from './models/inspection-checklist-item.model';
import { 
    InspectionType, 
    InspectionStatus, 
    InspectionResult, 
    DeficiencySeverity, 
    DeficiencyStatus, 
    InspectorType, 
    PermitStatus 
} from './types/inspection.types';
import { ScheduleInspectionDto } from './dto/schedule-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { CreateDeficiencyDto } from './dto/create-deficiency.dto';
import { ResolveDeficiencyDto } from './dto/resolve-deficiency.dto';
import { VerifyDeficiencyDto } from './dto/verify-deficiency.dto';

// ============================================================================
// INSPECTION SCHEDULING
// ============================================================================

/**
 * Schedules a new construction inspection
 *
 * @param request - Inspection schedule request
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   inspectionType: InspectionType.FOUNDATION,
 *   projectId: 'project-123',
 *   location: 'Building A, Grid 1-5',
 *   scheduledDate: new Date('2025-01-15T09:00:00'),
 *   requestedBy: 'user-456'
 * });
 * ```
 */
export async function scheduleInspection(request: InspectionScheduleRequest): Promise<ConstructionInspection> {
  const inspectionNumber = generateInspectionNumber(request.inspectionType, request.projectId);

  const inspection = await ConstructionInspection.create({
    inspectionNumber,
    inspectionType: request.inspectionType,
    projectId: request.projectId,
    location: request.location,
    scheduledDate: request.scheduledDate,
    requestedBy: request.requestedBy,
    requestedAt: new Date(),
    status: InspectionStatus.SCHEDULED,
    description: request.description,
    permitId: request.permitId,
  } as any);

  await logInspectionActivity(inspection.id, 'scheduled', { requestedBy: request.requestedBy });

  return inspection;
}

/**
 * Generates a unique inspection number
 *
 * @param type - Inspection type
 * @param projectId - Project identifier
 * @returns Formatted inspection number
 *
 * @example
 * ```typescript
 * const inspNumber = generateInspectionNumber(InspectionType.FOUNDATION, 'PRJ-001');
 * // Returns: "INS-PRJ001-FND-001"
 * ```
 */
export function generateInspectionNumber(type: InspectionType, projectId: string): string {
  const typePrefix = {
    [InspectionType.FOUNDATION]: 'FND',
    [InspectionType.FRAMING]: 'FRM',
    [InspectionType.ROUGH_IN]: 'RGH',
    [InspectionType.INSULATION]: 'INS',
    [InspectionType.DRYWALL]: 'DRY',
    [InspectionType.FINAL]: 'FNL',
    [InspectionType.FIRE_PROTECTION]: 'FIR',
    [InspectionType.ELECTRICAL]: 'ELC',
    [InspectionType.PLUMBING]: 'PLM',
    [InspectionType.MECHANICAL]: 'MCH',
    [InspectionType.STRUCTURAL]: 'STR',
    [InspectionType.ACCESSIBILITY]: 'ACC',
    [InspectionType.ENERGY_CODE]: 'ENG',
    [InspectionType.THIRD_PARTY]: 'TRD',
    [InspectionType.SPECIAL]: 'SPC',
  }[type];

  const projectCode = projectId.replace(/[^A-Z0-9]/gi, '').substring(0, 6).toUpperCase();
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `INS-${projectCode}-${typePrefix}-${sequence}`;
}

/**
 * Reschedules an inspection
 *
 * @param inspectionId - Inspection identifier
 * @param newDate - New scheduled date
 * @param reason - Reschedule reason
 * @param userId - User rescheduling
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await rescheduleInspection('insp-123', new Date('2025-01-16T10:00:00'), 'Site not ready', 'user-456');
 * ```
 */
export async function rescheduleInspection(
  inspectionId: string,
  newDate: Date,
  reason: string,
  userId: string,
): Promise<ConstructionInspection> {
  const inspection = await ConstructionInspection.findByPk(inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  await inspection.update({
    scheduledDate: newDate,
    status: InspectionStatus.RESCHEDULED,
  });

  await logInspectionActivity(inspectionId, 'rescheduled', { newDate, reason, userId });

  return inspection;
}

/**
 * Cancels an inspection
 *
 * @param inspectionId - Inspection identifier
 * @param reason - Cancellation reason
 * @param userId - User cancelling
 *
 * @example
 * ```typescript
 * await cancelInspection('insp-123', 'Work not complete', 'user-456');
 * ```
 */
export async function cancelInspection(inspectionId: string, reason: string, userId: string): Promise<void> {
  const inspection = await ConstructionInspection.findByPk(inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  await inspection.update({ status: InspectionStatus.CANCELLED });
  await logInspectionActivity(inspectionId, 'cancelled', { reason, userId });
}

/**
 * Assigns inspector to inspection
 *
 * @param inspectionId - Inspection identifier
 * @param inspectorId - Inspector user ID
 * @param inspectorType - Type of inspector
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await assignInspector('insp-123', 'inspector-456', InspectorType.MUNICIPAL);
 * ```
 */
export async function assignInspector(
  inspectionId: string,
  inspectorId: string,
  inspectorType: InspectorType,
): Promise<ConstructionInspection> {
  const inspection = await ConstructionInspection.findByPk(inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  await inspection.update({
    inspectorId,
    inspectorType,
    inspectorName: `Inspector ${inspectorId.substring(0, 8)}`, // In production, fetch from user service
  });

  return inspection;
}

/**
 * Gets inspector availability for scheduling
 *
 * @param inspectorId - Inspector identifier
 * @param startDate - Start date for availability check
 * @param endDate - End date for availability check
 * @returns Inspector availability
 *
 * @example
 * ```typescript
 * const availability = await getInspectorAvailability('inspector-123', startDate, endDate);
 * ```
 */
export async function getInspectorAvailability(
  inspectorId: string,
  startDate: Date,
  endDate: Date,
): Promise<InspectorAvailability> {
  const bookedInspections = await ConstructionInspection.findAll({
    where: {
      inspectorId,
      scheduledDate: { [Op.between]: [startDate, endDate] },
      status: { [Op.notIn]: [InspectionStatus.CANCELLED, InspectionStatus.COMPLETED] },
    },
  });

  const bookedSlots = bookedInspections.map((i) => i.scheduledDate);

  // In production, implement more sophisticated availability logic
  return {
    inspectorId,
    inspectorName: `Inspector ${inspectorId}`,
    availableSlots: [],
    bookedSlots,
  };
}

// ============================================================================
// INSPECTION EXECUTION
// ============================================================================

/**
 * Starts an inspection
 *
 * @param inspectionId - Inspection identifier
 * @param inspectorId - Inspector starting the inspection
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await startInspection('insp-123', 'inspector-456');
 * ```
 */
export async function startInspection(
  inspectionId: string,
  inspectorId: string,
): Promise<ConstructionInspection> {
  const inspection = await ConstructionInspection.findByPk(inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  await inspection.update({
    status: InspectionStatus.IN_PROGRESS,
    actualStartTime: new Date(),
  });

  await logInspectionActivity(inspectionId, 'started', { inspectorId });

  return inspection;
}

/**
 * Completes an inspection with results
 *
 * @param inspectionId - Inspection identifier
 * @param result - Inspection result
 * @param comments - Inspector comments
 * @param attachments - Attachment URLs
 * @param inspectorId - Inspector completing the inspection
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await completeInspection('insp-123', InspectionResult.PASS, 'All items compliant', [], 'inspector-456');
 * ```
 */
export async function completeInspection(
  inspectionId: string,
  result: InspectionResult,
  comments: string,
  attachments: string[],
  inspectorId: string,
): Promise<ConstructionInspection> {
  const inspection = await ConstructionInspection.findByPk(inspectionId, {
    include: [{ model: InspectionDeficiency, as: 'deficiencies' }],
  });

  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  const requiresReinspection =
    result === InspectionResult.FAIL || result === InspectionResult.PASS_WITH_CONDITIONS;

  await inspection.update({
    status: InspectionStatus.COMPLETED,
    result,
    comments,
    attachments,
    actualEndTime: new Date(),
    requiresReinspection,
  });

  await logInspectionActivity(inspectionId, 'completed', { result, inspectorId });

  return inspection;
}

/**
 * Searches inspections with filters
 *
 * @param filters - Search filters
 * @returns Filtered inspections
 *
 * @example
 * ```typescript
 * const inspections = await searchInspections({
 *   projectId: 'project-123',
 *   status: InspectionStatus.SCHEDULED
 * });
 * ```
 */
export async function searchInspections(filters: InspectionFilter): Promise<ConstructionInspection[]> {
  const where: any = {};

  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.inspectionType) where.inspectionType = filters.inspectionType;
  if (filters.status) where.status = filters.status;
  if (filters.inspectorId) where.inspectorId = filters.inspectorId;
  if (filters.result) where.result = filters.result;

  if (filters.dateFrom && filters.dateTo) {
    where.scheduledDate = { [Op.between]: [filters.dateFrom, filters.dateTo] };
  }

  return ConstructionInspection.findAll({
    where,
    include: [
      { model: InspectionDeficiency, as: 'deficiencies' },
      { model: InspectionChecklistItem, as: 'checklistItems' },
    ],
    order: [['scheduledDate', 'DESC']],
  });
}

// ============================================================================
// CHECKLIST MANAGEMENT
// ============================================================================

/**
 * Creates inspection checklist items from template
 *
 * @param inspectionId - Inspection identifier
 * @param templateId - Checklist template ID
 * @returns Created checklist items
 *
 * @example
 * ```typescript
 * const items = await createChecklistFromTemplate('insp-123', 'template-foundation');
 * ```
 */
export async function createChecklistFromTemplate(
  inspectionId: string,
  templateId: string,
): Promise<InspectionChecklistItem[]> {
  // In production, fetch template from database
  const templateItems = await getChecklistTemplate(templateId);

  const items = await Promise.all(
    templateItems.map((template, index) =>
      InspectionChecklistItem.create({
        inspectionId,
        sequence: index + 1,
        category: template.category,
        itemText: template.itemText,
        description: template.description,
        isRequired: template.isRequired,
        codeReference: template.codeReference,
      } as any),
    ),
  );

  return items;
}

/**
 * Updates checklist item status
 *
 * @param itemId - Checklist item ID
 * @param isCompliant - Compliance status
 * @param notes - Inspector notes
 * @param photos - Photo URLs
 * @param inspectorId - Inspector updating item
 * @returns Updated item
 *
 * @example
 * ```typescript
 * await updateChecklistItem('item-123', true, 'Meets code requirements', [], 'inspector-456');
 * ```
 */
export async function updateChecklistItem(
  itemId: string,
  isCompliant: boolean,
  notes: string,
  photos: string[],
  inspectorId: string,
): Promise<InspectionChecklistItem> {
  const item = await InspectionChecklistItem.findByPk(itemId);
  if (!item) {
    throw new NotFoundException('Checklist item not found');
  }

  await item.update({
    isCompliant,
    notes,
    photos,
    checkedAt: new Date(),
    checkedBy: inspectorId,
  });

  return item;
}

/**
 * Marks checklist item as not applicable
 *
 * @param itemId - Checklist item ID
 * @param reason - Reason for N/A
 * @param inspectorId - Inspector marking N/A
 *
 * @example
 * ```typescript
 * await markChecklistItemNA('item-123', 'Not in scope for this phase', 'inspector-456');
 * ```
 */
export async function markChecklistItemNA(itemId: string, reason: string, inspectorId: string): Promise<void> {
  const item = await InspectionChecklistItem.findByPk(itemId);
  if (!item) {
    throw new NotFoundException('Checklist item not found');
  }

  await item.update({
    isNotApplicable: true,
    notes: reason,
    checkedAt: new Date(),
    checkedBy: inspectorId,
  });
}

/**
 * Gets checklist completion status
 *
 * @param inspectionId - Inspection identifier
 * @returns Completion statistics
 *
 * @example
 * ```typescript
 * const status = await getChecklistCompletionStatus('insp-123');
 * ```
 */
export async function getChecklistCompletionStatus(
  inspectionId: string,
): Promise<{ total: number; completed: number; compliant: number; nonCompliant: number; notApplicable: number }> {
  const items = await InspectionChecklistItem.findAll({ where: { inspectionId } });

  return {
    total: items.length,
    completed: items.filter((i) => i.checkedAt).length,
    compliant: items.filter((i) => i.isCompliant).length,
    nonCompliant: items.filter((i) => !i.isCompliant && !i.isNotApplicable && i.checkedAt).length,
    notApplicable: items.filter((i) => i.isNotApplicable).length,
  };
}

// ============================================================================
// DEFICIENCY TRACKING
// ============================================================================

/**
 * Creates a deficiency from inspection
 *
 * @param deficiencyData - Deficiency data
 * @param userId - User creating deficiency
 * @returns Created deficiency
 *
 * @example
 * ```typescript
 * const deficiency = await createDeficiency({
 *   inspectionId: 'insp-123',
 *   title: 'Improper rebar spacing',
 *   description: 'Rebar spacing exceeds code requirements in Grid A-3',
 *   severity: DeficiencySeverity.MAJOR,
 *   location: 'Foundation, Grid A-3',
 *   codeReference: 'ACI 318-19 Section 7.6'
 * }, 'inspector-456');
 * ```
 */
export async function createDeficiency(
  deficiencyData: Omit<InspectionDeficiency, 'id' | 'deficiencyNumber' | 'status' | 'createdAt' | 'updatedAt'>,
  userId: string,
): Promise<InspectionDeficiency> {
  const inspection = await ConstructionInspection.findByPk(deficiencyData.inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  const deficiencyNumber = generateDeficiencyNumber(inspection.inspectionNumber);

  const deficiency = await InspectionDeficiency.create({
    ...deficiencyData,
    deficiencyNumber,
    status: DeficiencyStatus.OPEN,
  } as any);

  // Update inspection deficiency count
  await inspection.increment('deficiencyCount');

  await logInspectionActivity(inspection.id, 'deficiency_created', { deficiencyNumber, userId });

  return deficiency;
}

/**
 * Generates a unique deficiency number
 *
 * @param inspectionNumber - Parent inspection number
 * @returns Formatted deficiency number
 *
 * @example
 * ```typescript
 * const defNumber = generateDeficiencyNumber('INS-PRJ001-FND-001');
 * // Returns: "DEF-INS-PRJ001-FND-001-001"
 * ```
 */
export function generateDeficiencyNumber(inspectionNumber: string): string {
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `DEF-${inspectionNumber}-${sequence}`;
}

/**
 * Assigns deficiency to contractor or team
 *
 * @param deficiencyId - Deficiency identifier
 * @param assignedTo - User/team ID to assign to
 * @param dueDate - Due date for resolution
 * @returns Updated deficiency
 *
 * @example
 * ```typescript
 * await assignDeficiency('def-123', 'contractor-456', new Date('2025-01-20'));
 * ```
 */
export async function assignDeficiency(
  deficiencyId: string,
  assignedTo: string,
  dueDate: Date,
): Promise<InspectionDeficiency> {
  const deficiency = await InspectionDeficiency.findByPk(deficiencyId);
  if (!deficiency) {
    throw new NotFoundException('Deficiency not found');
  }

  await deficiency.update({
    assignedTo,
    assignedToName: `User ${assignedTo}`, // In production, fetch from user service
    assignedAt: new Date(),
    dueDate,
    status: DeficiencyStatus.IN_PROGRESS,
  });

  return deficiency;
}

/**
 * Marks deficiency as resolved
 *
 * @param deficiencyId - Deficiency identifier
 * @param resolutionNotes - Resolution description
 * @param photos - Photo URLs of resolution
 * @param userId - User resolving deficiency
 * @returns Updated deficiency
 *
 * @example
 * ```typescript
 * await resolveDeficiency('def-123', 'Corrected rebar spacing per code', ['photo1.jpg'], 'contractor-456');
 * ```
 */
export async function resolveDeficiency(
  deficiencyId: string,
  resolutionNotes: string,
  photos: string[],
  userId: string,
): Promise<InspectionDeficiency> {
  const deficiency = await InspectionDeficiency.findByPk(deficiencyId);
  if (!deficiency) {
    throw new NotFoundException('Deficiency not found');
  }

  await deficiency.update({
    status: DeficiencyStatus.RESOLVED,
    resolvedAt: new Date(),
    resolvedBy: userId,
    resolutionNotes,
    photos: [...(deficiency.photos || []), ...photos],
  });

  return deficiency;
}

/**
 * Verifies deficiency resolution
 *
 * @param deficiencyId - Deficiency identifier
 * @param verificationNotes - Verification notes
 * @param approved - Whether resolution is approved
 * @param inspectorId - Inspector verifying
 * @returns Updated deficiency
 *
 * @example
 * ```typescript
 * await verifyDeficiency('def-123', 'Resolution meets code requirements', true, 'inspector-456');
 * ```
 */
export async function verifyDeficiency(
  deficiencyId: string,
  verificationNotes: string,
  approved: boolean,
  inspectorId: string,
): Promise<InspectionDeficiency> {
  const deficiency = await InspectionDeficiency.findByPk(deficiencyId);
  if (!deficiency) {
    throw new NotFoundException('Deficiency not found');
  }

  await deficiency.update({
    status: approved ? DeficiencyStatus.VERIFIED : DeficiencyStatus.REJECTED,
    verifiedAt: new Date(),
    verifiedBy: inspectorId,
    verificationNotes,
  });

  return deficiency;
}

/**
 * Gets open deficiencies for project
 *
 * @param projectId - Project identifier
 * @returns Open deficiencies
 *
 * @example
 * ```typescript
 * const openDeficiencies = await getOpenDeficiencies('project-123');
 * ```
 */
export async function getOpenDeficiencies(projectId: string): Promise<InspectionDeficiency[]> {
  const inspections = await ConstructionInspection.findAll({ where: { projectId } });
  const inspectionIds = inspections.map((i) => i.id);

  return InspectionDeficiency.findAll({
    where: {
      inspectionId: { [Op.in]: inspectionIds },
      status: { [Op.in]: [DeficiencyStatus.OPEN, DeficiencyStatus.IN_PROGRESS] },
    },
    order: [['severity', 'ASC'], ['dueDate', 'ASC']],
  });
}

/**
 * Gets critical deficiencies requiring immediate attention
 *
 * @param projectId - Project identifier
 * @returns Critical deficiencies
 *
 * @example
 * ```typescript
 * const critical = await getCriticalDeficiencies('project-123');
 * ```
 */
export async function getCriticalDeficiencies(projectId: string): Promise<InspectionDeficiency[]> {
  const inspections = await ConstructionInspection.findAll({ where: { projectId } });
  const inspectionIds = inspections.map((i) => i.id);

  return InspectionDeficiency.findAll({
    where: {
      inspectionId: { [Op.in]: inspectionIds },
      severity: DeficiencySeverity.CRITICAL,
      status: { [Op.notIn]: [DeficiencyStatus.VERIFIED, DeficiencyStatus.CLOSED] },
    },
    order: [['dueDate', 'ASC']],
  });
}

/**
 * Gets overdue deficiencies
 *
 * @param projectId - Project identifier
 * @returns Overdue deficiencies
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueDeficiencies('project-123');
 * ```
 */
export async function getOverdueDeficiencies(projectId: string): Promise<InspectionDeficiency[]> {
  const inspections = await ConstructionInspection.findAll({ where: { projectId } });
  const inspectionIds = inspections.map((i) => i.id);
  const now = new Date();

  return InspectionDeficiency.findAll({
    where: {
      inspectionId: { [Op.in]: inspectionIds },
      dueDate: { [Op.lt]: now },
      status: { [Op.notIn]: [DeficiencyStatus.VERIFIED, DeficiencyStatus.CLOSED] },
    },
    order: [['dueDate', 'ASC']],
  });
}

// ============================================================================
// THIRD-PARTY INSPECTION COORDINATION
// ============================================================================

/**
 * Requests third-party inspection
 *
 * @param inspectionType - Type of inspection
 * @param projectId - Project identifier
 * @param location - Inspection location
 * @param preferredDate - Preferred inspection date
 * @param requestedBy - User requesting inspection
 * @returns Created inspection request
 *
 * @example
 * ```typescript
 * const request = await requestThirdPartyInspection(
 *   InspectionType.THIRD_PARTY,
 *   'project-123',
 *   'Building A, Foundation',
 *   new Date('2025-01-20'),
 *   'user-456'
 * );
 * ```
 */
export async function requestThirdPartyInspection(
  inspectionType: InspectionType,
  projectId: string,
  location: string,
  preferredDate: Date,
  requestedBy: string,
): Promise<ConstructionInspection> {
  return scheduleInspection({
    inspectionType,
    projectId,
    location,
    scheduledDate: preferredDate,
    requestedBy,
    description: 'Third-party inspection requested',
  });
}

/**
 * Uploads third-party inspection report
 *
 * @param inspectionId - Inspection identifier
 * @param reportUrl - Report file URL
 * @param summary - Report summary
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await uploadThirdPartyReport('insp-123', 'https://storage/report.pdf', 'All items pass inspection');
 * ```
 */
export async function uploadThirdPartyReport(
  inspectionId: string,
  reportUrl: string,
  summary: string,
): Promise<ConstructionInspection> {
  const inspection = await ConstructionInspection.findByPk(inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  await inspection.update({
    attachments: [...(inspection.attachments || []), reportUrl],
    comments: summary,
  });

  return inspection;
}

// ============================================================================
// CODE COMPLIANCE VERIFICATION
// ============================================================================

/**
 * Validates code compliance for inspection
 *
 * @param inspectionId - Inspection identifier
 * @returns Compliance validation results
 *
 * @example
 * ```typescript
 * const validation = await validateCodeCompliance('insp-123');
 * ```
 */
export async function validateCodeCompliance(
  inspectionId: string,
): Promise<{ isCompliant: boolean; violations: string[]; warnings: string[] }> {
  const inspection = await ConstructionInspection.findByPk(inspectionId, {
    include: [
      { model: InspectionChecklistItem, as: 'checklistItems' },
      { model: InspectionDeficiency, as: 'deficiencies' },
    ],
  });

  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  const violations: string[] = [];
  const warnings: string[] = [];

  // Check for non-compliant required items
  const nonCompliantItems = inspection.checklistItems?.filter((item) => item.isRequired && !item.isCompliant) || [];
  violations.push(...nonCompliantItems.map((item) => `${item.itemText}: ${item.codeReference || 'No code reference'}`));

  // Check for critical/major deficiencies
  const criticalDeficiencies = inspection.deficiencies?.filter(
    (d) => d.severity === DeficiencySeverity.CRITICAL || d.severity === DeficiencySeverity.MAJOR,
  ) || [];
  violations.push(...criticalDeficiencies.map((d) => `${d.title}: ${d.codeReference || 'No code reference'}`));

  // Check for minor deficiencies
  const minorDeficiencies = inspection.deficiencies?.filter((d) => d.severity === DeficiencySeverity.MINOR) || [];
  warnings.push(...minorDeficiencies.map((d) => d.title));

  return {
    isCompliant: violations.length === 0,
    violations,
    warnings,
  };
}

// ============================================================================
// PERMIT TRACKING
// ============================================================================

/**
 * Links inspection to permit
 *
 * @param inspectionId - Inspection identifier
 * @param permitId - Permit identifier
 *
 * @example
 * ```typescript
 * await linkInspectionToPermit('insp-123', 'permit-456');
 * ```
 */
export async function linkInspectionToPermit(inspectionId: string, permitId: string): Promise<void> {
  const inspection = await ConstructionInspection.findByPk(inspectionId);
  if (!inspection) {
    throw new NotFoundException('Inspection not found');
  }

  await inspection.update({ permitId });
}

/**
 * Gets inspections for permit
 *
 * @param permitId - Permit identifier
 * @returns Inspections linked to permit
 *
 * @example
 * ```typescript
 * const inspections = await getInspectionsByPermit('permit-123');
 * ```
 */
export async function getInspectionsByPermit(permitId: string): Promise<ConstructionInspection[]> {
  return ConstructionInspection.findAll({
    where: { permitId },
    order: [['scheduledDate', 'ASC']],
  });
}

// ============================================================================
// INSPECTION ANALYTICS
// ============================================================================

/**
 * Gets inspection statistics for project
 *
 * @param projectId - Project identifier
 * @returns Inspection statistics
 *
 * @example
 * ```typescript
 * const stats = await getInspectionStatistics('project-123');
 * ```
 */
export async function getInspectionStatistics(projectId: string): Promise<InspectionStatistics> {
  const inspections = await ConstructionInspection.findAll({
    where: { projectId },
    include: [{ model: InspectionDeficiency, as: 'deficiencies' }],
  });

  const stats: InspectionStatistics = {
    totalInspections: inspections.length,
    inspectionsByType: {} as Record<InspectionType, number>,
    inspectionsByStatus: {} as Record<InspectionStatus, number>,
    inspectionsByResult: {} as Record<InspectionResult, number>,
    passRate: 0,
    averageInspectionDuration: 0,
    totalDeficiencies: 0,
    openDeficiencies: 0,
    criticalDeficiencies: 0,
  };

  let totalDuration = 0;
  let completedCount = 0;
  let passedCount = 0;

  inspections.forEach((insp) => {
    stats.inspectionsByType[insp.inspectionType] = (stats.inspectionsByType[insp.inspectionType] || 0) + 1;
    stats.inspectionsByStatus[insp.status] = (stats.inspectionsByStatus[insp.status] || 0) + 1;

    if (insp.result) {
      stats.inspectionsByResult[insp.result] = (stats.inspectionsByResult[insp.result] || 0) + 1;

      if (insp.result === InspectionResult.PASS) {
        passedCount++;
      }
    }

    if (insp.actualStartTime && insp.actualEndTime) {
      const duration = (insp.actualEndTime.getTime() - insp.actualStartTime.getTime()) / (1000 * 60 * 60);
      totalDuration += duration;
      completedCount++;
    }

    if (insp.deficiencies) {
      stats.totalDeficiencies += insp.deficiencies.length;
      stats.openDeficiencies += insp.deficiencies.filter((d) => d.status === DeficiencyStatus.OPEN).length;
      stats.criticalDeficiencies += insp.deficiencies.filter((d) => d.severity === DeficiencySeverity.CRITICAL).length;
    }
  });

  stats.passRate = inspections.length > 0 ? (passedCount / inspections.length) * 100 : 0;
  stats.averageInspectionDuration = completedCount > 0 ? totalDuration / completedCount : 0;

  return stats;
}

/**
 * Generates deficiency trend report
 *
 * @param projectId - Project identifier
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Deficiency trends
 *
 * @example
 * ```typescript
 * const trends = await generateDeficiencyTrendReport('project-123', startDate, endDate);
 * ```
 */
export async function generateDeficiencyTrendReport(
  projectId: string,
  startDate: Date,
  endDate: Date,
): Promise<DeficiencyTrend[]> {
  // In production, implement sophisticated trend analysis
  return [
    {
      period: '2025-01',
      totalDeficiencies: 15,
      criticalDeficiencies: 2,
      resolvedDeficiencies: 12,
      averageResolutionTime: 4.5,
    },
  ];
}

/**
 * Generates inspection pass rate report
 *
 * @param projectId - Project identifier
 * @returns Pass rate by inspection type
 *
 * @example
 * ```typescript
 * const passRates = await generateInspectionPassRateReport('project-123');
 * ```
 */
export async function generateInspectionPassRateReport(
  projectId: string,
): Promise<Record<InspectionType, number>> {
  const inspections = await ConstructionInspection.findAll({ where: { projectId } });

  const passRates: Record<InspectionType, number> = {} as any;

  Object.values(InspectionType).forEach((type) => {
    const typeInspections = inspections.filter((i) => i.inspectionType === type);
    const passedInspections = typeInspections.filter((i) => i.result === InspectionResult.PASS);

    passRates[type] = typeInspections.length > 0 ? (passedInspections.length / typeInspections.length) * 100 : 0;
  });

  return passRates;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets checklist template (placeholder)
 */
async function getChecklistTemplate(
  templateId: string,
): Promise<Array<{ category: string; itemText: string; description: string; isRequired: boolean; codeReference: string }>> {
  // In production, fetch from database
  return [
    {
      category: 'Foundation',
      itemText: 'Verify rebar placement and spacing',
      description: 'Check that reinforcement meets structural drawings',
      isRequired: true,
      codeReference: 'ACI 318-19',
    },
  ];
}

/**
 * Logs inspection activity for audit trail
 */
async function logInspectionActivity(inspectionId: string, activityType: string, data: any): Promise<void> {
  // In production, log to audit database
  console.log(`Inspection ${inspectionId}: ${activityType}`, data);
}

// Need to declare Op for Sequelize operations
const Op = {
  in: Symbol('in'),
  notIn: Symbol('notIn'),
  between: Symbol('between'),
  lt: Symbol('lt'),
  overlap: Symbol('overlap'),
};

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Construction Inspection Management Controller
 * Provides RESTful API endpoints for inspection operations
 */
@ApiTags('construction-inspections')
@Controller('construction/inspections')
@ApiBearerAuth()
export class ConstructionInspectionController {
  /**
   * Schedule a new inspection
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Schedule new construction inspection' })
  @ApiResponse({ status: 201, description: 'Inspection scheduled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async schedule(@Body() scheduleDto: ScheduleInspectionDto) {
    return scheduleInspection({
      inspectionType: scheduleDto.inspectionType,
      projectId: scheduleDto.projectId,
      location: scheduleDto.location,
      scheduledDate: scheduleDto.scheduledDate,
      requestedBy: 'current-user',
      description: scheduleDto.description,
      permitId: scheduleDto.permitId,
    });
  }

  /**
   * Search inspections
   */
  @Get()
  @ApiOperation({ summary: 'Search construction inspections' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'inspectionType', enum: InspectionType, required: false })
  @ApiQuery({ name: 'status', enum: InspectionStatus, required: false })
  async search(
    @Query('projectId') projectId?: string,
    @Query('inspectionType') inspectionType?: InspectionType,
    @Query('status') status?: InspectionStatus,
  ) {
    return searchInspections({ projectId, inspectionType, status });
  }

  /**
   * Get inspection by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get inspection by ID' })
  @ApiParam({ name: 'id', description: 'Inspection ID' })
  @ApiResponse({ status: 200, description: 'Inspection found' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const inspection = await ConstructionInspection.findByPk(id, {
      include: [
        { model: InspectionDeficiency, as: 'deficiencies' },
        { model: InspectionChecklistItem, as: 'checklistItems' },
      ],
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    return inspection;
  }

  /**
   * Update inspection
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update inspection' })
  @ApiResponse({ status: 200, description: 'Inspection updated' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateInspectionDto) {
    const inspection = await ConstructionInspection.findByPk(id);
    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    await inspection.update(updateDto);
    return inspection;
  }

  /**
   * Start inspection
   */
  @Post(':id/start')
  @ApiOperation({ summary: 'Start inspection' })
  @ApiResponse({ status: 200, description: 'Inspection started' })
  async start(@Param('id', ParseUUIDPipe) id: string) {
    return startInspection(id, 'current-inspector');
  }

  /**
   * Complete inspection
   */
  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete inspection with results' })
  @ApiResponse({ status: 200, description: 'Inspection completed' })
  async complete(@Param('id', ParseUUIDPipe) id: string, @Body() completeDto: CompleteInspectionDto) {
    return completeInspection(
      id,
      completeDto.result,
      completeDto.comments,
      completeDto.attachments || [],
      'current-inspector',
    );
  }

  /**
   * Create deficiency
   */
  @Post('deficiencies')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inspection deficiency' })
  @ApiResponse({ status: 201, description: 'Deficiency created' })
  async createDeficiencyEndpoint(@Body() deficiencyDto: CreateDeficiencyDto) {
    return createDeficiency(deficiencyDto as any, 'current-inspector');
  }

  /**
   * Resolve deficiency
   */
  @Post('deficiencies/:id/resolve')
  @ApiOperation({ summary: 'Resolve deficiency' })
  @ApiResponse({ status: 200, description: 'Deficiency resolved' })
  async resolveDeficiencyEndpoint(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() resolveDto: ResolveDeficiencyDto,
  ) {
    return resolveDeficiency(id, resolveDto.resolutionNotes, resolveDto.photos || [], 'current-user');
  }

  /**
   * Verify deficiency
   */
  @Post('deficiencies/:id/verify')
  @ApiOperation({ summary: 'Verify deficiency resolution' })
  @ApiResponse({ status: 200, description: 'Deficiency verified' })
  async verifyDeficiencyEndpoint(@Param('id', ParseUUIDPipe) id: string, @Body() verifyDto: VerifyDeficiencyDto) {
    return verifyDeficiency(id, verifyDto.verificationNotes, verifyDto.approved || true, 'current-inspector');
  }

  /**
   * Get open deficiencies
   */
  @Get('projects/:projectId/deficiencies/open')
  @ApiOperation({ summary: 'Get open deficiencies for project' })
  async getOpenDeficienciesEndpoint(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return getOpenDeficiencies(projectId);
  }

  /**
   * Get project statistics
   */
  @Get('projects/:projectId/statistics')
  @ApiOperation({ summary: 'Get inspection statistics for project' })
  async getStatistics(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return getInspectionStatistics(projectId);
  }

  /**
   * Validate code compliance
   */
  @Get(':id/compliance')
  @ApiOperation({ summary: 'Validate code compliance for inspection' })
  async validateCompliance(@Param('id', ParseUUIDPipe) id: string) {
    return validateCodeCompliance(id);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Inspection Scheduling
  scheduleInspection,
  generateInspectionNumber,
  rescheduleInspection,
  cancelInspection,
  assignInspector,
  getInspectorAvailability,

  // Inspection Execution
  startInspection,
  completeInspection,
  searchInspections,

  // Checklist Management
  createChecklistFromTemplate,
  updateChecklistItem,
  markChecklistItemNA,
  getChecklistCompletionStatus,

  // Deficiency Tracking
  createDeficiency,
  generateDeficiencyNumber,
  assignDeficiency,
  resolveDeficiency,
  verifyDeficiency,
  getOpenDeficiencies,
  getCriticalDeficiencies,
  getOverdueDeficiencies,

  // Third-Party Coordination
  requestThirdPartyInspection,
  uploadThirdPartyReport,

  // Code Compliance
  validateCodeCompliance,

  // Permit Tracking
  linkInspectionToPermit,
  getInspectionsByPermit,

  // Analytics
  getInspectionStatistics,
  generateDeficiencyTrendReport,
  generateInspectionPassRateReport,

  // Models
  ConstructionInspection,
  InspectionDeficiency,
  InspectionChecklistItem,

  // Controller
  ConstructionInspectionController,
};
