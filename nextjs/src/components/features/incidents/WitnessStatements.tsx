/**
 * @fileoverview Witness Statements - Manage witness statements for incident
 * @module components/features/incidents/WitnessStatements
 * @version 1.0.0
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Users, Plus, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface WitnessStatementsProps {
  incidentId: string
}

export default function WitnessStatements({ incidentId }: WitnessStatementsProps) {
  const [statements, setStatements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/proxy/v1/incidents/${incidentId}/witnesses`)
        if (!response.ok) throw new Error('Failed to load witness statements')

        const data = await response.json()
        setStatements(data.statements || [])
      } catch (error) {
        console.error('Error loading witness statements:', error)
        toast.error('Failed to load witness statements')
      } finally {
        setLoading(false)
      }
    }

    fetchStatements()
  }, [incidentId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Witness Statements</h1>
          <p className="mt-1 text-gray-600">
            Manage witness statements for this incident
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Statement
        </button>
      </div>

      {/* Statements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : statements.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No witness statements</h3>
            <p className="text-gray-500">
              Add witness statements to provide additional context for this incident
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {statements.map((statement: any) => (
              <div key={statement.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{statement.witnessName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{statement.statement}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-900 ml-4">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
