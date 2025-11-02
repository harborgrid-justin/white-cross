# Accessibility Improvements - WCAG 2.1 AA Compliance

This document outlines all accessibility improvements made to the White Cross Healthcare platform frontend.

## Overview

All improvements follow WCAG 2.1 AA standards and focus on:
1. Proper ARIA labels and roles
2. Semantic HTML and heading hierarchy
3. Keyboard navigation support
4. Focus management
5. Screen reader compatibility
6. Form accessibility

---

## ✅ COMPLETED: Dashboard Components

### 1. Dashboard Page (`/dashboard/page.tsx`)

**Changes Applied:**
```tsx
// Added semantic HTML with ARIA roles
<main role="main" aria-label="Dashboard main content">
  <DashboardContent />
</main>
<aside role="complementary" aria-label="Dashboard sidebar">
  <DashboardSidebar />
</aside>
```

### 2. Dashboard Content (`/dashboard/_components/DashboardContent.tsx`)

**Key Accessibility Features Added:**

#### Heading Hierarchy
```tsx
<header> // Proper semantic structure
  <h1>Healthcare Dashboard</h1> // Main page heading
  <p>Overview description</p>
</header>

<section aria-labelledby="key-stats-heading">
  <h2 id="key-stats-heading" className="sr-only">Key Statistics</h2>
  // Statistics cards
</section>

<section aria-labelledby="dashboard-tabs-heading">
  <h2 id="dashboard-tabs-heading" className="sr-only">Dashboard Information Tabs</h2>
  // Tabs content with h3 subheadings
</section>
```

#### Interactive Elements
```tsx
// Buttons with descriptive labels
<Button
  aria-label="Refresh dashboard data"
  onClick={handleRefresh}
>
  <RefreshCw aria-hidden="true" />
  Refresh
</Button>

// Select dropdowns with context
<SelectTrigger aria-label="Select time period for dashboard data">
  <SelectValue placeholder="Select timeframe" />
</SelectTrigger>

// Icon buttons in lists
<Button
  aria-label={`View details for ${alert.studentName} alert`}
>
  <Eye aria-hidden="true" />
</Button>
```

#### Lists and Groups
```tsx
// Semantic lists for alerts
<div role="list" aria-label="Health alerts">
  {healthAlerts.map((alert) => (
    <div
      role="listitem"
      aria-label={`${alert.severity} severity ${alert.type} alert for ${alert.studentName}`}
    >
      // Alert content with action group
      <div role="group" aria-label="Alert actions">
        // Action buttons
      </div>
    </div>
  ))}
</div>
```

#### Tab Navigation
```tsx
<Tabs defaultValue="alerts">
  <TabsList role="tablist" aria-label="Dashboard information sections">
    <TabsTrigger
      value="alerts"
      role="tab"
      aria-controls="alerts-panel"
    >
      Health Alerts
    </TabsTrigger>
  </TabsList>

  <TabsContent
    value="alerts"
    role="tabpanel"
    id="alerts-panel"
    aria-labelledby="alerts-tab"
  >
    // Panel content
  </TabsContent>
</Tabs>
```

#### Keyboard Navigation
```tsx
// Quick action cards with keyboard support
<Card
  role="listitem"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Navigate to action
    }
  }}
  aria-label="Schedule a new health appointment"
  className="focus-within:ring-2 focus-within:ring-blue-500"
>
  <Plus aria-hidden="true" />
  <h3>New Appointment</h3>
</Card>
```

---

## 📋 TODO: Students Components

### Students Page (`/students/page.tsx`)

**Required Changes:**
```tsx
export default function StudentsPage({ searchParams }: StudentsPageProps) {
  return (
    <>
      <PageHeader
        title="Students"
        description="Comprehensive student management system"
        actions={
          <div role="group" aria-label="Student page actions">
            <Button
              variant="outline"
              size="sm"
              aria-label="Export student data to file"
            >
              <Download aria-hidden="true" />
              Export
            </Button>
            <Button
              size="sm"
              aria-label="Add new student to system"
            >
              <Plus aria-hidden="true" />
              Add Student
            </Button>
          </div>
        }
      />

      <main role="main" aria-label="Students management">
        <div className="space-y-6">
          <Suspense fallback={<Skeleton aria-label="Loading filters" />}>
            <StudentsFilters searchParams={searchParams} />
          </Suspense>

          <Suspense fallback={<StudentsPageSkeleton />}>
            <StudentsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
```

### Students Content (`/students/_components/StudentsContent.tsx`)

