"use strict";
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
exports.SubmittalReview = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const submittal_types_1 = require("../types/submittal.types");
const construction_submittal_model_1 = require("./construction-submittal.model");
let SubmittalReview = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'submittal_reviews',
            timestamps: true,
            indexes: [
                { fields: ['submittalId'] },
                { fields: ['reviewerId'] },
                { fields: ['reviewDate'] },
                { fields: ['action'] },
                { fields: ['isLatest'] },
                { fields: ['submittalId', 'reviewStepNumber'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _submittalId_decorators;
    let _submittalId_initializers = [];
    let _submittalId_extraInitializers = [];
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _reviewerName_decorators;
    let _reviewerName_initializers = [];
    let _reviewerName_extraInitializers = [];
    let _reviewerEmail_decorators;
    let _reviewerEmail_initializers = [];
    let _reviewerEmail_extraInitializers = [];
    let _reviewerRole_decorators;
    let _reviewerRole_initializers = [];
    let _reviewerRole_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _privateNotes_decorators;
    let _privateNotes_initializers = [];
    let _privateNotes_extraInitializers = [];
    let _markupUrls_decorators;
    let _markupUrls_initializers = [];
    let _markupUrls_extraInitializers = [];
    let _deficiencies_decorators;
    let _deficiencies_initializers = [];
    let _deficiencies_extraInitializers = [];
    let _nextAction_decorators;
    let _nextAction_initializers = [];
    let _nextAction_extraInitializers = [];
    let _daysToReview_decorators;
    let _daysToReview_initializers = [];
    let _daysToReview_extraInitializers = [];
    let _signature_decorators;
    let _signature_initializers = [];
    let _signature_extraInitializers = [];
    let _isLatest_decorators;
    let _isLatest_initializers = [];
    let _isLatest_extraInitializers = [];
    let _reviewStepNumber_decorators;
    let _reviewStepNumber_initializers = [];
    let _reviewStepNumber_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SubmittalReview = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.submittalId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _submittalId_initializers, void 0));
            this.reviewerId = (__runInitializers(this, _submittalId_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
            this.reviewerName = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _reviewerName_initializers, void 0));
            this.reviewerEmail = (__runInitializers(this, _reviewerName_extraInitializers), __runInitializers(this, _reviewerEmail_initializers, void 0));
            this.reviewerRole = (__runInitializers(this, _reviewerEmail_extraInitializers), __runInitializers(this, _reviewerRole_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _reviewerRole_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.action = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.comments = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.privateNotes = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _privateNotes_initializers, void 0));
            this.markupUrls = (__runInitializers(this, _privateNotes_extraInitializers), __runInitializers(this, _markupUrls_initializers, void 0));
            this.deficiencies = (__runInitializers(this, _markupUrls_extraInitializers), __runInitializers(this, _deficiencies_initializers, void 0));
            this.nextAction = (__runInitializers(this, _deficiencies_extraInitializers), __runInitializers(this, _nextAction_initializers, void 0));
            this.daysToReview = (__runInitializers(this, _nextAction_extraInitializers), __runInitializers(this, _daysToReview_initializers, void 0));
            this.signature = (__runInitializers(this, _daysToReview_extraInitializers), __runInitializers(this, _signature_initializers, void 0));
            this.isLatest = (__runInitializers(this, _signature_extraInitializers), __runInitializers(this, _isLatest_initializers, void 0));
            this.reviewStepNumber = (__runInitializers(this, _isLatest_extraInitializers), __runInitializers(this, _reviewStepNumber_initializers, void 0));
            this.metadata = (__runInitializers(this, _reviewStepNumber_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SubmittalReview");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _submittalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_submittal_model_1.ConstructionSubmittal), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reviewerId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _reviewerName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reviewerEmail_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _reviewerRole_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reviewDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _action_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(submittal_types_1.ReviewAction)),
            })];
        _comments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _privateNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _markupUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _deficiencies_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _nextAction_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _daysToReview_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _signature_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isLatest_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _reviewStepNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(1), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _submittalId_decorators, { kind: "field", name: "submittalId", static: false, private: false, access: { has: obj => "submittalId" in obj, get: obj => obj.submittalId, set: (obj, value) => { obj.submittalId = value; } }, metadata: _metadata }, _submittalId_initializers, _submittalId_extraInitializers);
        __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
        __esDecorate(null, null, _reviewerName_decorators, { kind: "field", name: "reviewerName", static: false, private: false, access: { has: obj => "reviewerName" in obj, get: obj => obj.reviewerName, set: (obj, value) => { obj.reviewerName = value; } }, metadata: _metadata }, _reviewerName_initializers, _reviewerName_extraInitializers);
        __esDecorate(null, null, _reviewerEmail_decorators, { kind: "field", name: "reviewerEmail", static: false, private: false, access: { has: obj => "reviewerEmail" in obj, get: obj => obj.reviewerEmail, set: (obj, value) => { obj.reviewerEmail = value; } }, metadata: _metadata }, _reviewerEmail_initializers, _reviewerEmail_extraInitializers);
        __esDecorate(null, null, _reviewerRole_decorators, { kind: "field", name: "reviewerRole", static: false, private: false, access: { has: obj => "reviewerRole" in obj, get: obj => obj.reviewerRole, set: (obj, value) => { obj.reviewerRole = value; } }, metadata: _metadata }, _reviewerRole_initializers, _reviewerRole_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _privateNotes_decorators, { kind: "field", name: "privateNotes", static: false, private: false, access: { has: obj => "privateNotes" in obj, get: obj => obj.privateNotes, set: (obj, value) => { obj.privateNotes = value; } }, metadata: _metadata }, _privateNotes_initializers, _privateNotes_extraInitializers);
        __esDecorate(null, null, _markupUrls_decorators, { kind: "field", name: "markupUrls", static: false, private: false, access: { has: obj => "markupUrls" in obj, get: obj => obj.markupUrls, set: (obj, value) => { obj.markupUrls = value; } }, metadata: _metadata }, _markupUrls_initializers, _markupUrls_extraInitializers);
        __esDecorate(null, null, _deficiencies_decorators, { kind: "field", name: "deficiencies", static: false, private: false, access: { has: obj => "deficiencies" in obj, get: obj => obj.deficiencies, set: (obj, value) => { obj.deficiencies = value; } }, metadata: _metadata }, _deficiencies_initializers, _deficiencies_extraInitializers);
        __esDecorate(null, null, _nextAction_decorators, { kind: "field", name: "nextAction", static: false, private: false, access: { has: obj => "nextAction" in obj, get: obj => obj.nextAction, set: (obj, value) => { obj.nextAction = value; } }, metadata: _metadata }, _nextAction_initializers, _nextAction_extraInitializers);
        __esDecorate(null, null, _daysToReview_decorators, { kind: "field", name: "daysToReview", static: false, private: false, access: { has: obj => "daysToReview" in obj, get: obj => obj.daysToReview, set: (obj, value) => { obj.daysToReview = value; } }, metadata: _metadata }, _daysToReview_initializers, _daysToReview_extraInitializers);
        __esDecorate(null, null, _signature_decorators, { kind: "field", name: "signature", static: false, private: false, access: { has: obj => "signature" in obj, get: obj => obj.signature, set: (obj, value) => { obj.signature = value; } }, metadata: _metadata }, _signature_initializers, _signature_extraInitializers);
        __esDecorate(null, null, _isLatest_decorators, { kind: "field", name: "isLatest", static: false, private: false, access: { has: obj => "isLatest" in obj, get: obj => obj.isLatest, set: (obj, value) => { obj.isLatest = value; } }, metadata: _metadata }, _isLatest_initializers, _isLatest_extraInitializers);
        __esDecorate(null, null, _reviewStepNumber_decorators, { kind: "field", name: "reviewStepNumber", static: false, private: false, access: { has: obj => "reviewStepNumber" in obj, get: obj => obj.reviewStepNumber, set: (obj, value) => { obj.reviewStepNumber = value; } }, metadata: _metadata }, _reviewStepNumber_initializers, _reviewStepNumber_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubmittalReview = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubmittalReview = _classThis;
})();
exports.SubmittalReview = SubmittalReview;
//# sourceMappingURL=submittal-review.model.js.map