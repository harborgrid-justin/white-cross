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
exports.ClinicalProtocolService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const clinical_protocol_model_1 = require("../../../database/models/clinical-protocol.model");
const protocol_status_enum_1 = require("../enums/protocol-status.enum");
const base_1 = require("../../../common/base");
let ClinicalProtocolService = class ClinicalProtocolService extends base_1.BaseService {
    protocolModel;
    constructor(protocolModel) {
        super("ClinicalProtocolService");
        this.protocolModel = protocolModel;
    }
    async create(createDto) {
        return this.protocolModel.create(createDto);
    }
    async findOne(id) {
        const protocol = await this.protocolModel.findByPk(id);
        if (!protocol)
            throw new common_1.NotFoundException(`Protocol ${id} not found`);
        return protocol;
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters.status)
            whereClause.status = filters.status;
        if (filters.category)
            whereClause.category = filters.category;
        if (filters.name)
            whereClause.name = { [sequelize_2.Op.iLike]: `%${filters.name}%` };
        if (filters.tag)
            whereClause.tags = { [sequelize_2.Op.contains]: [filters.tag] };
        if (filters.activeOnly)
            whereClause.status = protocol_status_enum_1.ProtocolStatus.ACTIVE;
        const { rows: protocols, count: total } = await this.protocolModel.findAndCountAll({
            where: whereClause,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['name', 'ASC']],
        });
        return { protocols, total };
    }
    async getActiveProtocols() {
        return this.protocolModel.findAll({
            where: { status: protocol_status_enum_1.ProtocolStatus.ACTIVE },
            order: [['name', 'ASC']],
        });
    }
    async update(id, updateDto) {
        const protocol = await this.findOne(id);
        Object.assign(protocol, updateDto);
        await protocol.save();
        return protocol;
    }
    async activate(id, activateDto) {
        const protocol = await this.findOne(id);
        if (protocol.status === protocol_status_enum_1.ProtocolStatus.ACTIVE) {
            throw new common_1.BadRequestException('Protocol is already active');
        }
        protocol.status = protocol_status_enum_1.ProtocolStatus.ACTIVE;
        protocol.approvedBy = activateDto.approvedBy;
        protocol.approvedDate = activateDto.approvedDate;
        protocol.effectiveDate =
            activateDto.effectiveDate || activateDto.approvedDate;
        await protocol.save();
        return protocol;
    }
    async deactivate(id) {
        const protocol = await this.findOne(id);
        protocol.status = protocol_status_enum_1.ProtocolStatus.INACTIVE;
        await protocol.save();
        return protocol;
    }
    async remove(id) {
        const result = await this.protocolModel.destroy({ where: { id } });
        if (result === 0)
            throw new common_1.NotFoundException(`Protocol ${id} not found`);
        this.logInfo(`Deleted protocol ${id}`);
    }
};
exports.ClinicalProtocolService = ClinicalProtocolService;
exports.ClinicalProtocolService = ClinicalProtocolService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(clinical_protocol_model_1.ClinicalProtocol)),
    __metadata("design:paramtypes", [Object])
], ClinicalProtocolService);
//# sourceMappingURL=clinical-protocol.service.js.map