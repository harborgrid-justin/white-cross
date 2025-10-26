import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { ESignatureInterface } from '@/components/documents'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface SignDocumentPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SignDocumentPageProps): Promise<Metadata> {
  return {
    title: `Sign Document ${params.id} | White Cross`,
    description: 'E-signature interface for healthcare document'
  }
}

export default async function SignDocumentPage({ params }: SignDocumentPageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          href={`/documents/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Document
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Sign Document</h1>
        <p className="text-gray-600 mt-1">Electronically sign document with legal compliance</p>
        <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Legal Notice:</strong> By signing this document, you are providing a legally binding electronic signature
            in accordance with the ESIGN Act and UETA. Your signature will be cryptographically signed and timestamped.
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ESignatureInterface documentId={id} />
      </Suspense>
    </div>
  )
}
