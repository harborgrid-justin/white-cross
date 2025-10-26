# Healthcare Styling Quick Reference

**White Cross School Nurse SaaS Platform**
**Version:** 1.0 | **Print This Page** 📄

---

## 🎨 Healthcare Color Palettes

### Alert Severity Colors

| Level | Badge Class | Use Case |
|-------|-------------|----------|
| Info | `.alert-severity-info` | FYI messages |
| Low | `.alert-severity-low` | Minor issues |
| Medium | `.alert-severity-medium` | Needs attention |
| High | `.alert-severity-high` | Urgent action |
| Critical | `.alert-severity-critical` | Immediate action |
| Emergency | `.alert-severity-emergency` | Life-threatening |

**Quick Example:**
```tsx
<div className="alert-severity-critical">
  <AlertIcon className="alert-icon" />
  <div>
    <h4 className="font-bold">Alert Title</h4>
    <p className="text-sm">Alert message</p>
  </div>
</div>
```

---

### Drug Interaction Severity

| Severity | Badge Class | Color |
|----------|-------------|-------|
| None | `.interaction-none` | 🟢 Green |
| Minor | `.interaction-minor` | 🟡 Lime |
| Moderate | `.interaction-moderate` | 🟡 Yellow |
| Major | `.interaction-major` | 🟠 Orange |
| Severe | `.interaction-severe` | 🔴 Red |
| Unknown | `.interaction-unknown` | ⚫ Gray |

**Quick Example:**
```tsx
<span className="interaction-severe">SEVERE</span>
```

---

### Immunization Status

| Status | Badge Class | Color |
|--------|-------------|-------|
| Compliant | `.immunization-compliant` | 🟢 Green |
| Partial | `.immunization-partial` | 🟡 Yellow |
| Overdue | `.immunization-overdue` | 🟠 Orange |
| Non-compliant | `.immunization-noncompliant` | 🔴 Red |
| Exempt | `.immunization-exempt` | 🟣 Purple |
| Pending | `.immunization-pending` | 🔵 Blue |
| Unknown | `.immunization-unknown` | ⚫ Gray |

**Quick Example:**
```tsx
<span className="immunization-compliant">COMPLIANT</span>
```

---

### PHI Protection Levels

| Level | Badge Class | Field Class |
|-------|-------------|-------------|
| Public | `.phi-public` | - |
| Limited | `.phi-limited` | `.phi-field` |
| Protected | `.phi-protected` | `.phi-field` |
| Sensitive | `.phi-sensitive` | `.phi-field-sensitive` |
| Redacted | `.phi-redacted` | - |

**Quick Example:**
```tsx
<div className="phi-field-sensitive">
  <label className="form-label">Medical Diagnosis</label>
  <input type="text" className="input-field shadow-phi-sensitive" />
</div>
```

---

### Encryption Status

| Status | Badge Class |
|--------|-------------|
| Encrypted | `.encryption-encrypted` |
| Partial | `.encryption-partial` |
| Unencrypted | `.encryption-unencrypted` |
| Encrypting | `.encryption-encrypting` |
| Key Rotated | `.encryption-rotated` |
| Expired | `.encryption-expired` |

---

### Billing & Claims Status

| Status | Badge Class | Color |
|--------|-------------|-------|
| Draft | `.billing-draft` | ⚫ Gray |
| Submitted | `.billing-submitted` | 🔵 Blue |
| Approved | `.billing-approved` | 🟢 Green |
| Paid | `.billing-paid` | 🟢 Emerald |
| Rejected | `.billing-rejected` | 🔴 Red |
| Under Review | `.billing-review` | 🟡 Yellow |
| Appealed | `.billing-appealed` | 🟣 Purple |

---

### Sync Status

| Status | Badge Class |
|--------|-------------|
| Synced | `.sync-synced` |
| Syncing | `.sync-syncing` |
| Failed | `.sync-failed` |
| Pending | `.sync-pending` |
| Partial | `.sync-partial` |
| Never Synced | `.sync-never` |
| Conflict | `.sync-conflict` |