**Required Changes:**

#### Statistics Section
```tsx
<section aria-labelledby="student-stats-heading">
  <h2 id="student-stats-heading" className="sr-only">Student Statistics</h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <p className="text-sm">Total Students</p>
      <p
        className="text-2xl"
        aria-label={`${totalStudents} total students`}
      >
        {totalStudents}
      </p>
      <Users aria-hidden="true" />
    </Card>
    // ... other stat cards
  </div>
</section>
```

#### Table Accessibility
```tsx
<section aria-labelledby="students-table-heading">
  <h2 id="students-table-heading">Students</h2>

  <div role="group" aria-label="Student actions">
    <span aria-live="polite">
      {selectedStudents.size} selected
    </span>
    <Button
      aria-label={`Export ${selectedStudents.size} selected students to CSV file`}
    >
      <Download aria-hidden="true" />
      Export
    </Button>
  </div>

  <table role="table" aria-label="Students list">
    <thead>
      <tr role="row">
        <th scope="col">
          <input
            type="checkbox"
            aria-label="Select all students"
          />
        </th>
        <th scope="col">Student</th>
        <th scope="col">Grade & Status</th>
        <th scope="col">Contact Info</th>
        <th scope="col">Health & Attendance</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody role="rowgroup">
      {students.map((student) => (
        <tr key={student.id} role="row">
          <td role="cell">
            <input
              type="checkbox"
              aria-label={`Select student ${student.firstName} ${student.lastName}`}
            />
          </td>
          <td role="cell">
            {student.firstName} {student.lastName}
          </td>
          // ... other cells
          <td role="cell">
            <div
              role="group"
              aria-label={`Actions for ${student.firstName} ${student.lastName}`}
            >
              <Button
                aria-label={`View details for ${student.firstName} ${student.lastName}`}
              >
                <Eye aria-hidden="true" />
              </Button>
              <Button
                aria-label={`Edit ${student.firstName} ${student.lastName}`}
              >
                <Edit aria-hidden="true" />
              </Button>
              <Button
                aria-label={`View health records for ${student.firstName} ${student.lastName}`}
              >
                <FileText aria-hidden="true" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Empty state */}
  {students.length === 0 && (
    <div role="status" aria-live="polite">
      <Users aria-hidden="true" />
      <h3>No students found</h3>
      <p>Get started by adding a new student.</p>
      <Button aria-label="Add first student to system">
        <Plus aria-hidden="true" />
        Add Student
      </Button>
    </div>
  )}
</section>
```

### Students Filters (`/students/_components/StudentsFilters.tsx`)

**Required Changes:**
```tsx
<Card role="search" aria-label="Student filters">
  <div className="p-4">
    <div className="flex items-center justify-between">
      <h2>
        Students
        <span aria-label={`${totalCount.toLocaleString()} total students`}>
          ({totalCount.toLocaleString()} total)
        </span>
      </h2>

      <div role="group" aria-label="Filter controls">
        <Button
          onClick={clearAllFilters}
          aria-label="Clear all filters"
        >
          <X aria-hidden="true" />
          Clear All
        </Button>

        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
          aria-label={showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
        >
          <Filter aria-hidden="true" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge aria-label={`${activeFiltersCount} active filters`}>
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search students by name, ID, or grade..."
      aria-label="Search students"
    />

    {/* Filter Tags */}
    {getFilterTags().map((tag) => (
      <Badge key={tag.key}>
        {tag.label}
        <button
          onClick={() => updateFilters(tag.key, '')}
          aria-label={`Remove ${tag.label} filter`}
        >
          <X aria-hidden="true" />
        </button>
      </Badge>
    ))}

    {/* Advanced Filters */}
    {showAdvanced && (
      <div
        id="advanced-filters"
        role="region"
        aria-label="Advanced filter options"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="grade-filter">Grade Level</label>
            <select
              id="grade-filter"
              aria-label="Filter students by grade level"
            >
              <option value="">All Grades</option>
              {/* ... options */}
            </select>
          </div>

          <div>
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              aria-label="Filter students by enrollment status"
            >
              {/* ... options */}
            </select>
          </div>

          <div>
            <label htmlFor="health-filter">Health Alerts</label>
            <select
              id="health-filter"
              aria-label="Filter students by health alert status"
            >
              {/* ... options */}
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <p id="quick-filters-label">Quick Filters</p>
          <div role="group" aria-labelledby="quick-filters-label">
            <Button
              onClick={() => updateFilters('status', 'ACTIVE')}
              aria-pressed={currentStatus === 'ACTIVE'}
              aria-label="Filter to show only active students"
            >
              <UserCheck aria-hidden="true" />
              Active Students
            </Button>
            {/* ... other quick filter buttons */}
          </div>
        </div>
      </div>
    )}
  </div>
</Card>
```

