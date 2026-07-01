import { useState, FormEvent } from 'react';
import { Send, Sparkle, Globe, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LogoIcon from './LogoIcon';

export default function Footer() {
  const { isAdminMode, setIsAdminMode } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState<{ title: string; content: string } | null>(null);

  const showExplanation = (type: 'privacy' | 'sourcing' | 'host') => {
    if (type === 'privacy') {
      setActiveExplanation({
        title: 'Privacy Policy & Data Security',
        content: 'At Peach & Dine, we hold your personal trust as our highest culinary ingredient. We strictly encrypt guest details, reservation records, and custom preorder selections. We do not sell, lease, or share your dining schedules with third-party networks. Your local cache remains entirely private and secure.',
      });
    } else if (type === 'sourcing') {
      setActiveExplanation({
        title: 'Micro-Seasonal Sourcing Terms',
        content: 'Our ingredients are 100% organic and gathered daily from regional farming cooperatives. Our financial model guarantees pre-arranged fair wages to agricultural partners, shielding them from commodity market fluctuations. Preordering meals minimizes wastage loss, directly contributing to regional ecosystem longevity.',
      });
    } else if (type === 'host') {
      setActiveExplanation({
        title: 'Host Policy & Fine Dining Guidelines',
        content: 'To curate an intimate, zero-waste dining experience, we prepare hand-made menus tailored directly to confirmed reservation party sizes. Cancellations or modifications must be made at least 24 hours prior to your seating. Delicacy preorders are finalized 12 hours in advance to allow for custom harvesting.',
      });
    }
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    // Persist newsletter signup locally
    const existing = localStorage.getItem('nectar_thyme_newsletter');
    const list = existing ? JSON.parse(existing) : [];
    list.push({ email: newsletterEmail, date: new Date().toISOString() });
    localStorage.setItem('nectar_thyme_newsletter', JSON.stringify(list));

    setNewsletterEmail('');
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-900 pt-20 pb-8 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Core footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <LogoIcon size={48} className="w-12 h-12" />
              <div>
                <span 
                  className="block font-sans italic font-black uppercase leading-none pb-0.5 tracking-wider text-lg"
                >
                  <span style={{ color: '#F5803B' }}>Peach</span>
                  <span className="bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent px-1 inline-block">&amp;</span>
                  <span style={{ color: '#F6A6C5' }}>Dine</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-amber-500 mt-1 block">
                  Artisanal Kitchen
                </span>
              </div>
            </div>
            
            <p className="leading-relaxed font-sans text-stone-400">
              An offline-first kitchen celebrating the connection between organic local soils, sustainable farming practices, and memorable dining moments.
            </p>

            <div className="flex items-center space-x-4 pt-1 text-[11px] font-mono">
              <div className="flex items-center space-x-1 text-emerald-500">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Green Star culinary system</span>
              </div>
            </div>
          </div>

          {/* Quick links & anchors */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-sans font-bold text-white text-sm">Our Sourcing Partners</h4>
            <ul className="space-y-2.5 font-sans">
              <li className="hover:text-amber-500 transition-colors">Cascadia Eco-Cooperative</li>
              <li className="hover:text-amber-500 transition-colors">Oak Ridge Organic Orchard</li>
              <li className="hover:text-amber-500 transition-colors">Riverside Fish Conservancy</li>
              <li className="hover:text-amber-500 transition-colors">Willamette Mycological Guild</li>
            </ul>
          </div>

          {/* Slogan details / certifications */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-sans font-bold text-white text-sm">Recognitions</h4>
            <ul className="space-y-2.5 font-sans text-stone-400">
              <li>Oregon Organic Alliance</li>
              <li>Zero-Plastic Certified</li>
              <li>Fair-Wage Dining System</li>
              <li>Sustainable Seafood Alliance</li>
            </ul>
          </div>

          {/* Newsletter Sign up */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-sans font-bold text-white text-sm">The Seasonal Bulletin</h4>
            <p className="leading-relaxed font-sans text-stone-400">
              Receive recipes, announcements on weekly menu changes, and first access to private buyout dates.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-sans font-medium text-[11px]">
                🌿 Welcome! You have subscribed successfully.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-850 rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-amber-500/50 text-stone-200 text-xs font-sans"
                />
                <button
                  type="submit"
                  id="btn-subscribe-newsletter"
                  className="absolute right-1 top-1 p-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer credits row */}
        <div className="border-t border-stone-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <div className="flex items-center space-x-1.5 font-sans">
            <span>© {new Date().getFullYear()} Peach &amp; Dine. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-wider text-stone-500">
            <button
              onClick={() => showExplanation('privacy')}
              className="hover:text-stone-300 transition-colors bg-transparent border-0 p-0 text-[10px] tracking-wider font-mono cursor-pointer uppercase"
            >
              Privacy
            </button>
            <button
              onClick={() => showExplanation('sourcing')}
              className="hover:text-stone-300 transition-colors bg-transparent border-0 p-0 text-[10px] tracking-wider font-mono cursor-pointer uppercase"
            >
              Sourcing Terms
            </button>
            <button
              onClick={() => showExplanation('host')}
              className="hover:text-stone-300 transition-colors bg-transparent border-0 p-0 text-[10px] tracking-wider font-mono cursor-pointer uppercase"
            >
              Host Policy
            </button>
          </div>
        </div>

        {/* Dynamic policy/explanation modal overlay */}
        {activeExplanation && (
          <div 
            onClick={() => setActiveExplanation(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center space-x-2.5 border-b border-stone-800 pb-3 text-amber-500">
                <Info className="w-4 h-4" />
                <h3 className="font-sans font-black text-sm text-stone-100 uppercase tracking-wider">{activeExplanation.title}</h3>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">{activeExplanation.content}</p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveExplanation(null)}
                  className="bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-300 font-sans font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </footer>
  );
}
