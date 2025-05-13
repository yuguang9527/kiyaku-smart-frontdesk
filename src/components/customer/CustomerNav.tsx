
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Phone, User, Menu } from 'lucide-react';
import HotelLogo from '../HotelLogo';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: <MessageSquare className="h-5 w-5" />, label: { en: 'Chat', ja: 'チャット' }, path: '/customer' },
  { icon: <Calendar className="h-5 w-5" />, label: { en: 'Reservations', ja: '予約' }, path: '/customer/reservations' },
  { icon: <Phone className="h-5 w-5" />, label: { en: 'Call', ja: '電話' }, path: '/customer/call' },
];

const CustomerNav: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <HotelLogo variant="gradient" />
        </div>
        
        {/* Mobile menu toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto space-x-1">
          {navItems.map((item, index) => (
            <NavLink key={index} item={item} language={language} />
          ))}
          <div className="ml-4 flex items-center gap-3">
            <LanguageToggle
              currentLanguage={language}
              onChange={(lang) => setLanguage(lang)}
            />
            <Link to="/login">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-colors shadow-sm">
                <User className="h-4 w-4 mr-1" />
                <span>{language === 'ja' ? 'ログイン' : 'Login'}</span>
              </Button>
            </Link>
          </div>
        </nav>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden animate-slideDown">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label[language]}</span>
                </Link>
              ))}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <LanguageToggle
                  currentLanguage={language}
                  onChange={(lang) => setLanguage(lang)}
                />
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm">
                    <User className="h-4 w-4 mr-1" />
                    <span>{language === 'ja' ? 'ログイン' : 'Login'}</span>
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Extracted NavLink component for cleaner code
interface NavLinkProps {
  item: {
    icon: React.ReactNode;
    label: { en: string; ja: string };
    path: string;
  };
  language: 'en' | 'ja';
}

const NavLink: React.FC<NavLinkProps> = ({ item, language }) => {
  const isActive = location.pathname === item.path;
  
  return (
    <Link
      to={item.path}
      className={cn(
        "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "text-blue-600 bg-blue-50" 
          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
      )}
    >
      <span className={cn(
        "transition-colors",
        isActive ? "text-blue-500" : "text-slate-500"
      )}>
        {item.icon}
      </span>
      <span>{item.label[language]}</span>
    </Link>
  );
};

export default CustomerNav;
