import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FarmerAuthProvider } from './contexts/FarmerAuthContext';
import LoginPage from './components/auth/LoginPage';
import MainDashboard from './components/dashboard/MainDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/common/AppShell';

// Microservice Dashboards
import AIDashboard from './components/microservices/ai-management/AIDashboard';
import SemenServicesDashboard from './components/microservices/semen-services/SemenServicesDashboard';
import VaccineDashboard from './components/microservices/vaccine-management/VaccineDashboard';
import MedicinePhase3Dashboard from './components/microservices/medicine-management/MedicinePhase3Dashboard';
import DiseasePhase3Dashboard from './components/microservices/disease-surveillance/DiseasePhase3Dashboard';
import MVUPhase4Dashboard from './components/microservices/mvu-management/MVUPhase4Dashboard';
import TrainingPhase4Dashboard from './components/microservices/training-management/TrainingPhase4Dashboard';
import ExpenditurePhase4Dashboard from './components/microservices/expenditure-monitoring/ExpenditurePhase4Dashboard';
import FarmReportingPhase4Dashboard from './components/microservices/farm-reporting/FarmReportingPhase4Dashboard';
import OnCallAIPhase5Dashboard from './components/microservices/oncall-ai/OnCallAIPhase5Dashboard';
import GrievanceDashboard from './components/microservices/grievance-system/GrievanceDashboard';
import IntegrationHub from './components/integrations/IntegrationHub';
import ReportCenter from './components/reports/ReportCenter';

import AdminHierarchy from './components/dashboard/AdminHierarchy';

// Farmer Portal
import FarmerLogin from './components/farmer/FarmerLogin';
import FarmerShell from './components/farmer/FarmerShell';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import AnimalManagement from './components/farmer/AnimalManagement';
import MilkProduction from './components/farmer/MilkProduction';
import HealthRecords from './components/farmer/HealthRecords';
import ServicesModule from './components/farmer/ServicesModule';
import ReportsModule from './components/farmer/ReportsModule';
import AIAssistantModule from './components/farmer/AIAssistantModule';
import FarmHierarchy from './components/farmer/FarmHierarchy';
import FarmerDiseaseTrack from './components/farmer/FarmerDiseaseTrack';
import FarmerTraining from './components/farmer/FarmerTraining';
import FarmerGrievance from './components/farmer/FarmerGrievance';

/* Wrap a page with ProtectedRoute + AppShell */
const Protected = ({ children, roles = [] }) => (
  <ProtectedRoute requiredRoles={roles}>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
);

/* Wrap farmer page with FarmerShell */
const FarmerPage = ({ children }) => (
  <FarmerShell>{children}</FarmerShell>
);

function App() {
  return (
    <FarmerAuthProvider>
      <AuthProvider>
        <Router basename="/ard-systems">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<Protected><MainDashboard /></Protected>} />

            <Route path="/services/ai-management/*"         element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><AIDashboard /></Protected>} />
            <Route path="/services/semen-services/*"        element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><SemenServicesDashboard /></Protected>} />
            <Route path="/services/vaccine-management/*"    element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><VaccineDashboard /></Protected>} />
            <Route path="/services/medicine-management/*"   element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><MedicinePhase3Dashboard /></Protected>} />
            <Route path="/services/disease-surveillance/*"  element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','field_user']}><DiseasePhase3Dashboard /></Protected>} />
            <Route path="/services/mvu-management/*"        element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><MVUPhase4Dashboard /></Protected>} />
            <Route path="/services/training-management/*"   element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','voti_admin']}><TrainingPhase4Dashboard /></Protected>} />
            <Route path="/services/expenditure-monitoring/*"element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh']}><ExpenditurePhase4Dashboard /></Protected>} />
            <Route path="/services/farm-reporting/*"        element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','farmer']}><FarmReportingPhase4Dashboard /></Protected>} />
            <Route path="/services/oncall-ai/*"             element={<Protected roles={['farmer','field_user','super_admin','directorate']}><OnCallAIPhase5Dashboard /></Protected>} />
            <Route path="/services/grievance-system/*"      element={<Protected><GrievanceDashboard /></Protected>} />
            <Route path="/integrations"                      element={<Protected><IntegrationHub /></Protected>} />
            <Route path="/reports"                           element={<Protected><ReportCenter /></Protected>} />
            <Route path="/admin/farms" element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId" element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId/groups/:groupId" element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId/groups/:groupId/animals/:animalId" element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId/groups/:groupId/animals/:animalId/report" element={<Protected roles={['super_admin','directorate','district_officer','sdvo','dd_dvh','block_officer','field_user']}><AdminHierarchy /></Protected>} />

            {/* ── Farmer Portal ── */}
            <Route path="/farmer/login"     element={<FarmerLogin />} />
            <Route path="/farmer/dashboard" element={<FarmerPage><FarmerDashboard /></FarmerPage>} />
            <Route path="/farmer/animals"   element={<FarmerPage><AnimalManagement /></FarmerPage>} />
            <Route path="/farmer/milk"      element={<FarmerPage><MilkProduction /></FarmerPage>} />
            <Route path="/farmer/health"    element={<FarmerPage><HealthRecords /></FarmerPage>} />
            <Route path="/farmer/services"  element={<FarmerPage><ServicesModule /></FarmerPage>} />
            <Route path="/farmer/reports"   element={<FarmerPage><ReportsModule /></FarmerPage>} />
            <Route path="/farmer/disease-track" element={<FarmerPage><FarmerDiseaseTrack /></FarmerPage>} />
            <Route path="/farmer/training"  element={<FarmerPage><FarmerTraining /></FarmerPage>} />
            <Route path="/farmer/grievance" element={<FarmerPage><FarmerGrievance /></FarmerPage>} />
            <Route path="/farmer/ai"        element={<FarmerPage><AIAssistantModule /></FarmerPage>} />
            <Route path="/farmer/farms"     element={<FarmerPage><FarmHierarchy /></FarmerPage>} />
            <Route path="/farmer/farms/:farmId" element={<FarmerPage><FarmHierarchy /></FarmerPage>} />
            <Route path="/farmer/farms/:farmId/groups/:groupId" element={<FarmerPage><FarmHierarchy /></FarmerPage>} />
            <Route path="/farmer/farms/:farmId/groups/:groupId/animals/:animalId" element={<FarmerPage><FarmHierarchy /></FarmerPage>} />
            <Route path="/farmer/farms/:farmId/groups/:groupId/animals/:animalId/report" element={<FarmerPage><FarmHierarchy /></FarmerPage>} />
          </Routes>
        </Router>
      </AuthProvider>
    </FarmerAuthProvider>
  );
}

export default App;
