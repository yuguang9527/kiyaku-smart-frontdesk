
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { QA } from './types';

interface QAListProps {
  qaList: QA[];
  translations: {
    question: { ja: string; en: string };
    answer: { ja: string; en: string };
    actions: { ja: string; en: string };
    noData: { ja: string; en: string };
  };
  language: 'en' | 'ja';
}

export function QAList({ qaList, translations, language }: QAListProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{translations.question[language]}</TableHead>
            <TableHead>{translations.answer[language]}</TableHead>
            <TableHead className="w-24">{translations.actions[language]}</TableHead>
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
                {translations.noData[language]}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
