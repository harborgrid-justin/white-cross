/**
 * Export Modal Component - White Cross Healthcare Platform
 *
 * Format selection dialog for exporting student data to CSV or PDF formats.
 * Enables bulk export operations for reporting, data analysis, and record keeping
 * with FERPA-compliant data privacy controls.
 *
 * @fileoverview Student data export modal with FERPA privacy controls
 * @module pages/students/components/modals/ExportModal
 * @version 1.0.0
 */

import React from 'react'

/**
 * Props for the ExportModal component.
 *
 * @interface ExportModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {number} selectedCount - Number of students selected for export
 * @property {() => void} onExportCSV - Callback when CSV export format is selected
 * @property {() => void} onExportPDF - Callback when PDF export format is selected
 * @property {() => void} onCancel - Callback when user cancels export operation
 *
 * @remarks
 * **Data Privacy**: Exported student data is FERPA-protected educational records.
 * Implement appropriate security controls and audit logging for exports.
 */
interface ExportModalProps {
  show: boolean
  selectedCount: number
  onExportCSV: () => void
  onExportPDF: () => void
  onCancel: () => void
}

/**
 * Export Modal Component.
 *
 * Simple format selection dialog for student data export operations. Displays
 * the number of selected students and provides options for CSV (data analysis)
 * or PDF (printable reports) export formats.
 *
 * @component
 * @param {ExportModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null when not visible
 *
 * @example
 * ```tsx
 * import { ExportModal } from './modals/ExportModal';
 *
 * function StudentListWithExport() {
 *   const [showExportModal, setShowExportModal] = useState(false);
 *   const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
 *
 *   const handleExportCSV = async () => {
 *     const data = await studentsApi.exportStudents(selectedStudents, 'csv');
 *     downloadFile(data, 'students.csv');
 *     setShowExportModal(false);
 *   };
 *
 *   const handleExportPDF = async () => {
 *     const data = await studentsApi.exportStudents(selectedStudents, 'pdf');
 *     downloadFile(data, 'students.pdf');
 *     setShowExportModal(false);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => setShowExportModal(true)}>
 *         Export Selected ({selectedStudents.length})
 *       </button>
 *       <ExportModal
 *         show={showExportModal}
 *         selectedCount={selectedStudents.length}
 *         onExportCSV={handleExportCSV}
 *         onExportPDF={handleExportPDF}
 *         onCancel={() => setShowExportModal(false)}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Export Formats**:
 *
 * 1. **CSV (Comma-Separated Values)**:
 *    - Ideal for data analysis in Excel, Google Sheets
 *    - Easy import into other systems
 *    - Supports bulk data processing
 *    - Lightweight file format
 *
 * 2. **PDF (Portable Document Format)**:
 *    - Ideal for printable reports
 *    - Maintains formatting across devices
 *    - Suitable for physical records
 *    - Professional document appearance
 *
 * **FERPA Compliance**:
 * - All exported data is educational records under FERPA
 * - Exports should be audit logged with:
 *   - User performing export
 *   - Timestamp of export
 *   - Number and IDs of students exported
 *   - Export format selected
 *   - Reason/purpose for export
 * - Exported files must be stored securely
 * - Access to exported data should be restricted
 * - Consider encryption for exported files
 *
 * **Data Privacy Controls**:
 * - Export operations should require elevated permissions
 * - Consider implementing export approval workflow for large exports
 * - PHI (allergies, medications) should be excluded or require additional consent
 * - Limit exportable fields based on user role
 * - Implement download tracking and file lifecycle management
 *
 * **Use Cases**:
 * - **Reporting**: Export for school administration reports
 * - **Data Analysis**: Export to Excel for enrollment trends, demographics
 * - **Record Keeping**: PDF exports for physical filing
 * - **System Migration**: CSV export for moving data between systems
 * - **Parent Communication**: Generate printable student rosters
 *
 * **Security Considerations**:
 * - Verify user has permission to export student data
 * - Implement rate limiting to prevent bulk data extraction
 * - Log all export attempts (successful and failed)
 * - Consider requiring two-factor authentication for exports
 * - Automatically expire downloaded files after period
 *
 * **Accessibility**:
 * - Clear format options with descriptive labels
 * - Selected count displayed prominently
 * - Test IDs for automated testing
 * - Keyboard navigation support
 *
 * @see {@link Students} for student selection interface
 * @see {@link studentsApi.exportStudents} for export API
 */
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
