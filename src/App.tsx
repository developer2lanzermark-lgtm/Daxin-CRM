import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CandidateProvider } from './context/CandidateContext';
import { OptionsProvider } from './context/OptionsContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeListPage } from './pages/ResumeListPage';
import { AddResumePage } from './pages/AddResumePage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { CandidateReviewPage } from './pages/CandidateReviewPage';
import { CandidateCallPage } from './pages/CandidateCallPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <OptionsProvider>
      <CandidateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="resumes" element={<ResumeListPage />} />
            <Route path="add-resume" element={<AddResumePage />} />
            <Route path="candidate/:id" element={<CandidateDetailPage />} />
            <Route path="candidate/:id/review" element={<CandidateReviewPage />} />
            <Route path="candidate/:id/call" element={<CandidateCallPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </CandidateProvider>
    </OptionsProvider>
  );
}

export default App;
