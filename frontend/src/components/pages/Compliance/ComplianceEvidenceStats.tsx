/**
 * ComplianceEvidenceStats component
 * Displays statistics about compliance evidence
 */

import React from 'react'
import { Archive, Clock, CheckCircle2, Folder } from 'lucide-react'
import type { ComplianceEvidenceStatsProps } from './ComplianceEvidenceTypes'
import { formatTotalSize } from './ComplianceEvidenceUtils'

/**
 * ComplianceEvidenceStats component
 *
 * Displays key metrics about evidence collection including:
 * - Total evidence count
 * - Pending review count
 * - Approved count
 * - Storage usage
 */
export default function ComplianceEvidenceStats({ stats }: ComplianceEvidenceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Evidence */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Evidence</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Archive className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Pending Review */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending + stats.underReview}
            </p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      {/* Approved */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Storage Used */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Storage Used</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatTotalSize(stats.totalSize)}
            </p>
          </div>
          <Folder className="h-8 w-8 text-gray-600" />
        </div>
      </div>
    </div>
  )
}
