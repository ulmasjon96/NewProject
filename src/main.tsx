import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
import './i18n/index';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const TOP_LEVEL_ROUTES = new Set(['resume']);

function inferGithubPagesBasename(pathname: string) {
  if (typeof window === 'undefined') return undefined;
  if (!window.location.hostname.endsWith('.github.io')) return undefined;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return undefined;

  const firstSegment = decodeURIComponent(segments[0]).toLowerCase();
  if (TOP_LEVEL_ROUTES.has(firstSegment)) return undefined;

  return `/${segments[0]}`;
}

function getRouterBasename(baseUrl: string) {
  const trimmed = baseUrl.trim();
  if (!trimmed || trimmed === '/' || trimmed === './' || trimmed === '.') {
    return inferGithubPagesBasename(window.location.pathname);
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const pathname = new URL(trimmed).pathname;
      const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
      if (!normalized || normalized === '/') return undefined;
      return normalized;
    } catch {
      return undefined;
    }
  }

  const normalized = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  if (!normalized || normalized === '/') return undefined;
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function setupAnalytics() {
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (plausibleDomain) {
    const plausibleScriptId = 'plausible-analytics-script';
    if (!document.getElementById(plausibleScriptId)) {
      const script = document.createElement('script');
      script.id = plausibleScriptId;
      script.defer = true;
      script.setAttribute('data-domain', plausibleDomain);
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }
  }

  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaMeasurementId) {
    const gtagScriptId = 'ga-analytics-script';
    if (!document.getElementById(gtagScriptId)) {
      const script = document.createElement('script');
      script.id = gtagScriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      document.head.appendChild(script);
    }

    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaMeasurementId, { anonymize_ip: true });
    }
  }
}

// function setupZoomLock() {
//   const onKeyDown = (event: KeyboardEvent) => {
//     if (!(event.ctrlKey || event.metaKey)) return;

//     const key = event.key;
//     if (key === '+' || key === '=' || key === '-' || key === '_' || key === '0') {
//       event.preventDefault();
//     }
//   };

//   const onWheel = (event: WheelEvent) => {
//     if (event.ctrlKey || event.metaKey) {
//       event.preventDefault();
//     }
//   };

//   window.addEventListener('keydown', onKeyDown, { passive: false });
//   window.addEventListener('wheel', onWheel, { passive: false });
// }

// setupZoomLock();
setupAnalytics();
const routerBasename = getRouterBasename(import.meta.env.BASE_URL);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={routerBasename}>
    <App />
  </BrowserRouter>,
);
