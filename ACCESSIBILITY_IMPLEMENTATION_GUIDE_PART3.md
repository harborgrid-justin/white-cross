# Accessibility & HIPAA Compliance UI Implementation Guide - Part 3

**Final section covering features 8-15, testing strategies, and component library**

---

## Feature 8: Immunization Dashboard

**Priority:** HIGH - Clinical Operations
**WCAG Level:** AA
**Special Considerations:** Data visualization accessibility, compliance tracking

### Implementation Summary

```typescript
// /src/pages/immunizations/ImmunizationDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ImmunizationStats {
  compliant: number;
  overdue: number;
  upcomingDue: number;
  exempt: number;
  total: number;
}

export const ImmunizationDashboard: React.FC = () => {
  const [stats, setStats] = useState<ImmunizationStats | null>(null);
  const [complianceByGrade, setComplianceByGrade] = useState<any[]>([]);

  // Accessible chart announcement
  const announceChartData = (stats: ImmunizationStats) => {
    const complianceRate = ((stats.compliant / stats.total) * 100).toFixed(0);
    ariaAnnouncer.announce(
      `Immunization compliance rate: ${complianceRate}%. ${stats.compliant} students compliant, ${stats.overdue} overdue, ${stats.upcomingDue} upcoming`
    );
  };

  return (
    <div className="immunization-dashboard" role="region" aria-labelledby="immun-title">
      <h1 id="immun-title">Immunization Compliance Dashboard</h1>

      {/* Summary cards with accessible labels */}
      <section aria-labelledby="summary-heading" className="summary-section">
        <h2 id="summary-heading" className="sr-only">Immunization Summary Statistics</h2>

        <div className="summary-grid">
          <article className="stat-card stat-card--success" aria-labelledby="compliant-count">
            <CheckCircle aria-hidden="true" />
            <div>
              <h3 id="compliant-count" className="stat-value">{stats?.compliant || 0}</h3>
              <p className="stat-label">Compliant</p>
            </div>
          </article>

          <article className="stat-card stat-card--danger" aria-labelledby="overdue-count">
            <AlertTriangle aria-hidden="true" />
            <div>
              <h3 id="overdue-count" className="stat-value">{stats?.overdue || 0}</h3>
              <p className="stat-label">Overdue</p>
            </div>
          </article>

          <article className="stat-card stat-card--warning" aria-labelledby="upcoming-count">
            <Calendar aria-hidden="true" />
            <div>
              <h3 id="upcoming-count" className="stat-value">{stats?.upcomingDue || 0}</h3>
              <p className="stat-label">Upcoming</p>
            </div>
          </article>

          <article className="stat-card stat-card--info" aria-labelledby="exempt-count">
            <Shield aria-hidden="true" />
            <div>
              <h3 id="exempt-count" className="stat-value">{stats?.exempt || 0}</h3>
              <p className="stat-label">Exempt</p>
            </div>
          </article>
        </div>
      </section>

      {/* Charts with accessibility features */}
      <section aria-labelledby="charts-heading" className="charts-section">
        <h2 id="charts-heading">Compliance Visualization</h2>

        {/* Chart with alt text */}
        <div
          className="chart-container"
          role="img"
          aria-label={`Immunization compliance by grade. ${complianceByGrade.map(d => `Grade ${d.grade}: ${d.compliant} compliant, ${d.overdue} overdue`).join('. ')}`}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={complianceByGrade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" label={{ value: 'Grade Level', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Students', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="compliant" fill="#047857" name="Compliant" />
              <Bar dataKey="overdue" fill="#DC2626" name="Overdue" />
              <Bar dataKey="upcoming" fill="#F59E0B" name="Upcoming" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accessible data table alternative */}
        <details className="data-table-toggle">
          <summary>View as Data Table</summary>
          <table role="table" aria-label="Immunization compliance by grade">
            <thead>
              <tr>
                <th scope="col">Grade</th>
                <th scope="col">Compliant</th>
                <th scope="col">Overdue</th>
                <th scope="col">Upcoming</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {complianceByGrade.map((grade) => (
                <tr key={grade.grade}>
                  <th scope="row">{grade.grade}</th>
                  <td>{grade.compliant}</td>
                  <td>{grade.overdue}</td>
                  <td>{grade.upcoming}</td>
                  <td>{grade.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      {/* Overdue students list */}
      <section aria-labelledby="overdue-heading" className="overdue-section">
        <h2 id="overdue-heading">
          Students with Overdue Immunizations
          <span className="count-badge" role="status">{stats?.overdue || 0}</span>
        </h2>

        {/* Sortable, filterable table with keyboard navigation */}
        <OverdueImmunizationsTable />
      </section>
    </div>
  );
};
```

