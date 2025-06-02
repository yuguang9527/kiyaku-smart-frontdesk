import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { ImageSelector } from './ImageSelector';

// Define the schema for the hotel import form
const hotelInfoSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters."
  }),
  phoneNumber: z.string().optional(),
  agentImage: z.string().optional(),
});

export type HotelInfoFormValues = z.infer<typeof hotelInfoSchema>;

interface HotelInfoFormProps {
  language: 'en' | 'ja';
}

export function HotelInfoForm({ language }: HotelInfoFormProps) {
  // Hotel info form
  const form = useForm<HotelInfoFormValues>({
    resolver: zodResolver(hotelInfoSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      agentImage: "/lovable-uploads/d1156dc0-bb74-4c72-934a-68e68b022dc4.png", // デフォルトは2枚目の画像
    },
  });

  // Load saved hotel info if available
  useEffect(() => {
    try {
      const savedHotelInfo = localStorage.getItem('hotelInfo');
      if (savedHotelInfo) {
        const parsedInfo = JSON.parse(savedHotelInfo);
        form.reset({
          name: parsedInfo.name || "",
          address: parsedInfo.address || "",
          phoneNumber: parsedInfo.phoneNumber || "",
          agentImage: parsedInfo.agentImage || "/lovable-uploads/d1156dc0-bb74-4c72-934a-68e68b022dc4.png",
        });
      }
    } catch (error) {
      console.error('Failed to load hotel info:', error);
    }
  }, []);

  const onSubmit = (data: HotelInfoFormValues) => {
    // Save hotel info to localStorage for integration with CustomerSupport
    try {
      localStorage.setItem('hotelInfo', JSON.stringify(data));
      toast.success(language === 'ja' ? 'ホテル情報が保存されました' : 'Hotel information saved');
    } catch (error) {
      toast.error(language === 'ja' ? '保存に失敗しました' : 'Failed to save hotel information');
      console.error("Save error:", error);
    }
  };

  const translations = {
    name: {
      ja: 'ホテル名',
      en: 'Hotel Name'
    },
    address: {
      ja: '住所',
      en: 'Address'
    },
    phoneNumber: {
      ja: '電話番号',
      en: 'Phone Number'
    },
    agentImage: {
      ja: 'エージェント画像',
      en: 'Agent Image'
    },
    save: {
      ja: '保存',
      en: 'Save'
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.name[language]}</FormLabel>
              <FormControl>
                <Input placeholder={language === 'ja' ? 'ホテル名を入力' : 'Enter hotel name'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.address[language]}</FormLabel>
              <FormControl>
                <Input placeholder={language === 'ja' ? '住所を入力' : 'Enter address'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.phoneNumber[language]}</FormLabel>
              <FormControl>
                <Input placeholder={language === 'ja' ? '電話番号を入力' : 'Enter phone number'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agentImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.agentImage[language]}</FormLabel>
              <FormControl>
                <ImageSelector
                  selectedImage={field.value || "/lovable-uploads/d1156dc0-bb74-4c72-934a-68e68b022dc4.png"}
                  onImageSelect={field.onChange}
                  language={language}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          {translations.save[language]}
        </Button>
      </form>
    </Form>
  );
}
