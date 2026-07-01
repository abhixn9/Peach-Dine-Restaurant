import { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LogoIcon from './LogoIcon';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdminMode, setIsAdminMode, currentUser, logoutUser } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Our Story', value: 'about' },
    { label: 'Menu', value: 'menu' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Location', value: 'location' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleItemClick = (value: string) => {
    onNavigate(value);
    setIsOpen(false);
    const element = document.getElementById(value);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };



  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-stone-900/90 backdrop-blur-md shadow-md py-3.5 border-b border-stone-800'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              id="nav-logo"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleItemClick('home')}
            >
              <LogoIcon size={48} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" />
              <div>
                <span 
                  className="block font-sans italic font-black uppercase leading-none pb-0.5 tracking-wider text-lg sm:text-xl"
                >
                  <span style={{ color: '#F5803B' }}>Peach</span>
                  <span className="bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent px-0.5 inline-block">&amp;</span>
                  <span style={{ color: '#F6A6C5' }}>Dine</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-amber-500 mt-0.5 block">
                  Artisanal Kitchen
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-5">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  id={`nav-link-${item.value}`}
                  onClick={() => handleItemClick(item.value)}
                  className={`font-sans text-xs font-medium transition-colors hover:text-amber-500 cursor-pointer ${
                    activeSection === item.value
                      ? 'text-amber-500'
                      : 'text-stone-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}



              <button
                id="nav-cta-book"
                onClick={() => handleItemClick('reservation')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer border-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Table</span>
              </button>

              {(currentUser || isAdminMode) && (
                <div className="flex items-center space-x-2 border-l border-stone-800 pl-3 animate-fadeIn">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-[9px] text-stone-500 font-mono uppercase tracking-wider leading-none">
                      {isAdminMode ? 'System Level' : 'Guest Profile'}
                    </span>
                    <span className="text-xs text-amber-500 font-sans font-extrabold tracking-tight mt-0.5 truncate max-w-[100px]">
                      {isAdminMode ? 'Admin Staff' : currentUser?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (isAdminMode) {
                        setIsAdminMode(false);
                      } else {
                        logoutUser();
                      }
                    }}
                    title={isAdminMode ? "Exit Admin Mode" : "Log Out Profile"}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-rose-400 font-sans font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu-panel"
          className={`md:hidden absolute top-full left-0 w-full bg-stone-950 border-b border-stone-800/80 transition-all duration-300 ease-in-out ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                id={`mobile-nav-link-${item.value}`}
                onClick={() => handleItemClick(item.value)}
                className={`block w-full text-left py-1.5 font-sans text-sm font-medium transition-colors ${
                  activeSection === item.value
                    ? 'text-amber-500 border-l-2 border-amber-500 pl-2'
                    : 'text-stone-300 hover:text-white pl-2'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <button
                id="mobile-nav-cta-book"
                onClick={() => handleItemClick('reservation')}
                className="flex items-center justify-center space-x-1.5 w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer border-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Table</span>
              </button>

              {(currentUser || isAdminMode) && (
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-850/50 flex items-center justify-between animate-fadeIn">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-stone-500 font-mono uppercase tracking-wider">
                      {isAdminMode ? 'System Terminal' : 'Signed In Guest'}
                    </span>
                    <span className="text-xs text-amber-500 font-sans font-extrabold leading-none mt-0.5">
                      {isAdminMode ? 'Admin Staff' : `${currentUser?.name} (${currentUser?.dietaryPreference})`}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (isAdminMode) {
                        setIsAdminMode(false);
                      } else {
                        logoutUser();
                      }
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-stone-950 border border-stone-800 hover:bg-stone-900 text-stone-300 hover:text-rose-400 font-sans font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              )}


            </div>
          </div>
        </div>
      </nav>


    </>
  );
}