**Key Accessibility Features:**
- ARIA labels for all statistics
- Charts include text alternatives via `aria-label`
- Data tables provided as accessible alternative
- Keyboard navigation through overdue list
- Screen reader announcements for data updates

---

## Feature 9: Medicaid Billing

**Priority:** CRITICAL - Revenue
**WCAG Level:** AA
**Special Considerations:** Multi-step form wizard accessibility

### Implementation Summary

```typescript
// /src/pages/billing/MedicaidBilling.tsx
import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isValid: (data: any) => boolean;
}

export const MedicaidBillingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: WizardStep[] = [
    {
      id: 'eligibility',
      title: 'Verify Eligibility',
      description: 'Check patient Medicaid eligibility',
      component: EligibilityStep,
      isValid: (data) => !!data.medicaidId && data.eligibilityVerified,
    },
    {
      id: 'services',
      title: 'Document Services',
      description: 'Record services provided',
      component: ServicesStep,
      isValid: (data) => data.services?.length > 0,
    },
    {
      id: 'documentation',
      title: 'Attach Documentation',
      description: 'Upload required documents',
      component: DocumentationStep,
      isValid: (data) => data.documents?.length >= data.requiredDocCount,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review claim details',
      component: ReviewStep,
      isValid: () => true,
    },
  ];

  const handleNext = () => {
    if (steps[currentStep].isValid(formData)) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      ariaAnnouncer.announce(`Moved to step ${currentStep + 2} of ${steps.length}: ${steps[currentStep + 1].title}`);
    } else {
      ariaAnnouncer.announceUrgent('Please complete all required fields before continuing');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    ariaAnnouncer.announce(`Returned to step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].title}`);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="medicaid-billing-wizard" role="region" aria-labelledby="wizard-title">
      <header className="wizard-header">
        <h1 id="wizard-title">Medicaid Billing Claim</h1>
      </header>

      {/* Step indicator with ARIA */}
      <nav aria-label="Billing wizard progress" className="step-indicator">
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`step-item ${index === currentStep ? 'step-item--current' : ''} ${completedSteps.has(index) ? 'step-item--completed' : ''}`}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              <button
                onClick={() => {
                  if (completedSteps.has(index) || index < currentStep) {
                    setCurrentStep(index);
                  }
                }}
                disabled={index > currentStep && !completedSteps.has(index - 1)}
                aria-label={`${step.title}. Step ${index + 1} of ${steps.length}. ${completedSteps.has(index) ? 'Completed' : index === currentStep ? 'Current' : 'Not started'}`}
                className="step-button"
              >
                <span className="step-number" aria-hidden="true">
                  {completedSteps.has(index) ? <Check /> : index + 1}
                </span>
                <span className="step-label">{step.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Current step content */}
      <div
        className="wizard-content"
        role="region"
        aria-labelledby="current-step-title"
        aria-live="polite"
      >
        <h2 id="current-step-title" className="step-title">
          {steps[currentStep].title}
        </h2>
        <p className="step-description">{steps[currentStep].description}</p>

        <CurrentStepComponent
          data={formData}
          onChange={setFormData}
        />
      </div>

      {/* Navigation controls */}
      <footer className="wizard-footer">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="btn-secondary"
          aria-label="Go to previous step"
        >
          <ChevronLeft aria-hidden="true" />
          Back
        </button>

        <div role="status" aria-live="polite" className="step-counter">
          Step {currentStep + 1} of {steps.length}
        </div>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="btn-primary"
            aria-label="Go to next step"
          >
            Next
            <ChevronRight aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn-primary"
            aria-label="Submit claim"
          >
            Submit Claim
          </button>
        )}
      </footer>
    </div>
  );
};
```

**Key Accessibility Features:**
- ARIA `step` indicator with `aria-current`
- Progress announced via live regions
- Keyboard navigation between completed steps
- Form validation before progression
- Clear step completion indicators

---

## Feature 10-15: Rapid Implementation Templates

For brevity, here are the key accessibility patterns for the remaining features:

