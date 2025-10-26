/**
 * Integration Routes Configuration
 * Defines all routes for integration management with proper access control
 */

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  IntegrationsList,
  IntegrationDetails,
  IntegrationForm,
  IntegrationDashboard,
  IntegrationLogs,
  StatisticsCharts,
  HealthStatus,
  ConnectionTest,
  SyncControls,
  WebhookConfiguration,
  BatchActions,
  IntegrationWizard,
  Diagnostics,
  SISIntegrationSetup,
  EHRIntegrationSetup,
  PharmacyIntegrationSetup,
  LaboratoryIntegrationSetup,
  InsuranceIntegrationSetup,
} from './components';

/**
 * Integration Routes Component
 * Comprehensive routing for integration management functionality
 */
export const IntegrationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Integration Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}
          >
            <IntegrationDashboard />
          </ProtectedRoute>
        }
      />

      {/* Integration List View */}
      <Route
        path="/list"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']}
          >
            <IntegrationsList />
          </ProtectedRoute>
        }
      />

      {/* Create New Integration */}
      <Route
        path="/create"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <IntegrationForm />
          </ProtectedRoute>
        }
      />

      {/* Integration Setup Wizard */}
      <Route
        path="/wizard"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <IntegrationWizard />
          </ProtectedRoute>
        }
      />

      {/* Individual Integration Details */}
      <Route
        path="/:integrationId"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']}
          >
            <IntegrationDetails />
          </ProtectedRoute>
        }
      />

      {/* Edit Integration */}
      <Route
        path="/:integrationId/edit"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <IntegrationForm />
          </ProtectedRoute>
        }
      />

      {/* Integration Logs */}
      <Route
        path="/:integrationId/logs"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}
          >
            <IntegrationLogs />
          </ProtectedRoute>
        }
      />

      {/* All Integration Logs */}
      <Route
        path="/logs/all"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}
          >
            <IntegrationLogs />
          </ProtectedRoute>
        }
      />

      {/* Connection Testing */}
      <Route
        path="/:integrationId/test"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}
          >
            <ConnectionTest />
          </ProtectedRoute>
        }
      />

      {/* Sync Controls */}
      <Route
        path="/:integrationId/sync"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}
          >
            <SyncControls />
          </ProtectedRoute>
        }
      />

      {/* Webhook Configuration */}
      <Route
        path="/:integrationId/webhooks"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <WebhookConfiguration />
          </ProtectedRoute>
        }
      />

      {/* Statistics and Analytics */}
      <Route
        path="/statistics"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']}
          >
            <StatisticsCharts />
          </ProtectedRoute>
        }
      />

      {/* Health Status Overview */}
      <Route
        path="/health"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']}
          >
            <HealthStatus />
          </ProtectedRoute>
        }
      />

      {/* Batch Operations */}
      <Route
        path="/batch"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <BatchActions />
          </ProtectedRoute>
        }
      />

      {/* Diagnostics and Troubleshooting */}
      <Route
        path="/diagnostics"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}
          >
            <Diagnostics />
          </ProtectedRoute>
        }
      />

      {/* Type-Specific Setup Routes */}
      <Route
        path="/setup/sis"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <SISIntegrationSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setup/ehr"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'NURSE']}
          >
            <EHRIntegrationSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setup/pharmacy"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'NURSE']}
          >
            <PharmacyIntegrationSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setup/laboratory"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'NURSE']}
          >
            <LaboratoryIntegrationSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setup/insurance"
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}
          >
            <InsuranceIntegrationSetup />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default IntegrationRoutes;
