import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import MainDashboard from './components/dashboard/MainDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Main Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Microservice Dashboards */}
            <Route 
              path="/services/ai-management/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer', 'block_officer', 'field_user']}>
                  <AIDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/vaccine-management/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer', 'block_officer', 'field_user']}>
                  <VaccineDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/medicine-management/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer', 'block_officer', 'field_user']}>
                  <MedicineDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/disease-surveillance/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer', 'field_user']}>
                  <DiseaseDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/mvu-management/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer', 'block_officer', 'field_user']}>
                  <MVUDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/training-management/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer']}>
                  <TrainingDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/expenditure-monitoring/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer']}>
                  <ExpenditureDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/farm-reporting/*" 
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'district_officer', 'farmer']}>
                  <FarmReportingDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/oncall-ai/*" 
              element={
                <ProtectedRoute requiredRoles={['farmer', 'field_user', 'super_admin']}>
                  <OnCallAIDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/services/grievance-system/*" 
              element={
                <ProtectedRoute>
                  <GrievanceDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;