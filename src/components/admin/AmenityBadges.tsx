
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AmenityBadgesProps {
  amenityList: string[];
  onDelete: (amenity: string) => void;
  language: 'en' | 'ja';
}

export function AmenityBadges({ amenityList, onDelete, language }: AmenityBadgesProps) {
  if (amenityList.length === 0) return null;

  const translations = {
    currentAmenities: {
      ja: '現在の設備・サービス',
      en: 'Current Amenities'
    },
    delete: {
      ja: '削除',
      en: 'Delete'
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">
        {translations.currentAmenities[language]}
      </h4>
      <div className="flex flex-wrap gap-2">
        {amenityList.map((amenity, index) => (
          <Badge key={index} className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
            {amenity}
            <button 
              type="button"
              onClick={() => onDelete(amenity)}
              className="ml-1 rounded-full bg-blue-200 hover:bg-blue-300 p-0.5"
            >
              <X className="h-3 w-3 text-blue-800" />
              <span className="sr-only">{translations.delete[language]}</span>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
