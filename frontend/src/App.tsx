import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { TestModeProvider } from './contexts/TestModeContext';

import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CreatorPage } from './pages/CreatorPage';

import { DashboardPage } from './pages/DashboardPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { MakePaymentPage } from './pages/MakePaymentPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { PaymentDetailPage } from './pages/PaymentDetailPage';
import { CardsPage } from './pages/CardsPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { RiskCenterPage } from './pages/RiskCenterPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { ReconciliationPage } from './pages/ReconciliationPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// ─── Credit Intelligence & CreditGrow AI Pages ────────────────────────────────
import { CreditOverviewPage } from './pages/credit/CreditOverviewPage';
import { CreditApplicantsPage } from './pages/credit/CreditApplicantsPage';
import { CreditApplicationPage } from './pages/credit/CreditApplicationPage';
import { CreditProfilePage } from './pages/credit/CreditProfilePage';
import { CreditRiskPage } from './pages/credit/CreditRiskPage';
import { LoanSimulatorPage } from './pages/credit/LoanSimulatorPage';
import { AiCreditAdvisorPage } from './pages/credit/AiCreditAdvisorPage';
import { ConsentPrivacyPage } from './pages/credit/ConsentPrivacyPage';
import { HumanReviewPage } from './pages/credit/HumanReviewPage';
import { CreditRevenuePage } from './pages/credit/CreditRevenuePage';
import { CreditJourneyPage } from './pages/credit/CreditJourneyPage';
import { CreditAgentsPage } from './pages/credit/CreditAgentsPage';
import { CreditReportPage } from './pages/credit/CreditReportPage';

// ─── Multi-Agent Operations Center Pages ─────────────────────────────────────
import AgentsLandingPage from './pages/agents/AgentsLandingPage';
import AgentDetailPage from './pages/agents/AgentDetailPage';
import AgentTaskExecutionPage from './pages/agents/AgentTaskExecutionPage';
import ActionApprovalCenterPage from './pages/agents/ActionApprovalCenterPage';
import AgentPolicySettingsPage from './pages/agents/AgentPolicySettingsPage';

import { ROUTES } from './utils/constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TestModeProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              {/* Public Landing & Marketing */}
              <Route path={ROUTES.HOME} element={<LandingPage />} />
              <Route path="/creator" element={<CreatorPage />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected Main Application Shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
                <Route path={ROUTES.PAYMENT_CREATE} element={<MakePaymentPage />} />
                <Route path={ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccessPage />} />
                <Route path={ROUTES.PAYMENT_FAILED} element={<PaymentFailedPage />} />
                <Route path={ROUTES.PAYMENT_DETAIL} element={<PaymentDetailPage />} />
                <Route path={ROUTES.CARDS} element={<CardsPage />} />
                <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
                <Route path={ROUTES.CUSTOMER_DETAIL} element={<CustomerDetailPage />} />
                <Route path={ROUTES.RISK_CENTER} element={<RiskCenterPage />} />
                <Route path={ROUTES.RECOVERY} element={<RecoveryPage />} />
                <Route path={ROUTES.RECONCILIATION} element={<ReconciliationPage />} />
                <Route path={ROUTES.AI_ASSISTANT} element={<AiAssistantPage />} />
                <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogsPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

                {/* ─── Credit Intelligence & CreditGrow AI Module Routes ────────── */}
                <Route path={ROUTES.CREDIT_OVERVIEW} element={<CreditOverviewPage />} />
                <Route path={ROUTES.CREDIT_APPLICANTS} element={<CreditApplicantsPage />} />
                <Route path={ROUTES.CREDIT_APPLY} element={<CreditApplicationPage />} />
                <Route path={ROUTES.CREDIT_PROFILE} element={<CreditProfilePage />} />
                <Route path={ROUTES.CREDIT_RISK} element={<CreditRiskPage />} />
                <Route path={ROUTES.CREDIT_SIMULATOR} element={<LoanSimulatorPage />} />
                <Route path={ROUTES.CREDIT_AI} element={<AiCreditAdvisorPage />} />
                <Route path={ROUTES.CREDIT_PRIVACY} element={<ConsentPrivacyPage />} />
                <Route path={ROUTES.CREDIT_REVIEW} element={<HumanReviewPage />} />
                <Route path={ROUTES.CREDIT_REVENUE} element={<CreditRevenuePage />} />
                <Route path={ROUTES.CREDIT_JOURNEY} element={<CreditJourneyPage />} />
                <Route path={ROUTES.CREDIT_AGENTS} element={<CreditAgentsPage />} />
                <Route path={ROUTES.CREDIT_REPORT} element={<CreditReportPage />} />

                {/* ─── Multi-Agent Operations Center Routes ──────────────────── */}
                <Route path={ROUTES.AGENTS_LANDING} element={<AgentsLandingPage />} />
                <Route path="/agents/tasks/:id" element={<AgentTaskExecutionPage />} />
                <Route path={ROUTES.ACTION_APPROVALS} element={<ActionApprovalCenterPage />} />
                <Route path={ROUTES.AGENT_POLICIES} element={<AgentPolicySettingsPage />} />
                <Route path="/agents/:id" element={<AgentDetailPage />} />
              </Route>

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </SidebarProvider>
      </TestModeProvider>
    </AuthProvider>
  );
};
