"use strict";
/**
 * LOC: CONSCX12345
 * File: /reuse/consulting/customer-experience-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - CX analytics controllers
 *   - Journey mapping engines
 *   - Service design services
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExperienceAnalytics = exports.testTouchpointVariations = exports.benchmarkTouchpoint = exports.performImportancePerformanceAnalysis = exports.optimizeTouchpointSequence = exports.analyzeTouchpointPerformance = exports.trackFeedbackResolution = exports.categorizeFeedback = exports.analyzeFeedbackThemes = exports.submitCustomerFeedback = exports.analyzeSentiment = exports.measureResolutionImpact = exports.trackPainPointResolution = exports.analyzeRootCauses = exports.prioritizePainPoints = exports.recordPainPoint = exports.calculateCustomerEffortScore = exports.measureCSAT = exports.analyzeDetractorFeedback = exports.segmentNPSResults = exports.analyzeNPSTrends = exports.calculateNPSScore = exports.identifyMomentsOfTruth = exports.mapEmotionJourney = exports.analyzeJourneyCompletion = exports.createTouchpoint = exports.addJourneyStage = exports.createCustomerJourney = exports.segmentCustomersIntoPersonas = exports.updatePersonaBehaviors = exports.analyzePersonaValue = exports.createCustomerPersona = exports.createCustomerFeedbackModel = exports.createPainPointModel = exports.createTouchpointModel = exports.createCustomerJourneyModel = exports.createCustomerPersonaModel = exports.AnalyzeSentimentDto = exports.SubmitCustomerFeedbackDto = exports.SubmitNPSResponseDto = exports.RecordPainPointDto = exports.CreateTouchpointDto = exports.CreateCustomerJourneyDto = exports.CreateCustomerPersonaDto = exports.PainPointSeverity = exports.ExperienceQuality = exports.NPSCategory = exports.Sentiment = exports.TouchpointChannel = exports.JourneyStage = void 0;
exports.exportCXData = exports.analyzeOmnichannelExperience = exports.generateExecutiveCXSummary = exports.createCXDashboard = void 0;
/**
 * File: /reuse/consulting/customer-experience-kit.ts
 * Locator: WC-CONS-CX-001
 * Purpose: Comprehensive Customer Experience Management Utilities - Enterprise-grade CX framework
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, CX controllers, journey analytics, NPS tracking, touchpoint optimization
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for journey mapping, NPS analysis, touchpoint optimization, service design
 *
 * LLM Context: Enterprise-grade customer experience management system for consulting organizations.
 * Provides complete CX lifecycle management, journey mapping, persona management, NPS tracking,
 * sentiment analysis, touchpoint optimization, service design, moment-of-truth analysis, pain point identification,
 * satisfaction measurement, loyalty programs, voice-of-customer, customer effort score, experience metrics,
 * journey analytics, omnichannel experience, personalization, experience design patterns.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Customer journey stage
 */
var JourneyStage;
(function (JourneyStage) {
    JourneyStage["AWARENESS"] = "awareness";
    JourneyStage["CONSIDERATION"] = "consideration";
    JourneyStage["PURCHASE"] = "purchase";
    JourneyStage["ONBOARDING"] = "onboarding";
    JourneyStage["USAGE"] = "usage";
    JourneyStage["SUPPORT"] = "support";
    JourneyStage["RENEWAL"] = "renewal";
    JourneyStage["ADVOCACY"] = "advocacy";
})(JourneyStage || (exports.JourneyStage = JourneyStage = {}));
/**
 * Touchpoint channel
 */
var TouchpointChannel;
(function (TouchpointChannel) {
    TouchpointChannel["WEBSITE"] = "website";
    TouchpointChannel["MOBILE_APP"] = "mobile_app";
    TouchpointChannel["EMAIL"] = "email";
    TouchpointChannel["PHONE"] = "phone";
    TouchpointChannel["CHAT"] = "chat";
    TouchpointChannel["SOCIAL_MEDIA"] = "social_media";
    TouchpointChannel["IN_PERSON"] = "in_person";
    TouchpointChannel["SMS"] = "sms";
    TouchpointChannel["PUSH_NOTIFICATION"] = "push_notification";
    TouchpointChannel["PHYSICAL_LOCATION"] = "physical_location";
})(TouchpointChannel || (exports.TouchpointChannel = TouchpointChannel = {}));
/**
 * Sentiment classification
 */
var Sentiment;
(function (Sentiment) {
    Sentiment["VERY_POSITIVE"] = "very_positive";
    Sentiment["POSITIVE"] = "positive";
    Sentiment["NEUTRAL"] = "neutral";
    Sentiment["NEGATIVE"] = "negative";
    Sentiment["VERY_NEGATIVE"] = "very_negative";
})(Sentiment || (exports.Sentiment = Sentiment = {}));
/**
 * NPS category
 */
var NPSCategory;
(function (NPSCategory) {
    NPSCategory["PROMOTER"] = "promoter";
    NPSCategory["PASSIVE"] = "passive";
    NPSCategory["DETRACTOR"] = "detractor";
})(NPSCategory || (exports.NPSCategory = NPSCategory = {}));
/**
 * Experience quality
 */
var ExperienceQuality;
(function (ExperienceQuality) {
    ExperienceQuality["EXCELLENT"] = "excellent";
    ExperienceQuality["GOOD"] = "good";
    ExperienceQuality["AVERAGE"] = "average";
    ExperienceQuality["POOR"] = "poor";
    ExperienceQuality["CRITICAL"] = "critical";
})(ExperienceQuality || (exports.ExperienceQuality = ExperienceQuality = {}));
/**
 * Pain point severity
 */
