import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  currentDate: Date;
  workouts: any[];
  onSelectWorkout: (workout: any) => void;
  onAddWorkout: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  workouts,
  onSelectWorkout,
  onAddWorkout,
}) => {
  // Generate the days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get the start of the week
  const weekStart = startOfWeek(currentDate);
  
  // Generate an array of dates for the current week
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(weekStart, i);
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Calendar header with day names */}
      <div className="grid grid-cols-7 bg-gray-100">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid with dates and workouts */}
      <div className="grid grid-cols-7 grid-rows-1 border-t h-[500px]">
        {weekDates.map((date) => {
          // Filter workouts for this day
          const dayWorkouts = workouts.filter((workout) => {
            const workoutDate = new Date(workout.date);
            return isSameDay(workoutDate, date);
          });
          
          return (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              isToday={isSameDay(date, new Date())}
              workouts={dayWorkouts}
              onSelectWorkout={onSelectWorkout}
              onAddWorkout={() => onAddWorkout(date)}
            />
          );
        })}
      </div>
    </div>
  );
};