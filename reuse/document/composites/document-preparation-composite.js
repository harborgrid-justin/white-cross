"use strict";
/**
 * LOC: DOCPREP001
 * File: /reuse/document/composites/document-preparation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-templates-kit
 *   - ../document-forms-kit
 *   - ../document-forms-advanced-kit
 *   - ../document-assembly-kit
 *   - ../document-pdf-advanced-kit
 *
 * DOWNSTREAM (imported by):
 *   - Template creation services
 *   - Form builder modules
 *   - Document assembly engines
 *   - PDF generation services
 *   - Field placement tools
 *   - Healthcare document preparation dashboards
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplatePreview = exports.groupFieldsBySection = exports.calculateOptimalFieldPositions = exports.convertMeasurementUnit = exports.generateFieldName = exports.importTemplateFromJSON = exports.exportTemplateToJSON = exports.validateTemplateStructure = exports.createPDFEncryption = exports.createWatermark = exports.createPDFOptions = exports.calculatePageDimensions = exports.createLayoutConfig = exports.assembleDocument = exports.addComponentToAssembly = exports.createDocumentAssembly = exports.renderConditionalSections = exports.createConditionalSection = exports.evaluateConditionalRule = exports.createConditionalRule = exports.addFieldOption = exports.validateFormFieldPlacement = exports.createFormField = exports.applyTextTransform = exports.formatNumber = exports.formatDate = exports.formatMergeFieldValue = exports.mergeTemplateData = exports.validateMergeFieldValue = exports.createMergeField = exports.removeMergeFieldFromTemplate = exports.addMergeFieldToTemplate = exports.updateTemplateVersion = exports.cloneTemplate = exports.createDocumentTemplate = exports.DocumentAssemblyConfigModel = exports.FormFieldConfigModel = exports.DocumentTemplateModel = exports.WatermarkPosition = exports.ComponentType = exports.FormFieldType = exports.LogicalOperator = exports.ConditionalOperator = exports.TextTransform = exports.MergeFieldType = exports.MeasurementUnit = exports.PageOrientation = exports.PageSize = exports.ContentFormat = exports.TemplateCategory = void 0;
exports.DocumentPreparationService = void 0;
/**
 * File: /reuse/document/composites/document-preparation-composite.ts
 * Locator: WC-DOC-PREPARATION-001
 * Purpose: Comprehensive Document Preparation Toolkit - Production-ready template creation and form design
 *
 * Upstream: Composed from document-templates-kit, document-forms-kit, document-forms-advanced-kit, document-assembly-kit, document-pdf-advanced-kit
 * Downstream: ../backend/*, Template services, Form builders, Document assembly, PDF generation, Field management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 48 utility functions for template creation, form design, field placement, document assembly, PDF generation
 *
 * LLM Context: Enterprise-grade document preparation toolkit for White Cross healthcare platform.
 * Provides comprehensive document preparation capabilities including template creation and management,
 * dynamic form field design, intelligent field positioning, document assembly from components, PDF
 * manipulation and generation, merge field handling, conditional content rendering, and HIPAA-compliant
 * document structure validation. Composes functions from multiple document kits to provide unified
 * preparation operations for patient forms, medical records templates, insurance claim forms, and
 * administrative healthcare documents.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
/**
 * Template categories
 */
var TemplateCategory;
(function (TemplateCategory) {
    TemplateCategory["PATIENT_FORMS"] = "PATIENT_FORMS";
    TemplateCategory["CONSENT_FORMS"] = "CONSENT_FORMS";
    TemplateCategory["MEDICAL_RECORDS"] = "MEDICAL_RECORDS";
    TemplateCategory["INSURANCE_CLAIMS"] = "INSURANCE_CLAIMS";
    TemplateCategory["PRESCRIPTIONS"] = "PRESCRIPTIONS";
    TemplateCategory["LAB_REPORTS"] = "LAB_REPORTS";
    TemplateCategory["DISCHARGE_SUMMARIES"] = "DISCHARGE_SUMMARIES";
    TemplateCategory["REFERRAL_LETTERS"] = "REFERRAL_LETTERS";
    TemplateCategory["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    TemplateCategory["CUSTOM"] = "CUSTOM";
})(TemplateCategory || (exports.TemplateCategory = TemplateCategory = {}));
/**
 * Content formats
 */
var ContentFormat;
(function (ContentFormat) {
    ContentFormat["HTML"] = "HTML";
    ContentFormat["PDF"] = "PDF";
    ContentFormat["DOCX"] = "DOCX";
    ContentFormat["MARKDOWN"] = "MARKDOWN";
    ContentFormat["PLAIN_TEXT"] = "PLAIN_TEXT";
})(ContentFormat || (exports.ContentFormat = ContentFormat = {}));
/**
 * Page sizes
 */
var PageSize;
(function (PageSize) {
    PageSize["LETTER"] = "LETTER";
    PageSize["A4"] = "A4";
    PageSize["LEGAL"] = "LEGAL";
    PageSize["EXECUTIVE"] = "EXECUTIVE";
    PageSize["CUSTOM"] = "CUSTOM";
})(PageSize || (exports.PageSize = PageSize = {}));
/**
 * Page orientations
 */
var PageOrientation;
(function (PageOrientation) {
    PageOrientation["PORTRAIT"] = "PORTRAIT";
    PageOrientation["LANDSCAPE"] = "LANDSCAPE";
})(PageOrientation || (exports.PageOrientation = PageOrientation = {}));
/**
 * Measurement units
 */
var MeasurementUnit;
(function (MeasurementUnit) {
    MeasurementUnit["PIXELS"] = "PIXELS";
    MeasurementUnit["POINTS"] = "POINTS";
    MeasurementUnit["INCHES"] = "INCHES";
    MeasurementUnit["MILLIMETERS"] = "MILLIMETERS";
})(MeasurementUnit || (exports.MeasurementUnit = MeasurementUnit = {}));
/**
 * Merge field types
 */
var MergeFieldType;
(function (MergeFieldType) {
    MergeFieldType["TEXT"] = "TEXT";
    MergeFieldType["NUMBER"] = "NUMBER";
    MergeFieldType["DATE"] = "DATE";
    MergeFieldType["BOOLEAN"] = "BOOLEAN";
    MergeFieldType["EMAIL"] = "EMAIL";
    MergeFieldType["PHONE"] = "PHONE";
    MergeFieldType["ADDRESS"] = "ADDRESS";
    MergeFieldType["CURRENCY"] = "CURRENCY";
    MergeFieldType["PERCENTAGE"] = "PERCENTAGE";
    MergeFieldType["LIST"] = "LIST";
    MergeFieldType["OBJECT"] = "OBJECT";
})(MergeFieldType || (exports.MergeFieldType = MergeFieldType = {}));
/**
 * Text transformations
 */
var TextTransform;
(function (TextTransform) {
    TextTransform["UPPERCASE"] = "UPPERCASE";
    TextTransform["LOWERCASE"] = "LOWERCASE";
    TextTransform["CAPITALIZE"] = "CAPITALIZE";
    TextTransform["TITLE_CASE"] = "TITLE_CASE";
    TextTransform["NONE"] = "NONE";
})(TextTransform || (exports.TextTransform = TextTransform = {}));
/**
 * Conditional operators
 */
var ConditionalOperator;
(function (ConditionalOperator) {
    ConditionalOperator["EQUALS"] = "EQUALS";
    ConditionalOperator["NOT_EQUALS"] = "NOT_EQUALS";
    ConditionalOperator["GREATER_THAN"] = "GREATER_THAN";
    ConditionalOperator["LESS_THAN"] = "LESS_THAN";
    ConditionalOperator["GREATER_THAN_OR_EQUAL"] = "GREATER_THAN_OR_EQUAL";
    ConditionalOperator["LESS_THAN_OR_EQUAL"] = "LESS_THAN_OR_EQUAL";
    ConditionalOperator["CONTAINS"] = "CONTAINS";
    ConditionalOperator["NOT_CONTAINS"] = "NOT_CONTAINS";
    ConditionalOperator["STARTS_WITH"] = "STARTS_WITH";
    ConditionalOperator["ENDS_WITH"] = "ENDS_WITH";
    ConditionalOperator["IS_EMPTY"] = "IS_EMPTY";
    ConditionalOperator["IS_NOT_EMPTY"] = "IS_NOT_EMPTY";
})(ConditionalOperator || (exports.ConditionalOperator = ConditionalOperator = {}));
/**
 * Logical operators for combining rules
 */
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator["AND"] = "AND";
    LogicalOperator["OR"] = "OR";
    LogicalOperator["NOT"] = "NOT";
})(LogicalOperator || (exports.LogicalOperator = LogicalOperator = {}));
/**
 * Form field types
 */