### Feature 10: PDF Reports

```typescript
// Accessible PDF export with table of contents
export async function generateAccessiblePDF(data: ReportData) {
  const pdf = new jsPDF();

  // Set document metadata for screen readers
  pdf.setProperties({
    title: data.title,
    subject: data.description,
    author: 'White Cross Healthcare',
    keywords: data.tags.join(', '),
    creator: 'White Cross Platform',
  });

  // Add table of contents with bookmarks
  pdf.outline.add(null, 'Table of Contents', { pageNumber: 1 });

  // Ensure proper reading order with tags
  data.sections.forEach((section, index) => {
    pdf.outline.add(null, section.title, { pageNumber: index + 2 });
    // Add section content with semantic structure
  });

  // Announce completion
  ariaAnnouncer.announce('PDF report generated successfully and ready for download');

  return pdf;
}
```

### Feature 11: Immunization UI

```typescript
// Accessible immunization record form
<form aria-labelledby="immunization-form-title">
  <h2 id="immunization-form-title">Record Immunization</h2>

  <fieldset>
    <legend>Vaccine Information</legend>

    <div className="form-field">
      <label htmlFor="vaccine-type">Vaccine Type <span aria-label="required">*</span></label>
      <select
        id="vaccine-type"
        required
        aria-required="true"
        aria-describedby="vaccine-type-help"
      >
        <option value="">Select vaccine...</option>
        <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
        <option value="DTaP">DTaP (Diphtheria, Tetanus, Pertussis)</option>
        <option value="IPV">IPV (Polio)</option>
        {/* ... */}
      </select>
      <span id="vaccine-type-help" className="help-text">
        Select from state-required vaccines
      </span>
    </div>

    <div className="form-field">
      <label htmlFor="lot-number">Lot Number</label>
      <input
        id="lot-number"
        type="text"
        required
        aria-required="true"
        pattern="[A-Z0-9-]+"
        aria-describedby="lot-number-format"
      />
      <span id="lot-number-format" className="help-text">
        Format: Capital letters and numbers only
      </span>
    </div>

    <div className="form-field">
      <label htmlFor="admin-date">Administration Date</label>
      <input
        id="admin-date"
        type="date"
        required
        aria-required="true"
        max={new Date().toISOString().split('T')[0]}
        aria-describedby="admin-date-help"
      />
      <span id="admin-date-help" className="help-text">
        Cannot be future date
      </span>
    </div>
  </fieldset>

  <fieldset>
    <legend>Administration Site</legend>

    <div role="radiogroup" aria-labelledby="site-label">
      <span id="site-label" className="field-label">Injection Site</span>
      <label>
        <input type="radio" name="site" value="left-arm" required />
        Left Arm
      </label>
      <label>
        <input type="radio" name="site" value="right-arm" />
        Right Arm
      </label>
      <label>
        <input type="radio" name="site" value="left-thigh" />
        Left Thigh
      </label>
      <label>
        <input type="radio" name="site" value="right-thigh" />
        Right Thigh
      </label>
    </div>
  </fieldset>
</form>
```

### Feature 12: Secure Document Sharing

```typescript
// Accessible file upload with drag-and-drop
export const AccessibleFileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    ariaAnnouncer.announce(`${files.length} file${files.length === 1 ? '' : 's'} selected for upload`);
    // Process files...
  };

  return (
    <div
      className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      role="region"
      aria-labelledby="upload-title"
    >
      <h3 id="upload-title">Upload Documents</h3>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        id="file-input"
        className="sr-only"
        aria-describedby="file-instructions"
      />

      <label htmlFor="file-input" className="upload-label">
        <Upload aria-hidden="true" />
        <span>Choose files or drag and drop</span>
      </label>

      <p id="file-instructions" className="upload-instructions">
        Accepted formats: PDF, DOCX, JPG, PNG (max 10MB each)
      </p>

      {/* Live region for upload progress */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {uploadProgress > 0 && `Upload ${uploadProgress}% complete`}
      </div>
    </div>
  );
};
```

### Feature 13: State Registry Integration

