
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  showValue?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  colorThreshold?: { 
    warning: number;
    danger: number;
  };
}

const ProgressBar = ({ 
  value, 
  max, 
  showValue = true, 
  className = '',
  size = 'md',
  colorThreshold = { warning: 75, danger: 50 }
}: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const getColorClass = () => {
    if (percentage < colorThreshold.danger) {
      return 'bg-rose-500';
    } else if (percentage < colorThreshold.warning) {
      return 'bg-amber-500';
    } else {
      return 'bg-emerald-500';
    }
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'lg': return 'h-6';
      case 'md':
      default: return 'h-4';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            'transition-all duration-500 ease-out rounded-full', 
            getColorClass(),
            getSizeClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{percentage}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
