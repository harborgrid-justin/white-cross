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
exports.ActivityRelationship = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const schedule_types_1 = require("../types/schedule.types");
let ActivityRelationship = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'activity_relationships',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['predecessorActivityId'] },
                { fields: ['successorActivityId'] },
                { fields: ['relationshipType'] },
                { fields: ['projectId', 'predecessorActivityId'] },
                { fields: ['projectId', 'successorActivityId'] },
                { fields: ['predecessorActivityId', 'successorActivityId'], unique: true },
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
    let _predecessorActivityId_decorators;
    let _predecessorActivityId_initializers = [];
    let _predecessorActivityId_extraInitializers = [];
    let _successorActivityId_decorators;
    let _successorActivityId_initializers = [];
    let _successorActivityId_extraInitializers = [];
    let _relationshipType_decorators;
    let _relationshipType_initializers = [];
    let _relationshipType_extraInitializers = [];
    let _lagDays_decorators;
    let _lagDays_initializers = [];
    let _lagDays_extraInitializers = [];
    let _lagType_decorators;
    let _lagType_initializers = [];
    let _lagType_extraInitializers = [];
    let _isDriving_decorators;
    let _isDriving_initializers = [];
    let _isDriving_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ActivityRelationship = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.predecessorActivityId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _predecessorActivityId_initializers, void 0));
            this.successorActivityId = (__runInitializers(this, _predecessorActivityId_extraInitializers), __runInitializers(this, _successorActivityId_initializers, void 0));
            this.relationshipType = (__runInitializers(this, _successorActivityId_extraInitializers), __runInitializers(this, _relationshipType_initializers, void 0));
            this.lagDays = (__runInitializers(this, _relationshipType_extraInitializers), __runInitializers(this, _lagDays_initializers, void 0));
            this.lagType = (__runInitializers(this, _lagDays_extraInitializers), __runInitializers(this, _lagType_initializers, void 0));
            this.isDriving = (__runInitializers(this, _lagType_extraInitializers), __runInitializers(this, _isDriving_initializers, void 0));
            this.metadata = (__runInitializers(this, _isDriving_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ActivityRelationship");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _predecessorActivityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _successorActivityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _relationshipType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(schedule_types_1.RelationshipType.FS), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(schedule_types_1.RelationshipType)),
            })];
        _lagDays_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _lagType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(schedule_types_1.DurationType.WORKING_DAYS), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(schedule_types_1.DurationType)),
            })];
        _isDriving_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _predecessorActivityId_decorators, { kind: "field", name: "predecessorActivityId", static: false, private: false, access: { has: obj => "predecessorActivityId" in obj, get: obj => obj.predecessorActivityId, set: (obj, value) => { obj.predecessorActivityId = value; } }, metadata: _metadata }, _predecessorActivityId_initializers, _predecessorActivityId_extraInitializers);
        __esDecorate(null, null, _successorActivityId_decorators, { kind: "field", name: "successorActivityId", static: false, private: false, access: { has: obj => "successorActivityId" in obj, get: obj => obj.successorActivityId, set: (obj, value) => { obj.successorActivityId = value; } }, metadata: _metadata }, _successorActivityId_initializers, _successorActivityId_extraInitializers);
        __esDecorate(null, null, _relationshipType_decorators, { kind: "field", name: "relationshipType", static: false, private: false, access: { has: obj => "relationshipType" in obj, get: obj => obj.relationshipType, set: (obj, value) => { obj.relationshipType = value; } }, metadata: _metadata }, _relationshipType_initializers, _relationshipType_extraInitializers);
        __esDecorate(null, null, _lagDays_decorators, { kind: "field", name: "lagDays", static: false, private: false, access: { has: obj => "lagDays" in obj, get: obj => obj.lagDays, set: (obj, value) => { obj.lagDays = value; } }, metadata: _metadata }, _lagDays_initializers, _lagDays_extraInitializers);
        __esDecorate(null, null, _lagType_decorators, { kind: "field", name: "lagType", static: false, private: false, access: { has: obj => "lagType" in obj, get: obj => obj.lagType, set: (obj, value) => { obj.lagType = value; } }, metadata: _metadata }, _lagType_initializers, _lagType_extraInitializers);
        __esDecorate(null, null, _isDriving_decorators, { kind: "field", name: "isDriving", static: false, private: false, access: { has: obj => "isDriving" in obj, get: obj => obj.isDriving, set: (obj, value) => { obj.isDriving = value; } }, metadata: _metadata }, _isDriving_initializers, _isDriving_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivityRelationship = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivityRelationship = _classThis;
})();
exports.ActivityRelationship = ActivityRelationship;
//# sourceMappingURL=activity-relationship.model.js.map