---

## 📋 TODO: Appointments Components

### Appointments Page (`/appointments/page.tsx`)

**Required Changes:**
```tsx
<div className="min-h-screen bg-gray-50">
  <PageHeader
    title="Appointments"
    description="Manage student healthcare appointments and schedules"
    actions={
      <Button variant="default" aria-label="Schedule new appointment">
        <Plus aria-hidden="true" />
        Schedule Appointment
      </Button>
    }
  />

  <main role="main" aria-label="Appointments management">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <AppointmentsContent />
      </div>
      <aside
        className="lg:col-span-1"
        role="complementary"
        aria-label="Appointments sidebar"
      >
        <AppointmentsSidebar />
      </aside>
    </div>
  </main>
</div>
```

### Appointments Content (`/appointments/_components/AppointmentsContent.tsx`)

**Key Areas for Accessibility:**

#### Statistics Cards
```tsx
<section aria-labelledby="appointment-stats-heading">
  <h2 id="appointment-stats-heading" className="sr-only">Appointment Statistics</h2>
  <div className="grid gap-4 md:grid-cols-4">
    {/* Stat cards with aria-labels */}
  </div>
</section>
```

#### View Mode Controls
```tsx
<div className="flex rounded-lg border">
  <button
    onClick={() => setViewMode('calendar')}
    aria-label="Switch to calendar view"
    aria-pressed={viewMode === 'calendar'}
  >
    <Calendar aria-hidden="true" />
  </button>
  <button
    onClick={() => setViewMode('list')}
    aria-label="Switch to list view"
    aria-pressed={viewMode === 'list'}
  >
    <List aria-hidden="true" />
  </button>
  <button
    onClick={() => setViewMode('agenda')}
    aria-label="Switch to agenda view"
    aria-pressed={viewMode === 'agenda'}
  >
    <Grid3x3 aria-hidden="true" />
  </button>
</div>
```

#### Filter Controls
```tsx
<div id="advanced-filters" role="region" aria-label="Appointment filters">
  <div>
    <label htmlFor="status-filter">Status</label>
    <select
      id="status-filter"
      aria-label="Filter by appointment status"
    >
      {/* Options */}
    </select>
  </div>

  <div>
    <label htmlFor="type-filter">Type</label>
    <select
      id="type-filter"
      aria-label="Filter by appointment type"
    >
      {/* Options */}
    </select>
  </div>

  <div>
    <label htmlFor="date-filter">Date Range</label>
    <input
      type="date"
      id="date-filter"
      aria-label="Select date range for appointments"
    />
  </div>
</div>
```

#### Appointment List
```tsx
<div role="list" aria-label="Appointments">
  {filteredAppointments.map((appointment) => (
    <div
      key={appointment.id}
      role="listitem"
      aria-label={`${appointment.appointmentType} appointment for student ${appointment.studentId} on ${formatDate(appointment.scheduledDate)}`}
    >
      <input
        type="checkbox"
        aria-label={`Select appointment: ${appointment.reason}`}
      />

      <div role="group" aria-label="Appointment actions">
        <Button aria-label="View appointment details">
          <Eye aria-hidden="true" />
        </Button>
        <Button aria-label="Edit appointment">
          <Edit aria-hidden="true" />
        </Button>
        <Button aria-label="Cancel appointment">
          <XCircle aria-hidden="true" />
        </Button>
      </div>
    </div>
  ))}
</div>
```

#### Calendar View
```tsx
<div role="grid" aria-label="Weekly appointment calendar">
  {/* Day headers */}
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
    <div key={day} role="columnheader" aria-label={day}>
      {day}
    </div>
  ))}

  {/* Calendar cells */}
  {getCurrentWeekDates().map((date, index) => {
    const dayAppointments = getAppointmentsForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <div
        key={index}
        role="gridcell"
        aria-label={`${date.toLocaleDateString()}, ${dayAppointments.length} appointments${isToday ? ', today' : ''}`}
        tabIndex={0}
      >
        <div className="text-sm">{date.getDate()}</div>
        {dayAppointments.map((apt) => (
          <button
            key={apt.id}
            aria-label={`${formatTime(apt.scheduledTime)}, ${apt.reason}`}
          >
            {apt.reason}
          </button>
        ))}
      </div>
    );
  })}
</div>
```

