/**
 * @fileoverview Compliance Training Actions - Next.js v16 App Router
 *
 * Server actions for training compliance management.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import type { ActionResult } from './compliance.types';
import {
  COMPLIANCE_ENDPOINTS,
} from '@/constants/api/admin';
import {
  serverPost,
  serverGet,
} from '@/lib/api/server';
import {
  logHIPAAAuditEntry,
  getCurrentUserContext,
} from './compliance.cache';

// ============================================================================
// Training Compliance Actions
// ============================================================================

/**
 * Record Training Completion
 * Cache: 30 minutes for training records
 */
export async function recordTrainingCompletionAction(
  userId: string,
  courseId: string,
  completedAt: string
): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const context = await getCurrentUserContext();

    // Use serverPost from nextjs-client
    const trainingRecord = await serverPost<Record<string, unknown>>(
      `${COMPLIANCE_ENDPOINTS.TRAINING}/complete`,
      {
        userId,
        courseId,
        completedAt,
        verifiedBy: context.userId,
      },
      {
        cache: 'no-store',
        next: {
          revalidate: 1800,
          tags: ['training', `user-training-${userId}`]
        }
      }
    );

    // Revalidate training caches
    revalidateTag('training', 'default');
    revalidateTag(`user-training-${userId}`, 'default');
    revalidatePath('/compliance/training');

    // Log training completion
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'RECORD_CREATE',
      resourceType: 'SYSTEM',
      details: {
        action: 'training_completion',
        userId,
        courseId,
        completedAt
      }
    });

    return {
      success: true,
      data: trainingRecord,
      message: 'Training completion recorded successfully',
    };
  } catch (error) {
    console.error('Record training completion error:', error);
    return {
      success: false,
      error: 'Failed to record training completion',
    };
  }
}

/**
 * Get User Training Status
 * Cache: 15 minutes for training status
 */
export async function getUserTrainingStatusAction(
  userId: string
): Promise<ActionResult<Record<string, unknown>>> {
  try {
    // Use serverGet from nextjs-client
    const trainingStatus = await serverGet<Record<string, unknown>>(
      `${COMPLIANCE_ENDPOINTS.TRAINING}/user/${userId}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: 900,
          tags: ['training', `user-training-${userId}`]
        }
      }
    );

    return {
      success: true,
      data: trainingStatus,
    };
  } catch (error) {
    console.error('Get user training status error:', error);
    return {
      success: false,
      error: 'Failed to retrieve user training status',
    };
  }
}

/**
 * Get Overdue Training
 * Cache: 10 minutes for overdue training
 */
export async function getOverdueTrainingAction(): Promise<ActionResult<Record<string, unknown>[]>> {
  try {
    // Use serverGet from nextjs-client
    const overdueTraining = await serverGet<Record<string, unknown>[]>(
      `${COMPLIANCE_ENDPOINTS.TRAINING}/overdue`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: 600,
          tags: ['training', 'overdue-training']
        }
      }
    );

    return {
      success: true,
      data: overdueTraining,
    };
  } catch (error) {
    console.error('Get overdue training error:', error);
    return {
      success: false,
      error: 'Failed to retrieve overdue training',
    };
  }
}

/**
 * Get Training Records and Compliance Data
 * Cache: 10 minutes for training data
 */
export async function getTrainingRecordsAction(
  filters?: {
    userId?: string;
    courseId?: string;
    status?: string;
    priority?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResult<{
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
    certifications: number;
    expiringSoon: number;
  };
  courses: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    stats: { completed: number; inProgress: number; overdue: number };
  }>;
  users: Array<{
    id: string;
    name: string;
    role: string;
    training: {
      required: number;
      completed: number;
      overdue: number;
      status: string;
    };
  }>;
}>> {
  try {
    // Convert filters to query params
    const params = filters ? Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number | boolean>) : undefined;

    // Fetch training stats using serverGet
    let stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0,
      certifications: 0,
      expiringSoon: 0,
    };

    try {
      stats = await serverGet<typeof stats>(
        `${COMPLIANCE_ENDPOINTS.TRAINING}/stats`,
        undefined,
        {
          cache: 'force-cache',
          next: {
            revalidate: 600,
            tags: ['training', 'training-stats']
          }
        }
      );
    } catch (error) {
      console.error('Failed to fetch training stats:', error);
    }

    // Fetch training courses using serverGet
    let courses: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      stats: { completed: number; inProgress: number; overdue: number };
    }> = [];

    try {
      courses = await serverGet<typeof courses>(
        `${COMPLIANCE_ENDPOINTS.TRAINING}/courses`,
        params,
        {
          cache: 'force-cache',
          next: {
            revalidate: 600,
            tags: ['training', 'training-courses']
          }
        }
      );
    } catch (error) {
      console.error('Failed to fetch training courses:', error);
    }

    // Fetch user training status using serverGet
    let users: Array<{
      id: string;
      name: string;
      role: string;
      training: {
        required: number;
        completed: number;
        overdue: number;
        status: string;
      };
    }> = [];

    try {
      users = await serverGet<typeof users>(
        `${COMPLIANCE_ENDPOINTS.TRAINING}/users`,
        params,
        {
          cache: 'force-cache',
          next: {
            revalidate: 600,
            tags: ['training', 'user-training']
          }
        }
      );
    } catch (error) {
      console.error('Failed to fetch user training:', error);
    }

    return {
      success: true,
      data: {
        stats,
        courses,
        users,
      },
    };
  } catch (error) {
    console.error('Get training records error:', error);
    return {
      success: false,
      error: 'Failed to retrieve training records',
    };
  }
}