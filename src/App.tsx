import { ThemeProvider } from '@/components/theme-provider';
import { PortfolioLoader } from '@/components/PortfolioLoader';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Index = lazy(() => import('./pages/Index'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const MouseTrail = lazy(() => import('@/components/sections/mauseTrail/MauseTrail'));

const queryClient = new QueryClient();
const LOADER_SESSION_KEY = 'portfolio_loader_seen';

function shouldShowPortfolioLoader() {
  if (typeof window === 'undefined') return false;
  const seen = window.sessionStorage.getItem(LOADER_SESSION_KEY);
  if (seen) return false;
  window.sessionStorage.setItem(LOADER_SESSION_KEY, '1');
  return true;
}

const App = () => {
  const [showPortfolioLoader, setShowPortfolioLoader] = useState(() => shouldShowPortfolioLoader());
  const [isAppReady, setIsAppReady] = useState(() => !showPortfolioLoader);

  useEffect(() => {
    if (!showPortfolioLoader) {
      setIsAppReady(true);
      return;
    }

    let cancelled = false;

    const markReady = async () => {
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore fonts readiness failure
        }
      }
      if (!cancelled) {
        setIsAppReady(true);
      }
    };

    if (document.readyState === 'complete') {
      void markReady();
      return () => {
        cancelled = true;
      };
    }

    window.addEventListener('load', markReady, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', markReady);
    };
  }, [showPortfolioLoader]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className={`page-content${showPortfolioLoader ? '' : ' show'}`}>
            <Toaster richColors position="top-right" />

            {/* ROUTER */}
            <Suspense
              fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>

          {showPortfolioLoader && (
            <PortfolioLoader
              isReady={isAppReady}
              onFinish={() => {
                setShowPortfolioLoader(false);
              }}
            />
          )}

          {!showPortfolioLoader && (
            <Suspense fallback={null}>
              <MouseTrail />
            </Suspense>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