### Appointments Sidebar (`/appointments/_components/AppointmentsSidebar.tsx`)

**Required Changes:**
```tsx
<aside
  className={`space-y-4 ${className}`}
  role="complementary"
  aria-label="Appointment quick actions and filters"
>
  {/* Quick Actions */}
  <section aria-labelledby="quick-actions-heading">
    <h3 id="quick-actions-heading">Quick Actions</h3>
    <div className="space-y-2">
      <Button
        className="w-full"
        aria-label="Schedule new appointment"
      >
        <Plus aria-hidden="true" />
        Schedule Appointment
      </Button>
    </div>
  </section>

  {/* Today's Overview */}
  <section aria-labelledby="today-overview-heading">
    <h3 id="today-overview-heading">Today's Overview</h3>
    <div className="grid grid-cols-2 gap-3">
      <div aria-label={`${quickStats.todayTotal} appointments today`}>
        <div className="text-lg font-bold">{quickStats.todayTotal}</div>
        <div className="text-xs">Total</div>
      </div>
      {/* Other stats */}
    </div>
  </section>

  {/* Filter Controls */}
  <section aria-labelledby="filters-heading">
    <h3 id="filters-heading">Filters</h3>
    <div className="space-y-3">
      <div>
        <label htmlFor="sidebar-status-filter">Status</label>
        <select
          id="sidebar-status-filter"
          aria-label="Filter by appointment status"
        >
          {/* Options */}
        </select>
      </div>
    </div>
  </section>

  {/* Upcoming Appointments */}
  <section aria-labelledby="upcoming-heading">
    <h3 id="upcoming-heading">
      Upcoming Appointments
      <Badge aria-label={`${upcomingAppointments.length} upcoming`}>
        {upcomingAppointments.length}
      </Badge>
    </h3>

    {upcomingAppointments.length === 0 ? (
      <div role="status" aria-live="polite">
        <Calendar aria-hidden="true" />
        <p>No upcoming appointments</p>
      </div>
    ) : (
      <div role="list" aria-label="Upcoming appointments">
        {upcomingAppointments.map((appointment) => (
          <div
            key={appointment.id}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                // Navigate to appointment
              }
            }}
            aria-label={`${appointment.studentName}, ${appointment.appointmentType}, ${formatTime(appointment.scheduledTime)}, ${appointment.timeUntil}`}
          >
            {/* Appointment content */}
          </div>
        ))}
      </div>
    )}
  </section>

  {/* Recent Activity */}
  <section aria-labelledby="activity-heading">
    <h3 id="activity-heading">Recent Activity</h3>
    {recentActivity.length === 0 ? (
      <div role="status" aria-live="polite">
        <Activity aria-hidden="true" />
        <p>No recent activity</p>
      </div>
    ) : (
      <div role="list" aria-label="Recent activities">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            role="listitem"
            aria-label={`${activity.description} for ${activity.studentName}, ${formatRelativeTime(activity.timestamp)}`}
          >
            {/* Activity content */}
          </div>
        ))}
      </div>
    )}
  </section>

  {/* Healthcare Alerts */}
  <section aria-labelledby="alerts-heading" aria-live="polite">
    <div>
      <Bell aria-hidden="true" />
      <h3 id="alerts-heading">Healthcare Alerts</h3>
    </div>
    {/* Alert items */}
  </section>
</aside>
```

---

## 📋 TODO: Medications Components

### Medications Page (`/medications/page.tsx`)

**Required Changes:**
```tsx
<div className="space-y-6">
  <PageHeader
    title="Medications"
    description="Manage and track all student medications"
    actions={
      <Link href="/medications/new">
        <Button variant="default" aria-label="Add new medication to formulary">
          <Plus aria-hidden="true" />
          Add Medication
        </Button>
      </Link>
    }
  />

  {/* Statistics Cards */}
  <section aria-labelledby="medication-stats-heading">
    <h2 id="medication-stats-heading" className="sr-only">Medication Statistics</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <StatCard
        label="Total Medications"
        value={stats.totalMedications}
        href="/medications"
        color="blue"
        aria-label={`${stats.totalMedications} total medications in system`}
      />
      {/* Other stat cards */}
    </div>
  </section>

  {/* Medications List */}
  <section aria-labelledby="medications-list-heading">
    <Card>
      <div className="p-6">
        <h3 id="medications-list-heading">
          Medications ({medications.length})
        </h3>

        {medications.length === 0 ? (
          <div role="status" aria-live="polite">
            <div aria-hidden="true">
              <svg>/* Medication icon */</svg>
            </div>
            <h3>No medications found</h3>
            <p>Get started by adding your first medication to the formulary.</p>
            <Button aria-label="Add first medication to system">
              <Plus aria-hidden="true" />
              Add Medication
            </Button>
          </div>
        ) : (
          <div role="list" aria-label="Medications list">
            {medications.map((medication) => (
              <div
                key={medication.id}
                role="listitem"
                aria-label={`${medication.name}, ${medication.dosageForm}, ${medication.strength}${medication.isControlled ? ', controlled substance' : ''}`}
              >
                {/* Medication content */}
                <Button
                  aria-label={`View details for ${medication.name}`}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  </section>
</div>
```

