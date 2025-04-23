
import React from 'react';
import MainNav from '@/components/MainNav';
import LanguageComparison from '@/components/LanguageComparison';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <LanguageComparison />
      </main>
    </div>
  );
};

export default Index;
