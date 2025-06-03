import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Import, FileSpreadsheet } from 'lucide-react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QA } from './types';

// Define the schema for bulk import
const bulkImportSchema = z.object({
  qaContent: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

const excelImportSchema = z.object({
  excelContent: z.string().min(10, {
    message: "Excel content must be at least 10 characters.",
  }),
});

export type BulkImportFormValues = z.infer<typeof bulkImportSchema>;
export type ExcelImportFormValues = z.infer<typeof excelImportSchema>;

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

  const excelForm = useForm<ExcelImportFormValues>({
    resolver: zodResolver(excelImportSchema),
    defaultValues: {
      excelContent: "",
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

  const handleExcelSubmit = (data: ExcelImportFormValues) => {
    try {
      const lines = data.excelContent.trim().split('\n');
      const newQAs: QA[] = [];
      
      for (const line of lines) {
        // タブ区切りまたはカンマ区切りのデータを解析
        const columns = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
        
        if (columns.length >= 3) {
          // A列: カテゴリ, B列: 質問, C列: 回答
          const category = columns[0]?.trim();
          const question = columns[1]?.trim();
          const answer = columns[2]?.trim();
          
          if (question && answer && category !== 'カテゴリ') { // ヘッダー行をスキップ
            newQAs.push({ category, question, answer });
          }
        }
      }
      
      if (newQAs.length > 0) {
        onImport(newQAs);
        excelForm.reset();
        console.log(`${newQAs.length}件のQ&Aをインポートしました`);
      }
    } catch (error) {
      console.error("Excel import error:", error);
    }
  };

  const tabTranslations = {
    textImport: {
      ja: 'テキスト形式',
      en: 'Text Format'
    },
    excelImport: {
      ja: 'エクセル形式',
      en: 'Excel Format'
    },
    excelInstructions: {
      ja: 'エクセルからコピーして貼り付けてください',
      en: 'Copy and paste from Excel'
    },
    excelDescription: {
      ja: 'エクセルで A列:カテゴリ、B列:質問、C列:回答 の形式でデータを貼り付けてください',
      en: 'Paste data in the format: Column A: Category, Column B: Question, Column C: Answer'
    }
  };

  return (
    <>
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
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              {tabTranslations.excelImport[language]}
            </TabsTrigger>
            <TabsTrigger value="text">
              {tabTranslations.textImport[language]}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="excel" className="mt-4">
            <Form {...excelForm}>
              <form onSubmit={excelForm.handleSubmit(handleExcelSubmit)} className="space-y-4">
                <FormField
                  control={excelForm.control}
                  name="excelContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tabTranslations.excelInstructions[language]}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={
                            language === 'ja' 
                              ? 'カテゴリ	質問	回答\n宿泊	チェックイン時間は何時ですか？	チェックインは15時からです\n館内サービス	Wi-Fiは使えますか？	はい、全館およびロビーで無料Wi-Fiをご利用いただけます'
                              : 'Category	Question	Answer\nAccommodation	What time is check-in?	Check-in is from 3:00 PM\nServices	Is Wi-Fi available?	Yes, free Wi-Fi is available throughout the hotel'
                          }
                          className="min-h-[200px] font-mono text-sm" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {tabTranslations.excelDescription[language]}
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
          </TabsContent>

          <TabsContent value="text" className="mt-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
}
