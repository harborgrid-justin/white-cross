"use strict";
/**
 * LOC: HCMENG1234567
 * File: /reuse/server/human-capital/employee-engagement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../analytics-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Employee engagement platform controllers
 *   - Analytics dashboards
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
exports.EmployeeEngagementController = exports.ActionItemDto = exports.CreateActionPlanDto = exports.CreateWellbeingProgramDto = exports.CreateRecognitionDto = exports.CreateFeedbackDto = exports.SurveyAnswerDto = exports.SubmitSurveyResponseDto = exports.SurveyQuestionDto = exports.CreateSurveyDto = exports.SentimentScore = exports.WellbeingCategory = exports.MilestoneType = exports.RecognitionType = exports.FeedbackCategory = exports.FeedbackStatus = exports.QuestionType = exports.SurveyType = exports.SurveyStatus = void 0;
exports.createPulseSurvey = createPulseSurvey;
exports.launchSurvey = launchSurvey;
exports.getActiveSurveys = getActiveSurveys;
exports.submitSurveyResponse = submitSurveyResponse;
exports.getSurveyResults = getSurveyResults;
exports.generateSurveyReport = generateSurveyReport;
exports.getSurveyParticipation = getSurveyParticipation;
exports.sendSurveyReminders = sendSurveyReminders;
exports.closeSurvey = closeSurvey;
exports.calculateENPS = calculateENPS;
exports.getENPSTrend = getENPSTrend;
exports.getENPSBySegment = getENPSBySegment;
exports.compareENPSWithBenchmarks = compareENPSWithBenchmarks;
exports.createFeedback = createFeedback;
exports.getFeedbackByStatus = getFeedbackByStatus;
exports.updateFeedbackStatus = updateFeedbackStatus;
exports.upvoteFeedback = upvoteFeedback;
exports.addFeedbackComment = addFeedbackComment;
exports.createRecognition = createRecognition;
exports.getEmployeeRecognitions = getEmployeeRecognitions;
exports.getRecognitionLeaderboard = getRecognitionLeaderboard;
exports.reactToRecognition = reactToRecognition;
exports.addRecognitionComment = addRecognitionComment;
exports.getRecognitionFeed = getRecognitionFeed;
exports.getRecognitionAnalytics = getRecognitionAnalytics;
exports.createMilestone = createMilestone;
exports.getUpcomingMilestones = getUpcomingMilestones;
exports.celebrateMilestone = celebrateMilestone;
exports.addMilestoneGift = addMilestoneGift;
exports.createSocialPost = createSocialPost;
exports.getSocialFeed = getSocialFeed;
exports.likeSocialPost = likeSocialPost;
exports.commentOnSocialPost = commentOnSocialPost;
exports.createWellbeingProgram = createWellbeingProgram;
exports.getActiveWellbeingPrograms = getActiveWellbeingPrograms;
exports.enrollInWellbeingProgram = enrollInWellbeingProgram;
exports.logWellbeingActivity = logWellbeingActivity;
exports.getWellbeingParticipation = getWellbeingParticipation;
exports.analyzeSentiment = analyzeSentiment;
exports.getSentimentTrends = getSentimentTrends;
exports.getSentimentDrivers = getSentimentDrivers;
exports.createEngagementActionPlan = createEngagementActionPlan;
exports.updateActionPlanProgress = updateActionPlanProgress;
exports.getEngagementAnalytics = getEngagementAnalytics;
exports.getEngagementHeatmap = getEngagementHeatmap;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Survey status
 */
var SurveyStatus;
(function (SurveyStatus) {
    SurveyStatus["DRAFT"] = "draft";
    SurveyStatus["ACTIVE"] = "active";
    SurveyStatus["PAUSED"] = "paused";
    SurveyStatus["CLOSED"] = "closed";
    SurveyStatus["ANALYZING"] = "analyzing";
    SurveyStatus["COMPLETED"] = "completed";
})(SurveyStatus || (exports.SurveyStatus = SurveyStatus = {}));
/**
 * Survey types
 */
var SurveyType;
(function (SurveyType) {
    SurveyType["PULSE"] = "pulse";
    SurveyType["ENGAGEMENT"] = "engagement";
    SurveyType["ONBOARDING"] = "onboarding";
    SurveyType["EXIT"] = "exit";
    SurveyType["CULTURE"] = "culture";
    SurveyType["WELLBEING"] = "wellbeing";
    SurveyType["CUSTOM"] = "custom";
})(SurveyType || (exports.SurveyType = SurveyType = {}));
/**
 * Question types
 */
var QuestionType;
(function (QuestionType) {
    QuestionType["RATING"] = "rating";
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["TEXT"] = "text";
    QuestionType["YES_NO"] = "yes_no";
    QuestionType["LIKERT"] = "likert";
    QuestionType["NET_PROMOTER"] = "net_promoter";
    QuestionType["RANKING"] = "ranking";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
/**
 * Feedback status
 */
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus["SUBMITTED"] = "submitted";
    FeedbackStatus["UNDER_REVIEW"] = "under_review";
    FeedbackStatus["IN_PROGRESS"] = "in_progress";
    FeedbackStatus["RESOLVED"] = "resolved";
    FeedbackStatus["CLOSED"] = "closed";
    FeedbackStatus["ESCALATED"] = "escalated";
})(FeedbackStatus || (exports.FeedbackStatus = FeedbackStatus = {}));
/**
 * Feedback category
 */
var FeedbackCategory;
(function (FeedbackCategory) {
    FeedbackCategory["WORKPLACE"] = "workplace";
    FeedbackCategory["MANAGEMENT"] = "management";
    FeedbackCategory["TOOLS"] = "tools";
    FeedbackCategory["PROCESS"] = "process";
    FeedbackCategory["BENEFITS"] = "benefits";
    FeedbackCategory["CULTURE"] = "culture";
    FeedbackCategory["GROWTH"] = "growth";
    FeedbackCategory["OTHER"] = "other";
})(FeedbackCategory || (exports.FeedbackCategory = FeedbackCategory = {}));
/**
 * Recognition types
 */
var RecognitionType;
(function (RecognitionType) {
    RecognitionType["SPOT_BONUS"] = "spot_bonus";
    RecognitionType["PEER_RECOGNITION"] = "peer_recognition";
    RecognitionType["MANAGER_RECOGNITION"] = "manager_recognition";
    RecognitionType["TEAM_AWARD"] = "team_award";
    RecognitionType["MILESTONE"] = "milestone";
    RecognitionType["VALUES_BASED"] = "values_based";
    RecognitionType["INNOVATION"] = "innovation";
})(RecognitionType || (exports.RecognitionType = RecognitionType = {}));
/**
 * Milestone types
 */
