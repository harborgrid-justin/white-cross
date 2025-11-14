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
exports.StudentBarcodeService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const models_1 = require("../../../database/models");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentBarcodeService = class StudentBarcodeService extends base_1.BaseService {
    studentModel;
    requestContext;
    eventEmitter;
    constructor(studentModel, requestContext, eventEmitter) {
        super(requestContext ||
            {
                requestId: 'system',
                userId: undefined,
                getLogContext: () => ({ requestId: 'system' }),
                getAuditContext: () => ({
                    requestId: 'system',
                    timestamp: new Date(),
                }),
            });
        this.studentModel = studentModel;
        this.requestContext = requestContext;
        this.eventEmitter = eventEmitter;
    }
    async scanBarcode(scanDto) {
        try {
            this.validateRequired(scanDto.barcodeString, 'Barcode');
            const student = await this.studentModel.findOne({
                where: {
                    studentNumber: scanDto.barcodeString,
                    isActive: true,
                },
            });
            if (!student) {
                throw new common_1.NotFoundException(`No active student found with barcode: ${scanDto.barcodeString}`);
            }
            if (this.eventEmitter) {
                this.eventEmitter.emit('student.barcode.scanned', {
                    studentId: student.id,
                    barcode: scanDto.barcodeString,
                    purpose: scanDto.scanType || 'STUDENT',
                    userId: this.requestContext?.userId,
                    timestamp: new Date(),
                });
            }
            this.logInfo('Barcode scanned', {
                studentId: student.id,
                barcode: scanDto.barcodeString,
            });
            return {
                student: {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    studentNumber: student.studentNumber,
                    grade: student.grade,
                    dateOfBirth: student.dateOfBirth,
                },
                scanTime: new Date(),
                purpose: scanDto.scanType || 'STUDENT',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to scan barcode', error);
        }
    }
    async verifyMedication(verifyDto) {
        try {
            this.validateRequired(verifyDto.studentBarcode, 'Student barcode');
            this.validateRequired(verifyDto.medicationBarcode, 'Medication barcode');
            const student = await this.studentModel.findOne({
                where: {
                    studentNumber: verifyDto.studentBarcode,
                    isActive: true,
                },
            });
            if (!student) {
                throw new common_1.NotFoundException(`No active student found with barcode: ${verifyDto.studentBarcode}`);
            }
            if (this.eventEmitter) {
                this.eventEmitter.emit('student.medication.verified', {
                    studentId: student.id,
                    medicationBarcode: verifyDto.medicationBarcode,
                    userId: this.requestContext?.userId,
                    timestamp: new Date(),
                });
            }
            this.logInfo('Medication verified', {
                studentId: student.id,
                medicationBarcode: verifyDto.medicationBarcode,
            });
            return {
                verified: true,
                student: {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                },
                medicationBarcode: verifyDto.medicationBarcode,
                verificationTime: new Date(),
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to verify medication', error);
        }
    }
    async generateBarcode(studentId, generateBarcodeDto) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findOne({
                where: { id: studentId, isActive: true },
            });
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const format = generateBarcodeDto?.format || 'CODE128';
            const purpose = generateBarcodeDto?.purpose || 'STUDENT_ID';
            const displayText = generateBarcodeDto?.displayText ||
                `${student.lastName}, ${student.firstName}`;
            this.logInfo('Barcode generated', {
                studentId,
                format,
                purpose,
            });
            return {
                studentId: student.id,
                barcode: student.studentNumber,
                format,
                displayText,
                purpose,
                metadata: {
                    grade: student.grade,
                    generatedAt: new Date(),
                    ...generateBarcodeDto?.metadata,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to generate barcode', error);
        }
    }
    async verifyBarcode(verifyBarcodeDto) {
        try {
            this.validateRequired(verifyBarcodeDto.barcode, 'Barcode');
            const student = await this.studentModel.findOne({
                where: {
                    studentNumber: verifyBarcodeDto.barcode,
                    isActive: true,
                },
            });
            if (!student) {
                throw new common_1.NotFoundException(`No active student found with barcode: ${verifyBarcodeDto.barcode}`);
            }
            if (this.eventEmitter) {
                this.eventEmitter.emit('student.barcode.verified', {
                    studentId: student.id,
                    barcode: verifyBarcodeDto.barcode,
                    purpose: verifyBarcodeDto.purpose || 'STUDENT_ID',
                    location: verifyBarcodeDto.location,
                    deviceId: verifyBarcodeDto.deviceId,
                    userId: this.requestContext?.userId,
                    timestamp: new Date(),
                });
            }
            this.logInfo('Barcode verified', {
                studentId: student.id,
                barcode: verifyBarcodeDto.barcode,
                purpose: verifyBarcodeDto.purpose,
            });
            return {
                verified: true,
                student: {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    studentNumber: student.studentNumber,
                    grade: student.grade,
                    dateOfBirth: student.dateOfBirth,
                },
                verificationTime: new Date(),
                purpose: verifyBarcodeDto.purpose || 'STUDENT_ID',
                location: verifyBarcodeDto.location,
                deviceId: verifyBarcodeDto.deviceId,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to verify barcode', error);
        }
    }
};
exports.StudentBarcodeService = StudentBarcodeService;
exports.StudentBarcodeService = StudentBarcodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, common_1.Optional)()),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, request_context_service_1.RequestContextService,
        event_emitter_1.EventEmitter2])
], StudentBarcodeService);
//# sourceMappingURL=student-barcode.service.js.map