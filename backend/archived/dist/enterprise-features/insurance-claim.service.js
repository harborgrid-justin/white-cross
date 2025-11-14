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
exports.InsuranceClaimService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const enterprise_features_interfaces_1 = require("./enterprise-features-interfaces");
const enterprise_features_constants_1 = require("./enterprise-features-constants");
const base_1 = require("../common/base");
let InsuranceClaimService = class InsuranceClaimService extends base_1.BaseService {
    eventEmitter;
    claims = [];
    constructor(eventEmitter) {
        super('InsuranceClaimService');
        this.eventEmitter = eventEmitter;
    }
    generateClaim(incidentId, studentId) {
        try {
            this.validateClaimParameters(incidentId, studentId);
            const claim = {
                id: `${enterprise_features_constants_1.ENTERPRISE_CONSTANTS.ID_PREFIXES.INSURANCE_CLAIM}${Date.now()}`,
                incidentId,
                studentId,
                claimNumber: `${enterprise_features_constants_1.INSURANCE_CONSTANTS.CLAIM_NUMBER_PREFIX}${Date.now()}`,
                insuranceProvider: 'To be determined',
                claimAmount: 0,
                status: enterprise_features_interfaces_1.InsuranceClaimStatus.DRAFT,
                documents: [],
            };
            this.claims.push(claim);
            this.logInfo('Insurance claim generated', {
                claimId: claim.id,
                claimNumber: claim.claimNumber,
                incidentId,
                studentId,
            });
            this.eventEmitter.emit('insurance-claim.generated', {
                claim,
                timestamp: new Date(),
            });
            return Promise.resolve(claim);
        }
        catch (error) {
            this.logError('Error generating insurance claim', {
                error: error instanceof Error ? error.message : String(error),
                incidentId,
                studentId,
            });
            throw error;
        }
    }
    exportClaimToFormat(claimId, format) {
        try {
            const claim = this.claims.find((c) => c.id === claimId);
            if (!claim) {
                throw new Error('Insurance claim not found');
            }
            if (!enterprise_features_constants_1.INSURANCE_CONSTANTS.SUPPORTED_EXPORT_FORMATS.includes(format)) {
                throw new Error(`Unsupported export format: ${format}`);
            }
            const exportPath = `/exports/claim-${claim.claimNumber}.${format}`;
            this.logInfo('Insurance claim exported', {
                claimId,
                claimNumber: claim.claimNumber,
                format,
                exportPath,
            });
            this.eventEmitter.emit('insurance-claim.exported', {
                claim,
                format,
                exportPath,
                timestamp: new Date(),
            });
            return Promise.resolve(exportPath);
        }
        catch (error) {
            this.logError('Error exporting insurance claim', {
                error: error instanceof Error ? error.message : String(error),
                claimId,
                format,
            });
            throw error;
        }
    }
    submitClaimElectronically(claimId) {
        try {
            const claimIndex = this.claims.findIndex((c) => c.id === claimId);
            if (claimIndex === -1) {
                this.logWarning('Insurance claim not found for submission', { claimId });
                return Promise.resolve(false);
            }
            const claim = this.claims[claimIndex];
            if (claim.status !== 'draft') {
                throw new Error(`Claim cannot be submitted in status: ${claim.status}`);
            }
            if (claim.claimAmount <= 0) {
                throw new Error('Claim amount must be greater than zero');
            }
            if (claim.documents.length === 0) {
                throw new Error('Claim must have at least one supporting document');
            }
            claim.status = enterprise_features_interfaces_1.InsuranceClaimStatus.SUBMITTED;
            claim.submittedAt = new Date();
            this.logInfo('Insurance claim submitted electronically', {
                claimId,
                claimNumber: claim.claimNumber,
                claimAmount: claim.claimAmount,
                submittedAt: claim.submittedAt,
            });
            this.eventEmitter.emit('insurance-claim.submitted', {
                claim,
                timestamp: new Date(),
            });
            return Promise.resolve(true);
        }
        catch (error) {
            this.logError('Error submitting insurance claim electronically', {
                error: error instanceof Error ? error.message : String(error),
                claimId,
            });
            throw error;
        }
    }
    updateClaimStatus(claimId, status, updatedBy, notes) {
        try {
            const claimIndex = this.claims.findIndex((c) => c.id === claimId);
            if (claimIndex === -1) {
                this.logWarning('Insurance claim not found for status update', { claimId });
                return Promise.resolve(null);
            }
            const claim = this.claims[claimIndex];
            const previousStatus = claim.status;
            claim.status = status;
            if (status === enterprise_features_interfaces_1.InsuranceClaimStatus.APPROVED) {
                claim.approvedAt = new Date();
            }
            else if (status === enterprise_features_interfaces_1.InsuranceClaimStatus.DENIED) {
                claim.deniedAt = new Date();
            }
            if (notes) {
                claim.notes = notes;
            }
            this.logInfo('Insurance claim status updated', {
                claimId,
                claimNumber: claim.claimNumber,
                previousStatus,
                newStatus: status,
                updatedBy,
            });
            this.eventEmitter.emit('insurance-claim.status-updated', {
                claim,
                previousStatus,
                newStatus: status,
                updatedBy,
                timestamp: new Date(),
            });
            return Promise.resolve(claim);
        }
        catch (error) {
            this.logError('Error updating insurance claim status', {
                error: error instanceof Error ? error.message : String(error),
                claimId,
                status,
                updatedBy,
            });
            throw error;
        }
    }
    getClaimsByIncident(incidentId) {
        try {
            const claims = this.claims.filter((c) => c.incidentId === incidentId);
            this.logInfo('Retrieved insurance claims for incident', {
                incidentId,
                count: claims.length,
            });
            return claims;
        }
        catch (error) {
            this.logError('Error getting claims by incident', {
                error: error instanceof Error ? error.message : String(error),
                incidentId,
            });
            throw error;
        }
    }
    getClaimsByStudent(studentId) {
        try {
            const claims = this.claims.filter((c) => c.studentId === studentId);
            this.logInfo('Retrieved insurance claims for student', {
                studentId,
                count: claims.length,
            });
            return claims;
        }
        catch (error) {
            this.logError('Error getting claims by student', {
                error: error instanceof Error ? error.message : String(error),
                studentId,
            });
            throw error;
        }
    }
    getClaim(claimId) {
        try {
            const claim = this.claims.find((c) => c.id === claimId);
            if (claim) {
                this.logInfo('Insurance claim retrieved', {
                    claimId,
                    claimNumber: claim.claimNumber,
                });
            }
            else {
                this.logInfo('Insurance claim not found', { claimId });
            }
            return claim || null;
        }
        catch (error) {
            this.logError('Error getting insurance claim', {
                error: error instanceof Error ? error.message : String(error),
                claimId,
            });
            throw error;
        }
    }
    getClaimStatistics() {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const stats = {
                totalClaims: this.claims.length,
                claimsByStatus: {},
                totalClaimAmount: 0,
                averageClaimAmount: 0,
                claimsThisMonth: this.claims.filter((c) => c.submittedAt && c.submittedAt >= startOfMonth).length,
            };
            for (const claim of this.claims) {
                stats.claimsByStatus[claim.status] = (stats.claimsByStatus[claim.status] || 0) + 1;
                stats.totalClaimAmount += claim.claimAmount;
            }
            stats.averageClaimAmount =
                stats.totalClaims > 0 ? stats.totalClaimAmount / stats.totalClaims : 0;
            this.logInfo('Retrieved insurance claim statistics', stats);
            return stats;
        }
        catch (error) {
            this.logError('Error getting claim statistics', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    validateClaimParameters(incidentId, studentId) {
        if (!incidentId || incidentId.trim().length === 0) {
            throw new Error('Incident ID is required');
        }
        if (!studentId || studentId.trim().length === 0) {
            throw new Error('Student ID is required');
        }
    }
};
exports.InsuranceClaimService = InsuranceClaimService;
exports.InsuranceClaimService = InsuranceClaimService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], InsuranceClaimService);
//# sourceMappingURL=insurance-claim.service.js.map