import React, { useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Import, File } from 'lucide-react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QA } from './types';
import * as XLSX from 'xlsx';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BulkImportFormValues>({
    resolver: zodResolver(bulkImportSchema),
    defaultValues: {
      qaContent: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Excelファイルの処理
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array', cellText: false, cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          
          processExcelData(jsonData as string[][]);
        } catch (error) {
          console.error("Excel file processing error:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSVやテキストファイルの処理
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          processFileContent(content);
        }
      };
      // UTF-8で読み込む
      reader.readAsText(file, 'UTF-8');
    }
  };

  const processExcelData = (data: string[][]) => {
    try {
      const newQAs: QA[] = [];
      
      // ヘッダー行をスキップして処理
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row && row.length >= 3) {
          const category = String(row[0] || '').trim();
          const question = String(row[1] || '').trim();
          const answer = String(row[2] || '').trim();
          
          if (question && answer) {
            newQAs.push({ category, question, answer });
          }
        }
      }
      
      if (newQAs.length > 0) {
        onImport(newQAs);
        console.log(`${newQAs.length}件のQ&Aをインポートしました`);
        // ファイル入力をリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error("Excel data processing error:", error);
    }
  };

  const processFileContent = (content: string) => {
    try {
      const lines = content.trim().split('\n');
      const newQAs: QA[] = [];
      
      for (const line of lines) {
        // タブ区切りまたはカンマ区切りのデータを解析
        const columns = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
        
        if (columns.length >= 3) {
          // A列: カテゴリ, B列: 質問, C列: 回答
          const category = columns[0]?.trim();
          const question = columns[1]?.trim();
          const answer = columns[2]?.trim();
          
          if (question && answer && category !== 'カテゴリ' && category !== 'Category') { // ヘッダー行をスキップ
            newQAs.push({ category, question, answer });
          }
        }
      }
      
      if (newQAs.length > 0) {
        onImport(newQAs);
        console.log(`${newQAs.length}件のQ&Aをインポートしました`);
        // ファイル入力をリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error("File import error:", error);
    }
  };

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

  const tabTranslations = {
    textImport: {
      ja: 'テキスト形式',
      en: 'Text Format'
    },
    fileUpload: {
      ja: 'ファイルアップロード',
      en: 'File Upload'
    },
    fileUploadInstructions: {
      ja: 'Excel、CSVまたはテキストファイルをアップロードしてください',
      en: 'Upload Excel, CSV or text file'
    },
    fileUploadDescription: {
      ja: 'ファイルは A列:カテゴリ、B列:質問、C列:回答 の形式で保存してください',
      en: 'File should be in format: Column A: Category, Column B: Question, Column C: Answer'
    },
    chooseFile: {
      ja: 'ファイルを選択',
      en: 'Choose File'
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
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              {tabTranslations.fileUpload[language]}
            </TabsTrigger>
            <TabsTrigger value="text">
              {tabTranslations.textImport[language]}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tabTranslations.fileUploadInstructions[language]}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {tabTranslations.chooseFile[language]}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tabTranslations.fileUploadDescription[language]}
                </p>
              </div>
            </div>
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
