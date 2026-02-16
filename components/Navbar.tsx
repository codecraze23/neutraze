
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeMode } from '../types';
import { THEMES } from '../constants';

interface NavbarProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme }) => {
  const location = useLocation();
  const activeTheme = THEMES[theme];

  const themes = [
    { id: ThemeMode.LIQUID_LIGHT, icon: '☀️' },
    { id: ThemeMode.LIQUID_DARK, icon: '🌙' },
    { id: ThemeMode.VIBRANT, icon: '🌈' },
    { id: ThemeMode.MINIMAL, icon: '⚪' }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-colors duration-500 ${activeTheme.nav} backdrop-blur-lg border-b border-white/10`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
            N
          </div>
          <span className={`text-2xl font-bold tracking-tight ${activeTheme.text}`}>NeuTraze</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors ${activeTheme.text} hover:opacity-70`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${activeTheme.accent} rounded-full`}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2 bg-black/10 p-1 rounded-full border border-white/10">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                theme === t.id ? 'bg-white shadow-md scale-110' : 'hover:bg-white/20'
              }`}
              title={`Switch to ${t.id} theme`}
            >
              <span className="text-sm">{t.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
