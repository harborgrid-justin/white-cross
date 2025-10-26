/**
 * WitnessStatementsList Component
 *
 * Displays a list of witness statements for an incident report with full CRUD operations.
 * Integrates with WitnessStatementContext for state management and TanStack Query caching.
 *
 * Features:
 * - List all witness statements for an incident
 * - Add new witness button
 * - View, edit, delete actions per statement
 * - Verification status indicators
 * - Empty state handling
 * - Loading and error states
 * - Responsive design
 */

import React, { useEffect, useState } from 'react';
import { useWitnessStatements } from '@/hooks/domains/incidents';
import { Button } from '@/components/ui/buttons/Button';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Badge } from '@/components/ui/display/Badge';
import WitnessStatementCard from './WitnessStatementCard';
import AddWitnessDialog from './AddWitnessDialog';
import WitnessStatementDetails from './WitnessStatementDetails';
import { Plus, AlertCircle, Users } from 'lucide-react';
import type { WitnessStatement } from '@/types/incidents';

interface WitnessStatementsListProps {
  /** Incident report ID to load witness statements for */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
  /** Enable compact mode for smaller displays */
  compact?: boolean;
}

/**
 * WitnessStatementsList component - Comprehensive witness statement management
 */
const WitnessStatementsList: React.FC<WitnessStatementsListProps> = ({
  incidentId,
  className = '',
  compact = false
}) => {
  const {
    statements,
    isLoading,
    error,
    loadWitnessStatements,
    deleteWitnessStatement,
    operationLoading,
  } = useWitnessStatements();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Load witness statements on mount and when incidentId changes
  useEffect(() => {
    if (incidentId) {
      loadWitnessStatements(incidentId);
    }
  }, [incidentId, loadWitnessStatements]);

  // Handle view statement details
  const handleViewDetails = (statement: WitnessStatement) => {
    setSelectedStatementId(statement.id);
    setIsDetailsOpen(true);
  };

  // Handle close details modal
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedStatementId(null);
  };

  // Handle delete statement with confirmation
  const handleDelete = async (statementId: string) => {
    if (window.confirm('Are you sure you want to delete this witness statement? This action cannot be undone.')) {
      try {
        await deleteWitnessStatement(statementId);
      } catch (error) {
        console.error('Failed to delete witness statement:', error);
      }
    }
  };

  // Calculate verified count
  const verifiedCount = statements.filter(s => s.verified).length;

  // Render loading state
  if (isLoading) {
    return (
      <div className={`witness-statements-list ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <LoadingSpinner size="md" text="Loading witness statements..." />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`witness-statements-list ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-3 text-danger-600 dark:text-danger-400">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Error Loading Witness Statements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error.message || 'Failed to load witness statements. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (statements.length === 0) {
    return (
      <div className={`witness-statements-list ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Witnesses Recorded
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              There are no witness statements for this incident yet. Add the first witness statement to document what was observed.
            </p>
            <Button
              variant="primary"
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
              onClick={() => setIsAddDialogOpen(true)}
              disabled={operationLoading.create}
            >
              Add First Witness
            </Button>
          </div>
        </div>

        {/* Add Witness Dialog */}
        <AddWitnessDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          incidentId={incidentId}
        />
      </div>
    );
  }

  // Render witness statements list
  return (
    <div className={`witness-statements-list ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Witness Statements
              </h3>
              <Badge variant="default" size="sm">
                {statements.length} {statements.length === 1 ? 'Witness' : 'Witnesses'}
              </Badge>
              {verifiedCount > 0 && (
                <Badge variant="success" size="sm">
                  {verifiedCount} Verified
                </Badge>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
              onClick={() => setIsAddDialogOpen(true)}
              disabled={operationLoading.create}
              loading={operationLoading.create}
            >
              Add Witness
            </Button>
          </div>
        </div>

        {/* Statements List */}
        <div className={compact ? 'divide-y divide-gray-200 dark:divide-gray-700' : 'p-4 space-y-4'}>
          {statements.map((statement) => (
            <WitnessStatementCard
              key={statement.id}
              statement={statement}
              onViewDetails={() => handleViewDetails(statement)}
              onDelete={() => handleDelete(statement.id)}
              compact={compact}
            />
          ))}
        </div>
      </div>

      {/* Add Witness Dialog */}
      <AddWitnessDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        incidentId={incidentId}
      />

      {/* Witness Statement Details Modal */}
      {selectedStatementId && (
        <WitnessStatementDetails
          statementId={selectedStatementId}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

WitnessStatementsList.displayName = 'WitnessStatementsList';

export default WitnessStatementsList;
