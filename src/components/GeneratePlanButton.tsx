import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useUserStore } from '../lib/store';

interface GeneratePlanResponse {
  success: boolean;
  plan_id: string;
  title: string;
  workout_count: number;
  error?: string;
}

export const GeneratePlanButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const { profile, workouts } = useUserStore();

  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-plan`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goal: profile?.goal,
            raceType: profile?.race_type,
            fitnessLevel: profile?.fitness_level,
            activityCount: 10,
          }),
        }
      );

      const data: GeneratePlanResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      if (data.success) {
        setSuccess(`✅ Plan created with ${data.workout_count} workouts`);
        // Refresh workouts in the store
        await useUserStore.getState().fetchWorkouts();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={generatePlan}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        leftIcon={isLoading ? <Loader2 className="animate-spin" /> : undefined}
      >
        {isLoading ? 'Generating Plan...' : 'Generate AI Workout Plan'}
      </Button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600">{success}</p>
      )}

      {!workouts.length && !isLoading && !success && (
        <p className="text-sm text-gray-600">
          No plan yet? Generate one with AI.
        </p>
      )}
    </div>
  );
};