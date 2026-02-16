
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeMode, Product } from '../types';
import { THEMES } from '../constants';
import GlassCard from '../components/GlassCard';

interface ProductDetailProps {
  theme: ThemeMode;
  products: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ theme, products }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeTheme = THEMES[theme];
  const product = products.find(p => p.id === id);

  const [activeImage, setActiveImage] = useState(product?.png_url || '');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!product) {
    return (
      <div className="pt-40 text-center">
        <h1 className={`text-2xl ${activeTheme.text}`}>Product not found.</h1>
        <Link to="/products" className="text-blue-500 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const handleCopyDetails = () => {
    const text = `Product: ${product.title}\nPrice: ${product.currency} ${product.price}\nLink: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gallery = [product.png_url, ...product.photos];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link 
        to="/products"
        className={`inline-flex items-center space-x-2 mb-8 ${activeTheme.text} opacity-70 hover:opacity-100 transition-opacity`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-6">
          <GlassCard themeClass={activeTheme.glass} className="p-4 bg-black/5 aspect-square flex items-center justify-center">
            <AnimatePresence mode='wait'>
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                src={activeImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </AnimatePresence>
          </GlassCard>
          <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl glass ${activeTheme.glass} p-2 overflow-hidden transition-all ${
                  activeImage === img ? 'ring-2 ring-blue-400' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <img src={img} alt={`${product.title} ${i}`} className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
              <span className={`text-xs opacity-50 ${activeTheme.text}`}>SKU: {product.sku}</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${activeTheme.text}`}>{product.title}</h1>
            <p className={`text-3xl font-bold bg-gradient-to-r ${activeTheme.accent} bg-clip-text text-transparent mb-8`}>
              {product.currency} {product.price}
            </p>
            
            <div 
              className={`prose prose-lg mb-10 ${activeTheme.text} opacity-80`}
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />

            <GlassCard themeClass={activeTheme.glass} className="mb-10 p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-4 bg-black/10 rounded-xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ${activeTheme.text}`}
                  >
                    -
                  </button>
                  <span className={`text-lg font-bold w-6 text-center ${activeTheme.text}`}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ${activeTheme.text}`}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/contact', { state: { product: product.title, qty: quantity } })}
                  className={`flex-1 px-8 py-4 rounded-xl bg-gradient-to-r ${activeTheme.accent} text-white font-bold text-center shadow-lg hover:scale-105 transition-transform`}
                >
                  Order / Enquire Now
                </button>
              </div>
            </GlassCard>

            <div className="flex items-center space-x-4">
               <button 
                onClick={handleCopyDetails}
                className={`flex items-center space-x-2 text-sm ${activeTheme.text} opacity-60 hover:opacity-100 transition-opacity`}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                 </svg>
                 <span>{copied ? 'Details Copied!' : 'Copy Product Details'}</span>
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
