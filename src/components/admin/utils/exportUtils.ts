
import { QA } from '../types';

export const exportQAsToCSV = (qaList: QA[], language: 'en' | 'ja') => {
  if (qaList.length === 0) {
    throw new Error(language === 'ja' ? 'エクスポートするデータがありません' : 'No data to export');
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
};
