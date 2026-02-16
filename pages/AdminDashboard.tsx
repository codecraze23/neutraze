
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeMode, Enquiry } from '../types';
import { THEMES } from '../constants';
import GlassCard from '../components/GlassCard';
import { Backend } from '../services/BackendService';

interface AdminDashboardProps {
  theme: ThemeMode;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ theme, onLogout }) => {
  const activeTheme = THEMES[theme];
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Backend.getEnquiries();
    setEnquiries(data);
    setLoading(false);
  };

  const deleteEnquiry = async (id: string) => {
    if(window.confirm("Permanent delete from database?")) {
      await Backend.deleteEnquiry(id);
      loadData();
    }
  };

  const toggleRead = async (id: string) => {
    await Backend.toggleRead(id);
    loadData();
  };

  const handleLogout = () => {
    Backend.logout();
    onLogout();
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${activeTheme.text}`}>Internal Dashboard</h1>
          <p className={`opacity-70 ${activeTheme.text}`}>Logged in as: tkapatel57@gmail.com</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className={`px-6 py-3 rounded-2xl glass ${activeTheme.glass} ${activeTheme.text}`}>
            <span className="text-xs uppercase opacity-50 block">Database Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="font-bold">Encrypted & Online</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
          >
            Exit System
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
           <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
              {enquiries.length > 0 ? (
                enquiries.map((enquiry) => (
                  <motion.div
                    key={enquiry.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <GlassCard 
                      themeClass={`${activeTheme.glass} ${enquiry.read ? 'opacity-40 grayscale-[0.5]' : 'ring-2 ring-blue-500/20'}`}
                      className="!p-0 overflow-hidden"
                    >
                      <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className={`text-lg font-bold ${activeTheme.text}`}>{enquiry.name}</span>
                            {!enquiry.read && <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse uppercase">New</span>}
                            <span className={`text-[10px] opacity-40 ${activeTheme.text}`}>
                              {new Date(enquiry.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-2 py-0.5 rounded-lg bg-black/10 text-[10px] ${activeTheme.text}`}>{enquiry.email}</span>
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold uppercase">
                              {enquiry.product || 'General'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg bg-black/10 text-[10px] ${activeTheme.text}`}>Qty: {enquiry.quantity}</span>
                          </div>
                          <p className={`text-sm opacity-90 ${activeTheme.text} leading-relaxed p-4 bg-white/5 rounded-2xl border border-white/5`}>
                            {enquiry.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleRead(enquiry.id)}
                            title={enquiry.read ? "Mark as unread" : "Mark as read"}
                            className={`p-4 rounded-2xl transition-all ${enquiry.read ? 'bg-white/5' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => deleteEnquiry(enquiry.id)}
                            title="Delete permanently"
                            className="p-4 rounded-2xl bg-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/20 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-40 opacity-20">
                  <p className={`text-2xl font-light ${activeTheme.text}`}>Database is Empty</p>
                  <p className="text-sm mt-2">New leads will appear here automatically.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
