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
    // Restore session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session); // Optional debug
      useUserStore.setState({ user: session?.user ?? null, isLoading: false });
    });

    // Listen for login/logout/session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session); // Optional debug
      useUserStore.setState({ user: session?.user ?? null, isLoading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-scree
