"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionChecker = exports.PermissionChecker = exports.PERMISSION_MATRIX = exports.Action = exports.Resource = exports.Role = void 0;
exports.checkPermission = checkPermission;
exports.can = can;
exports.getAllowedActions = getAllowedActions;
exports.getAllowedResources = getAllowedResources;
exports.isRole = isRole;
exports.isResource = isResource;
exports.isAction = isAction;
var Role;
(function (Role) {
    Role["SuperAdmin"] = "super_admin";
    Role["Admin"] = "admin";
    Role["Nurse"] = "nurse";
    Role["Doctor"] = "doctor";
    Role["Pharmacist"] = "pharmacist";
    Role["Staff"] = "staff";
    Role["Teacher"] = "teacher";
    Role["Counselor"] = "counselor";
    Role["Guardian"] = "guardian";
    Role["Viewer"] = "viewer";
    Role["System"] = "system";
    Role["ApiClient"] = "api_client";
})(Role || (exports.Role = Role = {}));
var Resource;
(function (Resource) {
    Resource["Student"] = "student";
    Resource["StudentProfile"] = "student:profile";
    Resource["StudentMedical"] = "student:medical";
    Resource["StudentConsent"] = "student:consent";
    Resource["Medication"] = "medication";
    Resource["MedicationLog"] = "medication:log";
    Resource["MedicationSchedule"] = "medication:schedule";
    Resource["MedicationInventory"] = "medication:inventory";
    Resource["HealthRecord"] = "health_record";
    Resource["HealthRecordMedical"] = "health_record:medical";
    Resource["HealthRecordAllergy"] = "health_record:allergy";
    Resource["HealthRecordCondition"] = "health_record:condition";
    Resource["Contact"] = "contact";
    Resource["ContactGuardian"] = "contact:guardian";
    Resource["ContactEmergency"] = "contact:emergency";
    Resource["ContactStaff"] = "contact:staff";
    Resource["Activity"] = "activity";
    Resource["ActivityLog"] = "activity:log";
    Resource["ActivityTimeline"] = "activity:timeline";
    Resource["User"] = "user";
    Resource["UserProfile"] = "user:profile";
    Resource["UserSettings"] = "user:settings";
    Resource["Settings"] = "settings";
    Resource["Audit"] = "audit";
    Resource["Report"] = "report";
    Resource["Webhook"] = "webhook";
})(Resource || (exports.Resource = Resource = {}));
var Action;
(function (Action) {
    Action["Read"] = "read";
    Action["List"] = "list";
    Action["View"] = "view";
    Action["Create"] = "create";
    Action["Update"] = "update";
    Action["Delete"] = "delete";
    Action["Administer"] = "administer";
    Action["Approve"] = "approve";
    Action["Override"] = "override";
    Action["Export"] = "export";
    Action["Import"] = "import";
    Action["AdministerMedication"] = "administer_medication";
    Action["ScheduleMedication"] = "schedule_medication";
    Action["VerifyMedication"] = "verify_medication";
    Action["ViewAudit"] = "view_audit";
    Action["ManageAudit"] = "manage_audit";
})(Action || (exports.Action = Action = {}));
exports.PERMISSION_MATRIX = [
    {
        role: Role.SuperAdmin,
        resource: Resource.Student,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.Delete,
            Action.Export,
        ],
    },
    {
        role: Role.SuperAdmin,
        resource: Resource.Medication,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.Delete,
            Action.AdministerMedication,
        ],
    },
    {
        role: Role.SuperAdmin,
        resource: Resource.HealthRecord,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.Delete,
        ],
    },
    {
        role: Role.SuperAdmin,
        resource: Resource.Contact,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.Delete,
        ],
    },
    {
        role: Role.SuperAdmin,
        resource: Resource.Settings,
        actions: [Action.Read, Action.Update],
    },
    {
        role: Role.SuperAdmin,
        resource: Resource.Audit,
        actions: [Action.ViewAudit, Action.ManageAudit],
    },
    {
        role: Role.Admin,
        resource: Resource.Student,
        actions: [Action.Read, Action.List, Action.Create, Action.Update],
    },
    {
        role: Role.Admin,
        resource: Resource.Medication,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.ScheduleMedication,
        ],
    },
    {
        role: Role.Admin,
        resource: Resource.HealthRecord,
        actions: [Action.Read, Action.List, Action.Create, Action.Update],
    },
    {
        role: Role.Admin,
        resource: Resource.Contact,
        actions: [Action.Read, Action.List, Action.Create, Action.Update],
    },
    {
        role: Role.Admin,
        resource: Resource.Audit,
        actions: [Action.ViewAudit],
    },
    {
        role: Role.Nurse,
        resource: Resource.Student,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Nurse,
        resource: Resource.StudentMedical,
        actions: [Action.Read],
    },
    {
        role: Role.Nurse,
        resource: Resource.Medication,
        actions: [
            Action.Read,
            Action.List,
            Action.AdministerMedication,
            Action.VerifyMedication,
        ],
    },
    {
        role: Role.Nurse,
        resource: Resource.MedicationLog,
        actions: [Action.Read, Action.List, Action.Create, Action.Update],
    },
    {
        role: Role.Nurse,
        resource: Resource.HealthRecord,
        actions: [Action.Read, Action.List, Action.Create],
    },
    {
        role: Role.Nurse,
        resource: Resource.Contact,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Nurse,
        resource: Resource.Activity,
        actions: [Action.Read, Action.List, Action.Create],
    },
    {
        role: Role.Doctor,
        resource: Resource.Student,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Doctor,
        resource: Resource.StudentMedical,
        actions: [Action.Read, Action.Update],
    },
    {
        role: Role.Doctor,
        resource: Resource.Medication,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.ScheduleMedication,
        ],
    },
    {
        role: Role.Doctor,
        resource: Resource.HealthRecord,
        actions: [Action.Read, Action.List, Action.Create, Action.Update],
    },
    {
        role: Role.Doctor,
        resource: Resource.Contact,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Pharmacist,
        resource: Resource.Medication,
        actions: [
            Action.Read,
            Action.List,
            Action.Create,
            Action.Update,
            Action.VerifyMedication,
        ],
    },
    {
        role: Role.Pharmacist,
        resource: Resource.MedicationInventory,
        actions: [Action.Read, Action.List, Action.Update],
    },
    {
        role: Role.Pharmacist,
        resource: Resource.MedicationLog,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Staff,
        resource: Resource.Student,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Staff,
        resource: Resource.Contact,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Staff,
        resource: Resource.Activity,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Teacher,
        resource: Resource.Student,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Teacher,
        resource: Resource.StudentProfile,
        actions: [Action.Read],
    },
    {
        role: Role.Teacher,
        resource: Resource.Contact,
        actions: [Action.Read],
    },
    {
        role: Role.Teacher,
        resource: Resource.Activity,
        actions: [Action.Read, Action.List, Action.Create],
    },
    {
        role: Role.Guardian,
        resource: Resource.Student,
        actions: [Action.Read],
        conditions: [{ field: 'guardianId', operator: 'eq', value: '{{userId}}' }],
    },
    {
        role: Role.Guardian,
        resource: Resource.StudentProfile,
        actions: [Action.Read],
        conditions: [{ field: 'guardianId', operator: 'eq', value: '{{userId}}' }],
    },
    {
        role: Role.Guardian,
        resource: Resource.MedicationLog,
        actions: [Action.Read, Action.List],
        conditions: [
            { field: 'studentGuardianId', operator: 'eq', value: '{{userId}}' },
        ],
    },
    {
        role: Role.Guardian,
        resource: Resource.Activity,
        actions: [Action.Read, Action.List],
        conditions: [
            { field: 'studentGuardianId', operator: 'eq', value: '{{userId}}' },
        ],
    },
    {
        role: Role.Viewer,
        resource: Resource.Student,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.Viewer,
        resource: Resource.Activity,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.ApiClient,
        resource: Resource.Student,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.ApiClient,
        resource: Resource.Medication,
        actions: [Action.Read, Action.List],
    },
    {
        role: Role.ApiClient,
        resource: Resource.Contact,
        actions: [Action.Read, Action.List],
    },
];
class PermissionChecker {
    permissions;
    constructor(permissions = exports.PERMISSION_MATRIX) {
        this.permissions = permissions;
    }
    check(context) {
        const { userRole, resource, action } = context;
        const matchingPermissions = this.permissions.filter((p) => p.role === userRole && p.resource === resource);
        if (matchingPermissions.length === 0) {
            return {
                allowed: false,
                reason: `Role ${userRole} has no permissions for resource ${resource}`,
                requiredRole: Role.Admin,
            };
        }
        const hasAction = matchingPermissions.some((p) => p.actions.includes(action));
        if (!hasAction) {
            return {
                allowed: false,
                reason: `Role ${userRole} cannot perform action ${action} on resource ${resource}`,
                requiredAction: action,
            };
        }
        for (const permission of matchingPermissions) {
            if (!permission.conditions || permission.conditions.length === 0) {
                return { allowed: true };
            }
            const conditionsMet = this.checkConditions(permission.conditions, context);
            if (conditionsMet) {
                return { allowed: true };
            }
        }
        return {
            allowed: false,
            reason: `Conditions not met for ${action} on ${resource}`,
        };
    }
    checkConditions(conditions, context) {
        return conditions.every((condition) => {
            let value = condition.value;
            if (typeof value === 'string' && value.includes('{{')) {
                value = value.replace('{{userId}}', context.userId);
                value = value.replace('{{resourceId}}', context.resourceId || '');
            }
            const contextValue = context.metadata?.[condition.field] || context.resourceOwnerId;
            switch (condition.operator) {
                case 'eq':
                    return contextValue === value;
                case 'ne':
                    return contextValue !== value;
                case 'in':
                    return Array.isArray(value) && value.includes(contextValue);
                case 'nin':
                    return Array.isArray(value) && !value.includes(contextValue);
                case 'gt':
                    return contextValue > value;
                case 'lt':
                    return contextValue < value;
                case 'matches':
                    return new RegExp(value).test(contextValue);
                default:
                    return false;
            }
        });
    }
    can(userRole, action, resource) {
        return this.check({
            userId: '',
            userRole,
            action,
            resource,
        }).allowed;
    }
    getAllowedActions(userRole, resource) {
        const permissions = this.permissions.filter((p) => p.role === userRole && p.resource === resource);
        const actions = permissions.flatMap((p) => p.actions);
        return Array.from(new Set(actions));
    }
    getAllowedResources(userRole) {
        const permissions = this.permissions.filter((p) => p.role === userRole);
        const resources = permissions.map((p) => p.resource);
        return Array.from(new Set(resources));
    }
}
exports.PermissionChecker = PermissionChecker;
exports.permissionChecker = new PermissionChecker();
function checkPermission(context) {
    return exports.permissionChecker.check(context);
}
function can(userRole, action, resource) {
    return exports.permissionChecker.can(userRole, action, resource);
}
function getAllowedActions(userRole, resource) {
    return exports.permissionChecker.getAllowedActions(userRole, resource);
}
function getAllowedResources(userRole) {
    return exports.permissionChecker.getAllowedResources(userRole);
}
function isRole(value) {
    return (typeof value === 'string' && Object.values(Role).includes(value));
}
function isResource(value) {
    return (typeof value === 'string' &&
        Object.values(Resource).includes(value));
}
function isAction(value) {
    return (typeof value === 'string' && Object.values(Action).includes(value));
}
exports.default = {
    Role,
    Resource,
    Action,
    PERMISSION_MATRIX: exports.PERMISSION_MATRIX,
    PermissionChecker,
    permissionChecker: exports.permissionChecker,
    checkPermission,
    can,
    getAllowedActions,
    getAllowedResources,
    isRole,
    isResource,
    isAction,
};
//# sourceMappingURL=Permission.js.map