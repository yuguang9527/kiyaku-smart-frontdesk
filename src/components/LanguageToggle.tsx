
import React from 'react';
import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  currentLanguage: 'ja' | 'en';
  onChange: (language: 'ja' | 'en') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  currentLanguage, 
  onChange 
}) => {
  return (
    <div className="flex items-center space-x-2 rounded-md border p-1">
      <Button 
        variant={currentLanguage === 'ja' ? "default" : "ghost"} 
        size="sm"
        onClick={() => onChange('ja')}
        className="text-xs px-2 h-7"
      >
        日本語
      </Button>
      <Button 
        variant={currentLanguage === 'en' ? "default" : "ghost"} 
        size="sm"
        onClick={() => onChange('en')}
        className="text-xs px-2 h-7"
      >
        English
      </Button>
    </div>
  );
};

export default LanguageToggle;
