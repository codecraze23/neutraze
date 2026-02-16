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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Backend.getEnquiries();
    setEnquiries(data);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const data = await Backend.getEnquiries();
    setEnquiries(data);
    setRefreshing(false);
  };

  const deleteEnquiry = async (id: string) => {
    if(window.confirm("Permanent delete from Cloud Database?")) {
      setRefreshing(true);
      await Backend.deleteEnquiry(id);
      await loadData();
      setRefreshing(false);
    }
  };

  const toggleRead = async (id: string) => {
    setRefreshing(true);
    await Backend.toggleRead(id);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Backend.logout();
    onLogout();
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${activeTheme.text}`}>Cloud Dashboard</h1>
          <p className={`opacity-70 ${activeTheme.text}`}>Admin: tkapatel57@gmail.com</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className={`px-6 py-3 rounded-2xl glass ${activeTheme.glass} ${activeTheme.text} flex items-center gap-2 hover:bg-white/10 transition-all`}
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Syncing...' : 'Sync Database'}
          </button>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
           <p className={`text-sm opacity-50 ${activeTheme.text}`}>Connecting to secure server...</p>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                            disabled={refreshing}
                            onClick={() => toggleRead(enquiry.id)}
                            className={`p-4 rounded-2xl transition-all ${enquiry.read ? 'bg-white/5' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            disabled={refreshing}
                            onClick={() => deleteEnquiry(enquiry.id)}
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
                  <p className={`text-2xl font-light ${activeTheme.text}`}>Cloud Database is Empty</p>
                  <p className="text-sm mt-2">All incoming enquiries will sync here across devices.</p>
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
