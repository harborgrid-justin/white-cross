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
exports.ImportExportService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const models_6 = require("../../database/models");
const base_1 = require("../../common/base");
let ImportExportService = class ImportExportService extends base_1.BaseService {
    studentModel;
    vaccinationModel;
    allergyModel;
    chronicConditionModel;
    vitalSignsModel;
    clinicVisitModel;
    SUPPORTED_FORMATS = ['JSON', 'CSV', 'PDF', 'HL7', 'XML'];
    constructor(studentModel, vaccinationModel, allergyModel, chronicConditionModel, vitalSignsModel, clinicVisitModel) {
        super("ImportExportService");
        this.studentModel = studentModel;
        this.vaccinationModel = vaccinationModel;
        this.allergyModel = allergyModel;
        this.chronicConditionModel = chronicConditionModel;
        this.vitalSignsModel = vitalSignsModel;
        this.clinicVisitModel = clinicVisitModel;
    }
    async importRecords(data, format, user) {
        this.logInfo(`Importing health records in ${format} format by user ${user.id}`);
        if (!this.SUPPORTED_FORMATS.includes(format.toUpperCase())) {
            throw new common_1.BadRequestException(`Unsupported format: ${format}. Supported: ${this.SUPPORTED_FORMATS.join(', ')}`);
        }
        const results = {
            imported: 0,
            failed: 0,
            errors: [],
            records: [],
        };
        try {
            let parsedData;
            switch (format.toUpperCase()) {
                case 'JSON':
                    parsedData = Array.isArray(data) ? data : [data];
                    break;
                case 'CSV':
                    parsedData = this.parseCSV(data);
                    break;
                case 'HL7':
                    parsedData = this.parseHL7(data);
                    break;
                case 'XML':
                    parsedData = this.parseXML(data);
                    break;
                default:
                    throw new common_1.BadRequestException(`Format ${format} not yet implemented`);
            }
            const recordsByType = this.groupRecordsByType(parsedData);
            const allStudentIds = parsedData.map((r) => r.studentId).filter(Boolean);
            const validStudentIds = await this.validateStudentIdsBatch(allStudentIds);
            for (const [type, records] of Object.entries(recordsByType)) {
                try {
                    const validRecords = records.filter((r) => validStudentIds.has(r.studentId));
                    const invalidRecords = records.filter((r) => !validStudentIds.has(r.studentId));
                    invalidRecords.forEach((record) => {
                        results.failed++;
                        results.errors.push({
                            record,
                            error: `Student with ID ${record.studentId} not found`,
                        });
                    });
                    if (validRecords.length > 0) {
                        const importedRecords = await this.importRecordsBulk(type, validRecords, user);
                        results.records.push(...importedRecords);
                        results.imported += importedRecords.length;
                    }
                }
                catch (error) {
                    this.logError(`Bulk import failed for type ${type}:`, error);
                    records.forEach((record) => {
                        results.failed++;
                        results.errors.push({
                            record,
                            error: error.message,
                        });
                    });
                }
            }
            this.logInfo(`Import completed: ${results.imported} success, ${results.failed} failed`);
            this.logInfo(`PHI Import: ${results.imported} records imported by user ${user.id}`);
        }
        catch (error) {
            this.logError(`Import failed: ${error.message}`);
            throw new common_1.BadRequestException(`Import failed: ${error.message}`);
        }
        return results;
    }
    async exportRecords(filters, format) {
        this.logInfo(`Exporting health records in ${format} format`);
        if (!this.SUPPORTED_FORMATS.includes(format.toUpperCase())) {
            throw new common_1.BadRequestException(`Unsupported format: ${format}`);
        }
        const records = await this.getFilteredRecords(filters);
        let exportedData;
        switch (format.toUpperCase()) {
            case 'JSON':
                exportedData = JSON.stringify(records, null, 2);
                break;
            case 'CSV':
                exportedData = this.convertToCSV(records);
                break;
            case 'HL7':
                exportedData = this.convertToHL7(records);
                break;
            case 'XML':
                exportedData = this.convertToXML(records);
                break;
            case 'PDF':
                exportedData = this.convertToPDF(records);
                break;
            default:
                throw new common_1.BadRequestException(`Export format ${format} not implemented`);
        }
        return {
            records: exportedData,
            format: format.toUpperCase(),
            count: records.length,
            exportedAt: new Date(),
            filters,
        };
    }
    async exportStudentRecord(studentId, format) {
        this.logInfo(`Exporting complete record for student ${studentId} in ${format} format`);
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        const [vaccinations, allergies, chronicConditions, vitals, visits] = await Promise.all([
            this.vaccinationModel.findAll({
                where: { studentId },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['administrationDate', 'DESC']],
            }),
            this.allergyModel.findAll({
                where: { studentId, active: true },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['diagnosedDate', 'DESC']],
            }),
            this.chronicConditionModel.findAll({
                where: { studentId, status: 'ACTIVE' },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['diagnosedDate', 'DESC']],
            }),
            this.vitalSignsModel.findAll({
                where: { studentId },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['measurementDate', 'DESC']],
            }),
            this.clinicVisitModel.findAll({
                where: { studentId },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['checkInTime', 'DESC']],
            }),
        ]);
        const studentData = {
            studentId,
            student: {
                firstName: student.firstName,
                lastName: student.lastName,
                dateOfBirth: student.dateOfBirth,
            },
            exportedAt: new Date(),
            vaccinations: vaccinations.map((v) => ({
                vaccineName: v.vaccineName,
                vaccineType: v.vaccineType,
                administrationDate: v.administrationDate,
                administeredBy: v.administeredBy,
                lotNumber: v.lotNumber,
                cvxCode: v.cvxCode,
            })),
            allergies: allergies.map((a) => ({
                allergen: a.allergen,
                allergyType: a.allergyType,
                severity: a.severity,
                symptoms: a.symptoms,
                diagnosedDate: a.diagnosedDate,
                active: a.active,
            })),
            chronicConditions: chronicConditions.map((c) => ({
                condition: c.condition,
                icdCode: c.icdCode,
                status: c.status,
                severity: c.severity,
                diagnosedDate: c.diagnosedDate,
                carePlan: c.carePlan,
            })),
            vitals: vitals.map((v) => ({
                measurementDate: v.measurementDate,
                temperature: v.temperature,
                heartRate: v.heartRate,
                respiratoryRate: v.respiratoryRate,
                bloodPressureSystolic: v.bloodPressureSystolic,
                bloodPressureDiastolic: v.bloodPressureDiastolic,
                oxygenSaturation: v.oxygenSaturation,
                weight: v.weight,
                height: v.height,
                bmi: v.bmi,
                isAbnormal: v.isAbnormal,
            })),
            visits: visits.map((v) => ({
                checkInTime: v.checkInTime,
                checkOutTime: v.checkOutTime,
                reasonForVisit: v.reasonForVisit,
                symptoms: v.symptoms,
                treatment: v.treatment,
                disposition: v.disposition,
                attendedBy: v.attendedBy,
            })),
        };
        let exportedData;
        switch (format.toUpperCase()) {
            case 'JSON':
                exportedData = JSON.stringify(studentData, null, 2);
                break;
            case 'PDF':
                exportedData = this.convertStudentRecordToPDF(studentData);
                break;
            case 'CSV':
                exportedData = this.convertStudentRecordToCSV(studentData);
                break;
            default:
                throw new common_1.BadRequestException(`Format ${format} not supported for student records`);
        }
        return {
            studentId,
            data: exportedData,
            format: format.toUpperCase(),
            exportedAt: new Date(),
        };
    }
    async exportForStateReporting(stateCode, schoolIds, dateRange) {
        this.logInfo(`Exporting state report for ${stateCode}, schools: ${schoolIds.join(', ')}`);
        const students = await this.studentModel.findAll({
            where: { schoolId: { [sequelize_2.Op.in]: schoolIds } },
            attributes: ['id', 'schoolId'],
        });
        const studentIds = students.map((s) => s.id);
        if (studentIds.length === 0) {
            return {
                stateCode,
                formats: { csv: '', hl7: '' },
                summary: { totalRecords: 0, schoolCount: schoolIds.length, dateRange },
                generatedAt: new Date(),
            };
        }
        const vaccinationWhere = { studentId: { [sequelize_2.Op.in]: studentIds } };
        if (dateRange?.start && dateRange?.end) {
            vaccinationWhere.administrationDate = {
                [sequelize_2.Op.between]: [new Date(dateRange.start), new Date(dateRange.end)],
            };
        }
        const vaccinations = await this.vaccinationModel.findAll({
            where: vaccinationWhere,
            include: [
                {
                    model: models_1.Student,
                    attributes: [
                        'id',
                        'firstName',
                        'lastName',
                        'schoolId',
                        'dateOfBirth',
                    ],
                },
            ],
            order: [['administrationDate', 'DESC']],
        });
        const reportData = {
            stateCode,
            schoolIds,
            dateRange,
            generatedAt: new Date(),
            vaccinationData: vaccinations.map((v) => ({
                studentId: v.studentId,
                studentName: `${v.student?.firstName} ${v.student?.lastName}`,
                schoolId: v.student?.schoolId,
                dateOfBirth: v.student?.dateOfBirth,
                vaccineName: v.vaccineName,
                vaccineType: v.vaccineType,
                administrationDate: v.administrationDate,
                administeredBy: v.administeredBy,
                cvxCode: v.cvxCode,
                seriesComplete: v.seriesComplete,
            })),
        };
        const csvData = this.convertToCSV(reportData.vaccinationData);
        const hl7Data = this.convertToHL7(reportData.vaccinationData);
        return {
            stateCode,
            formats: {
                csv: csvData,
                hl7: hl7Data,
            },
            summary: {
                totalRecords: vaccinations.length,
                schoolCount: schoolIds.length,
                dateRange,
            },
            generatedAt: new Date(),
        };
    }
    async validateRecord(record) {
        if (!record.studentId) {
            throw new Error('Student ID is required');
        }
        if (!record.type) {
            throw new Error('Record type is required');
        }
        const student = await this.studentModel.findByPk(record.studentId);
        if (!student) {
            throw new Error(`Student with ID ${record.studentId} not found`);
        }
        return record;
    }
    async importSingleRecord(record, user) {
        const { type, studentId, ...data } = record;
        switch (type.toLowerCase()) {
            case 'vaccination':
                return await this.vaccinationModel.create({
                    ...data,
                    studentId,
                    administeredBy: user.id,
                    createdBy: user.id,
                });
            case 'allergy':
                return await this.allergyModel.create({
                    ...data,
                    studentId,
                    active: true,
                    verified: false,
                    createdBy: user.id,
                });
            case 'chronic_condition':
            case 'chroniccondition':
                return await this.chronicConditionModel.create({
                    ...data,
                    studentId,
                    status: 'ACTIVE',
                    isActive: true,
                    createdBy: user.id,
                });
            case 'vital_signs':
            case 'vitals':
                return await this.vitalSignsModel.create({
                    ...data,
                    studentId,
                    isAbnormal: false,
                    createdBy: user.id,
                });
            case 'clinic_visit':
            case 'visit':
                return await this.clinicVisitModel.create({
                    ...data,
                    studentId,
                    attendedBy: user.id,
                });
            default:
                throw new Error(`Unsupported record type: ${type}`);
        }
    }
    async importRecordsBulk(type, records, user) {
        const recordsWithMetadata = records.map((record) => {
            const { studentId, ...data } = record;
            return {
                ...data,
                studentId,
                createdBy: user.id,
            };
        });
        switch (type.toLowerCase()) {
            case 'vaccination':
                return await this.vaccinationModel.bulkCreate(recordsWithMetadata.map((r) => ({
                    ...r,
                    administeredBy: user.id,
                })), { validate: true, returning: true });
            case 'allergy':
                const allergyRecords = await this.deduplicateAllergies(recordsWithMetadata);
                return await this.allergyModel.bulkCreate(allergyRecords.map((r) => ({
                    ...r,
                    active: true,
                    verified: false,
                })), { validate: true, returning: true });
            case 'chronic_condition':
            case 'chroniccondition':
                return await this.chronicConditionModel.bulkCreate(recordsWithMetadata.map((r) => ({
                    ...r,
                    status: 'ACTIVE',
                    isActive: true,
                })), { validate: true, returning: true });
            case 'vital_signs':
            case 'vitals':
                return await this.vitalSignsModel.bulkCreate(recordsWithMetadata.map((r) => ({
                    ...r,
                    isAbnormal: false,
                })), { validate: true, returning: true });
            case 'clinic_visit':
            case 'visit':
                return await this.clinicVisitModel.bulkCreate(recordsWithMetadata.map((r) => ({
                    ...r,
                    attendedBy: user.id,
                })), { validate: true, returning: true });
            default:
                throw new Error(`Unsupported record type: ${type}`);
        }
    }
    groupRecordsByType(records) {
        const groups = {};
        records.forEach((record) => {
            const type = record.type?.toLowerCase() || 'unknown';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(record);
        });
        return groups;
    }
    async validateStudentIdsBatch(studentIds) {
        const uniqueIds = [...new Set(studentIds)];
        if (uniqueIds.length === 0) {
            return new Set();
        }
        const students = await this.studentModel.findAll({
            where: { id: { [sequelize_2.Op.in]: uniqueIds } },
            attributes: ['id'],
        });
        return new Set(students.map((s) => s.id));
    }
    async deduplicateAllergies(allergyRecords) {
        const studentIds = [...new Set(allergyRecords.map((r) => r.studentId))];
        const existingAllergies = await this.allergyModel.findAll({
            where: {
                studentId: { [sequelize_2.Op.in]: studentIds },
                active: true,
            },
            attributes: ['studentId', 'allergen'],
            include: [
                {
                    model: models_1.Student,
                    as: 'student',
                    attributes: ['id'],
                    required: true,
                },
            ],
        });
        const allergyMap = new Map();
        existingAllergies.forEach((allergy) => {
            const key = allergy.studentId;
            if (!allergyMap.has(key)) {
                allergyMap.set(key, new Set());
            }
            allergyMap.get(key)?.add(allergy.allergen?.toLowerCase());
        });
        return allergyRecords.filter((record) => {
            const existingAllergens = allergyMap.get(record.studentId);
            if (!existingAllergens) {
                return true;
            }
            return !existingAllergens.has(record.allergen?.toLowerCase());
        });
    }
    async getFilteredRecords(filters) {
        const whereClause = {};
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        if (filters.schoolId) {
            const students = await this.studentModel.findAll({
                where: { schoolId: filters.schoolId },
                attributes: ['id'],
            });
            whereClause.studentId = { [sequelize_2.Op.in]: students.map((s) => s.id) };
        }
        if (filters.dateRange) {
        }
        const [vaccinations, allergies, chronicConditions] = await Promise.all([
            this.vaccinationModel.findAll({
                where: whereClause,
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                limit: 1000,
            }),
            this.allergyModel.findAll({
                where: { ...whereClause, active: true },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                limit: 1000,
            }),
            this.chronicConditionModel.findAll({
                where: { ...whereClause, status: 'ACTIVE' },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                limit: 1000,
            }),
        ]);
        const records = [];
        vaccinations.forEach((v) => records.push({
            type: 'vaccination',
            studentId: v.studentId,
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            ...v.toJSON(),
        }));
        allergies.forEach((a) => records.push({
            type: 'allergy',
            studentId: a.studentId,
            studentName: `${a.student?.firstName} ${a.student?.lastName}`,
            ...a.toJSON(),
        }));
        chronicConditions.forEach((c) => records.push({
            type: 'chronic_condition',
            studentId: c.studentId,
            studentName: `${c.student?.firstName} ${c.student?.lastName}`,
            ...c.toJSON(),
        }));
        return records;
    }
    parseCSV(data) {
        const lines = data.split('\n').filter((line) => line.trim());
        if (lines.length < 2)
            return [];
        const headers = lines[0].split(',').map((h) => h.trim());
        return lines.slice(1).map((line) => {
            const values = line.split(',');
            const record = {};
            headers.forEach((header, index) => {
                record[header] = values[index]?.trim() || '';
            });
            return record;
        });
    }
    parseHL7(data) {
        this.logInfo('Parsing HL7 message');
        const segments = data.split('\n').filter((s) => s.trim());
        const records = [];
        segments.forEach((segment) => {
            if (segment.startsWith('RXA')) {
                const fields = segment.split('|');
                records.push({
                    type: 'vaccination',
                    studentId: fields[3],
                    cvxCode: fields[5],
                    administrationDate: fields[4],
                    administeredBy: fields[10] || 'Unknown',
                });
            }
            else if (segment.startsWith('AL1')) {
                const fields = segment.split('|');
                records.push({
                    type: 'allergy',
                    studentId: fields[2],
                    allergen: fields[3],
                    severity: fields[4],
                    diagnosedDate: new Date(),
                });
            }
        });
        return records;
    }
    parseXML(data) {
        this.logInfo('Parsing XML data');
        return [];
    }
    convertToCSV(records) {
        if (records.length === 0)
            return '';
        const headers = Object.keys(records[0]);
        const csvLines = [headers.join(',')];
        records.forEach((record) => {
            const values = headers.map((header) => {
                const value = record[header];
                if (typeof value === 'string' &&
                    (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value || '';
            });
            csvLines.push(values.join(','));
        });
        return csvLines.join('\n');
    }
    convertToHL7(records) {
        const hl7Messages = [];
        records.forEach((record) => {
            if (record.type === 'vaccination') {
                const msg = `RXA|0|1|${record.administrationDate || ''}|${record.administrationDate || ''}|${record.cvxCode || ''}|1|ml||||${record.studentId}`;
                hl7Messages.push(msg);
            }
        });
        return hl7Messages.join('\n');
    }
    convertToXML(records) {
        const xmlLines = ['<?xml version="1.0" encoding="UTF-8"?>', '<records>'];
        records.forEach((record) => {
            xmlLines.push('  <record>');
            Object.entries(record).forEach(([key, value]) => {
                xmlLines.push(`    <${key}>${value}</${key}>`);
            });
            xmlLines.push('  </record>');
        });
        xmlLines.push('</records>');
        return xmlLines.join('\n');
    }
    convertToPDF(records) {
        this.logInfo('Converting to PDF (mock implementation)');
        return `[PDF Data: ${records.length} records - Full implementation would use pdfmake library]`;
    }
    convertStudentRecordToPDF(data) {
        this.logInfo(`Converting student record to PDF (mock) for ${data.studentId}`);
        return `[PDF Student Record: ${data.studentId} - ${data.vaccinations.length} vaccinations, ${data.allergies.length} allergies, ${data.chronicConditions.length} conditions]`;
    }
    convertStudentRecordToCSV(data) {
        const sections = [];
        sections.push('VACCINATIONS');
        if (data.vaccinations.length > 0) {
            sections.push(this.convertToCSV(data.vaccinations));
        }
        else {
            sections.push('No vaccination records');
        }
        sections.push('\nALLERGIES');
        if (data.allergies.length > 0) {
            sections.push(this.convertToCSV(data.allergies));
        }
        else {
            sections.push('No allergy records');
        }
        sections.push('\nCHRONIC CONDITIONS');
        if (data.chronicConditions.length > 0) {
            sections.push(this.convertToCSV(data.chronicConditions));
        }
        else {
            sections.push('No chronic condition records');
        }
        return sections.join('\n');
    }
};
exports.ImportExportService = ImportExportService;
exports.ImportExportService = ImportExportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Vaccination)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Allergy)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.ChronicCondition)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.VitalSigns)),
    __param(5, (0, sequelize_1.InjectModel)(models_6.ClinicVisit)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ImportExportService);
//# sourceMappingURL=import-export.service.js.map