```typescript
// Accessible status dashboard
<section aria-labelledby="registry-status-title" className="registry-status">
  <h2 id="registry-status-title">State Registry Connection Status</h2>

  <dl className="status-list">
    <div className="status-item">
      <dt>Connection Status</dt>
      <dd>
        <span
          className={`status-indicator status-${connectionStatus}`}
          role="status"
          aria-label={`Connection status: ${connectionStatus}`}
        >
          {connectionStatus === 'connected' ? '●' : '○'}
        </span>
        {connectionStatus}
      </dd>
    </div>

    <div className="status-item">
      <dt>Last Sync</dt>
      <dd>
        <time dateTime={lastSync.toISOString()}>
          {lastSync.toLocaleString()}
        </time>
      </dd>
    </div>

    <div className="status-item">
      <dt>Records Synced</dt>
      <dd>{recordsSynced} of {totalRecords}</dd>
    </div>
  </dl>

  <button
    onClick={syncNow}
    disabled={isSyncing}
    aria-describedby="sync-help"
    className="btn-primary"
  >
    {isSyncing ? 'Syncing...' : 'Sync Now'}
  </button>

  <p id="sync-help" className="help-text">
    Manual sync will update all immunization records with the state registry
  </p>

  {/* Sync progress */}
  {isSyncing && (
    <div role="progressbar" aria-valuenow={syncProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Sync progress">
      <div className="progress-bar" style={{ width: `${syncProgress}%` }} />
      <span className="sr-only">{syncProgress}% complete</span>
    </div>
  )}
</section>
```

### Feature 14: Export Scheduling

```typescript
// Accessible scheduling interface
<form onSubmit={handleScheduleExport}>
  <fieldset>
    <legend>Schedule Automated Export</legend>

    <div className="form-field">
      <label htmlFor="export-frequency">Frequency</label>
      <select id="export-frequency" required aria-required="true">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>

    <div className="form-field">
      <label htmlFor="export-time">Time of Day</label>
      <input
        id="export-time"
        type="time"
        required
        aria-required="true"
        aria-describedby="time-help"
      />
      <span id="time-help" className="help-text">
        Exports will run in your local timezone
      </span>
    </div>

    <div className="form-field">
      <label htmlFor="export-format">Export Format</label>
      <select id="export-format" required aria-required="true">
        <option value="csv">CSV (Comma-Separated)</option>
        <option value="xlsx">Excel (XLSX)</option>
        <option value="pdf">PDF</option>
      </select>
    </div>

    <fieldset>
      <legend>Email Notifications</legend>

      <div className="checkbox-field">
        <input
          id="notify-on-success"
          type="checkbox"
          checked={notifyOnSuccess}
          onChange={(e) => setNotifyOnSuccess(e.target.checked)}
        />
        <label htmlFor="notify-on-success">
          Notify on successful export
        </label>
      </div>

      <div className="checkbox-field">
        <input
          id="notify-on-failure"
          type="checkbox"
          checked={notifyOnFailure}
          onChange={(e) => setNotifyOnFailure(e.target.checked)}
        />
        <label htmlFor="notify-on-failure">
          Notify on export failure
        </label>
      </div>
    </fieldset>
  </fieldset>

  <button type="submit" className="btn-primary">
    Schedule Export
  </button>
</form>
```

### Feature 15: SIS Integration

