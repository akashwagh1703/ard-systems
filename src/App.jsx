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
import MedicineDashboard from './components/microservices/medicine-management/MedicineDashboard';
import DiseaseDashboard from './components/microservices/disease-surveillance/DiseaseDashboard';
import MVUDashboard from './components/microservices/mvu-management/MVUDashboard';
import TrainingDashboard from './components/microservices/training-management/TrainingDashboard';
import ExpenditureDashboard from './components/microservices/expenditure-monitoring/ExpenditureDashboard';
import FarmReportingDashboard from './components/microservices/farm-reporting/FarmReportingDashboard';
import OnCallAIDashboard from './components/microservices/oncall-ai/OnCallAIDashboard';
import GrievanceDashboard from './components/microservices/grievance-system/GrievanceDashboard';
import IntegrationHub from './components/integrations/IntegrationHub';
import ReportCenter from './components/reports/ReportCenter';

// Test Components (can be removed after verification)
import TestDailyAnalytics from './components/dashboard/TestDailyAnalytics';
import TestResourceData from './components/dashboard/TestResourceData';
import TestDistrictCharts from './components/dashboard/TestDistrictCharts';
import TestMonthlyTrends from './components/dashboard/TestMonthlyTrends';
import TestFarmerCharts from './components/dashboard/TestFarmerCharts';
import TestResourceAnalytics from './components/dashboard/TestResourceAnalytics';
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

            <Route path="/services/ai-management/*"         element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AIDashboard /></Protected>} />
            <Route path="/services/semen-services/*"        element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><SemenServicesDashboard /></Protected>} />
            <Route path="/services/vaccine-management/*"    element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><VaccineDashboard /></Protected>} />
            <Route path="/services/medicine-management/*"   element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><MedicineDashboard /></Protected>} />
            <Route path="/services/disease-surveillance/*"  element={<Protected roles={['super_admin','district_officer','field_user']}><DiseaseDashboard /></Protected>} />
            <Route path="/services/mvu-management/*"        element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><MVUDashboard /></Protected>} />
            <Route path="/services/training-management/*"   element={<Protected roles={['super_admin','district_officer']}><TrainingDashboard /></Protected>} />
            <Route path="/services/expenditure-monitoring/*"element={<Protected roles={['super_admin','district_officer']}><ExpenditureDashboard /></Protected>} />
            <Route path="/services/farm-reporting/*"        element={<Protected roles={['super_admin','district_officer','farmer']}><FarmReportingDashboard /></Protected>} />
            <Route path="/services/oncall-ai/*"             element={<Protected roles={['farmer','field_user','super_admin']}><OnCallAIDashboard /></Protected>} />
            <Route path="/services/grievance-system/*"      element={<Protected><GrievanceDashboard /></Protected>} />
            <Route path="/integrations"                      element={<Protected><IntegrationHub /></Protected>} />
            <Route path="/reports"                           element={<Protected><ReportCenter /></Protected>} />
            <Route path="/test-analytics"                    element={<Protected><TestDailyAnalytics /></Protected>} />
            <Route path="/test-resource-data"                element={<Protected><TestResourceData /></Protected>} />
            <Route path="/test-district-charts"              element={<Protected><TestDistrictCharts /></Protected>} />
            <Route path="/test-monthly-trends"               element={<Protected><TestMonthlyTrends /></Protected>} />
            <Route path="/test-farmer-charts"                element={<Protected><TestFarmerCharts /></Protected>} />
            <Route path="/test-resource-analytics"           element={<Protected><TestResourceAnalytics /></Protected>} />
            <Route path="/admin/farms" element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId" element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId/groups/:groupId" element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId/groups/:groupId/animals/:animalId" element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AdminHierarchy /></Protected>} />
            <Route path="/admin/farms/:farmId/groups/:groupId/animals/:animalId/report" element={<Protected roles={['super_admin','district_officer','block_officer','field_user']}><AdminHierarchy /></Protected>} />

            {/* ── Farmer Portal ── */}
            <Route path="/farmer/login"     element={<FarmerLogin />} />
            <Route path="/farmer/dashboard" element={<FarmerPage><FarmerDashboard /></FarmerPage>} />
            <Route path="/farmer/animals"   element={<FarmerPage><AnimalManagement /></FarmerPage>} />
            <Route path="/farmer/milk"      element={<FarmerPage><MilkProduction /></FarmerPage>} />
            <Route path="/farmer/health"    element={<FarmerPage><HealthRecords /></FarmerPage>} />
            <Route path="/farmer/services"  element={<FarmerPage><ServicesModule /></FarmerPage>} />
            <Route path="/farmer/reports"   element={<FarmerPage><ReportsModule /></FarmerPage>} />
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
