import React from 'react';
import { Check, X } from 'lucide-react';
import { useUserStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

export const SubscriptionPage: React.FC = () => {
  const { subscription } = useUserStore();
  
  const handleUpgrade = async () => {
    // In a real app, this would redirect to a Stripe checkout page
    // created by a Supabase Edge Function
    alert('This would redirect to Stripe checkout in a real app');
  };
  
  const handleManageSubscription = async () => {
    // In a real app, this would redirect to a customer portal
    // created by a Supabase Edge Function
    alert('This would redirect to Stripe customer portal in a real app');
  };
  
  const isPro = subscription?.tier === 'pro' && subscription?.status === 'active';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <p className="text-gray-600 mt-1">
          Choose the plan that best fits your training needs
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className={`border-2 ${!isPro ? 'border-blue-500' : 'border-gray-200'}`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-baseline">
              <span>Free Plan</span>
              <span className="text-2xl font-bold">$0</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Strava data analysis</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Basic workout tracking</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Calendar view</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>1 AI-generated plan per month</span>
              </li>
              <li className="flex items-start">
                <X size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <X size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Custom plan adjustments</span>
              </li>
              <li className="flex items-start">
                <X size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Priority support</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            {isPro ? (
              <Button
                variant="outline"
                fullWidth
                onClick={handleManageSubscription}
              >
                Switch to Free
              </Button>
            ) : (
              <Button
                variant="secondary"
                fullWidth
                disabled
              >
                Current Plan
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Pro Plan */}
        <Card className={`border-2 ${isPro ? 'border-blue-500' : 'border-gray-200'}`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-baseline">
              <span>Pro Plan</span>
              <div>
                <span className="text-2xl font-bold">$9.99</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Strava data analysis</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Advanced workout tracking</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Calendar view with drag & drop</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Unlimited AI-generated plans</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Advanced analytics and insights</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Custom plan adjustments</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            {isPro ? (
              <Button
                variant="secondary"
                fullWidth
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                variant="primary"
                fullWidth
                onClick={handleUpgrade}
              >
                Upgrade to Pro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};