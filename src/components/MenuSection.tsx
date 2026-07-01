import { useState, useMemo, FormEvent, useEffect } from 'react';
import { Search, Flame, Sparkles, Filter, Leaf, ChevronRight, RefreshCw, Sparkle, Plus, Minus, ReceiptText, ChefHat, Trash2, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, Reservation } from '../types';

export default function MenuSection() {
  const { menuItems, isAdminMode, deleteMenuItem, addMenuItem, addReservation, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'starter' | 'main' | 'dessert' | 'drink'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');

  // Curated meal order checkout/booking state
  const [curatedPaymentMode, setCuratedPaymentMode] = useState<'Card' | 'UPI' | 'Cash'>('Card');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDate, setGuestDate] = useState('');
  const [guestTime, setGuestTime] = useState('7:00 PM');
  const [guestPartySize, setGuestPartySize] = useState(2);
  const [justBookedCurated, setJustBookedCurated] = useState<Reservation | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Auto-fill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setGuestName(currentUser.name);
      setGuestEmail(currentUser.email);
      setGuestPhone(currentUser.phone);
    } else {
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
    }
  }, [currentUser]);

  // Handle placing a curated meal booking/order
  const handlePlaceCuratedOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim() || !guestDate) {
      setCheckoutError('Please enter your full name, email, phone number, and selected dining date.');
      return;
    }

    setCheckoutError('');

    // Generate table number
    const assignedTable = Math.floor(Math.random() * 24) + 1;

    // Convert date string to month name and day number
    const dateObj = new Date(guestDate);
    const dayStr = String(dateObj.getDate());
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[dateObj.getMonth()] || 'July';

    // Prepare preorder items list
    const orderItems = plannedMeal.map(({ item, count }) => ({
      itemId: item.id,
      name: item.name,
      quantity: count,
      price: item.price
    }));

    const newRes: Reservation = {
      id: 'res-curated-' + Date.now().toString().slice(-6),
      name: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      date: guestDate,
      time: guestTime,
      partySize: Number(guestPartySize),
      seatingPreference: 'standard',
      specialRequests: 'Booked directly via the Curated Meal Builder!',
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
      tableNumber: assignedTable,
      orderItems,
      paymentMode: curatedPaymentMode,
      day: dayStr,
      month: monthName
    };

    addReservation(newRes);
    setJustBookedCurated(newRes);
    
    // Clear curated meal planner upon checkout success
    setPlannedMeal([]);
    setCuratedPaymentMode('Card');
    setShowCheckoutForm(false);
  };

  // Local state for Add Menu Item Modal in Admin Mode
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(550);
  const [newCategory, setNewCategory] = useState<'starter' | 'main' | 'dessert' | 'drink'>('starter');
  const [newImage, setNewImage] = useState('');
  const [newCalories, setNewCalories] = useState(280);
  const [newTags, setNewTags] = useState('Nut-Free');

  const handleAddNewItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    const finalImage = newImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
    const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);

    const newItem: MenuItem = {
      id: 'custom-m-' + Date.now(),
      name: newName.trim(),
      description: newDesc.trim(),
      price: Number(newPrice),
      category: newCategory,
      image: finalImage,
      tags: tagsArray,
      calories: Number(newCalories),
      storage: 50,
      isPopular: false
    };

    addMenuItem(newItem);
    
    // reset form
    setNewName('');
    setNewDesc('');
    setNewPrice(550);
    setNewCategory('starter');
    setNewImage('');
    setNewCalories(280);
    setNewTags('Nut-Free');
    setIsAddModalOpen(false);
  };
  
  // Custom meal planning interactive state
  const [plannedMeal, setPlannedMeal] = useState<{ item: MenuItem; count: number }[]>([]);

  // Filter categories
  const categories = [
    { label: 'All Creations', value: 'all' },
    { label: 'Appetizers & Starters', value: 'starter' },
    { label: 'Mains', value: 'main' },
    { label: 'Desserts', value: 'dessert' },
    { label: 'Artisanal Drinks', value: 'drink' },
  ];

  // Dietary tags
  const dietTags = [
    { label: 'All Preferences', value: 'all' },
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Gluten-Free', value: 'Gluten-Free' },
    { label: 'Vegetarian', value: 'Vegetarian' },
    { label: 'Nut-Free', value: 'Nut-Free' },
  ];

  // Filter items based on category, search, and diet
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet = selectedDiet === 'all' || item.tags.includes(selectedDiet);
      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [menuItems, selectedCategory, searchQuery, selectedDiet]);

  // Add item to meal planner
  const addToMeal = (item: MenuItem) => {
    setPlannedMeal((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, count: i.count + 1 } : i));
      }
      return [...prev, { item, count: 1 }];
    });
  };

  // Remove / decrement from meal planner
  const removeFromMeal = (itemId: string) => {
    setPlannedMeal((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing && existing.count > 1) {
        return prev.map((i) => (i.item.id === itemId ? { ...i, count: i.count - 1 } : i));
      }
      return prev.filter((i) => i.item.id !== itemId);
    });
  };

  // Fully clear meal planner
  const clearMeal = () => {
    setPlannedMeal([]);
  };

  // Calculations for planned meal
  const mealStats = useMemo(() => {
    let totalCost = 0;
    let totalCalories = 0;
    let prepTimeEst = 0;
    let countItems = 0;

    plannedMeal.forEach(({ item, count }) => {
      totalCost += item.price * count;
      totalCalories += (item.calories || 0) * count;
      countItems += count;
      
      // Calculate progressive estimated prep time
      let basePrep = 12;
      if (item.category === 'main') basePrep = 22;
      if (item.category === 'dessert') basePrep = 10;
      if (item.category === 'drink') basePrep = 5;
      prepTimeEst = Math.max(prepTimeEst, basePrep);
    });

    if (countItems > 0) {
      prepTimeEst += Math.round(countItems * 1.5);
    }

    return { totalCost, totalCalories, prepTimeEst, countItems };
  }, [plannedMeal]);

  // Dynamic Sommelier & Chef Pairing Advice based on items added
  const pairingAdvice = useMemo(() => {
    if (plannedMeal.length === 0) return null;

    const categoriesInMeal = plannedMeal.map(i => i.item.category);
    const hasMain = categoriesInMeal.includes('main');
    const hasStarter = categoriesInMeal.includes('starter');
    const hasDrink = categoriesInMeal.includes('drink');
    const hasDessert = categoriesInMeal.includes('dessert');

    const names = plannedMeal.map(i => i.item.name.toLowerCase());
    const hasAlcohol = plannedMeal.some(i => i.item.tags.includes('Alcoholic'));
    const isVeganOnly = plannedMeal.every(i => i.item.tags.includes('Vegan') || i.item.tags.includes('Non-Alcoholic'));

    if (names.some(n => n.includes('short rib')) && names.some(n => n.includes('old fashioned'))) {
      return "🍷 Sommelier's Note: Pairing our hickory-smoked Old Fashioned with the 12-Hour Braised Short Rib is an incredible match! The cherrywood smoke notes amplify the red wine glaze beautifully.";
    }

    if (isVeganOnly && plannedMeal.length >= 2) {
      return "🌿 Chef's Note: Wonderful plant-based combination! The botanical elements in our Lavender Blackberry Spritzer act as a natural palate cleanser alongside our Smoked Cauliflower Steak.";
    }

    if (hasMain && !hasDrink) {
      return "🥂 Sommelier's Tip: A delicious choice! Consider adding a Peach & Dine Collins to enhance the beautiful peach aromatics of your main course.";
    }

    if (hasMain && hasStarter && hasDessert && hasDrink) {
      return "🌟 Chef's Tip: You have designed a complete, four-course masterclass tasting menu. This will be beautifully paced.";
    }

    return "✨ Culinary Note: Our ingredients are curated to share natural volatile compounds—ensuring smooth harmony between whichever items you choose.";
  }, [plannedMeal]);

  return (
    <section id="menu" className="py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">
            SOCIALLY CONSCIOUS INGREDIENTS
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent inline-block pb-1">
            Our Micro-Seasonal Menu
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-2xl mx-auto text-pretty">
            Every item is hand-made to order using peak ingredients sourced from our regional farming cooperative. Prices reflect sustainable livelihood wages for our agricultural partners.
          </p>
          {isAdminMode && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border-0"
              >
                <Plus className="w-4 h-4 text-stone-950 font-black" />
                <span>Add Custom Delicacy</span>
              </button>
            </div>
          )}
        </div>

        {/* Filters and Search toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
          
          {/* Categories select row */}
          <div className="lg:col-span-8 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
            <div className="flex space-x-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  id={`btn-cat-${cat.value}`}
                  onClick={() => setSelectedCategory(cat.value as any)}
                  className={`px-4 py-2 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/15'
                      : 'bg-stone-900 border border-stone-850 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar & Diet Filters */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans"
              />
            </div>

            {/* Diet preferences Select dropdown */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500 pointer-events-none">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                id="menu-diet-select"
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-stone-900 border border-stone-850 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 transition-all font-sans appearance-none cursor-pointer"
              >
                {dietTags.map((diet) => (
                  <option key={diet.value} value={diet.value}>
                    {diet.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Master Grid Layout (Menu Listings + Optional Interactive Meal Planner) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center: Menu Cards */}
          <div className={`${plannedMeal.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-stone-900/40 rounded-2xl border border-stone-900/60 p-8">
                <Sparkle className="w-8 h-8 text-stone-600 mx-auto mb-4" />
                <p className="text-stone-300 font-sans font-medium text-sm">No dishes found matching your selection.</p>
                <p className="text-stone-500 text-xs mt-1">Try resetting search filters or checking dietary tags.</p>
                <button
                  id="reset-menu-filters"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedDiet('all');
                  }}
                  className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredItems.map((item) => {
                  const mealCount = plannedMeal.find((i) => i.item.id === item.id)?.count || 0;
                  return (
                    <div
                      key={item.id}
                      id={`menu-item-${item.id}`}
                      className="group relative bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-900 hover:border-stone-800 transition-all hover:shadow-xl hover:shadow-stone-950/20 flex flex-col h-full"
                    >
                      {/* Image container */}
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 filter contrast-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Overlay tags */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          {item.isPopular && (
                            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-amber-500 text-stone-950 font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Signature</span>
                            </span>
                          )}
                          {item.calories && (
                            <span className="inline-flex items-center space-x-0.5 px-1.5 py-1 rounded bg-stone-900/80 backdrop-blur-md text-stone-300 font-mono text-[9px]">
                              <Flame className="w-2.5 h-2.5 text-amber-500" />
                              <span>{item.calories} cal</span>
                            </span>
                          )}
                        </div>

                        {/* Individual Item Count Indicator */}
                        {mealCount > 0 && (
                          <div className={`absolute top-3 ${isAdminMode ? 'right-12' : 'right-3'} w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-stone-950 font-sans font-bold text-xs shadow-md border-2 border-stone-900 transition-all`}>
                            {mealCount}
                          </div>
                        )}

                        {/* Admin Delete Action overlay */}
                        {isAdminMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Remove custom delicacy "${item.name}" from live seasonal selection?`)) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            title="Delete Item"
                            className="absolute top-3 right-3 z-10 p-2 bg-stone-950/80 backdrop-blur-md hover:bg-rose-500 hover:text-white text-stone-300 rounded-lg border border-stone-800 transition-all cursor-pointer shadow-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Content Card Details */}
                      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-sans font-bold text-white text-base tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
                              {item.name}
                            </h3>
                            <span className="font-sans font-bold text-amber-500 text-base shrink-0">
                              ₹{item.price}
                            </span>
                          </div>
                          
                          <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        {/* Card Footer tags and Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-900">
                          {/* Diet badges */}
                          <div className="flex flex-wrap gap-1 max-w-[60%]">
                            {item.tags.map((t, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-1.5 py-0.5 rounded bg-stone-950 border border-stone-850 text-stone-400 font-sans text-[9px] font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Quick Interactive Add Meal Button */}
                          <button
                            id={`add-to-meal-btn-${item.id}`}
                            onClick={() => addToMeal(item)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-stone-950 border border-stone-850 hover:bg-stone-800 text-stone-200 hover:text-amber-500 text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span className="font-sans font-medium text-[11px]">Add to Meal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Floating / Static Column: Interactive Meal Builder (Active only if items are added) */}
          {plannedMeal.length > 0 && (
            <div className="lg:col-span-4 sticky top-24 bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5 text-amber-500" />
                  <h3 className="font-sans font-bold text-white text-base">Your Curated Meal</h3>
                </div>
                <button
                  id="clear-meal-planner"
                  onClick={clearMeal}
                  className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-850 transition-colors cursor-pointer"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Added items list */}
              <div className="divide-y divide-stone-800 max-h-[220px] overflow-y-auto my-4 pr-1 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                {plannedMeal.map(({ item, count }) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div className="space-y-0.5 max-w-[65%]">
                      <p className="font-sans font-bold text-stone-200 leading-tight">{item.name}</p>
                      <p className="text-[10px] text-stone-500">₹{item.price} each</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromMeal(item.id)}
                        className="p-1 rounded-md bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-white font-bold text-xs w-4 text-center">{count}</span>
                      <button
                        onClick={() => addToMeal(item)}
                        className="p-1 rounded-md bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Pairing note */}
              {pairingAdvice && (
                <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[11px] text-amber-400/90 leading-relaxed mb-4">
                  {pairingAdvice}
                </div>
              )}

              {/* Summary stats */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-3.5 mb-4">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Est. Preparation Time</span>
                  <span className="font-mono font-medium text-stone-200">~{mealStats.prepTimeEst} mins</span>
                </div>
                {mealStats.totalCalories > 0 && (
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Combined Calories</span>
                    <span className="font-mono font-medium text-stone-200">{mealStats.totalCalories} kcal</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2.5 border-t border-stone-850">
                  <span className="text-sm font-sans font-semibold text-white">Estimated Total</span>
                  <span className="font-sans font-black text-amber-500 text-lg">₹{mealStats.totalCost}</span>
                </div>
              </div>

              {/* Just Booked Confirmation Receipt */}
              {justBookedCurated ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-900 rounded-xl space-y-3.5 text-[11px] text-stone-300 relative animate-fadeIn mb-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold font-sans">
                    <CheckCircle className="w-4 h-4" />
                    <span>Curated Meal Booked!</span>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-normal">
                    Your dining table and curated meal pre-order have been saved successfully.
                  </p>
                  <div className="space-y-1.5 font-mono text-[10px] border-t border-stone-850 pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">RES ID:</span>
                      <span className="font-bold text-stone-200">{justBookedCurated.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">ASSIGNED TABLE:</span>
                      <span className="font-bold text-amber-500">Table {justBookedCurated.tableNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">PARTY SIZE:</span>
                      <span className="font-bold text-stone-200">{justBookedCurated.partySize} Pax</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">DATE & TIME:</span>
                      <span className="font-bold text-stone-200">{justBookedCurated.date} @ {justBookedCurated.time}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-850 pt-1.5 mt-1.5">
                      <span className="text-stone-500">BOOKING STATUS:</span>
                      <span className="font-bold text-emerald-400 uppercase">Confirmed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">ORDER STATUS:</span>
                      <span className="font-bold text-amber-500 uppercase">{justBookedCurated.orderStatus || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-850 pt-1.5 mt-1.5 font-sans">
                      <span className="text-stone-400">Cover Charge:</span>
                      <span className="text-stone-400 italic">Waived (Pre-ordered)</span>
                    </div>
                    <div className="flex justify-between font-sans">
                      <span className="text-stone-400">Curated Meal Food:</span>
                      <span className="text-stone-200">₹{justBookedCurated.orderItems?.reduce((acc, x) => acc + x.price * x.quantity, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-sans">
                      <span className="text-stone-400">Payment Mode:</span>
                      <span className="font-bold text-amber-500 uppercase">{justBookedCurated.paymentMode}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-850 pt-1.5 mt-1 font-sans">
                      <span className="text-stone-100 font-bold">Total Paid check:</span>
                      <span className="font-black text-emerald-400">₹{justBookedCurated.orderItems?.reduce((acc, x) => acc + x.price * x.quantity, 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setJustBookedCurated(null)}
                    className="w-full py-1.5 bg-stone-950 border border-stone-800 hover:bg-stone-800 text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Close Receipt
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Select Payment Mode Selector directly under meal items */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold block">
                      Select Meal Payment Mode *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Card', 'UPI', 'Cash'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setCuratedPaymentMode(mode)}
                          className={`py-1.5 px-2 text-[10px] font-mono uppercase rounded border transition-all cursor-pointer text-center ${
                            curatedPaymentMode === mode
                              ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-bold'
                              : 'bg-stone-900 border-stone-850 text-stone-500 hover:text-stone-300 hover:border-stone-800'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!showCheckoutForm ? (
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(true)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold font-sans rounded-xl cursor-pointer transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/10"
                    >
                      <span>Proceed to Booking ({curatedPaymentMode})</span>
                    </button>
                  ) : (
                    <form onSubmit={handlePlaceCuratedOrder} className="p-4 bg-stone-950 rounded-xl border border-stone-850 space-y-3.5">
                      <div className="flex justify-between items-center border-b border-stone-850 pb-2">
                        <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">Billing & Table Reservation</span>
                        <button
                          type="button"
                          onClick={() => setShowCheckoutForm(false)}
                          className="text-[9px] font-mono text-stone-500 hover:text-stone-300"
                        >
                          Cancel
                        </button>
                      </div>

                      {checkoutError && (
                        <p className="text-[10px] text-rose-400 font-medium bg-rose-500/5 p-2 rounded border border-rose-500/10">
                          {checkoutError}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="relative">
                          <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full pl-8 bg-stone-900 border border-stone-850 rounded-lg py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40"
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-stone-500 font-mono text-[10px] pointer-events-none">@</span>
                          <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full pl-8 bg-stone-900 border border-stone-850 rounded-lg py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40"
                          />
                        </div>

                        <div className="relative">
                          <Phone className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full pl-8 bg-stone-900 border border-stone-850 rounded-lg py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                            <input
                              type="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={guestDate}
                              onChange={(e) => setGuestDate(e.target.value)}
                              className="w-full pl-8 bg-stone-900 border border-stone-850 rounded-lg py-1.5 text-[11px] text-stone-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>

                          <div>
                            <select
                              value={guestTime}
                              onChange={(e) => setGuestTime(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-850 rounded-lg py-1.5 px-2 text-[11px] text-stone-200 focus:outline-none focus:border-amber-500/40 cursor-pointer"
                            >
                              {['12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-1.5 bg-stone-900 rounded-lg border border-stone-850">
                          <span className="text-[10px] text-stone-400 font-medium pl-1">Guests Size</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setGuestPartySize(Math.max(1, guestPartySize - 1))}
                              className="w-5 h-5 flex items-center justify-center bg-stone-950 border border-stone-800 text-stone-300 rounded cursor-pointer hover:bg-stone-850"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-stone-200 w-4 text-center">{guestPartySize}</span>
                            <button
                              type="button"
                              onClick={() => setGuestPartySize(Math.min(12, guestPartySize + 1))}
                              className="w-5 h-5 flex items-center justify-center bg-stone-950 border border-stone-800 text-stone-300 rounded cursor-pointer hover:bg-stone-850"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold font-sans text-xs rounded-lg transition-colors cursor-pointer shadow"
                      >
                        Confirm Booking & Pay (₹{mealStats.totalCost})
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Notice */}
              <p className="text-[9px] text-stone-500 text-center leading-normal mt-2">
                This planner lets you directly place a table reservation loaded with your custom selected dishes in your chosen payment mode. It will automatically deduct from our seasonal micro-storage.
              </p>
            </div>
          )}

        </div>

        {/* Add Menu Item Modal (Admin Mode Only) */}
        {isAdminMode && isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative animate-fadeIn">
              <div className="flex justify-between items-center border-b border-stone-800 pb-4">
                <div>
                  <h3 className="font-sans font-black text-lg text-white">Add Seasonal Delicacy</h3>
                  <p className="text-xs text-stone-500">Introduce a new micro-seasonal dish to the public dining menu selection.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-stone-400 hover:text-white text-sm font-bold font-mono p-1 bg-stone-950/60 hover:bg-stone-800 border border-stone-850 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Item Title / Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Saffron-Infused Pear Tart"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      <option value="starter">Appetizer / Starter</option>
                      <option value="main">Main Entrée</option>
                      <option value="dessert">Dessert</option>
                      <option value="drink">Beverage / Drink</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Price (INR ₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe the texture, organic ingredients, regional sourcing details, or allergen notes..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Leave blank for an elegant default placeholder image"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Estimated Calories</label>
                    <input
                      type="number"
                      min={0}
                      value={newCalories}
                      onChange={(e) => setNewCalories(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Dietary Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="Nut-Free, Vegan, Gluten-Free"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Submit Delicacy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