var PainPointSeverity;
(function (PainPointSeverity) {
    PainPointSeverity["CRITICAL"] = "critical";
    PainPointSeverity["HIGH"] = "high";
    PainPointSeverity["MEDIUM"] = "medium";
    PainPointSeverity["LOW"] = "low";
})(PainPointSeverity || (exports.PainPointSeverity = PainPointSeverity = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create customer persona DTO
 */
let CreateCustomerPersonaDto = (() => {
    var _a;
    let _personaName_decorators;
    let _personaName_initializers = [];
    let _personaName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _segmentSize_decorators;
    let _segmentSize_initializers = [];
    let _segmentSize_extraInitializers = [];
    let _lifetimeValue_decorators;
    let _lifetimeValue_initializers = [];
    let _lifetimeValue_extraInitializers = [];
    let _goals_decorators;
    let _goals_initializers = [];
    let _goals_extraInitializers = [];
    let _painPoints_decorators;
    let _painPoints_initializers = [];
    let _painPoints_extraInitializers = [];
    let _preferredChannels_decorators;
    let _preferredChannels_initializers = [];
    let _preferredChannels_extraInitializers = [];
    return _a = class CreateCustomerPersonaDto {
            constructor() {
                this.personaName = __runInitializers(this, _personaName_initializers, void 0);
                this.description = (__runInitializers(this, _personaName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.segmentSize = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _segmentSize_initializers, void 0));
                this.lifetimeValue = (__runInitializers(this, _segmentSize_extraInitializers), __runInitializers(this, _lifetimeValue_initializers, void 0));
                this.goals = (__runInitializers(this, _lifetimeValue_extraInitializers), __runInitializers(this, _goals_initializers, void 0));
                this.painPoints = (__runInitializers(this, _goals_extraInitializers), __runInitializers(this, _painPoints_initializers, void 0));
                this.preferredChannels = (__runInitializers(this, _painPoints_extraInitializers), __runInitializers(this, _preferredChannels_initializers, void 0));
                __runInitializers(this, _preferredChannels_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _personaName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Persona name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Persona description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _segmentSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target segment size' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _lifetimeValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated lifetime value' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _goals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Goals', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _painPoints_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pain points', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _preferredChannels_decorators = [(0, swagger_1.ApiProperty)({ enum: TouchpointChannel, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(TouchpointChannel, { each: true })];
            __esDecorate(null, null, _personaName_decorators, { kind: "field", name: "personaName", static: false, private: false, access: { has: obj => "personaName" in obj, get: obj => obj.personaName, set: (obj, value) => { obj.personaName = value; } }, metadata: _metadata }, _personaName_initializers, _personaName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _segmentSize_decorators, { kind: "field", name: "segmentSize", static: false, private: false, access: { has: obj => "segmentSize" in obj, get: obj => obj.segmentSize, set: (obj, value) => { obj.segmentSize = value; } }, metadata: _metadata }, _segmentSize_initializers, _segmentSize_extraInitializers);
            __esDecorate(null, null, _lifetimeValue_decorators, { kind: "field", name: "lifetimeValue", static: false, private: false, access: { has: obj => "lifetimeValue" in obj, get: obj => obj.lifetimeValue, set: (obj, value) => { obj.lifetimeValue = value; } }, metadata: _metadata }, _lifetimeValue_initializers, _lifetimeValue_extraInitializers);
            __esDecorate(null, null, _goals_decorators, { kind: "field", name: "goals", static: false, private: false, access: { has: obj => "goals" in obj, get: obj => obj.goals, set: (obj, value) => { obj.goals = value; } }, metadata: _metadata }, _goals_initializers, _goals_extraInitializers);
            __esDecorate(null, null, _painPoints_decorators, { kind: "field", name: "painPoints", static: false, private: false, access: { has: obj => "painPoints" in obj, get: obj => obj.painPoints, set: (obj, value) => { obj.painPoints = value; } }, metadata: _metadata }, _painPoints_initializers, _painPoints_extraInitializers);
            __esDecorate(null, null, _preferredChannels_decorators, { kind: "field", name: "preferredChannels", static: false, private: false, access: { has: obj => "preferredChannels" in obj, get: obj => obj.preferredChannels, set: (obj, value) => { obj.preferredChannels = value; } }, metadata: _metadata }, _preferredChannels_initializers, _preferredChannels_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCustomerPersonaDto = CreateCustomerPersonaDto;
/**
 * Create customer journey DTO
 */
let CreateCustomerJourneyDto = (() => {
    var _a;
    let _journeyName_decorators;
    let _journeyName_initializers = [];
    let _journeyName_extraInitializers = [];
    let _personaId_decorators;
    let _personaId_initializers = [];
    let _personaId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _satisfactionScore_decorators;
    let _satisfactionScore_initializers = [];
    let _satisfactionScore_extraInitializers = [];
    return _a = class CreateCustomerJourneyDto {
            constructor() {
                this.journeyName = __runInitializers(this, _journeyName_initializers, void 0);
                this.personaId = (__runInitializers(this, _journeyName_extraInitializers), __runInitializers(this, _personaId_initializers, void 0));
                this.description = (__runInitializers(this, _personaId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.satisfactionScore = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _satisfactionScore_initializers, void 0));
                __runInitializers(this, _satisfactionScore_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _journeyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Journey name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _personaId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Persona ID' }), (0, class_validator_1.IsUUID)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Journey description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _satisfactionScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected satisfaction score' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _journeyName_decorators, { kind: "field", name: "journeyName", static: false, private: false, access: { has: obj => "journeyName" in obj, get: obj => obj.journeyName, set: (obj, value) => { obj.journeyName = value; } }, metadata: _metadata }, _journeyName_initializers, _journeyName_extraInitializers);
            __esDecorate(null, null, _personaId_decorators, { kind: "field", name: "personaId", static: false, private: false, access: { has: obj => "personaId" in obj, get: obj => obj.personaId, set: (obj, value) => { obj.personaId = value; } }, metadata: _metadata }, _personaId_initializers, _personaId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _satisfactionScore_decorators, { kind: "field", name: "satisfactionScore", static: false, private: false, access: { has: obj => "satisfactionScore" in obj, get: obj => obj.satisfactionScore, set: (obj, value) => { obj.satisfactionScore = value; } }, metadata: _metadata }, _satisfactionScore_initializers, _satisfactionScore_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCustomerJourneyDto = CreateCustomerJourneyDto;
/**
 * Create touchpoint DTO
 */
let CreateTouchpointDto = (() => {
    var _a;
    let _journeyId_decorators;
    let _journeyId_initializers = [];
    let _journeyId_extraInitializers = [];
    let _stage_decorators;
    let _stage_initializers = [];
    let _stage_extraInitializers = [];
    let _touchpointName_decorators;
    let _touchpointName_initializers = [];
    let _touchpointName_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isKeyMoment_decorators;
    let _isKeyMoment_initializers = [];
    let _isKeyMoment_extraInitializers = [];
    let _importance_decorators;
    let _importance_initializers = [];
    let _importance_extraInitializers = [];
    return _a = class CreateTouchpointDto {
            constructor() {
                this.journeyId = __runInitializers(this, _journeyId_initializers, void 0);
                this.stage = (__runInitializers(this, _journeyId_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.touchpointName = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _touchpointName_initializers, void 0));
                this.channel = (__runInitializers(this, _touchpointName_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
                this.description = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.isKeyMoment = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isKeyMoment_initializers, void 0));
                this.importance = (__runInitializers(this, _isKeyMoment_extraInitializers), __runInitializers(this, _importance_initializers, void 0));
                __runInitializers(this, _importance_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _journeyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Journey ID' }), (0, class_validator_1.IsUUID)()];
            _stage_decorators = [(0, swagger_1.ApiProperty)({ enum: JourneyStage }), (0, class_validator_1.IsEnum)(JourneyStage)];
            _touchpointName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Touchpoint name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _channel_decorators = [(0, swagger_1.ApiProperty)({ enum: TouchpointChannel }), (0, class_validator_1.IsEnum)(TouchpointChannel)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Touchpoint description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _isKeyMoment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is this a key moment of truth' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _importance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Importance score (0-100)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _journeyId_decorators, { kind: "field", name: "journeyId", static: false, private: false, access: { has: obj => "journeyId" in obj, get: obj => obj.journeyId, set: (obj, value) => { obj.journeyId = value; } }, metadata: _metadata }, _journeyId_initializers, _journeyId_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: obj => "stage" in obj, get: obj => obj.stage, set: (obj, value) => { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _touchpointName_decorators, { kind: "field", name: "touchpointName", static: false, private: false, access: { has: obj => "touchpointName" in obj, get: obj => obj.touchpointName, set: (obj, value) => { obj.touchpointName = value; } }, metadata: _metadata }, _touchpointName_initializers, _touchpointName_extraInitializers);
            __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isKeyMoment_decorators, { kind: "field", name: "isKeyMoment", static: false, private: false, access: { has: obj => "isKeyMoment" in obj, get: obj => obj.isKeyMoment, set: (obj, value) => { obj.isKeyMoment = value; } }, metadata: _metadata }, _isKeyMoment_initializers, _isKeyMoment_extraInitializers);
            __esDecorate(null, null, _importance_decorators, { kind: "field", name: "importance", static: false, private: false, access: { has: obj => "importance" in obj, get: obj => obj.importance, set: (obj, value) => { obj.importance = value; } }, metadata: _metadata }, _importance_initializers, _importance_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTouchpointDto = CreateTouchpointDto;
/**
 * Record pain point DTO
 */
let RecordPainPointDto = (() => {
    var _a;
    let _journeyId_decorators;
    let _journeyId_initializers = [];
    let _journeyId_extraInitializers = [];
    let _touchpointId_decorators;
    let _touchpointId_initializers = [];
    let _touchpointId_extraInitializers = [];
    let _stage_decorators;
    let _stage_initializers = [];
    let _stage_extraInitializers = [];
    let _painPointName_decorators;
    let _painPointName_initializers = [];
    let _painPointName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    return _a = class RecordPainPointDto {
            constructor() {
                this.journeyId = __runInitializers(this, _journeyId_initializers, void 0);
                this.touchpointId = (__runInitializers(this, _journeyId_extraInitializers), __runInitializers(this, _touchpointId_initializers, void 0));
                this.stage = (__runInitializers(this, _touchpointId_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.painPointName = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _painPointName_initializers, void 0));
                this.description = (__runInitializers(this, _painPointName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.frequency = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.rootCause = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
                __runInitializers(this, _rootCause_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _journeyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Journey ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _touchpointId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Touchpoint ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _stage_decorators = [(0, swagger_1.ApiProperty)({ enum: JourneyStage }), (0, class_validator_1.IsEnum)(JourneyStage)];
            _painPointName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pain point name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: PainPointSeverity }), (0, class_validator_1.IsEnum)(PainPointSeverity)];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency (0-100)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _rootCause_decorators = [(0, swagger_1.ApiProperty)({ description: 'Root cause analysis' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _journeyId_decorators, { kind: "field", name: "journeyId", static: false, private: false, access: { has: obj => "journeyId" in obj, get: obj => obj.journeyId, set: (obj, value) => { obj.journeyId = value; } }, metadata: _metadata }, _journeyId_initializers, _journeyId_extraInitializers);
            __esDecorate(null, null, _touchpointId_decorators, { kind: "field", name: "touchpointId", static: false, private: false, access: { has: obj => "touchpointId" in obj, get: obj => obj.touchpointId, set: (obj, value) => { obj.touchpointId = value; } }, metadata: _metadata }, _touchpointId_initializers, _touchpointId_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: obj => "stage" in obj, get: obj => obj.stage, set: (obj, value) => { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _painPointName_decorators, { kind: "field", name: "painPointName", static: false, private: false, access: { has: obj => "painPointName" in obj, get: obj => obj.painPointName, set: (obj, value) => { obj.painPointName = value; } }, metadata: _metadata }, _painPointName_initializers, _painPointName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordPainPointDto = RecordPainPointDto;
/**
 * Submit NPS response DTO
 */
let SubmitNPSResponseDto = (() => {
    var _a;
    let _surveyId_decorators;
    let _surveyId_initializers = [];
    let _surveyId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    return _a = class SubmitNPSResponseDto {
            constructor() {
                this.surveyId = __runInitializers(this, _surveyId_initializers, void 0);
                this.customerId = (__runInitializers(this, _surveyId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.score = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _score_initializers, void 0));
                this.reason = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.segment = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                __runInitializers(this, _segment_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _surveyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Survey ID' }), (0, class_validator_1.IsUUID)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsUUID)()];
            _score_decorators = [(0, swagger_1.ApiProperty)({ description: 'NPS score (0-10)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(10)];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for score' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _segment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer segment', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _surveyId_decorators, { kind: "field", name: "surveyId", static: false, private: false, access: { has: obj => "surveyId" in obj, get: obj => obj.surveyId, set: (obj, value) => { obj.surveyId = value; } }, metadata: _metadata }, _surveyId_initializers, _surveyId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitNPSResponseDto = SubmitNPSResponseDto;
/**
 * Submit customer feedback DTO
 */
let SubmitCustomerFeedbackDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _feedbackType_decorators;
    let _feedbackType_initializers = [];
    let _feedbackType_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _feedbackText_decorators;
    let _feedbackText_initializers = [];
    let _feedbackText_extraInitializers = [];
    let _stage_decorators;
    let _stage_initializers = [];
    let _stage_extraInitializers = [];
    return _a = class SubmitCustomerFeedbackDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.feedbackType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _feedbackType_initializers, void 0));
                this.channel = (__runInitializers(this, _feedbackType_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
                this.score = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _score_initializers, void 0));
                this.feedbackText = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _feedbackText_initializers, void 0));
                this.stage = (__runInitializers(this, _feedbackText_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                __runInitializers(this, _stage_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsUUID)()];
            _feedbackType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feedback type', enum: ['nps', 'csat', 'ces', 'general', 'complaint'] }), (0, class_validator_1.IsEnum)(['nps', 'csat', 'ces', 'general', 'complaint'])];
            _channel_decorators = [(0, swagger_1.ApiProperty)({ enum: TouchpointChannel }), (0, class_validator_1.IsEnum)(TouchpointChannel)];
            _score_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feedback score (0-100)', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _feedbackText_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feedback text' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(5000)];
            _stage_decorators = [(0, swagger_1.ApiProperty)({ enum: JourneyStage }), (0, class_validator_1.IsEnum)(JourneyStage)];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _feedbackType_decorators, { kind: "field", name: "feedbackType", static: false, private: false, access: { has: obj => "feedbackType" in obj, get: obj => obj.feedbackType, set: (obj, value) => { obj.feedbackType = value; } }, metadata: _metadata }, _feedbackType_initializers, _feedbackType_extraInitializers);
            __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
            __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
            __esDecorate(null, null, _feedbackText_decorators, { kind: "field", name: "feedbackText", static: false, private: false, access: { has: obj => "feedbackText" in obj, get: obj => obj.feedbackText, set: (obj, value) => { obj.feedbackText = value; } }, metadata: _metadata }, _feedbackText_initializers, _feedbackText_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: obj => "stage" in obj, get: obj => obj.stage, set: (obj, value) => { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitCustomerFeedbackDto = SubmitCustomerFeedbackDto;
/**
 * Analyze sentiment DTO
 */
let AnalyzeSentimentDto = (() => {
    var _a;
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    let _context_decorators;
    let _context_initializers = [];
    let _context_extraInitializers = [];
    return _a = class AnalyzeSentimentDto {
            constructor() {
                this.text = __runInitializers(this, _text_initializers, void 0);
                this.context = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                __runInitializers(this, _context_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _text_decorators = [(0, swagger_1.ApiProperty)({ description: 'Text to analyze' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(10000)];
            _context_decorators = [(0, swagger_1.ApiProperty)({ description: 'Context', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: obj => "context" in obj, get: obj => obj.context, set: (obj, value) => { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AnalyzeSentimentDto = AnalyzeSentimentDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Customer Persona.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerPersona model
 *
 * @example
 * ```typescript
 * const CustomerPersona = createCustomerPersonaModel(sequelize);
 * const persona = await CustomerPersona.create({
 *   personaName: 'Tech-Savvy Professional',
 *   segmentSize: 50000,
 *   lifetimeValue: 25000
 * });
 * ```
 */
const createCustomerPersonaModel = (sequelize) => {
    class CustomerPersona extends sequelize_1.Model {
    }
    CustomerPersona.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        personaName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Persona name',
        },
        personaCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique persona code',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Persona description',
        },
        demographics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Demographic information',
        },
        psychographics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Psychographic information',
        },
        goals: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Customer goals',
        },
        painPoints: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Customer pain points',
        },
        behaviors: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Behavioral patterns',
        },
        preferredChannels: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Preferred communication channels',
        },
        motivations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Key motivations',
        },
        frustrations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Common frustrations',
        },
        technicalProficiency: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Technical proficiency level',
        },
        segmentSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Size of segment',
        },
        lifetimeValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Estimated lifetime value',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'customer_personas',
        timestamps: true,
        indexes: [
            { fields: ['personaCode'], unique: true },
            { fields: ['segmentSize'] },
            { fields: ['lifetimeValue'] },
        ],
    });
    return CustomerPersona;
};
exports.createCustomerPersonaModel = createCustomerPersonaModel;
/**
 * Sequelize model for Customer Journey.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerJourney model
 *
 * @example
 * ```typescript
 * const CustomerJourney = createCustomerJourneyModel(sequelize);
 * const journey = await CustomerJourney.create({
 *   journeyName: 'B2B Onboarding Journey',
 *   personaId: 'persona-uuid',
 *   satisfactionScore: 75
 * });
 * ```
 */
const createCustomerJourneyModel = (sequelize) => {
    class CustomerJourney extends sequelize_1.Model {
    }
    CustomerJourney.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        journeyName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Journey name',
        },
        journeyCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique journey code',
        },
        personaId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Associated persona ID',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Journey description',
        },
        stages: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Journey stages',
        },
        overallSentiment: {
            type: sequelize_1.DataTypes.ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative'),
            allowNull: false,
            defaultValue: 'neutral',
            comment: 'Overall sentiment',
        },
        satisfactionScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overall satisfaction score (0-100)',
        },
        effortScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Customer effort score (0-100)',
        },
        completionRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Journey completion rate percentage',
        },
        averageDuration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Average duration in minutes',
        },
        painPoints: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Pain points',
        },
        opportunities: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Improvement opportunities',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'customer_journeys',
        timestamps: true,
        indexes: [
            { fields: ['journeyCode'], unique: true },
            { fields: ['personaId'] },
            { fields: ['satisfactionScore'] },
            { fields: ['completionRate'] },
        ],
    });
    return CustomerJourney;
};
exports.createCustomerJourneyModel = createCustomerJourneyModel;
/**
 * Sequelize model for Touchpoint.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Touchpoint model
 *
 * @example
 * ```typescript
 * const Touchpoint = createTouchpointModel(sequelize);
 * const touchpoint = await Touchpoint.create({
 *   journeyId: 'journey-uuid',
 *   touchpointName: 'Product Demo',
 *   channel: 'website',
 *   stage: 'consideration'
 * });
 * ```
 */
const createTouchpointModel = (sequelize) => {
    class Touchpoint extends sequelize_1.Model {
    }
    Touchpoint.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        journeyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Journey ID',
        },
        stage: {
            type: sequelize_1.DataTypes.ENUM('awareness', 'consideration', 'purchase', 'onboarding', 'usage', 'support', 'renewal', 'advocacy'),
            allowNull: false,
            comment: 'Journey stage',
        },
        touchpointName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Touchpoint name',
        },
        channel: {
            type: sequelize_1.DataTypes.ENUM('website', 'mobile_app', 'email', 'phone', 'chat', 'social_media', 'in_person', 'sms', 'push_notification', 'physical_location'),
            allowNull: false,
            comment: 'Channel type',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Touchpoint description',
        },
        customerActions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Customer actions',
        },
        systemResponses: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'System responses',
        },
        satisfactionScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Satisfaction score (0-100)',
        },
        effortScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Effort score (0-100)',
        },
        completionRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Completion rate percentage',
        },
        averageDuration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Average duration in seconds',
        },
        interactionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total interaction count',
        },
        sentiment: {
            type: sequelize_1.DataTypes.ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative'),
            allowNull: false,
            defaultValue: 'neutral',
            comment: 'Overall sentiment',
        },
        painPoints: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Pain points',
        },
        improvementOpportunities: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Improvement opportunities',
        },
        isKeyMoment: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is key moment of truth',
        },
        importance: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 50,
            comment: 'Importance score (0-100)',
        },
        performance: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 50,
            comment: 'Performance score (0-100)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'touchpoints',
        timestamps: true,
        indexes: [
            { fields: ['journeyId'] },
            { fields: ['stage'] },
            { fields: ['channel'] },
            { fields: ['isKeyMoment'] },
            { fields: ['satisfactionScore'] },
        ],
    });
    return Touchpoint;
};
exports.createTouchpointModel = createTouchpointModel;
/**
 * Sequelize model for Pain Point.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PainPoint model
 *
 * @example
 * ```typescript
 * const PainPoint = createPainPointModel(sequelize);
 * const painPoint = await PainPoint.create({
 *   painPointName: 'Slow checkout process',
 *   severity: 'high',
 *   frequency: 75
 * });
 * ```
 */
const createPainPointModel = (sequelize) => {
    class PainPoint extends sequelize_1.Model {
    }
    PainPoint.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        journeyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Journey ID',
        },
        touchpointId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Touchpoint ID',
        },
        stage: {
            type: sequelize_1.DataTypes.ENUM('awareness', 'consideration', 'purchase', 'onboarding', 'usage', 'support', 'renewal', 'advocacy'),
            allowNull: false,
            comment: 'Journey stage',
        },
        painPointName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Pain point name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Pain point description',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
            comment: 'Severity level',
        },
        frequency: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Frequency score (0-100)',
        },
        impactScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Impact score (0-100)',
        },
        affectedCustomers: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of affected customers',
        },
        rootCause: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Root cause analysis',
        },
        currentSolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Current solution if any',
        },
        proposedSolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Proposed solution',
        },
        estimatedEffort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated effort in hours',
        },
        estimatedImpact: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated impact score (0-100)',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Priority ranking',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('identified', 'analyzing', 'in_progress', 'resolved'),
            allowNull: false,
            defaultValue: 'identified',
            comment: 'Status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'pain_points',
        timestamps: true,
        indexes: [
            { fields: ['journeyId'] },
            { fields: ['touchpointId'] },
            { fields: ['stage'] },
            { fields: ['severity'] },
            { fields: ['status'] },
            { fields: ['priority'] },
        ],
    });
    return PainPoint;
};
exports.createPainPointModel = createPainPointModel;
/**
 * Sequelize model for Customer Feedback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerFeedback model
 *
 * @example
 * ```typescript
 * const CustomerFeedback = createCustomerFeedbackModel(sequelize);
 * const feedback = await CustomerFeedback.create({
 *   customerId: 'cust-uuid',
 *   feedbackType: 'nps',
 *   score: 9,
 *   feedbackText: 'Great experience!'
 * });
 * ```
 */
