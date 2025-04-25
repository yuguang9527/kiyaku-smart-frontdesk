
import React from 'react';
import MainNav from '@/components/MainNav';
import LanguageComparison from '@/components/LanguageComparison';
import { useLanguage } from '@/hooks/use-language';

const Index = () => {
  const { language } = useLanguage();
  const pageTitle = language === 'ja' ? '言語比較' : 'Language Comparison';
  
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{pageTitle}</h1>
        <LanguageComparison />
      </main>
    </div>
  );
};

export default Index;
