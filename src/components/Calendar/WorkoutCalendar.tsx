import React, { useState } from 'react';
import { subWeeks, addWeeks } from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { WorkoutModal } from './WorkoutModal';
import { useUserStore } from '../../lib/store';

export const WorkoutCalendar: React.FC = () => {
  const { workouts, createWorkout, updateWorkout, deleteWorkout } = useUserStore();
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Navigation handlers
  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  // Workout handlers
  const handleSelectWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setSelectedDate(null);
    setIsModalOpen(true);
  };
  
  const handleAddWorkout = (date: Date) => {
    setSelectedWorkout(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  
  const handleSaveWorkout = (workoutData: any) => {
    if (selectedWorkout) {
      // Update existing workout
      updateWorkout(selectedWorkout.id, workoutData);
    } else {
      // Create new workout
      createWorkout({
        ...workoutData,
        date: selectedDate?.toISOString(),
      });
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteWorkout = () => {
    if (selectedWorkout) {
      deleteWorkout(selectedWorkout.id);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <CalendarHeader
        currentDate={currentDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />
      
      <CalendarGrid
        currentDate={currentDate}
        workouts={workouts}
        onSelectWorkout={handleSelectWorkout}
        onAddWorkout={handleAddWorkout}
      />
      
      <WorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkout}
        onDelete={handleDeleteWorkout}
        workout={selectedWorkout}
        date={selectedDate}
      />
    </div>
  );
};