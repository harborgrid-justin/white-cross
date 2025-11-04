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
  BACKEND_URL,
  getAuthToken,
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
  'use cache';

  try {
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify(policyData),
      next: {
        revalidate: 300,
        tags: ['policies']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const createdPolicy = await response.json() as PolicyDocument;

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
  'use cache';

  try {
    const context = await getCurrentUserContext();

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies/${policyId}/acknowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({
        userId,
        acknowledgedAt: new Date().toISOString(),
        ipAddress: context.ipAddress,
      }),
      next: {
        revalidate: 600,
        tags: ['policies', `policy-${policyId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const acknowledgment = await response.json() as PolicyAcknowledgment;

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
  'use cache';

  try {
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies/${policyId}/acknowledgments`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 300,
        tags: ['policies', `policy-${policyId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const acknowledgments = await response.json() as PolicyAcknowledgment[];

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

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Cache-Control': 'max-age=300'
      },
      next: {
        revalidate: 300,
        tags: ['policies']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as PaginatedResult<PolicyDocument>;

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
    const statsResponse = await fetch(`${BACKEND_URL}/compliance/policies/stats`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 300,
        tags: ['policies', 'compliance-stats']
      }
    });

    let stats = {
      active: 0,
      total: 0,
      acknowledgmentRate: 0,
      acknowledged: 0,
      required: 0,
      pending: 0,
      reviewDue: 0,
    };

    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }

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