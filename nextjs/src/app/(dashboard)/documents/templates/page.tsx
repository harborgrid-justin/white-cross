import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components'
import { DocumentTemplatesList } from '@/components/documents'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Document Templates | White Cross',
  description: 'Manage reusable document templates'
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function DocumentTemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/documents"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage reusable document templates</p>
        </div>

        <Link
          href="/documents/templates/new/edit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DocumentTemplatesList />
      </Suspense>
    </div>
  )
}
