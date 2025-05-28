
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const editQASchema = z.object({
  category: z.string().optional(),
  question: z.string().min(1, {
    message: "Question is required.",
  }),
  answer: z.string().min(1, {
    message: "Answer is required.",
  }),
});

export type EditQAFormValues = z.infer<typeof editQASchema>;

interface EditQADialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: EditQAFormValues) => void;
  initialData?: EditQAFormValues;
  translations: {
    editDialog: {
      title: { ja: string; en: string };
      description: { ja: string; en: string };
      save: { ja: string; en: string };
      cancel: { ja: string; en: string };
    };
    category: { ja: string; en: string };
    question: { ja: string; en: string };
    answer: { ja: string; en: string };
  };
  language: 'en' | 'ja';
}

export function EditQADialog({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  initialData,
  translations, 
  language 
}: EditQADialogProps) {
  const form = useForm<EditQAFormValues>({
    resolver: zodResolver(editQASchema),
    defaultValues: {
      category: initialData?.category || "",
      question: initialData?.question || "",
      answer: initialData?.answer || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: EditQAFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.editDialog.title[language]}</DialogTitle>
          <DialogDescription>
            {translations.editDialog.description[language]}
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
                    <Input placeholder={language === 'ja' ? 'カテゴリを入力してください（任意）' : 'Enter category (optional)'} {...field} />
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
                    <Input placeholder={language === 'ja' ? '質問を入力してください' : 'Enter question'} {...field} />
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
                      placeholder={language === 'ja' ? '回答を入力してください' : 'Enter answer'} 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {translations.editDialog.cancel[language]}
              </Button>
              <Button type="submit">
                {translations.editDialog.save[language]}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
