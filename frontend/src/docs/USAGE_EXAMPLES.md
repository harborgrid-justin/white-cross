# Redux Store Usage Examples

This document provides practical examples for using the Redux store across the White Cross healthcare platform.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Authentication Examples](#authentication-examples)
3. [Student Management Examples](#student-management-examples)
4. [Health Records Examples](#health-records-examples)
5. [Medication Management Examples](#medication-management-examples)
6. [Incident Reports Examples](#incident-reports-examples)
7. [Advanced Patterns](#advanced-patterns)

## Basic Setup

### Provider Setup (Already Done in App.tsx)

```typescript
import { Provider } from 'react-redux';
import { store } from '@/stores';

function App() {
  return (
    <Provider store={store}>
      {/* Your app components */}
    </Provider>
  );
}
```

### Basic Component Usage

```typescript
import { useAppDispatch, useAppSelector } from '@/stores';

function MyComponent() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.someSlice.data);

  // Component logic...
}
```

## Authentication Examples

### Login Form Component

```typescript
import React, { useState } from 'react';
import { useAuthActions, useCurrentUser, useAuthLoading, useAuthError } from '@/stores';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, clearError } = useAuthActions();
  const user = useCurrentUser();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password }).unwrap();
      // Login successful - user will be redirected by route guard
    } catch (err) {
      // Error is automatically stored in Redux state
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Protected Route Component

```typescript
import { useIsAuthenticated, useCurrentUser } from '@/stores';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
}
```

## Student Management Examples

### Student List Component

```typescript
import React, { useEffect } from 'react';
import {
  useStudents,
  useStudentsActions,
  useActiveStudents,
  useAppSelector
} from '@/stores';

function StudentsList() {
  const { fetchAll } = useStudentsActions();
  const activeStudents = useActiveStudents();
  const loading = useAppSelector((state) => state.students.loading.list.isLoading);
  const error = useAppSelector((state) => state.students.loading.list.error);

  useEffect(() => {
    // Fetch students on component mount
    fetchAll({ active: true, limit: 50 });
  }, [fetchAll]);

  if (loading) return <div>Loading students...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Active Students ({activeStudents.length})</h2>
      <ul>
        {activeStudents.map((student) => (
          <li key={student.id}>
            {student.firstName} {student.lastName} - Grade {student.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Student Detail Component

```typescript
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useStudentById,
  useStudentsActions,
  useMedicationsByStudent,
  useHealthRecordsByStudent
} from '@/stores';

function StudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const { fetchById } = useStudentsActions();

  const student = useStudentById(studentId!);
  const medications = useMedicationsByStudent(studentId!);
  const healthRecords = useHealthRecordsByStudent(studentId!);

  useEffect(() => {
    if (studentId) {
      fetchById(studentId);
    }
  }, [studentId, fetchById]);

  if (!student) return <div>Loading student...</div>;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Grade: {student.grade}</p>
      <p>Student Number: {student.studentNumber}</p>

      <section>
        <h2>Medications ({medications.length})</h2>
        {/* Render medications */}
      </section>

      <section>
        <h2>Health Records ({healthRecords.length})</h2>
        {/* Render health records */}
      </section>
    </div>
  );
}
```

### Create Student Form

```typescript
import React, { useState } from 'react';
import { useStudentsActions } from '@/stores';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CreateStudentForm() {
  const { create } = useStudentsActions();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    studentNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await create(formData).unwrap();
      toast.success('Student created successfully');
      navigate(`/students/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create student');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <input
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      {/* Other form fields */}
      <button type="submit">Create Student</button>
    </form>
  );
}
```

## Health Records Examples

### Health Records by Student

```typescript
import React, { useEffect } from 'react';
import {
  useHealthRecordsByStudent,
  useHealthRecordsActions,
  useRecentHealthRecords
} from '@/stores';

function StudentHealthRecords({ studentId }: { studentId: string }) {
  const { fetchAll } = useHealthRecordsActions();
  const studentRecords = useHealthRecordsByStudent(studentId);
  const recentRecords = useRecentHealthRecords();

  useEffect(() => {
    fetchAll({ studentId });
  }, [studentId, fetchAll]);

  return (
    <div>
      <h2>Health Records</h2>
      {studentRecords.map((record) => (
        <div key={record.id}>
          <h3>{record.type}</h3>
          <p>{record.description}</p>
          <small>{new Date(record.recordDate).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
```

### Add Health Record

```typescript
import React, { useState } from 'react';
import { useHealthRecordsActions } from '@/stores';
import toast from 'react-hot-toast';

function AddHealthRecordForm({ studentId }: { studentId: string }) {
  const { create } = useHealthRecordsActions();
  const [recordData, setRecordData] = useState({
    type: 'checkup',
    description: '',
    recordDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await create({ ...recordData, studentId }).unwrap();
      toast.success('Health record added');
      setRecordData({ type: 'checkup', description: '', recordDate: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add health record');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={recordData.type}
        onChange={(e) => setRecordData({ ...recordData, type: e.target.value })}
      >
        <option value="checkup">Checkup</option>
        <option value="injury">Injury</option>
        <option value="illness">Illness</option>
        <option value="allergy">Allergy</option>
      </select>
      <textarea
        placeholder="Description"
        value={recordData.description}
        onChange={(e) => setRecordData({ ...recordData, description: e.target.value })}
        required
      />
      <input
        type="date"
        value={recordData.recordDate}
        onChange={(e) => setRecordData({ ...recordData, recordDate: e.target.value })}
        required
      />
      <button type="submit">Add Record</button>
    </form>
  );
}
```

## Medication Management Examples

### Medication Dashboard

```typescript
import React, { useEffect } from 'react';
import {
  useMedicationsDueToday,
  useActiveMedications,
  useMedicationsActions
} from '@/stores';

function MedicationDashboard() {
  const { fetchAll } = useMedicationsActions();
  const dueTodayMeds = useMedicationsDueToday();
  const activeMeds = useActiveMedications();

  useEffect(() => {
    fetchAll({ active: true });
  }, [fetchAll]);

  return (
    <div>
      <div className="alert">
        <h3>⚠️ Due Today</h3>
        <p>{dueTodayMeds.length} medications need to be administered</p>
      </div>

      <div className="stats">
        <h3>Active Medications</h3>
        <p>{activeMeds.length} total active medications</p>
      </div>

      <div>
        <h3>Medications Due Today</h3>
        {dueTodayMeds.map((med) => (
          <div key={med.id} className="medication-card">
            <h4>{med.name}</h4>
            <p>Student: {med.studentName}</p>
            <p>Dosage: {med.dosage}</p>
            <p>Time: {med.scheduledTime}</p>
            <button>Mark as Administered</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Incident Reports Examples

### Incident Reports List with Filters

```typescript
import React, { useEffect } from 'react';
import {
  useIncidentReports,
  useIncidentActions,
  useIncidentFilters,
  useIncidentListLoading
} from '@/stores';

function IncidentReportsList() {
  const { fetchReports, setFilters } = useIncidentActions();
  const reports = useIncidentReports();
  const filters = useIncidentFilters();
  const loading = useIncidentListLoading();

  useEffect(() => {
    fetchReports(filters);
  }, [filters, fetchReports]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <div className="filters">
        <select
          value={filters.severity || ''}
          onChange={(e) => handleFilterChange({ ...filters, severity: e.target.value })}
        >
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="reviewed">Reviewed</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div>Loading incidents...</div>
      ) : (
        <div className="incident-list">
          {reports.map((report) => (
            <div key={report.id} className="incident-card">
              <h3>{report.type}</h3>
              <p>{report.description}</p>
              <span className={`severity-${report.severity}`}>{report.severity}</span>
              <span className={`status-${report.status}`}>{report.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Advanced Patterns

### Multiple Related Entities

```typescript
import React, { useEffect } from 'react';
import {
  useStudentById,
  useMedicationsByStudent,
  useAppointmentsByStudent,
  useContactsByStudent,
  useDocumentsByStudent,
  useStudentsActions,
  useMedicationsActions,
  useAppointmentsActions
} from '@/stores';

function StudentFullProfile({ studentId }: { studentId: string }) {
  const student = useStudentById(studentId);
  const medications = useMedicationsByStudent(studentId);
  const appointments = useAppointmentsByStudent(studentId);
  const contacts = useContactsByStudent(studentId);
  const documents = useDocumentsByStudent(studentId);

  const { fetchById: fetchStudent } = useStudentsActions();
  const { fetchAll: fetchMedications } = useMedicationsActions();
  const { fetchAll: fetchAppointments } = useAppointmentsActions();

  useEffect(() => {
    // Fetch all related data in parallel
    Promise.all([
      fetchStudent(studentId),
      fetchMedications({ studentId }),
      fetchAppointments({ studentId }),
    ]);
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="student-profile">
      <header>
        <h1>{student.firstName} {student.lastName}</h1>
        <p>Grade {student.grade} | ID: {student.studentNumber}</p>
      </header>

      <div className="profile-grid">
        <section>
          <h2>Medications ({medications.length})</h2>
          {/* Render medications */}
        </section>

        <section>
          <h2>Appointments ({appointments.length})</h2>
          {/* Render appointments */}
        </section>

        <section>
          <h2>Emergency Contacts ({contacts.length})</h2>
          {/* Render contacts */}
        </section>

        <section>
          <h2>Documents ({documents.length})</h2>
          {/* Render documents */}
        </section>
      </div>
    </div>
  );
}
```

### Optimistic Updates

```typescript
import React from 'react';
import { useIncidentActions, useCurrentIncident } from '@/stores';
import toast from 'react-hot-toast';

function IncidentQuickActions() {
  const { optimisticUpdate, updateReport } = useIncidentActions();
  const currentIncident = useCurrentIncident();

  const handleQuickStatusChange = async (newStatus: string) => {
    if (!currentIncident) return;

    // Optimistically update UI immediately
    optimisticUpdate(currentIncident.id, { status: newStatus });

    try {
      // Then make the API call
      await updateReport(currentIncident.id, { status: newStatus }).unwrap();
      toast.success('Status updated');
    } catch (error) {
      // If API call fails, Redux will revert the optimistic update
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="quick-actions">
      <button onClick={() => handleQuickStatusChange('reviewed')}>
        Mark as Reviewed
      </button>
      <button onClick={() => handleQuickStatusChange('closed')}>
        Close Incident
      </button>
    </div>
  );
}
```

### Bulk Operations

```typescript
import React, { useState } from 'react';
import { useStudents, useStudentsActions } from '@/stores';
import toast from 'react-hot-toast';

function StudentsBulkActions() {
  const students = useStudents();
  const { bulkDelete } = useStudentsActions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = () => {
    setSelectedIds(students.map(s => s.id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Delete ${selectedIds.length} students?`)) {
      try {
        await bulkDelete(selectedIds);
        toast.success(`${selectedIds.length} students deleted`);
        setSelectedIds([]);
      } catch (error) {
        toast.error('Failed to delete students');
      }
    }
  };

  return (
    <div>
      <div className="bulk-actions">
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
          Delete Selected ({selectedIds.length})
        </button>
      </div>

      <div className="student-list">
        {students.map((student) => (
          <div key={student.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(student.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds([...selectedIds, student.id]);
                } else {
                  setSelectedIds(selectedIds.filter(id => id !== student.id));
                }
              }}
            />
            <span>{student.firstName} {student.lastName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Custom Selectors with Memoization

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { useMemoizedSelector } from '@/stores';
import type { RootState } from '@/stores';

// Define a custom memoized selector
const selectStudentsWithCriticalMedications = createSelector(
  [
    (state: RootState) => state.students,
    (state: RootState) => state.medications,
  ],
  (studentsState, medicationsState) => {
    const students = Object.values(studentsState.entities);
    const medications = Object.values(medicationsState.entities);

    return students.filter(student =>
      medications.some(med =>
        med?.studentId === student?.id &&
        med?.priority === 'critical'
      )
    );
  }
);

function CriticalMedicationAlert() {
  const criticalStudents = useMemoizedSelector(
    (state: RootState) => selectStudentsWithCriticalMedications(state),
    []
  );

  return (
    <div className="alert critical">
      <h3>⚠️ Students with Critical Medications</h3>
      <p>{criticalStudents.length} students require immediate attention</p>
      <ul>
        {criticalStudents.map(student => (
          <li key={student.id}>{student.firstName} {student.lastName}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Best Practices

### 1. Always Use Typed Hooks

```typescript
// ✅ GOOD
import { useAppSelector, useAppDispatch } from '@/stores';

// ❌ BAD
import { useSelector, useDispatch } from 'react-redux';
```

### 2. Use Domain Hooks for Convenience

```typescript
// ✅ GOOD - Simple and readable
import { useActiveStudents, useStudentsActions } from '@/stores';

// ❌ AVOID - More verbose
import { useAppSelector } from '@/stores';
const activeStudents = useAppSelector(state =>
  Object.values(state.students.entities).filter(s => s?.isActive)
);
```

### 3. Handle Loading and Error States

```typescript
// ✅ GOOD
function MyComponent() {
  const data = useData();
  const loading = useAppSelector(state => state.data.loading.list.isLoading);
  const error = useAppSelector(state => state.data.loading.list.error);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <DataDisplay data={data} />;
}
```

### 4. Unwrap Async Actions for Error Handling

```typescript
// ✅ GOOD - Explicit error handling
try {
  await create(data).unwrap();
  toast.success('Created successfully');
} catch (error) {
  toast.error(error.message);
}

// ❌ AVOID - Silent failures
create(data); // No error handling
```

### 5. Clean Up on Unmount if Needed

```typescript
function MyComponent() {
  const { resetState } = useIncidentActions();

  useEffect(() => {
    return () => {
      // Clean up state when component unmounts
      resetState();
    };
  }, [resetState]);

  return <div>...</div>;
}
```

## Testing Examples

### Testing Components with Redux

```typescript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studentsReducer } from '@/stores';
import StudentsList from './StudentsList';

describe('StudentsList', () => {
  it('displays students from Redux store', () => {
    const mockStore = configureStore({
      reducer: {
        students: studentsReducer,
      },
      preloadedState: {
        students: {
          entities: {
            '1': { id: '1', firstName: 'John', lastName: 'Doe', grade: '5' },
          },
          ids: ['1'],
        },
      },
    });

    render(
      <Provider store={mockStore}>
        <StudentsList />
      </Provider>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});
```

---

For more information, see the [Redux Store README](./README.md).