var MilestoneType;
(function (MilestoneType) {
    MilestoneType["WORK_ANNIVERSARY"] = "work_anniversary";
    MilestoneType["BIRTHDAY"] = "birthday";
    MilestoneType["PROMOTION"] = "promotion";
    MilestoneType["RETIREMENT"] = "retirement";
    MilestoneType["PROJECT_COMPLETION"] = "project_completion";
    MilestoneType["CERTIFICATION"] = "certification";
})(MilestoneType || (exports.MilestoneType = MilestoneType = {}));
/**
 * Wellbeing category
 */
var WellbeingCategory;
(function (WellbeingCategory) {
    WellbeingCategory["PHYSICAL"] = "physical";
    WellbeingCategory["MENTAL"] = "mental";
    WellbeingCategory["FINANCIAL"] = "financial";
    WellbeingCategory["SOCIAL"] = "social";
    WellbeingCategory["CAREER"] = "career";
})(WellbeingCategory || (exports.WellbeingCategory = WellbeingCategory = {}));
/**
 * Sentiment score
 */
var SentimentScore;
(function (SentimentScore) {
    SentimentScore["VERY_POSITIVE"] = "very_positive";
    SentimentScore["POSITIVE"] = "positive";
    SentimentScore["NEUTRAL"] = "neutral";
    SentimentScore["NEGATIVE"] = "negative";
    SentimentScore["VERY_NEGATIVE"] = "very_negative";
})(SentimentScore || (exports.SentimentScore = SentimentScore = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * DTO for creating survey
 */
let CreateSurveyDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _isAnonymous_decorators;
    let _isAnonymous_initializers = [];
    let _isAnonymous_extraInitializers = [];
    let _targetAudience_decorators;
    let _targetAudience_initializers = [];
    let _targetAudience_extraInitializers = [];
    let _questions_decorators;
    let _questions_initializers = [];
    let _questions_extraInitializers = [];
    return _a = class CreateSurveyDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.startDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.isAnonymous = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _isAnonymous_initializers, void 0));
                this.targetAudience = (__runInitializers(this, _isAnonymous_extraInitializers), __runInitializers(this, _targetAudience_initializers, void 0));
                this.questions = (__runInitializers(this, _targetAudience_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
                __runInitializers(this, _questions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _type_decorators = [(0, class_validator_1.IsEnum)(SurveyType)];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _isAnonymous_decorators = [(0, class_validator_1.IsBoolean)()];
            _targetAudience_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _questions_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => SurveyQuestionDto)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _isAnonymous_decorators, { kind: "field", name: "isAnonymous", static: false, private: false, access: { has: obj => "isAnonymous" in obj, get: obj => obj.isAnonymous, set: (obj, value) => { obj.isAnonymous = value; } }, metadata: _metadata }, _isAnonymous_initializers, _isAnonymous_extraInitializers);
            __esDecorate(null, null, _targetAudience_decorators, { kind: "field", name: "targetAudience", static: false, private: false, access: { has: obj => "targetAudience" in obj, get: obj => obj.targetAudience, set: (obj, value) => { obj.targetAudience = value; } }, metadata: _metadata }, _targetAudience_initializers, _targetAudience_extraInitializers);
            __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: obj => "questions" in obj, get: obj => obj.questions, set: (obj, value) => { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSurveyDto = CreateSurveyDto;
/**
 * DTO for survey question
 */
let SurveyQuestionDto = (() => {
    var _a;
    let _questionText_decorators;
    let _questionText_initializers = [];
    let _questionText_extraInitializers = [];
    let _questionType_decorators;
    let _questionType_initializers = [];
    let _questionType_extraInitializers = [];
    let _isRequired_decorators;
    let _isRequired_initializers = [];
    let _isRequired_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _options_decorators;
    let _options_initializers = [];
    let _options_extraInitializers = [];
    let _minRating_decorators;
    let _minRating_initializers = [];
    let _minRating_extraInitializers = [];
    let _maxRating_decorators;
    let _maxRating_initializers = [];
    let _maxRating_extraInitializers = [];
    let _allowComment_decorators;
    let _allowComment_initializers = [];
    let _allowComment_extraInitializers = [];
    return _a = class SurveyQuestionDto {
            constructor() {
                this.questionText = __runInitializers(this, _questionText_initializers, void 0);
                this.questionType = (__runInitializers(this, _questionText_extraInitializers), __runInitializers(this, _questionType_initializers, void 0));
                this.isRequired = (__runInitializers(this, _questionType_extraInitializers), __runInitializers(this, _isRequired_initializers, void 0));
                this.order = (__runInitializers(this, _isRequired_extraInitializers), __runInitializers(this, _order_initializers, void 0));
                this.options = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _options_initializers, void 0));
                this.minRating = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _minRating_initializers, void 0));
                this.maxRating = (__runInitializers(this, _minRating_extraInitializers), __runInitializers(this, _maxRating_initializers, void 0));
                this.allowComment = (__runInitializers(this, _maxRating_extraInitializers), __runInitializers(this, _allowComment_initializers, void 0));
                __runInitializers(this, _allowComment_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionText_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _questionType_decorators = [(0, class_validator_1.IsEnum)(QuestionType)];
            _isRequired_decorators = [(0, class_validator_1.IsBoolean)()];
            _order_decorators = [(0, class_validator_1.IsNumber)()];
            _options_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _minRating_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _maxRating_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _allowComment_decorators = [(0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _questionText_decorators, { kind: "field", name: "questionText", static: false, private: false, access: { has: obj => "questionText" in obj, get: obj => obj.questionText, set: (obj, value) => { obj.questionText = value; } }, metadata: _metadata }, _questionText_initializers, _questionText_extraInitializers);
            __esDecorate(null, null, _questionType_decorators, { kind: "field", name: "questionType", static: false, private: false, access: { has: obj => "questionType" in obj, get: obj => obj.questionType, set: (obj, value) => { obj.questionType = value; } }, metadata: _metadata }, _questionType_initializers, _questionType_extraInitializers);
            __esDecorate(null, null, _isRequired_decorators, { kind: "field", name: "isRequired", static: false, private: false, access: { has: obj => "isRequired" in obj, get: obj => obj.isRequired, set: (obj, value) => { obj.isRequired = value; } }, metadata: _metadata }, _isRequired_initializers, _isRequired_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: obj => "options" in obj, get: obj => obj.options, set: (obj, value) => { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            __esDecorate(null, null, _minRating_decorators, { kind: "field", name: "minRating", static: false, private: false, access: { has: obj => "minRating" in obj, get: obj => obj.minRating, set: (obj, value) => { obj.minRating = value; } }, metadata: _metadata }, _minRating_initializers, _minRating_extraInitializers);
            __esDecorate(null, null, _maxRating_decorators, { kind: "field", name: "maxRating", static: false, private: false, access: { has: obj => "maxRating" in obj, get: obj => obj.maxRating, set: (obj, value) => { obj.maxRating = value; } }, metadata: _metadata }, _maxRating_initializers, _maxRating_extraInitializers);
            __esDecorate(null, null, _allowComment_decorators, { kind: "field", name: "allowComment", static: false, private: false, access: { has: obj => "allowComment" in obj, get: obj => obj.allowComment, set: (obj, value) => { obj.allowComment = value; } }, metadata: _metadata }, _allowComment_initializers, _allowComment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SurveyQuestionDto = SurveyQuestionDto;
/**
 * DTO for survey response
 */
let SubmitSurveyResponseDto = (() => {
    var _a;
    let _answers_decorators;
    let _answers_initializers = [];
    let _answers_extraInitializers = [];
    let _completionTime_decorators;
    let _completionTime_initializers = [];
    let _completionTime_extraInitializers = [];
    return _a = class SubmitSurveyResponseDto {
            constructor() {
                this.answers = __runInitializers(this, _answers_initializers, void 0);
                this.completionTime = (__runInitializers(this, _answers_extraInitializers), __runInitializers(this, _completionTime_initializers, void 0));
                __runInitializers(this, _completionTime_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _answers_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => SurveyAnswerDto)];
            _completionTime_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _answers_decorators, { kind: "field", name: "answers", static: false, private: false, access: { has: obj => "answers" in obj, get: obj => obj.answers, set: (obj, value) => { obj.answers = value; } }, metadata: _metadata }, _answers_initializers, _answers_extraInitializers);
            __esDecorate(null, null, _completionTime_decorators, { kind: "field", name: "completionTime", static: false, private: false, access: { has: obj => "completionTime" in obj, get: obj => obj.completionTime, set: (obj, value) => { obj.completionTime = value; } }, metadata: _metadata }, _completionTime_initializers, _completionTime_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitSurveyResponseDto = SubmitSurveyResponseDto;
/**
 * DTO for survey answer
 */
let SurveyAnswerDto = (() => {
    var _a;
    let _questionId_decorators;
    let _questionId_initializers = [];
    let _questionId_extraInitializers = [];
    let _ratingValue_decorators;
    let _ratingValue_initializers = [];
    let _ratingValue_extraInitializers = [];
    let _textValue_decorators;
    let _textValue_initializers = [];
    let _textValue_extraInitializers = [];
    let _selectedOptions_decorators;
    let _selectedOptions_initializers = [];
    let _selectedOptions_extraInitializers = [];
    let _comment_decorators;
    let _comment_initializers = [];
    let _comment_extraInitializers = [];
    return _a = class SurveyAnswerDto {
            constructor() {
                this.questionId = __runInitializers(this, _questionId_initializers, void 0);
                this.ratingValue = (__runInitializers(this, _questionId_extraInitializers), __runInitializers(this, _ratingValue_initializers, void 0));
                this.textValue = (__runInitializers(this, _ratingValue_extraInitializers), __runInitializers(this, _textValue_initializers, void 0));
                this.selectedOptions = (__runInitializers(this, _textValue_extraInitializers), __runInitializers(this, _selectedOptions_initializers, void 0));
                this.comment = (__runInitializers(this, _selectedOptions_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
                __runInitializers(this, _comment_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _ratingValue_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _textValue_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(5000)];
            _selectedOptions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _comment_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _questionId_decorators, { kind: "field", name: "questionId", static: false, private: false, access: { has: obj => "questionId" in obj, get: obj => obj.questionId, set: (obj, value) => { obj.questionId = value; } }, metadata: _metadata }, _questionId_initializers, _questionId_extraInitializers);
            __esDecorate(null, null, _ratingValue_decorators, { kind: "field", name: "ratingValue", static: false, private: false, access: { has: obj => "ratingValue" in obj, get: obj => obj.ratingValue, set: (obj, value) => { obj.ratingValue = value; } }, metadata: _metadata }, _ratingValue_initializers, _ratingValue_extraInitializers);
            __esDecorate(null, null, _textValue_decorators, { kind: "field", name: "textValue", static: false, private: false, access: { has: obj => "textValue" in obj, get: obj => obj.textValue, set: (obj, value) => { obj.textValue = value; } }, metadata: _metadata }, _textValue_initializers, _textValue_extraInitializers);
            __esDecorate(null, null, _selectedOptions_decorators, { kind: "field", name: "selectedOptions", static: false, private: false, access: { has: obj => "selectedOptions" in obj, get: obj => obj.selectedOptions, set: (obj, value) => { obj.selectedOptions = value; } }, metadata: _metadata }, _selectedOptions_initializers, _selectedOptions_extraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: obj => "comment" in obj, get: obj => obj.comment, set: (obj, value) => { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SurveyAnswerDto = SurveyAnswerDto;
/**
 * DTO for creating feedback
 */
let CreateFeedbackDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isAnonymous_decorators;
    let _isAnonymous_initializers = [];
    let _isAnonymous_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateFeedbackDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.title = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.isAnonymous = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isAnonymous_initializers, void 0));
                this.tags = (__runInitializers(this, _isAnonymous_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, class_validator_1.IsEnum)(FeedbackCategory)];
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _isAnonymous_decorators = [(0, class_validator_1.IsBoolean)()];
            _tags_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isAnonymous_decorators, { kind: "field", name: "isAnonymous", static: false, private: false, access: { has: obj => "isAnonymous" in obj, get: obj => obj.isAnonymous, set: (obj, value) => { obj.isAnonymous = value; } }, metadata: _metadata }, _isAnonymous_initializers, _isAnonymous_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateFeedbackDto = CreateFeedbackDto;
/**
 * DTO for creating recognition
 */
let CreateRecognitionDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _toEmployeeId_decorators;
    let _toEmployeeId_initializers = [];
    let _toEmployeeId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _values_decorators;
    let _values_initializers = [];
    let _values_extraInitializers = [];
    let _isPublic_decorators;
    let _isPublic_initializers = [];
    let _isPublic_extraInitializers = [];
    let _monetaryValue_decorators;
    let _monetaryValue_initializers = [];
    let _monetaryValue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreateRecognitionDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.toEmployeeId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _toEmployeeId_initializers, void 0));
                this.title = (__runInitializers(this, _toEmployeeId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                this.values = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _values_initializers, void 0));
                this.isPublic = (__runInitializers(this, _values_extraInitializers), __runInitializers(this, _isPublic_initializers, void 0));
                this.monetaryValue = (__runInitializers(this, _isPublic_extraInitializers), __runInitializers(this, _monetaryValue_initializers, void 0));
                this.currency = (__runInitializers(this, _monetaryValue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, class_validator_1.IsEnum)(RecognitionType)];
            _toEmployeeId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _message_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _values_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _isPublic_decorators = [(0, class_validator_1.IsBoolean)()];
            _monetaryValue_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _toEmployeeId_decorators, { kind: "field", name: "toEmployeeId", static: false, private: false, access: { has: obj => "toEmployeeId" in obj, get: obj => obj.toEmployeeId, set: (obj, value) => { obj.toEmployeeId = value; } }, metadata: _metadata }, _toEmployeeId_initializers, _toEmployeeId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _values_decorators, { kind: "field", name: "values", static: false, private: false, access: { has: obj => "values" in obj, get: obj => obj.values, set: (obj, value) => { obj.values = value; } }, metadata: _metadata }, _values_initializers, _values_extraInitializers);
            __esDecorate(null, null, _isPublic_decorators, { kind: "field", name: "isPublic", static: false, private: false, access: { has: obj => "isPublic" in obj, get: obj => obj.isPublic, set: (obj, value) => { obj.isPublic = value; } }, metadata: _metadata }, _isPublic_initializers, _isPublic_extraInitializers);
            __esDecorate(null, null, _monetaryValue_decorators, { kind: "field", name: "monetaryValue", static: false, private: false, access: { has: obj => "monetaryValue" in obj, get: obj => obj.monetaryValue, set: (obj, value) => { obj.monetaryValue = value; } }, metadata: _metadata }, _monetaryValue_initializers, _monetaryValue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRecognitionDto = CreateRecognitionDto;
/**
 * DTO for creating wellbeing program
 */
let CreateWellbeingProgramDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _targetAudience_decorators;
    let _targetAudience_initializers = [];
    let _targetAudience_extraInitializers = [];
    return _a = class CreateWellbeingProgramDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.startDate = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.provider = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
                this.targetAudience = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _targetAudience_initializers, void 0));
                __runInitializers(this, _targetAudience_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _category_decorators = [(0, class_validator_1.IsEnum)(WellbeingCategory)];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _provider_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _targetAudience_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _targetAudience_decorators, { kind: "field", name: "targetAudience", static: false, private: false, access: { has: obj => "targetAudience" in obj, get: obj => obj.targetAudience, set: (obj, value) => { obj.targetAudience = value; } }, metadata: _metadata }, _targetAudience_initializers, _targetAudience_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWellbeingProgramDto = CreateWellbeingProgramDto;
/**
 * DTO for creating action plan
 */
let CreateActionPlanDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _basedOnSurvey_decorators;
    let _basedOnSurvey_initializers = [];
    let _basedOnSurvey_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _targetMetric_decorators;
    let _targetMetric_initializers = [];
    let _targetMetric_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    return _a = class CreateActionPlanDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.basedOnSurvey = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _basedOnSurvey_initializers, void 0));
                this.priority = (__runInitializers(this, _basedOnSurvey_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.owner = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                this.targetMetric = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _targetMetric_initializers, void 0));
                this.currentValue = (__runInitializers(this, _targetMetric_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
                this.targetValue = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.startDate = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.targetDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.actions = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
                __runInitializers(this, _actions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _basedOnSurvey_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _priority_decorators = [(0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical'])];
            _owner_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetMetric_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _currentValue_decorators = [(0, class_validator_1.IsNumber)()];
            _targetValue_decorators = [(0, class_validator_1.IsNumber)()];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _targetDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _actions_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => ActionItemDto)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _basedOnSurvey_decorators, { kind: "field", name: "basedOnSurvey", static: false, private: false, access: { has: obj => "basedOnSurvey" in obj, get: obj => obj.basedOnSurvey, set: (obj, value) => { obj.basedOnSurvey = value; } }, metadata: _metadata }, _basedOnSurvey_initializers, _basedOnSurvey_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            __esDecorate(null, null, _targetMetric_decorators, { kind: "field", name: "targetMetric", static: false, private: false, access: { has: obj => "targetMetric" in obj, get: obj => obj.targetMetric, set: (obj, value) => { obj.targetMetric = value; } }, metadata: _metadata }, _targetMetric_initializers, _targetMetric_extraInitializers);
            __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateActionPlanDto = CreateActionPlanDto;
/**
 * DTO for action item
 */
let ActionItemDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    return _a = class ActionItemDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                __runInitializers(this, _dueDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(1000)];
            _assignedTo_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _dueDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ActionItemDto = ActionItemDto;
// ============================================================================
// EMPLOYEE PULSE SURVEYS
// ============================================================================
/**
 * Creates pulse survey
 *
 * @param surveyData - Survey data
 * @returns Created survey
 *
 * @example
 * ```typescript
 * const survey = await createPulseSurvey({
 *   title: 'Weekly Check-in',
 *   description: 'How are you feeling this week?',
 *   type: SurveyType.PULSE,
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   isAnonymous: true,
 *   targetAudience: ['all'],
 *   questions: [...]
 * });
 * ```
 */
async function createPulseSurvey(surveyData) {
    const survey = {
        id: faker_1.faker.string.uuid(),
        status: SurveyStatus.DRAFT,
        responseRate: 0,
        totalInvited: 0,
        totalResponded: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...surveyData,
    };
    return survey;
}
/**
 * Launches survey
 *
 * @param surveyId - Survey identifier
 * @returns Updated survey
 *
 * @example
 * ```typescript
 * await launchSurvey('survey-123');
 * ```
 */
async function launchSurvey(surveyId) {
    const survey = await getSurveyById(surveyId);
    return { ...survey, status: SurveyStatus.ACTIVE, updatedAt: new Date() };
}
/**
 * Gets active surveys
 *
 * @param employeeId - Employee identifier
 * @returns List of active surveys
 *
 * @example
 * ```typescript
 * const surveys = await getActiveSurveys('emp-123');
 * ```
 */
async function getActiveSurveys(employeeId) {
    // In production, fetch from database
    return [];
}
/**
 * Submits survey response
 *
 * @param surveyId - Survey identifier
 * @param employeeId - Employee identifier (optional if anonymous)
 * @param responseData - Response data
 * @returns Created response
 *
 * @example
 * ```typescript
 * const response = await submitSurveyResponse('survey-123', 'emp-456', {
 *   isAnonymous: false,
 *   answers: [...],
 *   submittedAt: new Date(),
 *   completionTime: 120
 * });
 * ```
 */
async function submitSurveyResponse(surveyId, employeeId, responseData) {
    const response = {
        id: faker_1.faker.string.uuid(),
        surveyId,
        employeeId,
        ...responseData,
    };
    return response;
}
/**
 * Gets survey results
 *
 * @param surveyId - Survey identifier
 * @returns Survey results with analytics
 *
 * @example
 * ```typescript
 * const results = await getSurveyResults('survey-123');
 * ```
 */
async function getSurveyResults(surveyId) {
    // In production, fetch and analyze from database
    return {
        survey: await getSurveyById(surveyId),
        responses: 0,
        responseRate: 0,
        questionAnalytics: [],
    };
}
/**
 * Generates survey report
 *
 * @param surveyId - Survey identifier
 * @param format - Report format
 * @returns Report URL
 *
 * @example
 * ```typescript
 * const url = await generateSurveyReport('survey-123', 'pdf');
 * ```
 */
async function generateSurveyReport(surveyId, format) {
    // In production, generate and upload report
    return 'https://storage.example.com/survey-report.pdf';
}
/**
 * Gets survey participation rate
 *
 * @param surveyId - Survey identifier
 * @returns Participation metrics
 *
 * @example
 * ```typescript
 * const metrics = await getSurveyParticipation('survey-123');
 * ```
 */
async function getSurveyParticipation(surveyId) {
    // In production, calculate from database
    return {
        totalInvited: 0,
        totalResponded: 0,
        responseRate: 0,
        byDepartment: {},
        byLocation: {},
    };
}
/**
 * Sends survey reminders
 *
 * @param surveyId - Survey identifier
 * @returns Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendSurveyReminders('survey-123');
 * ```
 */
async function sendSurveyReminders(surveyId) {
    // In production, send email/notification reminders
    return 0;
}
/**
 * Closes survey
 *
 * @param surveyId - Survey identifier
 * @returns Updated survey
 *
 * @example
 * ```typescript
 * await closeSurvey('survey-123');
 * ```
 */
async function closeSurvey(surveyId) {
    const survey = await getSurveyById(surveyId);
    return { ...survey, status: SurveyStatus.CLOSED, updatedAt: new Date() };
}
// ============================================================================
// ENPS (EMPLOYEE NET PROMOTER SCORE)
// ============================================================================
/**
 * Calculates eNPS score
 *
 * @param surveyId - Survey identifier
 * @returns eNPS metrics
 *
 * @example
 * ```typescript
 * const enps = await calculateENPS('survey-123');
 * console.log('eNPS Score:', enps.score);
 * ```
 */
async function calculateENPS(surveyId) {
    // In production, calculate from survey responses
    const responses = await getSurveyResponsesForENPS(surveyId);
    const promoters = responses.filter((r) => r >= 9).length;
    const passives = responses.filter((r) => r >= 7 && r <= 8).length;
    const detractors = responses.filter((r) => r <= 6).length;
    const total = responses.length;
    const score = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
    return {
        id: faker_1.faker.string.uuid(),
        surveyId,
        period: { startDate: new Date(), endDate: new Date() },
        score,
        promoters,
        passives,
        detractors,
        totalResponses: total,
        responseRate: 0,
        byDepartment: {},
        byLocation: {},
        trend: 'stable',
    };
}
/**
 * Gets eNPS trend
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns eNPS trend data
 *
 * @example
 * ```typescript
 * const trend = await getENPSTrend(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
async function getENPSTrend(startDate, endDate) {
    // In production, fetch from database
    return [];
}
/**
 * Gets eNPS by segment
 *
 * @param surveyId - Survey identifier
 * @param segmentType - Segment type
 * @returns eNPS by segment
 *
 * @example
 * ```typescript
 * const byDept = await getENPSBySegment('survey-123', 'department');
 * ```
 */
async function getENPSBySegment(surveyId, segmentType) {
    // In production, calculate from database
    return {};
}
/**
 * Compares eNPS with benchmarks
 *
 * @param score - Current eNPS score
 * @returns Benchmark comparison
 *
 * @example
 * ```typescript
 * const comparison = compareENPSWithBenchmarks(45);
 * ```
 */
function compareENPSWithBenchmarks(score) {
    return {
        rating: score >= 50 ? 'excellent' : score >= 30 ? 'good' : score >= 10 ? 'fair' : 'poor',
        industry: 32, // Industry benchmark
        topPerformer: 72, // Top performer benchmark
    };
}
// ============================================================================
// FEEDBACK & SUGGESTION MANAGEMENT
// ============================================================================
/**
 * Creates feedback
 *
 * @param employeeId - Employee identifier
 * @param feedbackData - Feedback data
 * @returns Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await createFeedback('emp-123', {
 *   category: FeedbackCategory.WORKPLACE,
 *   title: 'Improve meeting room availability',
 *   description: 'More booking slots needed',
 *   isAnonymous: false,
 *   priority: 'medium',
 *   upvotes: 0,
 *   comments: []
 * });
 * ```
 */
async function createFeedback(employeeId, feedbackData) {
    const feedback = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        status: FeedbackStatus.SUBMITTED,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...feedbackData,
    };
    return feedback;
}
/**
 * Gets feedback by status
 *
 * @param status - Feedback status
 * @returns List of feedback
 *
 * @example
 * ```typescript
 * const pending = await getFeedbackByStatus(FeedbackStatus.UNDER_REVIEW);
 * ```
 */
async function getFeedbackByStatus(status) {
    // In production, fetch from database
    return [];
}
/**
 * Updates feedback status
 *
 * @param feedbackId - Feedback identifier
 * @param status - New status
 * @param resolution - Resolution details
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await updateFeedbackStatus('feedback-123', FeedbackStatus.RESOLVED, 'Added 5 more meeting rooms');
 * ```
 */
async function updateFeedbackStatus(feedbackId, status, resolution) {
    const feedback = await getFeedbackById(feedbackId);
    return {
        ...feedback,
        status,
        resolution,
        resolvedAt: status === FeedbackStatus.RESOLVED ? new Date() : undefined,
        updatedAt: new Date(),
    };
}
/**
 * Upvotes feedback
 *
 * @param feedbackId - Feedback identifier
 * @param employeeId - Employee identifier
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await upvoteFeedback('feedback-123', 'emp-456');
 * ```
 */
async function upvoteFeedback(feedbackId, employeeId) {
    const feedback = await getFeedbackById(feedbackId);
    return { ...feedback, upvotes: feedback.upvotes + 1, updatedAt: new Date() };
}
/**
 * Adds comment to feedback
 *
 * @param feedbackId - Feedback identifier
 * @param commentData - Comment data
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await addFeedbackComment('feedback-123', {
 *   userId: 'emp-456',
 *   userName: 'John Doe',
 *   comment: 'Great suggestion!',
 *   isInternal: false
 * });
 * ```
 */
async function addFeedbackComment(feedbackId, commentData) {
    const feedback = await getFeedbackById(feedbackId);
    const comment = {
        id: faker_1.faker.string.uuid(),
        feedbackId,
        createdAt: new Date(),
        ...commentData,
    };
    feedback.comments.push(comment);
    return { ...feedback, updatedAt: new Date() };
}
// ============================================================================
// RECOGNITION & REWARDS PROGRAMS
// ============================================================================
/**
 * Creates recognition
 *
 * @param fromEmployeeId - Sender employee identifier
 * @param recognitionData - Recognition data
 * @returns Created recognition
 *
 * @example
 * ```typescript
 * const recognition = await createRecognition('emp-123', {
 *   type: RecognitionType.PEER_RECOGNITION,
 *   fromEmployeeName: 'John Doe',
 *   toEmployeeId: 'emp-456',
 *   toEmployeeName: 'Jane Smith',
 *   title: 'Excellent Teamwork',
 *   message: 'Thanks for your help on the project!',
 *   values: ['collaboration', 'excellence'],
 *   isPublic: true,
 *   reactions: [],
 *   comments: []
 * });
 * ```
 */
async function createRecognition(fromEmployeeId, recognitionData) {
    const recognition = {
        id: faker_1.faker.string.uuid(),
        fromEmployeeId,
        createdAt: new Date(),
        ...recognitionData,
    };
    return recognition;
}
/**
 * Gets recognitions for employee
 *
 * @param employeeId - Employee identifier
 * @param type - Optional type filter
 * @returns List of recognitions
 *
 * @example
 * ```typescript
 * const recognitions = await getEmployeeRecognitions('emp-123');
 * ```
 */
async function getEmployeeRecognitions(employeeId, type) {
    // In production, fetch from database
    return [];
}
/**
 * Gets recognition leaderboard
 *
 * @param period - Time period
 * @returns Leaderboard
 *
 * @example
 * ```typescript
 * const leaderboard = await getRecognitionLeaderboard('monthly');
 * ```
 */
async function getRecognitionLeaderboard(period) {
    // In production, calculate from database
    return [];
}
/**
 * Reacts to recognition
 *
 * @param recognitionId - Recognition identifier
 * @param employeeId - Employee identifier
 * @param reaction - Reaction type
 * @returns Updated recognition
 *
 * @example
 * ```typescript
 * await reactToRecognition('recognition-123', 'emp-456', 'celebrate');
 * ```
 */
async function reactToRecognition(recognitionId, employeeId, reaction) {
    const recognition = await getRecognitionById(recognitionId);
    const newReaction = {
        id: faker_1.faker.string.uuid(),
        recognitionId,
        employeeId,
        reaction,
        createdAt: new Date(),
    };
    recognition.reactions.push(newReaction);
    return recognition;
}
/**
 * Adds comment to recognition
 *
 * @param recognitionId - Recognition identifier
 * @param employeeId - Employee identifier
 * @param comment - Comment text
 * @returns Updated recognition
 *
 * @example
 * ```typescript
 * await addRecognitionComment('recognition-123', 'emp-456', 'Well deserved!');
 * ```
 */
async function addRecognitionComment(recognitionId, employeeId, comment) {
    const recognition = await getRecognitionById(recognitionId);
    const newComment = {
        id: faker_1.faker.string.uuid(),
        recognitionId,
        employeeId,
        employeeName: 'Employee Name',
        comment,
        createdAt: new Date(),
    };
    recognition.comments.push(newComment);
    return recognition;
}
/**
 * Gets recognition feed
 *
 * @param limit - Number of items to return
 * @param offset - Pagination offset
 * @returns Recognition feed
 *
 * @example
 * ```typescript
 * const feed = await getRecognitionFeed(20, 0);
 * ```
 */
async function getRecognitionFeed(limit, offset) {
    // In production, fetch from database with pagination
    return [];
}
/**
 * Gets recognition analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Recognition analytics
 *
 * @example
 * ```typescript
 * const analytics = await getRecognitionAnalytics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
async function getRecognitionAnalytics(startDate, endDate) {
    // In production, calculate from database
    return {
        totalRecognitions: 0,
        byType: {},
        topRecognizers: [],
        topRecognized: [],
        avgMonetaryValue: 0,
    };
}
// ============================================================================
// MILESTONE CELEBRATIONS
// ============================================================================
/**
 * Creates milestone celebration
 *
 * @param milestoneData - Milestone data
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   employeeId: 'emp-123',
 *   employeeName: 'John Doe',
 *   type: MilestoneType.WORK_ANNIVERSARY,
 *   title: '5 Year Anniversary',
 *   description: 'Celebrating 5 years with the company',
 *   date: new Date(),
 *   yearsOfService: 5,
 *   isPublic: true,
 *   celebratedBy: []
 * });
 * ```
 */
async function createMilestone(milestoneData) {
    const milestone = {
        id: faker_1.faker.string.uuid(),
        createdAt: new Date(),
        ...milestoneData,
    };
    return milestone;
}
/**
 * Gets upcoming milestones
 *
 * @param days - Number of days to look ahead
 * @returns List of upcoming milestones
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingMilestones(30);
 * ```
 */
async function getUpcomingMilestones(days) {
    // In production, fetch from database
    return [];
}
/**
 * Celebrates milestone
 *
 * @param milestoneId - Milestone identifier
 * @param employeeId - Employee identifier celebrating
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await celebrateMilestone('milestone-123', 'emp-456');
 * ```
 */
async function celebrateMilestone(milestoneId, employeeId) {
    const milestone = await getMilestoneById(milestoneId);
    if (!milestone.celebratedBy.includes(employeeId)) {
        milestone.celebratedBy.push(employeeId);
    }
    return milestone;
}
/**
 * Adds gift to milestone
 *
 * @param milestoneId - Milestone identifier
 * @param gift - Gift details
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await addMilestoneGift('milestone-123', {
 *   giftType: 'bonus',
 *   description: 'Anniversary bonus',
 *   value: 1000,
 *   currency: 'USD'
 * });
 * ```
 */
async function addMilestoneGift(milestoneId, gift) {
    const milestone = await getMilestoneById(milestoneId);
    if (!milestone.gifts)
        milestone.gifts = [];
    milestone.gifts.push(gift);
    return milestone;
}
// ============================================================================
// INTERNAL SOCIAL FEATURES
// ============================================================================
/**
 * Creates social post
 *
 * @param authorId - Author employee identifier
 * @param postData - Post data
 * @returns Created post
 *
 * @example
 * ```typescript
 * const post = await createSocialPost('emp-123', {
 *   authorName: 'John Doe',
 *   content: 'Great team meeting today!',
 *   hashtags: ['teamwork'],
 *   mentions: ['emp-456'],
 *   likes: 0,
 *   comments: [],
 *   shares: 0,
 *   isPublic: true,
 *   isPinned: false
 * });
 * ```
 */
async function createSocialPost(authorId, postData) {
    const post = {
        id: faker_1.faker.string.uuid(),
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...postData,
    };
    return post;
}
/**
 * Gets social feed
 *
 * @param employeeId - Employee identifier
 * @param limit - Number of posts
 * @param offset - Pagination offset
 * @returns Social feed
 *
 * @example
 * ```typescript
 * const feed = await getSocialFeed('emp-123', 20, 0);
 * ```
 */
async function getSocialFeed(employeeId, limit, offset) {
    // In production, fetch personalized feed from database
    return [];
}
/**
 * Likes social post
 *
 * @param postId - Post identifier
 * @param employeeId - Employee identifier
 * @returns Updated post
 *
 * @example
 * ```typescript
 * await likeSocialPost('post-123', 'emp-456');
 * ```
 */
async function likeSocialPost(postId, employeeId) {
    const post = await getSocialPostById(postId);
    return { ...post, likes: post.likes + 1, updatedAt: new Date() };
}
/**
 * Comments on social post
 *
 * @param postId - Post identifier
 * @param employeeId - Employee identifier
 * @param comment - Comment text
 * @returns Updated post
 *
 * @example
 * ```typescript
 * await commentOnSocialPost('post-123', 'emp-456', 'Great post!');
 * ```
 */
async function commentOnSocialPost(postId, employeeId, comment) {
    const post = await getSocialPostById(postId);
    const newComment = {
        id: faker_1.faker.string.uuid(),
        postId,
        authorId: employeeId,
        authorName: 'Employee Name',
        comment,
        likes: 0,
        createdAt: new Date(),
    };
    post.comments.push(newComment);
    return { ...post, updatedAt: new Date() };
}
// ============================================================================
// EMPLOYEE WELLBEING PROGRAMS
// ============================================================================
/**
 * Creates wellbeing program
 *
 * @param programData - Program data
 * @returns Created program
 *
 * @example
 * ```typescript
 * const program = await createWellbeingProgram({
 *   title: 'Mindfulness Challenge',
 *   description: '30-day mindfulness program',
 *   category: WellbeingCategory.MENTAL,
 *   startDate: new Date(),
 *   isActive: true,
 *   activities: [],
 *   participationCount: 0,
 *   targetAudience: ['all'],
 *   resources: []
 * });
 * ```
 */
async function createWellbeingProgram(programData) {
    const program = {
        id: faker_1.faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...programData,
    };
    return program;
}
/**
 * Gets active wellbeing programs
 *
 * @param category - Optional category filter
 * @returns List of active programs
 *
 * @example
 * ```typescript
 * const programs = await getActiveWellbeingPrograms(WellbeingCategory.PHYSICAL);
 * ```
 */
async function getActiveWellbeingPrograms(category) {
    // In production, fetch from database
    return [];
}
/**
 * Enrolls in wellbeing program
 *
 * @param programId - Program identifier
 * @param employeeId - Employee identifier
 * @returns Enrollment status
 *
 * @example
 * ```typescript
 * await enrollInWellbeingProgram('program-123', 'emp-456');
 * ```
 */
async function enrollInWellbeingProgram(programId, employeeId) {
    // In production, create enrollment in database
    return true;
}
/**
 * Logs wellbeing activity
 *
 * @param programId - Program identifier
 * @param activityId - Activity identifier
 * @param employeeId - Employee identifier
 * @returns Activity log
 *
 * @example
 * ```typescript
 * await logWellbeingActivity('program-123', 'activity-456', 'emp-789');
 * ```
 */
async function logWellbeingActivity(programId, activityId, employeeId) {
    // In production, log activity and calculate points
    return { logged: true, points: 10 };
}
/**
 * Gets wellbeing participation metrics
 *
 * @param programId - Program identifier
 * @returns Participation metrics
 *
 * @example
 * ```typescript
 * const metrics = await getWellbeingParticipation('program-123');
 * ```
 */
async function getWellbeingParticipation(programId) {
    // In production, calculate from database
    return { totalEnrolled: 0, activeParticipants: 0, completionRate: 0 };
}
// ============================================================================
// EMPLOYEE SENTIMENT ANALYSIS
// ============================================================================
/**
 * Analyzes text sentiment
 *
 * @param text - Text to analyze
 * @param sourceType - Source type
 * @param sourceId - Source identifier
 * @returns Sentiment analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSentiment('I love working here!', 'survey', 'survey-123');
 * ```
 */
async function analyzeSentiment(text, sourceType, sourceId) {
    // In production, use ML model for sentiment analysis
    const analysis = {
        id: faker_1.faker.string.uuid(),
        sourceType,
        sourceId,
        text,
        sentiment: SentimentScore.POSITIVE,
        confidence: 0.85,
        topics: ['work', 'culture'],
        keywords: ['love', 'working'],
        analyzedAt: new Date(),
    };
    return analysis;
}
/**
 * Gets sentiment trends
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param segmentBy - Segment type
 * @returns Sentiment trends
 *
 * @example
 * ```typescript
 * const trends = await getSentimentTrends(new Date('2025-01-01'), new Date('2025-12-31'), 'department');
 * ```
 */
async function getSentimentTrends(startDate, endDate, segmentBy) {
    // In production, fetch from database
    return [];
}
/**
 * Gets sentiment drivers
 *
 * @param sentiment - Sentiment score
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Top drivers
 *
 * @example
 * ```typescript
 * const drivers = await getSentimentDrivers(SentimentScore.NEGATIVE, new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
async function getSentimentDrivers(sentiment, startDate, endDate) {
    // In production, analyze from database
    return [];
}
// ============================================================================
// ENGAGEMENT ACTION PLANNING
// ============================================================================
/**
 * Creates engagement action plan
 *
 * @param planData - Action plan data
 * @returns Created action plan
 *
 * @example
 * ```typescript
 * const plan = await createEngagementActionPlan({
 *   title: 'Improve Communication',
 *   description: 'Based on survey feedback',
 *   basedOnSurvey: 'survey-123',
 *   priority: 'high',
 *   status: 'draft',
 *   owner: 'mgr-456',
 *   targetMetric: 'Communication Score',
 *   currentValue: 65,
 *   targetValue: 80,
 *   actions: [...],
 *   startDate: new Date(),
 *   targetDate: new Date('2025-12-31'),
 *   progress: 0
 * });
 * ```
 */
async function createEngagementActionPlan(planData) {
    const plan = {
        id: faker_1.faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...planData,
    };
    return plan;
}
/**
 * Updates action plan progress
 *
 * @param planId - Plan identifier
 * @param progress - Progress percentage
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await updateActionPlanProgress('plan-123', 75);
 * ```
 */
async function updateActionPlanProgress(planId, progress) {
    const plan = await getActionPlanById(planId);
    return { ...plan, progress, updatedAt: new Date() };
}
// ============================================================================
// ENGAGEMENT ANALYTICS & TRENDS
// ============================================================================
/**
 * Gets engagement analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Engagement analytics
 *
 * @example
 * ```typescript
 * const analytics = await getEngagementAnalytics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
async function getEngagementAnalytics(startDate, endDate) {
    // In production, calculate comprehensive analytics from database
    return {
        period: { startDate, endDate },
        overallEngagement: { score: 0, trend: 'stable', percentageChange: 0 },
        eNPS: { score: 0, trend: 'stable', percentageChange: 0 },
        surveyMetrics: { totalSurveys: 0, avgResponseRate: 0, avgCompletionTime: 0 },
        recognitionMetrics: { totalRecognitions: 0, avgRecognitionsPerEmployee: 0, topRecognizers: [] },
        feedbackMetrics: { totalFeedback: 0, resolvedPercentage: 0, avgResolutionTime: 0, topCategories: [] },
        wellbeingMetrics: { totalPrograms: 0, participationRate: 0, topPrograms: [] },
        sentimentAnalysis: { overallSentiment: SentimentScore.NEUTRAL, positivePercentage: 0, neutralPercentage: 0, negativePercentage: 0 },
    };
}
/**
 * Gets engagement heatmap
 *
 * @param segmentBy - Segment type
 * @returns Engagement heatmap
 *
 * @example
 * ```typescript
 * const heatmap = await getEngagementHeatmap('department');
 * ```
 */
async function getEngagementHeatmap(segmentBy) {
    // In production, calculate from database
    return [];
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Gets survey by ID
 */
async function getSurveyById(surveyId) {
    return {
        id: surveyId,
        title: 'Survey',
        description: '',
        type: SurveyType.PULSE,
        status: SurveyStatus.DRAFT,
        startDate: new Date(),
        endDate: new Date(),
        isAnonymous: false,
        targetAudience: [],
        questions: [],
        responseRate: 0,
        totalInvited: 0,
        totalResponded: 0,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets survey responses for eNPS calculation
 */
async function getSurveyResponsesForENPS(surveyId) {
    // In production, fetch and extract NPS scores
    return [];
}
/**
 * Gets feedback by ID
 */
async function getFeedbackById(feedbackId) {
    return {
        id: feedbackId,
        employeeId: 'emp-1',
        category: FeedbackCategory.WORKPLACE,
        title: 'Feedback',
        description: '',
        isAnonymous: false,
        status: FeedbackStatus.SUBMITTED,
        priority: 'medium',
        upvotes: 0,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets recognition by ID
 */
async function getRecognitionById(recognitionId) {
    return {
        id: recognitionId,
        type: RecognitionType.PEER_RECOGNITION,
        fromEmployeeId: 'emp-1',
        fromEmployeeName: 'Employee 1',
        toEmployeeId: 'emp-2',
        toEmployeeName: 'Employee 2',
        title: 'Recognition',
        message: '',
        isPublic: true,
        reactions: [],
        comments: [],
        createdAt: new Date(),
    };
}
/**
 * Gets milestone by ID
 */
async function getMilestoneById(milestoneId) {
    return {
        id: milestoneId,
        employeeId: 'emp-1',
        employeeName: 'Employee',
        type: MilestoneType.WORK_ANNIVERSARY,
        title: 'Milestone',
        description: '',
        date: new Date(),
        isPublic: true,
        celebratedBy: [],
        createdAt: new Date(),
    };
}
/**
 * Gets social post by ID
 */
async function getSocialPostById(postId) {
    return {
        id: postId,
        authorId: 'emp-1',
        authorName: 'Employee',
        content: '',
        likes: 0,
        comments: [],
        shares: 0,
        isPublic: true,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets action plan by ID
 */
async function getActionPlanById(planId) {
    return {
        id: planId,
        title: 'Action Plan',
        description: '',
        priority: 'medium',
        status: 'draft',
        owner: 'user-1',
        targetMetric: 'Metric',
        currentValue: 0,
        targetValue: 100,
        actions: [],
        startDate: new Date(),
        targetDate: new Date(),
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Employee Engagement Controller
 * Provides RESTful API endpoints for employee engagement operations
 */
let EmployeeEngagementController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('employee-engagement'), (0, common_1.Controller)('employee-engagement'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getActive_decorators;
    let _submitResponse_decorators;
    let _getENPS_decorators;
    let _createFeedback_decorators;
    let _getRecognitionFeed_decorators;
    let _getAnalytics_decorators;
    var EmployeeEngagementController = _classThis = class {
        /**
         * Get active surveys
         */
        async getActive(employeeId) {
            return getActiveSurveys(employeeId);
        }
        /**
         * Submit survey response
         */
        async submitResponse(surveyId, responseDto) {
            return submitSurveyResponse(surveyId, undefined, responseDto);
        }
        /**
         * Get eNPS score
         */
        async getENPS(surveyId) {
            return calculateENPS(surveyId);
        }
        /**
         * Create feedback
         */
        async createFeedback(employeeId, feedbackDto) {
            return createFeedback(employeeId, feedbackDto);
        }
        /**
         * Get recognition feed
         */
        async getRecognitionFeed(limit = 20, offset = 0) {
            return getRecognitionFeed(limit, offset);
        }
        /**
         * Get engagement analytics
         */
        async getAnalytics(startDate, endDate) {
            return getEngagementAnalytics(new Date(startDate), new Date(endDate));
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeEngagementController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getActive_decorators = [(0, common_1.Get)('surveys/active/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Get active surveys for employee' }), (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee ID' })];
        _submitResponse_decorators = [(0, common_1.Post)('surveys/:surveyId/responses'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Submit survey response' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getENPS_decorators = [(0, common_1.Get)('enps/:surveyId'), (0, swagger_1.ApiOperation)({ summary: 'Get eNPS score for survey' })];
        _createFeedback_decorators = [(0, common_1.Post)('feedback/:employeeId'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create feedback' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getRecognitionFeed_decorators = [(0, common_1.Get)('recognition/feed'), (0, swagger_1.ApiOperation)({ summary: 'Get recognition feed' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false }), (0, swagger_1.ApiQuery)({ name: 'offset', required: false })];
        _getAnalytics_decorators = [(0, common_1.Get)('analytics'), (0, swagger_1.ApiOperation)({ summary: 'Get engagement analytics' }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: true })];
        __esDecorate(_classThis, null, _getActive_decorators, { kind: "method", name: "getActive", static: false, private: false, access: { has: obj => "getActive" in obj, get: obj => obj.getActive }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitResponse_decorators, { kind: "method", name: "submitResponse", static: false, private: false, access: { has: obj => "submitResponse" in obj, get: obj => obj.submitResponse }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getENPS_decorators, { kind: "method", name: "getENPS", static: false, private: false, access: { has: obj => "getENPS" in obj, get: obj => obj.getENPS }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFeedback_decorators, { kind: "method", name: "createFeedback", static: false, private: false, access: { has: obj => "createFeedback" in obj, get: obj => obj.createFeedback }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecognitionFeed_decorators, { kind: "method", name: "getRecognitionFeed", static: false, private: false, access: { has: obj => "getRecognitionFeed" in obj, get: obj => obj.getRecognitionFeed }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeEngagementController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeEngagementController = _classThis;
})();
exports.EmployeeEngagementController = EmployeeEngagementController;
//# sourceMappingURL=employee-engagement-kit.js.map