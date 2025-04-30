
import React, { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Check, Plus, Import, FileText, Search } from 'lucide-react';

// Define the schema for the hotel import form
const hotelInfoSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters."
  }),
  amenities: z.string().optional(),
});

// Define the schema for QA import form
const qaSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  answer: z.string().min(5, {
    message: "Answer must be at least 5 characters.",
  }),
});

// Define the schema for bulk import
const bulkImportSchema = z.object({
  qaContent: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

// Define the QA type to ensure consistent typing
interface QA {
  question: string;
  answer: string;
}

const HotelImport: React.FC = () => {
  const { language } = useLanguage();
  const [isAddQADialogOpen, setIsAddQADialogOpen] = useState(false);
  const [qaList, setQAList] = useState<QA[]>([]);
  
  // Hotel info form
  const hotelInfoForm = useForm<z.infer<typeof hotelInfoSchema>>({
    resolver: zodResolver(hotelInfoSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      amenities: "",
    },
  });

  // QA form
  const qaForm = useForm<z.infer<typeof qaSchema>>({
    resolver: zodResolver(qaSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  // Bulk import form
  const bulkImportForm = useForm<z.infer<typeof bulkImportSchema>>({
    resolver: zodResolver(bulkImportSchema),
    defaultValues: {
      qaContent: "",
    },
  });

  const onSubmitHotelInfo = (data: z.infer<typeof hotelInfoSchema>) => {
    console.log("Hotel info submitted:", data);
    toast.success(language === 'ja' ? 'ホテル情報が保存されました' : 'Hotel information saved');
  };

  const onSubmitQA = (data: z.infer<typeof qaSchema>) => {
    console.log("QA submitted:", data);
    setQAList([...qaList, data]);
    qaForm.reset();
    setIsAddQADialogOpen(false);
    toast.success(language === 'ja' ? '質問と回答が追加されました' : 'Question and answer added');
  };

  const onSubmitBulkImport = (data: z.infer<typeof bulkImportSchema>) => {
    console.log("Bulk QA import submitted:", data);
    
    // Mock parsing of Q&A content
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
        setQAList([...qaList, ...newQAs]);
        toast.success(`${newQAs.length} ${language === 'ja' ? '件のQ&Aをインポートしました' : 'Q&As imported successfully'}`);
        bulkImportForm.reset();
      } else {
        toast.error(language === 'ja' ? '有効なQ&Aが見つかりませんでした' : 'No valid Q&As found');
      }
    } catch (error) {
      toast.error(language === 'ja' ? 'インポートエラー' : 'Import error');
      console.error("Import error:", error);
    }
  };

  const translations = {
    title: {
      ja: 'ホテル情報インポート',
      en: 'Hotel Information Import'
    },
    description: {
      ja: 'ホテル情報と質問応答のインポート・管理',
      en: 'Import and manage hotel information and Q&A'
    },
    tabs: {
      hotelInfo: {
        ja: 'ホテル基本情報',
        en: 'Hotel Info'
      },
      qa: {
        ja: '質問と回答',
        en: 'Q&A'
      }
    },
    hotelForm: {
      name: {
        ja: 'ホテル名',
        en: 'Hotel Name'
      },
      description: {
        ja: '説明',
        en: 'Description'
      },
      address: {
        ja: '住所',
        en: 'Address'
      },
      amenities: {
        ja: '設備・サービス',
        en: 'Amenities'
      },
      save: {
        ja: '保存',
        en: 'Save'
      }
    },
    qa: {
      addNew: {
        ja: '質問を追加',
        en: 'Add Question'
      },
      import: {
        ja: '一括インポート',
        en: 'Bulk Import'
      },
      question: {
        ja: '質問',
        en: 'Question'
      },
      answer: {
        ja: '回答',
        en: 'Answer'
      },
      actions: {
        ja: '操作',
        en: 'Actions'
      },
      bulkImportLabel: {
        ja: 'Q&Aを一括インポート（質問と回答を改行で区切ってください）',
        en: 'Bulk Import Q&A (separate questions and answers with line breaks)'
      },
      importButton: {
        ja: 'インポート',
        en: 'Import'
      },
      searchPlaceholder: {
        ja: '質問を検索...',
        en: 'Search questions...'
      },
      addDialog: {
        title: {
          ja: '新しい質問と回答を追加',
          en: 'Add New Question and Answer'
        },
        description: {
          ja: 'お客様からの質問とその回答を追加します',
          en: 'Add a customer question and its answer'
        },
        add: {
          ja: '追加',
          en: 'Add'
        },
        cancel: {
          ja: 'キャンセル',
          en: 'Cancel'
        }
      },
      noData: {
        ja: '質問と回答がありません',
        en: 'No questions and answers available'
      },
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            {translations.title[language]}
          </h1>
          <p className="text-muted-foreground mt-1">
            {translations.description[language]}
          </p>
        </div>

        <Tabs defaultValue="hotelInfo" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="hotelInfo">
              {translations.tabs.hotelInfo[language]}
            </TabsTrigger>
            <TabsTrigger value="qa">
              {translations.tabs.qa[language]}
            </TabsTrigger>
          </TabsList>

          {/* Hotel Information Tab */}
          <TabsContent value="hotelInfo">
            <Card>
              <CardHeader>
                <CardTitle>{translations.tabs.hotelInfo[language]}</CardTitle>
                <CardDescription>
                  {language === 'ja' 
                    ? 'ホテルの基本情報を入力してください' 
                    : 'Enter basic information about your hotel'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...hotelInfoForm}>
                  <form onSubmit={hotelInfoForm.handleSubmit(onSubmitHotelInfo)} className="space-y-6">
                    <FormField
                      control={hotelInfoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.hotelForm.name[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder={language === 'ja' ? 'ホテル名を入力' : 'Enter hotel name'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={hotelInfoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.hotelForm.description[language]}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={language === 'ja' ? 'ホテルの説明を入力' : 'Enter hotel description'} 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={hotelInfoForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.hotelForm.address[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder={language === 'ja' ? '住所を入力' : 'Enter address'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={hotelInfoForm.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.hotelForm.amenities[language]}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={language === 'ja' ? '設備・サービスを入力（コンマ区切り）' : 'Enter amenities (comma separated)'} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {language === 'ja' 
                              ? '例: Wi-Fi, 朝食付き, スパ, プール, レストラン' 
                              : 'Example: Wi-Fi, Breakfast included, Spa, Pool, Restaurant'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      {translations.hotelForm.save[language]}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: QA Management */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{translations.tabs.qa[language]}</CardTitle>
                    <CardDescription>
                      {language === 'ja' 
                        ? 'よくある質問と回答の管理' 
                        : 'Manage frequently asked questions and answers'}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setIsAddQADialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.qa.addNew[language]}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder={translations.qa.searchPlaceholder[language]}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{translations.qa.question[language]}</TableHead>
                          <TableHead>{translations.qa.answer[language]}</TableHead>
                          <TableHead className="w-24">{translations.qa.actions[language]}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {qaList.length > 0 ? (
                          qaList.map((qa, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{qa.question}</TableCell>
                              <TableCell>{qa.answer.length > 50 ? `${qa.answer.slice(0, 50)}...` : qa.answer}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Edit</span>
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                              {translations.qa.noData[language]}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Right: Bulk Import */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Import className="h-5 w-5 inline-block mr-2" />
                    {translations.qa.import[language]}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ja' 
                      ? '複数の質問・回答を一括インポートします' 
                      : 'Import multiple questions and answers at once'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...bulkImportForm}>
                    <form onSubmit={bulkImportForm.handleSubmit(onSubmitBulkImport)} className="space-y-4">
                      <FormField
                        control={bulkImportForm.control}
                        name="qaContent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translations.qa.bulkImportLabel[language]}</FormLabel>
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
                        {translations.qa.importButton[language]}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add QA Dialog */}
        <Dialog open={isAddQADialogOpen} onOpenChange={setIsAddQADialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translations.qa.addDialog.title[language]}</DialogTitle>
              <DialogDescription>
                {translations.qa.addDialog.description[language]}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...qaForm}>
              <form onSubmit={qaForm.handleSubmit(onSubmitQA)} className="space-y-4">
                <FormField
                  control={qaForm.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.qa.question[language]}</FormLabel>
                      <FormControl>
                        <Input placeholder={language === 'ja' ? '質問を入力' : 'Enter question'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={qaForm.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.qa.answer[language]}</FormLabel>
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
                  <Button type="button" variant="outline" onClick={() => setIsAddQADialogOpen(false)}>
                    {translations.qa.addDialog.cancel[language]}
                  </Button>
                  <Button type="submit">
                    {translations.qa.addDialog.add[language]}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default HotelImport;
