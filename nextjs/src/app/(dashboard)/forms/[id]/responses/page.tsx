import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { FormResponseViewer } from '@/components/forms'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'

interface FormResponsesPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: FormResponsesPageProps): Promise<Metadata> {
  return {
    title: `Form Responses | White Cross`,
    description: 'View submitted form responses'
  }
}

export default async function FormResponsesPage({ params }: FormResponsesPageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/forms"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Form Responses</h1>
          <p className="text-gray-600 mt-1">View and export submitted responses</p>
        </div>

        <Link
          href={`/forms/${id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Form
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FormResponseViewer formId={id} />
      </Suspense>
    </div>
  )
}
