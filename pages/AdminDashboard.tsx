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
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => performSync(), 45000); // Auto sync every 45s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    await performSync();
    setLoading(false);
  };

  const performSync = async () => {
    setErrorStatus(null);
    try {
      const data = await Backend.getEnquiries();
      setEnquiries(data);
      setLastSync(new Date());
    } catch (e) {
      setErrorStatus("Network Sync Failed. Using local cache.");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await performSync();
    // Simulate minimal delay for UI feedback
    setTimeout(() => setRefreshing(false), 800);
  };

  const deleteEnquiry = async (id: string) => {
    if(window.confirm("Remove this entry from Cloud Database?")) {
      setRefreshing(true);
      await Backend.deleteEnquiry(id);
      await performSync();
      setRefreshing(false);
    }
  };

  const toggleRead = async (id: string) => {
    setRefreshing(true);
    await Backend.toggleRead(id);
    await performSync();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Backend.logout();
    onLogout();
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className={`text-4xl font-bold mb-2 flex items-center gap-4 ${activeTheme.text}`}>
            NeuTraze Dashboard
            {refreshing && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full animate-pulse"
              >
                LIVE SYNCING...
              </motion.span>
            )}
          </h1>
          <div className="flex flex-wrap items-center gap-4 opacity-60 text-sm">
            <span className={`flex items-center gap-1.5 ${activeTheme.text}`}>
              <span className={`w-2 h-2 rounded-full ${errorStatus ? 'bg-red-500' : 'bg-green-500'}`} />
              {errorStatus || 'Cloud Connection Active'}
            </span>
            {lastSync && (
              <span className={`font-mono text-xs ${activeTheme.text}`}>
                Updated: {lastSync.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className={`px-6 py-3 rounded-2xl glass ${activeTheme.glass} ${activeTheme.text} flex items-center gap-3 hover:bg-white/10 transition-all group active:scale-95 disabled:opacity-50`}
          >
            <svg className={`w-5 h-5 transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-bold">Force Sync Now</span>
          </button>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
           <div className="relative w-16 h-16">
             <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
             <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
           </div>
           <p className={`text-sm tracking-widest uppercase opacity-40 font-bold ${activeTheme.text}`}>Verifying Encrypted Cloud Bin...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Cloud Total', val: enquiries.length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Processed', val: enquiries.filter(e => e.read).length, color: 'text-green-500', bg: 'bg-green-500/10' },
              { label: 'Awaiting', val: enquiries.filter(e => !e.read).length, color: 'text-amber-500', bg: 'bg-amber-500/10' }
            ].map((stat, i) => (
              <GlassCard key={i} themeClass={activeTheme.glass} className="!p-6 border-none">
                <p className={`text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1 ${activeTheme.text}`}>{stat.label}</p>
                <div className="flex items-end gap-3">
                   <p className={`text-4xl font-bold ${activeTheme.text}`}>{stat.val}</p>
                   <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${stat.bg} ${stat.color}`}>+ Verified</div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* List */}
          <AnimatePresence mode='popLayout'>
            {enquiries.length > 0 ? (
              enquiries.map((enquiry) => (
                <motion.div
                  key={enquiry.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <GlassCard 
                    themeClass={`${activeTheme.glass} ${enquiry.read ? 'opacity-40 grayscale-[0.3]' : 'ring-1 ring-blue-500/30'}`}
                    className="!p-0 mb-4 overflow-hidden border-none shadow-sm"
                  >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className={`text-2xl font-bold ${activeTheme.text}`}>{enquiry.name}</h3>
                          {!enquiry.read && <span className="bg-blue-500 text-white text-[9px] px-2 py-1 rounded font-black uppercase tracking-tighter">Action Required</span>}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-lg bg-black/20 text-xs font-mono opacity-80">{enquiry.email}</span>
                          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-black uppercase tracking-widest">{enquiry.product || 'General'}</span>
                          <span className="px-3 py-1 rounded-lg bg-black/20 text-xs font-mono opacity-80">Qty: {enquiry.quantity}</span>
                        </div>

                        <div className="relative group">
                          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className={`text-sm leading-relaxed p-4 bg-white/5 rounded-2xl ${activeTheme.text}`}>
                            {enquiry.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => toggleRead(enquiry.id)}
                          className={`flex-1 md:w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${enquiry.read ? 'bg-white/5 text-slate-500' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-500/30'}`}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteEnquiry(enquiry.id)}
                          className="flex-1 md:w-16 h-16 rounded-2xl bg-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-3xl">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold opacity-30 ${activeTheme.text}`}>Cloud Inbox Empty</h2>
                <p className="text-xs opacity-20 mt-2 tracking-widest uppercase">Waiting for first NeuTraze entry...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
