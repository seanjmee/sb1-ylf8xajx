import React, { useEffect, useState } from 'react';
import { Calendar, Activity, Medal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { WorkoutCard } from '../components/WorkoutCard';
import { ActivityCard } from '../components/ActivityCard';
import { StravaConnectButton } from '../components/StravaConnectButton';

export const DashboardPage: React.FC = () => {
  const { user, profile, workouts, activities, stravaConnected, fetchWorkouts, fetchStravaActivities } = useUserStore();
  const [motivationalMessage, setMotivationalMessage] = useState('');
  
  useEffect(() => {
    fetchWorkouts();
    fetchStravaActivities();
    
    // This would normally come from a Supabase Edge Function call
    setMotivationalMessage("Based on your recent progress, you're on track to achieve your fitness goals! Keep up the consistent training and remember to include proper recovery in your schedule.");
  }, []);
  
  // Get today's date
  const today = new Date();
  
  // Filter workouts for this week, ensuring workouts is defined
  const thisWeekWorkouts = (workouts || []).filter(workout => {
    const workoutDate = new Date(workout.date);
    const diffTime = workoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 7;
  });
  
  // Sort activities by most recent, ensuring activities is defined
  const recentActivities = [...(activities || [])].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/calendar">
          <Button rightIcon={<ArrowRight size={16} />}>View Calendar</Button>
        </Link>
      </div>
      
      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardContent className="py-6">
          <h2 className="text-xl font-semibold mb-2">Your AI Coach Says</h2>
          <p>{motivationalMessage}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="text-blue-500" />
              <CardTitle className="text-lg">Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activities?.length || 0}</p>
            <p className="text-sm text-gray-500">Total tracked activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="text-green-500" />
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{thisWeekWorkouts.length}</p>
            <p className="text-sm text-gray-500">Workouts this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Medal className="text-amber-500" />
              <CardTitle className="text-lg">Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{profile?.goal || 'Not set'}</p>
            <p className="text-sm text-gray-500">{profile?.race_type || 'No race selected'}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Workouts */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Workouts</h2>
            <Link to="/calendar">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {thisWeekWorkouts.length > 0 ? (
            <div className="space-y-4">
              {thisWeekWorkouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No upcoming workouts</p>
                <Link to="/calendar">
                  <Button>Schedule a Workout</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Recent Activities */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            
            {!stravaConnected && (
              <StravaConnectButton />
            )}
          </div>
          
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">
                  {stravaConnected 
                    ? 'No activities found' 
                    : 'Connect with Strava to import your activities'}
                </p>
                {!stravaConnected && <StravaConnectButton />}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};