```typescript
// Accessible configuration interface
<div className="sis-integration-config" role="region" aria-labelledby="sis-config-title">
  <h2 id="sis-config-title">Student Information System Integration</h2>

  {/* Connection test with live feedback */}
  <section aria-labelledby="connection-heading" className="connection-section">
    <h3 id="connection-heading">Connection Configuration</h3>

    <div className="form-field">
      <label htmlFor="sis-url">SIS API URL</label>
      <input
        id="sis-url"
        type="url"
        value={sisUrl}
        onChange={(e) => setSisUrl(e.target.value)}
        required
        aria-required="true"
        aria-describedby="url-help"
      />
      <span id="url-help" className="help-text">
        Example: https://sis.school.edu/api/v1
      </span>
    </div>

    <button
      onClick={testConnection}
      disabled={isTesting}
      aria-describedby="test-status"
      className="btn-secondary"
    >
      {isTesting ? 'Testing...' : 'Test Connection'}
    </button>

    {/* Connection status live region */}
    <div
      id="test-status"
      role="status"
      aria-live="polite"
      className={`connection-status connection-status--${connectionResult}`}
    >
      {connectionResult === 'success' && '✓ Connection successful'}
      {connectionResult === 'error' && '✗ Connection failed. Please check credentials.'}
      {connectionResult === 'testing' && 'Testing connection...'}
    </div>
  </section>

  {/* Sync settings */}
  <section aria-labelledby="sync-settings-heading" className="sync-settings">
    <h3 id="sync-settings-heading">Sync Settings</h3>

    <fieldset>
      <legend>Data to Sync</legend>

      {[
        { id: 'students', label: 'Student Demographics' },
        { id: 'enrollment', label: 'Enrollment Status' },
        { id: 'contacts', label: 'Emergency Contacts' },
        { id: 'attendance', label: 'Attendance Records' },
      ].map((option) => (
        <div key={option.id} className="checkbox-field">
          <input
            id={`sync-${option.id}`}
            type="checkbox"
            checked={syncOptions[option.id]}
            onChange={(e) => setSyncOptions({
              ...syncOptions,
              [option.id]: e.target.checked
            })}
          />
          <label htmlFor={`sync-${option.id}`}>
            {option.label}
          </label>
        </div>
      ))}
    </fieldset>

    <div className="form-field">
      <label htmlFor="sync-frequency">Sync Frequency</label>
      <select
        id="sync-frequency"
        value={syncFrequency}
        onChange={(e) => setSyncFrequency(e.target.value)}
      >
        <option value="realtime">Real-time (WebSocket)</option>
        <option value="hourly">Every Hour</option>
        <option value="daily">Once Daily</option>
        <option value="manual">Manual Only</option>
      </select>
    </div>
  </section>

  <button
    onClick={saveConfiguration}
    className="btn-primary"
    aria-describedby="save-status"
  >
    Save Configuration
  </button>

  <div id="save-status" role="status" aria-live="polite" className="sr-only">
    {saveStatus}
  </div>
</div>
```

---

## Testing & Validation

### Automated Testing

```typescript
// /tests/accessibility/a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('PHI Disclosure Tracking has no violations', async () => {
    const { container } = render(<PHIDisclosureTracking />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Drug Interaction Checker meets AAA contrast', async () => {
    const { container } = render(<DrugInteractionChecker />);
    const results = await axe(container, {
      rules: {
        'color-contrast-enhanced': { enabled: true }, // AAA level
      },
    });
    expect(results).toHaveNoViolations();
  });

  test('Real-Time Alerts use assertive live regions', () => {
    const { container } = render(<RealTimeAlertSystem />);
    const assertiveRegion = container.querySelector('[aria-live="assertive"]');
    expect(assertiveRegion).toBeInTheDocument();
  });

  test('Clinic Visit Tracking has proper form labels', () => {
    const { getByLabelText } = render(<ClinicVisitTracking />);
    expect(getByLabelText(/student/i)).toBeInTheDocument();
    expect(getByLabelText(/reason for visit/i)).toBeInTheDocument();
    expect(getByLabelText(/treatment provided/i)).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

```markdown
## Keyboard Navigation Testing

### PHI Disclosure Tracking
- [ ] Tab through all interactive elements in logical order
- [ ] Arrow keys navigate through table rows
- [ ] Home/End keys jump to first/last row
- [ ] Enter key opens disclosure details
- [ ] Escape key closes modal dialogs

### Drug Interaction Checker
- [ ] Tab through drug search and selection
- [ ] Arrow keys navigate search results
- [ ] Enter selects drug from list
- [ ] Interaction results receive focus when severe
- [ ] All actions available via keyboard

### Real-Time Alerts
- [ ] Critical alerts automatically receive focus
- [ ] Tab cycles through alert actions
- [ ] Escape dismisses non-critical alerts
- [ ] Alert panel can be opened/closed with keyboard

## Screen Reader Testing

### NVDA (Windows)
- [ ] Landmarks properly announced
- [ ] Headings create logical outline
- [ ] Table structure clearly conveyed
- [ ] Form labels associated correctly
- [ ] Live region announcements work

### JAWS (Windows)
- [ ] Same checks as NVDA
- [ ] Verify compatibility with forms mode
- [ ] Check table navigation (Ctrl+Alt+Arrow keys)

### VoiceOver (Mac)
- [ ] Rotor navigation works correctly
- [ ] Web spots identify interactive elements
- [ ] Announcements are clear and concise

### TalkBack (Android)
- [ ] Touch exploration works
- [ ] Swipe navigation logical
- [ ] Forms accessible with external keyboard

## Visual Testing

