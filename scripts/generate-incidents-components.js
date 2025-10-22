/**
 * Script to generate all incident report component files
 * Run with: node scripts/generate-incidents-components.js
 */

const fs = require('fs');
const path = require('path');

const components = [
  // Core List and Display Components
  'IncidentReportsList',
  'IncidentReportCard',
  'IncidentReportTable',
  'IncidentReportGrid',
  'IncidentReportDetails',
  'IncidentReportSummary',
  
  // Form Components
  'IncidentReportForm',
  'CreateIncidentForm',
  'EditIncidentForm',
  'QuickIncidentForm',
  
  // Witness Statement Components
  'WitnessStatementsList',
  'WitnessStatementCard',
  'WitnessStatementForm',
  'AddWitnessDialog',
  'WitnessStatementDetails',
  
  // Follow-up Action Components
  'FollowUpActionsList',
  'FollowUpActionCard',
  'FollowUpActionForm',
  'AddFollowUpDialog',
  'FollowUpActionDetails',
  'ActionStatusTracker',
  
  // Search and Filter Components
  'IncidentSearch',
  'IncidentFilters',
  'AdvancedFilters',
  'TypeFilter',
  'SeverityFilter',
  'StatusFilter',
  'DateRangeFilter',
  'StudentFilter',
  
  // Dashboard and Analytics Components
  'IncidentsDashboard',
  'IncidentStatistics',
  'IncidentMetrics',
  'SeverityChart',
  'TypeDistribution',
  'TrendAnalysis',
  'CriticalIncidentsWidget',
  'RecentIncidentsWidget',
  
  // Status and Badge Components
  'SeverityBadge',
  'StatusBadge',
  'TypeBadge',
  'PriorityIndicator',
  
  // Timeline and History Components
  'IncidentTimeline',
  'IncidentHistory',
  'ActivityLog',
  'ChangeHistory',
  
  // Notification Components
  'ParentNotificationPanel',
  'NotificationStatus',
  'SendNotificationDialog',
  'NotificationHistory',
  
  // Document and Export Components
  'IncidentDocuments',
  'DocumentViewer',
  'PrintIncidentReport',
  'ExportIncidentData',
  'IncidentPDF',
  
  // Assignment and Workflow Components
  'AssignIncidentDialog',
  'WorkflowStatus',
  'ApprovalWorkflow',
  'EscalationPanel',
  
  // Notes and Comments Components
  'IncidentNotes',
  'NotesEditor',
  'CommentsList',
  'AddCommentDialog',
  
  // Validation and Error Components
  'IncidentValidation',
  'ValidationResults',
  'ErrorSummary',
  'WarningsList',
  
  // Layout and Navigation Components
  'IncidentsLayout',
  'IncidentsSidebar',
  'IncidentsHeader',
  'IncidentTabs',
  'IncidentBreadcrumbs',
  
  // Utility Components
  'LoadingSpinner',
  'EmptyState',
  'ErrorBoundary',
  'ConfirmationDialog',
  'DeleteConfirmDialog',
];

const componentDir = path.join(__dirname, '../frontend/src/pages/incidents/components');

// Ensure directory exists
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

components.forEach(componentName => {
  const filePath = path.join(componentDir, `${componentName}.tsx`);
  
  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${componentName}.tsx (already exists)`);
    return;
  }

  const content = `/**
 * ${componentName} Component
 * 
 * ${componentName.replace(/([A-Z])/g, ' $1').trim()} component for incident report management.
 */

import React from 'react';

interface ${componentName}Props {
  /** Component props */
  [key: string]: any;
}

/**
 * ${componentName} component for incident reporting system
 */
const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)}">
      <h3>${componentName.replace(/([A-Z])/g, ' $1').trim()}</h3>
      {/* Component implementation */}
    </div>
  );
};

export default ${componentName};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${componentName}.tsx`);
});

console.log(`\nGenerated ${components.length} incident component files successfully!`);