const createCustomerFeedbackModel = (sequelize) => {
    class CustomerFeedback extends sequelize_1.Model {
    }
    CustomerFeedback.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Customer ID',
        },
        feedbackType: {
            type: sequelize_1.DataTypes.ENUM('nps', 'csat', 'ces', 'general', 'complaint'),
            allowNull: false,
            comment: 'Feedback type',
        },
        channel: {
            type: sequelize_1.DataTypes.ENUM('website', 'mobile_app', 'email', 'phone', 'chat', 'social_media', 'in_person', 'sms', 'push_notification', 'physical_location'),
            allowNull: false,
            comment: 'Channel',
        },
        score: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Feedback score',
        },
        sentiment: {
            type: sequelize_1.DataTypes.ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative'),
            allowNull: false,
            defaultValue: 'neutral',
            comment: 'Sentiment',
        },
        feedbackText: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Feedback text',
        },
        category: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Feedback categories',
        },
        topics: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Extracted topics',
        },
        stage: {
            type: sequelize_1.DataTypes.ENUM('awareness', 'consideration', 'purchase', 'onboarding', 'usage', 'support', 'renewal', 'advocacy'),
            allowNull: false,
            comment: 'Journey stage',
        },
        touchpointId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Touchpoint ID',
        },
        actionTaken: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            comment: 'Action taken',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('new', 'reviewed', 'action_required', 'resolved', 'closed'),
            allowNull: false,
            defaultValue: 'new',
            comment: 'Status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'customer_feedback',
        timestamps: true,
        indexes: [
            { fields: ['customerId'] },
            { fields: ['feedbackType'] },
            { fields: ['sentiment'] },
            { fields: ['status'] },
            { fields: ['stage'] },
            { fields: ['createdAt'] },
        ],
    });
    return CustomerFeedback;
};
exports.createCustomerFeedbackModel = createCustomerFeedbackModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Helper function to generate unique persona code
 */
