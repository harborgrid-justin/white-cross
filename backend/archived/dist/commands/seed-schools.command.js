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
exports.SeedSchoolsCommand = void 0;
const nest_commander_1 = require("nest-commander");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const seeds_1 = require("../database/seeds");
let SeedSchoolsCommand = class SeedSchoolsCommand extends nest_commander_1.CommandRunner {
    schoolModel;
    districtModel;
    constructor(schoolModel, districtModel) {
        super();
        this.schoolModel = schoolModel;
        this.districtModel = districtModel;
    }
    async run() {
        console.log('🚀 Schools Seed Script\n');
        try {
            const existingCount = await this.schoolModel.count();
            if (existingCount > 0) {
                console.log(`⚠️  Found ${existingCount} existing schools in database`);
                console.log('❌ Skipping seed to avoid duplicates. Clear schools table first if needed.\n');
                return;
            }
            const districts = await this.districtModel.findAll({
                attributes: ['id'],
                where: { isActive: true },
            });
            if (districts.length === 0) {
                console.log('❌ No districts found in database. Please seed districts first.');
                console.log('   Run: npm run seed:districts\n');
                return;
            }
            const districtIds = districts.map((d) => d.id);
            console.log(`✅ Found ${districtIds.length} districts`);
            const schoolsPerDistrict = 3;
            console.log(`📝 Generating ${schoolsPerDistrict} schools per district (${districtIds.length * schoolsPerDistrict} total)...`);
            const schools = (0, seeds_1.generateSchools)(districtIds, schoolsPerDistrict);
            console.log('💾 Inserting schools into database...');
            const createdSchools = await this.schoolModel.bulkCreate(schools, {
                validate: true,
                returning: true,
            });
            console.log(`✅ Successfully seeded ${createdSchools.length} schools`);
            console.log('\nSample schools:');
            createdSchools.slice(0, 5).forEach((school) => {
                console.log(`  - ${school.name} (${school.code}) - ${school.totalEnrollment} students`);
            });
            console.log('');
        }
        catch (error) {
            console.error('❌ Error seeding schools:', error.message);
            throw error;
        }
    }
};
exports.SeedSchoolsCommand = SeedSchoolsCommand;
exports.SeedSchoolsCommand = SeedSchoolsCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'seed:schools',
        description: 'Seed schools into the database',
    }),
    __param(0, (0, sequelize_1.InjectModel)(database_1.School)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.District)),
    __metadata("design:paramtypes", [Object, Object])
], SeedSchoolsCommand);
//# sourceMappingURL=seed-schools.command.js.map