---

### Clinic Visit Status

| Status | Badge Class |
|--------|-------------|
| Checked In | `.visit-checked-in` |
| In Progress | `.visit-in-progress` |
| Completed | `.visit-completed` |
| Missed | `.visit-missed` |
| Cancelled | `.visit-cancelled` |

---

### Outbreak Detection Levels

| Level | Badge Class |
|-------|-------------|
| Normal | `.outbreak-normal` |
| Elevated | `.outbreak-elevated` |
| Alert | `.outbreak-alert` |
| Outbreak | `.outbreak-outbreak` |
| Critical | `.outbreak-critical` |

---

### Audit & Compliance

| Status | Badge Class |
|--------|-------------|
| Clean | `.audit-clean` |
| Reviewed | `.audit-reviewed` |
| Flagged | `.audit-flagged` |
| Tampered | `.audit-tampered` |
| Suspicious | `.audit-suspicious` |

---

## 🧩 Common Component Classes

### Cards

```tsx
.card                    // Standard card
.card-elevated          // Card with more shadow
.card-flat              // Flat card (minimal shadow)
.card-hover             // Card with hover effect
.card-header            // Card header
.card-body              // Card body
.card-footer            // Card footer
```

**Quick Example:**
```tsx
<div className="card">
  <div className="card-header">
    <h3>Title</h3>
  </div>
  <div className="card-body">Content</div>
  <div className="card-footer">Actions</div>
</div>
```

---

### Buttons

```tsx
// Variants
.btn-primary            // Primary action
.btn-secondary          // Secondary action
.btn-success            // Success action
.btn-warning            // Warning action
.btn-danger             // Danger action
.btn-info               // Info action
.btn-outline            // Outline button
.btn-outline-primary    // Primary outline
.btn-ghost              // Ghost button
.btn-link               // Link button

// Sizes
.btn-xs                 // Extra small
.btn-sm                 // Small
.btn-md                 // Medium (default)
.btn-lg                 // Large
.btn-xl                 // Extra large

// States
.btn-loading            // Loading state
```

**Quick Example:**
```tsx
<button className="btn btn-primary btn-md">
  Submit
</button>
```

---

### Forms

```tsx
// Input fields
.input-field            // Standard input
.input-sm               // Small input
.input-md               // Medium input
.input-lg               // Large input
.input-error            // Error state
.input-success          // Success state
.input-warning          // Warning state

// Select fields
.select-field           // Standard select

// Textarea
.textarea-field         // Standard textarea

// Labels & help text
.form-label             // Field label
.form-label-required    // Required field label (with *)
.form-help              // Help text
.form-error             // Error message

// Form sections
.form-section           // Form section container
.form-section-header    // Section header
.form-row               // 2-column row
.form-row-3col          // 3-column row
.form-group             // Field group
```

**Quick Example:**
```tsx
<div className="form-group">
  <label className="form-label form-label-required">Email</label>
  <input type="email" className="input-field" />
  <p className="form-help">Enter your email address</p>
</div>
```

---

### Badges

```tsx
// Variants
.badge-primary
.badge-secondary
.badge-success
.badge-warning
.badge-danger
.badge-info

// Sizes
.badge-sm
.badge-md
.badge-lg
```

**Quick Example:**
```tsx
<span className="badge badge-success">Active</span>
```

---

### Dashboard Layouts

```tsx
.dashboard-grid          // 4-column responsive grid
.dashboard-grid-2col     // 2-column responsive grid
.dashboard-stat-card     // Stat card
.dashboard-stat-value    // Large stat number
.dashboard-stat-label    // Stat label
.dashboard-stat-change   // Change indicator
.dashboard-stat-change-positive  // Positive change (green)
.dashboard-stat-change-negative  // Negative change (red)
.dashboard-header        // Dashboard header
.dashboard-title         // Dashboard title
.dashboard-actions       // Action buttons area
```

