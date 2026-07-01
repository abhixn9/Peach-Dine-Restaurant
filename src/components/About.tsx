import { useState } from 'react';
import { Award, Leaf, Users, ChevronRight, Play } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'story' | 'chef'>('philosophy');

  const milestones = [
    { year: '2021', title: 'The Backyard Pop-up', text: 'Chef Julian and Amara launched intimate garden pop-ups, sourcing everything from friendly local backyards.' },
    { year: '2023', title: 'A Culinary Home', text: 'Opened our flagship brick-and-mortar spot in the historic arts district, keeping our rustic roots intact.' },
    { year: '2025', title: 'Green Star Recipient', text: 'Recognized for our 100% sustainable food systems and zero-plastic supply chain efforts.' }
  ];

  return (
    <section id="about" className="py-24 bg-stone-900 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Side / Photos */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-12 gap-4 relative z-10">
              {/* Main Peach Dish Image */}
              <div className="col-span-12 sm:col-span-8 h-[260px] sm:h-[320px] rounded-2xl overflow-hidden shadow-xl border border-stone-850 relative group">
                <img
                  src="https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=82&w=1200"
                  alt="Artisanal Peach Dish"
                  className="absolute inset-0 w-full h-full object-cover filter contrast-[1.03] group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
              </div>
              
              {/* Overlapping Fine Dining Restaurant Table Image */}
              <div className="col-span-12 sm:col-span-4 h-[200px] sm:h-[180px] rounded-2xl overflow-hidden shadow-lg border border-stone-850 relative group sm:mt-8">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=82&w=1200"
                  alt="Fine Dining Atmosphere"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlapping Interior Atmosphere Image */}
              <div className="col-span-12 sm:col-span-5 h-[200px] sm:h-[160px] rounded-2xl overflow-hidden shadow-lg border border-stone-850 relative group sm:-mt-16 z-20">
                <img
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=82&w=1200"
                  alt="Cozy Dining Atmosphere"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Decorative Quote Card */}
              <div className="col-span-12 sm:col-span-7 p-4 bg-stone-900/95 backdrop-blur-md rounded-xl border border-stone-800 shadow-lg sm:-mt-10 z-20 self-end">
                <p className="text-[11px] italic text-stone-300 font-sans leading-relaxed">
                  "Peach &amp; Dine captures the peak flavors of sun-ripened fruit and premium sustainable harvest. Every plate is a love letter to Bangalore's season."
                </p>
                <p className="text-[9px] font-mono text-amber-500 uppercase tracking-wider mt-1.5">
                  — Chef Julian Thorne
                </p>
              </div>
            </div>
            
            {/* Visual background accents */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl" />
          </div>

          {/* Copy Side / Tabs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 block">
                OUR IDENTITY
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent inline-block pb-1">
                Honoring the rhythm of the soil and sea.
              </h2>
            </div>

            {/* Interactive Tabs */}
            <div className="flex border-b border-stone-800">
              <button
                onClick={() => setActiveTab('philosophy')}
                className={`py-3 px-4 text-sm font-sans font-medium transition-all relative border-b-2 ${
                  activeTab === 'philosophy'
                    ? 'text-amber-500 border-amber-500'
                    : 'text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                Our Philosophy
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`py-3 px-4 text-sm font-sans font-medium transition-all relative border-b-2 ${
                  activeTab === 'story'
                    ? 'text-amber-500 border-amber-500'
                    : 'text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                Our Story
              </button>
              <button
                onClick={() => setActiveTab('chef')}
                className={`py-3 px-4 text-sm font-sans font-medium transition-all relative border-b-2 ${
                  activeTab === 'chef'
                    ? 'text-amber-500 border-amber-500'
                    : 'text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                The Tastemakers
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[220px] py-2 transition-opacity duration-300">
              {activeTab === 'philosophy' && (
                <div className="space-y-6">
                  <p className="text-stone-300 font-sans leading-relaxed text-pretty">
                    At Peach &amp; Dine, we serve micro-seasonal gourmet food. Rather than keeping a static year-round catalog, our menu shifts as micro-seasons change. We build around what’s absolute peak-fresh this week.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-3 p-3 bg-stone-950/40 rounded-xl border border-stone-850">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-stone-200 font-sans font-medium">100% Organic Eco-Farms</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-stone-950/40 rounded-xl border border-stone-850">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-stone-200 font-sans font-medium">Traceable Sourcing Only</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'story' && (
                <div className="space-y-6">
                  <p className="text-stone-300 font-sans leading-relaxed mb-4">
                    Peach &amp; Dine was born out of a shared dream to simplify fine dining. We stripped away the pretension and elevated the raw connection between local eco-farms and gourmet plates.
                  </p>
                  
                  {/* Journey Timeline */}
                  <div className="space-y-4 pt-2">
                    {milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start space-x-4">
                        <div className="font-mono text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/25 shrink-0 mt-0.5">
                          {milestone.year}
                        </div>
                        <div>
                          <h4 className="font-sans font-bold text-stone-100 text-sm leading-tight">{milestone.title}</h4>
                          <p className="text-xs text-stone-400 mt-0.5">{milestone.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'chef' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-stone-950/40 rounded-xl border border-stone-850">
                    <div className="shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=300"
                        alt="Chef Julian Thorne"
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-white text-base">Julian Thorne <span className="text-xs font-mono font-normal text-amber-500 uppercase tracking-widest ml-1">Head Chef</span></h4>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        Classically trained in Lyon and Paris, Julian returned with a mission to fuse classical refinement with rustic ingredients of local eco-regions.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-stone-950/40 rounded-xl border border-stone-850">
                    <div className="shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300"
                        alt="Amara Vance"
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-white text-base">Amara Vance <span className="text-xs font-mono font-normal text-amber-500 uppercase tracking-widest ml-1">General Manager &amp; Sommelier</span></h4>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        Curator of our award-winning bio-dynamic cellar. Amara ensures that every dish on our menu meets its immaculate vineyard companion.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
