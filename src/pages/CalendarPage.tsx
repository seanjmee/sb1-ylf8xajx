import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WorkoutCalendar } from '../components/Calendar/WorkoutCalendar';
import { GeneratePlanButton } from '../components/GeneratePlanButton';

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Training Calendar</h1>
        <Button
          leftIcon={<Plus size={16} />}
        >
          Add Workout
        </Button>
      </div>

      <div className="flex justify-end">
        <GeneratePlanButton />
      </div>
      
      <WorkoutCalendar />
    </div>
  );
};