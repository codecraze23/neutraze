
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeMode } from '../types';
import { THEMES } from '../constants';
import GlassCard from '../components/GlassCard';
import { Backend } from '../services/BackendService';

interface LoginProps {
  theme: ThemeMode;
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ theme, onLogin }) => {
  const activeTheme = THEMES[theme];
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    const success = await Backend.login(email, password);
    
    if (success) {
      onLogin();
      navigate('/admin');
    } else {
      setError('Invalid email or password. Access denied.');
    }
    setIsAuthenticating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <GlassCard themeClass={activeTheme.glass} className="py-12 px-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl`}>
            N
          </div>
          <h1 className={`text-3xl font-bold mb-2 text-center ${activeTheme.text}`}>Internal Login</h1>
          <p className={`opacity-60 mb-8 text-sm text-center ${activeTheme.text}`}>
            NeuTraze Private Server Access
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-50`}>Admin Email</label>
              <input 
                required
                type="email"
                placeholder="tkapatel57@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              />
            </div>
            <div>
              <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-50`}>Password</label>
              <input 
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-400 text-xs font-medium bg-red-400/10 p-2 rounded-lg text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${activeTheme.accent} text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50`}
            >
              {isAuthenticating ? 'Connecting to Server...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className={`text-[10px] opacity-30 uppercase tracking-tighter ${activeTheme.text}`}>
              Hardware Encryption Active
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
