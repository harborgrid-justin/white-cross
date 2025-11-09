"use strict";
/**
 * Construction Closeout Management Reusable Function Kit
 *
 * Provides comprehensive construction closeout management capabilities including:
 * - Punch list management with assignment and tracking
 * - Completion tracking and milestone monitoring
 * - Final inspection coordination and scheduling
 * - Certificate of occupancy management
 * - As-built documentation compilation and delivery
 * - Owner training coordination and tracking
 * - O&M manual delivery and acknowledgment
 * - Warranty documentation and registration
 * - Final payment processing and retainage release
 * - Lien release tracking and verification
 * - Closeout checklist management
 * - Lessons learned documentation and analysis
 *
 * Features rich Sequelize associations for complex relationship management.
 *
 * @module ConstructionCloseoutManagementKit
 */
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCloseoutDocumentDto = exports.CreateCloseoutDocumentDto = exports.UpdatePunchListItemDto = exports.CreatePunchListItemDto = exports.UpdateConstructionCloseoutDto = exports.CreateConstructionCloseoutDto = exports.CloseoutDocument = exports.PunchListItem = exports.ConstructionCloseout = void 0;
exports.createConstructionCloseout = createConstructionCloseout;
exports.getCloseoutByIdWithAssociations = getCloseoutByIdWithAssociations;
exports.updateCloseoutStatus = updateCloseoutStatus;
exports.createPunchListItem = createPunchListItem;
exports.getPunchListItemsForCloseout = getPunchListItemsForCloseout;
exports.updatePunchListItemStatus = updatePunchListItemStatus;
exports.assignPunchListItem = assignPunchListItem;
exports.getCriticalPunchListItems = getCriticalPunchListItems;
exports.getOverduePunchListItems = getOverduePunchListItems;
exports.bulkUpdatePunchListItems = bulkUpdatePunchListItems;
exports.createCloseoutDocument = createCloseoutDocument;
exports.uploadCloseoutDocument = uploadCloseoutDocument;
exports.submitCloseoutDocument = submitCloseoutDocument;
exports.approveCloseoutDocument = approveCloseoutDocument;
exports.rejectCloseoutDocument = rejectCloseoutDocument;
exports.getDocumentsByType = getDocumentsByType;
exports.getPendingDocuments = getPendingDocuments;
exports.getAsBuiltDocuments = getAsBuiltDocuments;
exports.getWarrantyDocuments = getWarrantyDocuments;
exports.getOMManuals = getOMManuals;
exports.getTrainingMaterials = getTrainingMaterials;
exports.scheduleFinalInspection = scheduleFinalInspection;
exports.recordFinalInspectionResult = recordFinalInspectionResult;
exports.recordCertificateOfOccupancy = recordCertificateOfOccupancy;
exports.scheduleOwnerTraining = scheduleOwnerTraining;
exports.completeOwnerTraining = completeOwnerTraining;
exports.registerWarranty = registerWarranty;
exports.getExpiringWarranties = getExpiringWarranties;
exports.processFinalPayment = processFinalPayment;
exports.recordLienRelease = recordLienRelease;
exports.getLienReleaseStatus = getLienReleaseStatus;
exports.createCloseoutChecklist = createCloseoutChecklist;
exports.updateCloseoutChecklist = updateCloseoutChecklist;
exports.getCloseoutChecklistStatus = getCloseoutChecklistStatus;
exports.createLessonsLearnedDocument = createLessonsLearnedDocument;
exports.getCloseoutCompletionStatus = getCloseoutCompletionStatus;
exports.markSubstantialCompletion = markSubstantialCompletion;
exports.markFinalCompletion = markFinalCompletion;
exports.getCloseoutsByStatus = getCloseoutsByStatus;
exports.getActiveCloseouts = getActiveCloseouts;
exports.getCloseoutSummaryReport = getCloseoutSummaryReport;
exports.searchCloseouts = searchCloseouts;
exports.getCloseoutsPendingFinalPayment = getCloseoutsPendingFinalPayment;
exports.deleteCloseout = deleteCloseout;
exports.exportCloseoutData = exportCloseoutData;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const closeout_types_1 = require("./types/closeout.types");
const create_construction_closeout_dto_1 = require("./dto/create-construction-closeout.dto");
Object.defineProperty(exports, "CreateConstructionCloseoutDto", { enumerable: true, get: function () { return create_construction_closeout_dto_1.CreateConstructionCloseoutDto; } });
const update_construction_closeout_dto_1 = require("./dto/update-construction-closeout.dto");
Object.defineProperty(exports, "UpdateConstructionCloseoutDto", { enumerable: true, get: function () { return update_construction_closeout_dto_1.UpdateConstructionCloseoutDto; } });
const create_punch_list_item_dto_1 = require("./dto/create-punch-list-item.dto");
Object.defineProperty(exports, "CreatePunchListItemDto", { enumerable: true, get: function () { return create_punch_list_item_dto_1.CreatePunchListItemDto; } });
const update_punch_list_item_dto_1 = require("./dto/update-punch-list-item.dto");
Object.defineProperty(exports, "UpdatePunchListItemDto", { enumerable: true, get: function () { return update_punch_list_item_dto_1.UpdatePunchListItemDto; } });
const create_closeout_document_dto_1 = require("./dto/create-closeout-document.dto");
Object.defineProperty(exports, "CreateCloseoutDocumentDto", { enumerable: true, get: function () { return create_closeout_document_dto_1.CreateCloseoutDocumentDto; } });
const update_closeout_document_dto_1 = require("./dto/update-closeout-document.dto");
Object.defineProperty(exports, "UpdateCloseoutDocumentDto", { enumerable: true, get: function () { return update_closeout_document_dto_1.UpdateCloseoutDocumentDto; } });
let ConstructionCloseout = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_closeouts',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['contractorId'] },
                { fields: ['status'] },
                { fields: ['finalCompletionDate'] },
                { fields: ['finalPaymentStatus'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _contractorId_decorators;
    let _contractorId_initializers = [];
    let _contractorId_extraInitializers = [];
    let _contractorName_decorators;
    let _contractorName_initializers = [];
    let _contractorName_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _contractValue_decorators;
    let _contractValue_initializers = [];
    let _contractValue_extraInitializers = [];
    let _retainageAmount_decorators;
    let _retainageAmount_initializers = [];
    let _retainageAmount_extraInitializers = [];
    let _retainagePercentage_decorators;
    let _retainagePercentage_initializers = [];
    let _retainagePercentage_extraInitializers = [];
    let _substantialCompletionDate_decorators;
    let _substantialCompletionDate_initializers = [];
    let _substantialCompletionDate_extraInitializers = [];
    let _finalCompletionDate_decorators;
    let _finalCompletionDate_initializers = [];
    let _finalCompletionDate_extraInitializers = [];
    let _certificateOfOccupancyDate_decorators;
    let _certificateOfOccupancyDate_initializers = [];
    let _certificateOfOccupancyDate_extraInitializers = [];
    let _warrantyStartDate_decorators;
    let _warrantyStartDate_initializers = [];
    let _warrantyStartDate_extraInitializers = [];
    let _warrantyEndDate_decorators;
    let _warrantyEndDate_initializers = [];
    let _warrantyEndDate_extraInitializers = [];
    let _warrantyPeriodMonths_decorators;
    let _warrantyPeriodMonths_initializers = [];
    let _warrantyPeriodMonths_extraInitializers = [];
    let _completionPercentage_decorators;
    let _completionPercentage_initializers = [];
    let _completionPercentage_extraInitializers = [];
    let _totalPunchListItems_decorators;
    let _totalPunchListItems_initializers = [];
    let _totalPunchListItems_extraInitializers = [];
    let _openPunchListItems_decorators;
    let _openPunchListItems_initializers = [];
    let _openPunchListItems_extraInitializers = [];
    let _criticalPunchListItems_decorators;
    let _criticalPunchListItems_initializers = [];
    let _criticalPunchListItems_extraInitializers = [];
    let _requiredDocumentsCount_decorators;
    let _requiredDocumentsCount_initializers = [];
    let _requiredDocumentsCount_extraInitializers = [];
    let _submittedDocumentsCount_decorators;
    let _submittedDocumentsCount_initializers = [];
    let _submittedDocumentsCount_extraInitializers = [];
    let _approvedDocumentsCount_decorators;
    let _approvedDocumentsCount_initializers = [];
    let _approvedDocumentsCount_extraInitializers = [];
    let _finalInspectionScheduled_decorators;
    let _finalInspectionScheduled_initializers = [];
    let _finalInspectionScheduled_extraInitializers = [];
    let _finalInspectionDate_decorators;
    let _finalInspectionDate_initializers = [];
    let _finalInspectionDate_extraInitializers = [];
    let _finalInspectionResult_decorators;
    let _finalInspectionResult_initializers = [];
    let _finalInspectionResult_extraInitializers = [];
    let _ownerTrainingRequired_decorators;
    let _ownerTrainingRequired_initializers = [];
    let _ownerTrainingRequired_extraInitializers = [];
    let _ownerTrainingCompleted_decorators;
    let _ownerTrainingCompleted_initializers = [];
    let _ownerTrainingCompleted_extraInitializers = [];
    let _ownerTrainingDate_decorators;
    let _ownerTrainingDate_initializers = [];
    let _ownerTrainingDate_extraInitializers = [];
    let _lienReleasesRequired_decorators;
    let _lienReleasesRequired_initializers = [];
    let _lienReleasesRequired_extraInitializers = [];
    let _lienReleasesReceived_decorators;
    let _lienReleasesReceived_initializers = [];
    let _lienReleasesReceived_extraInitializers = [];
    let _finalPaymentAmount_decorators;
    let _finalPaymentAmount_initializers = [];
    let _finalPaymentAmount_extraInitializers = [];
    let _finalPaymentStatus_decorators;
    let _finalPaymentStatus_initializers = [];
    let _finalPaymentStatus_extraInitializers = [];
    let _finalPaymentDate_decorators;
    let _finalPaymentDate_initializers = [];
    let _finalPaymentDate_extraInitializers = [];
    let _lessonsLearnedCompleted_decorators;
    let _lessonsLearnedCompleted_initializers = [];
    let _lessonsLearnedCompleted_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _punchListItems_decorators;
    let _punchListItems_initializers = [];
    let _punchListItems_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    var ConstructionCloseout = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.contractorId = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _contractorId_initializers, void 0));
            this.contractorName = (__runInitializers(this, _contractorId_extraInitializers), __runInitializers(this, _contractorName_initializers, void 0));
            this.status = (__runInitializers(this, _contractorName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.contractValue = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _contractValue_initializers, void 0));
            this.retainageAmount = (__runInitializers(this, _contractValue_extraInitializers), __runInitializers(this, _retainageAmount_initializers, void 0));
            this.retainagePercentage = (__runInitializers(this, _retainageAmount_extraInitializers), __runInitializers(this, _retainagePercentage_initializers, void 0));
            this.substantialCompletionDate = (__runInitializers(this, _retainagePercentage_extraInitializers), __runInitializers(this, _substantialCompletionDate_initializers, void 0));
            this.finalCompletionDate = (__runInitializers(this, _substantialCompletionDate_extraInitializers), __runInitializers(this, _finalCompletionDate_initializers, void 0));
            this.certificateOfOccupancyDate = (__runInitializers(this, _finalCompletionDate_extraInitializers), __runInitializers(this, _certificateOfOccupancyDate_initializers, void 0));
            this.warrantyStartDate = (__runInitializers(this, _certificateOfOccupancyDate_extraInitializers), __runInitializers(this, _warrantyStartDate_initializers, void 0));
            this.warrantyEndDate = (__runInitializers(this, _warrantyStartDate_extraInitializers), __runInitializers(this, _warrantyEndDate_initializers, void 0));
            this.warrantyPeriodMonths = (__runInitializers(this, _warrantyEndDate_extraInitializers), __runInitializers(this, _warrantyPeriodMonths_initializers, void 0));
            this.completionPercentage = (__runInitializers(this, _warrantyPeriodMonths_extraInitializers), __runInitializers(this, _completionPercentage_initializers, void 0));
            this.totalPunchListItems = (__runInitializers(this, _completionPercentage_extraInitializers), __runInitializers(this, _totalPunchListItems_initializers, void 0));
            this.openPunchListItems = (__runInitializers(this, _totalPunchListItems_extraInitializers), __runInitializers(this, _openPunchListItems_initializers, void 0));
            this.criticalPunchListItems = (__runInitializers(this, _openPunchListItems_extraInitializers), __runInitializers(this, _criticalPunchListItems_initializers, void 0));
            this.requiredDocumentsCount = (__runInitializers(this, _criticalPunchListItems_extraInitializers), __runInitializers(this, _requiredDocumentsCount_initializers, void 0));
            this.submittedDocumentsCount = (__runInitializers(this, _requiredDocumentsCount_extraInitializers), __runInitializers(this, _submittedDocumentsCount_initializers, void 0));
            this.approvedDocumentsCount = (__runInitializers(this, _submittedDocumentsCount_extraInitializers), __runInitializers(this, _approvedDocumentsCount_initializers, void 0));
            this.finalInspectionScheduled = (__runInitializers(this, _approvedDocumentsCount_extraInitializers), __runInitializers(this, _finalInspectionScheduled_initializers, void 0));
            this.finalInspectionDate = (__runInitializers(this, _finalInspectionScheduled_extraInitializers), __runInitializers(this, _finalInspectionDate_initializers, void 0));
            this.finalInspectionResult = (__runInitializers(this, _finalInspectionDate_extraInitializers), __runInitializers(this, _finalInspectionResult_initializers, void 0));
            this.ownerTrainingRequired = (__runInitializers(this, _finalInspectionResult_extraInitializers), __runInitializers(this, _ownerTrainingRequired_initializers, void 0));
            this.ownerTrainingCompleted = (__runInitializers(this, _ownerTrainingRequired_extraInitializers), __runInitializers(this, _ownerTrainingCompleted_initializers, void 0));
            this.ownerTrainingDate = (__runInitializers(this, _ownerTrainingCompleted_extraInitializers), __runInitializers(this, _ownerTrainingDate_initializers, void 0));
            this.lienReleasesRequired = (__runInitializers(this, _ownerTrainingDate_extraInitializers), __runInitializers(this, _lienReleasesRequired_initializers, void 0));
            this.lienReleasesReceived = (__runInitializers(this, _lienReleasesRequired_extraInitializers), __runInitializers(this, _lienReleasesReceived_initializers, void 0));
            this.finalPaymentAmount = (__runInitializers(this, _lienReleasesReceived_extraInitializers), __runInitializers(this, _finalPaymentAmount_initializers, void 0));
            this.finalPaymentStatus = (__runInitializers(this, _finalPaymentAmount_extraInitializers), __runInitializers(this, _finalPaymentStatus_initializers, void 0));
            this.finalPaymentDate = (__runInitializers(this, _finalPaymentStatus_extraInitializers), __runInitializers(this, _finalPaymentDate_initializers, void 0));
            this.lessonsLearnedCompleted = (__runInitializers(this, _finalPaymentDate_extraInitializers), __runInitializers(this, _lessonsLearnedCompleted_initializers, void 0));
            this.notes = (__runInitializers(this, _lessonsLearnedCompleted_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            // Associations
            this.punchListItems = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _punchListItems_initializers, void 0));
            this.documents = (__runInitializers(this, _punchListItems_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            __runInitializers(this, _documents_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionCloseout");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _contractorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contractor ID' }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contractor name' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _status_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.CloseoutStatus, description: 'Closeout status' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(closeout_types_1.CloseoutStatus.INITIATED), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.CloseoutStatus)))];
        _contractValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract value in cents' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _retainageAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retainage amount in cents' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _retainagePercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retainage percentage (0-100)' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(10), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _substantialCompletionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Substantial completion date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _finalCompletionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Final completion date' }), (0, sequelize_typescript_1.AllowNull)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _certificateOfOccupancyDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Certificate of occupancy date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _warrantyStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Warranty start date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _warrantyEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Warranty end date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _warrantyPeriodMonths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty period in months' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _completionPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion percentage (0-100)' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _totalPunchListItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total punch list items' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _openPunchListItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Open punch list items' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _criticalPunchListItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Critical punch list items' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _requiredDocumentsCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required documents count' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _submittedDocumentsCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Submitted documents count' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _approvedDocumentsCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved documents count' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _finalInspectionScheduled_decorators = [(0, swagger_1.ApiProperty)({ description: 'Final inspection scheduled' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _finalInspectionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Final inspection date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _finalInspectionResult_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.InspectionResult, description: 'Final inspection result' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.InspectionResult)))];
        _ownerTrainingRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner training required' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _ownerTrainingCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner training completed' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _ownerTrainingDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Owner training date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _lienReleasesRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lien releases required' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _lienReleasesReceived_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lien releases received' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _finalPaymentAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Final payment amount in cents' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _finalPaymentStatus_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PaymentStatus, description: 'Final payment status' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(closeout_types_1.PaymentStatus.PENDING), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.PaymentStatus)))];
        _finalPaymentDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Final payment date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _lessonsLearnedCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lessons learned completed' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Deletion timestamp' }), sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _punchListItems_decorators = [(0, sequelize_typescript_1.HasMany)(() => PunchListItem, 'closeoutId')];
        _documents_decorators = [(0, sequelize_typescript_1.HasMany)(() => CloseoutDocument, 'closeoutId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
        __esDecorate(null, null, _contractorId_decorators, { kind: "field", name: "contractorId", static: false, private: false, access: { has: obj => "contractorId" in obj, get: obj => obj.contractorId, set: (obj, value) => { obj.contractorId = value; } }, metadata: _metadata }, _contractorId_initializers, _contractorId_extraInitializers);
        __esDecorate(null, null, _contractorName_decorators, { kind: "field", name: "contractorName", static: false, private: false, access: { has: obj => "contractorName" in obj, get: obj => obj.contractorName, set: (obj, value) => { obj.contractorName = value; } }, metadata: _metadata }, _contractorName_initializers, _contractorName_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _contractValue_decorators, { kind: "field", name: "contractValue", static: false, private: false, access: { has: obj => "contractValue" in obj, get: obj => obj.contractValue, set: (obj, value) => { obj.contractValue = value; } }, metadata: _metadata }, _contractValue_initializers, _contractValue_extraInitializers);
        __esDecorate(null, null, _retainageAmount_decorators, { kind: "field", name: "retainageAmount", static: false, private: false, access: { has: obj => "retainageAmount" in obj, get: obj => obj.retainageAmount, set: (obj, value) => { obj.retainageAmount = value; } }, metadata: _metadata }, _retainageAmount_initializers, _retainageAmount_extraInitializers);
        __esDecorate(null, null, _retainagePercentage_decorators, { kind: "field", name: "retainagePercentage", static: false, private: false, access: { has: obj => "retainagePercentage" in obj, get: obj => obj.retainagePercentage, set: (obj, value) => { obj.retainagePercentage = value; } }, metadata: _metadata }, _retainagePercentage_initializers, _retainagePercentage_extraInitializers);
        __esDecorate(null, null, _substantialCompletionDate_decorators, { kind: "field", name: "substantialCompletionDate", static: false, private: false, access: { has: obj => "substantialCompletionDate" in obj, get: obj => obj.substantialCompletionDate, set: (obj, value) => { obj.substantialCompletionDate = value; } }, metadata: _metadata }, _substantialCompletionDate_initializers, _substantialCompletionDate_extraInitializers);
        __esDecorate(null, null, _finalCompletionDate_decorators, { kind: "field", name: "finalCompletionDate", static: false, private: false, access: { has: obj => "finalCompletionDate" in obj, get: obj => obj.finalCompletionDate, set: (obj, value) => { obj.finalCompletionDate = value; } }, metadata: _metadata }, _finalCompletionDate_initializers, _finalCompletionDate_extraInitializers);
        __esDecorate(null, null, _certificateOfOccupancyDate_decorators, { kind: "field", name: "certificateOfOccupancyDate", static: false, private: false, access: { has: obj => "certificateOfOccupancyDate" in obj, get: obj => obj.certificateOfOccupancyDate, set: (obj, value) => { obj.certificateOfOccupancyDate = value; } }, metadata: _metadata }, _certificateOfOccupancyDate_initializers, _certificateOfOccupancyDate_extraInitializers);
        __esDecorate(null, null, _warrantyStartDate_decorators, { kind: "field", name: "warrantyStartDate", static: false, private: false, access: { has: obj => "warrantyStartDate" in obj, get: obj => obj.warrantyStartDate, set: (obj, value) => { obj.warrantyStartDate = value; } }, metadata: _metadata }, _warrantyStartDate_initializers, _warrantyStartDate_extraInitializers);
        __esDecorate(null, null, _warrantyEndDate_decorators, { kind: "field", name: "warrantyEndDate", static: false, private: false, access: { has: obj => "warrantyEndDate" in obj, get: obj => obj.warrantyEndDate, set: (obj, value) => { obj.warrantyEndDate = value; } }, metadata: _metadata }, _warrantyEndDate_initializers, _warrantyEndDate_extraInitializers);
        __esDecorate(null, null, _warrantyPeriodMonths_decorators, { kind: "field", name: "warrantyPeriodMonths", static: false, private: false, access: { has: obj => "warrantyPeriodMonths" in obj, get: obj => obj.warrantyPeriodMonths, set: (obj, value) => { obj.warrantyPeriodMonths = value; } }, metadata: _metadata }, _warrantyPeriodMonths_initializers, _warrantyPeriodMonths_extraInitializers);
        __esDecorate(null, null, _completionPercentage_decorators, { kind: "field", name: "completionPercentage", static: false, private: false, access: { has: obj => "completionPercentage" in obj, get: obj => obj.completionPercentage, set: (obj, value) => { obj.completionPercentage = value; } }, metadata: _metadata }, _completionPercentage_initializers, _completionPercentage_extraInitializers);
        __esDecorate(null, null, _totalPunchListItems_decorators, { kind: "field", name: "totalPunchListItems", static: false, private: false, access: { has: obj => "totalPunchListItems" in obj, get: obj => obj.totalPunchListItems, set: (obj, value) => { obj.totalPunchListItems = value; } }, metadata: _metadata }, _totalPunchListItems_initializers, _totalPunchListItems_extraInitializers);
        __esDecorate(null, null, _openPunchListItems_decorators, { kind: "field", name: "openPunchListItems", static: false, private: false, access: { has: obj => "openPunchListItems" in obj, get: obj => obj.openPunchListItems, set: (obj, value) => { obj.openPunchListItems = value; } }, metadata: _metadata }, _openPunchListItems_initializers, _openPunchListItems_extraInitializers);
        __esDecorate(null, null, _criticalPunchListItems_decorators, { kind: "field", name: "criticalPunchListItems", static: false, private: false, access: { has: obj => "criticalPunchListItems" in obj, get: obj => obj.criticalPunchListItems, set: (obj, value) => { obj.criticalPunchListItems = value; } }, metadata: _metadata }, _criticalPunchListItems_initializers, _criticalPunchListItems_extraInitializers);
        __esDecorate(null, null, _requiredDocumentsCount_decorators, { kind: "field", name: "requiredDocumentsCount", static: false, private: false, access: { has: obj => "requiredDocumentsCount" in obj, get: obj => obj.requiredDocumentsCount, set: (obj, value) => { obj.requiredDocumentsCount = value; } }, metadata: _metadata }, _requiredDocumentsCount_initializers, _requiredDocumentsCount_extraInitializers);
        __esDecorate(null, null, _submittedDocumentsCount_decorators, { kind: "field", name: "submittedDocumentsCount", static: false, private: false, access: { has: obj => "submittedDocumentsCount" in obj, get: obj => obj.submittedDocumentsCount, set: (obj, value) => { obj.submittedDocumentsCount = value; } }, metadata: _metadata }, _submittedDocumentsCount_initializers, _submittedDocumentsCount_extraInitializers);
        __esDecorate(null, null, _approvedDocumentsCount_decorators, { kind: "field", name: "approvedDocumentsCount", static: false, private: false, access: { has: obj => "approvedDocumentsCount" in obj, get: obj => obj.approvedDocumentsCount, set: (obj, value) => { obj.approvedDocumentsCount = value; } }, metadata: _metadata }, _approvedDocumentsCount_initializers, _approvedDocumentsCount_extraInitializers);
        __esDecorate(null, null, _finalInspectionScheduled_decorators, { kind: "field", name: "finalInspectionScheduled", static: false, private: false, access: { has: obj => "finalInspectionScheduled" in obj, get: obj => obj.finalInspectionScheduled, set: (obj, value) => { obj.finalInspectionScheduled = value; } }, metadata: _metadata }, _finalInspectionScheduled_initializers, _finalInspectionScheduled_extraInitializers);
        __esDecorate(null, null, _finalInspectionDate_decorators, { kind: "field", name: "finalInspectionDate", static: false, private: false, access: { has: obj => "finalInspectionDate" in obj, get: obj => obj.finalInspectionDate, set: (obj, value) => { obj.finalInspectionDate = value; } }, metadata: _metadata }, _finalInspectionDate_initializers, _finalInspectionDate_extraInitializers);
        __esDecorate(null, null, _finalInspectionResult_decorators, { kind: "field", name: "finalInspectionResult", static: false, private: false, access: { has: obj => "finalInspectionResult" in obj, get: obj => obj.finalInspectionResult, set: (obj, value) => { obj.finalInspectionResult = value; } }, metadata: _metadata }, _finalInspectionResult_initializers, _finalInspectionResult_extraInitializers);
        __esDecorate(null, null, _ownerTrainingRequired_decorators, { kind: "field", name: "ownerTrainingRequired", static: false, private: false, access: { has: obj => "ownerTrainingRequired" in obj, get: obj => obj.ownerTrainingRequired, set: (obj, value) => { obj.ownerTrainingRequired = value; } }, metadata: _metadata }, _ownerTrainingRequired_initializers, _ownerTrainingRequired_extraInitializers);
        __esDecorate(null, null, _ownerTrainingCompleted_decorators, { kind: "field", name: "ownerTrainingCompleted", static: false, private: false, access: { has: obj => "ownerTrainingCompleted" in obj, get: obj => obj.ownerTrainingCompleted, set: (obj, value) => { obj.ownerTrainingCompleted = value; } }, metadata: _metadata }, _ownerTrainingCompleted_initializers, _ownerTrainingCompleted_extraInitializers);
        __esDecorate(null, null, _ownerTrainingDate_decorators, { kind: "field", name: "ownerTrainingDate", static: false, private: false, access: { has: obj => "ownerTrainingDate" in obj, get: obj => obj.ownerTrainingDate, set: (obj, value) => { obj.ownerTrainingDate = value; } }, metadata: _metadata }, _ownerTrainingDate_initializers, _ownerTrainingDate_extraInitializers);
        __esDecorate(null, null, _lienReleasesRequired_decorators, { kind: "field", name: "lienReleasesRequired", static: false, private: false, access: { has: obj => "lienReleasesRequired" in obj, get: obj => obj.lienReleasesRequired, set: (obj, value) => { obj.lienReleasesRequired = value; } }, metadata: _metadata }, _lienReleasesRequired_initializers, _lienReleasesRequired_extraInitializers);
        __esDecorate(null, null, _lienReleasesReceived_decorators, { kind: "field", name: "lienReleasesReceived", static: false, private: false, access: { has: obj => "lienReleasesReceived" in obj, get: obj => obj.lienReleasesReceived, set: (obj, value) => { obj.lienReleasesReceived = value; } }, metadata: _metadata }, _lienReleasesReceived_initializers, _lienReleasesReceived_extraInitializers);
        __esDecorate(null, null, _finalPaymentAmount_decorators, { kind: "field", name: "finalPaymentAmount", static: false, private: false, access: { has: obj => "finalPaymentAmount" in obj, get: obj => obj.finalPaymentAmount, set: (obj, value) => { obj.finalPaymentAmount = value; } }, metadata: _metadata }, _finalPaymentAmount_initializers, _finalPaymentAmount_extraInitializers);
        __esDecorate(null, null, _finalPaymentStatus_decorators, { kind: "field", name: "finalPaymentStatus", static: false, private: false, access: { has: obj => "finalPaymentStatus" in obj, get: obj => obj.finalPaymentStatus, set: (obj, value) => { obj.finalPaymentStatus = value; } }, metadata: _metadata }, _finalPaymentStatus_initializers, _finalPaymentStatus_extraInitializers);
        __esDecorate(null, null, _finalPaymentDate_decorators, { kind: "field", name: "finalPaymentDate", static: false, private: false, access: { has: obj => "finalPaymentDate" in obj, get: obj => obj.finalPaymentDate, set: (obj, value) => { obj.finalPaymentDate = value; } }, metadata: _metadata }, _finalPaymentDate_initializers, _finalPaymentDate_extraInitializers);
        __esDecorate(null, null, _lessonsLearnedCompleted_decorators, { kind: "field", name: "lessonsLearnedCompleted", static: false, private: false, access: { has: obj => "lessonsLearnedCompleted" in obj, get: obj => obj.lessonsLearnedCompleted, set: (obj, value) => { obj.lessonsLearnedCompleted = value; } }, metadata: _metadata }, _lessonsLearnedCompleted_initializers, _lessonsLearnedCompleted_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _punchListItems_decorators, { kind: "field", name: "punchListItems", static: false, private: false, access: { has: obj => "punchListItems" in obj, get: obj => obj.punchListItems, set: (obj, value) => { obj.punchListItems = value; } }, metadata: _metadata }, _punchListItems_initializers, _punchListItems_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionCloseout = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionCloseout = _classThis;
})();
exports.ConstructionCloseout = ConstructionCloseout;
let PunchListItem = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'punch_list_items',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['closeoutId'] },
                { fields: ['itemNumber'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['category'] },
                { fields: ['assignedToId'] },
                { fields: ['dueDate'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _closeoutId_decorators;
    let _closeoutId_initializers = [];
    let _closeoutId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _reportedById_decorators;
    let _reportedById_initializers = [];
    let _reportedById_extraInitializers = [];
    let _reportedByName_decorators;
    let _reportedByName_initializers = [];
    let _reportedByName_extraInitializers = [];
    let _reportedDate_decorators;
    let _reportedDate_initializers = [];
    let _reportedDate_extraInitializers = [];
    let _reviewedById_decorators;
    let _reviewedById_initializers = [];
    let _reviewedById_extraInitializers = [];
    let _reviewedByName_decorators;
    let _reviewedByName_initializers = [];
    let _reviewedByName_extraInitializers = [];
    let _reviewedDate_decorators;
    let _reviewedDate_initializers = [];
    let _reviewedDate_extraInitializers = [];
    let _approvedById_decorators;
    let _approvedById_initializers = [];
    let _approvedById_extraInitializers = [];
    let _approvedByName_decorators;
    let _approvedByName_initializers = [];
    let _approvedByName_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _attachmentUrls_decorators;
    let _attachmentUrls_initializers = [];
    let _attachmentUrls_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _requiresReinspection_decorators;
    let _requiresReinspection_initializers = [];
    let _requiresReinspection_extraInitializers = [];
    let _reinspectionDate_decorators;
    let _reinspectionDate_initializers = [];
    let _reinspectionDate_extraInitializers = [];
    let _contractorResponsible_decorators;
    let _contractorResponsible_initializers = [];
    let _contractorResponsible_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _closeout_decorators;
    let _closeout_initializers = [];
    let _closeout_extraInitializers = [];
    var PunchListItem = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.closeoutId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _closeoutId_initializers, void 0));
            this.itemNumber = (__runInitializers(this, _closeoutId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
            this.title = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.location = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.category = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedToId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
            this.assignedToName = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.estimatedHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
            this.actualHours = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.reportedById = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _reportedById_initializers, void 0));
            this.reportedByName = (__runInitializers(this, _reportedById_extraInitializers), __runInitializers(this, _reportedByName_initializers, void 0));
            this.reportedDate = (__runInitializers(this, _reportedByName_extraInitializers), __runInitializers(this, _reportedDate_initializers, void 0));
            this.reviewedById = (__runInitializers(this, _reportedDate_extraInitializers), __runInitializers(this, _reviewedById_initializers, void 0));
            this.reviewedByName = (__runInitializers(this, _reviewedById_extraInitializers), __runInitializers(this, _reviewedByName_initializers, void 0));
            this.reviewedDate = (__runInitializers(this, _reviewedByName_extraInitializers), __runInitializers(this, _reviewedDate_initializers, void 0));
            this.approvedById = (__runInitializers(this, _reviewedDate_extraInitializers), __runInitializers(this, _approvedById_initializers, void 0));
            this.approvedByName = (__runInitializers(this, _approvedById_extraInitializers), __runInitializers(this, _approvedByName_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedByName_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.closedDate = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.photoUrls = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
            this.attachmentUrls = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _attachmentUrls_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _attachmentUrls_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.requiresReinspection = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _requiresReinspection_initializers, void 0));
            this.reinspectionDate = (__runInitializers(this, _requiresReinspection_extraInitializers), __runInitializers(this, _reinspectionDate_initializers, void 0));
            this.contractorResponsible = (__runInitializers(this, _reinspectionDate_extraInitializers), __runInitializers(this, _contractorResponsible_initializers, void 0));
            this.tags = (__runInitializers(this, _contractorResponsible_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            // Associations
            this.closeout = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _closeout_initializers, void 0));
            __runInitializers(this, _closeout_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PunchListItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _closeoutId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Construction closeout ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConstructionCloseout), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _itemNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item number' }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item title' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed description' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location in building' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _category_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemCategory, description: 'Item category' }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.PunchListItemCategory)))];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemPriority, description: 'Item priority' }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.PunchListItemPriority)))];
        _status_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemStatus, description: 'Item status' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(closeout_types_1.PunchListItemStatus.OPEN), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.PunchListItemStatus)))];
        _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assigned user ID' }), (0, sequelize_typescript_1.AllowNull)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _assignedToName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assigned user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _assignedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assignment date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Due date' }), (0, sequelize_typescript_1.AllowNull)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated hours to complete' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _actualHours_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Actual hours spent' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _estimatedCost_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated cost in cents' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _actualCost_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Actual cost in cents' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _reportedById_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported by user ID' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reportedByName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported by user name' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _reportedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported date' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reviewed by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reviewedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reviewed by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _reviewedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Review date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _approvedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Approved by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _approvedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Approval date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Completion date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Closed date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _photoUrls_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Photo URLs', type: [String] }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _attachmentUrls_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Attachment URLs', type: [String] }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Rejection reason if rejected' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _resolutionNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Resolution notes' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _requiresReinspection_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requires reinspection' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _reinspectionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reinspection date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _contractorResponsible_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contractor responsible' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tags for categorization', type: [String] }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Deletion timestamp' }), sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closeout_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConstructionCloseout, 'closeoutId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _closeoutId_decorators, { kind: "field", name: "closeoutId", static: false, private: false, access: { has: obj => "closeoutId" in obj, get: obj => obj.closeoutId, set: (obj, value) => { obj.closeoutId = value; } }, metadata: _metadata }, _closeoutId_initializers, _closeoutId_extraInitializers);
        __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
        __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
        __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _reportedById_decorators, { kind: "field", name: "reportedById", static: false, private: false, access: { has: obj => "reportedById" in obj, get: obj => obj.reportedById, set: (obj, value) => { obj.reportedById = value; } }, metadata: _metadata }, _reportedById_initializers, _reportedById_extraInitializers);
        __esDecorate(null, null, _reportedByName_decorators, { kind: "field", name: "reportedByName", static: false, private: false, access: { has: obj => "reportedByName" in obj, get: obj => obj.reportedByName, set: (obj, value) => { obj.reportedByName = value; } }, metadata: _metadata }, _reportedByName_initializers, _reportedByName_extraInitializers);
        __esDecorate(null, null, _reportedDate_decorators, { kind: "field", name: "reportedDate", static: false, private: false, access: { has: obj => "reportedDate" in obj, get: obj => obj.reportedDate, set: (obj, value) => { obj.reportedDate = value; } }, metadata: _metadata }, _reportedDate_initializers, _reportedDate_extraInitializers);
        __esDecorate(null, null, _reviewedById_decorators, { kind: "field", name: "reviewedById", static: false, private: false, access: { has: obj => "reviewedById" in obj, get: obj => obj.reviewedById, set: (obj, value) => { obj.reviewedById = value; } }, metadata: _metadata }, _reviewedById_initializers, _reviewedById_extraInitializers);
        __esDecorate(null, null, _reviewedByName_decorators, { kind: "field", name: "reviewedByName", static: false, private: false, access: { has: obj => "reviewedByName" in obj, get: obj => obj.reviewedByName, set: (obj, value) => { obj.reviewedByName = value; } }, metadata: _metadata }, _reviewedByName_initializers, _reviewedByName_extraInitializers);
        __esDecorate(null, null, _reviewedDate_decorators, { kind: "field", name: "reviewedDate", static: false, private: false, access: { has: obj => "reviewedDate" in obj, get: obj => obj.reviewedDate, set: (obj, value) => { obj.reviewedDate = value; } }, metadata: _metadata }, _reviewedDate_initializers, _reviewedDate_extraInitializers);
        __esDecorate(null, null, _approvedById_decorators, { kind: "field", name: "approvedById", static: false, private: false, access: { has: obj => "approvedById" in obj, get: obj => obj.approvedById, set: (obj, value) => { obj.approvedById = value; } }, metadata: _metadata }, _approvedById_initializers, _approvedById_extraInitializers);
        __esDecorate(null, null, _approvedByName_decorators, { kind: "field", name: "approvedByName", static: false, private: false, access: { has: obj => "approvedByName" in obj, get: obj => obj.approvedByName, set: (obj, value) => { obj.approvedByName = value; } }, metadata: _metadata }, _approvedByName_initializers, _approvedByName_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
        __esDecorate(null, null, _attachmentUrls_decorators, { kind: "field", name: "attachmentUrls", static: false, private: false, access: { has: obj => "attachmentUrls" in obj, get: obj => obj.attachmentUrls, set: (obj, value) => { obj.attachmentUrls = value; } }, metadata: _metadata }, _attachmentUrls_initializers, _attachmentUrls_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _requiresReinspection_decorators, { kind: "field", name: "requiresReinspection", static: false, private: false, access: { has: obj => "requiresReinspection" in obj, get: obj => obj.requiresReinspection, set: (obj, value) => { obj.requiresReinspection = value; } }, metadata: _metadata }, _requiresReinspection_initializers, _requiresReinspection_extraInitializers);
        __esDecorate(null, null, _reinspectionDate_decorators, { kind: "field", name: "reinspectionDate", static: false, private: false, access: { has: obj => "reinspectionDate" in obj, get: obj => obj.reinspectionDate, set: (obj, value) => { obj.reinspectionDate = value; } }, metadata: _metadata }, _reinspectionDate_initializers, _reinspectionDate_extraInitializers);
        __esDecorate(null, null, _contractorResponsible_decorators, { kind: "field", name: "contractorResponsible", static: false, private: false, access: { has: obj => "contractorResponsible" in obj, get: obj => obj.contractorResponsible, set: (obj, value) => { obj.contractorResponsible = value; } }, metadata: _metadata }, _contractorResponsible_initializers, _contractorResponsible_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _closeout_decorators, { kind: "field", name: "closeout", static: false, private: false, access: { has: obj => "closeout" in obj, get: obj => obj.closeout, set: (obj, value) => { obj.closeout = value; } }, metadata: _metadata }, _closeout_initializers, _closeout_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PunchListItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PunchListItem = _classThis;
})();
exports.PunchListItem = PunchListItem;
let CloseoutDocument = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'closeout_documents',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['closeoutId'] },
                { fields: ['documentType'] },
                { fields: ['status'] },
                { fields: ['required'] },
                { fields: ['submittedDate'] },
                { fields: ['approvedDate'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _closeoutId_decorators;
    let _closeoutId_initializers = [];
    let _closeoutId_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _mimeType_decorators;
    let _mimeType_initializers = [];
    let _mimeType_extraInitializers = [];
    let _uploadedById_decorators;
    let _uploadedById_initializers = [];
    let _uploadedById_extraInitializers = [];
    let _uploadedByName_decorators;
    let _uploadedByName_initializers = [];
    let _uploadedByName_extraInitializers = [];
    let _uploadedDate_decorators;
    let _uploadedDate_initializers = [];
    let _uploadedDate_extraInitializers = [];
    let _submittedById_decorators;
    let _submittedById_initializers = [];
    let _submittedById_extraInitializers = [];
    let _submittedByName_decorators;
    let _submittedByName_initializers = [];
    let _submittedByName_extraInitializers = [];
    let _submittedDate_decorators;
    let _submittedDate_initializers = [];
    let _submittedDate_extraInitializers = [];
    let _reviewedById_decorators;
    let _reviewedById_initializers = [];
    let _reviewedById_extraInitializers = [];
    let _reviewedByName_decorators;
    let _reviewedByName_initializers = [];
    let _reviewedByName_extraInitializers = [];
    let _reviewedDate_decorators;
    let _reviewedDate_initializers = [];
    let _reviewedDate_extraInitializers = [];
    let _approvedById_decorators;
    let _approvedById_initializers = [];
    let _approvedById_extraInitializers = [];
    let _approvedByName_decorators;
    let _approvedByName_initializers = [];
    let _approvedByName_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _deliveredDate_decorators;
    let _deliveredDate_initializers = [];
    let _deliveredDate_extraInitializers = [];
    let _acknowledgedById_decorators;
    let _acknowledgedById_initializers = [];
    let _acknowledgedById_extraInitializers = [];
    let _acknowledgedByName_decorators;
    let _acknowledgedByName_initializers = [];
    let _acknowledgedByName_extraInitializers = [];
    let _acknowledgedDate_decorators;
    let _acknowledgedDate_initializers = [];
    let _acknowledgedDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _reviewComments_decorators;
    let _reviewComments_initializers = [];
    let _reviewComments_extraInitializers = [];
    let _relatedEquipment_decorators;
    let _relatedEquipment_initializers = [];
    let _relatedEquipment_extraInitializers = [];
    let _relatedSystem_decorators;
    let _relatedSystem_initializers = [];
    let _relatedSystem_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _modelNumber_decorators;
    let _modelNumber_initializers = [];
    let _modelNumber_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _warrantyStartDate_decorators;
    let _warrantyStartDate_initializers = [];
    let _warrantyStartDate_extraInitializers = [];
    let _warrantyEndDate_decorators;
    let _warrantyEndDate_initializers = [];
    let _warrantyEndDate_extraInitializers = [];
    let _trainingTopic_decorators;
    let _trainingTopic_initializers = [];
    let _trainingTopic_extraInitializers = [];
    let _trainingDuration_decorators;
    let _trainingDuration_initializers = [];
    let _trainingDuration_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _closeout_decorators;
    let _closeout_initializers = [];
    let _closeout_extraInitializers = [];
    var CloseoutDocument = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.closeoutId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _closeoutId_initializers, void 0));
            this.documentType = (__runInitializers(this, _closeoutId_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.title = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.documentNumber = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
            this.version = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.status = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.required = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _required_initializers, void 0));
            this.fileUrl = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
            this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            this.fileSize = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.mimeType = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
            this.uploadedById = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _uploadedById_initializers, void 0));
            this.uploadedByName = (__runInitializers(this, _uploadedById_extraInitializers), __runInitializers(this, _uploadedByName_initializers, void 0));
            this.uploadedDate = (__runInitializers(this, _uploadedByName_extraInitializers), __runInitializers(this, _uploadedDate_initializers, void 0));
            this.submittedById = (__runInitializers(this, _uploadedDate_extraInitializers), __runInitializers(this, _submittedById_initializers, void 0));
            this.submittedByName = (__runInitializers(this, _submittedById_extraInitializers), __runInitializers(this, _submittedByName_initializers, void 0));
            this.submittedDate = (__runInitializers(this, _submittedByName_extraInitializers), __runInitializers(this, _submittedDate_initializers, void 0));
            this.reviewedById = (__runInitializers(this, _submittedDate_extraInitializers), __runInitializers(this, _reviewedById_initializers, void 0));
            this.reviewedByName = (__runInitializers(this, _reviewedById_extraInitializers), __runInitializers(this, _reviewedByName_initializers, void 0));
            this.reviewedDate = (__runInitializers(this, _reviewedByName_extraInitializers), __runInitializers(this, _reviewedDate_initializers, void 0));
            this.approvedById = (__runInitializers(this, _reviewedDate_extraInitializers), __runInitializers(this, _approvedById_initializers, void 0));
            this.approvedByName = (__runInitializers(this, _approvedById_extraInitializers), __runInitializers(this, _approvedByName_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedByName_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.deliveredDate = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _deliveredDate_initializers, void 0));
            this.acknowledgedById = (__runInitializers(this, _deliveredDate_extraInitializers), __runInitializers(this, _acknowledgedById_initializers, void 0));
            this.acknowledgedByName = (__runInitializers(this, _acknowledgedById_extraInitializers), __runInitializers(this, _acknowledgedByName_initializers, void 0));
            this.acknowledgedDate = (__runInitializers(this, _acknowledgedByName_extraInitializers), __runInitializers(this, _acknowledgedDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _acknowledgedDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.reviewComments = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _reviewComments_initializers, void 0));
            this.relatedEquipment = (__runInitializers(this, _reviewComments_extraInitializers), __runInitializers(this, _relatedEquipment_initializers, void 0));
            this.relatedSystem = (__runInitializers(this, _relatedEquipment_extraInitializers), __runInitializers(this, _relatedSystem_initializers, void 0));
            this.manufacturer = (__runInitializers(this, _relatedSystem_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
            this.modelNumber = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _modelNumber_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _modelNumber_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.warrantyStartDate = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _warrantyStartDate_initializers, void 0));
            this.warrantyEndDate = (__runInitializers(this, _warrantyStartDate_extraInitializers), __runInitializers(this, _warrantyEndDate_initializers, void 0));
            this.trainingTopic = (__runInitializers(this, _warrantyEndDate_extraInitializers), __runInitializers(this, _trainingTopic_initializers, void 0));
            this.trainingDuration = (__runInitializers(this, _trainingTopic_extraInitializers), __runInitializers(this, _trainingDuration_initializers, void 0));
            this.tags = (__runInitializers(this, _trainingDuration_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            // Associations
            this.closeout = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _closeout_initializers, void 0));
            __runInitializers(this, _closeout_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CloseoutDocument");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _closeoutId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Construction closeout ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConstructionCloseout), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _documentType_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.CloseoutDocumentType, description: 'Document type' }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.CloseoutDocumentType)))];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document title' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Document description' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _documentNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Document number' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document version' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('1.0'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _status_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.DocumentStatus, description: 'Document status' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(closeout_types_1.DocumentStatus.PENDING), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(closeout_types_1.DocumentStatus)))];
        _required_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document required for closeout' }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _fileUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'File URL' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _fileName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'File name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _fileSize_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'File size in bytes' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _mimeType_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'MIME type' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _uploadedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Uploaded by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _uploadedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Uploaded by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _uploadedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Upload date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _submittedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Submitted by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _submittedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Submitted by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _submittedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Submission date' }), (0, sequelize_typescript_1.AllowNull)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reviewed by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reviewedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reviewed by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _reviewedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Review date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _approvedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Approved by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _approvedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Approval date' }), (0, sequelize_typescript_1.AllowNull)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deliveredDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Delivery date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _acknowledgedById_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Acknowledged by user ID' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _acknowledgedByName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Acknowledged by user name' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _acknowledgedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Acknowledgment date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date (for warranties, certifications)' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Rejection reason if rejected' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _reviewComments_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Review comments' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _relatedEquipment_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Related equipment' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _relatedSystem_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Related system' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _manufacturer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Manufacturer (for warranties)' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _modelNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Model number' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _serialNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Serial number' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _warrantyStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Warranty start date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _warrantyEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Warranty end date' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _trainingTopic_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Training topic (for training materials)' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _trainingDuration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Training duration in minutes' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tags for categorization', type: [String] }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.AllowNull)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Deletion timestamp' }), sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closeout_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConstructionCloseout, 'closeoutId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _closeoutId_decorators, { kind: "field", name: "closeoutId", static: false, private: false, access: { has: obj => "closeoutId" in obj, get: obj => obj.closeoutId, set: (obj, value) => { obj.closeoutId = value; } }, metadata: _metadata }, _closeoutId_initializers, _closeoutId_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
        __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: obj => "mimeType" in obj, get: obj => obj.mimeType, set: (obj, value) => { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
        __esDecorate(null, null, _uploadedById_decorators, { kind: "field", name: "uploadedById", static: false, private: false, access: { has: obj => "uploadedById" in obj, get: obj => obj.uploadedById, set: (obj, value) => { obj.uploadedById = value; } }, metadata: _metadata }, _uploadedById_initializers, _uploadedById_extraInitializers);
        __esDecorate(null, null, _uploadedByName_decorators, { kind: "field", name: "uploadedByName", static: false, private: false, access: { has: obj => "uploadedByName" in obj, get: obj => obj.uploadedByName, set: (obj, value) => { obj.uploadedByName = value; } }, metadata: _metadata }, _uploadedByName_initializers, _uploadedByName_extraInitializers);
        __esDecorate(null, null, _uploadedDate_decorators, { kind: "field", name: "uploadedDate", static: false, private: false, access: { has: obj => "uploadedDate" in obj, get: obj => obj.uploadedDate, set: (obj, value) => { obj.uploadedDate = value; } }, metadata: _metadata }, _uploadedDate_initializers, _uploadedDate_extraInitializers);
        __esDecorate(null, null, _submittedById_decorators, { kind: "field", name: "submittedById", static: false, private: false, access: { has: obj => "submittedById" in obj, get: obj => obj.submittedById, set: (obj, value) => { obj.submittedById = value; } }, metadata: _metadata }, _submittedById_initializers, _submittedById_extraInitializers);
        __esDecorate(null, null, _submittedByName_decorators, { kind: "field", name: "submittedByName", static: false, private: false, access: { has: obj => "submittedByName" in obj, get: obj => obj.submittedByName, set: (obj, value) => { obj.submittedByName = value; } }, metadata: _metadata }, _submittedByName_initializers, _submittedByName_extraInitializers);
        __esDecorate(null, null, _submittedDate_decorators, { kind: "field", name: "submittedDate", static: false, private: false, access: { has: obj => "submittedDate" in obj, get: obj => obj.submittedDate, set: (obj, value) => { obj.submittedDate = value; } }, metadata: _metadata }, _submittedDate_initializers, _submittedDate_extraInitializers);
        __esDecorate(null, null, _reviewedById_decorators, { kind: "field", name: "reviewedById", static: false, private: false, access: { has: obj => "reviewedById" in obj, get: obj => obj.reviewedById, set: (obj, value) => { obj.reviewedById = value; } }, metadata: _metadata }, _reviewedById_initializers, _reviewedById_extraInitializers);
        __esDecorate(null, null, _reviewedByName_decorators, { kind: "field", name: "reviewedByName", static: false, private: false, access: { has: obj => "reviewedByName" in obj, get: obj => obj.reviewedByName, set: (obj, value) => { obj.reviewedByName = value; } }, metadata: _metadata }, _reviewedByName_initializers, _reviewedByName_extraInitializers);
        __esDecorate(null, null, _reviewedDate_decorators, { kind: "field", name: "reviewedDate", static: false, private: false, access: { has: obj => "reviewedDate" in obj, get: obj => obj.reviewedDate, set: (obj, value) => { obj.reviewedDate = value; } }, metadata: _metadata }, _reviewedDate_initializers, _reviewedDate_extraInitializers);
        __esDecorate(null, null, _approvedById_decorators, { kind: "field", name: "approvedById", static: false, private: false, access: { has: obj => "approvedById" in obj, get: obj => obj.approvedById, set: (obj, value) => { obj.approvedById = value; } }, metadata: _metadata }, _approvedById_initializers, _approvedById_extraInitializers);
        __esDecorate(null, null, _approvedByName_decorators, { kind: "field", name: "approvedByName", static: false, private: false, access: { has: obj => "approvedByName" in obj, get: obj => obj.approvedByName, set: (obj, value) => { obj.approvedByName = value; } }, metadata: _metadata }, _approvedByName_initializers, _approvedByName_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _deliveredDate_decorators, { kind: "field", name: "deliveredDate", static: false, private: false, access: { has: obj => "deliveredDate" in obj, get: obj => obj.deliveredDate, set: (obj, value) => { obj.deliveredDate = value; } }, metadata: _metadata }, _deliveredDate_initializers, _deliveredDate_extraInitializers);
        __esDecorate(null, null, _acknowledgedById_decorators, { kind: "field", name: "acknowledgedById", static: false, private: false, access: { has: obj => "acknowledgedById" in obj, get: obj => obj.acknowledgedById, set: (obj, value) => { obj.acknowledgedById = value; } }, metadata: _metadata }, _acknowledgedById_initializers, _acknowledgedById_extraInitializers);
        __esDecorate(null, null, _acknowledgedByName_decorators, { kind: "field", name: "acknowledgedByName", static: false, private: false, access: { has: obj => "acknowledgedByName" in obj, get: obj => obj.acknowledgedByName, set: (obj, value) => { obj.acknowledgedByName = value; } }, metadata: _metadata }, _acknowledgedByName_initializers, _acknowledgedByName_extraInitializers);
        __esDecorate(null, null, _acknowledgedDate_decorators, { kind: "field", name: "acknowledgedDate", static: false, private: false, access: { has: obj => "acknowledgedDate" in obj, get: obj => obj.acknowledgedDate, set: (obj, value) => { obj.acknowledgedDate = value; } }, metadata: _metadata }, _acknowledgedDate_initializers, _acknowledgedDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _reviewComments_decorators, { kind: "field", name: "reviewComments", static: false, private: false, access: { has: obj => "reviewComments" in obj, get: obj => obj.reviewComments, set: (obj, value) => { obj.reviewComments = value; } }, metadata: _metadata }, _reviewComments_initializers, _reviewComments_extraInitializers);
        __esDecorate(null, null, _relatedEquipment_decorators, { kind: "field", name: "relatedEquipment", static: false, private: false, access: { has: obj => "relatedEquipment" in obj, get: obj => obj.relatedEquipment, set: (obj, value) => { obj.relatedEquipment = value; } }, metadata: _metadata }, _relatedEquipment_initializers, _relatedEquipment_extraInitializers);
        __esDecorate(null, null, _relatedSystem_decorators, { kind: "field", name: "relatedSystem", static: false, private: false, access: { has: obj => "relatedSystem" in obj, get: obj => obj.relatedSystem, set: (obj, value) => { obj.relatedSystem = value; } }, metadata: _metadata }, _relatedSystem_initializers, _relatedSystem_extraInitializers);
        __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
        __esDecorate(null, null, _modelNumber_decorators, { kind: "field", name: "modelNumber", static: false, private: false, access: { has: obj => "modelNumber" in obj, get: obj => obj.modelNumber, set: (obj, value) => { obj.modelNumber = value; } }, metadata: _metadata }, _modelNumber_initializers, _modelNumber_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _warrantyStartDate_decorators, { kind: "field", name: "warrantyStartDate", static: false, private: false, access: { has: obj => "warrantyStartDate" in obj, get: obj => obj.warrantyStartDate, set: (obj, value) => { obj.warrantyStartDate = value; } }, metadata: _metadata }, _warrantyStartDate_initializers, _warrantyStartDate_extraInitializers);
        __esDecorate(null, null, _warrantyEndDate_decorators, { kind: "field", name: "warrantyEndDate", static: false, private: false, access: { has: obj => "warrantyEndDate" in obj, get: obj => obj.warrantyEndDate, set: (obj, value) => { obj.warrantyEndDate = value; } }, metadata: _metadata }, _warrantyEndDate_initializers, _warrantyEndDate_extraInitializers);
        __esDecorate(null, null, _trainingTopic_decorators, { kind: "field", name: "trainingTopic", static: false, private: false, access: { has: obj => "trainingTopic" in obj, get: obj => obj.trainingTopic, set: (obj, value) => { obj.trainingTopic = value; } }, metadata: _metadata }, _trainingTopic_initializers, _trainingTopic_extraInitializers);
        __esDecorate(null, null, _trainingDuration_decorators, { kind: "field", name: "trainingDuration", static: false, private: false, access: { has: obj => "trainingDuration" in obj, get: obj => obj.trainingDuration, set: (obj, value) => { obj.trainingDuration = value; } }, metadata: _metadata }, _trainingDuration_initializers, _trainingDuration_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _closeout_decorators, { kind: "field", name: "closeout", static: false, private: false, access: { has: obj => "closeout" in obj, get: obj => obj.closeout, set: (obj, value) => { obj.closeout = value; } }, metadata: _metadata }, _closeout_initializers, _closeout_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CloseoutDocument = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CloseoutDocument = _classThis;
})();
exports.CloseoutDocument = CloseoutDocument;
// ====================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ====================================================================
let CreateConstructionCloseoutDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _contractorId_decorators;
    let _contractorId_initializers = [];
    let _contractorId_extraInitializers = [];
    let _contractorName_decorators;
    let _contractorName_initializers = [];
    let _contractorName_extraInitializers = [];
    let _contractValue_decorators;
    let _contractValue_initializers = [];
    let _contractValue_extraInitializers = [];
    let _retainageAmount_decorators;
    let _retainageAmount_initializers = [];
    let _retainageAmount_extraInitializers = [];
    let _retainagePercentage_decorators;
    let _retainagePercentage_initializers = [];
    let _retainagePercentage_extraInitializers = [];
    let _warrantyPeriodMonths_decorators;
    let _warrantyPeriodMonths_initializers = [];
    let _warrantyPeriodMonths_extraInitializers = [];
    let _finalPaymentAmount_decorators;
    let _finalPaymentAmount_initializers = [];
    let _finalPaymentAmount_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateConstructionCloseoutDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
                this.contractorId = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _contractorId_initializers, void 0));
                this.contractorName = (__runInitializers(this, _contractorId_extraInitializers), __runInitializers(this, _contractorName_initializers, void 0));
                this.contractValue = (__runInitializers(this, _contractorName_extraInitializers), __runInitializers(this, _contractValue_initializers, void 0));
                this.retainageAmount = (__runInitializers(this, _contractValue_extraInitializers), __runInitializers(this, _retainageAmount_initializers, void 0));
                this.retainagePercentage = (__runInitializers(this, _retainageAmount_extraInitializers), __runInitializers(this, _retainagePercentage_initializers, void 0));
                this.warrantyPeriodMonths = (__runInitializers(this, _retainagePercentage_extraInitializers), __runInitializers(this, _warrantyPeriodMonths_initializers, void 0));
                this.finalPaymentAmount = (__runInitializers(this, _warrantyPeriodMonths_extraInitializers), __runInitializers(this, _finalPaymentAmount_initializers, void 0));
                this.notes = (__runInitializers(this, _finalPaymentAmount_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _projectName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contractorId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _contractorName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contractValue_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _retainageAmount_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _retainagePercentage_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _warrantyPeriodMonths_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _finalPaymentAmount_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _contractorId_decorators, { kind: "field", name: "contractorId", static: false, private: false, access: { has: obj => "contractorId" in obj, get: obj => obj.contractorId, set: (obj, value) => { obj.contractorId = value; } }, metadata: _metadata }, _contractorId_initializers, _contractorId_extraInitializers);
            __esDecorate(null, null, _contractorName_decorators, { kind: "field", name: "contractorName", static: false, private: false, access: { has: obj => "contractorName" in obj, get: obj => obj.contractorName, set: (obj, value) => { obj.contractorName = value; } }, metadata: _metadata }, _contractorName_initializers, _contractorName_extraInitializers);
            __esDecorate(null, null, _contractValue_decorators, { kind: "field", name: "contractValue", static: false, private: false, access: { has: obj => "contractValue" in obj, get: obj => obj.contractValue, set: (obj, value) => { obj.contractValue = value; } }, metadata: _metadata }, _contractValue_initializers, _contractValue_extraInitializers);
            __esDecorate(null, null, _retainageAmount_decorators, { kind: "field", name: "retainageAmount", static: false, private: false, access: { has: obj => "retainageAmount" in obj, get: obj => obj.retainageAmount, set: (obj, value) => { obj.retainageAmount = value; } }, metadata: _metadata }, _retainageAmount_initializers, _retainageAmount_extraInitializers);
            __esDecorate(null, null, _retainagePercentage_decorators, { kind: "field", name: "retainagePercentage", static: false, private: false, access: { has: obj => "retainagePercentage" in obj, get: obj => obj.retainagePercentage, set: (obj, value) => { obj.retainagePercentage = value; } }, metadata: _metadata }, _retainagePercentage_initializers, _retainagePercentage_extraInitializers);
            __esDecorate(null, null, _warrantyPeriodMonths_decorators, { kind: "field", name: "warrantyPeriodMonths", static: false, private: false, access: { has: obj => "warrantyPeriodMonths" in obj, get: obj => obj.warrantyPeriodMonths, set: (obj, value) => { obj.warrantyPeriodMonths = value; } }, metadata: _metadata }, _warrantyPeriodMonths_initializers, _warrantyPeriodMonths_extraInitializers);
            __esDecorate(null, null, _finalPaymentAmount_decorators, { kind: "field", name: "finalPaymentAmount", static: false, private: false, access: { has: obj => "finalPaymentAmount" in obj, get: obj => obj.finalPaymentAmount, set: (obj, value) => { obj.finalPaymentAmount = value; } }, metadata: _metadata }, _finalPaymentAmount_initializers, _finalPaymentAmount_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateConstructionCloseoutDto = CreateConstructionCloseoutDto;
let UpdateConstructionCloseoutDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _substantialCompletionDate_decorators;
    let _substantialCompletionDate_initializers = [];
    let _substantialCompletionDate_extraInitializers = [];
    let _finalCompletionDate_decorators;
    let _finalCompletionDate_initializers = [];
    let _finalCompletionDate_extraInitializers = [];
    let _certificateOfOccupancyDate_decorators;
    let _certificateOfOccupancyDate_initializers = [];
    let _certificateOfOccupancyDate_extraInitializers = [];
    let _finalInspectionScheduled_decorators;
    let _finalInspectionScheduled_initializers = [];
    let _finalInspectionScheduled_extraInitializers = [];
    let _finalInspectionDate_decorators;
    let _finalInspectionDate_initializers = [];
    let _finalInspectionDate_extraInitializers = [];
    let _finalInspectionResult_decorators;
    let _finalInspectionResult_initializers = [];
    let _finalInspectionResult_extraInitializers = [];
    let _ownerTrainingRequired_decorators;
    let _ownerTrainingRequired_initializers = [];
    let _ownerTrainingRequired_extraInitializers = [];
    let _ownerTrainingCompleted_decorators;
    let _ownerTrainingCompleted_initializers = [];
    let _ownerTrainingCompleted_extraInitializers = [];
    let _ownerTrainingDate_decorators;
    let _ownerTrainingDate_initializers = [];
    let _ownerTrainingDate_extraInitializers = [];
    let _finalPaymentStatus_decorators;
    let _finalPaymentStatus_initializers = [];
    let _finalPaymentStatus_extraInitializers = [];
    let _finalPaymentDate_decorators;
    let _finalPaymentDate_initializers = [];
    let _finalPaymentDate_extraInitializers = [];
    let _lessonsLearnedCompleted_decorators;
    let _lessonsLearnedCompleted_initializers = [];
    let _lessonsLearnedCompleted_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateConstructionCloseoutDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.substantialCompletionDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _substantialCompletionDate_initializers, void 0));
                this.finalCompletionDate = (__runInitializers(this, _substantialCompletionDate_extraInitializers), __runInitializers(this, _finalCompletionDate_initializers, void 0));
                this.certificateOfOccupancyDate = (__runInitializers(this, _finalCompletionDate_extraInitializers), __runInitializers(this, _certificateOfOccupancyDate_initializers, void 0));
                this.finalInspectionScheduled = (__runInitializers(this, _certificateOfOccupancyDate_extraInitializers), __runInitializers(this, _finalInspectionScheduled_initializers, void 0));
                this.finalInspectionDate = (__runInitializers(this, _finalInspectionScheduled_extraInitializers), __runInitializers(this, _finalInspectionDate_initializers, void 0));
                this.finalInspectionResult = (__runInitializers(this, _finalInspectionDate_extraInitializers), __runInitializers(this, _finalInspectionResult_initializers, void 0));
                this.ownerTrainingRequired = (__runInitializers(this, _finalInspectionResult_extraInitializers), __runInitializers(this, _ownerTrainingRequired_initializers, void 0));
                this.ownerTrainingCompleted = (__runInitializers(this, _ownerTrainingRequired_extraInitializers), __runInitializers(this, _ownerTrainingCompleted_initializers, void 0));
                this.ownerTrainingDate = (__runInitializers(this, _ownerTrainingCompleted_extraInitializers), __runInitializers(this, _ownerTrainingDate_initializers, void 0));
                this.finalPaymentStatus = (__runInitializers(this, _ownerTrainingDate_extraInitializers), __runInitializers(this, _finalPaymentStatus_initializers, void 0));
                this.finalPaymentDate = (__runInitializers(this, _finalPaymentStatus_extraInitializers), __runInitializers(this, _finalPaymentDate_initializers, void 0));
                this.lessonsLearnedCompleted = (__runInitializers(this, _finalPaymentDate_extraInitializers), __runInitializers(this, _lessonsLearnedCompleted_initializers, void 0));
                this.notes = (__runInitializers(this, _lessonsLearnedCompleted_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.CloseoutStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.CloseoutStatus)];
            _substantialCompletionDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalCompletionDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _certificateOfOccupancyDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalInspectionScheduled_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _finalInspectionDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalInspectionResult_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.InspectionResult }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.InspectionResult)];
            _ownerTrainingRequired_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _ownerTrainingCompleted_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _ownerTrainingDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalPaymentStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.PaymentStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.PaymentStatus)];
            _finalPaymentDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _lessonsLearnedCompleted_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _substantialCompletionDate_decorators, { kind: "field", name: "substantialCompletionDate", static: false, private: false, access: { has: obj => "substantialCompletionDate" in obj, get: obj => obj.substantialCompletionDate, set: (obj, value) => { obj.substantialCompletionDate = value; } }, metadata: _metadata }, _substantialCompletionDate_initializers, _substantialCompletionDate_extraInitializers);
            __esDecorate(null, null, _finalCompletionDate_decorators, { kind: "field", name: "finalCompletionDate", static: false, private: false, access: { has: obj => "finalCompletionDate" in obj, get: obj => obj.finalCompletionDate, set: (obj, value) => { obj.finalCompletionDate = value; } }, metadata: _metadata }, _finalCompletionDate_initializers, _finalCompletionDate_extraInitializers);
            __esDecorate(null, null, _certificateOfOccupancyDate_decorators, { kind: "field", name: "certificateOfOccupancyDate", static: false, private: false, access: { has: obj => "certificateOfOccupancyDate" in obj, get: obj => obj.certificateOfOccupancyDate, set: (obj, value) => { obj.certificateOfOccupancyDate = value; } }, metadata: _metadata }, _certificateOfOccupancyDate_initializers, _certificateOfOccupancyDate_extraInitializers);
            __esDecorate(null, null, _finalInspectionScheduled_decorators, { kind: "field", name: "finalInspectionScheduled", static: false, private: false, access: { has: obj => "finalInspectionScheduled" in obj, get: obj => obj.finalInspectionScheduled, set: (obj, value) => { obj.finalInspectionScheduled = value; } }, metadata: _metadata }, _finalInspectionScheduled_initializers, _finalInspectionScheduled_extraInitializers);
            __esDecorate(null, null, _finalInspectionDate_decorators, { kind: "field", name: "finalInspectionDate", static: false, private: false, access: { has: obj => "finalInspectionDate" in obj, get: obj => obj.finalInspectionDate, set: (obj, value) => { obj.finalInspectionDate = value; } }, metadata: _metadata }, _finalInspectionDate_initializers, _finalInspectionDate_extraInitializers);
            __esDecorate(null, null, _finalInspectionResult_decorators, { kind: "field", name: "finalInspectionResult", static: false, private: false, access: { has: obj => "finalInspectionResult" in obj, get: obj => obj.finalInspectionResult, set: (obj, value) => { obj.finalInspectionResult = value; } }, metadata: _metadata }, _finalInspectionResult_initializers, _finalInspectionResult_extraInitializers);
            __esDecorate(null, null, _ownerTrainingRequired_decorators, { kind: "field", name: "ownerTrainingRequired", static: false, private: false, access: { has: obj => "ownerTrainingRequired" in obj, get: obj => obj.ownerTrainingRequired, set: (obj, value) => { obj.ownerTrainingRequired = value; } }, metadata: _metadata }, _ownerTrainingRequired_initializers, _ownerTrainingRequired_extraInitializers);
            __esDecorate(null, null, _ownerTrainingCompleted_decorators, { kind: "field", name: "ownerTrainingCompleted", static: false, private: false, access: { has: obj => "ownerTrainingCompleted" in obj, get: obj => obj.ownerTrainingCompleted, set: (obj, value) => { obj.ownerTrainingCompleted = value; } }, metadata: _metadata }, _ownerTrainingCompleted_initializers, _ownerTrainingCompleted_extraInitializers);
            __esDecorate(null, null, _ownerTrainingDate_decorators, { kind: "field", name: "ownerTrainingDate", static: false, private: false, access: { has: obj => "ownerTrainingDate" in obj, get: obj => obj.ownerTrainingDate, set: (obj, value) => { obj.ownerTrainingDate = value; } }, metadata: _metadata }, _ownerTrainingDate_initializers, _ownerTrainingDate_extraInitializers);
            __esDecorate(null, null, _finalPaymentStatus_decorators, { kind: "field", name: "finalPaymentStatus", static: false, private: false, access: { has: obj => "finalPaymentStatus" in obj, get: obj => obj.finalPaymentStatus, set: (obj, value) => { obj.finalPaymentStatus = value; } }, metadata: _metadata }, _finalPaymentStatus_initializers, _finalPaymentStatus_extraInitializers);
            __esDecorate(null, null, _finalPaymentDate_decorators, { kind: "field", name: "finalPaymentDate", static: false, private: false, access: { has: obj => "finalPaymentDate" in obj, get: obj => obj.finalPaymentDate, set: (obj, value) => { obj.finalPaymentDate = value; } }, metadata: _metadata }, _finalPaymentDate_initializers, _finalPaymentDate_extraInitializers);
            __esDecorate(null, null, _lessonsLearnedCompleted_decorators, { kind: "field", name: "lessonsLearnedCompleted", static: false, private: false, access: { has: obj => "lessonsLearnedCompleted" in obj, get: obj => obj.lessonsLearnedCompleted, set: (obj, value) => { obj.lessonsLearnedCompleted = value; } }, metadata: _metadata }, _lessonsLearnedCompleted_initializers, _lessonsLearnedCompleted_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateConstructionCloseoutDto = UpdateConstructionCloseoutDto;
let CreatePunchListItemDto = (() => {
    var _a;
    let _closeoutId_decorators;
    let _closeoutId_initializers = [];
    let _closeoutId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _reportedById_decorators;
    let _reportedById_initializers = [];
    let _reportedById_extraInitializers = [];
    let _reportedByName_decorators;
    let _reportedByName_initializers = [];
    let _reportedByName_extraInitializers = [];
    let _contractorResponsible_decorators;
    let _contractorResponsible_initializers = [];
    let _contractorResponsible_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePunchListItemDto {
            constructor() {
                this.closeoutId = __runInitializers(this, _closeoutId_initializers, void 0);
                this.itemNumber = (__runInitializers(this, _closeoutId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
                this.title = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.location = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.category = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.reportedById = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _reportedById_initializers, void 0));
                this.reportedByName = (__runInitializers(this, _reportedById_extraInitializers), __runInitializers(this, _reportedByName_initializers, void 0));
                this.contractorResponsible = (__runInitializers(this, _reportedByName_extraInitializers), __runInitializers(this, _contractorResponsible_initializers, void 0));
                this.assignedToId = (__runInitializers(this, _contractorResponsible_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.assignedToName = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.estimatedCost = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
                this.tags = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _closeoutId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _itemNumber_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _location_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemCategory }), (0, class_validator_1.IsEnum)(closeout_types_1.PunchListItemCategory)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemPriority }), (0, class_validator_1.IsEnum)(closeout_types_1.PunchListItemPriority)];
            _reportedById_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _reportedByName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contractorResponsible_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assignedToName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _estimatedCost_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _closeoutId_decorators, { kind: "field", name: "closeoutId", static: false, private: false, access: { has: obj => "closeoutId" in obj, get: obj => obj.closeoutId, set: (obj, value) => { obj.closeoutId = value; } }, metadata: _metadata }, _closeoutId_initializers, _closeoutId_extraInitializers);
            __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _reportedById_decorators, { kind: "field", name: "reportedById", static: false, private: false, access: { has: obj => "reportedById" in obj, get: obj => obj.reportedById, set: (obj, value) => { obj.reportedById = value; } }, metadata: _metadata }, _reportedById_initializers, _reportedById_extraInitializers);
            __esDecorate(null, null, _reportedByName_decorators, { kind: "field", name: "reportedByName", static: false, private: false, access: { has: obj => "reportedByName" in obj, get: obj => obj.reportedByName, set: (obj, value) => { obj.reportedByName = value; } }, metadata: _metadata }, _reportedByName_initializers, _reportedByName_extraInitializers);
            __esDecorate(null, null, _contractorResponsible_decorators, { kind: "field", name: "contractorResponsible", static: false, private: false, access: { has: obj => "contractorResponsible" in obj, get: obj => obj.contractorResponsible, set: (obj, value) => { obj.contractorResponsible = value; } }, metadata: _metadata }, _contractorResponsible_initializers, _contractorResponsible_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePunchListItemDto = CreatePunchListItemDto;
let UpdatePunchListItemDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _requiresReinspection_decorators;
    let _requiresReinspection_initializers = [];
    let _requiresReinspection_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _attachmentUrls_decorators;
    let _attachmentUrls_initializers = [];
    let _attachmentUrls_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdatePunchListItemDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.assignedToId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.assignedToName = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.actualHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
                this.actualCost = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
                this.resolutionNotes = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
                this.rejectionReason = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                this.requiresReinspection = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _requiresReinspection_initializers, void 0));
                this.photoUrls = (__runInitializers(this, _requiresReinspection_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
                this.attachmentUrls = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _attachmentUrls_initializers, void 0));
                this.metadata = (__runInitializers(this, _attachmentUrls_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.PunchListItemStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.PunchListItemStatus)];
            _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _assignedToName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _actualHours_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _actualCost_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _resolutionNotes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _requiresReinspection_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _photoUrls_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _attachmentUrls_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
            __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
            __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            __esDecorate(null, null, _requiresReinspection_decorators, { kind: "field", name: "requiresReinspection", static: false, private: false, access: { has: obj => "requiresReinspection" in obj, get: obj => obj.requiresReinspection, set: (obj, value) => { obj.requiresReinspection = value; } }, metadata: _metadata }, _requiresReinspection_initializers, _requiresReinspection_extraInitializers);
            __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
            __esDecorate(null, null, _attachmentUrls_decorators, { kind: "field", name: "attachmentUrls", static: false, private: false, access: { has: obj => "attachmentUrls" in obj, get: obj => obj.attachmentUrls, set: (obj, value) => { obj.attachmentUrls = value; } }, metadata: _metadata }, _attachmentUrls_initializers, _attachmentUrls_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdatePunchListItemDto = UpdatePunchListItemDto;
let CreateCloseoutDocumentDto = (() => {
    var _a;
    let _closeoutId_decorators;
    let _closeoutId_initializers = [];
    let _closeoutId_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _relatedEquipment_decorators;
    let _relatedEquipment_initializers = [];
    let _relatedEquipment_extraInitializers = [];
    let _relatedSystem_decorators;
    let _relatedSystem_initializers = [];
    let _relatedSystem_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _modelNumber_decorators;
    let _modelNumber_initializers = [];
    let _modelNumber_extraInitializers = [];
    let _trainingTopic_decorators;
    let _trainingTopic_initializers = [];
    let _trainingTopic_extraInitializers = [];
    let _trainingDuration_decorators;
    let _trainingDuration_initializers = [];
    let _trainingDuration_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateCloseoutDocumentDto {
            constructor() {
                this.closeoutId = __runInitializers(this, _closeoutId_initializers, void 0);
                this.documentType = (__runInitializers(this, _closeoutId_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.title = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.documentNumber = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
                this.required = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _required_initializers, void 0));
                this.relatedEquipment = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _relatedEquipment_initializers, void 0));
                this.relatedSystem = (__runInitializers(this, _relatedEquipment_extraInitializers), __runInitializers(this, _relatedSystem_initializers, void 0));
                this.manufacturer = (__runInitializers(this, _relatedSystem_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
                this.modelNumber = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _modelNumber_initializers, void 0));
                this.trainingTopic = (__runInitializers(this, _modelNumber_extraInitializers), __runInitializers(this, _trainingTopic_initializers, void 0));
                this.trainingDuration = (__runInitializers(this, _trainingTopic_extraInitializers), __runInitializers(this, _trainingDuration_initializers, void 0));
                this.tags = (__runInitializers(this, _trainingDuration_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _closeoutId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _documentType_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.CloseoutDocumentType }), (0, class_validator_1.IsEnum)(closeout_types_1.CloseoutDocumentType)];
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _documentNumber_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _required_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _relatedEquipment_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _relatedSystem_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _manufacturer_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _modelNumber_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trainingTopic_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trainingDuration_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _closeoutId_decorators, { kind: "field", name: "closeoutId", static: false, private: false, access: { has: obj => "closeoutId" in obj, get: obj => obj.closeoutId, set: (obj, value) => { obj.closeoutId = value; } }, metadata: _metadata }, _closeoutId_initializers, _closeoutId_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
            __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(null, null, _relatedEquipment_decorators, { kind: "field", name: "relatedEquipment", static: false, private: false, access: { has: obj => "relatedEquipment" in obj, get: obj => obj.relatedEquipment, set: (obj, value) => { obj.relatedEquipment = value; } }, metadata: _metadata }, _relatedEquipment_initializers, _relatedEquipment_extraInitializers);
            __esDecorate(null, null, _relatedSystem_decorators, { kind: "field", name: "relatedSystem", static: false, private: false, access: { has: obj => "relatedSystem" in obj, get: obj => obj.relatedSystem, set: (obj, value) => { obj.relatedSystem = value; } }, metadata: _metadata }, _relatedSystem_initializers, _relatedSystem_extraInitializers);
            __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
            __esDecorate(null, null, _modelNumber_decorators, { kind: "field", name: "modelNumber", static: false, private: false, access: { has: obj => "modelNumber" in obj, get: obj => obj.modelNumber, set: (obj, value) => { obj.modelNumber = value; } }, metadata: _metadata }, _modelNumber_initializers, _modelNumber_extraInitializers);
            __esDecorate(null, null, _trainingTopic_decorators, { kind: "field", name: "trainingTopic", static: false, private: false, access: { has: obj => "trainingTopic" in obj, get: obj => obj.trainingTopic, set: (obj, value) => { obj.trainingTopic = value; } }, metadata: _metadata }, _trainingTopic_initializers, _trainingTopic_extraInitializers);
            __esDecorate(null, null, _trainingDuration_decorators, { kind: "field", name: "trainingDuration", static: false, private: false, access: { has: obj => "trainingDuration" in obj, get: obj => obj.trainingDuration, set: (obj, value) => { obj.trainingDuration = value; } }, metadata: _metadata }, _trainingDuration_initializers, _trainingDuration_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCloseoutDocumentDto = CreateCloseoutDocumentDto;
let UpdateCloseoutDocumentDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _reviewComments_decorators;
    let _reviewComments_initializers = [];
    let _reviewComments_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _warrantyStartDate_decorators;
    let _warrantyStartDate_initializers = [];
    let _warrantyStartDate_extraInitializers = [];
    let _warrantyEndDate_decorators;
    let _warrantyEndDate_initializers = [];
    let _warrantyEndDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateCloseoutDocumentDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.fileUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
                this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
                this.fileSize = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
                this.version = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.reviewComments = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _reviewComments_initializers, void 0));
                this.rejectionReason = (__runInitializers(this, _reviewComments_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.warrantyStartDate = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _warrantyStartDate_initializers, void 0));
                this.warrantyEndDate = (__runInitializers(this, _warrantyStartDate_extraInitializers), __runInitializers(this, _warrantyEndDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _warrantyEndDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.DocumentStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.DocumentStatus)];
            _fileUrl_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fileName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fileSize_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _version_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reviewComments_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _warrantyStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _warrantyEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _reviewComments_decorators, { kind: "field", name: "reviewComments", static: false, private: false, access: { has: obj => "reviewComments" in obj, get: obj => obj.reviewComments, set: (obj, value) => { obj.reviewComments = value; } }, metadata: _metadata }, _reviewComments_initializers, _reviewComments_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _warrantyStartDate_decorators, { kind: "field", name: "warrantyStartDate", static: false, private: false, access: { has: obj => "warrantyStartDate" in obj, get: obj => obj.warrantyStartDate, set: (obj, value) => { obj.warrantyStartDate = value; } }, metadata: _metadata }, _warrantyStartDate_initializers, _warrantyStartDate_extraInitializers);
            __esDecorate(null, null, _warrantyEndDate_decorators, { kind: "field", name: "warrantyEndDate", static: false, private: false, access: { has: obj => "warrantyEndDate" in obj, get: obj => obj.warrantyEndDate, set: (obj, value) => { obj.warrantyEndDate = value; } }, metadata: _metadata }, _warrantyEndDate_initializers, _warrantyEndDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCloseoutDocumentDto = UpdateCloseoutDocumentDto;
// ====================================================================
// REUSABLE FUNCTIONS - CONSTRUCTION CLOSEOUT MANAGEMENT
// ====================================================================
/**
 * 1. CREATE CONSTRUCTION CLOSEOUT
 * Creates a new construction closeout record
 */
async function createConstructionCloseout(data, transaction) {
    const closeout = await ConstructionCloseout.create({
        ...data,
        status: closeout_types_1.CloseoutStatus.INITIATED,
        completionPercentage: 0,
        totalPunchListItems: 0,
        openPunchListItems: 0,
        criticalPunchListItems: 0,
        requiredDocumentsCount: 0,
        submittedDocumentsCount: 0,
        approvedDocumentsCount: 0,
        finalInspectionScheduled: false,
        ownerTrainingRequired: false,
        ownerTrainingCompleted: false,
        lienReleasesRequired: 0,
        lienReleasesReceived: 0,
        finalPaymentStatus: closeout_types_1.PaymentStatus.PENDING,
        lessonsLearnedCompleted: false,
    }, { transaction });
    return closeout;
}
/**
 * 2. GET CLOSEOUT BY ID WITH ASSOCIATIONS
 * Retrieves a closeout record with all associated data using eager loading
 */
async function getCloseoutByIdWithAssociations(id, options) {
    const include = [];
    if (options?.includePunchList) {
        const punchListWhere = {};
        if (options.punchListStatus && options.punchListStatus.length > 0) {
            punchListWhere.status = { [sequelize_1.Op.in]: options.punchListStatus };
        }
        include.push({
            model: PunchListItem,
            as: 'punchListItems',
            where: Object.keys(punchListWhere).length > 0 ? punchListWhere : undefined,
            required: false,
        });
    }
    if (options?.includeDocuments) {
        const documentWhere = {};
        if (options.documentTypes && options.documentTypes.length > 0) {
            documentWhere.documentType = { [sequelize_1.Op.in]: options.documentTypes };
        }
        include.push({
            model: CloseoutDocument,
            as: 'documents',
            where: Object.keys(documentWhere).length > 0 ? documentWhere : undefined,
            required: false,
        });
    }
    const closeout = await ConstructionCloseout.findByPk(id, {
        include: include.length > 0 ? include : undefined,
    });
    return closeout;
}
/**
 * 3. UPDATE CLOSEOUT STATUS
 * Updates the closeout status with validation
 */
async function updateCloseoutStatus(id, status, transaction) {
    const closeout = await ConstructionCloseout.findByPk(id, { transaction });
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    await closeout.update({ status }, { transaction });
    return closeout;
}
/**
 * 4. CREATE PUNCH LIST ITEM
 * Creates a new punch list item and updates closeout counters
 */
async function createPunchListItem(data, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const item = await PunchListItem.create({
            ...data,
            status: closeout_types_1.PunchListItemStatus.OPEN,
            reportedDate: new Date(),
            assignedDate: data.assignedToId ? new Date() : undefined,
            requiresReinspection: false,
        }, { transaction: t });
        // Update closeout counters
        const closeout = await ConstructionCloseout.findByPk(data.closeoutId, { transaction: t });
        if (closeout) {
            await closeout.increment('totalPunchListItems', { transaction: t });
            await closeout.increment('openPunchListItems', { transaction: t });
            if (data.priority === closeout_types_1.PunchListItemPriority.CRITICAL) {
                await closeout.increment('criticalPunchListItems', { transaction: t });
            }
            // Recalculate completion percentage
            await recalculateCloseoutCompletion(data.closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return item;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 5. GET PUNCH LIST ITEMS FOR CLOSEOUT
 * Retrieves punch list items with filtering and pagination
 */
async function getPunchListItemsForCloseout(closeoutId, options) {
    const where = { closeoutId };
    if (options?.status && options.status.length > 0) {
        where.status = { [sequelize_1.Op.in]: options.status };
    }
    if (options?.priority && options.priority.length > 0) {
        where.priority = { [sequelize_1.Op.in]: options.priority };
    }
    if (options?.category && options.category.length > 0) {
        where.category = { [sequelize_1.Op.in]: options.category };
    }
    if (options?.assignedToId) {
        where.assignedToId = options.assignedToId;
    }
    const { count, rows } = await PunchListItem.findAndCountAll({
        where,
        limit: options?.limit,
        offset: options?.offset,
        order: [[options?.orderBy || 'createdAt', options?.orderDirection || 'DESC']],
    });
    return { items: rows, total: count };
}
/**
 * 6. UPDATE PUNCH LIST ITEM STATUS
 * Updates punch list item status with workflow validation
 */
async function updatePunchListItemStatus(id, status, userId, userName, notes, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await PunchListItem.sequelize.transaction();
    try {
        const item = await PunchListItem.findByPk(id, { transaction: t });
        if (!item) {
            throw new Error('Punch list item not found');
        }
        const updates = { status };
        // Update timestamps based on status
        switch (status) {
            case closeout_types_1.PunchListItemStatus.READY_FOR_REVIEW:
                updates.completedDate = new Date();
                if (notes)
                    updates.resolutionNotes = notes;
                break;
            case closeout_types_1.PunchListItemStatus.REVIEWED:
                updates.reviewedById = userId;
                updates.reviewedByName = userName;
                updates.reviewedDate = new Date();
                break;
            case closeout_types_1.PunchListItemStatus.APPROVED:
                updates.approvedById = userId;
                updates.approvedByName = userName;
                updates.approvedDate = new Date();
                break;
            case closeout_types_1.PunchListItemStatus.REJECTED:
                if (notes)
                    updates.rejectionReason = notes;
                break;
            case closeout_types_1.PunchListItemStatus.CLOSED:
                updates.closedDate = new Date();
                break;
        }
        await item.update(updates, { transaction: t });
        // Update closeout counters
        await updateCloseoutPunchListCounters(item.closeoutId, t);
        await recalculateCloseoutCompletion(item.closeoutId, t);
        if (shouldCommit) {
            await t.commit();
        }
        return item;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 7. ASSIGN PUNCH LIST ITEM
 * Assigns a punch list item to a user
 */
async function assignPunchListItem(id, assignedToId, assignedToName, dueDate, transaction) {
    const item = await PunchListItem.findByPk(id, { transaction });
    if (!item) {
        throw new Error('Punch list item not found');
    }
    await item.update({
        assignedToId,
        assignedToName,
        assignedDate: new Date(),
        dueDate,
        status: closeout_types_1.PunchListItemStatus.IN_PROGRESS,
    }, { transaction });
    return item;
}
/**
 * 8. GET CRITICAL PUNCH LIST ITEMS
 * Retrieves all critical punch list items across closeouts
 */
async function getCriticalPunchListItems(projectId, status) {
    const where = {
        priority: closeout_types_1.PunchListItemPriority.CRITICAL,
    };
    if (status && status.length > 0) {
        where.status = { [sequelize_1.Op.in]: status };
    }
    const include = [];
    if (projectId) {
        include.push({
            model: ConstructionCloseout,
            as: 'closeout',
            where: { projectId },
            required: true,
        });
    }
    const items = await PunchListItem.findAll({
        where,
        include: include.length > 0 ? include : undefined,
        order: [['dueDate', 'ASC']],
    });
    return items;
}
/**
 * 9. GET OVERDUE PUNCH LIST ITEMS
 * Retrieves overdue punch list items
 */
async function getOverduePunchListItems(closeoutId) {
    const where = {
        dueDate: {
            [sequelize_1.Op.lt]: new Date(),
        },
        status: {
            [sequelize_1.Op.notIn]: [closeout_types_1.PunchListItemStatus.CLOSED, closeout_types_1.PunchListItemStatus.CANCELLED],
        },
    };
    if (closeoutId) {
        where.closeoutId = closeoutId;
    }
    const items = await PunchListItem.findAll({
        where,
        include: [
            {
                model: ConstructionCloseout,
                as: 'closeout',
            },
        ],
        order: [['dueDate', 'ASC']],
    });
    return items;
}
/**
 * 10. BULK UPDATE PUNCH LIST ITEMS
 * Updates multiple punch list items at once
 */
async function bulkUpdatePunchListItems(itemIds, updates, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await PunchListItem.sequelize.transaction();
    try {
        const [affectedCount] = await PunchListItem.update(updates, {
            where: { id: { [sequelize_1.Op.in]: itemIds } },
            transaction: t,
        });
        // Update closeout counters for affected closeouts
        const items = await PunchListItem.findAll({
            where: { id: { [sequelize_1.Op.in]: itemIds } },
            attributes: ['closeoutId'],
            group: ['closeoutId'],
            transaction: t,
        });
        for (const item of items) {
            await updateCloseoutPunchListCounters(item.closeoutId, t);
            await recalculateCloseoutCompletion(item.closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return affectedCount;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 11. CREATE CLOSEOUT DOCUMENT
 * Creates a new closeout document record
 */
async function createCloseoutDocument(data, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await CloseoutDocument.sequelize.transaction();
    try {
        const document = await CloseoutDocument.create({
            ...data,
            status: closeout_types_1.DocumentStatus.PENDING,
            version: '1.0',
            required: data.required !== undefined ? data.required : true,
        }, { transaction: t });
        // Update closeout counters
        const closeout = await ConstructionCloseout.findByPk(data.closeoutId, { transaction: t });
        if (closeout && data.required !== false) {
            await closeout.increment('requiredDocumentsCount', { transaction: t });
            await recalculateCloseoutCompletion(data.closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return document;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 12. UPLOAD CLOSEOUT DOCUMENT
 * Uploads a document file and updates the record
 */
async function uploadCloseoutDocument(id, fileUrl, fileName, fileSize, mimeType, uploadedById, uploadedByName, transaction) {
    const document = await CloseoutDocument.findByPk(id, { transaction });
    if (!document) {
        throw new Error('Document not found');
    }
    await document.update({
        fileUrl,
        fileName,
        fileSize,
        mimeType,
        uploadedById,
        uploadedByName,
        uploadedDate: new Date(),
        status: closeout_types_1.DocumentStatus.IN_PROGRESS,
    }, { transaction });
    return document;
}
/**
 * 13. SUBMIT CLOSEOUT DOCUMENT FOR REVIEW
 * Submits a document for review
 */
async function submitCloseoutDocument(id, submittedById, submittedByName, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await CloseoutDocument.sequelize.transaction();
    try {
        const document = await CloseoutDocument.findByPk(id, { transaction: t });
        if (!document) {
            throw new Error('Document not found');
        }
        if (!document.fileUrl) {
            throw new Error('Cannot submit document without uploaded file');
        }
        await document.update({
            submittedById,
            submittedByName,
            submittedDate: new Date(),
            status: closeout_types_1.DocumentStatus.SUBMITTED,
        }, { transaction: t });
        // Update closeout counters
        const closeout = await ConstructionCloseout.findByPk(document.closeoutId, { transaction: t });
        if (closeout && document.required) {
            await closeout.increment('submittedDocumentsCount', { transaction: t });
            await recalculateCloseoutCompletion(document.closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return document;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 14. APPROVE CLOSEOUT DOCUMENT
 * Approves a submitted document
 */
async function approveCloseoutDocument(id, approvedById, approvedByName, reviewComments, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await CloseoutDocument.sequelize.transaction();
    try {
        const document = await CloseoutDocument.findByPk(id, { transaction: t });
        if (!document) {
            throw new Error('Document not found');
        }
        await document.update({
            approvedById,
            approvedByName,
            approvedDate: new Date(),
            reviewComments,
            status: closeout_types_1.DocumentStatus.APPROVED,
        }, { transaction: t });
        // Update closeout counters
        const closeout = await ConstructionCloseout.findByPk(document.closeoutId, { transaction: t });
        if (closeout && document.required) {
            await closeout.increment('approvedDocumentsCount', { transaction: t });
            await recalculateCloseoutCompletion(document.closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return document;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 15. REJECT CLOSEOUT DOCUMENT
 * Rejects a submitted document
 */
async function rejectCloseoutDocument(id, reviewedById, reviewedByName, rejectionReason, transaction) {
    const document = await CloseoutDocument.findByPk(id, { transaction });
    if (!document) {
        throw new Error('Document not found');
    }
    await document.update({
        reviewedById,
        reviewedByName,
        reviewedDate: new Date(),
        rejectionReason,
        status: closeout_types_1.DocumentStatus.REJECTED,
    }, { transaction });
    return document;
}
/**
 * 16. GET DOCUMENTS BY TYPE
 * Retrieves closeout documents by type
 */
async function getDocumentsByType(closeoutId, documentTypes, status) {
    const where = {
        closeoutId,
        documentType: { [sequelize_1.Op.in]: documentTypes },
    };
    if (status && status.length > 0) {
        where.status = { [sequelize_1.Op.in]: status };
    }
    const documents = await CloseoutDocument.findAll({
        where,
        order: [['documentType', 'ASC'], ['createdAt', 'DESC']],
    });
    return documents;
}
/**
 * 17. GET PENDING DOCUMENTS
 * Retrieves all pending required documents
 */
async function getPendingDocuments(closeoutId) {
    const documents = await CloseoutDocument.findAll({
        where: {
            closeoutId,
            required: true,
            status: {
                [sequelize_1.Op.in]: [closeout_types_1.DocumentStatus.PENDING, closeout_types_1.DocumentStatus.IN_PROGRESS, closeout_types_1.DocumentStatus.REJECTED],
            },
        },
        order: [['documentType', 'ASC']],
    });
    return documents;
}
/**
 * 18. GET AS-BUILT DOCUMENTS
 * Retrieves all as-built drawings and documentation
 */
async function getAsBuiltDocuments(closeoutId) {
    return getDocumentsByType(closeoutId, [closeout_types_1.CloseoutDocumentType.AS_BUILT_DRAWING]);
}
/**
 * 19. GET WARRANTY DOCUMENTS
 * Retrieves all warranty-related documents
 */
async function getWarrantyDocuments(closeoutId, includeExpired) {
    const where = {
        closeoutId,
        documentType: {
            [sequelize_1.Op.in]: [
                closeout_types_1.CloseoutDocumentType.WARRANTY_CERTIFICATE,
                closeout_types_1.CloseoutDocumentType.EQUIPMENT_WARRANTY,
                closeout_types_1.CloseoutDocumentType.MATERIAL_WARRANTY,
            ],
        },
    };
    if (!includeExpired) {
        where[sequelize_1.Op.or] = [
            { expirationDate: null },
            { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
        ];
    }
    const documents = await CloseoutDocument.findAll({
        where,
        order: [['expirationDate', 'ASC']],
    });
    return documents;
}
/**
 * 20. GET O&M MANUALS
 * Retrieves O&M manual documents
 */
async function getOMManuals(closeoutId) {
    return getDocumentsByType(closeoutId, [closeout_types_1.CloseoutDocumentType.OM_MANUAL]);
}
/**
 * 21. GET TRAINING MATERIALS
 * Retrieves training-related documents
 */
async function getTrainingMaterials(closeoutId) {
    return getDocumentsByType(closeoutId, [
        closeout_types_1.CloseoutDocumentType.TRAINING_MATERIAL,
        closeout_types_1.CloseoutDocumentType.TRAINING_CERTIFICATE,
    ]);
}
/**
 * 22. SCHEDULE FINAL INSPECTION
 * Schedules the final inspection for a closeout
 */
async function scheduleFinalInspection(closeoutId, inspectionDate, transaction) {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    await closeout.update({
        finalInspectionScheduled: true,
        finalInspectionDate: inspectionDate,
        status: closeout_types_1.CloseoutStatus.FINAL_INSPECTION_SCHEDULED,
    }, { transaction });
    return closeout;
}
/**
 * 23. RECORD FINAL INSPECTION RESULT
 * Records the result of a final inspection
 */
async function recordFinalInspectionResult(closeoutId, result, inspectionDocumentId, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (!closeout) {
            throw new Error('Closeout not found');
        }
        const updates = {
            finalInspectionResult: result,
        };
        if (result === closeout_types_1.InspectionResult.PASSED) {
            updates.status = closeout_types_1.CloseoutStatus.FINAL_INSPECTION_COMPLETE;
        }
        else if (result === closeout_types_1.InspectionResult.FAILED) {
            updates.status = closeout_types_1.CloseoutStatus.PUNCH_LIST_IN_PROGRESS;
        }
        await closeout.update(updates, { transaction: t });
        if (shouldCommit) {
            await t.commit();
        }
        return closeout;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 24. RECORD CERTIFICATE OF OCCUPANCY
 * Records the certificate of occupancy
 */
async function recordCertificateOfOccupancy(closeoutId, coDate, documentId, transaction) {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    await closeout.update({
        certificateOfOccupancyDate: coDate,
    }, { transaction });
    return closeout;
}
/**
 * 25. SCHEDULE OWNER TRAINING
 * Schedules owner training session
 */
async function scheduleOwnerTraining(closeoutId, trainingDate, transaction) {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    await closeout.update({
        ownerTrainingRequired: true,
        ownerTrainingDate: trainingDate,
        status: closeout_types_1.CloseoutStatus.OWNER_TRAINING_SCHEDULED,
    }, { transaction });
    return closeout;
}
/**
 * 26. COMPLETE OWNER TRAINING
 * Marks owner training as completed
 */
async function completeOwnerTraining(closeoutId, completionDate, certificateDocumentId, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (!closeout) {
            throw new Error('Closeout not found');
        }
        await closeout.update({
            ownerTrainingCompleted: true,
            ownerTrainingDate: completionDate,
            status: closeout_types_1.CloseoutStatus.OWNER_TRAINING_COMPLETE,
        }, { transaction: t });
        await recalculateCloseoutCompletion(closeoutId, t);
        if (shouldCommit) {
            await t.commit();
        }
        return closeout;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 27. REGISTER WARRANTY
 * Registers a warranty for equipment or materials
 */
async function registerWarranty(closeoutId, warrantyData, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await CloseoutDocument.sequelize.transaction();
    try {
        const document = await CloseoutDocument.create({
            closeoutId,
            ...warrantyData,
            status: closeout_types_1.DocumentStatus.PENDING,
            version: '1.0',
            required: true,
        }, { transaction: t });
        // Update closeout warranty dates
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (closeout) {
            const updates = {};
            if (!closeout.warrantyStartDate || warrantyData.warrantyStartDate < closeout.warrantyStartDate) {
                updates.warrantyStartDate = warrantyData.warrantyStartDate;
            }
            if (!closeout.warrantyEndDate || warrantyData.warrantyEndDate > closeout.warrantyEndDate) {
                updates.warrantyEndDate = warrantyData.warrantyEndDate;
            }
            if (Object.keys(updates).length > 0) {
                await closeout.update(updates, { transaction: t });
            }
        }
        if (shouldCommit) {
            await t.commit();
        }
        return document;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 28. GET EXPIRING WARRANTIES
 * Retrieves warranties expiring within a specified period
 */
async function getExpiringWarranties(daysUntilExpiration, projectId) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysUntilExpiration);
    const where = {
        documentType: {
            [sequelize_1.Op.in]: [
                closeout_types_1.CloseoutDocumentType.WARRANTY_CERTIFICATE,
                closeout_types_1.CloseoutDocumentType.EQUIPMENT_WARRANTY,
                closeout_types_1.CloseoutDocumentType.MATERIAL_WARRANTY,
            ],
        },
        expirationDate: {
            [sequelize_1.Op.between]: [new Date(), expirationDate],
        },
    };
    const include = [];
    if (projectId) {
        include.push({
            model: ConstructionCloseout,
            as: 'closeout',
            where: { projectId },
            required: true,
        });
    }
    const documents = await CloseoutDocument.findAll({
        where,
        include: include.length > 0 ? include : undefined,
        order: [['expirationDate', 'ASC']],
    });
    return documents;
}
/**
 * 29. PROCESS FINAL PAYMENT
 * Processes the final payment for a closeout
 */
async function processFinalPayment(closeoutId, paymentStatus, paymentDate, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (!closeout) {
            throw new Error('Closeout not found');
        }
        const updates = {
            finalPaymentStatus: paymentStatus,
        };
        if (paymentStatus === closeout_types_1.PaymentStatus.PAID && paymentDate) {
            updates.finalPaymentDate = paymentDate;
        }
        await closeout.update(updates, { transaction: t });
        await recalculateCloseoutCompletion(closeoutId, t);
        if (shouldCommit) {
            await t.commit();
        }
        return closeout;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 30. RECORD LIEN RELEASE
 * Records receipt of a lien release
 */
async function recordLienRelease(closeoutId, lienReleaseData, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await CloseoutDocument.sequelize.transaction();
    try {
        const document = await CloseoutDocument.create({
            closeoutId,
            documentType: closeout_types_1.CloseoutDocumentType.LIEN_RELEASE,
            title: lienReleaseData.title,
            description: `Lien release from ${lienReleaseData.contractorName}`,
            fileUrl: lienReleaseData.fileUrl,
            fileName: lienReleaseData.fileName,
            status: lienReleaseData.fileUrl ? closeout_types_1.DocumentStatus.SUBMITTED : closeout_types_1.DocumentStatus.PENDING,
            version: '1.0',
            required: true,
        }, { transaction: t });
        // Update closeout lien release counters
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (closeout && lienReleaseData.fileUrl) {
            await closeout.increment('lienReleasesReceived', { transaction: t });
            await recalculateCloseoutCompletion(closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return document;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 31. GET LIEN RELEASE STATUS
 * Gets the lien release status for a closeout
 */
async function getLienReleaseStatus(closeoutId) {
    const closeout = await ConstructionCloseout.findByPk(closeoutId);
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    const documents = await getDocumentsByType(closeoutId, [closeout_types_1.CloseoutDocumentType.LIEN_RELEASE]);
    return {
        required: closeout.lienReleasesRequired,
        received: closeout.lienReleasesReceived,
        pending: closeout.lienReleasesRequired - closeout.lienReleasesReceived,
        documents,
    };
}
/**
 * 32. CREATE CLOSEOUT CHECKLIST
 * Creates a closeout checklist document
 */
async function createCloseoutChecklist(closeoutId, checklistItems, transaction) {
    const document = await CloseoutDocument.create({
        closeoutId,
        documentType: closeout_types_1.CloseoutDocumentType.CLOSEOUT_CHECKLIST,
        title: 'Construction Closeout Checklist',
        status: closeout_types_1.DocumentStatus.IN_PROGRESS,
        version: '1.0',
        required: true,
        metadata: { checklistItems },
    }, { transaction });
    return document;
}
/**
 * 33. UPDATE CLOSEOUT CHECKLIST
 * Updates the closeout checklist
 */
async function updateCloseoutChecklist(documentId, checklistItems, transaction) {
    const document = await CloseoutDocument.findByPk(documentId, { transaction });
    if (!document) {
        throw new Error('Checklist document not found');
    }
    const allRequiredCompleted = checklistItems
        .filter((item) => item.required)
        .every((item) => item.completed);
    await document.update({
        metadata: { checklistItems },
        status: allRequiredCompleted ? closeout_types_1.DocumentStatus.APPROVED : closeout_types_1.DocumentStatus.IN_PROGRESS,
    }, { transaction });
    return document;
}
/**
 * 34. GET CLOSEOUT CHECKLIST STATUS
 * Gets the status of the closeout checklist
 */
async function getCloseoutChecklistStatus(closeoutId) {
    const checklist = await CloseoutDocument.findOne({
        where: {
            closeoutId,
            documentType: closeout_types_1.CloseoutDocumentType.CLOSEOUT_CHECKLIST,
        },
    });
    if (!checklist || !checklist.metadata?.checklistItems) {
        return {
            totalItems: 0,
            completedItems: 0,
            requiredItems: 0,
            completedRequiredItems: 0,
            percentComplete: 0,
        };
    }
    const items = checklist.metadata.checklistItems;
    const totalItems = items.length;
    const completedItems = items.filter((item) => item.completed).length;
    const requiredItems = items.filter((item) => item.required).length;
    const completedRequiredItems = items.filter((item) => item.required && item.completed).length;
    return {
        totalItems,
        completedItems,
        requiredItems,
        completedRequiredItems,
        percentComplete: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
        checklist,
    };
}
/**
 * 35. CREATE LESSONS LEARNED DOCUMENT
 * Creates a lessons learned document
 */
async function createLessonsLearnedDocument(closeoutId, lessonsData, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await CloseoutDocument.sequelize.transaction();
    try {
        const document = await CloseoutDocument.create({
            closeoutId,
            documentType: closeout_types_1.CloseoutDocumentType.LESSONS_LEARNED,
            title: 'Project Lessons Learned',
            status: closeout_types_1.DocumentStatus.IN_PROGRESS,
            version: '1.0',
            required: true,
            metadata: lessonsData,
        }, { transaction: t });
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (closeout) {
            await closeout.update({ lessonsLearnedCompleted: true }, { transaction: t });
            await recalculateCloseoutCompletion(closeoutId, t);
        }
        if (shouldCommit) {
            await t.commit();
        }
        return document;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 36. GET CLOSEOUT COMPLETION STATUS
 * Gets detailed completion status for a closeout
 */
async function getCloseoutCompletionStatus(closeoutId) {
    const closeout = await ConstructionCloseout.findByPk(closeoutId);
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    const closedItems = closeout.totalPunchListItems - closeout.openPunchListItems;
    return {
        closeout,
        punchListStatus: {
            total: closeout.totalPunchListItems,
            open: closeout.openPunchListItems,
            closed: closedItems,
            percentComplete: closeout.totalPunchListItems > 0
                ? (closedItems / closeout.totalPunchListItems) * 100
                : 100,
        },
        documentStatus: {
            required: closeout.requiredDocumentsCount,
            submitted: closeout.submittedDocumentsCount,
            approved: closeout.approvedDocumentsCount,
            percentComplete: closeout.requiredDocumentsCount > 0
                ? (closeout.approvedDocumentsCount / closeout.requiredDocumentsCount) * 100
                : 100,
        },
        inspectionStatus: {
            scheduled: closeout.finalInspectionScheduled,
            completed: closeout.finalInspectionResult !== undefined && closeout.finalInspectionResult !== null,
            passed: closeout.finalInspectionResult === closeout_types_1.InspectionResult.PASSED,
        },
        trainingStatus: {
            required: closeout.ownerTrainingRequired,
            completed: closeout.ownerTrainingCompleted,
        },
        paymentStatus: {
            status: closeout.finalPaymentStatus,
            paid: closeout.finalPaymentStatus === closeout_types_1.PaymentStatus.PAID,
        },
        lienReleaseStatus: {
            required: closeout.lienReleasesRequired,
            received: closeout.lienReleasesReceived,
            percentComplete: closeout.lienReleasesRequired > 0
                ? (closeout.lienReleasesReceived / closeout.lienReleasesRequired) * 100
                : 100,
        },
        overallCompletion: closeout.completionPercentage,
    };
}
/**
 * 37. MARK SUBSTANTIAL COMPLETION
 * Marks a project as substantially complete
 */
async function markSubstantialCompletion(closeoutId, completionDate, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (!closeout) {
            throw new Error('Closeout not found');
        }
        await closeout.update({
            substantialCompletionDate: completionDate,
            status: closeout_types_1.CloseoutStatus.SUBSTANTIALLY_COMPLETE,
        }, { transaction: t });
        await recalculateCloseoutCompletion(closeoutId, t);
        if (shouldCommit) {
            await t.commit();
        }
        return closeout;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 38. MARK FINAL COMPLETION
 * Marks a project as fully complete
 */
async function markFinalCompletion(closeoutId, completionDate, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
        if (!closeout) {
            throw new Error('Closeout not found');
        }
        // Validate all requirements are met
        const status = await getCloseoutCompletionStatus(closeoutId);
        if (status.punchListStatus.open > 0) {
            throw new Error('Cannot mark final completion with open punch list items');
        }
        if (status.documentStatus.approved < status.documentStatus.required) {
            throw new Error('Cannot mark final completion with unapproved required documents');
        }
        await closeout.update({
            finalCompletionDate: completionDate,
            status: closeout_types_1.CloseoutStatus.FULLY_COMPLETE,
            completionPercentage: 100,
        }, { transaction: t });
        if (shouldCommit) {
            await t.commit();
        }
        return closeout;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 39. GET CLOSEOUTS BY STATUS
 * Retrieves closeouts filtered by status
 */
async function getCloseoutsByStatus(status, options) {
    const where = {
        status: { [sequelize_1.Op.in]: status },
    };
    if (options?.projectId) {
        where.projectId = options.projectId;
    }
    if (options?.contractorId) {
        where.contractorId = options.contractorId;
    }
    const { count, rows } = await ConstructionCloseout.findAndCountAll({
        where,
        limit: options?.limit,
        offset: options?.offset,
        order: [['createdAt', 'DESC']],
    });
    return { closeouts: rows, total: count };
}
/**
 * 40. GET ACTIVE CLOSEOUTS
 * Retrieves all active (non-complete) closeouts
 */
async function getActiveCloseouts(projectId) {
    const where = {
        status: {
            [sequelize_1.Op.notIn]: [closeout_types_1.CloseoutStatus.FULLY_COMPLETE, closeout_types_1.CloseoutStatus.CANCELLED],
        },
    };
    if (projectId) {
        where.projectId = projectId;
    }
    const closeouts = await ConstructionCloseout.findAll({
        where,
        include: [
            {
                model: PunchListItem,
                as: 'punchListItems',
                where: {
                    status: {
                        [sequelize_1.Op.notIn]: [closeout_types_1.PunchListItemStatus.CLOSED, closeout_types_1.PunchListItemStatus.CANCELLED],
                    },
                },
                required: false,
            },
        ],
        order: [['createdAt', 'DESC']],
    });
    return closeouts;
}
/**
 * 41. GET CLOSEOUT SUMMARY REPORT
 * Generates a comprehensive summary report for a closeout
 */
async function getCloseoutSummaryReport(closeoutId) {
    const closeout = await getCloseoutByIdWithAssociations(closeoutId, {
        includePunchList: true,
        includeDocuments: true,
    });
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    const completionStatus = await getCloseoutCompletionStatus(closeoutId);
    // Aggregate punch list items
    const punchListByStatus = {};
    const punchListByPriority = {};
    const punchListByCategory = {};
    closeout.punchListItems?.forEach((item) => {
        punchListByStatus[item.status] = (punchListByStatus[item.status] || 0) + 1;
        punchListByPriority[item.priority] = (punchListByPriority[item.priority] || 0) + 1;
        punchListByCategory[item.category] = (punchListByCategory[item.category] || 0) + 1;
    });
    // Aggregate documents
    const documentByType = {};
    const documentByStatus = {};
    closeout.documents?.forEach((doc) => {
        documentByType[doc.documentType] = (documentByType[doc.documentType] || 0) + 1;
        documentByStatus[doc.status] = (documentByStatus[doc.status] || 0) + 1;
    });
    return {
        closeout,
        completionStatus,
        punchListSummary: {
            byStatus: punchListByStatus,
            byPriority: punchListByPriority,
            byCategory: punchListByCategory,
        },
        documentSummary: {
            byType: documentByType,
            byStatus: documentByStatus,
        },
        timeline: {
            created: closeout.createdAt,
            substantialCompletion: closeout.substantialCompletionDate,
            finalInspection: closeout.finalInspectionDate,
            ownerTraining: closeout.ownerTrainingDate,
            finalCompletion: closeout.finalCompletionDate,
        },
    };
}
/**
 * 42. SEARCH CLOSEOUTS
 * Searches closeouts with multiple criteria
 */
async function searchCloseouts(criteria, options) {
    const where = {};
    if (criteria.projectName) {
        where.projectName = { [sequelize_1.Op.iLike]: `%${criteria.projectName}%` };
    }
    if (criteria.contractorName) {
        where.contractorName = { [sequelize_1.Op.iLike]: `%${criteria.contractorName}%` };
    }
    if (criteria.status && criteria.status.length > 0) {
        where.status = { [sequelize_1.Op.in]: criteria.status };
    }
    if (criteria.minCompletionPercentage !== undefined) {
        where.completionPercentage = { [sequelize_1.Op.gte]: criteria.minCompletionPercentage };
    }
    if (criteria.maxCompletionPercentage !== undefined) {
        where.completionPercentage = {
            ...where.completionPercentage,
            [sequelize_1.Op.lte]: criteria.maxCompletionPercentage,
        };
    }
    if (criteria.dateFrom) {
        where.createdAt = { [sequelize_1.Op.gte]: criteria.dateFrom };
    }
    if (criteria.dateTo) {
        where.createdAt = {
            ...where.createdAt,
            [sequelize_1.Op.lte]: criteria.dateTo,
        };
    }
    const { count, rows } = await ConstructionCloseout.findAndCountAll({
        where,
        limit: options?.limit,
        offset: options?.offset,
        order: [[options?.orderBy || 'createdAt', options?.orderDirection || 'DESC']],
    });
    return { closeouts: rows, total: count };
}
/**
 * 43. GET CLOSEOUTS PENDING FINAL PAYMENT
 * Retrieves closeouts awaiting final payment
 */
async function getCloseoutsPendingFinalPayment() {
    const closeouts = await ConstructionCloseout.findAll({
        where: {
            finalPaymentStatus: {
                [sequelize_1.Op.in]: [closeout_types_1.PaymentStatus.PENDING, closeout_types_1.PaymentStatus.APPROVED],
            },
            status: {
                [sequelize_1.Op.in]: [
                    closeout_types_1.CloseoutStatus.SUBSTANTIALLY_COMPLETE,
                    closeout_types_1.CloseoutStatus.FULLY_COMPLETE,
                ],
            },
        },
        order: [['substantialCompletionDate', 'ASC']],
    });
    return closeouts;
}
/**
 * 44. DELETE CLOSEOUT
 * Soft deletes a closeout and all associated records
 */
async function deleteCloseout(id, transaction) {
    const shouldCommit = !transaction;
    const t = transaction || await ConstructionCloseout.sequelize.transaction();
    try {
        const closeout = await ConstructionCloseout.findByPk(id, { transaction: t });
        if (!closeout) {
            throw new Error('Closeout not found');
        }
        // Delete associated records
        await PunchListItem.destroy({
            where: { closeoutId: id },
            transaction: t,
        });
        await CloseoutDocument.destroy({
            where: { closeoutId: id },
            transaction: t,
        });
        // Delete closeout
        await closeout.destroy({ transaction: t });
        if (shouldCommit) {
            await t.commit();
        }
        return true;
    }
    catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
        throw error;
    }
}
/**
 * 45. EXPORT CLOSEOUT DATA
 * Exports complete closeout data with all associations
 */
async function exportCloseoutData(closeoutId) {
    const closeout = await getCloseoutByIdWithAssociations(closeoutId, {
        includePunchList: true,
        includeDocuments: true,
    });
    if (!closeout) {
        throw new Error('Closeout not found');
    }
    const summary = await getCloseoutSummaryReport(closeoutId);
    return {
        closeout,
        punchListItems: closeout.punchListItems || [],
        documents: closeout.documents || [],
        summary,
    };
}
// ====================================================================
// HELPER FUNCTIONS
// ====================================================================
/**
 * Updates punch list counters for a closeout
 */
async function updateCloseoutPunchListCounters(closeoutId, transaction) {
    const items = await PunchListItem.findAll({
        where: { closeoutId },
        transaction,
    });
    const openItems = items.filter((item) => ![closeout_types_1.PunchListItemStatus.CLOSED, closeout_types_1.PunchListItemStatus.CANCELLED].includes(item.status)).length;
    const criticalItems = items.filter((item) => item.priority === closeout_types_1.PunchListItemPriority.CRITICAL &&
        ![closeout_types_1.PunchListItemStatus.CLOSED, closeout_types_1.PunchListItemStatus.CANCELLED].includes(item.status)).length;
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
    if (closeout) {
        await closeout.update({
            totalPunchListItems: items.length,
            openPunchListItems: openItems,
            criticalPunchListItems: criticalItems,
        }, { transaction });
    }
}
/**
 * Recalculates overall completion percentage for a closeout
 */
async function recalculateCloseoutCompletion(closeoutId, transaction) {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
    if (!closeout) {
        return;
    }
    let totalWeight = 0;
    let completedWeight = 0;
    // Punch list completion (40% weight)
    totalWeight += 40;
    if (closeout.totalPunchListItems > 0) {
        const closedItems = closeout.totalPunchListItems - closeout.openPunchListItems;
        completedWeight += (closedItems / closeout.totalPunchListItems) * 40;
    }
    else {
        completedWeight += 40;
    }
    // Document completion (30% weight)
    totalWeight += 30;
    if (closeout.requiredDocumentsCount > 0) {
        completedWeight += (closeout.approvedDocumentsCount / closeout.requiredDocumentsCount) * 30;
    }
    else {
        completedWeight += 30;
    }
    // Final inspection (10% weight)
    totalWeight += 10;
    if (closeout.finalInspectionResult === closeout_types_1.InspectionResult.PASSED) {
        completedWeight += 10;
    }
    // Owner training (10% weight)
    totalWeight += 10;
    if (!closeout.ownerTrainingRequired || closeout.ownerTrainingCompleted) {
        completedWeight += 10;
    }
    // Final payment (10% weight)
    totalWeight += 10;
    if (closeout.finalPaymentStatus === closeout_types_1.PaymentStatus.PAID) {
        completedWeight += 10;
    }
    const completionPercentage = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    await closeout.update({ completionPercentage }, { transaction });
}
// ====================================================================
// EXPORTS
// ====================================================================
exports.default = {
    // Models
    ConstructionCloseout,
    PunchListItem,
    CloseoutDocument,
    // Enums
    CloseoutStatus: closeout_types_1.CloseoutStatus,
    PunchListItemStatus: closeout_types_1.PunchListItemStatus,
    PunchListItemPriority: closeout_types_1.PunchListItemPriority,
    PunchListItemCategory: closeout_types_1.PunchListItemCategory,
    CloseoutDocumentType: closeout_types_1.CloseoutDocumentType,
    DocumentStatus: closeout_types_1.DocumentStatus,
    InspectionResult: closeout_types_1.InspectionResult,
    TrainingStatus,
    PaymentStatus: closeout_types_1.PaymentStatus,
    // DTOs
    CreateConstructionCloseoutDto: create_construction_closeout_dto_1.CreateConstructionCloseoutDto,
    UpdateConstructionCloseoutDto: update_construction_closeout_dto_1.UpdateConstructionCloseoutDto,
    CreatePunchListItemDto: create_punch_list_item_dto_1.CreatePunchListItemDto,
    UpdatePunchListItemDto: update_punch_list_item_dto_1.UpdatePunchListItemDto,
    CreateCloseoutDocumentDto: create_closeout_document_dto_1.CreateCloseoutDocumentDto,
    UpdateCloseoutDocumentDto: update_closeout_document_dto_1.UpdateCloseoutDocumentDto,
    // Functions
    createConstructionCloseout,
    getCloseoutByIdWithAssociations,
    updateCloseoutStatus,
    createPunchListItem,
    getPunchListItemsForCloseout,
    updatePunchListItemStatus,
    assignPunchListItem,
    getCriticalPunchListItems,
    getOverduePunchListItems,
    bulkUpdatePunchListItems,
    createCloseoutDocument,
    uploadCloseoutDocument,
    submitCloseoutDocument,
    approveCloseoutDocument,
    rejectCloseoutDocument,
    getDocumentsByType,
    getPendingDocuments,
    getAsBuiltDocuments,
    getWarrantyDocuments,
    getOMManuals,
    getTrainingMaterials,
    scheduleFinalInspection,
    recordFinalInspectionResult,
    recordCertificateOfOccupancy,
    scheduleOwnerTraining,
    completeOwnerTraining,
    registerWarranty,
    getExpiringWarranties,
    processFinalPayment,
    recordLienRelease,
    getLienReleaseStatus,
    createCloseoutChecklist,
    updateCloseoutChecklist,
    getCloseoutChecklistStatus,
    createLessonsLearnedDocument,
    getCloseoutCompletionStatus,
    markSubstantialCompletion,
    markFinalCompletion,
    getCloseoutsByStatus,
    getActiveCloseouts,
    getCloseoutSummaryReport,
    searchCloseouts,
    getCloseoutsPendingFinalPayment,
    deleteCloseout,
    exportCloseoutData,
};
//# sourceMappingURL=construction-closeout-management-kit.js.map