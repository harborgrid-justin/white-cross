"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceChecklistItemRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const compliance_checklist_item_model_1 = require("../../models/compliance-checklist-item.model");
let ComplianceChecklistItemRepository = class ComplianceChecklistItemRepository {
    complianceChecklistItemModel;
    constructor(complianceChecklistItemModel) {
        this.complianceChecklistItemModel = complianceChecklistItemModel;
    }
    async findAll() {
        return this.complianceChecklistItemModel.findAll();
    }
    async findById(id) {
        return this.complianceChecklistItemModel.findByPk(id);
    }
    async create(data) {
        return this.complianceChecklistItemModel.create(data);
    }
    async update(id, data) {
        return this.complianceChecklistItemModel.update(data, {
            where: { id },
        });
    }
    async delete(id) {
        return this.complianceChecklistItemModel.destroy({
            where: { id },
        });
    }
};
exports.ComplianceChecklistItemRepository = ComplianceChecklistItemRepository;
exports.ComplianceChecklistItemRepository = ComplianceChecklistItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(compliance_checklist_item_model_1.ComplianceChecklistItem)),
    __metadata("design:paramtypes", [Object])
], ComplianceChecklistItemRepository);
//# sourceMappingURL=compliance-checklist-item.repository.js.map