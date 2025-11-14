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
exports.SeedDistrictsCommand = void 0;
const nest_commander_1 = require("nest-commander");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const seeds_1 = require("../database/seeds");
let SeedDistrictsCommand = class SeedDistrictsCommand extends nest_commander_1.CommandRunner {
    districtModel;
    constructor(districtModel) {
        super();
        this.districtModel = districtModel;
    }
    async run() {
        console.log('🚀 Districts Seed Script\n');
        try {
            const existingCount = await this.districtModel.count();
            if (existingCount > 0) {
                console.log(`⚠️  Found ${existingCount} existing districts in database`);
                console.log('❌ Skipping seed to avoid duplicates. Clear districts table first if needed.\n');
                return;
            }
            const districtCount = 5;
            console.log(`📝 Generating ${districtCount} districts...`);
            const districts = (0, seeds_1.generateDistricts)(districtCount);
            console.log('💾 Inserting districts into database...');
            const createdDistricts = await this.districtModel.bulkCreate(districts, {
                validate: true,
                returning: true,
            });
            console.log(`✅ Successfully seeded ${createdDistricts.length} districts`);
            console.log('\nSample districts:');
            createdDistricts.slice(0, 3).forEach((district) => {
                console.log(`  - ${district.name} (${district.code})`);
            });
            console.log('');
        }
        catch (error) {
            console.error('❌ Error seeding districts:', error.message);
            throw error;
        }
    }
};
exports.SeedDistrictsCommand = SeedDistrictsCommand;
exports.SeedDistrictsCommand = SeedDistrictsCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'seed:districts',
        description: 'Seed districts into the database',
    }),
    __param(0, (0, sequelize_1.InjectModel)(database_1.District)),
    __metadata("design:paramtypes", [Object])
], SeedDistrictsCommand);
//# sourceMappingURL=seed-districts.command.js.map