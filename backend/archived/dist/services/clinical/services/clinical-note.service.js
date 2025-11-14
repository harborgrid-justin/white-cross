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
exports.ClinicalNoteService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const clinical_note_model_1 = require("../../../database/models/clinical-note.model");
const base_1 = require("../../../common/base");
let ClinicalNoteService = class ClinicalNoteService extends base_1.BaseService {
    noteModel;
    constructor(noteModel) {
        super("ClinicalNoteService");
        this.noteModel = noteModel;
    }
    async create(createDto) {
        return this.noteModel.create(createDto);
    }
    async findOne(id) {
        const note = await this.noteModel.findByPk(id, { include: ['visit'] });
        if (!note)
            throw new common_1.NotFoundException(`Note ${id} not found`);
        return note;
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters.studentId)
            whereClause.studentId = filters.studentId;
        if (filters.visitId)
            whereClause.visitId = filters.visitId;
        if (filters.type)
            whereClause.type = filters.type;
        if (filters.createdBy)
            whereClause.createdBy = filters.createdBy;
        if (filters.signedOnly)
            whereClause.isSigned = true;
        if (filters.unsignedOnly)
            whereClause.isSigned = false;
        const { rows: notes, count: total } = await this.noteModel.findAndCountAll({
            where: whereClause,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['createdAt', 'DESC']],
        });
        return { notes, total };
    }
    async findByVisit(visitId) {
        return this.noteModel.findAll({
            where: { visitId },
            order: [['createdAt', 'DESC']],
        });
    }
    async findByStudent(studentId, limit = 10) {
        return this.noteModel.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']],
            limit,
        });
    }
    async update(id, updateDto) {
        const note = await this.findOne(id);
        if (note.isSigned)
            throw new common_1.BadRequestException('Cannot update a signed note');
        Object.assign(note, updateDto);
        return note.save();
    }
    async sign(id) {
        const note = await this.findOne(id);
        if (note.isSigned)
            throw new common_1.BadRequestException('Note is already signed');
        note.sign();
        return note.save();
    }
    async remove(id) {
        const note = await this.findOne(id);
        if (note.isSigned)
            throw new common_1.BadRequestException('Cannot delete a signed note');
        await note.destroy();
        this.logInfo(`Deleted note ${id}`);
    }
};
exports.ClinicalNoteService = ClinicalNoteService;
exports.ClinicalNoteService = ClinicalNoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(clinical_note_model_1.ClinicalNote)),
    __metadata("design:paramtypes", [Object])
], ClinicalNoteService);
//# sourceMappingURL=clinical-note.service.js.map