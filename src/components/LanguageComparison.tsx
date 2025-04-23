
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
  }
];

const LanguageComparison = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-500 text-2xl">🎯</span>
          <h2 className="text-2xl font-bold">まとめ</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 bg-white rounded-lg">
          <div className="font-semibold p-3 text-center border-b-2">英語</div>
          <div className="font-semibold p-3 text-center border-b-2">日本語</div>
          <div className="font-semibold p-3 text-center border-b-2">ポイント</div>
          
          {comparisonData.map((item, index) => (
            <React.Fragment key={index}>
              <div className="p-3 border-b">{item.english}</div>
              <div className="p-3 border-b">{item.japanese}</div>
              <div className="p-3 border-b">{item.points}</div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageComparison;
