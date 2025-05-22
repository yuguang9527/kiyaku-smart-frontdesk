
import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

interface CustomerSupportHeroProps {
  activeTab: 'chat' | 'phone';
  setActiveTab: (tab: 'chat' | 'phone') => void;
}

const CustomerSupportHero: React.FC<CustomerSupportHeroProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { language } = useLanguage();

  return (
    <div className="mb-10">
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-8">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-blue-900">
            {language === 'ja' ? '24時間365日サポート' : '24/7 Support Available'}
          </h2>
          <p className="text-blue-700 md:text-lg max-w-md">
            {language === 'ja' 
              ? 'AI技術を活用した最先端のサポートシステムで、いつでもサポートいたします。' 
              : 'Our cutting-edge support system powered by AI is always ready to assist you.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button 
              className={`${activeTab === 'chat' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600' 
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'} 
                transition-all duration-300 shadow-md hover:shadow-lg`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {language === 'ja' ? 'チャットを開始' : 'Start Chat'}
            </Button>
            <Button 
              className={`${activeTab === 'phone' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white' 
                : 'border-blue-200 text-blue-700 hover:bg-blue-50'} 
                transition-all duration-300 shadow-md hover:shadow-lg ${activeTab !== 'phone' ? 'bg-white border' : ''}`}
              onClick={() => setActiveTab('phone')}
            >
              <Phone className="mr-2 h-5 w-5" />
              {language === 'ja' ? '電話サポート' : 'Phone Support'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportHero;
