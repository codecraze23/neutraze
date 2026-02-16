
import { ThemeMode } from './types';

/**
 * BACKEND CONFIGURATION:
 * 1. Your emails will be sent to: tkapatel57@gmail.com
 * 2. To activate, register this email at https://formspree.io
 * 3. Replace 'placeholder' with your Formspree ID once you have it.
 */
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/placeholder'; 
export const ADMIN_EMAIL = 'tkapatel57@gmail.com';

export const THEMES = {
  [ThemeMode.LIQUID_LIGHT]: {
    bg: 'bg-[#f8fafc]',
    text: 'text-slate-900',
    glass: 'bg-white/40 border-white/40',
    accent: 'from-blue-400 to-indigo-500',
    nav: 'bg-white/60',
  },
  [ThemeMode.LIQUID_DARK]: {
    bg: 'bg-[#0f172a]',
    text: 'text-slate-100',
    glass: 'bg-slate-900/60 border-slate-700/50',
    accent: 'from-indigo-600 to-violet-700',
    nav: 'bg-slate-950/60',
  },
  [ThemeMode.VIBRANT]: {
    bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
    text: 'text-white',
    glass: 'bg-white/10 border-white/20',
    accent: 'from-pink-500 to-rose-600',
    nav: 'bg-black/20',
  },
  [ThemeMode.MINIMAL]: {
    bg: 'bg-white',
    text: 'text-gray-800',
    glass: 'bg-gray-50/50 border-gray-200',
    accent: 'from-gray-700 to-gray-900',
    nav: 'bg-white/80',
  }
};

export const SAMPLE_PRODUCTS = [
  {
    "id": "neu-fc-001",
    "sku": "NEU-FC-001",
    "title": "NeuTraze Floor Cleaner - Original",
    "short_description": "Powerful floor cleaner for home and commercial spaces. Cleans grease and leaves a fresh scent.",
    "long_description": "<p>NeuTraze Floor Cleaner is formulated for deep cleaning of tile, marble and laminate floors. Biodegradable formula, fast-drying.</p><ul><li>Volume: 1L</li><li>Use: Dilute 1:100 for routine cleaning</li></ul>",
    "price": 299.00,
    "currency": "INR",
    "png_url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
    "photos": [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800"
    ],
    "availability": "in_stock",
    "tags": ["floor", "cleaner"],
    "recommend": ["neu-gc-001"]
  },
  {
    "id": "neu-gc-001",
    "sku": "NEU-GC-001",
    "title": "NeuTraze Glass Cleaner",
    "short_description": "Streak-free glass cleaner for windows, mirrors and screens.",
    "long_description": "<p>NeuTraze Glass Cleaner delivers a streak-free shine using a fast-evaporating, non-damaging formula. Safe for screens and coated glass.</p>",
    "price": 199.00,
    "currency": "INR",
    "png_url": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600",
    "photos": [
      "https://images.unsplash.com/photo-1518349662322-c4573ab21d27?auto=format&fit=crop&q=80&w=800"
    ],
    "availability": "in_stock",
    "tags": ["glass", "cleaner"],
    "recommend": ["neu-fc-001"]
  }
];
