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
exports.AbacPolicyService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const abac_policy_interface_1 = require("../interfaces/abac-policy.interface");
let AbacPolicyService = class AbacPolicyService extends base_1.BaseService {
    policies = new Map();
    constructor() {
        super("AbacPolicyService");
        this.logInfo('ABAC Policy Service initialized');
        this.initializeDefaultPolicies();
    }
    createPolicy(policy) {
        const id = `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newPolicy = {
            id,
            ...policy,
        };
        this.policies.set(id, newPolicy);
        this.logInfo(`Created ABAC policy: ${newPolicy.name} (${id})`);
        return newPolicy;
    }
    getAllPolicies() {
        return Array.from(this.policies.values());
    }
    getPolicy(id) {
        return this.policies.get(id);
    }
    updatePolicy(id, updates) {
        const policy = this.policies.get(id);
        if (!policy) {
            return null;
        }
        const updated = { ...policy, ...updates, id };
        this.policies.set(id, updated);
        this.logInfo(`Updated ABAC policy: ${id}`);
        return updated;
    }
    deletePolicy(id) {
        const deleted = this.policies.delete(id);
        if (deleted) {
            this.logInfo(`Deleted ABAC policy: ${id}`);
        }
        return deleted;
    }
    evaluateAccess(context) {
        const activePolicies = Array.from(this.policies.values())
            .filter((p) => p.isActive)
            .sort((a, b) => b.priority - a.priority);
        const matchedRules = [];
        let finalDecision = false;
        for (const policy of activePolicies) {
            if (this.evaluatePolicy(policy, context)) {
                matchedRules.push(policy.id);
                if (policy.effect === 'allow') {
                    finalDecision = true;
                }
                else if (policy.effect === 'deny') {
                    return {
                        allowed: false,
                        matchedRules,
                        reason: `Access denied by policy: ${policy.name}`,
                    };
                }
            }
        }
        return {
            allowed: finalDecision,
            matchedRules,
            reason: finalDecision
                ? 'Access granted by ABAC policies'
                : 'No matching allow policies',
        };
    }
    evaluatePolicy(policy, context) {
        return policy.conditions.every((condition) => this.evaluateCondition(condition, context));
    }
    evaluateCondition(condition, context) {
        const actualValue = this.extractAttribute(condition.attribute, context);
        switch (condition.operator) {
            case abac_policy_interface_1.AbacOperator.EQUALS:
                return actualValue === condition.value;
            case abac_policy_interface_1.AbacOperator.NOT_EQUALS:
                return actualValue !== condition.value;
            case abac_policy_interface_1.AbacOperator.GREATER_THAN:
                return actualValue > condition.value;
            case abac_policy_interface_1.AbacOperator.LESS_THAN:
                return actualValue < condition.value;
            case abac_policy_interface_1.AbacOperator.IN:
                return (Array.isArray(condition.value) &&
                    condition.value.includes(actualValue));
            case abac_policy_interface_1.AbacOperator.NOT_IN:
                return (Array.isArray(condition.value) &&
                    !condition.value.includes(actualValue));
            case abac_policy_interface_1.AbacOperator.CONTAINS:
                if (typeof actualValue === 'string') {
                    return actualValue.includes(condition.value);
                }
                if (Array.isArray(actualValue)) {
                    return actualValue.includes(condition.value);
                }
                return false;
            case abac_policy_interface_1.AbacOperator.MATCHES:
                if (typeof actualValue === 'string') {
                    const regex = new RegExp(condition.value);
                    return regex.test(actualValue);
                }
                return false;
            default:
                this.logWarning(`Unknown operator: ${condition.operator}`);
                return false;
        }
    }
    extractAttribute(path, context) {
        const parts = path.split('.');
        let value = context;
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    initializeDefaultPolicies() {
        this.createPolicy({
            name: 'Business Hours Access',
            description: 'Allow access only during business hours (9 AM - 5 PM)',
            effect: 'allow',
            conditions: [
                {
                    attribute: 'environment.time',
                    operator: abac_policy_interface_1.AbacOperator.GREATER_THAN,
                    value: 9,
                },
                {
                    attribute: 'environment.time',
                    operator: abac_policy_interface_1.AbacOperator.LESS_THAN,
                    value: 17,
                },
            ],
            priority: 50,
            isActive: false,
        });
        this.logInfo('Default ABAC policies initialized');
    }
};
exports.AbacPolicyService = AbacPolicyService;
exports.AbacPolicyService = AbacPolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AbacPolicyService);
//# sourceMappingURL=abac-policy.service.js.map