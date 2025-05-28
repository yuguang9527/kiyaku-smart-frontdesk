
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileExport } from 'lucide-react';
import { toast } from 'sonner';
import { AddQADialog, QAFormValues } from './AddQADialog';
import { EditQADialog, EditQAFormValues } from './EditQADialog';
import { QAList } from './QAList';
import { BulkImportQA } from './BulkImportQA';
import { QA } from './types';

interface QAManagementProps {
  language: 'en' | 'ja';
}

export function QAManagement({ language }: QAManagementProps) {
  const [isAddQADialogOpen, setIsAddQADialogOpen] = useState(false);
  const [isEditQADialogOpen, setIsEditQADialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [qaList, setQAList] = useState<QA[]>([]);
  
  const translations = {
    tabs: {
      qa: {
        ja: '質問と回答',
        en: 'Q&A'
      }
    },
    qa: {
      addNew: {
        ja: '質問を追加',
        en: 'Add Question'
      },
      export: {
        ja: 'エクスポート',
        en: 'Export'
      },
      import: {
        ja: '一括インポート',
        en: 'Bulk Import'
      },
      category: {
        ja: 'カテゴリー',
        en: 'Category'
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
      edit: {
        ja: '変更',
        en: 'Edit'
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
      editDialog: {
        title: {
          ja: '質問と回答を変更',
          en: 'Edit Question and Answer'
        },
        description: {
          ja: '質問と回答を編集します',
          en: 'Edit the question and answer'
        },
        save: {
          ja: '保存',
          en: 'Save'
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

  const handleAddQA = (data: QAFormValues) => {
    // Ensure data matches QA interface
    const newQA: QA = {
      category: data.category,
      question: data.question,
      answer: data.answer
    };
    setQAList([...qaList, newQA]);
    setIsAddQADialogOpen(false);
    toast.success(language === 'ja' ? '質問と回答が追加されました' : 'Question and answer added');
  };

  const handleEditQA = (index: number, qa: QA) => {
    setEditingIndex(index);
    setIsEditQADialogOpen(true);
  };

  const handleSaveEdit = (data: EditQAFormValues) => {
    if (editingIndex !== null) {
      const updatedQAList = [...qaList];
      updatedQAList[editingIndex] = {
        category: data.category,
        question: data.question,
        answer: data.answer
      };
      setQAList(updatedQAList);
      setEditingIndex(null);
      toast.success(language === 'ja' ? '質問と回答が更新されました' : 'Question and answer updated');
    }
  };

  const handleBulkImport = (newQAs: QA[]) => {
    setQAList([...qaList, ...newQAs]);
    toast.success(`${newQAs.length} ${language === 'ja' ? '件のQ&Aをインポートしました' : 'Q&As imported successfully'}`);
  };

  const handleExportToExcel = () => {
    if (qaList.length === 0) {
      toast.error(language === 'ja' ? 'エクスポートするデータがありません' : 'No data to export');
      return;
    }

    // Create CSV content
    const headers = ['No', 'Category', 'Question', 'Answer'];
    const csvContent = [
      headers.join(','),
      ...qaList.map((qa, index) => [
        index + 1,
        `"${(qa.category || (language === 'ja' ? 'カテゴリなし' : 'No Category')).replace(/"/g, '""')}"`,
        `"${qa.question.replace(/"/g, '""')}"`,
        `"${qa.answer.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-list-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(language === 'ja' ? 'Q&Aリストをエクスポートしました' : 'Q&A list exported successfully');
  };

  const editingQA = editingIndex !== null ? qaList[editingIndex] : undefined;

  return (
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportToExcel}>
              <FileExport className="h-4 w-4 mr-2" />
              {translations.qa.export[language]}
            </Button>
            <Button variant="outline" onClick={() => setIsAddQADialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {translations.qa.addNew[language]}
            </Button>
          </div>
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
          
          <QAList 
            qaList={qaList} 
            onEdit={handleEditQA}
            translations={translations.qa} 
            language={language} 
          />
        </CardContent>
      </Card>

      {/* Right: Bulk Import */}
      <BulkImportQA
        onImport={handleBulkImport}
        translations={translations.qa}
        language={language}
      />

      {/* Add QA Dialog */}
      <AddQADialog
        isOpen={isAddQADialogOpen}
        onOpenChange={setIsAddQADialogOpen}
        onAddQA={handleAddQA}
        translations={translations.qa}
        language={language}
      />

      {/* Edit QA Dialog */}
      <EditQADialog
        isOpen={isEditQADialogOpen}
        onOpenChange={setIsEditQADialogOpen}
        onSave={handleSaveEdit}
        initialData={editingQA}
        translations={translations.qa}
        language={language}
      />
    </div>
  );
}
