
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Phone, User } from 'lucide-react';
import HotelLogo from '../HotelLogo';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: <MessageSquare className="h-5 w-5" />, label: { en: 'Chat', ja: 'チャット' }, path: '/customer' },
  { icon: <Calendar className="h-5 w-5" />, label: { en: 'Reservations', ja: '予約' }, path: '/customer/reservations' },
  { icon: <Phone className="h-5 w-5" />, label: { en: 'Call', ja: '電話' }, path: '/customer/call' },
];

const CustomerNav: React.FC = () => {
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
          <div className="ml-4 flex items-center gap-4">
            <LanguageToggle
              currentLanguage={language}
              onChange={(lang) => setLanguage(lang)}
            />
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{language === 'ja' ? 'ログイン' : 'Login'}</span>
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default CustomerNav;
