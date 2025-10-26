import { Metadata } from 'next'
import { Suspense } from 'react'
import { DocumentUploader } from '@/components/documents'
import { LoadingSpinner } from '@/components'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Upload Document | White Cross',
  description: 'Upload healthcare documents securely'
}

export default async function UploadDocumentPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          href="/documents"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
        <p className="text-gray-600 mt-1">Securely upload healthcare documents with encryption</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DocumentUploader />
      </Suspense>
    </div>
  )
}
