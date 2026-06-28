import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ErrorBoundary } from "@/utils/errorBoundary";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CanonicalURL } from "@/components/CanonicalURL";
import { HelmetProvider } from "react-helmet-async";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const EmpleadosPage = lazy(() => import("./pages/EmpleadosPage"));
const VentureBuilderPage = lazy(() => import("./pages/VentureBuilderPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const SistemaInternoPage = lazy(() => import("./pages/SistemaInternoPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CanonicalURL />
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-black">
                  <LoadingSpinner />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/cookies" element={<CookiesPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/empleados" element={<EmpleadosPage />} />
                  <Route path="/venturebuilder" element={<VentureBuilderPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/sistemainterno" element={<SistemaInternoPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
