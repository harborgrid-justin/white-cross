/**
 * WitnessStatementCard Component
 *
 * Card component for displaying a single witness statement with actions.
 * Supports expansion for long statements and verification status display.
 *
 * Features:
 * - Display witness name, role, and statement
 * - Verification status badge
 * - Timestamp formatting
 * - Expandable statement text
 * - Action buttons (View, Edit, Delete, Verify)
 * - Compact mode for dense layouts
 * - Responsive design
 */

import React, { useState } from 'react';
import { useWitnessStatements } from '@/hooks/domains/incidents';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/display/Badge';
import { Eye, Trash2, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import type { WitnessStatement, WitnessType } from '@/types/incidents';
import { formatDistanceToNow } from 'date-fns';

interface WitnessStatementCardProps {
  /** Witness statement to display */
  statement: WitnessStatement;
  /** Callback for viewing full details */
  onViewDetails?: () => void;
  /** Callback for deleting statement */
  onDelete?: () => void;
  /** Enable compact mode */
  compact?: boolean;
  /** Optional CSS class name */
  className?: string;
}

// Character limit for statement preview
const PREVIEW_LENGTH = 150;

// Witness type label mapping
const witnessTypeLabels: Record<WitnessType, string> = {
  STUDENT: 'Student',
  STAFF: 'Staff Member',
  PARENT: 'Parent/Guardian',
  OTHER: 'Other'
};

// Witness type badge variant mapping
const witnessTypeBadgeVariants: Record<WitnessType, 'primary' | 'secondary' | 'info' | 'default'> = {
  STUDENT: 'primary',
  STAFF: 'info',
  PARENT: 'secondary',
  OTHER: 'default'
};

/**
 * WitnessStatementCard component - Single witness statement display
 */
const WitnessStatementCard: React.FC<WitnessStatementCardProps> = ({
  statement,
  onViewDetails,
  onDelete,
  compact = false,
  className = ''
}) => {
  const { verifyStatement, unverifyStatement, operationLoading } = useWitnessStatements();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if statement is long and needs expansion
  const isLongStatement = statement.statement.length > PREVIEW_LENGTH;
  const displayStatement = !isExpanded && isLongStatement
    ? `${statement.statement.substring(0, PREVIEW_LENGTH)}...`
    : statement.statement;

  // Handle verification toggle
  const handleVerifyToggle = async () => {
    setIsVerifying(true);
    try {
      if (statement.verified) {
        await unverifyStatement(statement.id);
      } else {
        await verifyStatement(statement.id);
      }
    } catch (error) {
      console.error('Failed to toggle verification:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Format timestamp
  const formattedTime = statement.createdAt
    ? formatDistanceToNow(new Date(statement.createdAt), { addSuffix: true })
    : 'Unknown time';

  const formattedVerifiedTime = statement.verifiedAt
    ? formatDistanceToNow(new Date(statement.verifiedAt), { addSuffix: true })
    : null;

  if (compact) {
    // Compact card layout
    return (
      <div className={`witness-statement-card-compact px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {statement.witnessName}
              </span>
              <Badge variant={witnessTypeBadgeVariants[statement.witnessType]} size="sm">
                {witnessTypeLabels[statement.witnessType]}
              </Badge>
              {statement.verified && (
                <Badge variant="success" size="sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {statement.statement}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {formattedTime}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="xs"
              icon={<Eye className="h-3.5 w-3.5" />}
              onClick={onViewDetails}
              aria-label="View details"
            />
            <Button
              variant="ghost"
              size="xs"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={onDelete}
              aria-label="Delete statement"
              className="text-danger-600 hover:text-danger-700 dark:text-danger-400"
            />
          </div>
        </div>
      </div>
    );
  }

  // Full card layout
  return (
    <div className={`witness-statement-card bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {statement.witnessName}
              </h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={witnessTypeBadgeVariants[statement.witnessType]} size="sm">
                  {witnessTypeLabels[statement.witnessType]}
                </Badge>
                {statement.witnessContact && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {statement.witnessContact}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {statement.verified ? (
            <Badge variant="success" size="sm" className="flex-shrink-0">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="warning" size="sm" className="flex-shrink-0">
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Unverified
            </Badge>
          )}
        </div>

        {/* Statement Text */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {displayStatement}
          </p>
          {isLongStatement && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium mt-2 focus:outline-none focus:underline"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <span>Recorded {formattedTime}</span>
          {statement.verified && formattedVerifiedTime && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>Verified {formattedVerifiedTime}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            iconPosition="left"
            onClick={onViewDetails}
          >
            View Details
          </Button>

          <Button
            variant={statement.verified ? 'outline' : 'success'}
            size="sm"
            icon={statement.verified ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            iconPosition="left"
            onClick={handleVerifyToggle}
            loading={isVerifying}
            disabled={operationLoading.verify}
          >
            {statement.verified ? 'Unverify' : 'Verify'}
          </Button>

          <div className="flex-1" />

          <Button
            variant="outline"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={onDelete}
            className="text-danger-600 hover:text-danger-700 hover:border-danger-600 dark:text-danger-400"
            disabled={operationLoading.delete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

WitnessStatementCard.displayName = 'WitnessStatementCard';

export default WitnessStatementCard;
