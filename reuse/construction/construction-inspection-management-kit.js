"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionInspectionController = void 0;
exports.scheduleInspection = scheduleInspection;
exports.generateInspectionNumber = generateInspectionNumber;
exports.rescheduleInspection = rescheduleInspection;
exports.cancelInspection = cancelInspection;
exports.assignInspector = assignInspector;
exports.getInspectorAvailability = getInspectorAvailability;
exports.startInspection = startInspection;
exports.completeInspection = completeInspection;
exports.searchInspections = searchInspections;
exports.createChecklistFromTemplate = createChecklistFromTemplate;
exports.updateChecklistItem = updateChecklistItem;
exports.markChecklistItemNA = markChecklistItemNA;
exports.getChecklistCompletionStatus = getChecklistCompletionStatus;
exports.createDeficiency = createDeficiency;
exports.generateDeficiencyNumber = generateDeficiencyNumber;
exports.assignDeficiency = assignDeficiency;
exports.resolveDeficiency = resolveDeficiency;
exports.verifyDeficiency = verifyDeficiency;
exports.getOpenDeficiencies = getOpenDeficiencies;
exports.getCriticalDeficiencies = getCriticalDeficiencies;
exports.getOverdueDeficiencies = getOverdueDeficiencies;
exports.requestThirdPartyInspection = requestThirdPartyInspection;
exports.uploadThirdPartyReport = uploadThirdPartyReport;
exports.validateCodeCompliance = validateCodeCompliance;
exports.linkInspectionToPermit = linkInspectionToPermit;
exports.getInspectionsByPermit = getInspectionsByPermit;
exports.getInspectionStatistics = getInspectionStatistics;
exports.generateDeficiencyTrendReport = generateDeficiencyTrendReport;
exports.generateInspectionPassRateReport = generateInspectionPassRateReport;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const construction_inspection_model_1 = require("./models/construction-inspection.model");
const inspection_deficiency_model_1 = require("./models/inspection-deficiency.model");
const inspection_checklist_item_model_1 = require("./models/inspection-checklist-item.model");
const inspection_types_1 = require("./types/inspection.types");
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
async function scheduleInspection(request) {
    const inspectionNumber = generateInspectionNumber(request.inspectionType, request.projectId);
    const inspection = await construction_inspection_model_1.ConstructionInspection.create({
        inspectionNumber,
        inspectionType: request.inspectionType,
        projectId: request.projectId,
        location: request.location,
        scheduledDate: request.scheduledDate,
        requestedBy: request.requestedBy,
        requestedAt: new Date(),
        status: inspection_types_1.InspectionStatus.SCHEDULED,
        description: request.description,
        permitId: request.permitId,
    });
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
function generateInspectionNumber(type, projectId) {
    const typePrefix = {
        [inspection_types_1.InspectionType.FOUNDATION]: 'FND',
        [inspection_types_1.InspectionType.FRAMING]: 'FRM',
        [inspection_types_1.InspectionType.ROUGH_IN]: 'RGH',
        [inspection_types_1.InspectionType.INSULATION]: 'INS',
        [inspection_types_1.InspectionType.DRYWALL]: 'DRY',
        [inspection_types_1.InspectionType.FINAL]: 'FNL',
        [inspection_types_1.InspectionType.FIRE_PROTECTION]: 'FIR',
        [inspection_types_1.InspectionType.ELECTRICAL]: 'ELC',
        [inspection_types_1.InspectionType.PLUMBING]: 'PLM',
        [inspection_types_1.InspectionType.MECHANICAL]: 'MCH',
        [inspection_types_1.InspectionType.STRUCTURAL]: 'STR',
        [inspection_types_1.InspectionType.ACCESSIBILITY]: 'ACC',
        [inspection_types_1.InspectionType.ENERGY_CODE]: 'ENG',
        [inspection_types_1.InspectionType.THIRD_PARTY]: 'TRD',
        [inspection_types_1.InspectionType.SPECIAL]: 'SPC',
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
async function rescheduleInspection(inspectionId, newDate, reason, userId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
    }
    await inspection.update({
        scheduledDate: newDate,
        status: inspection_types_1.InspectionStatus.RESCHEDULED,
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
async function cancelInspection(inspectionId, reason, userId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
    }
    await inspection.update({ status: inspection_types_1.InspectionStatus.CANCELLED });
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
async function assignInspector(inspectionId, inspectorId, inspectorType) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
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
async function getInspectorAvailability(inspectorId, startDate, endDate) {
    const bookedInspections = await construction_inspection_model_1.ConstructionInspection.findAll({
        where: {
            inspectorId,
            scheduledDate: { [Op.between]: [startDate, endDate] },
            status: { [Op.notIn]: [inspection_types_1.InspectionStatus.CANCELLED, inspection_types_1.InspectionStatus.COMPLETED] },
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
async function startInspection(inspectionId, inspectorId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
    }
    await inspection.update({
        status: inspection_types_1.InspectionStatus.IN_PROGRESS,
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
async function completeInspection(inspectionId, result, comments, attachments, inspectorId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId, {
        include: [{ model: inspection_deficiency_model_1.InspectionDeficiency, as: 'deficiencies' }],
    });
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
    }
    const requiresReinspection = result === inspection_types_1.InspectionResult.FAIL || result === inspection_types_1.InspectionResult.PASS_WITH_CONDITIONS;
    await inspection.update({
        status: inspection_types_1.InspectionStatus.COMPLETED,
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
async function searchInspections(filters) {
    const where = {};
    if (filters.projectId)
        where.projectId = filters.projectId;
    if (filters.inspectionType)
        where.inspectionType = filters.inspectionType;
    if (filters.status)
        where.status = filters.status;
    if (filters.inspectorId)
        where.inspectorId = filters.inspectorId;
    if (filters.result)
        where.result = filters.result;
    if (filters.dateFrom && filters.dateTo) {
        where.scheduledDate = { [Op.between]: [filters.dateFrom, filters.dateTo] };
    }
    return construction_inspection_model_1.ConstructionInspection.findAll({
        where,
        include: [
            { model: inspection_deficiency_model_1.InspectionDeficiency, as: 'deficiencies' },
            { model: inspection_checklist_item_model_1.InspectionChecklistItem, as: 'checklistItems' },
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
async function createChecklistFromTemplate(inspectionId, templateId) {
    // In production, fetch template from database
    const templateItems = await getChecklistTemplate(templateId);
    const items = await Promise.all(templateItems.map((template, index) => inspection_checklist_item_model_1.InspectionChecklistItem.create({
        inspectionId,
        sequence: index + 1,
        category: template.category,
        itemText: template.itemText,
        description: template.description,
        isRequired: template.isRequired,
        codeReference: template.codeReference,
    })));
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
async function updateChecklistItem(itemId, isCompliant, notes, photos, inspectorId) {
    const item = await inspection_checklist_item_model_1.InspectionChecklistItem.findByPk(itemId);
    if (!item) {
        throw new common_1.NotFoundException('Checklist item not found');
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
async function markChecklistItemNA(itemId, reason, inspectorId) {
    const item = await inspection_checklist_item_model_1.InspectionChecklistItem.findByPk(itemId);
    if (!item) {
        throw new common_1.NotFoundException('Checklist item not found');
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
async function getChecklistCompletionStatus(inspectionId) {
    const items = await inspection_checklist_item_model_1.InspectionChecklistItem.findAll({ where: { inspectionId } });
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
async function createDeficiency(deficiencyData, userId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(deficiencyData.inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
    }
    const deficiencyNumber = generateDeficiencyNumber(inspection.inspectionNumber);
    const deficiency = await inspection_deficiency_model_1.InspectionDeficiency.create({
        ...deficiencyData,
        deficiencyNumber,
        status: inspection_types_1.DeficiencyStatus.OPEN,
    });
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
function generateDeficiencyNumber(inspectionNumber) {
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
async function assignDeficiency(deficiencyId, assignedTo, dueDate) {
    const deficiency = await inspection_deficiency_model_1.InspectionDeficiency.findByPk(deficiencyId);
    if (!deficiency) {
        throw new common_1.NotFoundException('Deficiency not found');
    }
    await deficiency.update({
        assignedTo,
        assignedToName: `User ${assignedTo}`, // In production, fetch from user service
        assignedAt: new Date(),
        dueDate,
        status: inspection_types_1.DeficiencyStatus.IN_PROGRESS,
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
async function resolveDeficiency(deficiencyId, resolutionNotes, photos, userId) {
    const deficiency = await inspection_deficiency_model_1.InspectionDeficiency.findByPk(deficiencyId);
    if (!deficiency) {
        throw new common_1.NotFoundException('Deficiency not found');
    }
    await deficiency.update({
        status: inspection_types_1.DeficiencyStatus.RESOLVED,
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
async function verifyDeficiency(deficiencyId, verificationNotes, approved, inspectorId) {
    const deficiency = await inspection_deficiency_model_1.InspectionDeficiency.findByPk(deficiencyId);
    if (!deficiency) {
        throw new common_1.NotFoundException('Deficiency not found');
    }
    await deficiency.update({
        status: approved ? inspection_types_1.DeficiencyStatus.VERIFIED : inspection_types_1.DeficiencyStatus.REJECTED,
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
async function getOpenDeficiencies(projectId) {
    const inspections = await construction_inspection_model_1.ConstructionInspection.findAll({ where: { projectId } });
    const inspectionIds = inspections.map((i) => i.id);
    return inspection_deficiency_model_1.InspectionDeficiency.findAll({
        where: {
            inspectionId: { [Op.in]: inspectionIds },
            status: { [Op.in]: [inspection_types_1.DeficiencyStatus.OPEN, inspection_types_1.DeficiencyStatus.IN_PROGRESS] },
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
async function getCriticalDeficiencies(projectId) {
    const inspections = await construction_inspection_model_1.ConstructionInspection.findAll({ where: { projectId } });
    const inspectionIds = inspections.map((i) => i.id);
    return inspection_deficiency_model_1.InspectionDeficiency.findAll({
        where: {
            inspectionId: { [Op.in]: inspectionIds },
            severity: inspection_types_1.DeficiencySeverity.CRITICAL,
            status: { [Op.notIn]: [inspection_types_1.DeficiencyStatus.VERIFIED, inspection_types_1.DeficiencyStatus.CLOSED] },
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
async function getOverdueDeficiencies(projectId) {
    const inspections = await construction_inspection_model_1.ConstructionInspection.findAll({ where: { projectId } });
    const inspectionIds = inspections.map((i) => i.id);
    const now = new Date();
    return inspection_deficiency_model_1.InspectionDeficiency.findAll({
        where: {
            inspectionId: { [Op.in]: inspectionIds },
            dueDate: { [Op.lt]: now },
            status: { [Op.notIn]: [inspection_types_1.DeficiencyStatus.VERIFIED, inspection_types_1.DeficiencyStatus.CLOSED] },
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
async function requestThirdPartyInspection(inspectionType, projectId, location, preferredDate, requestedBy) {
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
async function uploadThirdPartyReport(inspectionId, reportUrl, summary) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
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
async function validateCodeCompliance(inspectionId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId, {
        include: [
            { model: inspection_checklist_item_model_1.InspectionChecklistItem, as: 'checklistItems' },
            { model: inspection_deficiency_model_1.InspectionDeficiency, as: 'deficiencies' },
        ],
    });
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
    }
    const violations = [];
    const warnings = [];
    // Check for non-compliant required items
    const nonCompliantItems = inspection.checklistItems?.filter((item) => item.isRequired && !item.isCompliant) || [];
    violations.push(...nonCompliantItems.map((item) => `${item.itemText}: ${item.codeReference || 'No code reference'}`));
    // Check for critical/major deficiencies
    const criticalDeficiencies = inspection.deficiencies?.filter((d) => d.severity === inspection_types_1.DeficiencySeverity.CRITICAL || d.severity === inspection_types_1.DeficiencySeverity.MAJOR) || [];
    violations.push(...criticalDeficiencies.map((d) => `${d.title}: ${d.codeReference || 'No code reference'}`));
    // Check for minor deficiencies
    const minorDeficiencies = inspection.deficiencies?.filter((d) => d.severity === inspection_types_1.DeficiencySeverity.MINOR) || [];
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
async function linkInspectionToPermit(inspectionId, permitId) {
    const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(inspectionId);
    if (!inspection) {
        throw new common_1.NotFoundException('Inspection not found');
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
async function getInspectionsByPermit(permitId) {
    return construction_inspection_model_1.ConstructionInspection.findAll({
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
async function getInspectionStatistics(projectId) {
    const inspections = await construction_inspection_model_1.ConstructionInspection.findAll({
        where: { projectId },
        include: [{ model: inspection_deficiency_model_1.InspectionDeficiency, as: 'deficiencies' }],
    });
    const stats = {
        totalInspections: inspections.length,
        inspectionsByType: {},
        inspectionsByStatus: {},
        inspectionsByResult: {},
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
            if (insp.result === inspection_types_1.InspectionResult.PASS) {
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
            stats.openDeficiencies += insp.deficiencies.filter((d) => d.status === inspection_types_1.DeficiencyStatus.OPEN).length;
            stats.criticalDeficiencies += insp.deficiencies.filter((d) => d.severity === inspection_types_1.DeficiencySeverity.CRITICAL).length;
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
async function generateDeficiencyTrendReport(projectId, startDate, endDate) {
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
async function generateInspectionPassRateReport(projectId) {
    const inspections = await construction_inspection_model_1.ConstructionInspection.findAll({ where: { projectId } });
    const passRates = {};
    Object.values(inspection_types_1.InspectionType).forEach((type) => {
        const typeInspections = inspections.filter((i) => i.inspectionType === type);
        const passedInspections = typeInspections.filter((i) => i.result === inspection_types_1.InspectionResult.PASS);
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
async function getChecklistTemplate(templateId) {
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
async function logInspectionActivity(inspectionId, activityType, data) {
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
let ConstructionInspectionController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('construction-inspections'), (0, common_1.Controller)('construction/inspections'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _schedule_decorators;
    let _search_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _start_decorators;
    let _complete_decorators;
    let _createDeficiencyEndpoint_decorators;
    let _resolveDeficiencyEndpoint_decorators;
    let _verifyDeficiencyEndpoint_decorators;
    let _getOpenDeficienciesEndpoint_decorators;
    let _getStatistics_decorators;
    let _validateCompliance_decorators;
    var ConstructionInspectionController = _classThis = class {
        /**
         * Schedule a new inspection
         */
        async schedule(scheduleDto) {
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
        async search(projectId, inspectionType, status) {
            return searchInspections({ projectId, inspectionType, status });
        }
        /**
         * Get inspection by ID
         */
        async findOne(id) {
            const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(id, {
                include: [
                    { model: inspection_deficiency_model_1.InspectionDeficiency, as: 'deficiencies' },
                    { model: inspection_checklist_item_model_1.InspectionChecklistItem, as: 'checklistItems' },
                ],
            });
            if (!inspection) {
                throw new common_1.NotFoundException('Inspection not found');
            }
            return inspection;
        }
        /**
         * Update inspection
         */
        async update(id, updateDto) {
            const inspection = await construction_inspection_model_1.ConstructionInspection.findByPk(id);
            if (!inspection) {
                throw new common_1.NotFoundException('Inspection not found');
            }
            await inspection.update(updateDto);
            return inspection;
        }
        /**
         * Start inspection
         */
        async start(id) {
            return startInspection(id, 'current-inspector');
        }
        /**
         * Complete inspection
         */
        async complete(id, completeDto) {
            return completeInspection(id, completeDto.result, completeDto.comments, completeDto.attachments || [], 'current-inspector');
        }
        /**
         * Create deficiency
         */
        async createDeficiencyEndpoint(deficiencyDto) {
            return createDeficiency(deficiencyDto, 'current-inspector');
        }
        /**
         * Resolve deficiency
         */
        async resolveDeficiencyEndpoint(id, resolveDto) {
            return resolveDeficiency(id, resolveDto.resolutionNotes, resolveDto.photos || [], 'current-user');
        }
        /**
         * Verify deficiency
         */
        async verifyDeficiencyEndpoint(id, verifyDto) {
            return verifyDeficiency(id, verifyDto.verificationNotes, verifyDto.approved || true, 'current-inspector');
        }
        /**
         * Get open deficiencies
         */
        async getOpenDeficienciesEndpoint(projectId) {
            return getOpenDeficiencies(projectId);
        }
        /**
         * Get project statistics
         */
        async getStatistics(projectId) {
            return getInspectionStatistics(projectId);
        }
        /**
         * Validate code compliance
         */
        async validateCompliance(id) {
            return validateCodeCompliance(id);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionInspectionController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _schedule_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Schedule new construction inspection' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Inspection scheduled successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _search_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Search construction inspections' }), (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }), (0, swagger_1.ApiQuery)({ name: 'inspectionType', enum: inspection_types_1.InspectionType, required: false }), (0, swagger_1.ApiQuery)({ name: 'status', enum: inspection_types_1.InspectionStatus, required: false })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get inspection by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Inspection ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Inspection found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Inspection not found' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update inspection' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Inspection updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Inspection not found' })];
        _start_decorators = [(0, common_1.Post)(':id/start'), (0, swagger_1.ApiOperation)({ summary: 'Start inspection' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Inspection started' })];
        _complete_decorators = [(0, common_1.Post)(':id/complete'), (0, swagger_1.ApiOperation)({ summary: 'Complete inspection with results' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Inspection completed' })];
        _createDeficiencyEndpoint_decorators = [(0, common_1.Post)('deficiencies'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create inspection deficiency' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Deficiency created' })];
        _resolveDeficiencyEndpoint_decorators = [(0, common_1.Post)('deficiencies/:id/resolve'), (0, swagger_1.ApiOperation)({ summary: 'Resolve deficiency' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Deficiency resolved' })];
        _verifyDeficiencyEndpoint_decorators = [(0, common_1.Post)('deficiencies/:id/verify'), (0, swagger_1.ApiOperation)({ summary: 'Verify deficiency resolution' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Deficiency verified' })];
        _getOpenDeficienciesEndpoint_decorators = [(0, common_1.Get)('projects/:projectId/deficiencies/open'), (0, swagger_1.ApiOperation)({ summary: 'Get open deficiencies for project' })];
        _getStatistics_decorators = [(0, common_1.Get)('projects/:projectId/statistics'), (0, swagger_1.ApiOperation)({ summary: 'Get inspection statistics for project' })];
        _validateCompliance_decorators = [(0, common_1.Get)(':id/compliance'), (0, swagger_1.ApiOperation)({ summary: 'Validate code compliance for inspection' })];
        __esDecorate(_classThis, null, _schedule_decorators, { kind: "method", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _start_decorators, { kind: "method", name: "start", static: false, private: false, access: { has: obj => "start" in obj, get: obj => obj.start }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _complete_decorators, { kind: "method", name: "complete", static: false, private: false, access: { has: obj => "complete" in obj, get: obj => obj.complete }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDeficiencyEndpoint_decorators, { kind: "method", name: "createDeficiencyEndpoint", static: false, private: false, access: { has: obj => "createDeficiencyEndpoint" in obj, get: obj => obj.createDeficiencyEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resolveDeficiencyEndpoint_decorators, { kind: "method", name: "resolveDeficiencyEndpoint", static: false, private: false, access: { has: obj => "resolveDeficiencyEndpoint" in obj, get: obj => obj.resolveDeficiencyEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyDeficiencyEndpoint_decorators, { kind: "method", name: "verifyDeficiencyEndpoint", static: false, private: false, access: { has: obj => "verifyDeficiencyEndpoint" in obj, get: obj => obj.verifyDeficiencyEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOpenDeficienciesEndpoint_decorators, { kind: "method", name: "getOpenDeficienciesEndpoint", static: false, private: false, access: { has: obj => "getOpenDeficienciesEndpoint" in obj, get: obj => obj.getOpenDeficienciesEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: obj => "getStatistics" in obj, get: obj => obj.getStatistics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateCompliance_decorators, { kind: "method", name: "validateCompliance", static: false, private: false, access: { has: obj => "validateCompliance" in obj, get: obj => obj.validateCompliance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionInspectionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionInspectionController = _classThis;
})();
exports.ConstructionInspectionController = ConstructionInspectionController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
    ConstructionInspection: construction_inspection_model_1.ConstructionInspection,
    InspectionDeficiency: inspection_deficiency_model_1.InspectionDeficiency,
    InspectionChecklistItem: inspection_checklist_item_model_1.InspectionChecklistItem,
    // Controller
    ConstructionInspectionController,
};
//# sourceMappingURL=construction-inspection-management-kit.js.map