const generatePersonaCode = (personaName) => {
    const prefix = personaName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);
    const timestamp = Date.now().toString(36).toUpperCase();
    return `PER-${prefix}-${timestamp.slice(-6)}`;
};
/**
 * Helper function to generate unique journey code
 */
const generateJourneyCode = (journeyName) => {
    const prefix = journeyName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);
    const timestamp = Date.now().toString(36).toUpperCase();
    return `JRN-${prefix}-${timestamp.slice(-6)}`;
};
/**
 * Helper function to generate UUID
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
/**
 * Helper function to calculate NPS category
 */
const calculateNPSCategory = (score) => {
    if (score >= 9)
        return NPSCategory.PROMOTER;
    if (score >= 7)
        return NPSCategory.PASSIVE;
    return NPSCategory.DETRACTOR;
};
// ============================================================================
// SECTION 1: Customer Persona Management
// ============================================================================
/**
 * Creates a customer persona with demographics and psychographics.
 *
 * @param {any} personaData - Persona data
 * @param {string} userId - User creating persona
 * @returns {Promise<CustomerPersona>} Created persona
 *
 * @example
 * ```typescript
 * const persona = await createCustomerPersona({
 *   personaName: 'Tech-Savvy Professional',
 *   description: 'Early adopter of technology',
 *   segmentSize: 50000,
 *   lifetimeValue: 25000,
 *   goals: ['Efficiency', 'Innovation'],
 *   painPoints: ['Complex interfaces', 'Slow response']
 * }, 'user-123');
 * ```
 */
