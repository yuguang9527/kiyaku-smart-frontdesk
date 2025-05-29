import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Settings, User, LogOut } from 'lucide-react';
import HotelLogo from '../HotelLogo';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const navItems = [
  { icon: <Home className="h-5 w-5" />, label: { en: 'Dashboard', ja: 'ダッシュボード' }, path: '/admin' },
  { icon: <Calendar className="h-5 w-5" />, label: { en: 'Reservations', ja: '予約管理' }, path: '/admin/reservations' },
  { icon: <User className="h-5 w-5" />, label: { en: 'Users', ja: 'ユーザー' }, path: '/admin/users' },
  { icon: <Settings className="h-5 w-5" />, label: { en: 'Settings', ja: '設定' }, path: '/admin/settings' },
];

const AdminNav: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = () => {/* This would use useNavigate in a real implementation */};

  return (
    <header className="border-b bg-primary/5">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <HotelLogo />
          <div className="hidden md:block font-semibold text-lg text-primary">
            {language === 'ja' ? '管理画面' : 'Admin Portal'}
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="flex items-center space-x-4 md:space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="p-2 flex items-center justify-center text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 rounded-md"
                title={item.label[language]}
              >
                {item.icon}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageToggle
            currentLanguage={language}
            onChange={(lang) => setLanguage(lang)}
          />
          
          <Link to="/login">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">{language === 'ja' ? 'ログアウト' : 'Logout'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
