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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistService = void 0;
const common_1 = require("@nestjs/common");
const checklist_repository_1 = require("../repositories/checklist.repository");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ChecklistService = class ChecklistService extends base_1.BaseService {
    checklistRepository;
    constructor(checklistRepository) {
        super("ChecklistService");
        this.checklistRepository = checklistRepository;
    }
    async listChecklists(query) {
        const { page = 1, limit = 20, ...filters } = query;
        const { data, total } = await this.checklistRepository.findAll(filters, page, limit);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getChecklistById(id) {
        const checklist = await this.checklistRepository.findById(id);
        if (!checklist) {
            throw new common_1.NotFoundException(`Checklist item with ID ${id} not found`);
        }
        return checklist;
    }
    async createChecklist(dto) {
        return this.checklistRepository.create({
            ...dto,
            status: models_1.ChecklistItemStatus.PENDING,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        });
    }
    async updateChecklist(id, dto) {
        await this.getChecklistById(id);
        const updateData = { ...dto };
        if (dto.status === models_1.ChecklistItemStatus.COMPLETED &&
            !updateData.completedAt) {
            updateData.completedAt = new Date();
        }
        return this.checklistRepository.update(id, updateData);
    }
    async deleteChecklist(id) {
        await this.getChecklistById(id);
        return this.checklistRepository.delete(id);
    }
};
exports.ChecklistService = ChecklistService;
exports.ChecklistService = ChecklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [checklist_repository_1.ChecklistRepository])
], ChecklistService);
//# sourceMappingURL=checklist.service.js.map