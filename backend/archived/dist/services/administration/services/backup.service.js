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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const administration_enums_1 = require("../enums/administration.enums");
let BackupService = class BackupService extends base_1.BaseService {
    requestContext;
    backups = [];
    constructor(requestContext) {
        super(requestContext);
        this.requestContext = requestContext;
    }
    async createBackup(dto) {
        const backup = {
            id: Math.random().toString(36).substr(2, 9),
            type: dto.type,
            status: administration_enums_1.BackupStatus.IN_PROGRESS,
            triggeredBy: dto.triggeredBy,
            startedAt: new Date(),
        };
        this.backups.push(backup);
        setTimeout(() => {
            backup.status = administration_enums_1.BackupStatus.COMPLETED;
            backup.completedAt = new Date();
            backup.fileSize = Math.floor(Math.random() * 1000000);
        }, 1000);
        return backup;
    }
    async getBackupLogs(query) {
        const { page = 1, limit = 20 } = query;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = this.backups.slice(startIndex, endIndex);
        return {
            data: paginatedData,
            total: this.backups.length,
            page,
            limit,
        };
    }
    async getBackupById(id) {
        const backup = this.backups.find((b) => b.id === id);
        if (!backup) {
            throw new common_1.NotFoundException(`Backup with ID ${id} not found`);
        }
        return backup;
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], BackupService);
//# sourceMappingURL=backup.service.js.map