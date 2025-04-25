
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/hooks/use-language';

interface ComparisonItem {
  english: string;
  japanese: string;
  points: string;
}

const comparisonData: ComparisonItem[] = [
  {
    english: "Preposition (前置詞)",
    japanese: "名詞の前について関係を示す言葉",
    points: "in, on, at, to, for など"
  },
  {
    english: "使い方",
    japanese: "動詞のあとによく出てくる",
    points: "\"go to school\" など"
  },
  {
    english: "Article (冠詞)",
    japanese: "名詞の前に置く言葉",
    points: "a, an, the"
  },
  {
    english: "Conjunction (接続詞)",
    japanese: "語や句、節を接続する言葉",
    points: "and, but, or, because, when"
  }
];

const LanguageComparison = () => {
  const { language } = useLanguage();
  
  const title = language === 'ja' ? 'まとめ' : 'Summary';
  const headers = {
    english: language === 'ja' ? '英語' : 'English',
    japanese: language === 'ja' ? '日本語' : 'Japanese',
    points: language === 'ja' ? 'ポイント' : 'Points'
  };

  return (
    <div className="fade-in">
      <Card className="w-full max-w-4xl mx-auto shadow-md">
        <CardHeader className="bg-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary text-2xl">🎯</span>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="font-semibold p-3 text-left border-b">{headers.english}</th>
                  <th className="font-semibold p-3 text-left border-b">{headers.japanese}</th>
                  <th className="font-semibold p-3 text-left border-b">{headers.points}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? "bg-white" : "bg-secondary/20"}
                  >
                    <td className="p-3 border-b">{item.english}</td>
                    <td className="p-3 border-b">{item.japanese}</td>
                    <td className="p-3 border-b">{item.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageComparison;
