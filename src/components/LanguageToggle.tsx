
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  currentLanguage: 'ja' | 'en';
  onChange: (language: 'ja' | 'en') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  currentLanguage, 
  onChange 
}) => {
  return (
    <div className="flex items-center space-x-1 rounded-md border p-1 bg-slate-50">
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onChange('ja')}
        className={cn(
          "h-7 px-2 text-xs font-medium transition-all",
          currentLanguage === 'ja' 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        日本語
      </Button>
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onChange('en')}
        className={cn(
          "h-7 px-2 text-xs font-medium transition-all",
          currentLanguage === 'en' 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        English
      </Button>
    </div>
  );
};

export default LanguageToggle;
