
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeMode } from '../types';
import { THEMES } from '../constants';

interface FooterProps {
  theme: ThemeMode;
  isLoggedIn?: boolean;
}

const Footer: React.FC<FooterProps> = ({ theme, isLoggedIn }) => {
  const activeTheme = THEMES[theme];

  return (
    <footer className={`mt-20 py-12 px-6 border-t border-white/10 ${activeTheme.nav} backdrop-blur-lg`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center text-white font-bold`}>
              N
            </div>
            <span className={`text-xl font-bold ${activeTheme.text}`}>NeuTraze</span>
          </div>
          <p className={`max-w-xs opacity-70 ${activeTheme.text}`}>
            Premium cleaning solutions for the modern home. Highly effective, biodegradable, and brand-forward.
          </p>
        </div>

        <div>
          <h4 className={`font-bold mb-4 ${activeTheme.text}`}>Quick Links</h4>
          <ul className={`space-y-2 text-sm opacity-70 ${activeTheme.text}`}>
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/products" className="hover:underline">Products</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-bold mb-4 ${activeTheme.text}`}>Connect</h4>
          <ul className={`space-y-2 text-sm opacity-70 ${activeTheme.text}`}>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
            {isLoggedIn ? (
              <li><Link to="/admin" className="text-blue-400 font-bold hover:underline">Admin Dashboard</Link></li>
            ) : (
              <li><Link to="/login" className="opacity-10 hover:opacity-30 transition-opacity">Admin Portal</Link></li>
            )}
          </ul>
        </div>
      </div>
      <div className={`max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs opacity-50 ${activeTheme.text}`}>
        © {new Date().getFullYear()} NeuTraze. All rights reserved. 
        <Link to="/privacy" className="ml-4 hover:underline">Privacy Policy</Link>
        <Link to="/terms" className="ml-4 hover:underline">Terms of Service</Link>
      </div>
    </footer>
  );
};

export default Footer;
