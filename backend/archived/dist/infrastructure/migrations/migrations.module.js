"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationsModule = void 0;
const common_1 = require("@nestjs/common");
const migration_version_control_service_1 = require("./migration-version-control.service");
let MigrationsModule = class MigrationsModule {
};
exports.MigrationsModule = MigrationsModule;
exports.MigrationsModule = MigrationsModule = __decorate([
    (0, common_1.Module)({
        providers: [migration_version_control_service_1.MigrationVersionControlService],
        exports: [migration_version_control_service_1.MigrationVersionControlService],
    })
], MigrationsModule);
//# sourceMappingURL=migrations.module.js.map