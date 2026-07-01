import { useState, useEffect, useRef, FormEvent, MouseEvent } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, UserPlus, LogIn, UtensilsCrossed, Sparkle, Lock, Phone, Mail, Compass } from 'lucide-react';

export default function AuthPortal() {
  const { registerUser, loginUser, currentUser, isAdminMode, setIsAdminMode } = useApp();
  
  const [mode, setMode] = useState<'register' | 'login' | 'entering'>('register');
  
  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDiet, setRegDiet] = useState('None');
  const [regError, setRegError] = useState('');

  // Login state
  const [loginTerm, setLoginTerm] = useState('');
  const [loginError, setLoginError] = useState('');

  // Cinematic 3D entry state
  const [progress, setProgress] = useState(0);
  const [loadingPhrase, setLoadingPhrase] = useState('Initiating gastronomic gateway...');
  const [isFullyEntered, setIsFullyEntered] = useState(false);

  // Separate Admin passcode popup state
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [passcodeVal, setPasscodeVal] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Parallax rotation refs
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Continuous background ticks for automatic orbital 3D movement when entering
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (mode !== 'entering') return;
    let animFrameId: number;
    const runTick = () => {
      setTicks((t) => t + 1);
      animFrameId = requestAnimationFrame(runTick);
    };
    animFrameId = requestAnimationFrame(runTick);
    return () => cancelAnimationFrame(animFrameId);
  }, [mode]);

  // Handle mouse move for interactive 3D rotation of the logo
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize and scale (max 30 degrees rotation)
    const rX = -(y / (rect.height / 2)) * 30;
    const rY = (x / (rect.width / 2)) * 30;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Register form handler
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setRegError('All fields are required to establish your seasonal dining profile.');
      return;
    }

    const res = registerUser(regName, regEmail, regPhone, regDiet);
    if (res.success) {
      setMode('entering');
    } else {
      setRegError(res.error || 'An error occurred during registration.');
    }
  };

  // Login form handler
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginTerm.trim()) {
      setLoginError('Please enter your email or phone number to access your account.');
      return;
    }

    const res = loginUser(loginTerm);
    if (res.success) {
      setMode('entering');
    } else {
      setLoginError(res.error || 'Account not found. Please verify details or sign up.');
    }
  };

  // Cinematic progress loader
  useEffect(() => {
    if (mode !== 'entering') return;

    setProgress(0);
    setIsFullyEntered(false);

    const phrases = [
      'Gleaning daily organic harvest log...',
      'Synchronizing regional cooperative supply...',
      'Curating personal dietary micro-menu...',
      'Calibrating thermal woodfire ovens...',
      'Warmly welcome to Peach & Dine'
    ];

    const phraseInterval = setInterval(() => {
      setLoadingPhrase((prev) => {
        const index = phrases.indexOf(prev);
        if (index < phrases.length - 1) {
          return phrases[index + 1];
        }
        return prev;
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(phraseInterval);
          // Wait 900ms on full bar for a pristine fade out experience
          setTimeout(() => {
            setIsFullyEntered(true);
          }, 900);
          return 100;
        }
        return prev + 1.2;
      });
    }, 40);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
    };
  }, [mode]);

  // Reset entry state when logged out so the portal shows again
  useEffect(() => {
    if (!currentUser && !isAdminMode) {
      setIsFullyEntered(false);
      setMode('login');
      setProgress(0);
    }
  }, [currentUser, isAdminMode]);

  // If already logged in or in admin mode, and not in the "entering" phase, bypass gateway
  if ((currentUser || isAdminMode) && mode !== 'entering' && !isFullyEntered) {
    return null;
  }

  if (isFullyEntered) {
    return null;
  }

  // Render a majestic flat combined logo animation during entering phase
  if (mode === 'entering') {
    // Elegant, custom progress-driven combining animation
    let forkX = -120;
    let knifeX = 120;
    let forkRot = -55;
    let knifeRot = 55;
    let utensilOpacity = 0;
    let utensilScale = 0.7;
    
    let textOpacity = 0;
    let textY = 20;
    let backdropGlowScale = 0.5;
    let backdropGlowOpacity = 0.2;
    
    let overallScale = 1.0;
    let gatewayOpacity = 1;

    if (progress <= 45) {
      const pct = progress / 45;
      forkX = -120 + pct * 105;
      knifeX = 120 - pct * 105;
      forkRot = -55 + pct * 25;
      knifeRot = 55 - pct * 25;
      utensilOpacity = pct;
      utensilScale = 0.7 + pct * 0.3;
    } else if (progress <= 85) {
      const pct = (progress - 45) / 40;
      forkX = -15 - pct * 3;
      knifeX = 15 + pct * 3;
      forkRot = -30 - pct * 15;
      knifeRot = 30 + pct * 15;
      utensilOpacity = 1;
      utensilScale = 1.0;
      
      textOpacity = pct;
      textY = 20 - pct * 20;
      backdropGlowScale = 0.5 + pct * 0.5;
      backdropGlowOpacity = 0.2 + pct * 0.6;
    } else {
      const pct = (progress - 85) / 15;
      forkX = -18;
      knifeX = 18;
      forkRot = -45;
      knifeRot = 45;
      utensilOpacity = 1;
      utensilScale = 1.0;
      
      textOpacity = 1;
      textY = 0;
      backdropGlowScale = 1.0;
      backdropGlowOpacity = 0.8;
      
      overallScale = 1.0 + pct * 0.08;
      gatewayOpacity = Math.max(0, 1 - pct);
    }

    return (
      <div 
        className="fixed inset-0 z-[200] bg-stone-950 flex flex-col items-center justify-center p-6 overflow-hidden select-none font-sans transition-opacity duration-300"
        style={{ opacity: gatewayOpacity }}
      >
        {/* Soft, deep back glow */}
        <div 
          className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-[#F5803B]/20 to-[#F6A6C5]/20 rounded-full blur-[140px] pointer-events-none transition-transform duration-300"
          style={{ 
            transform: `scale(${backdropGlowScale})`,
            opacity: backdropGlowOpacity 
          }}
        />

        {/* Master animation container */}
        <div 
          className="relative flex flex-col items-center justify-center max-w-lg w-full text-center transition-transform duration-75 ease-out"
          style={{ transform: `scale(${overallScale})` }}
        >
          {/* Symmetrical crossed logo crest */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Ambient circular rim backplate that lights up upon combining */}
            <div 
              className="absolute inset-4 rounded-full border border-stone-850/50 bg-stone-900/40 backdrop-blur-md transition-all duration-500 flex items-center justify-center"
              style={{ 
                opacity: textOpacity,
                transform: `scale(${backdropGlowScale})` 
              }}
            >
              <div className="w-[92%] h-[92%] rounded-full border border-dashed border-stone-800/60 animate-spin-slow" />
            </div>

            {/* Left element: Fork */}
            <div 
              className="absolute transition-all duration-75 ease-out"
              style={{
                transform: `translateX(${forkX}px) rotate(${forkRot}deg) scale(${utensilScale})`,
                opacity: utensilOpacity
              }}
            >
              <svg 
                className="w-16 h-16 sm:w-20 sm:h-20 text-[#F5803B]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 8c0 2.2-1.8 4-4 4v7a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-7c-2.2 0-4-1.8-4-4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4h1V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4h1V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z" />
              </svg>
            </div>

            {/* Right element: Knife */}
            <div 
              className="absolute transition-all duration-75 ease-out"
              style={{
                transform: `translateX(${knifeX}px) rotate(${knifeRot}deg) scale(${utensilScale})`,
                opacity: utensilOpacity
              }}
            >
              <svg 
                className="w-16 h-16 sm:w-20 sm:h-20 text-[#F6A6C5]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M10 20V13H9V3.5A1.5 1.5 0 0 1 10.5 2C12.5 2, 15 5, 15 11h-2v9a1.5 1.5 0 0 1-3 0z" />
              </svg>
            </div>
          </div>

          {/* Restaurant Name Plate */}
          <div 
            className="mt-6 sm:mt-8 space-y-2 transition-all duration-300 ease-out"
            style={{
              opacity: textOpacity,
              transform: `translateY(${textY}px)`
            }}
          >
            <h2 className="font-sans italic font-black uppercase tracking-wider text-3xl sm:text-4xl md:text-5xl">
              <span style={{ color: '#F5803B' }}>Peach</span>
              <span className="bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent px-1 inline-block">&amp;</span>
              <span style={{ color: '#F6A6C5' }}>Dine</span>
            </h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-amber-500/90 font-mono">
              Artisanal Kitchen
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950 flex items-center justify-center p-4 overflow-y-auto selection:bg-amber-500 selection:text-stone-950 font-sans">
      
      {/* Upper Right Corner - Separate switcher button */}
      <div className="absolute top-4 right-4 z-[110] flex items-center bg-stone-900/90 border border-stone-800 p-1 rounded-full shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setIsAdminMode(false);
            setShowPasscodePrompt(false);
          }}
          className={`px-3 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer border-0 ${
            !isAdminMode
              ? 'bg-amber-500 text-stone-950 font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          User View
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAdminMode) {
              setShowPasscodePrompt(true);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer border-0 ${
            isAdminMode
              ? 'bg-amber-500 text-stone-950 font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Admin
        </button>
      </div>

      {/* Security Passcode Unlock Prompt */}
      {showPasscodePrompt && (
        <div className="fixed inset-0 z-[120] bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-stone-900 border border-stone-850 rounded-3xl w-full max-w-xs p-6 space-y-4 shadow-2xl relative">
            <div className="text-center">
              <span className="text-2xl">🔒</span>
              <h4 className="font-sans font-bold text-stone-100 text-sm mt-2 uppercase tracking-wider">Unlock Admin Mode</h4>
              <p className="text-[10px] text-stone-400 mt-1">Enter security passcode to authorize</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passcodeVal === '9999') {
                setIsAdminMode(true);
                setShowPasscodePrompt(false);
                setPasscodeVal('');
                setPasscodeError('');
              } else {
                setPasscodeError('Invalid Passcode. Access denied.');
              }
            }} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                required
                autoFocus
                value={passcodeVal}
                onChange={(e) => setPasscodeVal(e.target.value)}
                placeholder="••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl text-center py-2.5 text-lg font-mono text-amber-500 tracking-widest focus:outline-none focus:border-amber-500"
              />
              {passcodeError && (
                <p className="text-[10px] text-rose-500 text-center font-mono leading-tight">{passcodeError}</p>
              )}
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasscodePrompt(false);
                    setPasscodeVal('');
                    setPasscodeError('');
                  }}
                  className="flex-1 bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-400 text-[10px] uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-xl cursor-pointer border-0"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decorative ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg relative z-10 py-8">
        
        {/* Brand visual header */}
        <div className="text-center mb-8 space-y-2.5 animate-fadeIn">
          <div className="inline-flex items-center justify-center space-x-2 text-amber-500/80 bg-amber-500/5 border border-amber-500/10 px-3.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#F5803B]" />
            <span>Micro-Seasonal Gastronomy</span>
          </div>
          <h1 className="font-sans font-black text-3xl tracking-tight text-white uppercase sm:text-4xl">
            Peach <span className="text-stone-500 font-light font-sans lowercase italic">&amp;</span> Dine
          </h1>
          <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
            Verify your seasonal dining pass credentials or register below to gain access to our custom organic ledgers.
          </p>
        </div>

        {/* Auth Forms */}
        <div className="bg-stone-900 border border-stone-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-slideUp">
          
          {/* Top tab selector */}
          <div className="grid grid-cols-2 bg-stone-950 p-1 rounded-xl border border-stone-850/50 mb-6">
            <button
              onClick={() => {
                setMode('register');
                setRegError('');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer border-0 ${
                mode === 'register' 
                  ? 'bg-stone-900 text-amber-500 shadow-md border border-stone-800' 
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer border-0 ${
                mode === 'login' 
                  ? 'bg-stone-900 text-amber-500 shadow-md border border-stone-800' 
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start space-x-2 animate-fadeIn">
                  <span className="font-bold leading-none mt-0.5 font-mono">⚠️</span>
                  <p className="leading-normal">{regError}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-stone-400 tracking-wider block">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Advik Sharma"
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                  <span className="absolute left-3 top-3.5 text-stone-500 font-mono text-xs">👤</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-stone-400 tracking-wider block">Email Address (Unique ID)</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. advik@gmail.com"
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                  <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-500" />
                </div>
                <span className="text-[9px] text-stone-500 block italic pl-1">
                  Used to verify table reservation tickets and loyalty logs.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-stone-400 tracking-wider block">Phone Number (Unique)</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. +91 99887 76655"
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                  <Phone className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-500" />
                </div>
                <span className="text-[9px] text-stone-500 block italic pl-1">
                  Format: +91 99999 99999 or equivalent digits.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-stone-400 tracking-wider block">Dietary &amp; Organic Preferences</label>
                <select
                  value={regDiet}
                  onChange={(e) => setRegDiet(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  <option value="None">No Dietary Restrictions</option>
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Vegan">Vegan (Plant-Based)</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Nut-Free">Nut-Free Selection</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] hover:opacity-95 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer border-0"
                >
                  <span>Register &amp; Launch 3D Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start space-x-2 animate-fadeIn">
                  <span className="font-bold leading-none mt-0.5 font-mono">⚠️</span>
                  <p className="leading-normal">{loginError}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase text-stone-400 tracking-wider block">Account Email or Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginTerm}
                    onChange={(e) => setLoginTerm(e.target.value)}
                    placeholder="Enter registered email or phone"
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl pl-9 pr-3 py-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                  <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-500" />
                </div>
                <p className="text-[9px] text-stone-500 leading-normal italic pl-1">
                  Tip: Enter <span className="font-mono text-stone-400">aarav.malhotra@gmail.com</span> or <span className="font-mono text-stone-400">+91 98765 43210</span> to log in as a seeded guest!
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] hover:opacity-95 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer border-0"
                >
                  <span>Access Secure Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Disclaimer */}
          <div className="mt-6 border-t border-stone-850/60 pt-4 text-[9px] text-stone-500 text-center leading-normal max-w-xs mx-auto">
            Each credentials profile is isolated in encrypted local sandbox storage. Your details will not be transmitted.
          </div>

        </div>

      </div>
    </div>
  );
}
