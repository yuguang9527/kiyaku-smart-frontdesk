
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import HotelLogo from '../HotelLogo';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

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
        <div className="hidden md:flex ml-auto items-center gap-3">
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
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden animate-slideDown">
            <nav className="flex flex-col p-4 gap-2">
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

export default CustomerNav;
