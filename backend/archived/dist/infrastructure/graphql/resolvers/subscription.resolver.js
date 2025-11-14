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
exports.SubscriptionResolver = exports.SubscriptionEvent = void 0;
exports.publishSubscriptionEvent = publishSubscriptionEvent;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const pubsub_module_1 = require("../pubsub/pubsub.module");
const guards_1 = require("../guards");
const auth_1 = require("../../../services/auth");
const database_1 = require("../../../database");
const dto_1 = require("../dto");
var SubscriptionEvent;
(function (SubscriptionEvent) {
    SubscriptionEvent["HEALTH_RECORD_CREATED"] = "HEALTH_RECORD_CREATED";
    SubscriptionEvent["HEALTH_RECORD_UPDATED"] = "HEALTH_RECORD_UPDATED";
    SubscriptionEvent["STUDENT_UPDATED"] = "STUDENT_UPDATED";
    SubscriptionEvent["ALERT_CREATED"] = "ALERT_CREATED";
    SubscriptionEvent["CRITICAL_ALERT"] = "CRITICAL_ALERT";
    SubscriptionEvent["VITALS_UPDATED"] = "VITALS_UPDATED";
})(SubscriptionEvent || (exports.SubscriptionEvent = SubscriptionEvent = {}));
let SubscriptionResolver = class SubscriptionResolver {
    pubSub;
    constructor(pubSub) {
        this.pubSub = pubSub;
    }
    healthRecordCreated(studentId) {
        return this.pubSub.asyncIterator(SubscriptionEvent.HEALTH_RECORD_CREATED);
    }
    healthRecordUpdated(studentId) {
        return this.pubSub.asyncIterator(SubscriptionEvent.HEALTH_RECORD_UPDATED);
    }
    studentUpdated(studentId) {
        return this.pubSub.asyncIterator(SubscriptionEvent.STUDENT_UPDATED);
    }
    alertCreated() {
        return this.pubSub.asyncIterator(SubscriptionEvent.ALERT_CREATED);
    }
    criticalAlert() {
        return this.pubSub.asyncIterator(SubscriptionEvent.CRITICAL_ALERT);
    }
    vitalsUpdated(studentId) {
        return this.pubSub.asyncIterator(`${SubscriptionEvent.VITALS_UPDATED}_${studentId}`);
    }
};
exports.SubscriptionResolver = SubscriptionResolver;
__decorate([
    (0, graphql_1.Subscription)(() => dto_1.HealthRecordDto, {
        name: 'healthRecordCreated',
        filter: (payload, variables, context) => {
            if (!context.user)
                return false;
            if (variables.studentId) {
                return payload.healthRecordCreated.studentId === variables.studentId;
            }
            return true;
        },
        resolve: (payload) => {
            console.log('SUBSCRIPTION: Health record accessed', {
                recordId: payload.healthRecordCreated.id,
                studentId: payload.healthRecordCreated.studentId,
                timestamp: new Date().toISOString(),
            });
            return payload.healthRecordCreated;
        },
    }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('studentId', { type: () => graphql_1.ID, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionResolver.prototype, "healthRecordCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => dto_1.HealthRecordDto, {
        name: 'healthRecordUpdated',
        filter: (payload, variables, context) => {
            if (!context.user)
                return false;
            if (variables.studentId) {
                return payload.healthRecordUpdated.studentId === variables.studentId;
            }
            return true;
        },
        resolve: (payload) => {
            console.log('SUBSCRIPTION: Health record update accessed', {
                recordId: payload.healthRecordUpdated.id,
                timestamp: new Date().toISOString(),
            });
            return payload.healthRecordUpdated;
        },
    }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('studentId', { type: () => graphql_1.ID, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionResolver.prototype, "healthRecordUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => dto_1.StudentDto, {
        name: 'studentUpdated',
        filter: (payload, variables, context) => {
            if (!context.user)
                return false;
            if (variables.studentId) {
                return payload.studentUpdated.id === variables.studentId;
            }
            if (context.user.role === database_1.UserRole.NURSE) {
                return payload.studentUpdated.nurseId === context.user.id;
            }
            return true;
        },
    }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('studentId', { type: () => graphql_1.ID, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionResolver.prototype, "studentUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => dto_1.AlertDto, {
        name: 'alertCreated',
        filter: (payload, variables, context) => {
            if (!context.user)
                return false;
            const alert = payload.alertCreated;
            if (alert.recipientId === context.user.id) {
                return true;
            }
            if (alert.recipientRole === context.user.role) {
                return true;
            }
            return !alert.recipientId && !alert.recipientRole;
        },
    }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionResolver.prototype, "alertCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => dto_1.AlertDto, {
        name: 'criticalAlert',
        filter: (payload, variables, context) => {
            return (context.user &&
                [database_1.UserRole.ADMIN, database_1.UserRole.NURSE].includes(context.user.role));
        },
        resolve: (payload) => {
            console.warn('CRITICAL ALERT broadcast:', {
                alertId: payload.criticalAlert.id,
                type: payload.criticalAlert.type,
                timestamp: new Date().toISOString(),
            });
            return payload.criticalAlert;
        },
    }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.NURSE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionResolver.prototype, "criticalAlert", null);
__decorate([
    (0, graphql_1.Subscription)(() => dto_1.VitalsDto, {
        name: 'vitalsUpdated',
        filter: (payload, variables, context) => {
            if (!context.user)
                return false;
            if (!variables.studentId)
                return false;
            return payload.vitalsUpdated.studentId === variables.studentId;
        },
        resolve: (payload) => {
            console.log('SUBSCRIPTION: Vitals accessed', {
                studentId: payload.vitalsUpdated.studentId,
                timestamp: new Date().toISOString(),
            });
            return payload.vitalsUpdated;
        },
    }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('studentId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionResolver.prototype, "vitalsUpdated", null);
exports.SubscriptionResolver = SubscriptionResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __param(0, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [graphql_redis_subscriptions_1.RedisPubSub])
], SubscriptionResolver);
async function publishSubscriptionEvent(pubSub, event, payload) {
    try {
        await pubSub.publish(event, payload);
        console.log(`Published subscription event: ${event}`);
    }
    catch (error) {
        console.error(`Failed to publish subscription event: ${event}`, error);
    }
}
//# sourceMappingURL=subscription.resolver.js.map