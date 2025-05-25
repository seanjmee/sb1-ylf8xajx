import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useUserStore } from './lib/store';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { StravaCallbackPage } from './pages/StravaCallbackPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { SubscriptionSuccessPage } from './pages/SubscriptionSuccessPage';
import { AppLayout } from './components/Layout/AppLayout';

function App() {
  const { user, isLoading } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        useUserStore.setState({ user: session.user, isLoading: false });
      } else {
        useUserStore.setState({ user: null, isLoading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        useUserStore.setState({ user: session.user, isLoading: false });
      } else {
        useUserStore.setState({ user: null, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={user ? <OnboardingPage /> : <Navigate to="/auth" />} />
        <Route path="/strava/callback" element={user ? <StravaCallbackPage /> : <Navigate to="/auth" />} />
        <Route path="/subscription" element={user ? <SubscriptionPage /> : <Navigate to="/auth" />} />
        <Route path="/subscription/success" element={user ? <SubscriptionSuccessPage /> : <Navigate to="/auth" />} />
        <Route path="/" element={user ? <AppLayout /> : <Navigate to="/auth" />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;