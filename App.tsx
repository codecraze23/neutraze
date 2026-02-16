
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeMode, Product } from './types';
import { THEMES, SAMPLE_PRODUCTS } from './constants';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import AIChatAssistant from './components/AIChatAssistant';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const AboutPage = ({ theme }: { theme: ThemeMode }) => {
  const activeTheme = THEMES[theme];
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className={`text-5xl font-bold mb-8 ${activeTheme.text}`}>About NeuTraze</h1>
      <div className={`prose prose-lg ${activeTheme.text} opacity-80 space-y-6`}>
        <p>NeuTraze was born from a simple observation: cleaning products haven't evolved in decades. While we use futuristic smartphones and drive electric cars, we still clean our homes with harsh, outdated chemicals.</p>
        <p>Our mission is to bring liquid-glass technology to household cleaning. Our formulas are biodegradable, safe for families, yet more powerful than traditional cleaners.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
           <div className="p-8 rounded-3xl glass bg-white/5 border-white/10">
             <h3 className="font-bold text-2xl mb-2">Our Vision</h3>
             <p className="text-sm">To become the world standard for premium, high-tech household care.</p>
           </div>
           <div className="p-8 rounded-3xl glass bg-white/5 border-white/10">
             <h3 className="font-bold text-2xl mb-2">Our Promise</h3>
             <p className="text-sm">Never compromise on performance or environmental responsibility.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('neutraze-theme');
    return (saved as ThemeMode) || ThemeMode.LIQUID_LIGHT;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('neutraze-admin-auth') === 'true';
  });

  const [products] = useState<Product[]>(SAMPLE_PRODUCTS as Product[]);

  useEffect(() => {
    localStorage.setItem('neutraze-theme', theme);
  }, [theme]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('neutraze-admin-auth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('neutraze-admin-auth');
  };

  const activeTheme = THEMES[theme];

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-1000 ${activeTheme.bg} selection:bg-blue-500/30`}>
        <AnimatedBackground theme={theme} />
        
        <Navbar theme={theme} setTheme={setTheme} />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home theme={theme} products={products} />} />
              <Route path="/products" element={<Products theme={theme} products={products} />} />
              <Route path="/products/:id" element={<ProductDetail theme={theme} products={products} />} />
              <Route path="/about" element={<AboutPage theme={theme} />} />
              <Route path="/contact" element={<Contact theme={theme} />} />
              <Route 
                path="/login" 
                element={!isLoggedIn ? <Login theme={theme} onLogin={handleLogin} /> : <Navigate to="/admin" />} 
              />
              <Route 
                path="/admin" 
                element={isLoggedIn ? <AdminDashboard theme={theme} onLogout={handleLogout} /> : <Navigate to="/login" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>

        <AIChatAssistant theme={theme} />
        <Footer theme={theme} isLoggedIn={isLoggedIn} />
      </div>
    </Router>
  );
};

export default App;
