import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: any) => void;
  onDelete: () => void;
  workout: any | null;
  date: Date | null;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  workout,
  date,
}) => {
  const [formData, setFormData] = useState({
    type: '',
    duration: 0,
    notes: '',
  });
  
  // Initialize form data when workout or date changes
  useEffect(() => {
    if (workout) {
      setFormData({
        type: workout.type,
        duration: workout.duration,
        notes: workout.notes || '',
      });
    } else {
      setFormData({
        type: '',
        duration: 30,
        notes: '',
      });
    }
  }, [workout, date]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  if (!isOpen) return null;
  
  const modalTitle = workout ? 'Edit Workout' : 'Add Workout';
  const formattedDate = date ? format(date, 'EEEE, MMMM d, yyyy') : '';
  const workoutDate = workout ? format(new Date(workout.date), 'EEEE, MMMM d, yyyy') : formattedDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{modalTitle}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">{workoutDate}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border shadow-sm border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select workout type</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Strength">Strength</option>
                <option value="Yoga">Yoga</option>
                <option value="Recovery">Recovery</option>
              </select>
            </div>
            
            <div className="mb-4">
              <Input
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                min={1}
                required
                fullWidth
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-white border shadow-sm border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-between">
            {workout && (
              <Button
                type="button"
                variant="danger"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};