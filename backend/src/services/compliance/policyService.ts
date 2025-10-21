/**
 * LOC: D3E8332E34
 * WC-GEN-240 | policyService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/compliance/index.ts)
 */

/**
 * WC-GEN-240 | policyService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  PolicyDocument,
  PolicyAcknowledgment,
  User,
  sequelize
} from '../../database/models';
import {
  PolicyCategory,
  PolicyStatus
} from '../../database/types/enums';
import {
  CreatePolicyData,
  UpdatePolicyData
} from './types';

export class PolicyService {
  /**
   * Get all policy documents
   */
  static async getPolicies(filters: { category?: PolicyCategory; status?: PolicyStatus } = {}): Promise<PolicyDocument[]> {
    try {
      const whereClause: any = {};

      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }

      const policies = await PolicyDocument.findAll({
        where: whereClause,
        include: [
          {
            model: PolicyAcknowledgment,
            as: 'acknowledgments',
            limit: 5,
            separate: true,
            order: [['acknowledgedAt', 'DESC']]
          }
        ],
        order: [['effectiveDate', 'DESC']]
      });

      logger.info(`Retrieved ${policies.length} policies`);
      return policies;
    } catch (error) {
      logger.error('Error getting policies:', error);
      throw new Error('Failed to fetch policies');
    }
  }

  /**
   * Get policy document by ID
   */
  static async getPolicyById(id: string): Promise<PolicyDocument> {
    try {
      const policy = await PolicyDocument.findByPk(id, {
        include: [
          {
            model: PolicyAcknowledgment,
            as: 'acknowledgments',
            order: [['acknowledgedAt', 'DESC']]
          }
        ]
      });

      if (!policy) {
        throw new Error('Policy document not found');
      }

      logger.info(`Retrieved policy: ${id}`);
      return policy;
    } catch (error) {
      logger.error(`Error getting policy ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create policy document
   * COMPLIANCE: Version-controlled policy management for HIPAA/FERPA
   */
  static async createPolicy(data: CreatePolicyData): Promise<PolicyDocument> {
    try {
      // Validate version format
      if (data.version && !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(data.version)) {
        throw new Error('Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)');
      }

      // Validate content length
      if (data.content.trim().length < 100) {
        throw new Error('Policy content must be at least 100 characters');
      }

      // Validate review date if provided
      if (data.reviewDate) {
        const reviewDate = new Date(data.reviewDate);
        const effectiveDate = new Date(data.effectiveDate);
        if (reviewDate < effectiveDate) {
          throw new Error('Review date cannot be before effective date');
        }
      }

      const policy = await PolicyDocument.create({
        title: data.title.trim(),
        category: data.category,
        content: data.content.trim(),
        version: data.version || '1.0',
        effectiveDate: data.effectiveDate,
        reviewDate: data.reviewDate,
        status: PolicyStatus.DRAFT
      });

      logger.info(`Created policy: ${policy.id} - ${policy.title} (${policy.category}) v${policy.version}`);
      return policy;
    } catch (error) {
      logger.error('Error creating policy:', error);
      throw error;
    }
  }

  /**
   * Update policy
   * COMPLIANCE: Enforces policy lifecycle and approval workflow
   */
  static async updatePolicy(
    id: string,
    data: UpdatePolicyData
  ): Promise<PolicyDocument> {
    try {
      const existingPolicy = await PolicyDocument.findByPk(id);

      if (!existingPolicy) {
        throw new Error('Policy document not found');
      }

      const updateData: any = {};

      // Validate status transitions
      if (data.status) {
        if (data.status === PolicyStatus.ACTIVE) {
          // Activating a policy requires approval
          if (!data.approvedBy && !existingPolicy.approvedBy) {
            throw new Error('Approver is required to activate a policy');
          }
          if (existingPolicy.status === PolicyStatus.ARCHIVED) {
            throw new Error('Cannot reactivate an archived policy. Create a new version instead.');
          }
          if (existingPolicy.status === PolicyStatus.SUPERSEDED) {
            throw new Error('Cannot reactivate a superseded policy. Create a new version instead.');
          }
        }
        updateData.status = data.status;
      }

      if (data.approvedBy) {
        updateData.approvedBy = data.approvedBy;
      }

      if (data.reviewDate) {
        const reviewDate = new Date(data.reviewDate);
        if (reviewDate < existingPolicy.effectiveDate) {
          throw new Error('Review date cannot be before effective date');
        }
        updateData.reviewDate = data.reviewDate;
      }

      // Automatically set approval timestamp when status changes to ACTIVE
      if (data.status === PolicyStatus.ACTIVE && !existingPolicy.approvedAt) {
        updateData.approvedAt = new Date();
      }

      await existingPolicy.update(updateData);

      logger.info(
        `Updated policy: ${id} - ${existingPolicy.title} ` +
        `${data.status ? `(status: ${existingPolicy.status} -> ${data.status})` : ''}`
      );

      return existingPolicy;
    } catch (error) {
      logger.error(`Error updating policy ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete policy document
   */
  static async deletePolicy(id: string): Promise<{ success: boolean }> {
    try {
      const policy = await PolicyDocument.findByPk(id);

      if (!policy) {
        throw new Error('Policy document not found');
      }

      // Check if policy has acknowledgments
      const acknowledgmentCount = await PolicyAcknowledgment.count({
        where: { policyId: id }
      });

      if (acknowledgmentCount > 0) {
        throw new Error('Cannot delete policy that has been acknowledged. Archive it instead.');
      }

      await policy.destroy();

      logger.info(`Deleted policy: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting policy ${id}:`, error);
      throw error;
    }
  }

  /**
   * Acknowledge policy
   * Uses transaction to ensure atomicity
   * COMPLIANCE: Required for staff training and policy compliance tracking
   */
  static async acknowledgePolicy(
    policyId: string,
    userId: string,
    ipAddress?: string
  ): Promise<PolicyAcknowledgment> {
    const transaction = await sequelize.transaction();

    try {
      // Verify policy exists and is active
      const policy = await PolicyDocument.findByPk(policyId, { transaction });
      if (!policy) {
        throw new Error('Policy document not found');
      }
      if (policy.status !== PolicyStatus.ACTIVE) {
        throw new Error(
          `Policy is ${policy.status} and cannot be acknowledged. Only ACTIVE policies can be acknowledged.`
        );
      }

      // Verify policy is not past its review date
      if (policy.reviewDate && new Date(policy.reviewDate) < new Date()) {
        logger.warn(
          `Policy ${policyId} is past its review date (${policy.reviewDate}). ` +
          `Consider updating or creating a new version.`
        );
      }

      // Verify user exists
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if already acknowledged (unique constraint)
      const existingAcknowledgment = await PolicyAcknowledgment.findOne({
        where: {
          policyId,
          userId
        },
        transaction
      });

      if (existingAcknowledgment) {
        throw new Error(
          `Policy already acknowledged by this user on ` +
          `${existingAcknowledgment.acknowledgedAt.toISOString().split('T')[0]}`
        );
      }

      // Create acknowledgment
      const acknowledgment = await PolicyAcknowledgment.create(
        {
          policyId,
          userId,
          ipAddress
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(
        `POLICY ACKNOWLEDGED: ${policy.title} (${policy.category}) v${policy.version} ` +
        `by ${user.firstName} ${user.lastName} (${userId})` +
        `${ipAddress ? ` from IP ${ipAddress}` : ''}`
      );

      return acknowledgment;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error acknowledging policy:', error);
      throw error;
    }
  }

  /**
   * Get policy acknowledgments for a policy
   */
  static async getPolicyAcknowledgments(policyId: string): Promise<PolicyAcknowledgment[]> {
    try {
      const acknowledgments = await PolicyAcknowledgment.findAll({
        where: { policyId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['acknowledgedAt', 'DESC']]
      });

      logger.info(`Retrieved ${acknowledgments.length} acknowledgments for policy ${policyId}`);
      return acknowledgments;
    } catch (error) {
      logger.error(`Error getting acknowledgments for policy ${policyId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's policy acknowledgments
   */
  static async getUserPolicyAcknowledgments(userId: string): Promise<PolicyAcknowledgment[]> {
    try {
      const acknowledgments = await PolicyAcknowledgment.findAll({
        where: { userId },
        include: [
          {
            model: PolicyDocument,
            as: 'policy',
            attributes: ['id', 'title', 'category', 'version', 'status']
          }
        ],
        order: [['acknowledgedAt', 'DESC']]
      });

      logger.info(`Retrieved ${acknowledgments.length} policy acknowledgments for user ${userId}`);
      return acknowledgments;
    } catch (error) {
      logger.error(`Error getting policy acknowledgments for user ${userId}:`, error);
      throw error;
    }
  }
}
