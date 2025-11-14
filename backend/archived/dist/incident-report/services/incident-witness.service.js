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
exports.IncidentWitnessService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../database");
const incident_validation_service_1 = require("./incident-validation.service");
const base_1 = require("../../common/base");
let IncidentWitnessService = class IncidentWitnessService extends base_1.BaseService {
    witnessStatementModel;
    incidentReportModel;
    validationService;
    constructor(witnessStatementModel, incidentReportModel, validationService) {
        super('IncidentWitnessService');
        this.witnessStatementModel = witnessStatementModel;
        this.incidentReportModel = incidentReportModel;
        this.validationService = validationService;
    }
    async addWitnessStatement(incidentReportId, dto) {
        try {
            const report = await this.incidentReportModel.findByPk(incidentReportId);
            if (!report) {
                throw new common_1.NotFoundException('Incident report not found');
            }
            this.validationService.validateWitnessStatementData(dto);
            const savedStatement = await this.witnessStatementModel.create({
                incidentReportId,
                ...dto,
                verified: false,
            });
            this.logInfo(`Witness statement added to incident ${incidentReportId}`);
            return savedStatement;
        }
        catch (error) {
            this.logError('Error adding witness statement:', error);
            throw error;
        }
    }
    async verifyWitnessStatement(statementId, verifiedBy) {
        try {
            const statement = await this.witnessStatementModel.findByPk(statementId);
            if (!statement) {
                throw new common_1.NotFoundException('Witness statement not found');
            }
            statement.verified = true;
            statement.verifiedBy = verifiedBy;
            statement.verifiedAt = new Date();
            const updatedStatement = await statement.save();
            this.logInfo(`Witness statement ${statementId} verified by ${verifiedBy}`);
            return updatedStatement;
        }
        catch (error) {
            this.logError('Error verifying witness statement:', error);
            throw error;
        }
    }
    async getWitnessStatements(incidentReportId) {
        try {
            return await this.witnessStatementModel.findAll({
                where: { incidentReportId },
                order: [['createdAt', 'ASC']],
            });
        }
        catch (error) {
            this.logError('Error fetching witness statements:', error);
            throw error;
        }
    }
    async updateWitnessStatement(statementId, data) {
        try {
            const statement = await this.witnessStatementModel.findByPk(statementId);
            if (!statement) {
                throw new common_1.NotFoundException('Witness statement not found');
            }
            if (data.statement) {
                this.validationService.validateWitnessStatementData({
                    witnessName: data.witnessName || statement.witnessName,
                    witnessType: data.witnessType || statement.witnessType,
                    witnessContact: data.witnessContact || statement.witnessContact,
                    statement: data.statement,
                });
            }
            Object.assign(statement, data);
            const updatedStatement = await statement.save();
            this.logInfo(`Witness statement ${statementId} updated`);
            return updatedStatement;
        }
        catch (error) {
            this.logError('Error updating witness statement:', error);
            throw error;
        }
    }
    async deleteWitnessStatement(statementId) {
        try {
            const statement = await this.witnessStatementModel.findByPk(statementId);
            if (!statement) {
                throw new common_1.NotFoundException('Witness statement not found');
            }
            await statement.destroy();
            this.logInfo(`Witness statement ${statementId} deleted`);
            return true;
        }
        catch (error) {
            this.logError('Error deleting witness statement:', error);
            throw error;
        }
    }
    async getUnverifiedStatements() {
        try {
            return await this.witnessStatementModel.findAll({
                where: { verified: false },
                order: [['createdAt', 'ASC']],
            });
        }
        catch (error) {
            this.logError('Error fetching unverified witness statements:', error);
            throw error;
        }
    }
};
exports.IncidentWitnessService = IncidentWitnessService;
exports.IncidentWitnessService = IncidentWitnessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.WitnessStatement)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object, Object, incident_validation_service_1.IncidentValidationService])
], IncidentWitnessService);
//# sourceMappingURL=incident-witness.service.js.map