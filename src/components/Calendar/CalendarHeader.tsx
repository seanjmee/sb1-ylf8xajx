import React from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}) => {
  // Format the month and year
  const monthYear = format(currentDate, 'MMMM yyyy');
  
  // Get the start and end dates of the week
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  // Format the week range
  const weekRange = `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d')}`;

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{monthYear}</h2>
      
      <div className="text-sm text-gray-600">{weekRange}</div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
        >
          Today
        </Button>
        
        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevWeek}
            className="rounded-r-none"
            aria-label="Previous week"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextWeek}
            className="rounded-l-none"
            aria-label="Next week"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};