import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Medications from './pages/Medications'
import Appointments from './pages/Appointments'
import HealthRecords from './pages/HealthRecords'
import IncidentReports from './pages/IncidentReports'
import EmergencyContacts from './pages/EmergencyContacts'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider } from './contexts/AuthContext'

function AppRoutes() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route
        path="/*"
        element={
          user ? (
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students/*" element={<Students />} />
                <Route path="/medications/*" element={<Medications />} />
                <Route path="/appointments/*" element={<Appointments />} />
                <Route path="/health-records/*" element={<HealthRecords />} />
                <Route path="/incident-reports/*" element={<IncidentReports />} />
                <Route path="/emergency-contacts/*" element={<EmergencyContacts />} />
                <Route path="/inventory/*" element={<Inventory />} />
                <Route path="/reports/*" element={<Reports />} />
                <Route path="/settings/*" element={<Settings />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App