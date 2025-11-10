/**
 * @fileoverview Compliance Training Actions - Next.js v16 App Router
 *
 * Server actions for training compliance management.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import type { ActionResult } from './compliance.types';
import {
  BACKEND_URL,
  getAuthToken,
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

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/training/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({
        userId,
        courseId,
        completedAt,
        verifiedBy: context.userId,
      }),
      next: {
        revalidate: 1800,
        tags: ['training', `user-training-${userId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const trainingRecord = await response.json();

    // Revalidate training caches
    revalidateTag('training', 'compliance');
    revalidateTag(`user-training-${userId}`, 'compliance');
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
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/training/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 900,
        tags: ['training', `user-training-${userId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const trainingStatus = await response.json();

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
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/training/overdue`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'overdue-training']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const overdueTraining = await response.json() as Record<string, unknown>[];

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
    // Build query parameters
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    // Fetch training stats
    const statsResponse = await fetch(`${BACKEND_URL}/compliance/training/stats`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'training-stats']
      }
    });

    let stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0,
      certifications: 0,
      expiringSoon: 0,
    };

    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }

    // Fetch training courses
    const coursesResponse = await fetch(`${BACKEND_URL}/compliance/training/courses?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'training-courses']
      }
    });

    let courses: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      stats: { completed: number; inProgress: number; overdue: number };
    }> = [];

    if (coursesResponse.ok) {
      courses = await coursesResponse.json();
    }

    // Fetch user training status
    const usersResponse = await fetch(`${BACKEND_URL}/compliance/training/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'user-training']
      }
    });

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

    if (usersResponse.ok) {
      users = await usersResponse.json();
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