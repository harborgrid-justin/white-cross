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
exports.SystemInitializationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_1 = require("../../../common/base");
let SystemInitializationService = class SystemInitializationService extends base_1.BaseService {
    sequelize;
    constructor(sequelize) {
        super("SystemInitializationService");
        this.sequelize = sequelize;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async initializeDefaultRoles() {
        const transaction = await this.sequelize.transaction();
        try {
            const Role = this.getModel('Role');
            const Permission = this.getModel('Permission');
            const RolePermission = this.getModel('RolePermission');
            const existingRolesCount = await Role.count({ transaction });
            if (existingRolesCount > 0) {
                this.logInfo('Roles already initialized');
                await transaction.rollback();
                return;
            }
            const permissions = await this.initializeDefaultPermissions(transaction);
            const nurseRole = await Role.create({
                name: 'Nurse',
                description: 'School nurse with full access to student health management',
                isSystem: true,
            }, { transaction });
            const adminRole = await Role.create({
                name: 'Administrator',
                description: 'System administrator with full access',
                isSystem: true,
            }, { transaction });
            const nursePermissions = permissions.filter((p) => ['students', 'medications', 'health_records', 'reports'].includes(p.resource));
            for (const permission of nursePermissions) {
                await RolePermission.create({
                    roleId: nurseRole.id,
                    permissionId: permission.id,
                }, { transaction });
            }
            for (const permission of permissions) {
                await RolePermission.create({
                    roleId: adminRole.id,
                    permissionId: permission.id,
                }, { transaction });
            }
            await transaction.commit();
            this.logInfo('Initialized default roles and permissions successfully');
        }
        catch (error) {
            await transaction.rollback();
            this.logError('Error initializing default roles:', error);
            throw error;
        }
    }
    async initializeDefaultPermissions(transaction) {
        const Permission = this.getModel('Permission');
        const permissionsData = [
            { resource: 'students', action: 'read', description: 'View students' },
            {
                resource: 'students',
                action: 'create',
                description: 'Create students',
            },
            {
                resource: 'students',
                action: 'update',
                description: 'Update students',
            },
            {
                resource: 'students',
                action: 'delete',
                description: 'Delete students',
            },
            {
                resource: 'medications',
                action: 'read',
                description: 'View medications',
            },
            {
                resource: 'medications',
                action: 'administer',
                description: 'Administer medications',
            },
            {
                resource: 'medications',
                action: 'manage',
                description: 'Manage medication inventory',
            },
            {
                resource: 'health_records',
                action: 'read',
                description: 'View health records',
            },
            {
                resource: 'health_records',
                action: 'create',
                description: 'Create health records',
            },
            {
                resource: 'health_records',
                action: 'update',
                description: 'Update health records',
            },
            { resource: 'reports', action: 'read', description: 'View reports' },
            { resource: 'reports', action: 'create', description: 'Create reports' },
            { resource: 'users', action: 'manage', description: 'Manage users' },
            {
                resource: 'system',
                action: 'configure',
                description: 'Configure system',
            },
            {
                resource: 'security',
                action: 'manage',
                description: 'Manage security settings',
            },
        ];
        const permissions = [];
        for (const permData of permissionsData) {
            const permission = await Permission.create(permData, { transaction });
            permissions.push(permission);
        }
        this.logInfo(`Initialized ${permissions.length} default permissions`);
        return permissions;
    }
};
exports.SystemInitializationService = SystemInitializationService;
exports.SystemInitializationService = SystemInitializationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], SystemInitializationService);
//# sourceMappingURL=system-initialization.service.js.map