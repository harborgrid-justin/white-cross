/**
 * @fileoverview Communication Server Actions - Next.js 15 Server Actions
 * @module app/actions/communication
 * @version 1.0.0
 *
 * Server Actions for communication operations.
 * These run on the server and can be called from Client Components.
 */

'use server'

import { revalidatePath } from 'next/cache'

/**
 * Send a message via communication API
 *
 * @param formData - FormData or message data object
 * @returns Promise with result
 */
export async function sendMessage(formData: FormData | any) {
  try {
    // Extract data from FormData if needed
    const data = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData

    // Call backend API (proxy through Next.js API route)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/communication/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication token from session
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send message')
    }

    const result = await response.json()

    // Revalidate communication history page
    revalidatePath('/communication/history')

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error sending message:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a message template
 *
 * @param formData - Template data
 * @returns Promise with result
 */
export async function createTemplate(formData: FormData | any) {
  try {
    const data = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/communication/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create template')
    }

    const result = await response.json()

    // Revalidate templates page
    revalidatePath('/communication/templates')

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error creating template:', error)
    return { success: false, error: error.message }
  }
}
