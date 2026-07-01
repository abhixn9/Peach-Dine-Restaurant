import { useState, useMemo, FormEvent, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Check, 
  X, 
  Trash2, 
  Plus, 
  Edit2, 
  RefreshCw, 
  Search, 
  SlidersHorizontal,
  Clock,
  Utensils,
  Tag,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  Minus
} from 'lucide-react';
import { MenuItem, Reservation, WastageItem, OrderItem } from '../types';

export const getDaysInMonth = (monthName: string): number => {
  switch (monthName) {
    case 'February':
      return 28; // non-leap year 2026
    case 'April':
    case 'June':
    case 'September':
    case 'November':
      return 30;
    default:
      return 31;
  }
};

export default function AdminDashboard() {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetMenuItems,
    reservations,
    updateReservationStatus,
    updateOrderStatus,
    deleteReservation,
    reviews,
    deleteReview,
    contactMessages,
    deleteContactMessage,
    wastageItems,
    addWastageItem,
    deleteWastageItem,
    clearWastageItems
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'menu' | 'wastage' | 'reviews' | 'messages'>('overview');
  
  // Search & filter states
  const [resFilter, setResFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [resSearch, setResSearch] = useState('');
  
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState<string>('all');

  // Menu Form Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Menu Item Form Fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(500);
  const [formCategory, setFormCategory] = useState<'starter' | 'main' | 'dessert' | 'drink'>('starter');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formCalories, setFormCalories] = useState<number>(300);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formTagInput, setFormTagInput] = useState('');
  const [formStorage, setFormStorage] = useState<number>(50);

  // Wastage Form Fields
  const today = new Date().toISOString().split('T')[0];
  const [wasteFoodId, setWasteFoodId] = useState('');
  const [wasteQty, setWasteQty] = useState<number>(1);
  const [wasteReason, setWasteReason] = useState('Spoilage / Expiry');
  const [wasteDate, setWasteDate] = useState(today);
  const [wasteFormError, setWasteFormError] = useState('');

  // Selected Day & Month for financial tracking
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const confirmedRes = reservations.filter(r => r.status === 'confirmed' && r.day && r.month);
    return confirmedRes[0]?.day || '01';
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const confirmedRes = reservations.filter(r => r.status === 'confirmed' && r.day && r.month);
    return confirmedRes[0]?.month || 'July';
  });

  // Adjust selectedDay when selectedMonth changes based on days in that month
  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth);
    const dayInt = parseInt(selectedDay, 10);
    if (dayInt > maxDays) {
      setSelectedDay(String(maxDays).padStart(2, '0'));
    }
  }, [selectedMonth, selectedDay]);

  // Financial calculations based on selections
  const selectedDayRevenue = useMemo(() => {
    return reservations
      .filter(r => r.status === 'confirmed' && r.day === selectedDay && r.month === selectedMonth)
      .reduce((sum, r) => {
        const baseCharge = r.orderItems && r.orderItems.length > 0 ? 0 : (r.partySize * 1500);
        const preorders = r.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
        return sum + baseCharge + preorders;
      }, 0);
  }, [reservations, selectedDay, selectedMonth]);

  const selectedDayWastageLoss = useMemo(() => {
    return wastageItems
      .filter(w => w.day === selectedDay && w.month === selectedMonth)
      .reduce((sum, w) => sum + w.lossAmount, 0);
  }, [wastageItems, selectedDay, selectedMonth]);

  const selectedDayProfit = selectedDayRevenue - selectedDayWastageLoss;

  const selectedDayReservations = useMemo(() => {
    return reservations.filter(r => r.status === 'confirmed' && r.day === selectedDay && r.month === selectedMonth);
  }, [reservations, selectedDay, selectedMonth]);

  const selectedDayWastageItems = useMemo(() => {
    return wastageItems.filter(w => w.day === selectedDay && w.month === selectedMonth);
  }, [wastageItems, selectedDay, selectedMonth]);

  const monthlyDailyLedger = useMemo(() => {
    const days = getDaysInMonth(selectedMonth);
    const ledger = [];
    for (let d = 1; d <= days; d++) {
      const dayStr = String(d).padStart(2, '0');
      
      const dayRevenue = reservations
        .filter(r => r.status === 'confirmed' && r.day === dayStr && r.month === selectedMonth)
        .reduce((sum, r) => {
          const baseCharge = r.orderItems && r.orderItems.length > 0 ? 0 : (r.partySize * 1500);
          const preorders = r.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
          return sum + baseCharge + preorders;
        }, 0);

      const dayWastage = wastageItems
        .filter(w => w.day === dayStr && w.month === selectedMonth)
        .reduce((sum, w) => sum + w.lossAmount, 0);

      const dayProfit = dayRevenue - dayWastage;

      if (dayRevenue > 0 || dayWastage > 0) {
        ledger.push({
          day: dayStr,
          revenue: dayRevenue,
          wastage: dayWastage,
          profit: dayProfit
        });
      }
    }
    // Sort chronologically by day
    return ledger.sort((a, b) => parseInt(a.day, 10) - parseInt(b.day, 10));
  }, [reservations, wastageItems, selectedMonth]);

  const selectedMonthRevenue = useMemo(() => {
    return reservations
      .filter(r => r.status === 'confirmed' && r.month === selectedMonth)
      .reduce((sum, r) => {
        const baseCharge = r.orderItems && r.orderItems.length > 0 ? 0 : (r.partySize * 1500);
        const preorders = r.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
        return sum + baseCharge + preorders;
      }, 0);
  }, [reservations, selectedMonth]);

  const selectedMonthWastageLoss = useMemo(() => {
    return wastageItems
      .filter(w => w.month === selectedMonth)
      .reduce((sum, w) => sum + w.lossAmount, 0);
  }, [wastageItems, selectedMonth]);

  const selectedMonthProfit = selectedMonthRevenue - selectedMonthWastageLoss;

  // Overview Stats Calculations
  const stats = useMemo(() => {
    const totalReservations = reservations.length;
    const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
    const pendingCount = reservations.filter(r => r.status === 'pending').length;
    
    // Calculate total spend: estimated average dining charge (₹1,500/head) + actual preorder food selections!
    const estimatedRevenue = reservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => {
        const baseCharge = r.orderItems && r.orderItems.length > 0 ? 0 : (r.partySize * 1500);
        const preorders = r.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
        return sum + baseCharge + preorders;
      }, 0);

    // Average rating
    const avgRating = reviews.length > 0 
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0;

    // Wastage Loss Amount
    const totalWastageLoss = wastageItems.reduce((sum, w) => sum + w.lossAmount, 0);
    const totalWastageQty = wastageItems.reduce((sum, w) => sum + w.quantity, 0);

    return {
      totalReservations,
      confirmedCount,
      pendingCount,
      estimatedRevenue,
      avgRating,
      messageCount: contactMessages.length,
      totalWastageLoss,
      totalWastageQty
    };
  }, [reservations, reviews, contactMessages, wastageItems]);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      const matchesStatus = resFilter === 'all' || r.status === resFilter;
      const matchesSearch = r.name.toLowerCase().includes(resSearch.toLowerCase()) ||
                            r.email.toLowerCase().includes(resSearch.toLowerCase()) ||
                            r.phone.includes(resSearch) ||
                            r.id.toLowerCase().includes(resSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [reservations, resFilter, resSearch]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = menuFilter === 'all' || item.category === menuFilter;
      const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                            item.description.toLowerCase().includes(menuSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, menuFilter, menuSearch]);

  // Open Add Menu Item Modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice(550);
    setFormCategory('starter');
    setFormImage('');
    setFormTags(['Nut-Free']);
    setFormCalories(280);
    setFormIsPopular(false);
    setFormTagInput('');
    setFormStorage(50);
    setIsMenuModalOpen(true);
  };

  // Open Edit Menu Item Modal
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormTags(item.tags || []);
    setFormCalories(item.calories || 250);
    setFormIsPopular(!!item.isPopular);
    setFormTagInput('');
    setFormStorage(item.storage ?? 50);
    setIsMenuModalOpen(true);
  };

  // Handle Menu form submit
  const handleMenuSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim()) return;

    const imageUrl = formImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

    if (editingItem) {
      // Edit
      updateMenuItem(editingItem.id, {
        name: formName.trim(),
        description: formDesc.trim(),
        price: Number(formPrice),
        category: formCategory,
        image: imageUrl,
        tags: formTags,
        calories: Number(formCalories),
        isPopular: formIsPopular,
        storage: Number(formStorage)
      });
    } else {
      // Create
      const newItem: MenuItem = {
        id: 'custom-' + Date.now(),
        name: formName.trim(),
        description: formDesc.trim(),
        price: Number(formPrice),
        category: formCategory,
        image: imageUrl,
        tags: formTags,
        calories: Number(formCalories),
        isPopular: formIsPopular,
        storage: Number(formStorage)
      };
      addMenuItem(newItem);
    }

    setIsMenuModalOpen(false);
  };

  // Add a tag to tag list in form
  const addTag = () => {
    if (formTagInput.trim() && !formTags.includes(formTagInput.trim())) {
      setFormTags([...formTags, formTagInput.trim()]);
      setFormTagInput('');
    }
  };

  // Remove tag from list in form
  const removeTag = (tagToRemove: string) => {
    setFormTags(formTags.filter(t => t !== tagToRemove));
  };

  // Handle Wastage submit
  const handleWastageSubmit = (e: FormEvent) => {
    e.preventDefault();
    setWasteFormError('');

    if (!wasteFoodId) {
      setWasteFormError('Please select a menu item.');
      return;
    }

    const item = menuItems.find(m => m.id === wasteFoodId);
    if (!item) {
      setWasteFormError('Delicacy not found.');
      return;
    }

    if (wasteQty <= 0) {
      setWasteFormError('Quantity must be greater than zero.');
      return;
    }

    // Parse date for day and month extraction
    const dateParts = wasteDate.split('-'); // ["2026", "06", "30"]
    const year = parseInt(dateParts[0], 10);
    const monthIdx = parseInt(dateParts[1], 10) - 1;
    const dayNum = parseInt(dateParts[2], 10);

    const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthsList[monthIdx] || 'June';
    const dayStr = String(dayNum).padStart(2, '0');

    const calculatedLoss = item.price * wasteQty;

    const newWastageLog: WastageItem = {
      id: 'NT-W-' + Math.floor(100000 + Math.random() * 900000),
      menuItemId: wasteFoodId,
      menuItemName: item.name,
      quantity: wasteQty,
      reason: wasteReason,
      lossAmount: calculatedLoss,
      day: dayStr,
      month: monthName,
      dateString: `${dayStr} ${monthName}`,
      createdAt: new Date().toLocaleString()
    };

    // Deduct stock if available
    const currentStock = item.storage ?? 50;
    const newStock = Math.max(0, currentStock - wasteQty);
    updateMenuItem(item.id, { storage: newStock });

    addWastageItem(newWastageLog);
    
    // Reset form
    setWasteQty(1);
    setWasteFormError('');
  };

  const getMostCommonReason = () => {
    if (wastageItems.length === 0) return 'No wastage logged';
    const counts: { [key: string]: number } = {};
    wastageItems.forEach(w => {
      counts[w.reason] = (counts[w.reason] || 0) + w.quantity;
    });
    let maxReason = '';
    let maxVal = -1;
    Object.entries(counts).forEach(([reason, qty]) => {
      if (qty > maxVal) {
        maxVal = qty;
        maxReason = reason;
      }
    });
    return `${maxReason} (${maxVal} items)`;
  };

  return (
    <section id="admin-dashboard-root" className="py-24 bg-stone-900 border-b border-stone-850 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-[#F6A6C5]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-8 mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-500 font-mono text-xs uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4 animate-pulse" />
              <span>DASHBOARD PORTAL</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
              Management &amp; Controls
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Administrative operations, real-time inventory levels, reservations, customer feedback, and food wastage logs.
            </p>
          </div>
          
          {/* Quick Tab Selectors */}
          <div className="flex flex-wrap gap-1 bg-stone-950 p-1.5 rounded-xl border border-stone-800/80">
            {[
              { id: 'overview', label: 'Overview', icon: SlidersHorizontal },
              { id: 'reservations', label: 'Reservations', icon: Calendar, badge: reservations.filter(r => r.status === 'pending').length },
              { id: 'menu', label: 'Menu & Stock', icon: Utensils },
              { id: 'wastage', label: 'Wastage Log', icon: AlertCircle, badge: wastageItems.length },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'messages', label: 'Inquiries', icon: MessageSquare, badge: contactMessages.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 shadow-md shadow-amber-500/10' 
                      : 'text-stone-400 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${isActive ? 'bg-stone-950 text-amber-500' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Estimated revenue */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">EST. BOOKING VAL</span>
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-sans">
                  ₹{stats.estimatedRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Based on {stats.confirmedCount} confirmed passes (covers + preorders)
                </p>
              </div>

              {/* Card 2: Reservations */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">RESERVATIONS</span>
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-sans flex items-baseline gap-2">
                  <span>{stats.totalReservations}</span>
                  {stats.pendingCount > 0 && (
                    <span className="text-xs font-semibold text-amber-500 animate-pulse">
                      ({stats.pendingCount} pending)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  {stats.confirmedCount} Confirmed, {stats.totalReservations - stats.confirmedCount - stats.pendingCount} Cancelled
                </p>
              </div>

              {/* Card 3: Food Wastage Loss */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">WASTAGE WRITE-OFF</span>
                  <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-400 font-sans">
                  ₹{stats.totalWastageLoss.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Total loss from {stats.totalWastageQty} wasted items this season
                </p>
              </div>

              {/* Card 4: Guest Rating */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">GUEST SATISFACTION</span>
                  <div className="p-2 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-sans">
                  {stats.avgRating} <span className="text-xs font-normal text-stone-500">/ 5.0</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Aggregated score across all public dining feedback submissions
                </p>
              </div>

            </div>

            {/* Interactive Financial reports: profits of the day and monthly revenue */}
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-900 pb-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-amber-500 font-mono text-[10px] uppercase tracking-widest">
                    <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
                    <span>REAL-TIME FINANCIAL AUDIT</span>
                  </div>
                  <h3 className="font-sans text-lg font-bold text-white">Profits &amp; Revenue Analytics</h3>
                  <p className="text-xs text-stone-500">
                    Track the daily net profit margins (Revenue minus Wastage write-offs) and monthly accumulated revenues of the restaurant.
                  </p>
                </div>

                {/* Dropdowns */}
                <div className="flex items-center space-x-2.5">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-mono uppercase text-stone-500 tracking-wider">Report Day</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer font-mono"
                    >
                      {Array.from({ length: getDaysInMonth(selectedMonth) }).map((_, i) => {
                        const dayVal = String(i + 1).padStart(2, '0');
                        return <option key={dayVal} value={dayVal}>Day {dayVal}</option>;
                      })}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-mono uppercase text-stone-500 tracking-wider">Report Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Dashboard Sub-grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Section A: Selected Day Profits of the Day */}
                <div className="bg-stone-900/40 p-5 rounded-xl border border-stone-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-bold text-sm text-stone-200">Daily Balance Sheet</h4>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono px-2 py-0.5 rounded border border-amber-500/15">
                      {selectedDay} {selectedMonth}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-850">
                      <span className="text-[9px] font-mono text-stone-500 block uppercase">Revenue</span>
                      <span className="text-sm font-black font-mono text-emerald-400 block mt-1">
                        ₹{selectedDayRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-850">
                      <span className="text-[9px] font-mono text-stone-500 block uppercase">Wastage Loss</span>
                      <span className="text-sm font-black font-mono text-rose-400 block mt-1">
                        ₹{selectedDayWastageLoss.toLocaleString()}
                      </span>
                    </div>
                    <div className={`bg-stone-950 p-3 rounded-lg border ${selectedDayProfit >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                      <span className="text-[9px] font-mono text-stone-500 block uppercase">Net Profit</span>
                      <span className={`text-sm font-black font-mono block mt-1 ${selectedDayProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ₹{selectedDayProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-lg text-[10px] text-stone-400 flex items-start space-x-2 border border-stone-850">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-300">Daily Ledger Notes:</strong> Net profit is computed dynamically as total confirmed bookings (₹1,500 base per head average) + confirmed preorder food items, minus logged ingredient wastage on {selectedDay} {selectedMonth}.
                    </div>
                  </div>
                </div>

                {/* Section B: Selected Month Revenue of the Restaurant */}
                <div className="bg-stone-900/40 p-5 rounded-xl border border-stone-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-bold text-sm text-stone-200">Monthly Revenue Summary</h4>
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 font-mono px-2 py-0.5 rounded border border-rose-500/15">
                      {selectedMonth} 2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-850">
                      <span className="text-[9px] font-mono text-stone-500 block uppercase">Total Revenue</span>
                      <span className="text-sm font-black font-mono text-amber-500 block mt-1">
                        ₹{selectedMonthRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-850">
                      <span className="text-[9px] font-mono text-stone-500 block uppercase">Total Wastage</span>
                      <span className="text-sm font-black font-mono text-rose-400 block mt-1">
                        ₹{selectedMonthWastageLoss.toLocaleString()}
                      </span>
                    </div>
                    <div className={`bg-stone-950 p-3 rounded-lg border ${selectedMonthProfit >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                      <span className="text-[9px] font-mono text-stone-500 block uppercase">Net Profit</span>
                      <span className={`text-sm font-black font-mono block mt-1 ${selectedMonthProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ₹{selectedMonthProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-lg text-[10px] text-stone-400 flex items-start space-x-2 border border-stone-850">
                    <DollarSign className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-300">Monthly Accumulation:</strong> Displays aggregate restaurant revenue stream for {selectedMonth} across all confirmed guest covers, preorder sales, and written-off losses.
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic Daily audit and Month daily ledgers list requested by the user */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-stone-900">
                
                {/* Left: Detailed Audit for Selected Day (5 columns) */}
                <div className="lg:col-span-5 bg-stone-900/30 p-5 rounded-xl border border-stone-850 space-y-4">
                  <div className="border-b border-stone-850 pb-2">
                    <h4 className="font-sans font-bold text-xs text-stone-200 uppercase tracking-wider font-mono">
                      Audit Ledger: {selectedDay} {selectedMonth}
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Confirmed guest covers and spoilage write-offs logged on this day.
                    </p>
                  </div>

                  {/* Selected Day Stats Card */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-950/40 p-3 rounded-lg border border-stone-850 text-center">
                    <div>
                      <span className="text-[8px] font-mono text-stone-500 block uppercase">Day Rev</span>
                      <span className="text-[11px] font-bold font-mono text-emerald-400">
                        ₹{selectedDayRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-x border-stone-850">
                      <span className="text-[8px] font-mono text-stone-500 block uppercase">Day Wastage</span>
                      <span className="text-[11px] font-bold font-mono text-rose-400">
                        ₹{selectedDayWastageLoss.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-stone-500 block uppercase">Day Profit</span>
                      <span className={`text-[11px] font-bold font-mono ${selectedDayProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ₹{selectedDayProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Reservations / Bookings list */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase text-stone-400 font-bold block">
                      Confirmed Bookings ({selectedDayReservations.length})
                    </span>
                    {selectedDayReservations.length === 0 ? (
                      <p className="text-[10px] text-stone-600 italic pl-1">No bookings recorded on this day.</p>
                    ) : (
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {selectedDayReservations.map((res) => {
                          const base = res.orderItems && res.orderItems.length > 0 ? 0 : (res.partySize * 1500);
                          const preorders = res.orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
                          const total = base + preorders;
                          return (
                            <div key={res.id} className="p-3 bg-stone-950/60 rounded-lg border border-stone-850 space-y-2 text-[11px]">
                              {/* Header info */}
                              <div className="flex justify-between items-start border-b border-stone-900 pb-1.5">
                                <div>
                                  <span className="font-bold text-stone-200 block text-xs">{res.name}</span>
                                  <span className="text-[9px] text-amber-500 font-mono">
                                    Table {res.tableNumber || 'Unassigned'} • {res.partySize} Pax • {res.time}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono font-bold text-emerald-400 block">
                                    +₹{total.toLocaleString()}
                                  </span>
                                  <span className="text-[8px] text-stone-500 block">
                                    ID: {res.id}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Details Grid */}
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-stone-400">
                                <div>
                                  <span className="text-stone-600 uppercase font-mono block text-[8px]">Contact</span>
                                  <span className="truncate block">{res.phone}</span>
                                  <span className="truncate block text-[8px] text-stone-500">{res.email}</span>
                                </div>
                                <div>
                                  <span className="text-stone-600 uppercase font-mono block text-[8px]">Seating Preference</span>
                                  <span className="capitalize block">{res.seatingPreference}</span>
                                </div>
                              </div>

                              {/* Pre-ordered items details inside inspect panel */}
                              {res.orderItems && res.orderItems.length > 0 && (
                                <div className="p-1.5 bg-stone-900/55 rounded border border-stone-850 text-[9px] space-y-1">
                                  <span className="text-stone-500 font-mono uppercase block text-[8px] border-b border-stone-850 pb-0.5">Pre-ordered Food:</span>
                                  {res.orderItems.map((oi, i) => (
                                    <div key={i} className="flex justify-between text-stone-300">
                                      <span>{oi.name} <span className="text-amber-500 font-bold font-mono">x{oi.quantity}</span></span>
                                      <span className="font-mono text-stone-500">₹{(oi.price * oi.quantity).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  {res.paymentMode && (
                                    <div className="flex justify-between text-stone-400 pt-1 border-t border-stone-850 mt-1">
                                      <span>Payment Mode:</span>
                                      <span className="text-amber-500 font-bold uppercase">{res.paymentMode}</span>
                                    </div>
                                  )}
                                  
                                  {/* Order Status Controller */}
                                  <div className="flex justify-between items-center pt-1.5 border-t border-stone-850 mt-1">
                                    <span className="text-stone-400 font-medium">Order Status:</span>
                                    <select
                                      id={`order-status-select-day-${res.id}`}
                                      value={res.orderStatus || 'Pending'}
                                      onChange={(e) => updateOrderStatus(res.id, e.target.value as any)}
                                      className="bg-stone-950 border border-stone-800 text-[9px] text-amber-500 rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Preparing">Preparing</option>
                                      <option value="Completed">Completed</option>
                                    </select>
                                  </div>
                                </div>
                              )}

                              {/* Detailed Billing breakdown */}
                              <div className="p-1.5 bg-stone-900/40 rounded border border-stone-850/80 space-y-1 text-[9px]">
                                <span className="text-stone-500 font-mono uppercase block text-[8px] border-b border-stone-850 pb-0.5">Detailed Billing:</span>
                                <div className="flex justify-between text-stone-400">
                                  <span>Cover Charge (Table Reservation):</span>
                                  <span className="font-mono">{base > 0 ? `₹${base.toLocaleString()}` : 'Waived (Pre-ordered)'}</span>
                                </div>
                                {preorders > 0 && (
                                  <div className="flex justify-between text-stone-400">
                                    <span>Pre-ordered Food Items:</span>
                                    <span className="font-mono">₹{preorders.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-white font-bold border-t border-stone-850 pt-1 mt-1 font-mono">
                                  <span>Total Bill Check:</span>
                                  <span className="text-emerald-400">₹{total.toLocaleString()}</span>
                                </div>
                              </div>

                              {res.specialRequests && (
                                <div className="text-[9px] text-stone-500 italic bg-amber-500/5 px-1.5 py-1 rounded">
                                  <span className="font-bold text-[8px] font-mono uppercase text-amber-600 not-italic block">Special Requests:</span>
                                  "{res.specialRequests}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Wastage list */}
                  <div className="space-y-2 pt-2 border-t border-stone-850/60">
                    <span className="text-[9px] font-mono uppercase text-stone-400 font-bold block">
                      Wastage & Spoilage Write-offs ({selectedDayWastageItems.length})
                    </span>
                    {selectedDayWastageItems.length === 0 ? (
                      <p className="text-[10px] text-stone-600 italic pl-1">No food wastage logged on this day.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {selectedDayWastageItems.map((w) => (
                          <div key={w.id} className="p-2 bg-stone-950/60 rounded-lg border border-stone-850 flex justify-between items-center text-[11px]">
                            <div>
                              <span className="font-bold text-stone-300">{w.menuItemName}</span>
                              <span className="text-[9px] text-stone-500 block">
                                Qty x{w.quantity} • {w.reason}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-rose-400">
                              -₹{w.lossAmount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Right: Daily Ledger Timeline (7 columns) */}
                <div className="lg:col-span-7 bg-stone-900/30 p-5 rounded-xl border border-stone-850 space-y-4">
                  <div className="border-b border-stone-850 pb-2 flex justify-between items-center">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-stone-200 uppercase tracking-wider font-mono">
                        Daily Profit Ledger: {selectedMonth}
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        Historical timeline of past daily profits. Click a row to inspect its records.
                      </p>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/15 px-2 py-0.5 rounded font-mono">
                      {monthlyDailyLedger.length} active days
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-stone-850 text-stone-500 font-mono text-[9px] uppercase">
                          <th className="pb-2">Date</th>
                          <th className="pb-2 text-right">Revenue</th>
                          <th className="pb-2 text-right">Wastage Loss</th>
                          <th className="pb-2 text-right">Net Profit</th>
                          <th className="pb-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-850/60">
                        {monthlyDailyLedger.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-stone-500 italic text-xs">
                              No transactions recorded in {selectedMonth} yet.
                            </td>
                          </tr>
                        ) : (
                          monthlyDailyLedger.map((dayRow) => {
                            const isCurrentlySelected = dayRow.day === selectedDay;
                            return (
                              <tr 
                                key={dayRow.day} 
                                onClick={() => setSelectedDay(dayRow.day)}
                                className={`cursor-pointer transition-colors group ${
                                  isCurrentlySelected 
                                    ? 'bg-amber-500/10 text-amber-400 font-semibold' 
                                    : 'hover:bg-stone-950/40 text-stone-300'
                                }`}
                              >
                                <td className="py-2.5 font-mono font-bold">
                                  {dayRow.day} {selectedMonth}
                                </td>
                                <td className="py-2.5 text-right font-mono text-emerald-400">
                                  ₹{dayRow.revenue.toLocaleString()}
                                </td>
                                <td className="py-2.5 text-right font-mono text-rose-400">
                                  ₹{dayRow.wastage.toLocaleString()}
                                </td>
                                <td className="py-2.5 text-right font-mono">
                                  <span className={dayRow.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                    ₹{dayRow.profit.toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-2.5 text-right">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDay(dayRow.day);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider transition-all ${
                                      isCurrentlySelected
                                        ? 'bg-amber-500 text-stone-950 border-transparent font-bold'
                                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white hover:border-stone-700'
                                    }`}
                                  >
                                    {isCurrentlySelected ? 'Inspecting' : 'Inspect'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Status / Help Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <div className="space-y-2">
                <h4 className="text-sm font-sans font-bold text-stone-200">System Activity Overview</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  As an admin, you can manage the live interactive menu and view exact reservations along with detailed guest seating arrangements and order item selections. Storage stock levels decrement automatically whenever a diner pre-orders food items.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-sans font-bold text-stone-200">Management Shortcuts</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button onClick={() => setActiveTab('reservations')} className="p-2 bg-stone-900 hover:bg-stone-850 rounded-lg text-left text-amber-500 font-medium transition-colors">
                    → Review Bookings
                  </button>
                  <button onClick={() => setActiveTab('menu')} className="p-2 bg-stone-900 hover:bg-stone-850 rounded-lg text-left text-amber-500 font-medium transition-colors">
                    → Manage Stock
                  </button>
                  <button onClick={() => setActiveTab('wastage')} className="p-2 bg-stone-900 hover:bg-stone-850 rounded-lg text-left text-amber-500 font-medium transition-colors">
                    → Log Spoiled Food
                  </button>
                  <button onClick={() => resetMenuItems()} className="p-2 bg-stone-900 hover:bg-stone-850 rounded-lg text-left text-rose-400 font-medium transition-colors">
                    ↺ Reset Live Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: RESERVATIONS ==================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-950 p-4 rounded-xl border border-stone-800/80">
              
              {/* Search input */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Filter controls */}
              <div className="flex gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'cancelled', label: 'Cancelled' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setResFilter(opt.value as any)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      resFilter === opt.value
                        ? 'bg-amber-500 text-stone-950'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Table of Reservations */}
            <div className="bg-stone-950 rounded-2xl border border-stone-800/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-stone-800 bg-stone-900/60">
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Booking ID</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Diner / Contact</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Schedule</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Table / Preference</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Preordered Food / Quantities</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Status</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-stone-400 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850">
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-500 text-xs">
                          No matching reservations found. Try creating a booking first or adjust filters!
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((res) => (
                        <tr key={res.id} className="hover:bg-stone-900/30 transition-colors text-xs">
                          <td className="p-4 font-mono font-bold text-amber-500">
                            {res.id}
                          </td>
                          <td className="p-4 space-y-1">
                            <div className="font-bold text-stone-100">{res.name}</div>
                            <div className="text-[10px] text-stone-500">{res.email}</div>
                            <div className="text-[10px] text-stone-500">{res.phone}</div>
                          </td>
                          <td className="p-4 space-y-1">
                            <div className="flex items-center space-x-1 font-semibold text-stone-300">
                              <Calendar className="w-3.5 h-3.5 text-stone-500" />
                              <span>{res.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[10px] text-stone-500">
                              <Clock className="w-3.5 h-3.5 text-stone-500" />
                              <span>{res.time} • {res.partySize} Pax</span>
                            </div>
                            {res.day && res.month && (
                              <div className="text-[9px] text-amber-500 font-mono">
                                Registered Date: {res.day} {res.month}
                              </div>
                            )}
                          </td>
                          <td className="p-4 space-y-1.5">
                            {res.tableNumber ? (
                              <div className="font-extrabold text-amber-500 font-sans text-xs bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded inline-block">
                                Table {res.tableNumber}
                              </div>
                            ) : (
                              <div className="text-stone-500 font-mono text-[10px]">Auto-Assigned Table 12</div>
                            )}
                            <div className="text-stone-400 font-mono text-[10px] uppercase block">
                              Seating: {res.seatingPreference}
                            </div>
                          </td>
                          
                          {/* PREORDERED ITEMS WITH EXPLICIT FOOD QUANTITY DISPLAY IN ADMIN MODE */}
                          <td className="p-4 max-w-[200px]">
                            {res.orderItems && res.orderItems.length > 0 ? (
                              <div className="space-y-1.5 bg-stone-900/60 p-2.5 rounded-lg border border-stone-850">
                                {res.orderItems.map((oi, index) => (
                                  <div key={index} className="flex justify-between text-[10px] text-stone-300 font-sans">
                                    <span className="truncate max-w-[120px]">{oi.name}</span>
                                    <span className="text-amber-500 font-bold ml-1 font-mono">x{oi.quantity}</span>
                                  </div>
                                ))}
                                
                                {/* Detailed Billing View */}
                                <div className="border-t border-stone-800/80 pt-1.5 mt-1.5 space-y-0.5 text-[9px] text-stone-400 font-mono">
                                  <div className="flex justify-between">
                                    <span>Cover Charge:</span>
                                    <span>Waived</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Food Subtotal:</span>
                                    <span>₹{res.orderItems.reduce((acc, x) => acc + x.price * x.quantity, 0).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-amber-400 font-bold border-t border-stone-900 pt-0.5 mt-0.5">
                                    <span>Total:</span>
                                    <span>₹{res.orderItems.reduce((acc, x) => acc + x.price * x.quantity, 0).toLocaleString()}</span>
                                  </div>
                                </div>

                                {res.paymentMode && (
                                  <div className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-amber-500 text-right mt-0.5">
                                    Paid via: {res.paymentMode}
                                  </div>
                                )}

                                {/* Order Status Update Dropdown */}
                                <div className="border-t border-stone-800/80 pt-1.5 mt-1.5 flex items-center justify-between text-[9px]">
                                  <span className="text-stone-400">Order Status:</span>
                                  <select
                                    id={`order-status-select-master-${res.id}`}
                                    value={res.orderStatus || 'Pending'}
                                    onChange={(e) => updateOrderStatus(res.id, e.target.value as any)}
                                    className="bg-stone-950 border border-stone-800 text-[9px] text-amber-500 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-stone-600 italic text-[11px]">No pre-ordered food</span>
                                <div className="p-1.5 bg-stone-900/30 rounded border border-stone-850/50 space-y-0.5 text-[9px] text-stone-500 font-mono">
                                  <div className="flex justify-between">
                                    <span>Cover Charge:</span>
                                    <span>₹{(res.partySize * 1500).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-stone-400 font-bold border-t border-stone-900 pt-0.5 mt-0.5">
                                    <span>Total:</span>
                                    <span>₹{(res.partySize * 1500).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider font-bold ${
                              res.status === 'confirmed' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : res.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {res.status === 'pending' && (
                                <button
                                  onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                  title="Confirm Reservation"
                                  className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-stone-950 rounded-md border border-green-500/20 hover:border-transparent transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              
                              {res.status !== 'cancelled' ? (
                                <button
                                  onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                  title="Cancel Reservation"
                                  className="p-1.5 bg-stone-900 hover:bg-rose-500/25 text-stone-400 hover:text-rose-400 rounded-md border border-stone-800 transition-all cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                  title="Re-confirm Reservation"
                                  className="p-1.5 bg-stone-900 hover:bg-green-500/20 text-stone-400 hover:text-green-400 rounded-md border border-stone-800 transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`Delete reservation ledger ${res.id}?`)) {
                                    deleteReservation(res.id);
                                  }
                                }}
                                title="Delete Ledger Entry"
                                className="p-1.5 bg-stone-900 hover:bg-rose-500 text-stone-400 hover:text-white rounded-md border border-stone-800 hover:border-transparent transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MENU CURATION & STOCK ==================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Filters and Add Button */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between bg-stone-950 p-4 rounded-xl border border-stone-800/80">
              
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
                {/* Search */}
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search menu delicacies..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Category select */}
                <div className="flex gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 max-w-lg overflow-x-auto">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'starter', label: 'Starters' },
                    { value: 'main', label: 'Mains' },
                    { value: 'dessert', label: 'Desserts' },
                    { value: 'drink', label: 'Drinks' }
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setMenuFilter(cat.value)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        menuFilter === cat.value
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add New Delicacy */}
              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Delicacy</span>
              </button>
            </div>

            {/* Menu Items Manager Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-stone-950 rounded-2xl border border-stone-800/80 overflow-hidden relative flex flex-col group hover:border-amber-500/20 transition-all duration-300"
                >
                  {/* Badge */}
                  {item.isPopular && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-amber-500 text-stone-950 font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-md shadow-lg flex items-center gap-1">
                      POPULAR
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 z-10 flex space-x-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit Item"
                      className="p-2 bg-stone-950/80 backdrop-blur-md hover:bg-amber-500 hover:text-stone-950 text-stone-300 rounded-lg border border-stone-800 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove custom delicacy "${item.name}" from live seasonal selection?`)) {
                          deleteMenuItem(item.id);
                        }
                      }}
                      title="Delete Item"
                      className="p-2 bg-stone-950/80 backdrop-blur-md hover:bg-rose-500 hover:text-white text-stone-300 rounded-lg border border-stone-800 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image container */}
                  <div className="h-44 w-full overflow-hidden bg-stone-900 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-stone-950 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="px-2 py-0.5 bg-stone-900/80 text-stone-400 font-mono text-[9px] uppercase tracking-wider rounded border border-stone-800">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-sans font-bold text-stone-100 text-sm group-hover:text-amber-500 transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <span className="font-mono font-black text-amber-500 text-sm">
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* INTERACTIVE STORAGE OF ITEMS IN THE ADMIN MODE */}
                    <div className="py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-850 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                        <span>STORAGE / STOCK LEVEL</span>
                        <span className={`font-bold ${ (item.storage ?? 50) < 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400' }`}>
                          {(item.storage ?? 50) < 10 ? 'Low Stock Alert' : 'Sufficient'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => updateMenuItem(item.id, { storage: Math.max(0, (item.storage ?? 50) - 5) })}
                            className="px-1.5 py-0.5 rounded bg-stone-950 hover:bg-stone-800 text-stone-500 hover:text-stone-300 text-[9px] font-mono border border-stone-800"
                            title="Decrease Stock by 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => updateMenuItem(item.id, { storage: Math.max(0, (item.storage ?? 50) - 1) })}
                            className="p-1 rounded bg-stone-950 hover:bg-stone-800 text-stone-500 hover:text-stone-300 border border-stone-800"
                            title="Decrease Stock by 1"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="font-mono font-black text-xs text-amber-500">
                          {item.storage ?? 50} units left
                        </span>

                        <div className="flex space-x-1">
                          <button
                            onClick={() => updateMenuItem(item.id, { storage: (item.storage ?? 50) + 1 })}
                            className="p-1 rounded bg-stone-950 hover:bg-stone-800 text-stone-500 hover:text-stone-300 border border-stone-800"
                            title="Increase Stock by 1"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => updateMenuItem(item.id, { storage: (item.storage ?? 50) + 5 })}
                            className="px-1.5 py-0.5 rounded bg-stone-950 hover:bg-stone-800 text-stone-500 hover:text-stone-300 text-[9px] font-mono border border-stone-800"
                            title="Increase Stock by 5"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-stone-900 gap-2">
                      <div className="flex flex-wrap gap-1">
                        {(item.tags || []).map((tag) => (
                          <span 
                            key={tag}
                            className="px-1.5 py-0.5 bg-stone-900 text-stone-500 text-[9px] rounded font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {item.calories && (
                        <span className="text-[10px] text-stone-500 font-mono">
                          {item.calories} kCal
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Menu Form Modal */}
            {isMenuModalOpen && (
              <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b border-stone-800 pb-4">
                    <h3 className="text-lg font-black font-sans text-white">
                      {editingItem ? 'Edit Curated Delicacy' : 'Add Custom Delicacy'}
                    </h3>
                    <button
                      onClick={() => setIsMenuModalOpen(false)}
                      className="text-stone-400 hover:text-white p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleMenuSubmit} className="space-y-4 text-xs">
                    
                    {/* Item Name */}
                    <div className="space-y-1">
                      <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Delicacy Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Saffron Infused Scallops"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Price, Calories and Storage Quantity */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Price (₹ Rupees) *</label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          placeholder="550"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Calories (kCal)</label>
                        <input
                          type="number"
                          value={formCalories}
                          onChange={(e) => setFormCalories(Number(e.target.value))}
                          placeholder="280"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Storage Stock *</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={formStorage}
                          onChange={(e) => setFormStorage(Number(e.target.value))}
                          placeholder="50"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1">
                      <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Category Selection *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
                      >
                        <option value="starter">Appetizer / Starter</option>
                        <option value="main">Main Entrée</option>
                        <option value="dessert">Sweet Dessert</option>
                        <option value="drink">Artisanal Beverage</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Culinary Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Incorporate local farm ingredients, cooking techniques, and tasting notes..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1">
                      <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Unsplash or Local Image URL</label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="e.g. /restaurant-1.png or Unsplash URL"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Tag input and visual pills */}
                    <div className="space-y-2">
                      <label className="block text-stone-400 font-mono uppercase tracking-wider text-[10px]">Dietary / Nutritional Labels</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formTagInput}
                          onChange={(e) => setFormTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          placeholder="e.g. Vegan, Gluten-Free, Nut-Free"
                          className="flex-1 bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2.5 bg-stone-800 hover:bg-stone-750 text-white font-bold rounded-lg transition-all"
                        >
                          Add
                        </button>
                      </div>
                      
                      {/* Tags container */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {formTags.map((tag) => (
                          <span 
                            key={tag}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-stone-950 text-amber-500 rounded font-mono text-[9px] uppercase border border-stone-800/80"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-stone-500 hover:text-rose-400 font-sans font-bold pl-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Popular Switch */}
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        id="formIsPopular"
                        type="checkbox"
                        checked={formIsPopular}
                        onChange={(e) => setFormIsPopular(e.target.checked)}
                        className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="formIsPopular" className="text-stone-300 font-sans cursor-pointer">
                        Mark as "Popular Demand" recommendation
                      </label>
                    </div>

                    {/* Submit buttons */}
                    <div className="flex justify-end gap-3 border-t border-stone-800 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsMenuModalOpen(false)}
                        className="px-5 py-2.5 bg-stone-850 hover:bg-stone-800 text-stone-300 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-stone-950 font-bold rounded-lg transition-all"
                      >
                        {editingItem ? 'Save Changes' : 'Create Selection'}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 4: WASTAGE FOOD ITEMS ==================== */}
        {activeTab === 'wastage' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header / Intro Card */}
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-white">Food Wastage &amp; Spoilage Ledger</h3>
                <p className="text-xs text-stone-500">
                  Track thrown, spoiled, or spilled dishes with full cost valuation loss write-offs. Saved with explicit day and month.
                </p>
              </div>
              {wastageItems.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all food wastage log history? This action is irreversible.')) {
                      clearWastageItems();
                    }
                  }}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Clear Waste Ledger
                </button>
              )}
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">CUMULATIVE COST LOSS</span>
                <span className="text-xl font-black text-rose-400 font-mono">₹{stats.totalWastageLoss.toLocaleString()}</span>
              </div>
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">TOTAL QUANTITY SPOILED</span>
                <span className="text-xl font-black text-white font-mono">{stats.totalWastageQty} items</span>
              </div>
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">PRIMARY SPOIL REASON</span>
                <span className="text-xs font-bold text-amber-500 truncate block mt-1.5">{getMostCommonReason()}</span>
              </div>
            </div>

            {/* Side-by-Side: Add Log & Log Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form card (5 columns) */}
              <div className="lg:col-span-5 bg-stone-950 p-6 rounded-2xl border border-stone-800/80 space-y-4">
                <h4 className="font-sans font-bold text-white text-sm border-b border-stone-900 pb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Log Wastage Delicacy</span>
                </h4>

                {wasteFormError && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] rounded-lg">
                    {wasteFormError}
                  </div>
                )}

                <form onSubmit={handleWastageSubmit} className="space-y-4 text-xs">
                  {/* Food delicacy selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Select Delicacy *</label>
                    <select
                      value={wasteFoodId}
                      onChange={(e) => setWasteFoodId(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      <option value="">-- Choose Menu Delicacy --</option>
                      {menuItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Price: ₹{item.price}, Stock: {item.storage ?? 50})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity and Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Wasted Qty *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={wasteQty}
                        onChange={(e) => setWasteQty(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Waste Date *</label>
                      <input
                        type="date"
                        required
                        value={wasteDate}
                        onChange={(e) => setWasteDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Primary Reason *</label>
                    <select
                      value={wasteReason}
                      onChange={(e) => setWasteReason(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      <option value="Spoilage / Expiry">Spoilage / Expiry</option>
                      <option value="Kitchen Burn / Mistake">Kitchen Burn / Mistake</option>
                      <option value="Spillage / Mishandling">Spillage / Mishandling</option>
                      <option value="Customer Leftovers">Customer Leftovers</option>
                      <option value="Over-preparation excess">Over-preparation excess</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-500/10 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Log Wastage Record</span>
                  </button>
                </form>
              </div>

              {/* Logs Timeline table (7 columns) */}
              <div className="lg:col-span-7 bg-stone-950 p-6 rounded-2xl border border-stone-800/80 space-y-4">
                <h4 className="font-sans font-bold text-white text-sm border-b border-stone-900 pb-2 flex justify-between items-center">
                  <span>Wastage Audit History</span>
                  <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-full font-mono">
                    {wastageItems.length} records
                  </span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-850 bg-stone-900/30 text-stone-500 font-mono text-[10px] uppercase">
                        <th className="p-3">Delicacy Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Loss (₹)</th>
                        <th className="p-3">Schedule</th>
                        <th className="p-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900">
                      {wastageItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-stone-500 italic">
                            No food wastage logged. Kitchen is running with peak performance!
                          </td>
                        </tr>
                      ) : (
                        wastageItems.map((log) => (
                          <tr key={log.id} className="hover:bg-stone-900/20 text-stone-300">
                            <td className="p-3 font-sans font-bold text-stone-100">
                              {log.menuItemName}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-rose-400">
                              {log.quantity}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-stone-900 text-stone-400 border border-stone-850 rounded text-[9px] font-mono">
                                {log.reason}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-rose-400">
                              ₹{log.lossAmount.toLocaleString()}
                            </td>
                            <td className="p-3 font-mono text-[10px] text-stone-500">
                              {log.day && log.month ? `${log.day} ${log.month}` : log.dateString}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => deleteWastageItem(log.id)}
                                title="Delete Log Record"
                                className="p-1 text-stone-600 hover:text-rose-400 hover:bg-stone-900 rounded transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 5: REVIEWS ==================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 space-y-2">
              <h3 className="font-sans text-lg font-bold text-white">Guest Review Ledger Moderator</h3>
              <p className="text-xs text-stone-500">
                Audit, flag, or remove diner comments in your public feedback timeline. Reviews deleted here will be dynamically removed from the Customer word-of-mouth slider.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-stone-950 p-5 rounded-2xl border border-stone-800/80 flex flex-col justify-between relative group hover:border-amber-500/10 transition-all duration-300 space-y-4"
                >
                  <button
                    onClick={() => {
                      if (confirm(`Remove review by ${rev.name} permanently?`)) {
                        deleteReview(rev.id);
                      }
                    }}
                    title="Delete Review"
                    className="absolute top-4 right-4 p-2 bg-stone-900 hover:bg-rose-500 text-stone-400 hover:text-white rounded-lg border border-stone-800 hover:border-transparent transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-3">
                    {/* Stars and date */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500 space-x-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx}
                            className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-500' : 'text-stone-700'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[9px] uppercase text-stone-500 tracking-wider">
                        {rev.date}
                      </span>
                    </div>

                    <p className="text-stone-300 text-xs leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Diner profile */}
                  <div className="flex items-center space-x-3 pt-3 border-t border-stone-900/60">
                    <img
                      src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                      alt={rev.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-stone-800"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-stone-200">{rev.name}</h5>
                      <span className="text-[9px] uppercase font-mono text-stone-500">Verified Diner</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== TAB 6: MESSAGES ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 space-y-2">
              <h3 className="font-sans text-lg font-bold text-white">Concierge Customer Inbox</h3>
              <p className="text-xs text-stone-500">
                Review automated responses and feedback messages generated via the contact coordinates form.
              </p>
            </div>

            <div className="space-y-4">
              {contactMessages.length === 0 ? (
                <div className="bg-stone-950 p-12 text-center rounded-2xl border border-stone-800 text-stone-500 text-xs">
                  Your inbox is completely clear! Any messages sent from the Contact form will reflect here in real-time.
                </div>
              ) : (
                contactMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className="bg-stone-950 p-6 rounded-2xl border border-stone-800/80 space-y-4 hover:border-teal-500/20 transition-all group relative"
                  >
                    <button
                      onClick={() => deleteContactMessage(msg.id)}
                      title="Dismiss Message"
                      className="absolute top-6 right-6 p-2 bg-stone-900 hover:bg-rose-500 text-stone-400 hover:text-white rounded-lg border border-stone-800 hover:border-transparent transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-900 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                          <span className="px-2 py-0.5 bg-stone-900 text-teal-400 font-mono text-[9px] uppercase tracking-wider rounded border border-stone-800">
                            {msg.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-mono">{msg.email}</p>
                      </div>
                      <span className="font-mono text-[10px] text-stone-500">
                        Received {msg.date}
                      </span>
                    </div>

                    <p className="text-stone-300 text-xs leading-relaxed font-sans text-pretty">
                      {msg.message}
                    </p>

                    {/* Simulation concierge helper info */}
                    <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-850 text-[11px] text-stone-400 flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-green-400">Concierge Bot:</strong> Auto-reply dispatched safely to <strong>{msg.email}</strong>. This record is archived inside the Local storage dashboard database.
                      </p>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
