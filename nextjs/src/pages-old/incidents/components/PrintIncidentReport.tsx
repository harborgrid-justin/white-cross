/**
 * PrintIncidentReport Component
 *
 * Production-grade print-optimized incident report with proper formatting
 * Includes all incident details, witnesses, follow-ups, and evidence with print media queries
 *
 * @module pages/incidents/components/PrintIncidentReport
 */

import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import type { IncidentReport, FollowUpAction, WitnessStatement } from '@/types/incidents';
import {
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
  getIncidentSeverityColor,
} from '@/types/incidents';

// =====================
// TYPES
// =====================

interface PrintIncidentReportProps {
  incident: IncidentReport;
  onClose?: () => void;
  autoTriggerPrint?: boolean;
  schoolInfo?: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
  };
}

// =====================
// COMPONENT
// =====================

/**
 * PrintIncidentReport - Print-optimized incident report
 *
 * Provides a print-friendly layout with all incident details formatted for paper output.
 * Includes school branding, incident number, and comprehensive details with proper page breaks.
 */
const PrintIncidentReport: React.FC<PrintIncidentReportProps> = ({
  incident,
  onClose,
  autoTriggerPrint = false,
  schoolInfo = {
    name: 'White Cross Healthcare',
    address: '123 School Street, City, State 12345',
    phone: '(555) 123-4567',
  },
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);

  // =====================
  // EFFECTS
  // =====================

  React.useEffect(() => {
    if (autoTriggerPrint) {
      handlePrint();
    }
  }, [autoTriggerPrint]);

  // =====================
  // HANDLERS
  // =====================

  const handlePrint = () => {
    window.print();
  };

  // =====================
  // RENDER HELPERS
  // =====================

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // =====================
  // RENDER
  // =====================

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide everything except print content */
          body * {
            visibility: hidden;
          }

          #print-container, #print-container * {
            visibility: visible;
          }

          #print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Hide controls when printing */
          .no-print {
            display: none !important;
          }

          /* Page setup */
          @page {
            size: letter;
            margin: 0.75in;
          }

          /* Prevent page breaks inside elements */
          .print-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Force page breaks */
          .page-break {
            page-break-before: always;
            break-before: always;
          }

          /* Header on each page */
          .print-header {
            position: running(header);
          }

          /* Footer on each page */
          .print-footer {
            position: running(footer);
          }

          /* Typography for print */
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
          }

          h1 {
            font-size: 18pt;
            margin-bottom: 0.5em;
          }

          h2 {
            font-size: 14pt;
            margin-top: 1em;
            margin-bottom: 0.5em;
            border-bottom: 1px solid #000;
            padding-bottom: 0.25em;
          }

          h3 {
            font-size: 12pt;
            margin-top: 0.75em;
            margin-bottom: 0.5em;
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.5em 0;
          }

          table th,
          table td {
            border: 1px solid #000;
            padding: 0.5em;
            text-align: left;
          }

          table th {
            background-color: #f0f0f0;
            font-weight: bold;
          }

          /* Watermark for confidential */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72pt;
            color: rgba(0, 0, 0, 0.05);
            z-index: -1;
            white-space: nowrap;
          }
        }

        @media screen {
          /* Screen-only styles */
          #print-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>

      {/* Modal Overlay (screen only) */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 no-print">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Print Incident Report
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Content Preview */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="bg-white shadow-lg" id="print-container" ref={printContainerRef}>
              {/* Watermark */}
              <div className="watermark">CONFIDENTIAL</div>

              {/* Header */}
              <header className="print-section mb-8">
                <div className="flex items-start justify-between mb-6">
                  {schoolInfo.logo ? (
                    <img
                      src={schoolInfo.logo}
                      alt={schoolInfo.name}
                      className="h-16 w-auto"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      {schoolInfo.name}
                    </div>
                  )}
                  <div className="text-right text-sm">
                    {schoolInfo.address && <p>{schoolInfo.address}</p>}
                    {schoolInfo.phone && <p>{schoolInfo.phone}</p>}
                  </div>
                </div>

                <div className="border-t-2 border-gray-900 pt-4">
                  <h1 className="text-center font-bold uppercase">
                    Student Incident Report
                  </h1>
                  <p className="text-center text-sm mb-4">
                    Report Number: <strong>{incident.id}</strong>
                  </p>
                </div>
              </header>

              {/* Incident Classification */}
              <section className="print-section mb-6">
                <h2>Incident Classification</h2>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Type</th>
                      <td>{getIncidentTypeLabel(incident.type)}</td>
                    </tr>
                    <tr>
                      <th>Severity</th>
                      <td>{getIncidentSeverityLabel(incident.severity)}</td>
                    </tr>
                    <tr>
                      <th>Occurred At</th>
                      <td>{formatDateTime(incident.occurredAt)}</td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td>{incident.location}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Student Information */}
              <section className="print-section mb-6">
                <h2>Student Information</h2>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Student ID</th>
                      <td>{incident.studentId}</td>
                    </tr>
                    {incident.student && (
                      <>
                        <tr>
                          <th>Student Name</th>
                          <td>{incident.student.firstName} {incident.student.lastName}</td>
                        </tr>
                        <tr>
                          <th>Grade</th>
                          <td>{incident.student.gradeLevel}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </section>

              {/* Incident Description */}
              <section className="print-section mb-6">
                <h2>Incident Description</h2>
                <div className="border border-gray-300 p-4 whitespace-pre-wrap">
                  {incident.description}
                </div>
              </section>

              {/* Actions Taken */}
              <section className="print-section mb-6">
                <h2>Actions Taken</h2>
                <div className="border border-gray-300 p-4 whitespace-pre-wrap">
                  {incident.actionsTaken}
                </div>
              </section>

              {/* Witnesses */}
              {incident.witnessStatements && incident.witnessStatements.length > 0 && (
                <section className="print-section mb-6">
                  <h2>Witness Statements</h2>
                  {incident.witnessStatements.map((witness, index) => (
                    <div key={witness.id} className="mb-4 border border-gray-300 p-4">
                      <h3>Witness {index + 1}: {witness.witnessName}</h3>
                      <p><strong>Type:</strong> {witness.witnessType}</p>
                      {witness.witnessContact && (
                        <p><strong>Contact:</strong> {witness.witnessContact}</p>
                      )}
                      <p className="mt-2 whitespace-pre-wrap">{witness.statement}</p>
                      {witness.verified && (
                        <p className="mt-2 text-sm">
                          <strong>Verified:</strong> Yes (on {formatDate(witness.verifiedAt)})
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Parent Notification */}
              <section className="print-section mb-6">
                <h2>Parent/Guardian Notification</h2>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Parent Notified</th>
                      <td>{incident.parentNotified ? 'Yes' : 'No'}</td>
                    </tr>
                    {incident.parentNotified && (
                      <>
                        <tr>
                          <th>Notification Method</th>
                          <td>{incident.parentNotificationMethod || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Notified At</th>
                          <td>{formatDateTime(incident.parentNotifiedAt)}</td>
                        </tr>
                        <tr>
                          <th>Notified By</th>
                          <td>{incident.parentNotifiedBy || 'N/A'}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </section>

              {/* Follow-Up Actions */}
              {incident.followUpActions && incident.followUpActions.length > 0 && (
                <section className="print-section mb-6 page-break">
                  <h2>Follow-Up Actions</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incident.followUpActions.map((action) => (
                        <tr key={action.id}>
                          <td>{action.action}</td>
                          <td>{action.priority}</td>
                          <td>{formatDate(action.dueDate)}</td>
                          <td>{action.status}</td>
                          <td>{action.assignedTo || 'Unassigned'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {/* Evidence */}
              {((incident.attachments && incident.attachments.length > 0) ||
                (incident.evidencePhotos && incident.evidencePhotos.length > 0) ||
                (incident.evidenceVideos && incident.evidenceVideos.length > 0)) && (
                <section className="print-section mb-6">
                  <h2>Evidence Attachments</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incident.attachments && incident.attachments.length > 0 && (
                        <tr>
                          <td>Documents</td>
                          <td>{incident.attachments.length}</td>
                        </tr>
                      )}
                      {incident.evidencePhotos && incident.evidencePhotos.length > 0 && (
                        <tr>
                          <td>Photos</td>
                          <td>{incident.evidencePhotos.length}</td>
                        </tr>
                      )}
                      {incident.evidenceVideos && incident.evidenceVideos.length > 0 && (
                        <tr>
                          <td>Videos</td>
                          <td>{incident.evidenceVideos.length}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <p className="text-sm mt-2">
                    Note: Evidence files are stored digitally and available upon request.
                  </p>
                </section>
              )}

              {/* Insurance and Compliance */}
              <section className="print-section mb-6">
                <h2>Insurance & Compliance</h2>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Insurance Claim Number</th>
                      <td>{incident.insuranceClaimNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Insurance Claim Status</th>
                      <td>{incident.insuranceClaimStatus || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Legal Compliance Status</th>
                      <td>{incident.legalComplianceStatus || 'Pending'}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Report Information */}
              <section className="print-section mb-6">
                <h2>Report Information</h2>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Reported By</th>
                      <td>
                        {incident.reportedBy
                          ? `${incident.reportedBy.firstName} ${incident.reportedBy.lastName}`
                          : incident.reportedById
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Report Created</th>
                      <td>{formatDateTime(incident.createdAt)}</td>
                    </tr>
                    <tr>
                      <th>Last Updated</th>
                      <td>{formatDateTime(incident.updatedAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Footer */}
              <footer className="print-section mt-12 pt-6 border-t border-gray-300">
                <div className="text-sm text-center">
                  <p className="font-bold mb-2">CONFIDENTIAL DOCUMENT</p>
                  <p>
                    This incident report contains protected health information (PHI) and is subject to
                    HIPAA and FERPA privacy regulations. Unauthorized disclosure is prohibited.
                  </p>
                  <p className="mt-4">
                    Generated on {formatDateTime(new Date().toISOString())}
                  </p>
                  <p className="mt-2">Page 1 of 1</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintIncidentReport;
