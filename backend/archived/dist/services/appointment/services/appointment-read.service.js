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
exports.AppointmentReadService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const base_1 = require("../../../common/base");
let AppointmentReadService = class AppointmentReadService extends base_1.BaseService {
    appointmentModel;
    userModel;
    constructor(appointmentModel, userModel) {
        super('AppointmentReadService');
        this.appointmentModel = appointmentModel;
        this.userModel = userModel;
    }
    async getAppointments(filters) {
        this.logInfo(`Getting appointments with filters: ${JSON.stringify(filters)}`);
        try {
            const { page = 1, limit = 10, status, nurseId, studentId, startDate, endDate, type, sortBy = 'scheduledFor', sortOrder = 'ASC', } = filters;
            const offset = (page - 1) * limit;
            const where = {};
            if (status) {
                where.status = status;
            }
            if (nurseId) {
                where.nurseId = nurseId;
            }
            if (studentId) {
                where.studentId = studentId;
            }
            if (type) {
                where.type = type;
            }
            if (startDate || endDate) {
                where.scheduledFor = {};
                if (startDate) {
                    where.scheduledFor[sequelize_2.Op.gte] = new Date(startDate);
                }
                if (endDate) {
                    where.scheduledFor[sequelize_2.Op.lte] = new Date(endDate);
                }
            }
            const { rows: appointments, count: total } = await this.appointmentModel.findAndCountAll({
                where,
                include: [
                    {
                        model: this.userModel,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                    },
                    {
                        model: this.userModel,
                        as: 'student',
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                    },
                ],
                order: [[sortBy, sortOrder.toUpperCase()]],
                limit,
                offset,
            });
            const totalPages = Math.ceil(total / limit);
            return {
                data: appointments.map((appointment) => this.mapToEntity(appointment)),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        }
        catch (error) {
            this.logError(`Error getting appointments: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async getAppointmentById(id) {
        this.logInfo(`Getting appointment by ID: ${id}`);
        try {
            const appointment = await this.appointmentModel.findByPk(id, {
                include: [
                    {
                        model: this.userModel,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                    },
                    {
                        model: this.userModel,
                        as: 'student',
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                    },
                ],
            });
            if (!appointment) {
                throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
            }
            return this.mapToEntity(appointment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logError(`Error getting appointment by ID: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    mapToEntity(appointment) {
        return {
            id: appointment.id,
            nurseId: appointment.nurseId,
            studentId: appointment.studentId,
            scheduledFor: appointment.scheduledFor,
            duration: appointment.duration,
            type: appointment.type,
            status: appointment.status,
            notes: appointment.notes,
            reason: appointment.reason,
            location: appointment.location,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            nurse: appointment.nurse
                ? {
                    id: appointment.nurse.id,
                    firstName: appointment.nurse.firstName,
                    lastName: appointment.nurse.lastName,
                    email: appointment.nurse.email,
                }
                : undefined,
            student: appointment.student
                ? {
                    id: appointment.student.id,
                    firstName: appointment.student.firstName,
                    lastName: appointment.student.lastName,
                    email: appointment.student.email,
                }
                : undefined,
        };
    }
};
exports.AppointmentReadService = AppointmentReadService;
exports.AppointmentReadService = AppointmentReadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.User)),
    __metadata("design:paramtypes", [Object, Object])
], AppointmentReadService);
//# sourceMappingURL=appointment-read.service.js.map