### Medications Content (`/medications/_components/MedicationsContent.tsx`)

**Critical Accessibility Features:**

#### Overdue/Due Medications Alerts
```tsx
{/* Critical Alerts - High Priority Accessibility */}
{overdueMedications.length > 0 && (
  <Card
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    className="border-red-200 bg-red-50"
  >
    <CardHeader>
      <CardTitle>
        <AlertTriangle aria-hidden="true" />
        Overdue Medications ({overdueMedications.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div role="list" aria-label="Overdue medications requiring immediate attention">
        {overdueMedications.slice(0, 3).map((medication) => (
          <div
            key={medication.id}
            role="listitem"
            aria-label={`Overdue: ${medication.name} for student ${medication.studentId}, due ${formatDateTime(medication.nextDue)}`}
          >
            <Button
              onClick={() => handleAdministerMedication(medication.id)}
              aria-label={`Administer ${medication.name} now`}
            >
              Administer Now
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}

{/* Due Soon - Medium Priority */}
{dueMedications.length > 0 && overdueMedications.length === 0 && (
  <Card
    role="status"
    aria-live="polite"
    className="border-orange-200 bg-orange-50"
  >
    <CardHeader>
      <CardTitle>
        <Clock aria-hidden="true" />
        Due Now ({dueMedications.length})
      </CardTitle>
    </CardHeader>
    {/* Similar structure */}
  </Card>
)}
```

