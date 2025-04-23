
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageSquare, Calendar, Settings, Phone } from 'lucide-react';
import HotelLogo from './HotelLogo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/hooks/use-language';

const navItems = [
  { icon: <Home className="h-5 w-5" />, label: { en: 'Dashboard', ja: 'ダッシュボード' }, path: '/' },
  { icon: <MessageSquare className="h-5 w-5" />, label: { en: 'Messages', ja: 'メッセージ' }, path: '/messages' },
  { icon: <Calendar className="h-5 w-5" />, label: { en: 'Reservations', ja: '予約' }, path: '/reservations' },
  { icon: <Phone className="h-5 w-5" />, label: { en: 'Calls', ja: '通話' }, path: '/calls' },
  { icon: <Settings className="h-5 w-5" />, label: { en: 'Settings', ja: '設定' }, path: '/settings' },
];

const MainNav: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <HotelLogo />
        </div>
        <nav className="ml-auto flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex flex-col items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <div className="mb-1">{item.icon}</div>
              <span>{item.label[language]}</span>
            </Link>
          ))}
          <div className="ml-4">
            <LanguageToggle
              currentLanguage={language}
              onChange={(lang) => setLanguage(lang)}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default MainNav;
