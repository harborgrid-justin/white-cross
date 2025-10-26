import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { FormBuilder } from '@/components/forms'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'

interface EditFormPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditFormPageProps): Promise<Metadata> {
  return {
    title: `Edit Form ${params.id} | White Cross`,
    description: 'Edit custom healthcare form'
  }
}

export default async function EditFormPage({ params }: EditFormPageProps) {
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
          <p className="text-gray-600 mt-1">Modify form ID: {id}</p>
        </div>

        <Link
          href={`/forms/${id}/responses`}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Responses
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FormBuilder formId={id} />
      </Suspense>
    </div>
  )
}
