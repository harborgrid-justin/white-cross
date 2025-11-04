/**
 * @fileoverview Form Utility Functions
 * @module lib/actions/forms.utils
 *
 * Utility functions, statistics, and analytics for forms.
 * Includes dashboard data and form management helpers.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import type { ActionResult, FormDefinition } from './forms.types';
import { FORMS_CACHE_TAGS, getForm, getForms } from './forms.cache';
import { getFormResponsesAction } from './forms.responses';
import { updateFormAction } from './forms.crud';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if form exists
 */
export async function formExists(formId: string): Promise<boolean> {
  const form = await getForm(formId);
  return form !== null;
}

/**
 * Get form count
 */
export async function getFormCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const forms = await getForms(filters);
    return forms.length;
  } catch {
    return 0;
  }
}

/**
 * Get form statistics for dashboard
 */
export const getFormStats = cache(async (): Promise<{
  totalForms: number;
  activeForms: number;
  publishedForms: number;
  draftForms: number;
  archivedForms: number;
  totalResponses: number;
  recentResponses: number;
  averageCompletionRate: number;
}> => {
  try {
    const forms = await getForms();

    const stats = {
      totalForms: forms.length,
      activeForms: forms.filter(f => f.status === 'PUBLISHED').length, // Published forms are active
      publishedForms: forms.filter(f => f.status === 'PUBLISHED').length,
      draftForms: forms.filter(f => f.status === 'DRAFT').length,
      archivedForms: forms.filter(f => f.status === 'ARCHIVED').length,
      totalResponses: 0,
      recentResponses: 0,
      averageCompletionRate: 0
    };

    // Calculate response statistics across all forms
    let totalSubmissions = 0;
    let totalCompletions = 0;
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const form of forms) {
      try {
        // Get responses for this form
        const responsesResult = await getFormResponsesAction(form.id, {});
        if (responsesResult.success && responsesResult.data) {
          const responses = responsesResult.data;
          totalSubmissions += responses.length;

          // Count completed responses (submitted, reviewed, or approved)
          const completedResponses = responses.filter(r =>
            r.status === 'SUBMITTED' || r.status === 'REVIEWED' || r.status === 'APPROVED'
          );
          totalCompletions += completedResponses.length;

          // Count recent responses
          const recentResponses = responses.filter(r =>
            new Date(r.submittedAt) >= lastWeek
          );
          stats.recentResponses += recentResponses.length;
        }
      } catch (error) {
        console.warn(`Failed to get responses for form ${form.id}:`, error);
      }
    }

    stats.totalResponses = totalSubmissions;
    stats.averageCompletionRate = totalSubmissions > 0
      ? Math.round((totalCompletions / totalSubmissions) * 100)
      : 0;

    return stats;
  } catch (error) {
    console.error('Failed to get form stats:', error);
    return {
      totalForms: 0,
      activeForms: 0,
      publishedForms: 0,
      draftForms: 0,
      archivedForms: 0,
      totalResponses: 0,
      recentResponses: 0,
      averageCompletionRate: 0
    };
  }
});

/**
 * Get forms dashboard data with recent activity
 */
export const getFormsDashboardData = cache(async (): Promise<{
  recentForms: FormDefinition[];
  popularForms: FormDefinition[];
  formsByStatus: { status: string; count: number; forms: FormDefinition[] }[];
  formsByType: { type: string; count: number; forms: FormDefinition[] }[];
}> => {
  try {
    const forms = await getForms();

    // Sort by most recently created/updated
    const recentForms = [...forms]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 5);

    // Sort by number of fields (as proxy for complexity/popularity)
    const popularForms = [...forms]
      .sort((a, b) => (b.fields?.length || 0) - (a.fields?.length || 0))
      .slice(0, 5);

    // Group by status
    const statusGroups = new Map<string, FormDefinition[]>();
    forms.forEach(form => {
      const status = form.status || 'DRAFT';
      if (!statusGroups.has(status)) {
        statusGroups.set(status, []);
      }
      statusGroups.get(status)!.push(form);
    });

    const formsByStatus = Array.from(statusGroups.entries()).map(([status, forms]) => ({
      status,
      count: forms.length,
      forms: forms.slice(0, 3) // Limit to top 3 per status
    }));

    // Group by category/type (based on form name or tags)
    const typeGroups = new Map<string, FormDefinition[]>();
    forms.forEach(form => {
      // Determine type from name or description
      let type = 'General';
      const name = (form.name || '').toLowerCase();
      const description = (form.description || '').toLowerCase();

      if (name.includes('medical') || name.includes('health') || description.includes('medical')) {
        type = 'Medical';
      } else if (name.includes('emergency') || name.includes('contact') || description.includes('emergency')) {
        type = 'Emergency';
      } else if (name.includes('enrollment') || name.includes('registration') || description.includes('enrollment')) {
        type = 'Enrollment';
      } else if (name.includes('incident') || name.includes('report') || description.includes('incident')) {
        type = 'Incident';
      }

      if (!typeGroups.has(type)) {
        typeGroups.set(type, []);
      }
      typeGroups.get(type)!.push(form);
    });

    const formsByType = Array.from(typeGroups.entries()).map(([type, forms]) => ({
      type,
      count: forms.length,
      forms: forms.slice(0, 3) // Limit to top 3 per type
    }));

    return {
      recentForms,
      popularForms,
      formsByStatus,
      formsByType
    };
  } catch (error) {
    console.error('Failed to get forms dashboard data:', error);
    return {
      recentForms: [],
      popularForms: [],
      formsByStatus: [],
      formsByType: []
    };
  }
});

/**
 * Clear form cache
 */
export async function clearFormCache(formId?: string): Promise<void> {
  if (formId) {
    revalidateTag(`form-${formId}`, 'default');
    revalidateTag(`form-responses-${formId}`, 'default');
  }
  revalidateTag(FORMS_CACHE_TAGS.FORMS, 'default');
  revalidateTag(FORMS_CACHE_TAGS.FORM_RESPONSES, 'default');
  revalidateTag('forms-list', 'default');
  revalidatePath('/forms', 'page');
}

/**
 * Publish form action
 */
export async function publishFormAction(formId: string): Promise<ActionResult<FormDefinition>> {
  return updateFormAction(formId, { status: 'PUBLISHED' });
}

/**
 * Archive form action
 */
export async function archiveFormAction(formId: string): Promise<ActionResult<FormDefinition>> {
  return updateFormAction(formId, { status: 'ARCHIVED' });
}
