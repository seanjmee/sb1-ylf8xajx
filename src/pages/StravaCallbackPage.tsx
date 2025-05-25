import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../lib/store';

export const StravaCallbackPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  
  useEffect(() => {
    const handleStravaAuth = async () => {
      try {
        if (!user) {
          throw new Error('You must be logged in');
        }
        
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const error = params.get('error');
        
        if (error) {
          throw new Error(`Strava authorization error: ${error}`);
        }
        
        if (!code) {
          throw new Error('No authorization code received from Strava');
        }
        
        // Exchange code for tokens
        // In a real app, this would call a Supabase Edge Function
        // to securely exchange the code for tokens
        
        // For now, simulate the process
        setIsLoading(true);
        
        // Simulate token exchange success
        const tokens = {
          access_token: 'simulated_access_token',
          refresh_token: 'simulated_refresh_token',
          expires_at: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
        };
        
        // Store tokens in Supabase
        const { error: saveError } = await supabase
          .from('strava_tokens')
          .upsert({
            user_id: user.id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (saveError) {
          throw saveError;
        }
        
        // Redirect to dashboard after successful connection
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Strava connection error:', err);
        setError(err.message || 'Failed to connect to Strava');
        setIsLoading(false);
      }
    };
    
    handleStravaAuth();
  }, [location, navigate, user]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold">Connecting to Strava</h2>
        <p className="text-gray-600 mt-2">Please wait while we connect your account...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mb-4">
          <h2 className="text-lg font-semibold">Connection Failed</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  return null;
};