var FormFieldType;
(function (FormFieldType) {
    FormFieldType["TEXT_INPUT"] = "TEXT_INPUT";
    FormFieldType["TEXT_AREA"] = "TEXT_AREA";
    FormFieldType["NUMBER_INPUT"] = "NUMBER_INPUT";
    FormFieldType["DATE_PICKER"] = "DATE_PICKER";
    FormFieldType["TIME_PICKER"] = "TIME_PICKER";
    FormFieldType["DATETIME_PICKER"] = "DATETIME_PICKER";
    FormFieldType["CHECKBOX"] = "CHECKBOX";
    FormFieldType["RADIO_GROUP"] = "RADIO_GROUP";
    FormFieldType["DROPDOWN"] = "DROPDOWN";
    FormFieldType["MULTI_SELECT"] = "MULTI_SELECT";
    FormFieldType["FILE_UPLOAD"] = "FILE_UPLOAD";
    FormFieldType["SIGNATURE"] = "SIGNATURE";
    FormFieldType["INITIAL"] = "INITIAL";
    FormFieldType["EMAIL_INPUT"] = "EMAIL_INPUT";
    FormFieldType["PHONE_INPUT"] = "PHONE_INPUT";
    FormFieldType["ADDRESS_INPUT"] = "ADDRESS_INPUT";
    FormFieldType["CUSTOM"] = "CUSTOM";
})(FormFieldType || (exports.FormFieldType = FormFieldType = {}));
/**
 * Component types
 */
var ComponentType;
(function (ComponentType) {
    ComponentType["TEMPLATE"] = "TEMPLATE";
    ComponentType["STATIC_CONTENT"] = "STATIC_CONTENT";
    ComponentType["DYNAMIC_CONTENT"] = "DYNAMIC_CONTENT";
    ComponentType["PAGE_BREAK"] = "PAGE_BREAK";
    ComponentType["TABLE"] = "TABLE";
    ComponentType["IMAGE"] = "IMAGE";
    ComponentType["CHART"] = "CHART";
})(ComponentType || (exports.ComponentType = ComponentType = {}));
/**
 * Watermark positions
 */
