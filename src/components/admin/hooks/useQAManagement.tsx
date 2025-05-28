
import { useState } from 'react';
import { toast } from 'sonner';
import { QA } from '../types';
import { QAFormValues } from '../AddQADialog';
import { EditQAFormValues } from '../EditQADialog';
import { exportQAsToCSV } from '../utils/exportUtils';

export function useQAManagement(language: 'en' | 'ja') {
  const [isAddQADialogOpen, setIsAddQADialogOpen] = useState(false);
  const [isEditQADialogOpen, setIsEditQADialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [qaList, setQAList] = useState<QA[]>([]);

  const handleAddQA = (data: QAFormValues) => {
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
    try {
      exportQAsToCSV(qaList, language);
      toast.success(language === 'ja' ? 'Q&Aリストをエクスポートしました' : 'Q&A list exported successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  };

  const editingQA = editingIndex !== null ? qaList[editingIndex] : undefined;

  return {
    // State
    isAddQADialogOpen,
    setIsAddQADialogOpen,
    isEditQADialogOpen,
    setIsEditQADialogOpen,
    qaList,
    editingQA,
    
    // Handlers
    handleAddQA,
    handleEditQA,
    handleSaveEdit,
    handleBulkImport,
    handleExportToExcel
  };
}
