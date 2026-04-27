import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import MainDashboard from './components/dashboard/MainDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/common/AppShell';

// Microservice Dashboards
import AIDashboard from './components/microservices/ai-management/AIDashboard';
import VaccineDashboard from './components/microservices/vaccine-management/VaccineDashboard';
import MedicineDashboard from './components/microservices/medicine-management/MedicineDashboard';
import DiseaseDashboard from './components/microservices/disease-surveillance/DiseaseDashboard';
import MVUDashboard from './components/microservices/mvu-management/MVUDashboard';
import TrainingDashboard from './components/microservices/training-management/TrainingDashboard';
import ExpenditureDashboard from './components/microservices/expenditure-monitoring/ExpenditureDashboard';
import FarmReportingDashboard from './components/microservices/farm-reporting/FarmReportingDashboard';
import OnCallAIDashboard from './components/microservices/oncall-ai/OnCallAIDashboard';
import GrievanceDashboard from './components/microservices/grievance-system/GrievanceDashboard';

/* Wrap a page with ProtectedRoute + AppShell */
const Protected = ({ children, roles = [] }) => (
  <ProtectedRoute requiredRoles={roles}>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router basename="/ard-systems">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Protected><MainDashboard /></Protected>} />

          <Route path="/services/ai-management/*"         element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AIDashboard /></Protected>} />
          <Route path="/services/vaccine-management/*"    element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><VaccineDashboard /></Protected>} />
          <Route path="/services/medicine-management/*"   element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><MedicineDashboard /></Protected>} />
          <Route path="/services/disease-surveillance/*"  element={<Protected roles={['super_admin','district_officer','field_user']}><DiseaseDashboard /></Protected>} />
          <Route path="/services/mvu-management/*"        element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><MVUDashboard /></Protected>} />
          <Route path="/services/training-management/*"   element={<Protected roles={['super_admin','district_officer']}><TrainingDashboard /></Protected>} />
          <Route path="/services/expenditure-monitoring/*"element={<Protected roles={['super_admin','district_officer']}><ExpenditureDashboard /></Protected>} />
          <Route path="/services/farm-reporting/*"        element={<Protected roles={['super_admin','district_officer','farmer']}><FarmReportingDashboard /></Protected>} />
          <Route path="/services/oncall-ai/*"             element={<Protected roles={['farmer','field_user','super_admin']}><OnCallAIDashboard /></Protected>} />
          <Route path="/services/grievance-system/*"      element={<Protected><GrievanceDashboard /></Protected>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