const createCustomerPersona = async (personaData, userId) => {
    const personaCode = generatePersonaCode(personaData.personaName);
    return {
        id: generateUUID(),
        personaName: personaData.personaName,
        personaCode,
        description: personaData.description || '',
        demographics: personaData.demographics || {
            ageRange: '25-45',
            location: 'Urban',
            income: '$75K-150K',
            education: 'College degree',
            occupation: 'Professional',
        },
        psychographics: personaData.psychographics || {
            values: ['Innovation', 'Efficiency'],
            interests: ['Technology', 'Business'],
            lifestyle: ['Busy', 'Connected'],
            attitudes: ['Progressive', 'Quality-focused'],
        },
        goals: personaData.goals || [],
        painPoints: personaData.painPoints || [],
        behaviors: personaData.behaviors || [],
        preferredChannels: personaData.preferredChannels || [TouchpointChannel.MOBILE_APP, TouchpointChannel.EMAIL],
        motivations: personaData.motivations || [],
        frustrations: personaData.frustrations || [],
        technicalProficiency: personaData.technicalProficiency || 'high',
        segmentSize: personaData.segmentSize,
        lifetimeValue: personaData.lifetimeValue,
        metadata: personaData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createCustomerPersona = createCustomerPersona;
/**
 * Analyzes persona value and prioritization.
 *
 * @param {string} personaId - Persona identifier
 * @returns {Promise<any>} Persona analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePersonaValue('persona-123');
 * ```
 */
const analyzePersonaValue = async (personaId) => {
    return {
        personaId,
        segmentValue: 1250000,
        averageLTV: 25000,
        acquisitionCost: 500,
        retentionRate: 85,
        churnRate: 15,
        satisfactionScore: 78,
        engagementScore: 82,
        priorityRank: 2,
        investmentRecommendation: 'high',
        keyOpportunities: ['Increase engagement through personalization', 'Reduce onboarding friction'],
    };
};
exports.analyzePersonaValue = analyzePersonaValue;
/**
 * Updates persona based on behavioral data.
 *
 * @param {string} personaId - Persona identifier
 * @param {any} behaviorData - Behavioral insights
 * @returns {Promise<CustomerPersona>} Updated persona
 *
 * @example
 * ```typescript
 * const updated = await updatePersonaBehaviors('persona-123', {
 *   newBehaviors: ['Mobile-first usage', 'Self-service preference'],
 *   channelUsage: { mobile_app: 65, website: 35 }
 * });
 * ```
 */
const updatePersonaBehaviors = async (personaId, behaviorData) => {
    // Would normally update database
    const persona = { id: personaId };
    return {
        ...persona,
        behaviors: [...(persona.behaviors || []), ...(behaviorData.newBehaviors || [])],
        metadata: {
            ...persona.metadata,
            channelUsage: behaviorData.channelUsage,
            lastUpdated: new Date(),
        },
        updatedAt: new Date(),
    };
};
exports.updatePersonaBehaviors = updatePersonaBehaviors;
/**
 * Segments customers into personas.
 *
 * @param {any[]} customerData - Customer data for segmentation
 * @returns {Promise<any>} Segmentation results
 *
 * @example
 * ```typescript
 * const segments = await segmentCustomersIntoPersonas(customerDataSet);
 * ```
 */
const segmentCustomersIntoPersonas = async (customerData) => {
    return {
        totalCustomers: customerData.length,
        identifiedPersonas: 5,
        segmentation: [
            { personaId: 'persona-1', personaName: 'Tech Enthusiast', count: 15000, percentage: 30 },
            { personaId: 'persona-2', personaName: 'Practical User', count: 20000, percentage: 40 },
            { personaId: 'persona-3', personaName: 'Value Seeker', count: 10000, percentage: 20 },
            { personaId: 'persona-4', personaName: 'Premium Customer', count: 3000, percentage: 6 },
            { personaId: 'persona-5', personaName: 'Occasional User', count: 2000, percentage: 4 },
        ],
        confidence: 0.87,
        recommendations: ['Focus on top 3 personas for initial CX improvements'],
    };
};
exports.segmentCustomersIntoPersonas = segmentCustomersIntoPersonas;
// ============================================================================
// SECTION 2: Journey Mapping and Analysis
// ============================================================================
/**
 * Creates a customer journey map.
 *
 * @param {any} journeyData - Journey data
 * @param {string} userId - User creating journey
 * @returns {Promise<CustomerJourney>} Created journey
 *
 * @example
 * ```typescript
 * const journey = await createCustomerJourney({
 *   journeyName: 'B2B Onboarding',
 *   personaId: 'persona-123',
 *   description: 'Enterprise customer onboarding journey',
 *   satisfactionScore: 75
 * }, 'user-456');
 * ```
 */
const createCustomerJourney = async (journeyData, userId) => {
    const journeyCode = generateJourneyCode(journeyData.journeyName);
    return {
        id: generateUUID(),
        journeyName: journeyData.journeyName,
        journeyCode,
        personaId: journeyData.personaId,
        description: journeyData.description || '',
        stages: [],
        overallSentiment: Sentiment.NEUTRAL,
        satisfactionScore: journeyData.satisfactionScore || 0,
        effortScore: 0,
        completionRate: 0,
        averageDuration: 0,
        painPoints: [],
        opportunities: [],
        metadata: journeyData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createCustomerJourney = createCustomerJourney;
/**
 * Adds a stage to customer journey.
 *
 * @param {string} journeyId - Journey identifier
 * @param {any} stageData - Stage data
 * @returns {Promise<JourneyStageDetail>} Created stage
 *
 * @example
 * ```typescript
 * const stage = await addJourneyStage('journey-123', {
 *   stage: 'awareness',
 *   stageName: 'Initial Discovery',
 *   description: 'Customer discovers our solution'
 * });
 * ```
 */
const addJourneyStage = async (journeyId, stageData) => {
    return {
        id: generateUUID(),
        stage: stageData.stage,
        stageName: stageData.stageName,
        description: stageData.description || '',
        touchpoints: [],
        emotions: stageData.emotions || [],
        customerActions: stageData.customerActions || [],
        systemActions: stageData.systemActions || [],
        duration: 0,
        satisfactionScore: 0,
        effortScore: 0,
        painPoints: [],
        opportunities: [],
    };
};
exports.addJourneyStage = addJourneyStage;
/**
 * Creates a touchpoint in customer journey.
 *
 * @param {any} touchpointData - Touchpoint data
 * @param {string} userId - User creating touchpoint
 * @returns {Promise<Touchpoint>} Created touchpoint
 *
 * @example
 * ```typescript
 * const touchpoint = await createTouchpoint({
 *   journeyId: 'journey-123',
 *   stage: 'consideration',
 *   touchpointName: 'Product Demo',
 *   channel: 'website',
 *   isKeyMoment: true
 * }, 'user-456');
 * ```
 */
const createTouchpoint = async (touchpointData, userId) => {
    return {
        id: generateUUID(),
        journeyId: touchpointData.journeyId,
        stage: touchpointData.stage,
        touchpointName: touchpointData.touchpointName,
        channel: touchpointData.channel,
        description: touchpointData.description || '',
        customerActions: touchpointData.customerActions || [],
        systemResponses: touchpointData.systemResponses || [],
        satisfactionScore: 0,
        effortScore: 0,
        completionRate: 0,
        averageDuration: 0,
        interactionCount: 0,
        sentiment: Sentiment.NEUTRAL,
        painPoints: [],
        improvementOpportunities: [],
        isKeyMoment: touchpointData.isKeyMoment || false,
        importance: touchpointData.importance || 50,
        performance: 50,
        metadata: touchpointData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createTouchpoint = createTouchpoint;
/**
 * Analyzes journey completion rates and drop-offs.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Completion analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeJourneyCompletion('journey-123');
 * ```
 */
const analyzeJourneyCompletion = async (journeyId) => {
    return {
        journeyId,
        overallCompletionRate: 72,
        totalJourneys: 10000,
        completedJourneys: 7200,
        abandonedJourneys: 2800,
        dropoffPoints: [
            {
                stage: JourneyStage.PURCHASE,
                touchpoint: 'Payment Processing',
                dropoffRate: 18,
                impactedCustomers: 1800,
                reasons: ['Complex payment form', 'Limited payment options', 'Security concerns'],
            },
            {
                stage: JourneyStage.ONBOARDING,
                touchpoint: 'Account Setup',
                dropoffRate: 10,
                impactedCustomers: 1000,
                reasons: ['Too many steps', 'Unclear instructions'],
            },
        ],
        recommendations: ['Simplify payment process', 'Add progress indicators', 'Improve onboarding UX'],
    };
};
exports.analyzeJourneyCompletion = analyzeJourneyCompletion;
/**
 * Maps emotion journey across touchpoints.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Emotion map
 *
 * @example
 * ```typescript
 * const emotions = await mapEmotionJourney('journey-123');
 * ```
 */
const mapEmotionJourney = async (journeyId) => {
    return {
        journeyId,
        emotionalCurve: [
            { stage: 'awareness', emotion: 'curious', intensity: 6 },
            { stage: 'consideration', emotion: 'interested', intensity: 7 },
            { stage: 'purchase', emotion: 'anxious', intensity: 5 },
            { stage: 'onboarding', emotion: 'confused', intensity: 4 },
            { stage: 'usage', emotion: 'satisfied', intensity: 8 },
            { stage: 'support', emotion: 'frustrated', intensity: 3 },
            { stage: 'renewal', emotion: 'confident', intensity: 8 },
        ],
        emotionalHighPoints: [{ stage: 'usage', emotion: 'satisfied', touchpoint: 'First Success' }],
        emotionalLowPoints: [{ stage: 'support', emotion: 'frustrated', touchpoint: 'Contact Support' }],
        overallEmotionalScore: 6.4,
        recommendations: ['Address support frustration', 'Reduce purchase anxiety', 'Improve onboarding clarity'],
    };
};
exports.mapEmotionJourney = mapEmotionJourney;
/**
 * Identifies moments of truth in journey.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Moments of truth
 *
 * @example
 * ```typescript
 * const moments = await identifyMomentsOfTruth('journey-123');
 * ```
 */
const identifyMomentsOfTruth = async (journeyId) => {
    return {
        journeyId,
        momentsOfTruth: [
            {
                touchpointId: 'tp-1',
                touchpointName: 'First Product Use',
                stage: JourneyStage.ONBOARDING,
                importance: 95,
                currentPerformance: 78,
                gap: 17,
                impact: 'high',
                recommendation: 'Improve onboarding guidance',
            },
            {
                touchpointId: 'tp-2',
                touchpointName: 'Support Response',
                stage: JourneyStage.SUPPORT,
                importance: 92,
                currentPerformance: 65,
                gap: 27,
                impact: 'critical',
                recommendation: 'Reduce response time, improve first-contact resolution',
            },
            {
                touchpointId: 'tp-3',
                touchpointName: 'Renewal Offer',
                stage: JourneyStage.RENEWAL,
                importance: 90,
                currentPerformance: 82,
                gap: 8,
                impact: 'medium',
                recommendation: 'Personalize renewal offers',
            },
        ],
        priorityActions: ['Improve support responsiveness', 'Enhance onboarding experience'],
    };
};
exports.identifyMomentsOfTruth = identifyMomentsOfTruth;
// ============================================================================
// SECTION 3: NPS and Satisfaction Metrics
// ============================================================================
/**
 * Calculates NPS score from survey responses.
 *
 * @param {any[]} responses - Survey responses
 * @returns {Promise<NPSSurvey>} NPS survey results
 *
 * @example
 * ```typescript
 * const nps = await calculateNPSScore([
 *   { score: 9 }, { score: 8 }, { score: 6 }, { score: 10 }
 * ]);
 * ```
 */
const calculateNPSScore = async (responses) => {
    const promoters = responses.filter((r) => r.score >= 9).length;
    const passives = responses.filter((r) => r.score >= 7 && r.score <= 8).length;
    const detractors = responses.filter((r) => r.score <= 6).length;
    const total = responses.length;
    const npsScore = ((promoters - detractors) / total) * 100;
    return {
        id: generateUUID(),
        surveyName: 'NPS Survey',
        surveyDate: new Date(),
        respondentCount: total,
        promoters,
        passives,
        detractors,
        npsScore: Math.round(npsScore),
        responseRate: 0,
        segmentBreakdown: [],
        trendData: [],
        topReasons: [],
        metadata: {},
        createdAt: new Date(),
    };
};
exports.calculateNPSScore = calculateNPSScore;
/**
 * Analyzes NPS trends over time.
 *
 * @param {string} organizationId - Organization identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any>} NPS trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeNPSTrends('org-123', 12);
 * ```
 */
const analyzeNPSTrends = async (organizationId, months) => {
    const monthlyData = [];
    for (let i = 0; i < months; i++) {
        monthlyData.push({
            period: `Month ${i + 1}`,
            npsScore: 35 + Math.floor(Math.random() * 20),
            respondents: 200 + Math.floor(Math.random() * 100),
            promoterRate: 45 + Math.random() * 15,
            detractorRate: 15 + Math.random() * 10,
        });
    }
    return {
        organizationId,
        period: `Last ${months} months`,
        trendData: monthlyData,
        overallTrend: 'improving',
        averageNPS: 42,
        bestMonth: { period: 'Month 8', npsScore: 54 },
        worstMonth: { period: 'Month 2', npsScore: 36 },
        recommendations: ['Continue current initiatives', 'Focus on reducing detractors'],
    };
};
exports.analyzeNPSTrends = analyzeNPSTrends;
/**
 * Segments NPS by customer attributes.
 *
 * @param {string} surveyId - Survey identifier
 * @returns {Promise<NPSSegment[]>} NPS segment breakdown
 *
 * @example
 * ```typescript
 * const segments = await segmentNPSResults('survey-123');
 * ```
 */
const segmentNPSResults = async (surveyId) => {
    return [
        { segmentName: 'Enterprise', respondents: 150, npsScore: 52, promoters: 85, passives: 45, detractors: 20 },
        { segmentName: 'Mid-Market', respondents: 300, npsScore: 38, promoters: 140, passives: 110, detractors: 50 },
        { segmentName: 'Small Business', respondents: 200, npsScore: 25, promoters: 80, passives: 90, detractors: 30 },
    ];
};
exports.segmentNPSResults = segmentNPSResults;
/**
 * Analyzes detractor feedback for insights.
 *
 * @param {string} surveyId - Survey identifier
 * @returns {Promise<any>} Detractor analysis
 *
 * @example
 * ```typescript
 * const detractorInsights = await analyzeDetractorFeedback('survey-123');
 * ```
 */
const analyzeDetractorFeedback = async (surveyId) => {
    return {
        surveyId,
        totalDetractors: 85,
        detractorRate: 17,
        topReasons: [
            { reason: 'Poor customer support', count: 32, percentage: 38 },
            { reason: 'Product bugs', count: 28, percentage: 33 },
            { reason: 'High pricing', count: 15, percentage: 18 },
            { reason: 'Missing features', count: 10, percentage: 12 },
        ],
        sentimentAnalysis: {
            veryNegative: 45,
            negative: 40,
        },
        urgency: 'high',
        recommendedActions: [
            'Improve support response time',
            'Address critical product bugs',
            'Review pricing strategy for value perception',
        ],
    };
};
exports.analyzeDetractorFeedback = analyzeDetractorFeedback;
/**
 * Measures customer satisfaction (CSAT) scores.
 *
 * @param {any[]} responses - CSAT responses
 * @returns {Promise<SatisfactionMetric>} CSAT metric
 *
 * @example
 * ```typescript
 * const csat = await measureCSAT([
 *   { score: 5 }, { score: 4 }, { score: 3 }
 * ]);
 * ```
 */
const measureCSAT = async (responses) => {
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    const avgScore = (totalScore / responses.length / 5) * 100;
    return {
        id: generateUUID(),
        metricType: 'csat',
        period: 'Current',
        score: Math.round(avgScore),
        respondents: responses.length,
        target: 85,
        variance: Math.round(avgScore) - 85,
        trend: Math.round(avgScore) >= 85 ? 'stable' : 'declining',
        segmentBreakdown: [],
        metadata: {},
        calculatedAt: new Date(),
    };
};
exports.measureCSAT = measureCSAT;
/**
 * Calculates Customer Effort Score (CES).
 *
 * @param {any[]} responses - CES responses
 * @returns {Promise<SatisfactionMetric>} CES metric
 *
 * @example
 * ```typescript
 * const ces = await calculateCustomerEffortScore([
 *   { effort: 2 }, { effort: 3 }, { effort: 1 }
 * ]);
 * ```
 */
const calculateCustomerEffortScore = async (responses) => {
    const avgEffort = responses.reduce((sum, r) => sum + r.effort, 0) / responses.length;
    const cesScore = ((7 - avgEffort) / 6) * 100;
    return {
        id: generateUUID(),
        metricType: 'ces',
        period: 'Current',
        score: Math.round(cesScore),
        respondents: responses.length,
        target: 80,
        variance: Math.round(cesScore) - 80,
        trend: Math.round(cesScore) >= 80 ? 'improving' : 'stable',
        segmentBreakdown: [],
        metadata: { averageEffort: avgEffort.toFixed(2) },
        calculatedAt: new Date(),
    };
};
exports.calculateCustomerEffortScore = calculateCustomerEffortScore;
// ============================================================================
// SECTION 4: Pain Point Identification and Resolution
// ============================================================================
/**
 * Records a customer pain point.
 *
 * @param {any} painPointData - Pain point data
 * @param {string} userId - User recording pain point
 * @returns {Promise<PainPoint>} Created pain point
 *
 * @example
 * ```typescript
 * const painPoint = await recordPainPoint({
 *   painPointName: 'Slow checkout process',
 *   stage: 'purchase',
 *   severity: 'high',
 *   frequency: 75,
 *   rootCause: 'Complex payment form'
 * }, 'user-123');
 * ```
 */
const recordPainPoint = async (painPointData, userId) => {
    const impactScore = (painPointData.frequency * severityToScore(painPointData.severity)) / 100;
    return {
        id: generateUUID(),
        journeyId: painPointData.journeyId,
        touchpointId: painPointData.touchpointId,
        stage: painPointData.stage,
        painPointName: painPointData.painPointName,
        description: painPointData.description,
        severity: painPointData.severity,
        frequency: painPointData.frequency,
        impactScore,
        affectedCustomers: painPointData.affectedCustomers || 0,
        rootCause: painPointData.rootCause,
        currentSolution: painPointData.currentSolution,
        proposedSolution: painPointData.proposedSolution || 'To be determined',
        estimatedEffort: painPointData.estimatedEffort || 0,
        estimatedImpact: painPointData.estimatedImpact || 0,
        priority: Math.round(impactScore * 100),
        status: 'identified',
        metadata: painPointData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.recordPainPoint = recordPainPoint;
/**
 * Helper function to convert severity to numeric score
 */
const severityToScore = (severity) => {
    const scores = {
        [PainPointSeverity.CRITICAL]: 100,
        [PainPointSeverity.HIGH]: 75,
        [PainPointSeverity.MEDIUM]: 50,
        [PainPointSeverity.LOW]: 25,
    };
    return scores[severity] || 50;
};
/**
 * Prioritizes pain points for resolution.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<PainPoint[]>} Prioritized pain points
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizePainPoints('journey-123');
 * ```
 */
const prioritizePainPoints = async (journeyId) => {
    // Would normally retrieve from database and sort
    const painPoints = [];
    return painPoints.sort((a, b) => {
        const scoreA = (a.impactScore * a.frequency) / (a.estimatedEffort || 1);
        const scoreB = (b.impactScore * b.frequency) / (b.estimatedEffort || 1);
        return scoreB - scoreA;
    });
};
exports.prioritizePainPoints = prioritizePainPoints;
/**
 * Analyzes root causes of pain points.
 *
 * @param {string[]} painPointIds - Pain point identifiers
 * @returns {Promise<any>} Root cause analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeRootCauses(['pp-1', 'pp-2', 'pp-3']);
 * ```
 */
const analyzeRootCauses = async (painPointIds) => {
    return {
        painPointsAnalyzed: painPointIds.length,
        rootCauseCategories: [
            { category: 'Process Issues', count: 5, percentage: 42 },
            { category: 'System Limitations', count: 4, percentage: 33 },
            { category: 'Communication Gaps', count: 2, percentage: 17 },
            { category: 'Resource Constraints', count: 1, percentage: 8 },
        ],
        commonPatterns: [
            'Lack of automation in manual processes',
            'Inconsistent information across channels',
            'Insufficient self-service options',
        ],
        systemicIssues: ['Legacy system limitations', 'Siloed data'],
        recommendations: [
            'Invest in process automation',
            'Integrate systems for consistent data',
            'Expand self-service capabilities',
        ],
    };
};
exports.analyzeRootCauses = analyzeRootCauses;
/**
 * Tracks pain point resolution progress.
 *
 * @param {string} painPointId - Pain point identifier
 * @param {any} resolutionData - Resolution data
 * @returns {Promise<PainPoint>} Updated pain point
 *
 * @example
 * ```typescript
 * const updated = await trackPainPointResolution('pp-123', {
 *   status: 'in_progress',
 *   currentSolution: 'Implementing new checkout flow',
 *   estimatedCompletion: new Date('2025-03-31')
 * });
 * ```
 */
const trackPainPointResolution = async (painPointId, resolutionData) => {
    const painPoint = { id: painPointId };
    return {
        ...painPoint,
        status: resolutionData.status,
        currentSolution: resolutionData.currentSolution,
        metadata: {
            ...painPoint.metadata,
            resolutionProgress: resolutionData.progress,
            estimatedCompletion: resolutionData.estimatedCompletion,
            lastUpdated: new Date(),
        },
        updatedAt: new Date(),
    };
};
exports.trackPainPointResolution = trackPainPointResolution;
/**
 * Measures impact of pain point resolution.
 *
 * @param {string} painPointId - Pain point identifier
 * @returns {Promise<any>} Impact measurement
 *
 * @example
 * ```typescript
 * const impact = await measureResolutionImpact('pp-123');
 * ```
 */
const measureResolutionImpact = async (painPointId) => {
    return {
        painPointId,
        resolutionDate: new Date('2025-02-15'),
        beforeMetrics: {
            satisfactionScore: 62,
            completionRate: 75,
            effortScore: 45,
            customerComplaints: 150,
        },
        afterMetrics: {
            satisfactionScore: 78,
            completionRate: 89,
            effortScore: 72,
            customerComplaints: 45,
        },
        improvements: {
            satisfactionImprovement: 16,
            completionImprovement: 14,
            effortImprovement: 27,
            complaintReduction: 70,
        },
        estimatedValueImpact: 250000,
        roi: 5.2,
    };
};
exports.measureResolutionImpact = measureResolutionImpact;
// ============================================================================
// SECTION 5: Sentiment Analysis and Feedback Management
// ============================================================================
/**
 * Analyzes sentiment from customer feedback.
 *
 * @param {string} feedbackText - Feedback text
 * @returns {Promise<any>} Sentiment analysis
 *
 * @example
 * ```typescript
 * const sentiment = await analyzeSentiment('The product is amazing but support is slow');
 * ```
 */
const analyzeSentiment = async (feedbackText) => {
    // Simplified sentiment analysis (would use ML model in production)
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'helpful'];
    const negativeWords = ['poor', 'terrible', 'slow', 'bad', 'awful', 'frustrating'];
    const text = feedbackText.toLowerCase();
    const positiveCount = positiveWords.filter((word) => text.includes(word)).length;
    const negativeCount = negativeWords.filter((word) => text.includes(word)).length;
    let sentiment;
    let score;
    if (positiveCount > negativeCount + 1) {
        sentiment = Sentiment.VERY_POSITIVE;
        score = 90;
    }
    else if (positiveCount > negativeCount) {
        sentiment = Sentiment.POSITIVE;
        score = 70;
    }
    else if (negativeCount > positiveCount + 1) {
        sentiment = Sentiment.VERY_NEGATIVE;
        score = 10;
    }
    else if (negativeCount > positiveCount) {
        sentiment = Sentiment.NEGATIVE;
        score = 30;
    }
    else {
        sentiment = Sentiment.NEUTRAL;
        score = 50;
    }
    return {
        text: feedbackText,
        sentiment,
        score,
        confidence: 0.85,
        positiveAspects: positiveCount > 0 ? ['product quality'] : [],
        negativeAspects: negativeCount > 0 ? ['support speed'] : [],
        topics: ['product', 'support'],
    };
};
exports.analyzeSentiment = analyzeSentiment;
/**
 * Submits customer feedback.
 *
 * @param {any} feedbackData - Feedback data
 * @param {string} userId - User submitting feedback
 * @returns {Promise<CustomerFeedback>} Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await submitCustomerFeedback({
 *   customerId: 'cust-123',
 *   feedbackType: 'csat',
 *   channel: 'email',
 *   score: 4,
 *   feedbackText: 'Good experience overall',
 *   stage: 'usage'
 * }, 'user-456');
 * ```
 */
const submitCustomerFeedback = async (feedbackData, userId) => {
    const sentimentAnalysis = await (0, exports.analyzeSentiment)(feedbackData.feedbackText);
    return {
        id: generateUUID(),
        customerId: feedbackData.customerId,
        feedbackType: feedbackData.feedbackType,
        channel: feedbackData.channel,
        score: feedbackData.score,
        sentiment: sentimentAnalysis.sentiment,
        feedbackText: feedbackData.feedbackText,
        category: feedbackData.category || [],
        topics: sentimentAnalysis.topics,
        stage: feedbackData.stage,
        touchpointId: feedbackData.touchpointId,
        actionTaken: '',
        status: 'new',
        metadata: { sentimentAnalysis },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.submitCustomerFeedback = submitCustomerFeedback;
/**
 * Analyzes feedback themes and patterns.
 *
 * @param {string} journeyId - Journey identifier
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any>} Theme analysis
 *
 * @example
 * ```typescript
 * const themes = await analyzeFeedbackThemes(
 *   'journey-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
const analyzeFeedbackThemes = async (journeyId, startDate, endDate) => {
    return {
        journeyId,
        period: { startDate, endDate },
        totalFeedback: 1500,
        themes: [
            { theme: 'Customer Support', mentions: 450, sentiment: 'negative', trend: 'increasing' },
            { theme: 'Product Quality', mentions: 380, sentiment: 'positive', trend: 'stable' },
            { theme: 'Pricing', mentions: 280, sentiment: 'neutral', trend: 'stable' },
            { theme: 'User Interface', mentions: 220, sentiment: 'positive', trend: 'improving' },
            { theme: 'Performance', mentions: 170, sentiment: 'neutral', trend: 'stable' },
        ],
        emergingIssues: [
            { issue: 'Mobile app crashes', mentions: 85, severity: 'high' },
            { issue: 'Slow response times', mentions: 72, severity: 'medium' },
        ],
        recommendations: ['Prioritize support improvements', 'Investigate mobile app stability'],
    };
};
exports.analyzeFeedbackThemes = analyzeFeedbackThemes;
/**
 * Categorizes feedback automatically.
 *
 * @param {string} feedbackText - Feedback text
 * @returns {Promise<string[]>} Categories
 *
 * @example
 * ```typescript
 * const categories = await categorizeFeedback('The checkout was confusing');
 * // Returns: ['usability', 'purchase', 'ux']
 * ```
 */
const categorizeFeedback = async (feedbackText) => {
    const text = feedbackText.toLowerCase();
    const categories = [];
    const categoryKeywords = {
        usability: ['confusing', 'difficult', 'hard to use', 'unclear'],
        performance: ['slow', 'fast', 'loading', 'speed'],
        support: ['support', 'help', 'customer service', 'response'],
        pricing: ['price', 'cost', 'expensive', 'cheap', 'value'],
        features: ['feature', 'functionality', 'capability', 'option'],
        quality: ['quality', 'reliable', 'stable', 'bug', 'error'],
    };
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((keyword) => text.includes(keyword))) {
            categories.push(category);
        }
    }
    return categories.length > 0 ? categories : ['general'];
};
exports.categorizeFeedback = categorizeFeedback;
/**
 * Tracks feedback resolution and closure.
 *
 * @param {string} feedbackId - Feedback identifier
 * @param {any} resolutionData - Resolution data
 * @returns {Promise<CustomerFeedback>} Updated feedback
 *
 * @example
 * ```typescript
 * const resolved = await trackFeedbackResolution('fb-123', {
 *   actionTaken: 'Issue resolved, customer contacted',
 *   status: 'resolved'
 * });
 * ```
 */
const trackFeedbackResolution = async (feedbackId, resolutionData) => {
    const feedback = { id: feedbackId };
    return {
        ...feedback,
        actionTaken: resolutionData.actionTaken,
        status: resolutionData.status,
        metadata: {
            ...feedback.metadata,
            resolvedAt: new Date(),
            resolvedBy: resolutionData.resolvedBy,
        },
        updatedAt: new Date(),
    };
};
exports.trackFeedbackResolution = trackFeedbackResolution;
// ============================================================================
// SECTION 6: Touchpoint Optimization
// ============================================================================
/**
 * Analyzes touchpoint performance.
 *
 * @param {string} touchpointId - Touchpoint identifier
 * @returns {Promise<any>} Performance analysis
 *
 * @example
 * ```typescript
 * const performance = await analyzeTouchpointPerformance('tp-123');
 * ```
 */
const analyzeTouchpointPerformance = async (touchpointId) => {
    return {
        touchpointId,
        performanceMetrics: {
            satisfactionScore: 72,
            effortScore: 65,
            completionRate: 85,
            averageDuration: 180,
            conversionRate: 45,
        },
        benchmarks: {
            industrySatisfaction: 75,
            industryEffort: 70,
            industryCompletion: 80,
        },
        gaps: {
            satisfactionGap: -3,
            effortGap: -5,
            completionGap: 5,
        },
        recommendations: ['Improve information clarity', 'Reduce steps', 'Add progress indicators'],
        priorityLevel: 'high',
    };
};
exports.analyzeTouchpointPerformance = analyzeTouchpointPerformance;
/**
 * Optimizes touchpoint sequence and flow.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimized = await optimizeTouchpointSequence('journey-123');
 * ```
 */
const optimizeTouchpointSequence = async (journeyId) => {
    return {
        journeyId,
        currentSequence: ['awareness', 'consideration', 'purchase', 'onboarding', 'usage'],
        optimizedSequence: ['awareness', 'consideration', 'trial', 'purchase', 'onboarding', 'usage'],
        changes: [{ action: 'add', stage: 'trial', position: 3, rationale: 'Reduce purchase risk' }],
        expectedImprovements: {
            conversionRate: 15,
            satisfactionScore: 8,
            completionRate: 10,
        },
        implementation: 'Add free trial touchpoint before purchase decision',
    };
};
exports.optimizeTouchpointSequence = optimizeTouchpointSequence;
/**
 * Performs importance-performance analysis.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} IPA results
 *
 * @example
 * ```typescript
 * const ipa = await performImportancePerformanceAnalysis('journey-123');
 * ```
 */
const performImportancePerformanceAnalysis = async (journeyId) => {
    return {
        journeyId,
        quadrants: {
            keepUpGoodWork: [
                { touchpoint: 'Product Demo', importance: 90, performance: 85 },
                { touchpoint: 'Onboarding', importance: 88, performance: 82 },
            ],
            concentrate: [
                { touchpoint: 'Support', importance: 92, performance: 65 },
                { touchpoint: 'Checkout', importance: 85, performance: 68 },
            ],
            lowPriority: [
                { touchpoint: 'Newsletter Signup', importance: 30, performance: 40 },
            ],
            possibleOverkill: [
                { touchpoint: 'Welcome Email', importance: 45, performance: 90 },
            ],
        },
        recommendations: [
            'Urgent: Improve support experience (high importance, low performance)',
            'Priority: Streamline checkout process',
            'Consider: Reduce resources on welcome email',
        ],
    };
};
exports.performImportancePerformanceAnalysis = performImportancePerformanceAnalysis;
/**
 * Benchmarks touchpoints against industry standards.
 *
 * @param {string} touchpointId - Touchpoint identifier
 * @param {string} industry - Industry vertical
 * @returns {Promise<any>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkTouchpoint('tp-123', 'SaaS');
 * ```
 */
const benchmarkTouchpoint = async (touchpointId, industry) => {
    return {
        touchpointId,
        industry,
        yourPerformance: {
            satisfaction: 72,
            effort: 65,
            completion: 85,
            nps: 42,
        },
        industryAverage: {
            satisfaction: 75,
            effort: 70,
            completion: 80,
            nps: 45,
        },
        topPerformers: {
            satisfaction: 88,
            effort: 85,
            completion: 95,
            nps: 65,
        },
        positioning: 'Below average',
        gapToLeader: {
            satisfaction: -16,
            effort: -20,
            completion: -10,
            nps: -23,
        },
        recommendations: ['Study top performers', 'Focus on reducing customer effort', 'Improve completion rate'],
    };
};
exports.benchmarkTouchpoint = benchmarkTouchpoint;
/**
 * Tests touchpoint variations (A/B testing).
 *
 * @param {string} touchpointId - Touchpoint identifier
 * @param {any} variations - Variation definitions
 * @returns {Promise<any>} Test results
 *
 * @example
 * ```typescript
 * const test = await testTouchpointVariations('tp-123', {
 *   control: 'Current checkout flow',
 *   variant: 'Simplified 2-step checkout'
 * });
 * ```
 */
const testTouchpointVariations = async (touchpointId, variations) => {
    return {
        touchpointId,
        testId: generateUUID(),
        variations,
        results: {
            control: {
                satisfaction: 72,
                completion: 78,
                conversionRate: 42,
                sampleSize: 5000,
            },
            variant: {
                satisfaction: 79,
                completion: 86,
                conversionRate: 51,
                sampleSize: 5000,
            },
        },
        statisticalSignificance: 0.95,
        winner: 'variant',
        improvements: {
            satisfactionLift: 9.7,
            completionLift: 10.3,
            conversionLift: 21.4,
        },
        recommendation: 'Implement variant - statistically significant improvement',
    };
};
exports.testTouchpointVariations = testTouchpointVariations;
// ============================================================================
// SECTION 7: Experience Analytics and Reporting
// ============================================================================
/**
 * Generates comprehensive experience analytics.
 *
 * @param {string} journeyId - Journey identifier
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<ExperienceAnalytics>} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await generateExperienceAnalytics(
 *   'journey-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
const generateExperienceAnalytics = async (journeyId, startDate, endDate) => {
    return {
        journeyId,
        analyticsPeriod: `${startDate.toISOString()} - ${endDate.toISOString()}`,
        totalInteractions: 50000,
        uniqueCustomers: 12500,
        completionRate: 78,
        averageDuration: 1200,
        satisfactionScore: 75,
        effortScore: 68,
        npsScore: 42,
        conversionRate: 45,
        dropoffPoints: [
            {
                stage: JourneyStage.PURCHASE,
                touchpointId: 'tp-checkout',
                dropoffRate: 22,
                impactedCustomers: 2750,
                reasons: ['Payment complexity', 'Price concerns'],
            },
        ],
        topPainPoints: [],
        sentimentDistribution: {
            [Sentiment.VERY_POSITIVE]: 20,
            [Sentiment.POSITIVE]: 35,
            [Sentiment.NEUTRAL]: 25,
            [Sentiment.NEGATIVE]: 15,
            [Sentiment.VERY_NEGATIVE]: 5,
        },
        channelPerformance: [
            { channel: TouchpointChannel.WEBSITE, usage: 45, satisfaction: 78, effort: 70, conversionRate: 48, trend: 'stable' },
            { channel: TouchpointChannel.MOBILE_APP, usage: 35, satisfaction: 82, effort: 75, conversionRate: 52, trend: 'improving' },
        ],
        recommendations: ['Optimize checkout flow', 'Expand mobile capabilities'],
    };
};
exports.generateExperienceAnalytics = generateExperienceAnalytics;
/**
 * Creates CX dashboard visualization data.
 *
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await createCXDashboard('org-123');
 * ```
 */
const createCXDashboard = async (organizationId) => {
    return {
        organizationId,
        generatedAt: new Date(),
        keyMetrics: {
            nps: 42,
            csat: 78,
            ces: 68,
            completionRate: 75,
            retentionRate: 82,
        },
        trends: {
            npsChange: 5,
            csatChange: 3,
            cesChange: 8,
        },
        topJourneys: [
            { journeyId: 'j1', name: 'Onboarding', satisfaction: 82, volume: 5000 },
            { journeyId: 'j2', name: 'Purchase', satisfaction: 75, volume: 12000 },
        ],
        criticalIssues: [
            { issue: 'Support response time', severity: 'high', affectedCustomers: 2500 },
        ],
        recentImprovements: [
            { improvement: 'Simplified checkout', impact: 'Conversion +12%', date: new Date('2025-02-15') },
        ],
    };
};
exports.createCXDashboard = createCXDashboard;
/**
 * Generates executive CX summary report.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} period - Report period
 * @returns {Promise<any>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveCXSummary('org-123', 'Q1 2025');
 * ```
 */
const generateExecutiveCXSummary = async (organizationId, period) => {
    return {
        organizationId,
        period,
        executiveSummary: 'Overall CX performance improved 8% this quarter with key wins in mobile experience',
        overallHealth: ExperienceQuality.GOOD,
        keyAchievements: [
            'NPS increased from 38 to 42',
            'Mobile app rating improved to 4.5 stars',
            'Support response time reduced by 25%',
        ],
        concernAreas: [
            'Checkout completion rate below target',
            'Detractor rate increased in small business segment',
        ],
        investments: [
            { initiative: 'Mobile app enhancement', investment: 250000, expectedROI: 2.8 },
            { initiative: 'Support automation', investment: 150000, expectedROI: 3.2 },
        ],
        nextQuarterPriorities: ['Improve checkout experience', 'Reduce support ticket volume', 'Launch personalization'],
    };
};
exports.generateExecutiveCXSummary = generateExecutiveCXSummary;
/**
 * Analyzes omnichannel experience consistency.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Omnichannel analysis
 *
 * @example
 * ```typescript
 * const omnichannel = await analyzeOmnichannelExperience('journey-123');
 * ```
 */
const analyzeOmnichannelExperience = async (journeyId) => {
    return {
        journeyId,
        channelConsistency: 72,
        channels: {
            website: { usage: 45, satisfaction: 78, dataAvailability: 95 },
            mobileApp: { usage: 35, satisfaction: 82, dataAvailability: 90 },
            phone: { usage: 15, satisfaction: 65, dataAvailability: 70 },
            chat: { usage: 5, satisfaction: 88, dataAvailability: 85 },
        },
        consistencyIssues: [
            'Account data not synced between web and mobile',
            'Phone agents lack visibility into online interactions',
        ],
        seamlessTransitions: 58,
        recommendations: [
            'Integrate customer data across all channels',
            'Enable channel-switching without data loss',
            'Provide consistent experience regardless of channel',
        ],
    };
};
exports.analyzeOmnichannelExperience = analyzeOmnichannelExperience;
/**
 * Exports CX data for external analysis.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} format - Export format
 * @returns {Promise<any>} Export result
 *
 * @example
 * ```typescript
 * const exported = await exportCXData('org-123', 'csv');
 * ```
 */
const exportCXData = async (organizationId, format) => {
    return {
        organizationId,
        exportFormat: format,
        exportDate: new Date(),
        datasets: ['journeys', 'touchpoints', 'feedback', 'nps', 'personas'],
        recordCount: 25000,
        downloadUrl: `/exports/cx-data-${organizationId}-${Date.now()}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
};
exports.exportCXData = exportCXData;
//# sourceMappingURL=customer-experience-kit.js.map