#### Search and Filters
```tsx
<section aria-labelledby="medications-search-heading">
  <Card>
    <CardHeader>
      <CardTitle id="medications-search-heading">
        Medications ({filteredMedications.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      {/* Search Bar */}
      <div className="relative">
        <Search aria-hidden="true" />
        <Input
          type="text"
          placeholder="Search medications by name, generic, student, or notes..."
          aria-label="Search medications"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Filters */}
      <div role="group" aria-label="Quick medication filters">
        <Button
          aria-pressed={filters.status?.includes('active')}
          aria-label="Filter to show only active medications"
        >
          Active Only
        </Button>
        <Button
          aria-pressed={filters.isControlled === true}
          aria-label="Filter to show only controlled substances"
        >
          <Shield aria-hidden="true" />
          Controlled
        </Button>
        <Button
          aria-pressed={filters.type?.includes('emergency')}
          aria-label="Filter to show only emergency medications"
        >
          <Zap aria-hidden="true" />
          Emergency
        </Button>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-4">
        <label htmlFor="medication-sort">Sort by:</label>
        <select
          id="medication-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort medications by"
        >
          <option value="name">Medication Name</option>
          <option value="nextDue">Next Due</option>
          <option value="student">Student</option>
          <option value="type">Type</option>
        </select>
        <Button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          aria-label={`Sort order: ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          aria-pressed={sortOrder === 'desc'}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Medications List */}
      {filteredMedications.length === 0 ? (
        <div role="status" aria-live="polite">
          <Pill aria-hidden="true" />
          <h3>No medications found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div role="list" aria-label="Filtered medications">
          {filteredMedications.map((medication) => (
            <div
              key={medication.id}
              role="listitem"
              aria-label={`${medication.name}, ${medication.strength}, ${medication.administrationRoute}, ${medication.frequency}${medication.isControlled ? ', controlled substance' : ''}`}
            >
              {/* Medication Details */}
              <div>
                <h3>{medication.name}</h3>
                <Badge>
                  {medication.type.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge>
                  {medication.status.replace('_', ' ').toUpperCase()}
                </Badge>
                {medication.isControlled && (
                  <Badge aria-label="Controlled substance - DEA scheduled medication">
                    <Shield aria-hidden="true" />
                    CONTROLLED
                  </Badge>
                )}
              </div>

              {/* Warnings */}
              {medication.warnings && medication.warnings.length > 0 && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="bg-yellow-50 border-yellow-200"
                >
                  <AlertTriangle aria-hidden="true" />
                  <div>
                    <p className="font-medium">Warnings:</p>
                    <ul>
                      {medication.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div role="group" aria-label={`Actions for ${medication.name}`}>
                {medication.status === 'active' && (
                  <Button
                    onClick={() => handleAdministerMedication(medication.id)}
                    disabled={!isDue(medication) && medication.frequency !== 'as_needed'}
                    aria-label={`Administer ${medication.name}${!isDue(medication) ? ' - not yet due' : ''}`}
                  >
                    <Syringe aria-hidden="true" />
                    Administer
                  </Button>
                )}
                <Button aria-label={`View details for ${medication.name}`}>
                  <Eye aria-hidden="true" />
                  View
                </Button>
                <Button aria-label={`Edit ${medication.name}`}>
                  <Edit aria-hidden="true" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</section>
```

---

## General Accessibility Patterns

### 1. Icon Usage
```tsx
// Always hide decorative icons from screen readers
<Icon aria-hidden="true" />

// For icon-only buttons, add descriptive labels
<Button aria-label="Delete item">
  <Trash aria-hidden="true" />
</Button>
```

### 2. Loading States
```tsx
<div role="status" aria-live="polite" aria-busy="true">
  <Spinner aria-hidden="true" />
  <span className="sr-only">Loading content...</span>
</div>
```

### 3. Empty States
```tsx
<div role="status" aria-live="polite">
  <Icon aria-hidden="true" />
  <h3>No items found</h3>
  <p>Description of empty state</p>
</div>
```

### 4. Dynamic Content Updates
```tsx
// For critical updates
<div role="alert" aria-live="assertive" aria-atomic="true">
  Critical message
</div>

// For polite updates
<div role="status" aria-live="polite">
  Status message
</div>

// For selection counts
<span aria-live="polite">
  {selectedCount} items selected
</span>
```

### 5. Form Fields
```tsx
// Always use labels
<div>
  <label htmlFor="field-id">Field Label</label>
  <input
    id="field-id"
    type="text"
    aria-label="Additional context if needed"
    aria-describedby="field-help"
    aria-invalid={hasError}
    aria-required={isRequired}
  />
  {hasError && (
    <span id="field-error" role="alert">
      Error message
    </span>
  )}
  <span id="field-help">Help text</span>
</div>
```

### 6. Keyboard Navigation
```tsx
// Make custom interactive elements keyboard accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAction();
    }
  }}
  onClick={handleAction}
  aria-label="Action description"
>
  Content
</div>

// Ensure focus is visible
className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
```

### 7. Tables
```tsx
<table role="table" aria-label="Table description">
  <thead>
    <tr role="row">
      <th scope="col">Column Header</th>
    </tr>
  </thead>
  <tbody role="rowgroup">
    <tr role="row">
      <td role="cell">Data</td>
    </tr>
  </tbody>
</table>
```

### 8. Lists
```tsx
<div role="list" aria-label="List description">
  {items.map((item) => (
    <div key={item.id} role="listitem" aria-label={`Item: ${item.name}`}>
      {item.content}
    </div>
  ))}
</div>
```

---

## Testing Checklist

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)

### Keyboard Navigation Testing
- [ ] Tab order is logical
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Enter/Space keys work on custom buttons
- [ ] Escape key closes modals/dropdowns
- [ ] Arrow keys navigate within components

### ARIA Testing
- [ ] ARIA roles are appropriate
- [ ] ARIA labels provide context
- [ ] ARIA live regions update properly
- [ ] ARIA states reflect UI state
- [ ] No ARIA validation errors

### Color Contrast Testing
- [ ] Text meets 4.5:1 ratio (normal text)
- [ ] Large text meets 3:1 ratio
- [ ] Interactive elements meet 3:1 ratio
- [ ] Focus indicators are visible

### Form Accessibility
- [ ] All inputs have labels
- [ ] Error messages are associated
- [ ] Required fields are indicated
- [ ] Help text is accessible

---

## Resources

- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?levels=aa)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

## Implementation Status

- ✅ Dashboard Components (100% Complete)
- ⏳ Students Components (Documented, Ready to Implement)
- ⏳ Appointments Components (Documented, Ready to Implement)
- ⏳ Medications Components (Documented, Ready to Implement)

Last Updated: 2025-11-02
