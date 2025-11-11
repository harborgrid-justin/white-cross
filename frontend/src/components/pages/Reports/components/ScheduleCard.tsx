import React from 'react';
import { 
  ChevronDown,
  ChevronRight,
  Pause,
  Play,
  RefreshCw,
  Edit,
  Eye,
  Trash2,
  Users,
  User
} from 'lucide-react';
import type { ReportSchedule, ScheduleStatus, ScheduleConfig } from '../types';

interface ScheduleCardProps {
  schedule: ReportSchedule;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onAction: (action: string, schedule: ReportSchedule) => void;
}

/**
 * Gets status badge styling
 */
const getStatusBadge = (status: ScheduleStatus) => {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
    stopped: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Stopped' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
    pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' }
  };

  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

/**
 * Gets frequency display text
 */
const getFrequencyText = (config: ScheduleConfig): string => {
  switch (config.frequency) {
    case 'once':
      return 'One time';
    case 'hourly':
      return 'Every hour';
    case 'daily':
      return `Daily at ${config.time}`;
    case 'weekly':
      return `Weekly on ${config.daysOfWeek?.join(', ') || 'weekdays'} at ${config.time}`;
    case 'monthly':
      return `Monthly on day ${config.dayOfMonth || 1} at ${config.time}`;
    case 'quarterly':
      return `Quarterly at ${config.time}`;
    case 'yearly':
      return `Yearly in ${config.month || 'January'} at ${config.time}`;
    default:
      return 'Custom';
  }
};

/**
 * Formats date string
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculates success rate
 */
const getSuccessRate = (schedule: ReportSchedule): number => {
  if (schedule.executionCount === 0) return 0;
  return Math.round((schedule.successCount / schedule.executionCount) * 100);
};

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  isExpanded,
  onToggleExpanded,
  onAction
}) => {
  const successRate = getSuccessRate(schedule);

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleExpanded}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label={isExpanded ? 'Collapse schedule details' : 'Expand schedule details'}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">{schedule.name}</h3>
                {getStatusBadge(schedule.status)}
              </div>
              <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Report: {schedule.reportName}</span>
                <span>•</span>
                <span>{getFrequencyText(schedule.config)}</span>
                <span>•</span>
                <span>{schedule.recipients.length} recipients</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Quick Stats */}
            <div className="text-right text-sm">
              <div className="text-gray-900 font-medium">
                {successRate}% success
              </div>
              <div className="text-gray-500">
                {schedule.executionCount} runs
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {schedule.status === 'active' && (
                <button
                  onClick={() => onAction('pause', schedule)}
                  className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                  title="Pause schedule"
                  aria-label="Pause schedule"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}
              
              {schedule.status === 'paused' && (
                <button
                  onClick={() => onAction('start', schedule)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                  title="Resume schedule"
                  aria-label="Resume schedule"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              
              {schedule.status === 'pending' && (
                <button
                  onClick={() => onAction('start', schedule)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                  title="Start schedule"
                  aria-label="Start schedule"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => onAction('run-now', schedule)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Run now"
                aria-label="Run schedule now"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onAction('edit', schedule)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                title="Edit schedule"
                aria-label="Edit schedule"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onAction('history', schedule)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                title="View history"
                aria-label="View execution history"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onAction('delete', schedule)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Delete schedule"
                aria-label="Delete schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="text-gray-900">{getFrequencyText(schedule.config)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Timezone:</span>
                    <span className="text-gray-900">{schedule.config.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Format:</span>
                    <span className="text-gray-900 uppercase">{schedule.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Include Charts:</span>
                    <span className="text-gray-900">{schedule.includeCharts ? 'Yes' : 'No'}</span>
                  </div>
                  {schedule.nextRun && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Run:</span>
                      <span className="text-gray-900">{formatDate(schedule.nextRun)}</span>
                    </div>
                  )}
                  {schedule.lastRun && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Run:</span>
                      <span className="text-gray-900">{formatDate(schedule.lastRun)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recipients ({schedule.recipients.length})</h4>
                <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                  {schedule.recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        {recipient.type === 'group' ? (
                          <Users className="w-3 h-3 text-gray-400" />
                        ) : (
                          <User className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <span className="text-gray-900 truncate">{recipient.name}</span>
                      <span className="text-gray-500 text-xs">({recipient.email})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {schedule.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {schedule.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
