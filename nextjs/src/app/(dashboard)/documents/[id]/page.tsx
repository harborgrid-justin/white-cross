import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { DocumentViewer } from '@/components/documents'
import Link from 'next/link'
import { ArrowLeft, FileSignature } from 'lucide-react'

interface DocumentViewPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DocumentViewPageProps): Promise<Metadata> {
  return {
    title: `Document ${params.id} | White Cross`,
    description: 'View healthcare document'
  }
}

export default async function DocumentViewPage({ params }: DocumentViewPageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Document Viewer</h1>
          <p className="text-gray-600 mt-1">Viewing document ID: {id}</p>
        </div>

        <Link
          href={`/documents/${id}/sign`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FileSignature className="w-4 h-4 mr-2" />
          Sign Document
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DocumentViewer documentId={id} />
      </Suspense>
    </div>
  )
}
