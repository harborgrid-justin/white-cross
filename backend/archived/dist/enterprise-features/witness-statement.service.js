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
exports.WitnessStatementService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const enterprise_features_constants_1 = require("./enterprise-features-constants");
const base_1 = require("../common/base");
let WitnessStatementService = class WitnessStatementService extends base_1.BaseService {
    eventEmitter;
    statements = [];
    constructor(eventEmitter) {
        super('WitnessStatementService');
        this.eventEmitter = eventEmitter;
    }
    captureStatement(data) {
        try {
            this.validateStatementData(data);
            const statement = {
                ...data,
                id: `${enterprise_features_constants_1.ENTERPRISE_CONSTANTS.ID_PREFIXES.WITNESS_STATEMENT}${Date.now()}`,
                timestamp: new Date(),
                verified: false,
            };
            this.statements.push(statement);
            this.logInfo('Witness statement captured', {
                statementId: statement.id,
                incidentId: statement.incidentId,
                witnessName: statement.witnessName,
                captureMethod: statement.captureMethod,
            });
            this.eventEmitter.emit('witness-statement.captured', {
                statement,
                timestamp: new Date(),
            });
            return Promise.resolve(statement);
        }
        catch (error) {
            this.logError('Error capturing witness statement', {
                error: error instanceof Error ? error.message : String(error),
                incidentId: data.incidentId,
                witnessName: data.witnessName,
            });
            throw error;
        }
    }
    verifyStatement(statementId, verifiedBy) {
        try {
            const statementIndex = this.statements.findIndex((s) => s.id === statementId);
            if (statementIndex === -1) {
                this.logWarning('Witness statement not found for verification', { statementId });
                return Promise.resolve(false);
            }
            const statement = this.statements[statementIndex];
            statement.verified = true;
            statement.verifiedBy = verifiedBy;
            statement.verifiedAt = new Date();
            this.logInfo('Witness statement verified', {
                statementId,
                verifiedBy,
                incidentId: statement.incidentId,
                witnessName: statement.witnessName,
            });
            this.eventEmitter.emit('witness-statement.verified', {
                statement,
                verifiedBy,
                timestamp: new Date(),
            });
            return Promise.resolve(true);
        }
        catch (error) {
            this.logError('Error verifying witness statement', {
                error: error instanceof Error ? error.message : String(error),
                statementId,
                verifiedBy,
            });
            throw error;
        }
    }
    transcribeVoiceStatement(audioData) {
        try {
            this.validateAudioData(audioData);
            const transcribedText = this.simulateTranscription(audioData);
            this.logInfo('Voice statement transcribed', {
                audioDataLength: audioData.length,
                transcribedLength: transcribedText.length,
            });
            this.eventEmitter.emit('voice-statement.transcribed', {
                audioDataLength: audioData.length,
                transcribedText: transcribedText.substring(0, 100),
                timestamp: new Date(),
            });
            return Promise.resolve(transcribedText);
        }
        catch (error) {
            this.logError('Error transcribing voice statement', {
                error: error instanceof Error ? error.message : String(error),
                audioDataLength: audioData.length,
            });
            throw error;
        }
    }
    getStatementsByIncident(incidentId) {
        try {
            const statements = this.statements.filter((s) => s.incidentId === incidentId);
            this.logInfo('Retrieved witness statements for incident', {
                incidentId,
                count: statements.length,
            });
            return statements;
        }
        catch (error) {
            this.logError('Error getting statements by incident', {
                error: error instanceof Error ? error.message : String(error),
                incidentId,
            });
            throw error;
        }
    }
    getStatement(statementId) {
        try {
            const statement = this.statements.find((s) => s.id === statementId);
            if (statement) {
                this.logInfo('Witness statement retrieved', {
                    statementId,
                    incidentId: statement.incidentId,
                });
            }
            else {
                this.logInfo('Witness statement not found', { statementId });
            }
            return statement || null;
        }
        catch (error) {
            this.logError('Error getting witness statement', {
                error: error instanceof Error ? error.message : String(error),
                statementId,
            });
            throw error;
        }
    }
    getStatementStatistics() {
        try {
            const stats = {
                totalStatements: this.statements.length,
                verifiedStatements: this.statements.filter((s) => s.verified).length,
                unverifiedStatements: this.statements.filter((s) => !s.verified).length,
                statementsByRole: {},
                statementsByMethod: {},
            };
            for (const statement of this.statements) {
                stats.statementsByRole[statement.witnessRole] =
                    (stats.statementsByRole[statement.witnessRole] || 0) + 1;
            }
            for (const statement of this.statements) {
                stats.statementsByMethod[statement.captureMethod] =
                    (stats.statementsByMethod[statement.captureMethod] || 0) + 1;
            }
            this.logInfo('Retrieved witness statement statistics', stats);
            return stats;
        }
        catch (error) {
            this.logError('Error getting statement statistics', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    validateStatementData(data) {
        if (!data.witnessName || data.witnessName.trim().length === 0) {
            throw new Error('Witness name is required');
        }
        if (!data.statement || data.statement.trim().length === 0) {
            throw new Error('Statement content is required');
        }
        if (data.statement.length > enterprise_features_constants_1.WITNESS_CONSTANTS.MAX_STATEMENT_LENGTH) {
            throw new Error(`Statement exceeds maximum length of ${enterprise_features_constants_1.WITNESS_CONSTANTS.MAX_STATEMENT_LENGTH} characters`);
        }
        const validRoles = ['student', 'teacher', 'staff', 'other'];
        if (!validRoles.includes(data.witnessRole)) {
            throw new Error('Invalid witness role specified');
        }
        const validMethods = ['typed', 'voice-to-text', 'handwritten-scan'];
        if (!validMethods.includes(data.captureMethod)) {
            throw new Error('Invalid capture method specified');
        }
    }
    validateAudioData(audioData) {
        if (!audioData || audioData.length === 0) {
            throw new Error('Audio data cannot be empty');
        }
        try {
            Buffer.from(audioData, 'base64');
        }
        catch {
            throw new Error('Invalid base64 audio data');
        }
        const buffer = Buffer.from(audioData, 'base64');
        const maxSizeBytes = 50 * 1024 * 1024;
        if (buffer.length > maxSizeBytes) {
            throw new Error('Audio file exceeds maximum size limit');
        }
    }
    simulateTranscription(audioData) {
        const transcriptionLength = Math.min(audioData.length / 10, 1000);
        return `Transcribed statement: This is a simulated transcription of the voice statement. The audio data was ${audioData.length} bytes long, which would typically result in approximately ${Math.round(transcriptionLength)} words of transcribed text. In a real implementation, this would be processed by a speech-to-text service like Google Speech-to-Text, AWS Transcribe, or Azure Speech Services.`;
    }
};
exports.WitnessStatementService = WitnessStatementService;
exports.WitnessStatementService = WitnessStatementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], WitnessStatementService);
//# sourceMappingURL=witness-statement.service.js.map