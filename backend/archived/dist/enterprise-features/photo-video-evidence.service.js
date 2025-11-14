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
exports.PhotoVideoEvidenceService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const enterprise_features_interfaces_1 = require("./enterprise-features-interfaces");
const enterprise_features_constants_1 = require("./enterprise-features-constants");
const base_1 = require("../common/base");
let PhotoVideoEvidenceService = class PhotoVideoEvidenceService extends base_1.BaseService {
    eventEmitter;
    evidenceFiles = [];
    constructor(eventEmitter) {
        super('PhotoVideoEvidenceService');
        this.eventEmitter = eventEmitter;
    }
    uploadEvidence(incidentId, fileData, type, uploadedBy) {
        try {
            this.validateFileData(fileData, type);
            const buffer = Buffer.from(fileData, 'base64');
            const evidence = {
                id: `${enterprise_features_constants_1.ENTERPRISE_CONSTANTS.ID_PREFIXES.EVIDENCE}${Date.now()}`,
                incidentId,
                type,
                filename: `evidence_${Date.now()}.${this.getFileExtension(type)}`,
                url: `/secure/evidence/${Date.now()}`,
                metadata: {
                    fileSize: buffer.length,
                    mimeType: this.getMimeType(type),
                },
                uploadedBy,
                uploadedAt: new Date(),
                securityLevel: enterprise_features_interfaces_1.EvidenceSecurityLevel.CONFIDENTIAL,
            };
            if (type === 'video') {
                evidence.metadata.duration = 0;
            }
            this.evidenceFiles.push(evidence);
            this.logInfo('Evidence file uploaded', {
                evidenceId: evidence.id,
                incidentId,
                type,
                fileSize: evidence.metadata.fileSize,
                uploadedBy,
            });
            this.eventEmitter.emit('evidence.uploaded', {
                evidence,
                timestamp: new Date(),
            });
            return Promise.resolve(evidence);
        }
        catch (error) {
            this.logError('Error uploading evidence', {
                error: error instanceof Error ? error.message : String(error),
                incidentId,
                type,
                uploadedBy,
            });
            throw error;
        }
    }
    getEvidenceWithAudit(evidenceId, accessedBy) {
        try {
            const evidence = this.evidenceFiles.find((e) => e.id === evidenceId);
            if (evidence) {
                this.logInfo('Evidence file accessed', {
                    evidenceId,
                    accessedBy,
                    incidentId: evidence.incidentId,
                    type: evidence.type,
                });
                this.eventEmitter.emit('evidence.accessed', {
                    evidence,
                    accessedBy,
                    timestamp: new Date(),
                });
            }
            else {
                this.logWarning('Evidence file not found', { evidenceId, accessedBy });
            }
            return Promise.resolve(evidence || null);
        }
        catch (error) {
            this.logError('Error accessing evidence', {
                error: error instanceof Error ? error.message : String(error),
                evidenceId,
                accessedBy,
            });
            throw error;
        }
    }
    deleteEvidence(evidenceId, deletedBy, reason) {
        try {
            const evidenceIndex = this.evidenceFiles.findIndex((e) => e.id === evidenceId);
            if (evidenceIndex === -1) {
                this.logWarning('Evidence file not found for deletion', { evidenceId });
                return Promise.resolve(false);
            }
            const evidence = this.evidenceFiles[evidenceIndex];
            this.evidenceFiles.splice(evidenceIndex, 1);
            this.logWarning('Evidence file deleted', {
                evidenceId,
                deletedBy,
                reason,
                incidentId: evidence.incidentId,
                type: evidence.type,
            });
            this.eventEmitter.emit('evidence.deleted', {
                evidence,
                deletedBy,
                reason,
                timestamp: new Date(),
            });
            return Promise.resolve(true);
        }
        catch (error) {
            this.logError('Error deleting evidence', {
                error: error instanceof Error ? error.message : String(error),
                evidenceId,
                deletedBy,
            });
            throw error;
        }
    }
    getEvidenceByIncident(incidentId) {
        try {
            const evidence = this.evidenceFiles.filter((e) => e.incidentId === incidentId);
            this.logInfo('Retrieved evidence for incident', {
                incidentId,
                count: evidence.length,
            });
            return evidence;
        }
        catch (error) {
            this.logError('Error getting evidence by incident', {
                error: error instanceof Error ? error.message : String(error),
                incidentId,
            });
            throw error;
        }
    }
    getEvidenceStatistics() {
        try {
            const stats = {
                totalFiles: this.evidenceFiles.length,
                filesByType: {},
                totalSize: 0,
                filesBySecurityLevel: {},
            };
            for (const evidence of this.evidenceFiles) {
                stats.filesByType[evidence.type] = (stats.filesByType[evidence.type] || 0) + 1;
                stats.filesBySecurityLevel[evidence.securityLevel] =
                    (stats.filesBySecurityLevel[evidence.securityLevel] || 0) + 1;
                stats.totalSize += evidence.metadata.fileSize;
            }
            this.logInfo('Retrieved evidence statistics', stats);
            return stats;
        }
        catch (error) {
            this.logError('Error getting evidence statistics', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    validateFileData(fileData, type) {
        if (!fileData || fileData.length === 0) {
            throw new Error('File data cannot be empty');
        }
        try {
            Buffer.from(fileData, 'base64');
        }
        catch {
            throw new Error('Invalid base64 file data');
        }
        const buffer = Buffer.from(fileData, 'base64');
        const maxSizeBytes = enterprise_features_constants_1.EVIDENCE_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024;
        if (buffer.length > maxSizeBytes) {
            throw new Error(`File size exceeds maximum limit of ${enterprise_features_constants_1.EVIDENCE_CONSTANTS.MAX_FILE_SIZE_MB}MB for ${type} files`);
        }
    }
    getFileExtension(type) {
        return type === 'photo' ? 'jpg' : 'mp4';
    }
    getMimeType(type) {
        return type === 'photo' ? 'image/jpeg' : 'video/mp4';
    }
};
exports.PhotoVideoEvidenceService = PhotoVideoEvidenceService;
exports.PhotoVideoEvidenceService = PhotoVideoEvidenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], PhotoVideoEvidenceService);
//# sourceMappingURL=photo-video-evidence.service.js.map