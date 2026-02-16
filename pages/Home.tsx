
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThemeMode, Product } from '../types';
import { THEMES } from '../constants';
import GlassCard from '../components/GlassCard';

interface HomeProps {
  theme: ThemeMode;
  products: Product[];
}

const Home: React.FC<HomeProps> = ({ theme, products }) => {
  const activeTheme = THEMES[theme];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative pt-24 pb-12 px-6 overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <GlassCard 
            themeClass={activeTheme.glass}
            className="mb-8 mx-auto inline-block px-8 py-12 md:px-16"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-5xl md:text-8xl font-bold mb-6 tracking-tighter ${activeTheme.text}`}
            >
              Clean Reimagined.
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-xl md:text-2xl mb-10 opacity-80 ${activeTheme.text} leading-relaxed`}
            >
              Experience the next generation of home care with our advanced <br className="hidden md:block" /> liquid-glass formulated cleaning solutions.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link 
                to="/products"
                className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${activeTheme.accent} text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform`}
              >
                Shop Products
              </Link>
              <Link 
                to="/contact"
                className={`px-8 py-4 rounded-2xl border-2 border-white/20 glass text-lg font-bold ${activeTheme.text} hover:bg-white/10 transition-colors`}
              >
                Contact Sales
              </Link>
            </motion.div>
          </GlassCard>
        </motion.div>

        {/* Floating elements decoration */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -z-10 top-1/4 left-10 md:left-40 w-24 h-24 rounded-3xl bg-blue-400/20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -z-10 bottom-1/4 right-10 md:right-40 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
        />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-24 z-10 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {products.slice(0, 3).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <GlassCard 
                tilt 
                hoverScale
                themeClass={activeTheme.glass}
                className="h-full flex flex-col group"
              >
                <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
                  <img 
                    src={product.png_url} 
                    alt={product.title}
                    className="object-contain h-48 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                    {product.availability === 'in_stock' ? 'In Stock' : 'Pre-order'}
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${activeTheme.text}`}>{product.title}</h3>
                <p className={`text-sm opacity-70 mb-4 line-clamp-2 ${activeTheme.text}`}>
                  {product.short_description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${activeTheme.accent} bg-clip-text text-transparent`}>
                    {product.currency} {product.price}
                  </span>
                  <Link 
                    to={`/products/${product.id}`}
                    className={`p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors ${activeTheme.text}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="arrow-narrow-right" />
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto py-24 text-center">
         <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="space-y-8"
         >
           <h2 className={`text-3xl font-bold ${activeTheme.text}`}>What our customers say</h2>
           <GlassCard themeClass={activeTheme.glass}>
             <p className={`text-xl italic ${activeTheme.text} mb-4`}>
               "The NeuTraze glass cleaner is magic. I've never seen my windows this clear. It's actually a pleasure to clean."
             </p>
             <cite className={`font-bold block ${activeTheme.text}`}>— Sarah J., Professional Designer</cite>
           </GlassCard>
         </motion.div>
      </section>
    </div>
  );
};

export default Home;
