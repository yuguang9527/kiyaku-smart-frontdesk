import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageSquare, Calendar, Phone } from 'lucide-react';
import HotelLogo from './HotelLogo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/hooks/use-language';

const navItems = [
  { icon: <Home className="h-5 w-5" />, label: { en: 'Dashboard', ja: 'ダッシュボード' }, path: '/' },
  { icon: <MessageSquare className="h-5 w-5" />, label: { en: 'Messages', ja: 'メッセージ' }, path: '/messages' },
  { icon: <Calendar className="h-5 w-5" />, label: { en: 'Reservations', ja: '予約' }, path: '/reservations' },
  { icon: <Phone className="h-5 w-5" />, label: { en: 'Calls', ja: '通話' }, path: '/calls' },
];

const MainNav: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <HotelLogo />
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="flex items-center space-x-1 md:space-x-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="px-3 py-2 flex flex-col items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <div>{item.icon}</div>
                <span className="text-xs whitespace-nowrap">{item.label[language]}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="ml-auto">
          <LanguageToggle
            currentLanguage={language}
            onChange={(lang) => setLanguage(lang)}
          />
        </div>
      </div>
    </header>
  );
};

export default MainNav;
