import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};
import { FaviconUpdater } from "@/components/FaviconUpdater";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { MotionConfigProvider } from "@/components/motion/MotionConfigProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

const Solucoes = lazy(() => import("./pages/Solucoes"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Consultoria       = lazy(() => import("./pages/Consultoria"));
const ConsultoriaSessao = lazy(() => import("./pages/ConsultoriaSessao"));
const DiagnosticoPage   = lazy(() => import("./pages/DiagnosticoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <FaviconUpdater />
          <ErrorBoundary>
            <SmoothScrollProvider>
              <MotionConfigProvider>
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/solucoes" element={<Solucoes />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/manifesto" element={<Manifesto />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/consultoria" element={<Consultoria />} />
                    <Route path="/consultoria/sessao" element={<ConsultoriaSessao />} />
                    <Route path="/diagnostico" element={<DiagnosticoPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </MotionConfigProvider>
            </SmoothScrollProvider>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
