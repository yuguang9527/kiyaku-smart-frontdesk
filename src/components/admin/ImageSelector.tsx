
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ImageSelectorProps {
  selectedImage: string;
  onImageSelect: (imageUrl: string) => void;
  language: 'en' | 'ja';
}

const presetImages = [
  "/lovable-uploads/c86b6632-35eb-4b69-8e2b-bf22765dc500.png",
  "/lovable-uploads/ef3d880f-d076-4c0e-b44f-c8ed98e23b0b.png", // デフォルト
  "/lovable-uploads/54447b79-fdbc-4cda-ad2a-97268a9e606f.png",
  "/lovable-uploads/a77ecfbc-627d-4419-a8ec-25d005f4f0cb.png"
];

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImage,
  onImageSelect,
  language
}) => {
  const [customImages, setCustomImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    presetImages: {
      ja: 'プリセット画像',
      en: 'Preset Images'
    },
    customImages: {
      ja: 'カスタム画像',
      en: 'Custom Images'
    },
    uploadImage: {
      ja: '画像をアップロード',
      en: 'Upload Image'
    },
    uploadSuccess: {
      ja: '画像がアップロードされました',
      en: 'Image uploaded successfully'
    },
    uploadError: {
      ja: '画像のアップロードに失敗しました',
      en: 'Failed to upload image'
    },
    invalidFile: {
      ja: '有効な画像ファイルを選択してください',
      en: 'Please select a valid image file'
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(translations.invalidFile[language]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCustomImages(prev => [...prev, imageUrl]);
      onImageSelect(imageUrl);
      toast.success(translations.uploadSuccess[language]);
    };
    reader.onerror = () => {
      toast.error(translations.uploadError[language]);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const allImages = [...presetImages, ...customImages];

  return (
    <div className="space-y-4">
      {/* プリセット画像セクション */}
      <div>
        <h4 className="text-sm font-medium mb-3">{translations.presetImages[language]}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetImages.map((imageUrl, index) => (
            <Card
              key={index}
              className={`relative cursor-pointer border-2 transition-all hover:shadow-md ${
                selectedImage === imageUrl 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onImageSelect(imageUrl)}
            >
              <div className="aspect-square p-2">
                <img
                  src={imageUrl}
                  alt={`Preset ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              {selectedImage === imageUrl && (
                <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* カスタム画像セクション */}
      {customImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">{translations.customImages[language]}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {customImages.map((imageUrl, index) => (
              <Card
                key={`custom-${index}`}
                className={`relative cursor-pointer border-2 transition-all hover:shadow-md ${
                  selectedImage === imageUrl 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onImageSelect(imageUrl)}
              >
                <div className="aspect-square p-2">
                  <img
                    src={imageUrl}
                    alt={`Custom ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                {selectedImage === imageUrl && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* アップロードボタン */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {translations.uploadImage[language]}
        </Button>
      </div>

      {/* 選択された画像のプレビュー */}
      {selectedImage && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">
            {language === 'ja' ? '選択された画像' : 'Selected Image'}
          </h4>
          <Card className="p-4 max-w-xs">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-32 object-cover rounded"
            />
          </Card>
        </div>
      )}
    </div>
  );
};
