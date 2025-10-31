/**
 * @fileoverview Message History Page - View sent and received messages
 * @module app/communication/history/page
 * @version 1.0.0
 */

import React from 'react'
import { Metadata } from 'next'
import MessageHistory from '@/components/features/communication/MessageHistory'

export const metadata: Metadata = {
  title: 'Message History | Communication | White Cross',
  description: 'View and search message history',
}

// Force dynamic rendering due to client-side data requirements
export const dynamic = 'force-dynamic';

/**
 * Message History Page
 *
 * Displays paginated message history with filtering and search capabilities.
 * Supports filtering by category, priority, date range, and delivery status.
 */
export default function MessageHistoryPage() {
  return <MessageHistory />
}