var WatermarkPosition;
(function (WatermarkPosition) {
    WatermarkPosition["CENTER"] = "CENTER";
    WatermarkPosition["TOP_LEFT"] = "TOP_LEFT";
    WatermarkPosition["TOP_RIGHT"] = "TOP_RIGHT";
    WatermarkPosition["BOTTOM_LEFT"] = "BOTTOM_LEFT";
    WatermarkPosition["BOTTOM_RIGHT"] = "BOTTOM_RIGHT";
    WatermarkPosition["DIAGONAL"] = "DIAGONAL";
})(WatermarkPosition || (exports.WatermarkPosition = WatermarkPosition = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Document Template Model
 * Stores document template configurations
 */
let DocumentTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_templates',
            timestamps: true,
            indexes: [
                { fields: ['category'] },
                { fields: ['isActive'] },
                { fields: ['version'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _mergeFields_decorators;
    let _mergeFields_initializers = [];
    let _mergeFields_extraInitializers = [];
    let _conditionalSections_decorators;
    let _conditionalSections_initializers = [];
    let _conditionalSections_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    var DocumentTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.version = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.content = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.mergeFields = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _mergeFields_initializers, void 0));
            this.conditionalSections = (__runInitializers(this, _mergeFields_extraInitializers), __runInitializers(this, _conditionalSections_initializers, void 0));
            this.metadata = (__runInitializers(this, _conditionalSections_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.isActive = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            __runInitializers(this, _isActive_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique template identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Template name' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiPropertyOptional)({ description: 'Template description' })];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(TemplateCategory))), (0, swagger_1.ApiProperty)({ enum: TemplateCategory, description: 'Template category' })];
        _version_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Template version' })];
        _content_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Template content structure' })];
        _mergeFields_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Merge fields', type: [Object] })];
        _conditionalSections_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Conditional sections', type: [Object] })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _isActive_decorators = [(0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether template is active' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _mergeFields_decorators, { kind: "field", name: "mergeFields", static: false, private: false, access: { has: obj => "mergeFields" in obj, get: obj => obj.mergeFields, set: (obj, value) => { obj.mergeFields = value; } }, metadata: _metadata }, _mergeFields_initializers, _mergeFields_extraInitializers);
        __esDecorate(null, null, _conditionalSections_decorators, { kind: "field", name: "conditionalSections", static: false, private: false, access: { has: obj => "conditionalSections" in obj, get: obj => obj.conditionalSections, set: (obj, value) => { obj.conditionalSections = value; } }, metadata: _metadata }, _conditionalSections_initializers, _conditionalSections_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentTemplateModel = _classThis;
})();
exports.DocumentTemplateModel = DocumentTemplateModel;
/**
 * Form Field Configuration Model
 * Stores form field definitions
 */
let FormFieldConfigModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'form_field_configs',
            timestamps: true,
            indexes: [
                { fields: ['type'] },
                { fields: ['required'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let _helpText_decorators;
    let _helpText_initializers = [];
    let _helpText_extraInitializers = [];
    let _validation_decorators;
    let _validation_initializers = [];
    let _validation_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _readOnly_decorators;
    let _readOnly_initializers = [];
    let _readOnly_extraInitializers = [];
    let _options_decorators;
    let _options_initializers = [];
    let _options_extraInitializers = [];
    let _conditional_decorators;
    let _conditional_initializers = [];
    let _conditional_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var FormFieldConfigModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.label = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _label_initializers, void 0));
            this.type = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.position = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _position_initializers, void 0));
            this.dimensions = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
            this.placeholder = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _placeholder_initializers, void 0));
            this.helpText = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _helpText_initializers, void 0));
            this.validation = (__runInitializers(this, _helpText_extraInitializers), __runInitializers(this, _validation_initializers, void 0));
            this.required = (__runInitializers(this, _validation_extraInitializers), __runInitializers(this, _required_initializers, void 0));
            this.readOnly = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _readOnly_initializers, void 0));
            this.options = (__runInitializers(this, _readOnly_extraInitializers), __runInitializers(this, _options_initializers, void 0));
            this.conditional = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _conditional_initializers, void 0));
            this.metadata = (__runInitializers(this, _conditional_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FormFieldConfigModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique field identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Field name' })];
        _label_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Field label' })];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(FormFieldType))), (0, swagger_1.ApiProperty)({ enum: FormFieldType, description: 'Field type' })];
        _position_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Field position' })];
        _dimensions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Field dimensions' })];
        _placeholder_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiPropertyOptional)({ description: 'Placeholder text' })];
        _helpText_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiPropertyOptional)({ description: 'Help text' })];
        _validation_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Validation rules' })];
        _required_decorators = [(0, sequelize_typescript_1.Default)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether field is required' })];
        _readOnly_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether field is read-only' })];
        _options_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Field options', type: [Object] })];
        _conditional_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Conditional rules' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
        __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
        __esDecorate(null, null, _placeholder_decorators, { kind: "field", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
        __esDecorate(null, null, _helpText_decorators, { kind: "field", name: "helpText", static: false, private: false, access: { has: obj => "helpText" in obj, get: obj => obj.helpText, set: (obj, value) => { obj.helpText = value; } }, metadata: _metadata }, _helpText_initializers, _helpText_extraInitializers);
        __esDecorate(null, null, _validation_decorators, { kind: "field", name: "validation", static: false, private: false, access: { has: obj => "validation" in obj, get: obj => obj.validation, set: (obj, value) => { obj.validation = value; } }, metadata: _metadata }, _validation_initializers, _validation_extraInitializers);
        __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
        __esDecorate(null, null, _readOnly_decorators, { kind: "field", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
        __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: obj => "options" in obj, get: obj => obj.options, set: (obj, value) => { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
        __esDecorate(null, null, _conditional_decorators, { kind: "field", name: "conditional", static: false, private: false, access: { has: obj => "conditional" in obj, get: obj => obj.conditional, set: (obj, value) => { obj.conditional = value; } }, metadata: _metadata }, _conditional_initializers, _conditional_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FormFieldConfigModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FormFieldConfigModel = _classThis;
})();
exports.FormFieldConfigModel = FormFieldConfigModel;
/**
 * Document Assembly Configuration Model
 * Stores document assembly configurations
 */
let DocumentAssemblyConfigModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_assembly_configs',
            timestamps: true,
            indexes: [
                { fields: ['outputFormat'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _assemblyOrder_decorators;
    let _assemblyOrder_initializers = [];
    let _assemblyOrder_extraInitializers = [];
    let _mergeData_decorators;
    let _mergeData_initializers = [];
    let _mergeData_extraInitializers = [];
    let _outputFormat_decorators;
    let _outputFormat_initializers = [];
    let _outputFormat_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var DocumentAssemblyConfigModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.components = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _components_initializers, void 0));
            this.assemblyOrder = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _assemblyOrder_initializers, void 0));
            this.mergeData = (__runInitializers(this, _assemblyOrder_extraInitializers), __runInitializers(this, _mergeData_initializers, void 0));
            this.outputFormat = (__runInitializers(this, _mergeData_extraInitializers), __runInitializers(this, _outputFormat_initializers, void 0));
            this.metadata = (__runInitializers(this, _outputFormat_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentAssemblyConfigModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique assembly configuration identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Configuration name' })];
        _components_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Assembly components', type: [Object] })];
        _assemblyOrder_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)), (0, swagger_1.ApiProperty)({ description: 'Component assembly order' })];
        _mergeData_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Merge data for assembly' })];
        _outputFormat_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ContentFormat))), (0, swagger_1.ApiProperty)({ enum: ContentFormat, description: 'Output format' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
        __esDecorate(null, null, _assemblyOrder_decorators, { kind: "field", name: "assemblyOrder", static: false, private: false, access: { has: obj => "assemblyOrder" in obj, get: obj => obj.assemblyOrder, set: (obj, value) => { obj.assemblyOrder = value; } }, metadata: _metadata }, _assemblyOrder_initializers, _assemblyOrder_extraInitializers);
        __esDecorate(null, null, _mergeData_decorators, { kind: "field", name: "mergeData", static: false, private: false, access: { has: obj => "mergeData" in obj, get: obj => obj.mergeData, set: (obj, value) => { obj.mergeData = value; } }, metadata: _metadata }, _mergeData_initializers, _mergeData_extraInitializers);
        __esDecorate(null, null, _outputFormat_decorators, { kind: "field", name: "outputFormat", static: false, private: false, access: { has: obj => "outputFormat" in obj, get: obj => obj.outputFormat, set: (obj, value) => { obj.outputFormat = value; } }, metadata: _metadata }, _outputFormat_initializers, _outputFormat_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentAssemblyConfigModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentAssemblyConfigModel = _classThis;
})();
exports.DocumentAssemblyConfigModel = DocumentAssemblyConfigModel;
// ============================================================================
// CORE DOCUMENT PREPARATION FUNCTIONS
// ============================================================================
/**
 * Creates a new document template.
 *
 * @param {string} name - Template name
 * @param {TemplateCategory} category - Template category
 * @param {TemplateContent} content - Template content
 * @param {Partial<DocumentTemplate>} options - Additional options
 * @returns {DocumentTemplate} Created template
 *
 * @example
 * ```typescript
 * const template = createDocumentTemplate('Patient Intake Form', TemplateCategory.PATIENT_FORMS, content);
 * ```
 */
const createDocumentTemplate = (name, category, content, options) => {
    return {
        id: crypto.randomUUID(),
        name,
        description: options?.description,
        category,
        version: options?.version || '1.0.0',
        content,
        mergeFields: options?.mergeFields || [],
        conditionalSections: options?.conditionalSections || [],
        metadata: options?.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: options?.isActive ?? true,
    };
};
exports.createDocumentTemplate = createDocumentTemplate;
/**
 * Clones an existing template with a new name.
 *
 * @param {DocumentTemplate} template - Template to clone
 * @param {string} newName - New template name
 * @returns {DocumentTemplate} Cloned template
 *
 * @example
 * ```typescript
 * const cloned = cloneTemplate(originalTemplate, 'New Patient Form V2');
 * ```
 */
const cloneTemplate = (template, newName) => {
    return {
        ...template,
        id: crypto.randomUUID(),
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.cloneTemplate = cloneTemplate;
/**
 * Updates template version.
 *
 * @param {DocumentTemplate} template - Template to update
 * @param {string} newVersion - New version number
 * @returns {DocumentTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = updateTemplateVersion(template, '2.0.0');
 * ```
 */
const updateTemplateVersion = (template, newVersion) => {
    return {
        ...template,
        version: newVersion,
        updatedAt: new Date(),
    };
};
exports.updateTemplateVersion = updateTemplateVersion;
/**
 * Adds a merge field to template.
 *
 * @param {DocumentTemplate} template - Template to update
 * @param {MergeField} mergeField - Merge field to add
 * @returns {DocumentTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = addMergeFieldToTemplate(template, patientNameField);
 * ```
 */
const addMergeFieldToTemplate = (template, mergeField) => {
    return {
        ...template,
        mergeFields: [...template.mergeFields, mergeField],
        updatedAt: new Date(),
    };
};
exports.addMergeFieldToTemplate = addMergeFieldToTemplate;
/**
 * Removes a merge field from template.
 *
 * @param {DocumentTemplate} template - Template to update
 * @param {string} fieldId - Field ID to remove
 * @returns {DocumentTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = removeMergeFieldFromTemplate(template, 'field123');
 * ```
 */
const removeMergeFieldFromTemplate = (template, fieldId) => {
    return {
        ...template,
        mergeFields: template.mergeFields.filter((f) => f.id !== fieldId),
        updatedAt: new Date(),
    };
};
exports.removeMergeFieldFromTemplate = removeMergeFieldFromTemplate;
/**
 * Creates a merge field definition.
 *
 * @param {string} name - Field name
 * @param {string} label - Field label
 * @param {MergeFieldType} type - Field type
 * @param {Partial<MergeField>} options - Additional options
 * @returns {MergeField} Merge field
 *
 * @example
 * ```typescript
 * const field = createMergeField('patient_name', 'Patient Name', MergeFieldType.TEXT, {required: true});
 * ```
 */
const createMergeField = (name, label, type, options) => {
    return {
        id: crypto.randomUUID(),
        name,
        label,
        type,
        defaultValue: options?.defaultValue,
        format: options?.format,
        validation: options?.validation,
        required: options?.required ?? false,
        metadata: options?.metadata,
    };
};
exports.createMergeField = createMergeField;
/**
 * Validates merge field value against validation rules.
 *
 * @param {any} value - Value to validate
 * @param {MergeField} field - Merge field with validation rules
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateMergeFieldValue('test@example.com', emailField);
 * ```
 */
const validateMergeFieldValue = (value, field) => {
    const errors = [];
    if (field.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field.label} is required`);
    }
    if (!field.validation)
        return errors;
    const validation = field.validation;
    if (typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
            errors.push(`${field.label} must be at least ${validation.minLength} characters`);
        }
        if (validation.maxLength && value.length > validation.maxLength) {
            errors.push(`${field.label} must be at most ${validation.maxLength} characters`);
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            errors.push(validation.errorMessage || `${field.label} format is invalid`);
        }
    }
    if (typeof value === 'number') {
        if (validation.minValue !== undefined && value < validation.minValue) {
            errors.push(`${field.label} must be at least ${validation.minValue}`);
        }
        if (validation.maxValue !== undefined && value > validation.maxValue) {
            errors.push(`${field.label} must be at most ${validation.maxValue}`);
        }
    }
    return errors;
};
exports.validateMergeFieldValue = validateMergeFieldValue;
/**
 * Merges data into template.
 *
 * @param {DocumentTemplate} template - Template to merge
 * @param {Record<string, any>} data - Data to merge
 * @returns {string} Merged content
 *
 * @example
 * ```typescript
 * const merged = mergeTemplateData(template, {patient_name: 'John Doe', date: '2025-01-01'});
 * ```
 */
const mergeTemplateData = (template, data) => {
    let mergedContent = template.content.body;
    template.mergeFields.forEach((field) => {
        const value = data[field.name] || field.defaultValue || '';
        const formattedValue = (0, exports.formatMergeFieldValue)(value, field);
        const placeholder = new RegExp(`{{\\s*${field.name}\\s*}}`, 'g');
        mergedContent = mergedContent.replace(placeholder, formattedValue);
    });
    return mergedContent;
};
exports.mergeTemplateData = mergeTemplateData;
/**
 * Formats merge field value according to field format.
 *
 * @param {any} value - Value to format
 * @param {MergeField} field - Merge field with format rules
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * const formatted = formatMergeFieldValue(1234.56, currencyField);
 * ```
 */
const formatMergeFieldValue = (value, field) => {
    if (value === undefined || value === null)
        return '';
    if (!field.format)
        return String(value);
    const format = field.format;
    // Date formatting
    if (field.type === MergeFieldType.DATE && value instanceof Date) {
        return format.dateFormat
            ? (0, exports.formatDate)(value, format.dateFormat)
            : value.toISOString().split('T')[0];
    }
    // Number formatting
    if (field.type === MergeFieldType.NUMBER && typeof value === 'number') {
        if (format.numberFormat) {
            return (0, exports.formatNumber)(value, format.numberFormat);
        }
    }
    // Text transformation
    if (typeof value === 'string' && format.textTransform) {
        return (0, exports.applyTextTransform)(value, format.textTransform);
    }
    return String(value);
};
exports.formatMergeFieldValue = formatMergeFieldValue;
/**
 * Formats a date according to format string.
 *
 * @param {Date} date - Date to format
 * @param {string} formatString - Format string (e.g., 'YYYY-MM-DD')
 * @returns {string} Formatted date
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(), 'MM/DD/YYYY');
 * ```
 */
const formatDate = (date, formatString) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return formatString
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
};
exports.formatDate = formatDate;
/**
 * Formats a number according to number format configuration.
 *
 * @param {number} value - Number to format
 * @param {NumberFormat} format - Number format configuration
 * @returns {string} Formatted number
 *
 * @example
 * ```typescript
 * const formatted = formatNumber(1234.56, {decimals: 2, thousandsSeparator: ',', decimalSeparator: '.'});
 * ```
 */
const formatNumber = (value, format) => {
    const parts = value.toFixed(format.decimals).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator);
    const decimalPart = parts[1] || '';
    const formattedNumber = decimalPart ? `${integerPart}${format.decimalSeparator}${decimalPart}` : integerPart;
    return `${format.prefix || ''}${formattedNumber}${format.suffix || ''}`;
};
exports.formatNumber = formatNumber;
/**
 * Applies text transformation to string.
 *
 * @param {string} text - Text to transform
 * @param {TextTransform} transform - Transformation type
 * @returns {string} Transformed text
 *
 * @example
 * ```typescript
 * const transformed = applyTextTransform('hello world', TextTransform.TITLE_CASE);
 * ```
 */
const applyTextTransform = (text, transform) => {
    switch (transform) {
        case TextTransform.UPPERCASE:
            return text.toUpperCase();
        case TextTransform.LOWERCASE:
            return text.toLowerCase();
        case TextTransform.CAPITALIZE:
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        case TextTransform.TITLE_CASE:
            return text
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        default:
            return text;
    }
};
exports.applyTextTransform = applyTextTransform;
/**
 * Creates a form field definition.
 *
 * @param {string} name - Field name
 * @param {string} label - Field label
 * @param {FormFieldType} type - Field type
 * @param {Position} position - Field position
 * @param {Partial<FormField>} options - Additional options
 * @returns {FormField} Form field
 *
 * @example
 * ```typescript
 * const field = createFormField('email', 'Email Address', FormFieldType.EMAIL_INPUT, {x: 100, y: 200, unit: MeasurementUnit.PIXELS});
 * ```
 */
const createFormField = (name, label, type, position, options) => {
    return {
        id: crypto.randomUUID(),
        name,
        label,
        type,
        position,
        dimensions: options?.dimensions || { width: 200, height: 30, unit: MeasurementUnit.PIXELS },
        value: options?.value,
        placeholder: options?.placeholder,
        helpText: options?.helpText,
        validation: options?.validation,
        required: options?.required ?? false,
        readOnly: options?.readOnly ?? false,
        options: options?.options,
        conditional: options?.conditional,
        metadata: options?.metadata,
    };
};
exports.createFormField = createFormField;
/**
 * Validates form field placement on page.
 *
 * @param {FormField} field - Form field
 * @param {Dimensions} pageSize - Page dimensions
 * @returns {boolean} True if placement is valid
 *
 * @example
 * ```typescript
 * const isValid = validateFormFieldPlacement(field, {width: 612, height: 792, unit: MeasurementUnit.POINTS});
 * ```
 */
const validateFormFieldPlacement = (field, pageSize) => {
    return (field.position.x >= 0 &&
        field.position.y >= 0 &&
        field.position.x + field.dimensions.width <= pageSize.width &&
        field.position.y + field.dimensions.height <= pageSize.height);
};
exports.validateFormFieldPlacement = validateFormFieldPlacement;
/**
 * Adds a field option to select/radio field.
 *
 * @param {FormField} field - Form field
 * @param {FieldOption} option - Field option to add
 * @returns {FormField} Updated field
 *
 * @example
 * ```typescript
 * const updated = addFieldOption(dropdownField, {value: 'option1', label: 'Option 1'});
 * ```
 */
const addFieldOption = (field, option) => {
    return {
        ...field,
        options: [...(field.options || []), option],
    };
};
exports.addFieldOption = addFieldOption;
/**
 * Creates a conditional rule for dynamic content.
 *
 * @param {string} field - Field name to evaluate
 * @param {ConditionalOperator} operator - Comparison operator
 * @param {any} value - Value to compare against
 * @param {Partial<ConditionalRule>} options - Additional options
 * @returns {ConditionalRule} Conditional rule
 *
 * @example
 * ```typescript
 * const rule = createConditionalRule('age', ConditionalOperator.GREATER_THAN, 18);
 * ```
 */
const createConditionalRule = (field, operator, value, options) => {
    return {
        field,
        operator,
        value,
        logicalOperator: options?.logicalOperator,
        nestedRules: options?.nestedRules,
    };
};
exports.createConditionalRule = createConditionalRule;
/**
 * Evaluates a conditional rule against data.
 *
 * @param {ConditionalRule} rule - Conditional rule
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {boolean} True if condition is met
 *
 * @example
 * ```typescript
 * const result = evaluateConditionalRule(rule, {age: 25, name: 'John'});
 * ```
 */
const evaluateConditionalRule = (rule, data) => {
    const fieldValue = data[rule.field];
    let result = false;
    switch (rule.operator) {
        case ConditionalOperator.EQUALS:
            result = fieldValue === rule.value;
            break;
        case ConditionalOperator.NOT_EQUALS:
            result = fieldValue !== rule.value;
            break;
        case ConditionalOperator.GREATER_THAN:
            result = fieldValue > rule.value;
            break;
        case ConditionalOperator.LESS_THAN:
            result = fieldValue < rule.value;
            break;
        case ConditionalOperator.GREATER_THAN_OR_EQUAL:
            result = fieldValue >= rule.value;
            break;
        case ConditionalOperator.LESS_THAN_OR_EQUAL:
            result = fieldValue <= rule.value;
            break;
        case ConditionalOperator.CONTAINS:
            result = String(fieldValue).includes(String(rule.value));
            break;
        case ConditionalOperator.NOT_CONTAINS:
            result = !String(fieldValue).includes(String(rule.value));
            break;
        case ConditionalOperator.STARTS_WITH:
            result = String(fieldValue).startsWith(String(rule.value));
            break;
        case ConditionalOperator.ENDS_WITH:
            result = String(fieldValue).endsWith(String(rule.value));
            break;
        case ConditionalOperator.IS_EMPTY:
            result = !fieldValue || fieldValue === '';
            break;
        case ConditionalOperator.IS_NOT_EMPTY:
            result = !!fieldValue && fieldValue !== '';
            break;
    }
    // Handle nested rules with logical operators
    if (rule.nestedRules && rule.nestedRules.length > 0) {
        const nestedResults = rule.nestedRules.map((nested) => (0, exports.evaluateConditionalRule)(nested, data));
        switch (rule.logicalOperator) {
            case LogicalOperator.AND:
                result = result && nestedResults.every((r) => r);
                break;
            case LogicalOperator.OR:
                result = result || nestedResults.some((r) => r);
                break;
            case LogicalOperator.NOT:
                result = !result;
                break;
        }
    }
    return result;
};
exports.evaluateConditionalRule = evaluateConditionalRule;
/**
 * Creates a conditional section for template.
 *
 * @param {string} sectionId - Section identifier
 * @param {ConditionalRule} condition - Conditional rule
 * @param {string} content - Content to show if condition is true
 * @param {string} alternateContent - Content to show if condition is false
 * @returns {ConditionalSection} Conditional section
 *
 * @example
 * ```typescript
 * const section = createConditionalSection('adult_section', ageRule, adultContent, minorContent);
 * ```
 */
const createConditionalSection = (sectionId, condition, content, alternateContent) => {
    return {
        id: crypto.randomUUID(),
        sectionId,
        condition,
        content,
        alternateContent,
    };
};
exports.createConditionalSection = createConditionalSection;
/**
 * Renders conditional sections based on data.
 *
 * @param {ConditionalSection[]} sections - Conditional sections
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {Record<string, string>} Rendered sections
 *
 * @example
 * ```typescript
 * const rendered = renderConditionalSections(sections, formData);
 * ```
 */
const renderConditionalSections = (sections, data) => {
    const rendered = {};
    sections.forEach((section) => {
        const conditionMet = (0, exports.evaluateConditionalRule)(section.condition, data);
        rendered[section.sectionId] = conditionMet
            ? section.content
            : section.alternateContent || '';
    });
    return rendered;
};
exports.renderConditionalSections = renderConditionalSections;
/**
 * Creates a document assembly configuration.
 *
 * @param {string} name - Assembly configuration name
 * @param {AssemblyComponent[]} components - Assembly components
 * @param {ContentFormat} outputFormat - Output format
 * @param {Partial<DocumentAssemblyConfig>} options - Additional options
 * @returns {DocumentAssemblyConfig} Assembly configuration
 *
 * @example
 * ```typescript
 * const config = createDocumentAssembly('Patient Discharge Summary', components, ContentFormat.PDF);
 * ```
 */
const createDocumentAssembly = (name, components, outputFormat, options) => {
    return {
        id: crypto.randomUUID(),
        name,
        components,
        assemblyOrder: options?.assemblyOrder || components.map((c) => c.id),
        mergeData: options?.mergeData || {},
        outputFormat,
        metadata: options?.metadata,
    };
};
exports.createDocumentAssembly = createDocumentAssembly;
/**
 * Adds a component to document assembly.
 *
 * @param {DocumentAssemblyConfig} assembly - Assembly configuration
 * @param {AssemblyComponent} component - Component to add
 * @returns {DocumentAssemblyConfig} Updated assembly
 *
 * @example
 * ```typescript
 * const updated = addComponentToAssembly(assembly, headerComponent);
 * ```
 */
const addComponentToAssembly = (assembly, component) => {
    return {
        ...assembly,
        components: [...assembly.components, component],
        assemblyOrder: [...assembly.assemblyOrder, component.id],
    };
};
exports.addComponentToAssembly = addComponentToAssembly;
/**
 * Assembles document from components.
 *
 * @param {DocumentAssemblyConfig} config - Assembly configuration
 * @returns {string} Assembled document content
 *
 * @example
 * ```typescript
 * const document = assembleDocument(assemblyConfig);
 * ```
 */
const assembleDocument = (config) => {
    const assembledParts = [];
    config.assemblyOrder.forEach((componentId) => {
        const component = config.components.find((c) => c.id === componentId);
        if (!component)
            return;
        // Check conditional rendering
        if (component.conditional) {
            const shouldRender = (0, exports.evaluateConditionalRule)(component.conditional, config.mergeData);
            if (!shouldRender)
                return;
        }
        // Add component content
        if (component.type === ComponentType.TEMPLATE && component.templateId) {
            // Template would be loaded and merged here
            assembledParts.push(`[Template: ${component.templateId}]`);
        }
        else if (component.content) {
            assembledParts.push(component.content);
        }
        else if (component.type === ComponentType.PAGE_BREAK) {
            assembledParts.push('\n\n--- PAGE BREAK ---\n\n');
        }
    });
    return assembledParts.join('\n\n');
};
exports.assembleDocument = assembleDocument;
/**
 * Creates a layout configuration.
 *
 * @param {PageSize} pageSize - Page size
 * @param {PageOrientation} orientation - Page orientation
 * @param {PageMargins} margins - Page margins
 * @param {Partial<LayoutConfig>} options - Additional options
 * @returns {LayoutConfig} Layout configuration
 *
 * @example
 * ```typescript
 * const layout = createLayoutConfig(PageSize.LETTER, PageOrientation.PORTRAIT, standardMargins);
 * ```
 */
const createLayoutConfig = (pageSize, orientation, margins, options) => {
    return {
        pageSize,
        orientation,
        margins,
        header: options?.header,
        footer: options?.footer,
        columns: options?.columns || 1,
    };
};
exports.createLayoutConfig = createLayoutConfig;
/**
 * Calculates page dimensions for standard page sizes.
 *
 * @param {PageSize} pageSize - Page size
 * @param {PageOrientation} orientation - Page orientation
 * @returns {Dimensions} Page dimensions in points
 *
 * @example
 * ```typescript
 * const dimensions = calculatePageDimensions(PageSize.LETTER, PageOrientation.PORTRAIT);
 * ```
 */
const calculatePageDimensions = (pageSize, orientation) => {
    const sizes = {
        [PageSize.LETTER]: { width: 612, height: 792 },
        [PageSize.A4]: { width: 595, height: 842 },
        [PageSize.LEGAL]: { width: 612, height: 1008 },
        [PageSize.EXECUTIVE]: { width: 522, height: 756 },
        [PageSize.CUSTOM]: { width: 612, height: 792 },
    };
    const size = sizes[pageSize];
    return orientation === PageOrientation.LANDSCAPE
        ? { width: size.height, height: size.width, unit: MeasurementUnit.POINTS }
        : { width: size.width, height: size.height, unit: MeasurementUnit.POINTS };
};
exports.calculatePageDimensions = calculatePageDimensions;
/**
 * Creates PDF generation options.
 *
 * @param {Partial<PDFGenerationOptions>} options - PDF options
 * @returns {PDFGenerationOptions} PDF generation options
 *
 * @example
 * ```typescript
 * const pdfOptions = createPDFOptions({pageSize: PageSize.A4, compress: true});
 * ```
 */
const createPDFOptions = (options) => {
    return {
        pageSize: options?.pageSize || PageSize.LETTER,
        orientation: options?.orientation || PageOrientation.PORTRAIT,
        margins: options?.margins || {
            top: 72,
            right: 72,
            bottom: 72,
            left: 72,
            unit: MeasurementUnit.POINTS,
        },
        embedFonts: options?.embedFonts ?? true,
        compress: options?.compress ?? true,
        encryption: options?.encryption,
        watermark: options?.watermark,
        metadata: options?.metadata || {},
    };
};
exports.createPDFOptions = createPDFOptions;
/**
 * Creates a watermark configuration.
 *
 * @param {string} text - Watermark text
 * @param {Partial<Watermark>} options - Watermark options
 * @returns {Watermark} Watermark configuration
 *
 * @example
 * ```typescript
 * const watermark = createWatermark('CONFIDENTIAL', {opacity: 0.3, rotation: 45});
 * ```
 */
const createWatermark = (text, options) => {
    return {
        text,
        opacity: options?.opacity || 0.3,
        rotation: options?.rotation || 45,
        fontSize: options?.fontSize || 48,
        color: options?.color || '#999999',
        position: options?.position || WatermarkPosition.DIAGONAL,
    };
};
exports.createWatermark = createWatermark;
/**
 * Creates PDF encryption settings.
 *
 * @param {Partial<PDFEncryption>} options - Encryption options
 * @returns {PDFEncryption} Encryption settings
 *
 * @example
 * ```typescript
 * const encryption = createPDFEncryption({userPassword: 'user123', ownerPassword: 'owner456'});
 * ```
 */
const createPDFEncryption = (options) => {
    return {
        userPassword: options?.userPassword,
        ownerPassword: options?.ownerPassword,
        permissions: options?.permissions || {
            printing: true,
            modifying: false,
            copying: false,
            annotating: true,
            fillingForms: true,
            contentAccessibility: true,
            documentAssembly: false,
        },
    };
};
exports.createPDFEncryption = createPDFEncryption;
/**
 * Validates template structure and integrity.
 *
 * @param {DocumentTemplate} template - Template to validate
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateTemplateStructure(template);
 * ```
 */
const validateTemplateStructure = (template) => {
    const errors = [];
    if (!template.name || template.name.trim() === '') {
        errors.push('Template name is required');
    }
    if (!template.content || !template.content.body) {
        errors.push('Template content is required');
    }
    if (!template.version || !/^\d+\.\d+\.\d+$/.test(template.version)) {
        errors.push('Template version must follow semver format (e.g., 1.0.0)');
    }
    // Validate merge fields
    template.mergeFields.forEach((field, index) => {
        if (!field.name) {
            errors.push(`Merge field ${index + 1} is missing a name`);
        }
        if (!field.label) {
            errors.push(`Merge field ${index + 1} is missing a label`);
        }
    });
    return errors;
};
exports.validateTemplateStructure = validateTemplateStructure;
/**
 * Exports template to JSON format.
 *
 * @param {DocumentTemplate} template - Template to export
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportTemplateToJSON(template);
 * ```
 */
const exportTemplateToJSON = (template) => {
    return JSON.stringify(template, null, 2);
};
exports.exportTemplateToJSON = exportTemplateToJSON;
/**
 * Imports template from JSON format.
 *
 * @param {string} json - JSON string
 * @returns {DocumentTemplate} Imported template
 *
 * @example
 * ```typescript
 * const template = importTemplateFromJSON(jsonString);
 * ```
 */
const importTemplateFromJSON = (json) => {
    const template = JSON.parse(json);
    return {
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
    };
};
exports.importTemplateFromJSON = importTemplateFromJSON;
/**
 * Generates a field name from label.
 *
 * @param {string} label - Field label
 * @returns {string} Generated field name
 *
 * @example
 * ```typescript
 * const name = generateFieldName('Patient Name'); // Returns 'patient_name'
 * ```
 */
const generateFieldName = (label) => {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_');
};
exports.generateFieldName = generateFieldName;
/**
 * Converts measurement units.
 *
 * @param {number} value - Value to convert
 * @param {MeasurementUnit} fromUnit - Source unit
 * @param {MeasurementUnit} toUnit - Target unit
 * @returns {number} Converted value
 *
 * @example
 * ```typescript
 * const inches = convertMeasurementUnit(72, MeasurementUnit.POINTS, MeasurementUnit.INCHES);
 * ```
 */
const convertMeasurementUnit = (value, fromUnit, toUnit) => {
    // Convert to points first
    let points = value;
    switch (fromUnit) {
        case MeasurementUnit.INCHES:
            points = value * 72;
            break;
        case MeasurementUnit.MILLIMETERS:
            points = value * 2.83465;
            break;
        case MeasurementUnit.PIXELS:
            points = value * 0.75;
            break;
    }
    // Convert from points to target unit
    switch (toUnit) {
        case MeasurementUnit.INCHES:
            return points / 72;
        case MeasurementUnit.MILLIMETERS:
            return points / 2.83465;
        case MeasurementUnit.PIXELS:
            return points / 0.75;
        default:
            return points;
    }
};
exports.convertMeasurementUnit = convertMeasurementUnit;
/**
 * Calculates optimal field positions for form layout.
 *
 * @param {FormField[]} fields - Form fields to position
 * @param {LayoutConfig} layout - Layout configuration
 * @returns {FormField[]} Fields with calculated positions
 *
 * @example
 * ```typescript
 * const positioned = calculateOptimalFieldPositions(fields, layout);
 * ```
 */
const calculateOptimalFieldPositions = (fields, layout) => {
    const pageDimensions = (0, exports.calculatePageDimensions)(layout.pageSize, layout.orientation);
    const availableWidth = pageDimensions.width - layout.margins.left - layout.margins.right;
    let currentY = layout.margins.top;
    const fieldSpacing = 10;
    return fields.map((field) => {
        const positioned = {
            ...field,
            position: {
                x: layout.margins.left,
                y: currentY,
                unit: MeasurementUnit.POINTS,
            },
        };
        currentY += field.dimensions.height + fieldSpacing;
        return positioned;
    });
};
exports.calculateOptimalFieldPositions = calculateOptimalFieldPositions;
/**
 * Groups form fields by section.
 *
 * @param {FormField[]} fields - Form fields
 * @param {string} sectionField - Field name containing section identifier
 * @returns {Map<string, FormField[]>} Grouped fields
 *
 * @example
 * ```typescript
 * const grouped = groupFieldsBySection(fields, 'section');
 * ```
 */
const groupFieldsBySection = (fields, sectionField = 'section') => {
    const groups = new Map();
    fields.forEach((field) => {
        const section = field.metadata?.[sectionField] || 'default';
        const group = groups.get(section) || [];
        group.push(field);
        groups.set(section, group);
    });
    return groups;
};
exports.groupFieldsBySection = groupFieldsBySection;
/**
 * Generates template preview HTML.
 *
 * @param {DocumentTemplate} template - Template to preview
 * @param {Record<string, any>} sampleData - Sample data for preview
 * @returns {string} Preview HTML
 *
 * @example
 * ```typescript
 * const html = generateTemplatePreview(template, sampleData);
 * ```
 */
const generateTemplatePreview = (template, sampleData) => {
    const mergedContent = (0, exports.mergeTemplateData)(template, sampleData);
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${template.name} - Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .template-content { border: 1px solid #ccc; padding: 20px; }
        </style>
      </head>
      <body>
        <h1>${template.name}</h1>
        <div class="template-content">${mergedContent}</div>
      </body>
    </html>
  `;
};
exports.generateTemplatePreview = generateTemplatePreview;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Document Preparation Service
 * Production-ready NestJS service for document preparation operations
 */
let DocumentPreparationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DocumentPreparationService = _classThis = class {
        /**
         * Creates and validates a new template
         */
        async createTemplate(name, category, content) {
            const template = (0, exports.createDocumentTemplate)(name, category, content);
            // Validate template structure
            const errors = (0, exports.validateTemplateStructure)(template);
            if (errors.length > 0) {
                throw new Error(`Template validation failed: ${errors.join(', ')}`);
            }
            return template;
        }
        /**
         * Merges data into template and generates document
         */
        async generateDocument(templateId, data) {
            // Implementation would fetch template and merge data
            return 'Generated document content';
        }
    };
    __setFunctionName(_classThis, "DocumentPreparationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentPreparationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentPreparationService = _classThis;
})();
exports.DocumentPreparationService = DocumentPreparationService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    DocumentTemplateModel,
    FormFieldConfigModel,
    DocumentAssemblyConfigModel,
    // Core Functions
    createDocumentTemplate: exports.createDocumentTemplate,
    cloneTemplate: exports.cloneTemplate,
    updateTemplateVersion: exports.updateTemplateVersion,
    addMergeFieldToTemplate: exports.addMergeFieldToTemplate,
    removeMergeFieldFromTemplate: exports.removeMergeFieldFromTemplate,
    createMergeField: exports.createMergeField,
    validateMergeFieldValue: exports.validateMergeFieldValue,
    mergeTemplateData: exports.mergeTemplateData,
    formatMergeFieldValue: exports.formatMergeFieldValue,
    formatDate: exports.formatDate,
    formatNumber: exports.formatNumber,
    applyTextTransform: exports.applyTextTransform,
    createFormField: exports.createFormField,
    validateFormFieldPlacement: exports.validateFormFieldPlacement,
    addFieldOption: exports.addFieldOption,
    createConditionalRule: exports.createConditionalRule,
    evaluateConditionalRule: exports.evaluateConditionalRule,
    createConditionalSection: exports.createConditionalSection,
    renderConditionalSections: exports.renderConditionalSections,
    createDocumentAssembly: exports.createDocumentAssembly,
    addComponentToAssembly: exports.addComponentToAssembly,
    assembleDocument: exports.assembleDocument,
    createLayoutConfig: exports.createLayoutConfig,
    calculatePageDimensions: exports.calculatePageDimensions,
    createPDFOptions: exports.createPDFOptions,
    createWatermark: exports.createWatermark,
    createPDFEncryption: exports.createPDFEncryption,
    validateTemplateStructure: exports.validateTemplateStructure,
    exportTemplateToJSON: exports.exportTemplateToJSON,
    importTemplateFromJSON: exports.importTemplateFromJSON,
    generateFieldName: exports.generateFieldName,
    convertMeasurementUnit: exports.convertMeasurementUnit,
    calculateOptimalFieldPositions: exports.calculateOptimalFieldPositions,
    groupFieldsBySection: exports.groupFieldsBySection,
    generateTemplatePreview: exports.generateTemplatePreview,
    // Services
    DocumentPreparationService,
};
//# sourceMappingURL=document-preparation-composite.js.map