### Color Contrast
- [ ] Text: Minimum 4.5:1 (AA), 7:1 for critical (AAA)
- [ ] UI components: Minimum 3:1
- [ ] Focus indicators: Clearly visible against all backgrounds
- [ ] Status indicators distinguishable without color

### Text Scaling
- [ ] Interface usable at 200% text size
- [ ] No horizontal scrolling at 320px width
- [ ] Content reflows appropriately
- [ ] No text truncation or overlap

### Focus Indicators
- [ ] All interactive elements have visible focus
- [ ] Focus outline at least 3px thick
- [ ] Sufficient contrast (3:1) against background
- [ ] Focus order logical and predictable

## PHI Protection Testing

### Privacy Verification
- [ ] No PHI in console logs
- [ ] No PHI in aria-label or aria-describedby
- [ ] Screen reader announcements are generic
- [ ] Visual masking works correctly
- [ ] Audit logging captures PHI access

### Security
- [ ] Toggle visibility requires explicit action
- [ ] Focus management doesn't expose PHI
- [ ] Clipboard operations secured
- [ ] Browser autocomplete disabled for PHI fields
```

---

## Component Library

### Accessible Button

```typescript
// /src/components/accessibility/AccessibleButton.tsx
import React from 'react';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  icon,
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={`btn btn-${variant} ${loading ? 'btn-loading' : ''}`}
      type="button"
    >
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      <span className="btn-text">{children}</span>
      {loading && (
        <>
          <span className="spinner" aria-hidden="true"></span>
          <span className="sr-only">Loading</span>
        </>
      )}
    </button>
  );
};
```

### Accessible Modal

```typescript
// /src/components/accessibility/AccessibleModal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { focusManager } from '@/utils/accessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      focusManager.saveFocus();

      // Focus modal after render
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Trap focus
      const cleanup = modalRef.current
        ? focusManager.trapFocus(modalRef.current)
        : () => {};

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        cleanup();
        document.removeEventListener('keydown', handleEscape);
        focusManager.restoreFocus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-container modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="modal-close"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### Accessible Toast Notifications

```typescript
// /src/components/accessibility/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ariaAnnouncer } from '@/utils/accessibility';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
  persistent?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
  persistent = false,
}) => {
  useEffect(() => {
    // Announce to screen reader
    if (type === 'error') {
      ariaAnnouncer.announceUrgent(message);
    } else {
      ariaAnnouncer.announce(message);
    }

    // Auto-dismiss unless persistent
    if (!persistent) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const icons = {
    success: <CheckCircle aria-hidden="true" />,
    error: <AlertTriangle aria-hidden="true" />,
    warning: <AlertTriangle aria-hidden="true" />,
    info: <Info aria-hidden="true" />,
  };

  const ariaRoles = {
    success: 'status',
    error: 'alert',
    warning: 'alert',
    info: 'status',
  };

  return (
    <div
      className={`toast toast-${type}`}
      role={ariaRoles[type]}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="toast-icon">
        {icons[type]}
      </div>

      <div className="toast-message">
        {message}
      </div>

      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="toast-close"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
};

// Toast container with positioning
export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div
      className="toast-container"
      aria-live="polite"
      aria-relevant="additions"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </div>
  );
};
```

---

## Summary

This comprehensive guide provides:

1. **Universal Patterns**: Color contrast, focus management, keyboard navigation, ARIA live regions
2. **PHI Protection**: Masking components, secure form fields, generic announcements
3. **15 Feature Implementations**: Detailed code examples with WCAG compliance
4. **Testing Strategies**: Automated (axe, jest-axe) and manual testing checklists
5. **Component Library**: Reusable accessible components

**Key Principles:**
- WCAG 2.1 AA minimum (AAA for critical safety features)
- No PHI exposure through accessibility features
- Multi-modal alerts (visual, audible, screen reader)
- Comprehensive keyboard navigation
- Screen reader optimization
- High contrast ratios
- Focus management
- Error prevention and helpful suggestions

**Implementation Priority:**
1. Critical safety features (Drug Interaction, Real-Time Alerts)
2. HIPAA compliance features (PHI Tracking, Encryption, Audit)
3. Clinical operations (Clinic Visits, Immunizations)
4. Business operations (Medicaid Billing, Reports, Export)
5. Integrations (Document Sharing, Registry, SIS)

All implementations follow the principle: **"Accessible by default, secure by design, inclusive for all users."**
