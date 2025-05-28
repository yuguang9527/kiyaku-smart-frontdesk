
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QA } from './types';

// Define the schema for QA import form
const qaSchema = z.object({
  category: z.string().optional(),
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  answer: z.string().min(5, {
    message: "Answer must be at least 5 characters.",
  }),
});

export type QAFormValues = z.infer<typeof qaSchema>;

interface AddQADialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQA: (data: QAFormValues) => void;
  translations: {
    addDialog: {
      title: { ja: string; en: string };
      description: { ja: string; en: string };
      add: { ja: string; en: string };
      cancel: { ja: string; en: string };
    };
    category: { ja: string; en: string };
    question: { ja: string; en: string };
    answer: { ja: string; en: string };
  };
  language: 'en' | 'ja';
}

export function AddQADialog({ isOpen, onOpenChange, onAddQA, translations, language }: AddQADialogProps) {
  const form = useForm<QAFormValues>({
    resolver: zodResolver(qaSchema),
    defaultValues: {
      category: "",
      question: "",
      answer: "",
    },
  });

  const handleSubmit = (data: QAFormValues) => {
    onAddQA(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.addDialog.title[language]}</DialogTitle>
          <DialogDescription>
            {translations.addDialog.description[language]}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.category[language]}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'ja' ? 'カテゴリを入力（任意）' : 'Enter category (optional)'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.question[language]}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'ja' ? '質問を入力' : 'Enter question'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.answer[language]}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'ja' ? '回答を入力' : 'Enter answer'} 
                      className="min-h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {translations.addDialog.cancel[language]}
              </Button>
              <Button type="submit">
                {translations.addDialog.add[language]}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
