import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../lib/store';

export const SubscriptionSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkSubscriptionStatus } = useUserStore();
  
  useEffect(() => {
    // Update the subscription status in the store
    checkSubscriptionStatus();
    
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Subscription Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for upgrading to StravaGPT Pro! Your account has been successfully upgraded, and you now have access to all premium features.
        </p>
        
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button fullWidth>
              Go to Dashboard
            </Button>
          </Link>
          
          <Link to="/calendar">
            <Button variant="outline" fullWidth>
              Create Workout Plan
            </Button>
          </Link>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-8">
        You will be automatically redirected to the dashboard in a few seconds.
      </p>
    </div>
  );
};