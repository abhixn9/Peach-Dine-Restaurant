import { useState } from 'react';
import { MapPin, Clock, Navigation, Bus, Compass, Sparkle } from 'lucide-react';

export default function LocationHours() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [showMapChoice, setShowMapChoice] = useState(false);

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Peach+%26+Dine+42+Lavelle+Road+Bengaluru';
  const appleMapsUrl = 'https://maps.apple.com/?q=Peach+%26+Dine+42+Lavelle+Road+Bengaluru';

  const landmarks = [
    { name: 'Peach & Dine', x: 130, y: 80, color: 'text-amber-500', desc: 'Our cozy bistro kitchen' },
    { name: 'MG Road Metro Station', x: 260, y: 150, color: 'text-sky-400', desc: '5-minute walk from the station exit' },
    { name: 'Cubbon Park', x: 50, y: 140, color: 'text-emerald-500', desc: 'Scenic park with ample public parking slots' },
    { name: 'The UB City Gallery', x: 190, y: 35, color: 'text-fuchsia-400', desc: 'Local artisan displays and luxury shopping' }
  ];

  return (
    <section id="location" className="py-24 bg-stone-900 border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Information & Hours Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 block">
                FIND US
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent inline-block pb-1">
                In the Heart of the Arts District
              </h2>
            </div>

            {/* Address Info */}
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-amber-500 shrink-0 mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-white text-sm">Physical Address</h3>
                <p className="text-stone-300 text-xs leading-relaxed">
                  42, Lavelle Road, Near UB City<br />
                  Bengaluru, Karnataka 560001
                </p>
                <div className="pt-1">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Get Directions via Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-amber-500 shrink-0 mt-1">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2 w-full">
                <h3 className="font-sans font-bold text-white text-sm">Hours of Operation</h3>
                
                <div className="divide-y divide-stone-850/80 text-xs text-stone-300">
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-stone-400">Wednesday &amp; Thursday</span>
                    <span className="font-mono text-stone-200">5:00 PM – 10:00 PM</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-stone-400">Friday &amp; Saturday</span>
                    <span className="font-mono text-stone-200">5:00 PM – 11:00 PM</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-stone-400">Sunday Organic Brunch</span>
                    <span className="font-mono text-stone-200">11:00 AM – 3:00 PM</span>
                  </div>
                  <div className="py-2 flex justify-between text-stone-500">
                    <span className="font-medium">Monday &amp; Tuesday</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-stone-950 px-1.5 py-0.5 rounded border border-stone-850">Closed for rest</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking / Transit */}
            <div className="p-4 bg-stone-950/60 border border-stone-850 rounded-xl space-y-2.5">
              <div className="flex items-center space-x-2 text-stone-200">
                <Bus className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-sans font-bold">Transit &amp; Parking Tips</span>
              </div>
              <p className="text-xs text-stone-400 leading-normal">
                Validated free valet parking is available on-site at Lavelle Road. We are also easily accessible from the MG Road metro station.
              </p>
            </div>

          </div>

          {/* Interactive Neighborhood Vector Map Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 p-2 shadow-2xl">
              
              {/* Map Canvas - Custom SVG drawing of arts district */}
              <div 
                onClick={() => setShowMapChoice(true)}
                title="Click to open in Google/Apple Maps"
                className="aspect-[4/3] bg-stone-950 relative overflow-hidden rounded-xl border border-stone-900 cursor-pointer group/mapcanvas"
              >
                <svg className="w-full h-full text-stone-800" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Street grids */}
                  <rect x="0" y="0" width="320" height="200" fill="#0C0A09" />
                  
                  {/* Parks */}
                  <rect x="10" y="110" width="100" height="70" rx="10" fill="#064E3B" fillOpacity="0.25" stroke="#059669" strokeWidth="0.5" strokeDasharray="2 2" />
                  
                  {/* River or bay accent */}
                  <path d="M 0 190 Q 120 180 200 200 L 320 200 L 320 190 L 0 190 Z" fill="#0369A1" fillOpacity="0.15" />

                  {/* Willow Street */}
                  <line x1="120" y1="0" x2="120" y2="200" stroke="#1C1917" strokeWidth="20" />
                  <line x1="120" y1="0" x2="120" y2="200" stroke="#44403C" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* Pine Street */}
                  <line x1="0" y1="90" x2="320" y2="90" stroke="#1C1917" strokeWidth="16" />
                  <line x1="0" y1="90" x2="320" y2="90" stroke="#44403C" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Oak Lane */}
                  <line x1="0" y1="30" x2="320" y2="30" stroke="#1C1917" strokeWidth="12" />

                  {/* Transit Track */}
                  <path d="M 270 0 L 270 200" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Custom Markers / Interactive nodes */}
                  {landmarks.map((mark, i) => (
                    <g
                      key={i}
                      id={`map-node-${i}`}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setHoveredLocation(mark.name);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setHoveredLocation(null);
                      }}
                      className="cursor-pointer group"
                    >
                      <circle cx={mark.x} cy={mark.y} r="14" fill="#1C1917" fillOpacity="0.8" stroke="#44403C" strokeWidth="1" />
                      <circle
                        cx={mark.x}
                        cy={mark.y}
                        r={mark.name === 'Peach & Dine' ? "5" : "3"}
                        fill={mark.name === 'Peach & Dine' ? "#F59E0B" : "#A8A29E"}
                        className={mark.name === 'Peach & Dine' ? "animate-pulse" : ""}
                      />
                      {mark.name === 'Peach & Dine' && (
                        <path
                          d={`M ${mark.x} ${mark.y - 12} L ${mark.x - 4} ${mark.y - 4} L ${mark.x + 4} ${mark.y - 4} Z`}
                          fill="#F59E0B"
                        />
                      )}
                    </g>
                  ))}
                </svg>

                {/* Live Floating Tooltip */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-stone-900/95 backdrop-blur-md border border-stone-850 rounded-xl shadow-lg flex items-center justify-between group-hover/mapcanvas:border-amber-500/30 transition-all z-10">
                  <div className="max-w-[85%]">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-amber-500 block">MAPS & DIRECTIONS</span>
                    <h4 className="font-sans font-bold text-white text-xs mt-0.5">
                      {hoveredLocation ? hoveredLocation : '📍 Click Map to Navigate'}
                    </h4>
                    <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      {hoveredLocation
                        ? landmarks.find((m) => m.name === hoveredLocation)?.desc
                        : 'Click anywhere on this map to launch directions in Google Maps or Apple Maps.'}
                    </p>
                  </div>
                  <Compass className="w-4 h-4 text-amber-500 group-hover/mapcanvas:rotate-45 transition-transform shrink-0" />
                </div>

                {/* Navigation popup selection overlay */}
                {showMapChoice && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="absolute inset-0 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn z-20"
                  >
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-2xl text-amber-500">
                      <Compass className="w-7 h-7 animate-pulse text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-stone-100 text-sm">Find Directions</h4>
                      <p className="text-[10px] text-stone-400 mt-1 max-w-xs mx-auto leading-normal">
                        Select your navigation preference to open directions to Peach &amp; Dine (Lavelle Road, Bengaluru)
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[280px]">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 shadow-lg"
                      >
                        <span>Google Maps</span>
                      </a>
                      <a
                        href={appleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-sans font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 shadow-lg"
                      >
                        <span>Apple Maps</span>
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMapChoice(false);
                      }}
                      className="text-[9px] font-mono uppercase text-stone-500 hover:text-stone-300 transition-colors pt-1 cursor-pointer bg-transparent border-0"
                    >
                      Dismiss Navigation
                    </button>
                  </div>
                )}

              </div>
            </div>
            
            <p className="text-center text-[10px] font-mono text-stone-500">
              Interactive neighborhood map. Click the canvas area to explore custom pathways on Apple or Google Maps.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
