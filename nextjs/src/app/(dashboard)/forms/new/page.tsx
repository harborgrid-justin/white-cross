import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components'
import { FormBuilder } from '@/components/forms'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Create Form | White Cross',
  description: 'Build a new custom healthcare form'
}

export default async function NewFormPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          href="/forms"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Form</h1>
        <p className="text-gray-600 mt-1">Design a custom form with drag-and-drop field builder</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FormBuilder />
      </Suspense>
    </div>
  )
}
