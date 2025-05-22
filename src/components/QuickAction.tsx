
import React from 'react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  isActive?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  isActive = false
}) => {
  const variantClasses = {
    default: isActive 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
      : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: isActive
      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      : 'bg-background text-foreground hover:bg-secondary/80'
  };

  return (
    <button
      className={cn(
        'flex flex-col items-center justify-center rounded-lg p-3 transition-colors',
        variantClasses[variant]
      )}
      onClick={onClick}
    >
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
};

export default QuickAction;
