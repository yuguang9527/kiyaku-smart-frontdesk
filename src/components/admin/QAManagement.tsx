
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, File } from 'lucide-react';
import { AddQADialog } from './AddQADialog';
import { EditQADialog } from './EditQADialog';
import { QAList } from './QAList';
import { BulkImportQA } from './BulkImportQA';
import { useQAManagement } from './hooks/useQAManagement';
import { qaTranslations } from './translations/qaTranslations';

interface QAManagementProps {
  language: 'en' | 'ja';
}

export function QAManagement({ language }: QAManagementProps) {
  const {
    isAddQADialogOpen,
    setIsAddQADialogOpen,
    isEditQADialogOpen,
    setIsEditQADialogOpen,
    qaList,
    editingQA,
    handleAddQA,
    handleEditQA,
    handleSaveEdit,
    handleBulkImport,
    handleExportToExcel
  } = useQAManagement(language);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Bulk Import */}
      <BulkImportQA
        onImport={handleBulkImport}
        translations={qaTranslations.qa}
        language={language}
      />

      {/* Right: QA Management */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{qaTranslations.tabs.qa[language]}</CardTitle>
            <CardDescription>
              {language === 'ja' 
                ? 'よくある質問と回答の管理' 
                : 'Manage frequently asked questions and answers'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportToExcel}>
              <File className="h-4 w-4 mr-2" />
              {qaTranslations.qa.export[language]}
            </Button>
            <Button variant="outline" onClick={() => setIsAddQADialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {qaTranslations.qa.addNew[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={qaTranslations.qa.searchPlaceholder[language]}
                className="pl-8"
              />
            </div>
          </div>
          
          <QAList 
            qaList={qaList} 
            onEdit={handleEditQA}
            translations={qaTranslations.qa} 
            language={language} 
          />
        </CardContent>
      </Card>

      {/* Add QA Dialog */}
      <AddQADialog
        isOpen={isAddQADialogOpen}
        onOpenChange={setIsAddQADialogOpen}
        onAddQA={handleAddQA}
        translations={qaTranslations.qa}
        language={language}
      />

      {/* Edit QA Dialog */}
      <EditQADialog
        isOpen={isEditQADialogOpen}
        onOpenChange={setIsEditQADialogOpen}
        onSave={handleSaveEdit}
        initialData={editingQA}
        translations={qaTranslations.qa}
        language={language}
      />
    </div>
  );
}
