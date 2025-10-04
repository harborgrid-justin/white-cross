import React, { useState, useEffect } from 'react'
import {
  BookOpen
} from 'lucide-react'
import { administrationApi } from '../../../services/api'

export default function TrainingTab() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getTrainingModules()
      setModules(data.modules || [])
    } catch (error) {
      console.error('Error loading training modules:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Training Module Management</h2>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading modules...</div>
      ) : modules.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No training modules found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(module => (
            <div key={module.id} className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Duration: {module.duration}min</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  module.category === 'HIPAA' ? 'bg-red-100 text-red-800' :
                  module.category === 'SYSTEM' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {module.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
