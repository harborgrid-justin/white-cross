import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components'
import { FormBuilderList } from '@/components/forms'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Form Builder | White Cross',
  description: 'Create and manage custom healthcare forms'
}

export default async function FormsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage custom healthcare forms with drag-and-drop</p>
        </div>

        <Link
          href="/forms/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FormBuilderList />
      </Suspense>
    </div>
  )
}
