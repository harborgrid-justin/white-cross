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
exports.SeedIncidentsCommand = void 0;
const nest_commander_1 = require("nest-commander");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const seeds_1 = require("../database/seeds");
let SeedIncidentsCommand = class SeedIncidentsCommand extends nest_commander_1.CommandRunner {
    incidentModel;
    studentModel;
    userModel;
    constructor(incidentModel, studentModel, userModel) {
        super();
        this.incidentModel = incidentModel;
        this.studentModel = studentModel;
        this.userModel = userModel;
    }
    async run() {
        console.log('🚀 Incident Reports Seed Script\n');
        try {
            const existingCount = await this.incidentModel.count();
            if (existingCount > 0) {
                console.log(`⚠️  Found ${existingCount} existing incident reports in database`);
                console.log('❌ Skipping seed to avoid duplicates. Clear incident_reports table first if needed.\n');
                return;
            }
            const students = await this.studentModel.findAll({
                attributes: ['id'],
                where: { isActive: true },
            });
            if (students.length === 0) {
                console.log('❌ No students found in database. Please seed students first.');
                console.log('   Run: npm run seed:students\n');
                return;
            }
            const studentIds = students.map((s) => s.id);
            console.log(`✅ Found ${studentIds.length} students`);
            const nurses = await this.userModel.findAll({
                attributes: ['id'],
                where: {
                    role: ['NURSE', 'SCHOOL_ADMIN', 'ADMIN'],
                    isActive: true,
                },
            });
            if (nurses.length === 0) {
                console.log('❌ No nurses or admins found in database to report incidents.');
                console.log('   At least one user with role NURSE, SCHOOL_ADMIN, or ADMIN is required.\n');
                return;
            }
            const nurseIds = nurses.map((n) => n.id);
            console.log(`✅ Found ${nurseIds.length} nurses/admins`);
            const maxIncidentsPerStudent = 3;
            console.log(`📝 Generating incident reports (up to ${maxIncidentsPerStudent} per student)...`);
            const incidents = (0, seeds_1.generateIncidents)(studentIds, nurseIds, maxIncidentsPerStudent);
            if (incidents.length === 0) {
                console.log('⚠️  No incidents were generated. This is normal - not all students have incidents.');
                return;
            }
            console.log(`   Generated ${incidents.length} incident reports`);
            const batchSize = 50;
            let totalCreated = 0;
            console.log('💾 Inserting incident reports into database...');
            if (incidents.length > 0) {
                console.log('   Sample incident keys:', Object.keys(incidents[0]));
            }
            for (let i = 0; i < incidents.length; i += batchSize) {
                const batch = incidents.slice(i, i + batchSize);
                const cleanedBatch = batch.map((incident) => ({
                    studentId: incident.studentId,
                    reportedById: incident.reportedById,
                    type: incident.type,
                    severity: incident.severity,
                    status: incident.status,
                    description: incident.description,
                    location: incident.location,
                    witnesses: incident.witnesses,
                    actionsTaken: incident.actionsTaken,
                    parentNotified: incident.parentNotified,
                    parentNotificationMethod: incident.parentNotificationMethod,
                    parentNotifiedAt: incident.parentNotifiedAt,
                    parentNotifiedBy: incident.parentNotifiedBy,
                    followUpRequired: incident.followUpRequired,
                    followUpNotes: incident.followUpNotes,
                    attachments: incident.attachments,
                    evidencePhotos: incident.evidencePhotos,
                    evidenceVideos: incident.evidenceVideos,
                    insuranceClaimNumber: incident.insuranceClaimNumber,
                    insuranceClaimStatus: incident.insuranceClaimStatus,
                    legalComplianceStatus: incident.legalComplianceStatus,
                    occurredAt: incident.occurredAt,
                    createdBy: incident.createdBy,
                    updatedBy: incident.updatedBy,
                }));
                const created = await this.incidentModel.bulkCreate(cleanedBatch, {
                    validate: true,
                    returning: true,
                });
                totalCreated += created.length;
                console.log(`   Inserted batch ${Math.floor(i / batchSize) + 1}: ${created.length} incidents (Total: ${totalCreated})`);
            }
            console.log(`✅ Successfully seeded ${totalCreated} incident reports`);
            const stats = await this.incidentModel.findAll({
                attributes: [
                    'type',
                    [
                        this.incidentModel.sequelize.fn('COUNT', this.incidentModel.sequelize.col('id')),
                        'count',
                    ],
                ],
                group: ['type'],
                raw: true,
            });
            console.log('\nIncident reports by type:');
            stats.forEach((stat) => {
                console.log(`  - ${stat.type}: ${stat.count}`);
            });
            const sampleIncidents = await this.incidentModel.findAll({
                limit: 3,
                attributes: [
                    'type',
                    'severity',
                    'description',
                    'location',
                    'occurredAt',
                ],
                order: [['occurredAt', 'DESC']],
            });
            console.log('\nRecent sample incidents:');
            sampleIncidents.forEach((incident) => {
                console.log(`  - [${incident.severity}] ${incident.type} at ${incident.location}`);
                console.log(`    "${incident.description.substring(0, 60)}..."`);
                console.log(`    Occurred: ${incident.occurredAt.toLocaleString()}`);
            });
            console.log('');
        }
        catch (error) {
            console.error('❌ Error seeding incident reports:', error.message);
            if (error.errors) {
                error.errors.forEach((e) => {
                    console.error(`   - ${e.message}`);
                });
            }
            throw error;
        }
    }
};
exports.SeedIncidentsCommand = SeedIncidentsCommand;
exports.SeedIncidentsCommand = SeedIncidentsCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'seed:incidents',
        description: 'Seed incident reports into the database',
    }),
    __param(0, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SeedIncidentsCommand);
//# sourceMappingURL=seed-incidents.command.js.map