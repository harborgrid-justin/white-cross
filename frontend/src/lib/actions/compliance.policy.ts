/**
 * @fileoverview Compliance Policy Actions - Next.js v16 App Router
 *
 * Server actions for policy management including creation,
 * acknowledgment, and retrieval.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import type {
  PolicyDocument,
  PolicyAcknowledgment,
} from '@/schemas/compliance/compliance.schemas';

import type {
  ActionResult,
  PaginatedResult,
  UIPolicy
} from './compliance.types';
import {
  COMPLIANCE_ENDPOINTS,
} from '@/constants/api/admin';
import {
  serverPost,
  serverGet,
} from '@/lib/api/nextjs-client';
import {
  logHIPAAAuditEntry,
  getCurrentUserContext,
} from './compliance.cache';

// ============================================================================
// Policy Management Actions
// ============================================================================

/**
 * Create Policy Document
 * Cache: 5 minutes for created policies
 */
export async function createPolicyAction(
  policyData: Omit<PolicyDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<PolicyDocument>> {
  try {
    const createdPolicy = await serverPost<PolicyDocument>(
      COMPLIANCE_ENDPOINTS.POLICIES,
      policyData,
      {
        next: {
          revalidate: 300,
          tags: ['policies']
        }
      }
    );

    // Revalidate policy caches
    revalidateTag('policies', 'compliance');
    revalidatePath('/compliance/policies');

    // Log policy creation
    await logHIPAAAuditEntry({
      userId: await getCurrentUserContext().then(ctx => ctx.userId),
      action: 'RECORD_CREATE',
      resourceType: 'POLICY',
      resourceId: createdPolicy.id,
      details: {
        policyTitle: createdPolicy.title,
        policyType: createdPolicy.policyType,
        version: createdPolicy.version
      }
    });

    return {
      success: true,
      data: createdPolicy,
      message: 'Policy created successfully',
    };
  } catch (error) {
    console.error('Create policy error:', error);
    return {
      success: false,
      error: 'Failed to create policy',
    };
  }
}

/**
 * Acknowledge Policy
 * Cache: 10 minutes for acknowledgments
 */
export async function acknowledgePolicyAction(
  policyId: string,
  userId: string
): Promise<ActionResult<PolicyAcknowledgment>> {
  try {
    const context = await getCurrentUserContext();

    const acknowledgment = await serverPost<PolicyAcknowledgment>(
      `${COMPLIANCE_ENDPOINTS.POLICIES}/${policyId}/acknowledge`,
      {
        userId,
        acknowledgedAt: new Date().toISOString(),
        ipAddress: context.ipAddress,
      },
      {
        next: {
          revalidate: 600,
          tags: ['policies', `policy-${policyId}`]
        }
      }
    );

    // Revalidate related caches
    revalidateTag('policies', 'compliance');
    revalidateTag(`policy-${policyId}`, 'compliance');
    revalidatePath('/compliance/policies');

    // Log policy acknowledgment
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'POLICY_ACKNOWLEDGMENT',
      resourceType: 'POLICY',
      resourceId: policyId,
      details: { acknowledgedUserId: userId }
    });

    return {
      success: true,
      data: acknowledgment,
      message: 'Policy acknowledged successfully',
    };
  } catch (error) {
    console.error('Acknowledge policy error:', error);
    return {
      success: false,
      error: 'Failed to acknowledge policy',
    };
  }
}

/**
 * Get Policy Acknowledgments
 * Cache: 5 minutes for acknowledgment lists
 */
export async function getPolicyAcknowledgmentsAction(
  policyId: string
): Promise<ActionResult<PolicyAcknowledgment[]>> {
  try {
    const acknowledgments = await serverGet<PolicyAcknowledgment[]>(
      `${COMPLIANCE_ENDPOINTS.POLICIES}/${policyId}/acknowledgments`,
      undefined,
      {
        next: {
          revalidate: 300,
          tags: ['policies', `policy-${policyId}`]
        }
      }
    );

    return {
      success: true,
      data: acknowledgments,
    };
  } catch (error) {
    console.error('Get policy acknowledgments error:', error);
    return {
      success: false,
      error: 'Failed to retrieve policy acknowledgments',
    };
  }
}

/**
 * Get Policies with filtering and pagination
 * Cache: 5 minutes for policy lists
 */
export async function getPoliciesAction(
  filters?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResult<PaginatedResult<UIPolicy> & { stats: { active: number; total: number; acknowledgmentRate: number; acknowledged: number; required: number; pending: number; reviewDue: number } }>> {

  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${COMPLIANCE_ENDPOINTS.POLICIES}?${queryString}` : COMPLIANCE_ENDPOINTS.POLICIES;

    const result = await serverGet<PaginatedResult<PolicyDocument>>(
      endpoint,
      undefined,
      {
        next: {
          revalidate: 300,
          tags: ['policies']
        }
      }
    );

    // Transform policies to match UI expectations
    const transformedPolicies: UIPolicy[] = result.data.map((policy: PolicyDocument) => ({
      id: policy.id,
      title: policy.title,
      category: policy.policyType.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
      status: policy.status,
      version: policy.version,
      effectiveDate: policy.effectiveDate,
      reviewDate: policy.reviewDate,
      acknowledgments: {
        completed: 0, // TODO: Calculate from acknowledgments API
        pending: 0,   // TODO: Calculate from acknowledgments API
        total: 0,     // TODO: Calculate from applicable users
      },
    }));

    // Get policy statistics
    const stats = await serverGet<{
      active: number;
      total: number;
      acknowledgmentRate: number;
      acknowledged: number;
      required: number;
      pending: number;
      reviewDue: number;
    }>(
      COMPLIANCE_ENDPOINTS.POLICIES_STATS,
      undefined,
      {
        next: {
          revalidate: 300,
          tags: ['policies', 'compliance-stats']
        }
      }
    );

    return {
      success: true,
      data: {
        data: transformedPolicies,
        pagination: result.pagination,
        stats,
      },
    };
  } catch (error) {
    console.error('Get policies error:', error);
    return {
      success: false,
      error: 'Failed to retrieve policies',
    };
  }
}