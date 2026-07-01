import { useState, useEffect, FormEvent } from 'react';
import { Calendar, User, Mail, Phone, Sparkles, CheckCircle, Info, Trash2, ArrowRight, Plus, Minus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reservation, OrderItem } from '../types';

export default function ReservationSection() {
  const { reservations, addReservation, deleteReservation, menuItems, currentUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Auto-fill user details when authenticated
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [currentUser]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('6:30 PM');
  const [partySize, setPartySize] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<'standard' | 'window' | 'outdoor' | 'counter'>('standard');
  const [specialRequests, setSpecialRequests] = useState('');

  // Pre-order food state
  const [preorderQuantities, setPreorderQuantities] = useState<{ [itemId: string]: number }>({});
  const [searchFoodQuery, setSearchFoodQuery] = useState('');
  const [showPreorderSection, setShowPreorderSection] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'Card' | 'UPI' | 'Cash'>('Card');
  
  const [justBooked, setJustBooked] = useState<Reservation | null>(null);
  const [formError, setFormError] = useState('');

  // Pre-load dates
  const today = new Date().toISOString().split('T')[0];

  // Table assignment helper based on seating choice
  const assignTableNumber = (pref: 'standard' | 'window' | 'outdoor' | 'counter') => {
    switch (pref) {
      case 'standard': return Math.floor(Math.random() * 10) + 1; // Tables 1-10
      case 'window': return Math.floor(Math.random() * 5) + 11; // Tables 11-15
      case 'outdoor': return Math.floor(Math.random() * 5) + 16; // Tables 16-20
      case 'counter': return Math.floor(Math.random() * 4) + 21; // Tables 21-24
      default: return Math.floor(Math.random() * 24) + 1;
    }
  };

  const updatePreorderQty = (itemId: string, delta: number, maxStorage: number) => {
    setPreorderQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      if (next > maxStorage) return prev; // Cannot exceed available storage stock
      return { ...prev, [itemId]: next };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!name.trim() || !email.trim() || !phone.trim() || !date) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Extract Day and Month safely to support "data saved with day and month"
    const dateParts = date.split('-'); // e.g., ["2026", "06", "30"]
    const year = parseInt(dateParts[0], 10);
    const monthIdx = parseInt(dateParts[1], 10) - 1;
    const dayNum = parseInt(dateParts[2], 10);
    
    const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthsList[monthIdx] || 'June';
    const dayStr = String(dayNum).padStart(2, '0');

    // Create list of preordered items
    const selectedPreorders: OrderItem[] = Object.entries(preorderQuantities)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([itemId, qty]) => {
        const item = menuItems.find((m) => m.id === itemId);
        return {
          itemId,
          name: item?.name || 'Dish',
          quantity: qty as number,
          price: item?.price || 0
        };
      });

    // Check if any ordered items exceed stock before submitting
    for (const oi of selectedPreorders) {
      const dbItem = menuItems.find((m) => m.id === oi.itemId);
      const stock = dbItem?.storage ?? 50;
      if (oi.quantity > stock) {
        setFormError(`Insufficient stock for "${oi.name}". Only ${stock} left.`);
        return;
      }
    }

    const assignedTable = assignTableNumber(seatingPreference);

    const newBooking: Reservation = {
      id: 'NT-' + Math.floor(100000 + Math.random() * 900000),
      name,
      email,
      phone,
      date,
      time,
      partySize,
      seatingPreference,
      specialRequests: specialRequests.trim(),
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
      tableNumber: assignedTable,
      orderItems: selectedPreorders.length > 0 ? selectedPreorders : undefined,
      paymentMode: selectedPreorders.length > 0 ? paymentMode : undefined,
      day: dayStr,
      month: monthName
    };

    addReservation(newBooking);
    setJustBooked(newBooking);

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
    setSpecialRequests('');
    setPreorderQuantities({});
    setPaymentMode('Card');
    setShowPreorderSection(false);
  };

  const cancelReservation = (id: string) => {
    deleteReservation(id);
    if (justBooked?.id === id) {
      setJustBooked(null);
    }
  };

  const timeSlots = [
    '11:30 AM', '12:30 PM', '1:30 PM',
    '5:30 PM', '6:30 PM', '7:30 PM', '8:30 PM', '9:30 PM'
  ];

  const preferenceLabels = {
    standard: 'Standard Table',
    window: 'Window View',
    outdoor: 'Outdoor Garden Patio',
    counter: "Chef's counter"
  };

  // Filter food list for preorders
  const filteredFoodItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchFoodQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchFoodQuery.toLowerCase())
  );

  const totalPreorderCost = Object.entries(preorderQuantities).reduce((acc, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return acc + (item?.price || 0) * (qty as number);
  }, 0);

  return (
    <section id="reservation" className="py-24 bg-stone-900 border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">
            SECURE A PASS
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent inline-block pb-1">
            Reserve Your Experience
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-2xl mx-auto text-pretty">
            We hold a portion of our tables for walk-ins, but strongly advise securing your pass online. Table holds are honored for up to 15 minutes past booking time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Reservation Form Column */}
          <div className="lg:col-span-7 bg-stone-950 p-6 sm:p-8 rounded-2xl border border-stone-850 shadow-2xl space-y-6">
            <h3 className="font-sans font-bold text-white text-xl border-b border-stone-900 pb-4">
              Booking Details
            </h3>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Your Name *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-600">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="reserve-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Email Address *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="reserve-email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Mobile Phone *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-600">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="reserve-phone"
                      type="tel"
                      required
                      placeholder="(555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {/* Party Size */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Party Size *</label>
                  <select
                    id="reserve-party-size"
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Date *</label>
                  <input
                    id="reserve-date"
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  />
                </div>

                {/* Time Slot */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Available Slots *</label>
                  <select
                    id="reserve-time-slot"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Preference */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">Seating Preference</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['standard', 'window', 'outdoor', 'counter'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      id={`seating-pref-${pref}`}
                      onClick={() => setSeatingPreference(pref)}
                      className={`py-2 px-2 text-[11px] font-sans font-medium rounded-lg border transition-all cursor-pointer leading-tight ${
                        seatingPreference === pref
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {preferenceLabels[pref]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Preorder Menu Items Section */}
              <div className="border border-stone-850 rounded-xl p-4 bg-stone-900/30 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 block">EXCLUSIVE</span>
                    <h4 className="text-xs font-sans font-bold text-stone-200">Pre-order Dishes for your Table (Optional)</h4>
                    <p className="text-[10px] text-stone-500">Secure peak seasonal dishes from our limited nightly stock</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreorderSection(!showPreorderSection)}
                    className="px-3 py-1 bg-stone-800 hover:bg-stone-750 text-stone-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {showPreorderSection ? 'Hide Dishes' : 'Browse Menu'}
                  </button>
                </div>

                {showPreorderSection && (
                  <div className="space-y-3 pt-3 border-t border-stone-850/60">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-stone-500">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search appetizers, main courses, desserts..."
                        value={searchFoodQuery}
                        onChange={(e) => setSearchFoodQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-850 rounded-lg text-[11px] text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                      {filteredFoodItems.map((item) => {
                        const count = preorderQuantities[item.id] || 0;
                        const stock = item.storage ?? 50;
                        return (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-2 rounded-lg bg-stone-950/40 border border-stone-900 text-xs"
                          >
                            <div className="space-y-0.5 max-w-[65%]">
                              <p className="font-sans font-bold text-stone-200 truncate">{item.name}</p>
                              <div className="flex items-center space-x-2 text-[9px]">
                                <span className="text-amber-500 font-bold">₹{item.price}</span>
                                <span className="text-stone-500">•</span>
                                <span className={`${stock === 0 ? 'text-rose-400 font-bold' : 'text-stone-400'}`}>
                                  {stock === 0 ? 'Out of stock' : `In Storage: ${stock}`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => updatePreorderQty(item.id, -1, stock)}
                                disabled={count === 0}
                                className={`p-1 rounded-md bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all ${count === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-stone-800'}`}
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="font-mono text-white font-bold text-xs w-4 text-center">
                                {count}
                              </span>
                              <button
                                type="button"
                                onClick={() => updatePreorderQty(item.id, 1, stock)}
                                disabled={stock === 0 || count >= stock}
                                className={`p-1 rounded-md bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all ${stock === 0 || count >= stock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-stone-800'}`}
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {totalPreorderCost > 0 && (
                      <div className="space-y-2 p-3 bg-stone-900 rounded-lg border border-stone-850">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold block">
                          Select Pre-order Payment Mode *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Card', 'UPI', 'Cash'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setPaymentMode(mode)}
                              className={`py-1.5 px-2 text-[10px] font-mono uppercase rounded border transition-all cursor-pointer text-center ${
                                paymentMode === mode
                                  ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-bold'
                                  : 'bg-stone-950 border-stone-900 text-stone-500 hover:text-stone-300 hover:border-stone-800'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {totalPreorderCost > 0 && (
                      <div className="flex justify-between items-center p-2.5 bg-amber-500/5 rounded-lg border border-amber-500/10 text-xs font-sans">
                        <span className="text-stone-400 font-medium">Pre-order Estimated Subtotal</span>
                        <span className="text-amber-500 font-black">₹{totalPreorderCost}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Allergies / Special Requests</label>
                <textarea
                  id="reserve-special-requests"
                  rows={2}
                  placeholder="E.g., high chair needed, celebrating anniversary, severe nut allergy..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-booking"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Request Confirmed Reservation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Column: Ticket / Active Reservations list */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Newly Created Ticket / Digital Pass */}
            {justBooked ? (
              <div className="bg-amber-500 rounded-3xl p-0.5 shadow-2xl relative overflow-hidden">
                {/* Visual circle notches to look like a real physical coupon */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-stone-900 rounded-full z-20 animate-pulse" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-stone-900 rounded-full z-20 animate-pulse" />
                
                <div className="bg-stone-950 rounded-[22px] p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        DINING PASS
                      </span>
                      <h4 
                        className="mt-1.5 font-sans italic font-black uppercase leading-none pb-0.5 tracking-wider text-base"
                      >
                        <span style={{ color: '#F5803B' }}>Peach</span>
                        <span className="bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent px-1 inline-block">&amp;</span>
                        <span style={{ color: '#F6A6C5' }}>Dine</span>
                      </h4>
                    </div>
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                  </div>

                  <div className="border-t border-dashed border-stone-850 pt-4 grid grid-cols-2 gap-y-3.5 gap-x-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">GUEST</span>
                      <span className="text-xs font-sans font-bold text-stone-200 line-clamp-1">{justBooked.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">SEATING</span>
                      <span className="text-xs font-sans font-bold text-stone-200">{preferenceLabels[justBooked.seatingPreference]}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">DATE</span>
                      <span className="text-xs font-sans font-bold text-stone-200">{justBooked.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">TIME &amp; PARTY</span>
                      <span className="text-xs font-sans font-bold text-stone-200">{justBooked.time} • {justBooked.partySize} {justBooked.partySize === 1 ? 'Person' : 'People'}</span>
                    </div>
                    
                    {/* TABLE NUMBER - EXPLICIT DISPLAY ON DINING PASS */}
                    <div className="col-span-2 pt-2 border-t border-stone-900 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">TABLE ASSIGNED</span>
                        <span className="text-[14px] font-sans font-black text-amber-500">
                          Table {justBooked.tableNumber}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">BOOKED ON</span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {justBooked.day} {justBooked.month}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME RESERVATION & ORDER STATUS */}
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-850 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[8px] font-mono text-stone-500 uppercase block">Booking Status</span>
                      <span className={`text-[10px] font-bold capitalize ${justBooked.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {justBooked.status}
                      </span>
                    </div>
                    {justBooked.orderItems && justBooked.orderItems.length > 0 && (
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-stone-500 uppercase block">Order Status</span>
                        <span className="text-[10px] font-mono font-bold text-amber-400 animate-pulse uppercase">
                          {justBooked.orderStatus || 'Pending'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* PRE-ORDERED DISHES AND FOOD QUANTITY DISPLAY */}
                  {justBooked.orderItems && justBooked.orderItems.length > 0 && (
                    <div className="p-3 bg-stone-900 rounded-lg border border-stone-850 space-y-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block border-b border-stone-800 pb-1">
                        PRE-ORDERED FOOD DETAILS
                      </span>
                      <div className="space-y-1 max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800">
                        {justBooked.orderItems.map((oi, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] font-sans text-stone-300">
                            <span>{oi.name} <span className="text-amber-500 font-mono font-bold">x{oi.quantity}</span></span>
                            <span className="font-mono text-stone-400">₹{oi.price * oi.quantity}</span>
                          </div>
                        ))}
                      </div>
                      {justBooked.paymentMode && (
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-stone-400 border-t border-stone-800 pt-1.5 mt-1.5">
                          <span>Payment Mode</span>
                          <span className="text-amber-500 font-bold">{justBooked.paymentMode}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DETAILED BILLING BREAKDOWN */}
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-850 space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block border-b border-stone-800 pb-1">
                      DETAILED BILLING BREAKDOWN
                    </span>
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>Table Cover Charge (deposit):</span>
                      <span>
                        {justBooked.orderItems && justBooked.orderItems.length > 0
                          ? 'Waived (Pre-ordered)'
                          : `₹${(justBooked.partySize * 1500).toLocaleString()}`}
                      </span>
                    </div>
                    {justBooked.orderItems && justBooked.orderItems.length > 0 && (
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>Pre-ordered Food items:</span>
                        <span>₹{justBooked.orderItems.reduce((acc, x) => acc + x.price * x.quantity, 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-bold text-emerald-400 border-t border-stone-800 pt-1.5 mt-1.5 font-mono">
                      <span>TOTAL PAID AMOUNT:</span>
                      <span>
                        ₹{(
                          (justBooked.orderItems && justBooked.orderItems.length > 0 ? 0 : justBooked.partySize * 1500) +
                          (justBooked.orderItems?.reduce((acc, x) => acc + x.price * x.quantity, 0) || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {justBooked.specialRequests && (
                    <div className="p-3 bg-stone-900 rounded-lg border border-stone-850">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block mb-0.5">SPECIAL NOTE</span>
                      <p className="text-[11px] text-stone-300 leading-normal line-clamp-2">{justBooked.specialRequests}</p>
                    </div>
                  )}

                  {/* Elegant Simulated Barcode */}
                  <div className="border-t border-dashed border-stone-850 pt-5 text-center space-y-1.5">
                    <div className="inline-block bg-white p-1.5 rounded-lg">
                      <svg className="w-44 h-7 text-black" viewBox="0 0 100 20" fill="currentColor">
                        <rect x="0" width="2" height="20" />
                        <rect x="3" width="1" height="20" />
                        <rect x="5" width="3" height="20" />
                        <rect x="10" width="1" height="20" />
                        <rect x="13" width="2" height="20" />
                        <rect x="17" width="4" height="20" />
                        <rect x="23" width="1" height="20" />
                        <rect x="25" width="2" height="20" />
                        <rect x="28" width="1" height="20" />
                        <rect x="32" width="3" height="20" />
                        <rect x="37" width="2" height="20" />
                        <rect x="40" width="1" height="20" />
                        <rect x="43" width="4" height="20" />
                        <rect x="49" width="1" height="20" />
                        <rect x="52" width="2" height="20" />
                        <rect x="56" width="3" height="20" />
                        <rect x="61" width="1" height="20" />
                        <rect x="64" width="2" height="20" />
                        <rect x="68" width="4" height="20" />
                        <rect x="74" width="1" height="20" />
                        <rect x="77" width="2" height="20" />
                        <rect x="80" width="1" height="20" />
                        <rect x="84" width="3" height="20" />
                        <rect x="89" width="2" height="20" />
                        <rect x="93" width="1" height="20" />
                        <rect x="96" width="4" height="20" />
                      </svg>
                    </div>
                    <div className="font-mono text-[10px] text-stone-400 font-bold tracking-widest uppercase">
                      CODE: {justBooked.id}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-850 space-y-4 text-center">
                <div className="w-12 h-12 bg-amber-500/5 rounded-full border border-amber-500/10 flex items-center justify-center mx-auto text-amber-500 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-white text-sm">Waiting for Booking...</h4>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto leading-normal">
                    Fill out the reservation details and option to pre-order dishes. Your digital table pass will generate instantly.
                  </p>
                </div>
              </div>
            )}

            {/* List of Active / Past Reservations */}
            {reservations.length > 0 && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-850 space-y-4">
                <h4 className="font-sans font-bold text-white text-xs border-b border-stone-900 pb-2 flex justify-between items-center">
                  <span>Your active bookings</span>
                  <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-mono">{reservations.length}</span>
                </h4>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                  {reservations.map((booking) => (
                    <div
                      key={booking.id}
                      id={`booking-list-item-${booking.id}`}
                      className="p-3 bg-stone-900 rounded-xl border border-stone-850 flex items-center justify-between text-xs group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-mono font-bold text-stone-200">{booking.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : booking.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}>
                            {booking.status}
                          </span>
                          {booking.orderItems && booking.orderItems.length > 0 && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider ${
                              booking.orderStatus === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : booking.orderStatus === 'Preparing'
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              Order: {booking.orderStatus || 'Pending'}
                            </span>
                          )}
                          {booking.tableNumber && (
                            <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.2 rounded font-mono font-bold">
                              Table {booking.tableNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-stone-400 text-[11px] leading-tight">
                          {booking.date} at {booking.time} • {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}
                        </p>
                        {booking.orderItems && booking.orderItems.length > 0 && (
                          <p className="text-[10px] text-amber-400/80 font-sans italic">
                            Pre-ordered: {booking.orderItems.length} items (₹{booking.orderItems.reduce((acc, x) => acc + x.price * x.quantity, 0)})
                          </p>
                        )}
                        {booking.day && booking.month && (
                          <p className="text-[9px] text-stone-500 font-mono">
                            Scheduled for: {booking.day} {booking.month}
                          </p>
                        )}
                      </div>

                      <button
                        id={`cancel-booking-btn-${booking.id}`}
                        onClick={() => cancelReservation(booking.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-950/40 transition-all cursor-pointer opacity-80 hover:opacity-100"
                        title="Cancel Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
