
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeMode } from '../types';
import { THEMES } from '../constants';
import GlassCard from '../components/GlassCard';
import { Backend } from '../services/BackendService';

interface ContactProps {
  theme: ThemeMode;
}

const Contact: React.FC<ContactProps> = ({ theme }) => {
  const location = useLocation();
  const activeTheme = THEMES[theme];
  const state = location.state as { product?: string, qty?: number };

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: state?.product || '',
    quantity: state?.qty || 1,
    message: '',
    consent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const success = await Backend.submitEnquiry({
        name: formData.name,
        email: formData.email,
        product: formData.product,
        quantity: formData.quantity,
        message: formData.message
      });

      if (success) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="pt-40 px-6 max-w-4xl mx-auto text-center min-h-[80vh]">
        <GlassCard themeClass={activeTheme.glass} className="py-20">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-400/20"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className={`text-4xl font-bold mb-4 ${activeTheme.text}`}>Message Sent!</h1>
          <p className={`text-xl opacity-70 ${activeTheme.text} mb-12 max-w-lg mx-auto`}>
            Your inquiry has been stored securely in our database. Our team will review it and get back to you at {formData.email}.
          </p>
          <button 
            onClick={() => setFormStatus('idle')}
            className={`px-10 py-4 rounded-xl bg-gradient-to-r ${activeTheme.accent} text-white font-bold transition-transform hover:scale-105 shadow-lg`}
          >
            Send New Message
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${activeTheme.text}`}>Get in Touch</h1>
        <p className={`text-lg opacity-70 ${activeTheme.text}`}>Direct communication with the NeuTraze team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard themeClass={activeTheme.glass}>
            <h3 className={`font-bold mb-4 ${activeTheme.text}`}>Internal Server</h3>
            <p className={`opacity-70 text-sm ${activeTheme.text}`}>Messages are logged directly into our secure admin portal for processing.</p>
          </GlassCard>
          <GlassCard themeClass={activeTheme.glass}>
            <h3 className={`font-bold mb-4 ${activeTheme.text}`}>Contact Details</h3>
            <p className={`opacity-70 text-sm ${activeTheme.text}`}>Official Support: tkapatel57@gmail.com</p>
            <p className={`opacity-70 text-sm ${activeTheme.text}`}>Support Line: +91 800-NEUTRAZE</p>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard themeClass={activeTheme.glass}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-60`}>Full Name</label>
                  <input 
                    required
                    type="text"
                    className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-60`}>Email Address</label>
                  <input 
                    required
                    type="email"
                    className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-60`}>Product Choice</label>
                  <input 
                    type="text"
                    className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-60`}>Quantity</label>
                  <input 
                    type="number"
                    min="1"
                    className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${activeTheme.text} opacity-60`}>Your Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className={`w-full p-4 rounded-xl bg-black/10 border border-white/10 ${activeTheme.text} focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formStatus === 'submitting'}
                className={`w-full py-5 rounded-xl bg-gradient-to-r ${activeTheme.accent} text-white font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50`}
              >
                {formStatus === 'submitting' ? 'Saving to Database...' : 'Submit Inquiry'}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Contact;
