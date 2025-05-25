import React from 'react';
import { formatDistance, formatDuration, intervalToDuration } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface WorkoutCardProps {
  workout: {
    id: string;
    type: string;
    date: string;
    duration: number;
    notes: string | null;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onEdit,
  onDelete,
}) => {
  const { id, type, date, duration, notes } = workout;
  
  // Format duration from minutes to a readable format
  const formattedDuration = formatDuration(
    intervalToDuration({ start: 0, end: duration * 60 * 1000 })
  );
  
  // Determine background color based on workout type
  const getBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'running':
        return 'bg-blue-100 border-blue-300';
      case 'cycling':
        return 'bg-green-100 border-green-300';
      case 'swimming':
        return 'bg-cyan-100 border-cyan-300';
      case 'strength':
        return 'bg-purple-100 border-purple-300';
      case 'yoga':
        return 'bg-amber-100 border-amber-300';
      case 'recovery':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <Card className={`${getBgColor(type)} border-l-4 transition-all hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{type}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
              leftIcon={<Edit2 size={16} />}
              aria-label="Edit workout"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              leftIcon={<Trash2 size={16} />}
              aria-label="Delete workout"
            />
          </div>
        </div>
        <time className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</time>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Duration:</span> {formattedDuration}
          </div>
          {notes && (
            <div className="text-sm">
              <span className="font-medium">Notes:</span> {notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};