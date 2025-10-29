/**
 * @fileoverview Message Templates Page - Manage reusable message templates
 * @module app/communication/templates/page
 * @version 1.0.0
 */

import React from 'react'
import { Metadata } from 'next'
import MessageTemplates from '@/components/features/communication/MessageTemplates'

export const metadata: Metadata = {
  title: 'Message Templates | Communication | White Cross',
  description: 'Manage reusable message templates',
}

// Force dynamic rendering due to client-side data requirements
export const dynamic = "force-dynamic";

/**
 * Message Templates Page
 *
 * Template management interface with CRUD operations.
 * Supports variable substitution for personalized messages.
 */
export default function MessageTemplatesPage() {
  return <MessageTemplates />
}
