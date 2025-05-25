import React from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface CalendarDayProps {
  date: Date;
  isToday: boolean;
  workouts: any[];
  onSelectWorkout: (workout: any) => void;
  onAddWorkout: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isToday,
  workouts,
  onSelectWorkout,
  onAddWorkout,
}) => {
  // Format the date
  const dayNumber = format(date, 'd');
  
  // Get workout type color
  const getWorkoutColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'running':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'cycling':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'swimming':
        return 'bg-cyan-100 border-cyan-300 text-cyan-800';
      case 'strength':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'yoga':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'recovery':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`border-r border-b p-2 ${isToday ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : ''}`}>
          {dayNumber}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddWorkout}
          className="h-6 w-6 p-0"
          aria-label="Add workout"
        >
          <Plus size={16} />
        </Button>
      </div>
      
      <div className="space-y-1 overflow-y-auto max-h-[400px]">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className={`${getWorkoutColor(workout.type)} text-xs p-1 rounded border cursor-pointer transition-colors`}
            onClick={() => onSelectWorkout(workout)}
          >
            <div className="font-medium">{workout.type}</div>
            <div>{workout.duration} min</div>
          </div>
        ))}
      </div>
    </div>
  );
};