**Quick Example:**
```tsx
<div className="dashboard-stat-card">
  <div className="dashboard-stat-label">Total Students</div>
  <div className="dashboard-stat-value">542</div>
  <div className="dashboard-stat-change dashboard-stat-change-positive">
    +12 from last year
  </div>
</div>
```

---

### Modals

```tsx
.modal-overlay          // Dark overlay
.modal                  // Modal container
.modal-sm               // Small modal
.modal-md               // Medium modal
.modal-lg               // Large modal
.modal-xl               // Extra large modal
.modal-2xl, 3xl, 4xl, 5xl, 6xl  // Even larger
.modal-full             // Full width
.modal-header           // Modal header
.modal-title            // Modal title
.modal-body             // Modal body
.modal-footer           // Modal footer
```

---

### Loading States

```tsx
.skeleton               // Skeleton loader
.skeleton-text          // Text skeleton
.skeleton-circle        // Circle skeleton
.shimmer                // Shimmer effect
.spinner                // Loading spinner
.spinner-sm             // Small spinner
.spinner-lg             // Large spinner
.loading-overlay        // Full-page overlay
```

**Quick Example:**
```tsx
// Skeleton
<div className="skeleton-text w-32 h-4 mb-2" />

// Spinner
<div className="spinner" />

// Loading overlay
<div className="loading-overlay">
  <div className="spinner" />
</div>
```

---

### Charts

```tsx
.chart-container        // Chart wrapper
.chart-title            // Chart title
.chart-legend           // Legend container
.chart-legend-item      // Legend item
.chart-legend-dot       // Legend color dot
```

---

### Tables

```tsx
.table                  // Table element
.table-header           // Table header
.table-th               // Table header cell
.table-row              // Table row
.table-row-striped      // Striped rows
.table-td               // Table cell
```

---

### Special Features

```tsx
// PHI indicators
.phi-indicator          // Orange left border
.phi-indicator-sensitive  // Red left border
.encrypted-badge        // Lock icon badge

// Visit timeline
.visit-timeline         // Timeline container
.visit-timeline-item    // Timeline item
.visit-timeline-dot     // Timeline dot

// Responsive containers
.container-responsive   // Responsive padding container

// Print utilities
.print-hide             // Hide when printing
.print-show             // Show only when printing
.print-break-before     // Page break before
.print-break-after      // Page break after
.print-break-inside-avoid  // Avoid breaking inside
.print-color-exact      // Preserve colors
```

---

## 🎯 Common Patterns

### Emergency Alert

```tsx
<div className="alert-severity-emergency">
  <AlertTriangleIcon className="alert-icon w-8 h-8" />
  <div>
    <h4 className="text-xl font-bold">EMERGENCY</h4>
    <p className="text-base">Emergency message</p>
    <button className="btn bg-white text-red-900 btn-lg mt-3">
      CALL 911
    </button>
  </div>
</div>
```

---

### Drug Interaction Warning

```tsx
<div className="drug-interaction-card-danger">
  <div className="flex items-center justify-between mb-2">
    <h4 className="font-bold">Aspirin + Warfarin</h4>
    <span className="interaction-severe">SEVERE</span>
  </div>
  <p className="text-sm">Increased bleeding risk</p>
</div>
```

---

### Immunization Dashboard Card

```tsx
<div className="immunization-dashboard-card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Immunization Status</h3>
    <span className="immunization-compliant">COMPLIANT</span>
  </div>
  <div className="immunization-progress-bar">
    <div
      className="immunization-progress-fill bg-green-500"
      style={{ width: '95%' }}
    />
  </div>
</div>
```

---

### PHI-Protected Form Field

```tsx
<div className="phi-field-sensitive">
  <label className="form-label flex items-center gap-2">
    <ShieldIcon className="w-4 h-4 text-red-600" />
    Medical Diagnosis
  </label>
  <input
    type="text"
    className="input-field shadow-phi-sensitive"
  />
  <p className="form-help">
    <span className="phi-sensitive">SENSITIVE PHI</span> - Access logged
  </p>
</div>
```

---

### Billing Status Card

