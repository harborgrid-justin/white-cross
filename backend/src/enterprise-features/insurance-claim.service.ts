// Insurance Claim Service
// Handles insurance claim generation, export, and electronic submission

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InsuranceClaim, InsuranceClaimStatus } from './enterprise-features-interfaces';
import { ENTERPRISE_CONSTANTS, INSURANCE_CONSTANTS } from './enterprise-features-constants';

@Injectable()
export class InsuranceClaimService {
  private readonly logger = new Logger(InsuranceClaimService.name);
  private claims: InsuranceClaim[] = []; // In production, this would be a database

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Generate a new insurance claim
   */
  generateClaim(incidentId: string, studentId: string): Promise<InsuranceClaim> {
    try {
      // Validate input parameters
      this.validateClaimParameters(incidentId, studentId);

      const claim: InsuranceClaim = {
        id: `${ENTERPRISE_CONSTANTS.ID_PREFIXES.INSURANCE_CLAIM}${Date.now()}`,
        incidentId,
        studentId,
        claimNumber: `${INSURANCE_CONSTANTS.CLAIM_NUMBER_PREFIX}${Date.now()}`,
        insuranceProvider: 'To be determined',
        claimAmount: 0,
        status: InsuranceClaimStatus.DRAFT,
        documents: [],
      };

      this.claims.push(claim);

      this.logger.log('Insurance claim generated', {
        claimId: claim.id,
        claimNumber: claim.claimNumber,
        incidentId,
        studentId,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('insurance-claim.generated', {
        claim,
        timestamp: new Date(),
      });

      return Promise.resolve(claim);
    } catch (error) {
      this.logger.error('Error generating insurance claim', {
        error: error instanceof Error ? error.message : String(error),
        incidentId,
        studentId,
      });
      throw error;
    }
  }

  /**
   * Export claim to specified format
   */
  exportClaimToFormat(claimId: string, format: 'pdf' | 'xml' | 'edi'): Promise<string> {
    try {
      const claim = this.claims.find((c) => c.id === claimId);

      if (!claim) {
        throw new Error('Insurance claim not found');
      }

      // Validate format
      if (!INSURANCE_CONSTANTS.SUPPORTED_EXPORT_FORMATS.includes(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      // Generate export path (in production, this would generate actual files)
      const exportPath = `/exports/claim-${claim.claimNumber}.${format}`;

      this.logger.log('Insurance claim exported', {
        claimId,
        claimNumber: claim.claimNumber,
        format,
        exportPath,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('insurance-claim.exported', {
        claim,
        format,
        exportPath,
        timestamp: new Date(),
      });

      return Promise.resolve(exportPath);
    } catch (error) {
      this.logger.error('Error exporting insurance claim', {
        error: error instanceof Error ? error.message : String(error),
        claimId,
        format,
      });
      throw error;
    }
  }

  /**
   * Submit claim electronically
   */
  submitClaimElectronically(claimId: string): Promise<boolean> {
    try {
      const claimIndex = this.claims.findIndex((c) => c.id === claimId);

      if (claimIndex === -1) {
        this.logger.warn('Insurance claim not found for submission', { claimId });
        return Promise.resolve(false);
      }

      const claim = this.claims[claimIndex];

      // Validate claim can be submitted
      if (claim.status !== 'draft') {
        throw new Error(`Claim cannot be submitted in status: ${claim.status}`);
      }

      if (claim.claimAmount <= 0) {
        throw new Error('Claim amount must be greater than zero');
      }

      if (claim.documents.length === 0) {
        throw new Error('Claim must have at least one supporting document');
      }

      // Update claim status
      claim.status = InsuranceClaimStatus.SUBMITTED;
      claim.submittedAt = new Date();

      this.logger.log('Insurance claim submitted electronically', {
        claimId,
        claimNumber: claim.claimNumber,
        claimAmount: claim.claimAmount,
        submittedAt: claim.submittedAt,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('insurance-claim.submitted', {
        claim,
        timestamp: new Date(),
      });

      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error submitting insurance claim electronically', {
        error: error instanceof Error ? error.message : String(error),
        claimId,
      });
      throw error;
    }
  }

  /**
   * Update claim status (for processing workflow)
   */
  updateClaimStatus(
    claimId: string,
    status: InsuranceClaimStatus,
    updatedBy: string,
    notes?: string,
  ): Promise<InsuranceClaim | null> {
    try {
      const claimIndex = this.claims.findIndex((c) => c.id === claimId);

      if (claimIndex === -1) {
        this.logger.warn('Insurance claim not found for status update', { claimId });
        return Promise.resolve(null);
      }

      const claim = this.claims[claimIndex];
      const previousStatus = claim.status;

      claim.status = status;

      // Set timestamps based on status
      if (status === InsuranceClaimStatus.APPROVED) {
        claim.approvedAt = new Date();
      } else if (status === InsuranceClaimStatus.DENIED) {
        claim.deniedAt = new Date();
      }

      if (notes) {
        claim.notes = notes;
      }

      this.logger.log('Insurance claim status updated', {
        claimId,
        claimNumber: claim.claimNumber,
        previousStatus,
        newStatus: status,
        updatedBy,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('insurance-claim.status-updated', {
        claim,
        previousStatus,
        newStatus: status,
        updatedBy,
        timestamp: new Date(),
      });

      return Promise.resolve(claim);
    } catch (error) {
      this.logger.error('Error updating insurance claim status', {
        error: error instanceof Error ? error.message : String(error),
        claimId,
        status,
        updatedBy,
      });
      throw error;
    }
  }

  /**
   * Get claims by incident
   */
  getClaimsByIncident(incidentId: string): InsuranceClaim[] {
    try {
      const claims = this.claims.filter((c) => c.incidentId === incidentId);

      this.logger.log('Retrieved insurance claims for incident', {
        incidentId,
        count: claims.length,
      });

      return claims;
    } catch (error) {
      this.logger.error('Error getting claims by incident', {
        error: error instanceof Error ? error.message : String(error),
        incidentId,
      });
      throw error;
    }
  }

  /**
   * Get claims by student
   */
  getClaimsByStudent(studentId: string): InsuranceClaim[] {
    try {
      const claims = this.claims.filter((c) => c.studentId === studentId);

      this.logger.log('Retrieved insurance claims for student', {
        studentId,
        count: claims.length,
      });

      return claims;
    } catch (error) {
      this.logger.error('Error getting claims by student', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
      });
      throw error;
    }
  }

  /**
   * Get a specific claim
   */
  getClaim(claimId: string): InsuranceClaim | null {
    try {
      const claim = this.claims.find((c) => c.id === claimId);

      if (claim) {
        this.logger.log('Insurance claim retrieved', {
          claimId,
          claimNumber: claim.claimNumber,
        });
      } else {
        this.logger.log('Insurance claim not found', { claimId });
      }

      return claim || null;
    } catch (error) {
      this.logger.error('Error getting insurance claim', {
        error: error instanceof Error ? error.message : String(error),
        claimId,
      });
      throw error;
    }
  }

  /**
   * Get claim statistics
   */
  getClaimStatistics(): {
    totalClaims: number;
    claimsByStatus: Record<string, number>;
    totalClaimAmount: number;
    averageClaimAmount: number;
    claimsThisMonth: number;
  } {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        totalClaims: this.claims.length,
        claimsByStatus: {} as Record<string, number>,
        totalClaimAmount: 0,
        averageClaimAmount: 0,
        claimsThisMonth: this.claims.filter(
          (c) => c.submittedAt && c.submittedAt >= startOfMonth).length,
      };

      // Count by status and sum amounts
      for (const claim of this.claims) {
        stats.claimsByStatus[claim.status] = (stats.claimsByStatus[claim.status] || 0) + 1;
        stats.totalClaimAmount += claim.claimAmount;
      }

      // Calculate average
      stats.averageClaimAmount =
        stats.totalClaims > 0 ? stats.totalClaimAmount / stats.totalClaims : 0;

      this.logger.log('Retrieved insurance claim statistics', stats);
      return stats;
    } catch (error) {
      this.logger.error('Error getting claim statistics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Validate claim parameters
   */
  private validateClaimParameters(incidentId: string, studentId: string): void {
    if (!incidentId || incidentId.trim().length === 0) {
      throw new Error('Incident ID is required');
    }

    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student ID is required');
    }
  }
}
