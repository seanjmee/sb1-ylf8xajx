import React from 'react';
import { formatDistance, formatDuration, intervalToDuration } from 'date-fns';
import { Activity, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ActivityCardProps {
  activity: {
    id: string;
    type: string;
    distance: number;
    duration: number;
    date: string;
  };
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { type, distance, duration, date } = activity;
  
  // Format distance from meters to kilometers
  const formattedDistance = (distance / 1000).toFixed(2) + ' km';
  
  // Format duration from seconds to a readable format
  const formattedDuration = formatDuration(
    intervalToDuration({ start: 0, end: duration * 1000 })
  );
  
  // Calculate pace (time per km)
  const paceSeconds = duration / (distance / 1000);
  const paceMinutes = Math.floor(paceSeconds / 60);
  const paceRemainingSeconds = Math.floor(paceSeconds % 60);
  const formattedPace = `${paceMinutes}:${paceRemainingSeconds.toString().padStart(2, '0')} /km`;
  
  // Determine icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
      case 'running':
        return <Activity className="text-blue-500" />;
      case 'ride':
      case 'cycling':
        return <Activity className="text-green-500" />;
      case 'swim':
      case 'swimming':
        return <Activity className="text-cyan-500" />;
      default:
        return <Activity className="text-gray-500" />;
    }
  };

  return (
    <Card className="border border-gray-200 transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getActivityIcon(type)}
            <CardTitle className="text-lg font-medium">{type}</CardTitle>
          </div>
          <time className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</time>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Distance</p>
            <p className="text-lg font-semibold">{formattedDistance}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-lg font-semibold">{formattedDuration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pace</p>
            <p className="text-lg font-semibold">{formattedPace}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};