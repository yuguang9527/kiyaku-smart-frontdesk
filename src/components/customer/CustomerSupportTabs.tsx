
import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface CustomerSupportTabsProps {
  activeTab: 'chat' | 'phone';
  setActiveTab: (tab: 'chat' | 'phone') => void;
}

const CustomerSupportTabs: React.FC<CustomerSupportTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { language } = useLanguage();

  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
        <button 
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'chat' 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
            : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('chat')}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {language === 'ja' ? 'チャット' : 'Chat'}
          </div>
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'phone' 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
            : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('phone')}
        >
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {language === 'ja' ? '電話' : 'Phone'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportTabs;
