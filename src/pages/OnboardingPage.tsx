import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    goal: '',
    race_type: '',
    fitness_level: '',
  });
  
  const { updateProfile, isLoading, error } = useUserStore();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profile);
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to StravaGPT</h1>
          <p className="mt-2 text-sm text-gray-600">
            Let's set up your profile to create personalized training plans
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 3</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">What is your main fitness goal?</h3>
                  
                  <div className="space-y-2">
                    {['Improve overall fitness', 'Prepare for a race', 'Lose weight', 'Build endurance', 'Improve speed'].map((goal) => (
                      <label key={goal} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="goal"
                          value={goal}
                          checked={profile.goal === goal}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3">{goal}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!profile.goal}
                      fullWidth
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">What type of race are you training for?</h3>
                  
                  <div className="space-y-2">
                    {['5K', '10K', 'Half Marathon', 'Marathon', 'Triathlon', 'Century Ride', 'Not training for a race'].map((race) => (
                      <label key={race} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="race_type"
                          value={race}
                          checked={profile.race_type === race}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3">{race}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!profile.race_type}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">What is your current fitness level?</h3>
                  
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map((level) => (
                      <label key={level} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="fitness_level"
                          value={level}
                          checked={profile.fitness_level === level}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3">{level}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={!profile.fitness_level}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};