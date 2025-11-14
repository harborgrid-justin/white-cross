"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const seed_health_records_command_1 = require("./seed-health-records.command");
const seed_districts_command_1 = require("./seed-districts.command");
const seed_schools_command_1 = require("./seed-schools.command");
const seed_students_command_1 = require("./seed-students.command");
const seed_incidents_command_1 = require("./seed-incidents.command");
const query_data_command_1 = require("./query-data.command");
const database_1 = require("../database");
let CommandsModule = class CommandsModule {
};
exports.CommandsModule = CommandsModule;
exports.CommandsModule = CommandsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                database_1.HealthRecord,
                database_1.Student,
                database_1.District,
                database_1.School,
                database_1.IncidentReport,
                database_1.User,
            ]),
        ],
        providers: [
            seed_health_records_command_1.SeedHealthRecordsCommand,
            seed_districts_command_1.SeedDistrictsCommand,
            seed_schools_command_1.SeedSchoolsCommand,
            seed_students_command_1.SeedStudentsCommand,
            seed_incidents_command_1.SeedIncidentsCommand,
            query_data_command_1.QueryDataCommand,
        ],
    })
], CommandsModule);
//# sourceMappingURL=commands.module.js.map