import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/utils/errorBoundary";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { RequireAuth, RequireAdmin } from "@/features/auth/guards";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/app/LoginPage"));
const AppLayout = lazy(() => import("./pages/app/AppLayout"));
const DashboardPage = lazy(() => import("./pages/app/DashboardPage"));
const ProjectPage = lazy(() => import("./pages/app/ProjectPage"));
const AdminPage = lazy(() => import("./pages/app/AdminPage"));
const EquitySettingsPage = lazy(() => import("./features/equity/pages/EquitySettingsPage"));
const ProjectEquityPage = lazy(() => import("./features/equity/pages/ProjectEquityPage"));
const EquityLedgerPage = lazy(() => import("./features/equity/pages/EquityLedgerPage"));
const MyEquityPage = lazy(() => import("./features/equity/pages/MyEquityPage"));
const HowItWorksPage = lazy(() => import("./pages/app/HowItWorksPage"));
const ChangePasswordPage = lazy(() => import("./pages/app/ChangePasswordPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <LoadingSpinner />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/privacidad" element={<LegalPage />} />
                  <Route path="/cookies" element={<LegalPage />} />
                  <Route path="/aviso-legal" element={<LegalPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/app/cambiar-contrasena" element={<ChangePasswordPage />} />
                  <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
                    <Route index element={<DashboardPage />} />
                    <Route path="me/equity" element={<MyEquityPage />} />
                    <Route path="como-funciona" element={<HowItWorksPage />} />
                    <Route path="projects/:id" element={<ProjectPage />} />
                    <Route path="projects/:id/equity" element={<ProjectEquityPage />} />
                    <Route path="projects/:id/equity/ledger" element={<EquityLedgerPage />} />
                  </Route>
                  <Route path="/Venturebuilder" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
                  <Route path="/Venturebuilder/equity" element={<RequireAdmin><EquitySettingsPage /></RequireAdmin>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
