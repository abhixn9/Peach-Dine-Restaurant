import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate angles (max tilt degrees: 10)
    const degX = -(mouseY / (height / 2)) * 10;
    const degY = (mouseX / (width / 2)) * 10;

    setRotateX(degX);
    setRotateY(degY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const scrollToSection = (id: string) => {
    onNavigate(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-950 pt-16"
      style={{ perspective: 1500 }}
    >
      {/* Background Cinematic Image with soft vignette overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1600"
          alt="Peach &amp; Dine Dining Room"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.3] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/70" />
      </div>

      {/* Decorative accent lines */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-stone-800/20 hidden lg:block" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-stone-800/20 hidden lg:block" />

      {/* Interactive 3D Hero Content */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-20 cursor-grab active:cursor-grabbing select-none"
      >
        {/* Display Italic Bold Sans-Serif Typography with 3D translation */}
        <h1
          id="hero-title"
          style={{ transform: 'translateZ(60px)' }}
          className="font-sans font-black italic uppercase text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] tracking-tight leading-none mb-8 drop-shadow-2xl block text-center max-w-4xl mx-auto pb-4"
        >
          <span style={{ color: '#F5803B' }}>Peach</span>
          <span className="bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent px-2 inline-block">&amp;</span>
          <span style={{ color: '#F6A6C5' }}>Dine</span>
        </h1>

        <p
          id="hero-subtitle"
          style={{ transform: 'translateZ(40px)' }}
          className="max-w-2xl mx-auto text-stone-300 font-sans text-lg sm:text-xl leading-relaxed mb-10 text-pretty"
        >
          Honest culinary craft, locally sourced ingredients, and preserved moments. Experience gourmet, farm-to-table dining inspired by nature’s micro-seasons.
        </p>

        {/* CTA Actions with 3D translation */}
        <div
          id="hero-actions"
          style={{ transform: 'translateZ(50px)' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            id="hero-cta-reserve"
            onClick={() => scrollToSection('reservation')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] hover:opacity-90 text-stone-950 font-sans font-bold text-base rounded-xl transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Reserve Your Table</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
          
          <button
            id="hero-cta-menu"
            onClick={() => scrollToSection('menu')}
            className="w-full sm:w-auto px-8 py-4 bg-stone-900/80 hover:bg-gradient-to-r hover:from-[#F5803B] hover:to-[#F6A6C5] border border-stone-800 hover:border-transparent text-stone-100 hover:text-stone-950 font-sans font-semibold text-base rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
          >
            Explore Our Menu
          </button>
        </div>

        {/* Value Props / Highlights with 3D translation */}
        <div
          id="hero-value-props"
          style={{ transform: 'translateZ(20px)' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-stone-800/60 pt-8"
        >
          <div className="flex items-start space-x-3 text-left p-2">
            <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-white text-sm">Farm-to-Table Focus</h3>
              <p className="text-xs text-stone-400 leading-normal mt-0.5">Ingredients harvested daily from local eco-farms.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-left p-2">
            <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800 text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-white text-sm">Sustainably Crafted</h3>
              <p className="text-xs text-stone-400 leading-normal mt-0.5">100% traceably sourced seafood and organic proteins.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-left p-2">
            <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800 text-white shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-white text-sm">Memorable Moments</h3>
              <p className="text-xs text-stone-400 leading-normal mt-0.5">Atmosphere custom-lit for date nights and celebrations.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Elegant visual shadow indicator at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none" />
    </header>
  );
}
