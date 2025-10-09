/**
 * Export Modal Component
 * Format selection for student data export
 */

import React from 'react'

interface ExportModalProps {
  show: boolean
  selectedCount: number
  onExportCSV: () => void
  onExportPDF: () => void
  onCancel: () => void
}

export const ExportModal: React.FC<ExportModalProps> = ({
  show,
  selectedCount,
  onExportCSV,
  onExportPDF,
  onCancel
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="export-format-modal">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export Students</h3>
          <p className="text-gray-600 mb-6">
            Choose export format for {selectedCount} selected student(s):
          </p>
          <div className="flex flex-col gap-3">
            <button
              className="btn-primary"
              data-testid="export-csv-button"
              onClick={onExportCSV}
            >
              Export as CSV
            </button>
            <button
              className="btn-primary"
              data-testid="export-pdf-button"
              onClick={onExportPDF}
            >
              Export as PDF
            </button>
            <button
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
