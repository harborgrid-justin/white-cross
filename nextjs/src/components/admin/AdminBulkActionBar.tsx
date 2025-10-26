/**
 * AdminBulkActionBar Component
 *
 * Toolbar for performing bulk actions on selected items.
 *
 * @module components/admin/AdminBulkActionBar
 * @since 2025-10-26
 */

'use client'

import { X, Download, Trash2, Edit, Mail, Archive } from 'lucide-react'

export interface BulkAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger'
  onClick: () => void
}

export interface AdminBulkActionBarProps {
  selectedCount: number
  totalCount: number
  actions: BulkAction[]
  onClearSelection: () => void
  className?: string
}

export function AdminBulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  className = '',
}: AdminBulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-lg border-t border-blue-700 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClearSelection}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <p className="text-sm font-medium">
                {selectedCount} of {totalCount} selected
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {actions.map((action) => {
              const Icon = action.icon

              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action.variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
