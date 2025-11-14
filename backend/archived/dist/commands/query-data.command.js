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
exports.QueryDataCommand = void 0;
const nest_commander_1 = require("nest-commander");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
let QueryDataCommand = class QueryDataCommand extends nest_commander_1.CommandRunner {
    districtModel;
    schoolModel;
    studentModel;
    healthRecordModel;
    constructor(districtModel, schoolModel, studentModel, healthRecordModel) {
        super();
        this.districtModel = districtModel;
        this.schoolModel = schoolModel;
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
    }
    async run() {
        console.log('📊 Database Query Report\n');
        try {
            const districtCount = await this.districtModel.count();
            const schoolCount = await this.schoolModel.count();
            const studentCount = await this.studentModel.count();
            const healthRecordCount = await this.healthRecordModel.count();
            console.log('Record Counts:');
            console.log(`  Districts: ${districtCount}`);
            console.log(`  Schools: ${schoolCount}`);
            console.log(`  Students: ${studentCount}`);
            console.log(`  Health Records: ${healthRecordCount}\n`);
            if (studentCount > 0) {
                const sampleStudents = await this.studentModel.findAll({
                    limit: 3,
                    attributes: ['id', 'studentNumber', 'firstName', 'lastName', 'grade'],
                });
                console.log('Sample Students:');
                sampleStudents.forEach((student) => {
                    console.log(`  - ${student.studentNumber}: ${student.firstName} ${student.lastName} (Grade ${student.grade})`);
                });
                console.log('');
            }
            if (healthRecordCount > 0) {
                const sampleRecords = await this.healthRecordModel.findAll({
                    limit: 3,
                    attributes: ['id', 'recordType', 'title', 'recordDate'],
                });
                console.log('Sample Health Records:');
                sampleRecords.forEach((record) => {
                    console.log(`  - ${record.recordType}: ${record.title} (${new Date(record.recordDate).toLocaleDateString()})`);
                });
                console.log('');
            }
        }
        catch (error) {
            console.error('❌ Error querying database:', error.message);
            throw error;
        }
    }
};
exports.QueryDataCommand = QueryDataCommand;
exports.QueryDataCommand = QueryDataCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'query:data',
        description: 'Query database to check seeded data',
    }),
    __param(0, (0, sequelize_1.InjectModel)(database_1.District)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.School)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(3, (0, sequelize_1.InjectModel)(database_1.HealthRecord)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], QueryDataCommand);
//# sourceMappingURL=query-data.command.js.map