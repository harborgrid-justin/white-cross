/**
 * MedicationsDashboard Component
 * Purpose: Main medications overview dashboard
 * Features: Key metrics, due medications, alerts
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../stores/reduxStore';
import { fetchMedicationStatistics, fetchMedications } from '../store/medicationsSlice';

export const MedicationsDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { statistics, medications, loading } = useSelector((state: RootState) => state.medications);

  useEffect(() => {
    dispatch(fetchMedicationStatistics());
    dispatch(fetchMedications({ limit: 10 })); // Get recent medications
  }, [dispatch]);

  if (loading.statistics || loading.medications) {
    return (
      <div className="medications-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="medications-dashboard">
      <div className="dashboard-header">
        <h1>Medications Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn-primary">Add Medication</button>
          <button className="btn-secondary">View Reports</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{statistics?.totalActive || 0}</div>
          <div className="metric-label">Active Medications</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{statistics?.dueToday || 0}</div>
          <div className="metric-label">Due Today</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{statistics?.overdue || 0}</div>
          <div className="metric-label">Overdue</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{statistics?.expiringSoon || 0}</div>
          <div className="metric-label">Expiring Soon</div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-section">
        <h3>Alerts & Notifications</h3>
        <div className="alert-list">
          {statistics?.alerts?.map((alert: any, index: number) => (
            <div key={index} className={`alert-item ${alert.type}`}>
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <div className="alert-title">{alert.title}</div>
                <div className="alert-message">{alert.message}</div>
              </div>
            </div>
          )) || <div className="no-alerts">No alerts at this time</div>}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Medications</h3>
        <div className="activity-list">
          {medications.slice(0, 5).map((medication: any) => (
            <div key={medication.id} className="activity-item">
              <div className="medication-name">{medication.name}</div>
              <div className="student-name">{medication.studentName}</div>
              <div className="medication-status">{medication.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationsDashboard;
