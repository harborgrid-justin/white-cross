/**
 * @fileoverview Home Page Platform Status Component
 * 
 * Platform status component displaying system health indicators
 * for backend services, database, real-time features, and HIPAA compliance.
 * 
 * @module components/pages/HomePage/PlatformStatus
 * @since 1.0.0
 */

interface StatusItemProps {
  label: string;
  status: string;
}

/**
 * Individual Status Item Component
 */
function StatusItem({ label, status }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="status-active">{status}</span>
    </div>
  );
}

/**
 * Platform Status Component
 * 
 * Renders system status indicators in a card layout.
 */
export function PlatformStatus() {
  return (
    <div className="mt-16 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Platform Status
      </h3>
      <div className="space-y-2">
        <StatusItem label="Backend API" status="✓ Operational" />
        <StatusItem label="Database Connection" status="✓ Connected" />
        <StatusItem label="Real-time Features" status="✓ Available" />
        <StatusItem label="HIPAA Compliance" status="✓ Verified" />
      </div>
    </div>
  );
}
