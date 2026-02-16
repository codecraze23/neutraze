
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThemeMode, Product } from '../types';
import { THEMES } from '../constants';
import GlassCard from '../components/GlassCard';

interface ProductsProps {
  theme: ThemeMode;
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ theme, products }) => {
  const activeTheme = THEMES[theme];
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const tags = Array.from(new Set(products.flatMap(p => p.tags)));

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.tags.includes(filter);
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12"
      >
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${activeTheme.text}`}>Our Collection</h1>
        <p className={`text-lg opacity-70 ${activeTheme.text}`}>Discover premium cleaning technology for every surface.</p>
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1">
          <input 
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full px-6 py-4 rounded-2xl glass ${activeTheme.glass} ${activeTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-4 rounded-2xl transition-all whitespace-nowrap ${
              filter === 'all' 
                ? `bg-gradient-to-r ${activeTheme.accent} text-white font-bold` 
                : `glass ${activeTheme.glass} ${activeTheme.text} opacity-70`
            }`}
          >
            All Products
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-6 py-4 rounded-2xl capitalize transition-all whitespace-nowrap ${
                filter === tag 
                  ? `bg-gradient-to-r ${activeTheme.accent} text-white font-bold` 
                  : `glass ${activeTheme.glass} ${activeTheme.text} opacity-70`
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard 
                tilt 
                hoverScale
                themeClass={activeTheme.glass}
                className="h-full group"
              >
                <div className="relative h-72 mb-6 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
                  <img 
                    src={product.png_url} 
                    alt={product.title}
                    className="object-contain h-56 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${activeTheme.text}`}>{product.title}</h3>
                <p className={`text-sm opacity-70 mb-4 line-clamp-3 ${activeTheme.text}`}>
                  {product.short_description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase tracking-widest opacity-50 ${activeTheme.text}`}>Price</span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${activeTheme.accent} bg-clip-text text-transparent`}>
                      {product.currency} {product.price}
                    </span>
                  </div>
                  <Link 
                    to={`/products/${product.id}`}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${activeTheme.accent} text-white font-bold transition-transform hover:scale-105`}
                  >
                    View Details
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className={`text-xl opacity-50 ${activeTheme.text}`}>No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
