import React from 'react'

interface ActionButtonsProps {
  onImport?: () => void
  onExport?: () => void
  onNewRecord?: () => void
  showImport?: boolean
  showExport?: boolean
  showNewRecord?: boolean
  newRecordLabel?: string
  customButtons?: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
    testId?: string
  }>
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onImport,
  onExport,
  onNewRecord,
  showImport = true,
  showExport = true,
  showNewRecord = true,
  newRecordLabel = 'New Record',
  customButtons = []
}) => {
  return (
    <div className="flex gap-2">
      {showImport && onImport && (
        <button 
          className="btn-secondary flex items-center" 
          data-testid="import-button"
          onClick={onImport}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import
        </button>
      )}
      
      {showExport && onExport && (
        <button 
          className="btn-secondary flex items-center" 
          data-testid="export-button"
          onClick={onExport}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      )}
      
      {customButtons.map((button, index) => (
        <button
          key={index}
          className={`${button.variant === 'primary' ? 'btn-primary' : 'btn-secondary'} flex items-center`}
          data-testid={button.testId}
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
      
      {showNewRecord && onNewRecord && (
        <button 
          className="btn-primary flex items-center"
          onClick={onNewRecord}
          data-testid="new-record-button"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {newRecordLabel}
        </button>
      )}
    </div>
  )
}