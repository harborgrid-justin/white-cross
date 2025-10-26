import { Metadata } from 'next'
import { Suspense } from 'react'
import { DocumentsList } from '@/components/documents'
import { LoadingSpinner } from '@/components'

export const metadata: Metadata = {
  title: 'Documents | White Cross',
  description: 'Manage and view healthcare documents'
}

export default async function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
        <p className="text-gray-600 mt-1">Manage healthcare documents, forms, and templates</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DocumentsList />
      </Suspense>
    </div>
  )
}
