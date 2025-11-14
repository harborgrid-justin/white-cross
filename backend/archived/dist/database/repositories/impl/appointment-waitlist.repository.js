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
exports.AppointmentWaitlistRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const appointment_waitlist_model_1 = require("../../models/appointment-waitlist.model");
let AppointmentWaitlistRepository = class AppointmentWaitlistRepository {
    appointmentWaitlistModel;
    constructor(appointmentWaitlistModel) {
        this.appointmentWaitlistModel = appointmentWaitlistModel;
    }
    async findAll() {
        return this.appointmentWaitlistModel.findAll();
    }
    async findById(id) {
        return this.appointmentWaitlistModel.findByPk(id);
    }
    async create(data) {
        return this.appointmentWaitlistModel.create(data);
    }
    async update(id, data) {
        const [affectedCount] = await this.appointmentWaitlistModel.update(data, {
            where: { id },
        });
        if (affectedCount === 0) {
            return null;
        }
        return this.findById(id);
    }
    async delete(id) {
        const affectedCount = await this.appointmentWaitlistModel.destroy({
            where: { id },
        });
        return affectedCount > 0;
    }
    async findByStudentId(studentId) {
        return this.appointmentWaitlistModel.findAll({
            where: { studentId },
            order: [
                ['priority', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        });
    }
};
exports.AppointmentWaitlistRepository = AppointmentWaitlistRepository;
exports.AppointmentWaitlistRepository = AppointmentWaitlistRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(appointment_waitlist_model_1.AppointmentWaitlist)),
    __metadata("design:paramtypes", [Object])
], AppointmentWaitlistRepository);
//# sourceMappingURL=appointment-waitlist.repository.js.map