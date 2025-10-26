import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { DocumentTemplateEditor } from '@/components/documents'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EditTemplatePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditTemplatePageProps): Promise<Metadata> {
  const isNew = params.id === 'new'
  return {
    title: `${isNew ? 'Create' : 'Edit'} Template | White Cross`,
    description: `${isNew ? 'Create new' : 'Edit'} document template`
  }
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = params
  const isNew = id === 'new'

  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          href="/documents/templates"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Create New Template' : `Edit Template ${id}`}
        </h1>
        <p className="text-gray-600 mt-1">
          {isNew
            ? 'Design a reusable document template'
            : 'Modify existing template'}
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DocumentTemplateEditor templateId={isNew ? undefined : id} />
      </Suspense>
    </div>
  )
}
