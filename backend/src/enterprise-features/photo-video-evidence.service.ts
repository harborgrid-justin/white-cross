// Photo/Video Evidence Service
// Handles secure evidence file management for incidents

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EvidenceFile, EvidenceSecurityLevel } from './enterprise-features-interfaces';
import { ENTERPRISE_CONSTANTS, EVIDENCE_CONSTANTS } from './enterprise-features-constants';

import { BaseService } from '@/common/base';
@Injectable()
export class PhotoVideoEvidenceService extends BaseService {
  private evidenceFiles: EvidenceFile[] = []; // In production, this would be a database

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Upload evidence file for an incident
   */
  uploadEvidence(
    incidentId: string,
    fileData: string,
    type: 'photo' | 'video',
    uploadedBy: string,
  ): Promise<EvidenceFile> {
    try {
      // Validate file data
      this.validateFileData(fileData, type);

      const buffer = Buffer.from(fileData, 'base64');
      const evidence: EvidenceFile = {
        id: `${ENTERPRISE_CONSTANTS.ID_PREFIXES.EVIDENCE}${Date.now()}`,
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
        securityLevel: EvidenceSecurityLevel.CONFIDENTIAL,
      };

      // Add video-specific metadata if applicable
      if (type === 'video') {
        // In production, extract duration from video file
        evidence.metadata.duration = 0; // Placeholder
      }

      this.evidenceFiles.push(evidence);

      this.logInfo('Evidence file uploaded', {
        evidenceId: evidence.id,
        incidentId,
        type,
        fileSize: evidence.metadata.fileSize,
        uploadedBy,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('evidence.uploaded', {
        evidence,
        timestamp: new Date(),
      });

      return Promise.resolve(evidence);
    } catch (error) {
      this.logError('Error uploading evidence', {
        error: error instanceof Error ? error.message : String(error),
        incidentId,
        type,
        uploadedBy,
      });
      throw error;
    }
  }

  /**
   * Get evidence file with audit logging
   */
  getEvidenceWithAudit(evidenceId: string, accessedBy: string): Promise<EvidenceFile | null> {
    try {
      const evidence = this.evidenceFiles.find((e) => e.id === evidenceId);

      if (evidence) {
        this.logInfo('Evidence file accessed', {
          evidenceId,
          accessedBy,
          incidentId: evidence.incidentId,
          type: evidence.type,
        });

        // Emit event for audit logging
        this.eventEmitter.emit('evidence.accessed', {
          evidence,
          accessedBy,
          timestamp: new Date(),
        });
      } else {
        this.logWarning('Evidence file not found', { evidenceId, accessedBy });
      }

      return Promise.resolve(evidence || null);
    } catch (error) {
      this.logError('Error accessing evidence', {
        error: error instanceof Error ? error.message : String(error),
        evidenceId,
        accessedBy,
      });
      throw error;
    }
  }

  /**
   * Delete evidence file with audit trail
   */
  deleteEvidence(evidenceId: string, deletedBy: string, reason: string): Promise<boolean> {
    try {
      const evidenceIndex = this.evidenceFiles.findIndex((e) => e.id === evidenceId);

      if (evidenceIndex === -1) {
        this.logWarning('Evidence file not found for deletion', { evidenceId });
        return Promise.resolve(false);
      }

      const evidence = this.evidenceFiles[evidenceIndex];

      // Remove from storage
      this.evidenceFiles.splice(evidenceIndex, 1);

      this.logWarning('Evidence file deleted', {
        evidenceId,
        deletedBy,
        reason,
        incidentId: evidence.incidentId,
        type: evidence.type,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('evidence.deleted', {
        evidence,
        deletedBy,
        reason,
        timestamp: new Date(),
      });

      return Promise.resolve(true);
    } catch (error) {
      this.logError('Error deleting evidence', {
        error: error instanceof Error ? error.message : String(error),
        evidenceId,
        deletedBy,
      });
      throw error;
    }
  }

  /**
   * Get all evidence files for an incident
   */
  getEvidenceByIncident(incidentId: string): EvidenceFile[] {
    try {
      const evidence = this.evidenceFiles.filter((e) => e.incidentId === incidentId);

      this.logInfo('Retrieved evidence for incident', {
        incidentId,
        count: evidence.length,
      });

      return evidence;
    } catch (error) {
      this.logError('Error getting evidence by incident', {
        error: error instanceof Error ? error.message : String(error),
        incidentId,
      });
      throw error;
    }
  }

  /**
   * Get evidence statistics
   */
  getEvidenceStatistics(): {
    totalFiles: number;
    filesByType: Record<string, number>;
    totalSize: number;
    filesBySecurityLevel: Record<string, number>;
  } {
    try {
      const stats = {
        totalFiles: this.evidenceFiles.length,
        filesByType: {} as Record<string, number>,
        totalSize: 0,
        filesBySecurityLevel: {} as Record<string, number>,
      };

      // Count by type and security level, sum file sizes
      for (const evidence of this.evidenceFiles) {
        // Count by type
        stats.filesByType[evidence.type] = (stats.filesByType[evidence.type] || 0) + 1;

        // Count by security level
        stats.filesBySecurityLevel[evidence.securityLevel] =
          (stats.filesBySecurityLevel[evidence.securityLevel] || 0) + 1;

        // Sum file sizes
        stats.totalSize += evidence.metadata.fileSize;
      }

      this.logInfo('Retrieved evidence statistics', stats);
      return stats;
    } catch (error) {
      this.logError('Error getting evidence statistics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Validate file data
   */
  private validateFileData(fileData: string, type: 'photo' | 'video'): void {
    if (!fileData || fileData.length === 0) {
      throw new Error('File data cannot be empty');
    }

    try {
      // Validate base64 format
      Buffer.from(fileData, 'base64');
    } catch {
      throw new Error('Invalid base64 file data');
    }

    // Check file size limits
    const buffer = Buffer.from(fileData, 'base64');
    const maxSizeBytes = EVIDENCE_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024;

    if (buffer.length > maxSizeBytes) {
      throw new Error(
        `File size exceeds maximum limit of ${EVIDENCE_CONSTANTS.MAX_FILE_SIZE_MB}MB for ${type} files`,
      );
    }
  }

  /**
   * Get file extension for evidence type
   */
  private getFileExtension(type: 'photo' | 'video'): string {
    return type === 'photo' ? 'jpg' : 'mp4';
  }

  /**
   * Get MIME type for evidence type
   */
  private getMimeType(type: 'photo' | 'video'): string {
    return type === 'photo' ? 'image/jpeg' : 'video/mp4';
  }
}
