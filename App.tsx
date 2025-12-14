
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { Terms, Privacy } from './components/Legal';

type ViewState = 'landing' | 'auth' | 'app' | 'terms' | 'privacy';

export default function App() {
  // Initialize view based on URL query parameter to support new tab navigation
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'app') return 'app';
    }
    return 'landing';
  });

  // Navigation Handlers
  const goHome = () => {
    // If we are in the separate app tab, going home means going back to landing state
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('view');
        window.history.pushState({}, '', url);
    }
    setCurrentView('landing');
  };

  const enterApp = () => {
    // Switch to app view in a new tab as requested
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('view', 'app');
        window.open(url.toString(), '_blank');
    }
  };

  // Render Logic
  let content;
  switch (currentView) {
    case 'landing':
      content = <LandingPage onLogin={enterApp} onNavigate={(page) => setCurrentView(page)} />;
      break;
    case 'terms':
      content = <Terms onBack={goHome} />;
      break;
    case 'privacy':
      content = <Privacy onBack={goHome} />;
      break;
    case 'app':
      // The Dashboard component internally handles the "Login Screen" vs "Dashboard Screen"
      content = <Dashboard onBackToHome={goHome} />;
      break;
    default:
      content = <LandingPage onLogin={enterApp} onNavigate={(page) => setCurrentView(page)} />;
  }

  return <>{content}</>;
}
