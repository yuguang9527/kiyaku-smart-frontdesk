
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Import } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QA } from './types';

// Define the schema for bulk import
const bulkImportSchema = z.object({
  qaContent: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

export type BulkImportFormValues = z.infer<typeof bulkImportSchema>;

interface BulkImportQAProps {
  onImport: (qas: QA[]) => void;
  translations: {
    import: { ja: string; en: string };
    bulkImportLabel: { ja: string; en: string };
    importButton: { ja: string; en: string };
  };
  language: 'en' | 'ja';
}

export function BulkImportQA({ onImport, translations, language }: BulkImportQAProps) {
  const form = useForm<BulkImportFormValues>({
    resolver: zodResolver(bulkImportSchema),
    defaultValues: {
      qaContent: "",
    },
  });

  const handleSubmit = (data: BulkImportFormValues) => {
    try {
      const lines = data.qaContent.trim().split('\n');
      const newQAs: QA[] = [];
      
      for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] && lines[i+1]) {
          const question = lines[i].trim();
          const answer = lines[i+1].trim();
          if (question && answer) {
            newQAs.push({ question, answer });
          }
        }
      }
      
      if (newQAs.length > 0) {
        onImport(newQAs);
        form.reset();
      }
    } catch (error) {
      console.error("Import error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Import className="h-5 w-5 inline-block mr-2" />
          {translations.import[language]}
        </CardTitle>
        <CardDescription>
          {language === 'ja' 
            ? '複数の質問・回答を一括インポートします' 
            : 'Import multiple questions and answers at once'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="qaContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.bulkImportLabel[language]}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={
                        language === 'ja' 
                          ? 'チェックイン時間は何時ですか？\nチェックインは15時からです。\n\n駐車場はありますか？\nはい、1台3000円でご利用いただけます。'
                          : 'What time is check-in?\nCheck-in is from 3:00 PM.\n\nIs there parking available?\nYes, available for 3000 yen per car.'
                      }
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {language === 'ja'
                      ? '質問と回答を交互に入力し、質問と回答のセットは空行で区切ってください。'
                      : 'Enter questions and answers alternately, separate Q&A sets with an empty line.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              {translations.importButton[language]}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
