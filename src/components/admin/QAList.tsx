
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { QA } from './types';

interface QAListProps {
  qaList: QA[];
  onEdit: (index: number, qa: QA) => void;
  translations: {
    category: { ja: string; en: string };
    question: { ja: string; en: string };
    answer: { ja: string; en: string };
    actions: { ja: string; en: string };
    noData: { ja: string; en: string };
    edit: { ja: string; en: string };
  };
  language: 'en' | 'ja';
}

export function QAList({ qaList, onEdit, translations, language }: QAListProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>{translations.category[language]}</TableHead>
            <TableHead>{translations.question[language]}</TableHead>
            <TableHead>{translations.answer[language]}</TableHead>
            <TableHead className="w-24">{translations.actions[language]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qaList.length > 0 ? (
            qaList.map((qa, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium">{qa.category || 'カテゴリなし'}</TableCell>
                <TableCell className="font-medium">{qa.question}</TableCell>
                <TableCell>{qa.answer.length > 50 ? `${qa.answer.slice(0, 50)}...` : qa.answer}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(index, qa)}
                  >
                    <span className="sr-only">{translations.edit[language]}</span>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                {translations.noData[language]}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
