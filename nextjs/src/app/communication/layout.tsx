/**
 * @fileoverview Communication section layout - Next.js 15 App Router
 * @module app/communication/layout
 * @version 1.0.0
 */

import React from 'react'

interface CommunicationLayoutProps {
  children: React.ReactNode
}

export default function CommunicationLayout({ children }: CommunicationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
