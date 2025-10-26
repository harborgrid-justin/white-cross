/**
 * @fileoverview Incidents Server Actions - Next.js 15 Server Actions
 * @module app/actions/incidents
 * @version 1.0.0
 *
 * Server Actions for incident report operations.
 * These run on the server and can be called from Client Components.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Create a new incident report
 *
 * @param formData - Incident data
 * @returns Promise with result
 */
export async function createIncidentReport(formData: FormData | any) {
  try {
    const data = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication token from session
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create incident report')
    }

    const result = await response.json()

    // Revalidate incidents list page
    revalidatePath('/incidents')

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error creating incident report:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update an existing incident report
 *
 * @param incidentId - Incident ID
 * @param formData - Updated incident data
 * @returns Promise with result
 */
export async function updateIncidentReport(incidentId: string, formData: FormData | any) {
  try {
    const data = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/incidents/${incidentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update incident report')
    }

    const result = await response.json()

    // Revalidate incident details page and list
    revalidatePath(`/incidents/${incidentId}`)
    revalidatePath('/incidents')

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error updating incident report:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete an incident report
 *
 * @param incidentId - Incident ID
 * @returns Promise with result
 */
export async function deleteIncidentReport(incidentId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/incidents/${incidentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete incident report')
    }

    // Revalidate incidents list page
    revalidatePath('/incidents')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting incident report:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Add a witness statement to an incident
 *
 * @param incidentId - Incident ID
 * @param formData - Witness statement data
 * @returns Promise with result
 */
export async function addWitnessStatement(incidentId: string, formData: FormData | any) {
  try {
    const data = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/incidents/${incidentId}/witnesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add witness statement')
    }

    const result = await response.json()

    // Revalidate witness statements page
    revalidatePath(`/incidents/${incidentId}/witnesses`)

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error adding witness statement:', error)
    return { success: false, error: error.message }
  }
}
