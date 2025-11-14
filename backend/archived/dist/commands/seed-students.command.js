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
exports.SeedStudentsCommand = void 0;
const nest_commander_1 = require("nest-commander");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const seeds_1 = require("../database/seeds");
let SeedStudentsCommand = class SeedStudentsCommand extends nest_commander_1.CommandRunner {
    studentModel;
    schoolModel;
    districtModel;
    constructor(studentModel, schoolModel, districtModel) {
        super();
        this.studentModel = studentModel;
        this.schoolModel = schoolModel;
        this.districtModel = districtModel;
    }
    async run() {
        console.log('🚀 Students Seed Script\n');
        try {
            const existingCount = await this.studentModel.count();
            if (existingCount > 0) {
                console.log(`⚠️  Found ${existingCount} existing students in database`);
                console.log('❌ Skipping seed to avoid duplicates. Clear students table first if needed.\n');
                return;
            }
            const schools = await this.schoolModel.findAll({
                attributes: ['id', 'districtId'],
                where: { isActive: true },
            });
            if (schools.length === 0) {
                console.log('❌ No schools found in database. Please seed schools first.');
                console.log('   Run: npm run seed:schools\n');
                return;
            }
            const schoolIds = schools.map((s) => s.id);
            const districtIds = schools.map((s) => s.districtId);
            console.log(`✅ Found ${schoolIds.length} schools`);
            const studentsPerSchool = 20;
            console.log(`📝 Generating ${studentsPerSchool} students per school (${schoolIds.length * studentsPerSchool} total)...`);
            const students = (0, seeds_1.generateStudents)(schoolIds, districtIds, studentsPerSchool);
            const batchSize = 100;
            let totalCreated = 0;
            console.log('💾 Inserting students into database...');
            for (let i = 0; i < students.length; i += batchSize) {
                const batch = students.slice(i, i + batchSize);
                const created = await this.studentModel.bulkCreate(batch, {
                    validate: true,
                    returning: true,
                });
                totalCreated += created.length;
                console.log(`   Inserted batch ${Math.floor(i / batchSize) + 1}: ${created.length} students (Total: ${totalCreated})`);
            }
            console.log(`✅ Successfully seeded ${totalCreated} students`);
            const sampleStudents = await this.studentModel.findAll({
                limit: 5,
                attributes: [
                    'studentNumber',
                    'firstName',
                    'lastName',
                    'grade',
                    'gender',
                ],
            });
            console.log('\nSample students:');
            sampleStudents.forEach((student) => {
                console.log(`  - ${student.studentNumber}: ${student.firstName} ${student.lastName} (Grade ${student.grade}, ${student.gender})`);
            });
            console.log('');
        }
        catch (error) {
            console.error('❌ Error seeding students:', error.message);
            throw error;
        }
    }
};
exports.SeedStudentsCommand = SeedStudentsCommand;
exports.SeedStudentsCommand = SeedStudentsCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'seed:students',
        description: 'Seed students into the database',
    }),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.School)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.District)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SeedStudentsCommand);
//# sourceMappingURL=seed-students.command.js.map