```tsx
<div className="billing-card border-l-4 border-green-500">
  <h3 className="text-sm font-semibold mb-2">Approved Claims</h3>
  <div className="billing-amount text-green-600">$8,920</div>
  <span className="billing-approved">32 CLAIMS</span>
</div>
```

---

### Sync Status Display

```tsx
<div className="sync-progress-card">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <CheckCircleIcon className="w-6 h-6 text-green-600" />
      <div>
        <h4 className="font-semibold">State Registry</h4>
        <p className="text-sm text-gray-600">Last sync: 2 hours ago</p>
      </div>
    </div>
    <span className="sync-synced">SYNCED</span>
  </div>
</div>
```

---

### Clinic Visit Timeline

```tsx
<div className="visit-timeline">
  <div className="visit-timeline-item">
    <div className="visit-timeline-dot border-blue-500 bg-blue-500" />
    <div>
      <h4 className="font-semibold">Sarah Johnson</h4>
      <p className="text-sm text-gray-600">Headache</p>
      <span className="visit-checked-in">CHECKED IN</span>
    </div>
  </div>
</div>
```

---

### Outbreak Alert

```tsx
<div className="outbreak-alert">
  <AlertTriangleIcon className="w-6 h-6" />
  <div>
    <h4 className="font-bold text-lg">Flu Outbreak Alert</h4>
    <p className="text-sm">Cases have exceeded alert threshold</p>
  </div>
</div>
```

---

### Dashboard Header

```tsx
<div className="dashboard-header">
  <div>
    <h1 className="dashboard-title">Dashboard</h1>
    <p className="text-gray-600">Washington Elementary</p>
  </div>
  <div className="dashboard-actions">
    <button className="btn btn-outline btn-md">Export</button>
    <button className="btn btn-primary btn-md">New Visit</button>
  </div>
</div>
```

---

## 🌓 Dark Mode

Add `dark:` prefix to any utility:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content adapts to dark mode
</div>
```

**Common Dark Mode Patterns:**
- `bg-white dark:bg-gray-800`
- `text-gray-900 dark:text-white`
- `border-gray-200 dark:border-gray-700`
- `text-gray-600 dark:text-gray-400`

---

## 📱 Responsive Breakpoints

```tsx
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Small desktops
xl:  1280px  // Large desktops
2xl: 1536px  // Extra large screens
```

**Common Responsive Patterns:**
```tsx
// Mobile-first grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"

// Responsive padding
className="px-4 sm:px-6 lg:px-8"

// Responsive text
className="text-2xl sm:text-3xl md:text-4xl"

// Responsive visibility
className="hidden md:block"  // Hidden on mobile, visible on desktop
className="block md:hidden"  // Visible on mobile, hidden on desktop
```

---

## ♿ Accessibility

### Focus States

```tsx
// Standard focus ring
className="focus-ring"

// Custom focus ring
className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
```

### Screen Reader Only

```tsx
<label className="sr-only" htmlFor="search">
  Search patients
</label>
```

### ARIA Labels

```tsx
<button
  className="btn btn-danger"
  aria-label="Delete patient record"
>
  <TrashIcon className="w-4 h-4" />
</button>
```

---

## 🖨️ Print Utilities

```tsx
.print-hide              // Hide when printing
.print-show              // Show only when printing
.print-break-before      // Page break before
.print-break-after       // Page break after
.print-break-inside-avoid  // Avoid breaking inside
.print-no-shadow         // Remove shadows
.print-border            // Add border
.print-color-exact       // Preserve colors
```

---

## ⚡ Performance Tips

1. **Use pre-built classes** instead of inline styles
2. **Leverage PurgeCSS** - Tailwind automatically removes unused styles
3. **Prefer utilities** over custom CSS
4. **Use skeleton loaders** for better perceived performance

---

## 📚 Additional Resources

- **Full Guide**: `/HEALTHCARE_STYLING_GUIDE.md`
- **Migration Guide**: `/STYLING_MIGRATION_GUIDE.md`
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Print this page and keep it at your desk for quick reference!** 📌
