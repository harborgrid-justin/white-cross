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
exports.ResourceOwnershipGuard = exports.ResourceType = exports.RESOURCE_TYPE_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const database_1 = require("../../../database");
const student_1 = require("../../../services/student");
const health_record_1 = require("../../../health-record");
exports.RESOURCE_TYPE_KEY = 'resource_type';
const ResourceType = (resourceType) => (0, common_1.SetMetadata)(exports.RESOURCE_TYPE_KEY, resourceType);
exports.ResourceType = ResourceType;
let ResourceOwnershipGuard = class ResourceOwnershipGuard {
    reflector;
    studentService;
    healthRecordService;
    ownershipRules = {
        student: {
            checkOwnership: async (userId, studentId, userRole) => {
                const student = await this.studentService.findOne(studentId);
                if (!student) {
                    return false;
                }
                if (userRole === database_1.UserRole.NURSE) {
                    return student.nurseId === userId;
                }
                return true;
            },
        },
        health_record: {
            checkOwnership: async (userId, recordId, userRole) => {
                const record = await this.healthRecordService.findOne(recordId);
                if (!record) {
                    return false;
                }
                const student = await this.studentService.findOne(record.studentId);
                if (!student) {
                    return false;
                }
                if (userRole === database_1.UserRole.NURSE) {
                    return student.nurseId === userId;
                }
                return true;
            },
        },
    };
    constructor(reflector, studentService, healthRecordService) {
        this.reflector = reflector;
        this.studentService = studentService;
        this.healthRecordService = healthRecordService;
    }
    async canActivate(context) {
        const resourceType = this.reflector.get(exports.RESOURCE_TYPE_KEY, context.getHandler());
        if (!resourceType) {
            return true;
        }
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const { user } = ctx.getContext().req;
        const args = ctx.getArgs();
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        if (user.role === database_1.UserRole.ADMIN ||
            user.role === database_1.UserRole.SCHOOL_ADMIN ||
            user.role === database_1.UserRole.DISTRICT_ADMIN) {
            return true;
        }
        const resourceId = args.id || args.studentId || args.recordId;
        if (!resourceId) {
            console.warn('ResourceOwnershipGuard: No resource ID found in arguments', {
                resourceType,
                args,
            });
            return true;
        }
        const rule = this.ownershipRules[resourceType];
        if (!rule) {
            console.warn(`No ownership rule defined for resource type: ${resourceType}`);
            return true;
        }
        const hasAccess = await rule.checkOwnership(user.id, resourceId, user.role);
        if (!hasAccess) {
            console.warn('Resource ownership denied', {
                userId: user.id,
                userRole: user.role,
                resourceType,
                resourceId,
                timestamp: new Date().toISOString(),
            });
            throw new common_1.ForbiddenException(`You do not have permission to access this ${resourceType}`);
        }
        console.log('Resource ownership granted', {
            userId: user.id,
            userRole: user.role,
            resourceType,
            resourceId,
            timestamp: new Date().toISOString(),
        });
        return true;
    }
};
exports.ResourceOwnershipGuard = ResourceOwnershipGuard;
exports.ResourceOwnershipGuard = ResourceOwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        student_1.StudentService,
        health_record_1.HealthRecordService])
], ResourceOwnershipGuard);
//# sourceMappingURL=resource-ownership.guard.js.map