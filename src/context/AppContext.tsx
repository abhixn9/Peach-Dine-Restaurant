import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Reservation, Review, ContactMessage, WastageItem, User } from '../types';
import { MENU_ITEMS, DEFAULT_REVIEWS } from '../data/restaurantData';

interface AppContextType {
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  resetMenuItems: () => void;
  reservations: Reservation[];
  addReservation: (res: Reservation) => void;
  updateReservationStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
  updateOrderStatus: (id: string, status: 'Pending' | 'Preparing' | 'Completed') => void;
  deleteReservation: (id: string) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  contactMessages: ContactMessage[];
  addContactMessage: (msg: ContactMessage) => void;
  deleteContactMessage: (id: string) => void;
  wastageItems: WastageItem[];
  addWastageItem: (item: WastageItem) => void;
  deleteWastageItem: (id: string) => void;
  clearWastageItems: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  registerUser: (name: string, email: string, phone: string, dietaryPreference?: string) => { success: boolean; error?: string };
  loginUser: (emailOrPhone: string) => { success: boolean; error?: string };
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'NT-581932',
    name: 'Aarav Malhotra',
    email: 'aarav.malhotra@gmail.com',
    phone: '+91 98765 43210',
    date: '2026-06-30',
    time: '7:30 PM',
    partySize: 4,
    seatingPreference: 'window',
    specialRequests: 'Celebrating 5th anniversary. Please reserve a quiet window table.',
    status: 'confirmed',
    createdAt: '6/28/2026, 4:12 PM',
    tableNumber: 12,
    day: '30',
    month: 'June',
    orderItems: [
      { itemId: 's1', name: 'Roasted Heirloom Beet Salad', quantity: 2, price: 550 },
      { itemId: 'm1', name: '12-Hour Braised Short Rib', quantity: 2, price: 1650 }
    ]
  },
  {
    id: 'NT-248103',
    name: 'Gabriella Vance',
    email: 'gaby.v@outlook.com',
    phone: '+1 (555) 382-9482',
    date: '2026-06-30',
    time: '8:30 PM',
    partySize: 2,
    seatingPreference: 'counter',
    specialRequests: 'Would love to watch the chef prep the truffle peach carpaccio!',
    status: 'pending',
    createdAt: '6/29/2026, 11:24 AM',
    tableNumber: 22,
    day: '30',
    month: 'June',
    orderItems: [
      { itemId: 's7', name: 'Truffle Peach Carpaccio', quantity: 1, price: 520 },
      { itemId: 'm2', name: 'Wild Ramp & Chanterelle Gnocchi', quantity: 1, price: 1150 }
    ]
  },
  {
    id: 'NT-891043',
    name: 'Devika Sen',
    email: 'devika.sen@rediffmail.com',
    phone: '+91 99123 45678',
    date: '2026-07-01',
    time: '6:30 PM',
    partySize: 6,
    seatingPreference: 'outdoor',
    specialRequests: 'Need a high chair for a toddler and wheelchair accessibility.',
    status: 'confirmed',
    createdAt: '6/29/2026, 3:45 PM',
    tableNumber: 18,
    day: '01',
    month: 'July',
    orderItems: [
      { itemId: 's6', name: 'Saffron Paneer Croquettes', quantity: 3, price: 390 },
      { itemId: 'm1', name: '12-Hour Braised Short Rib', quantity: 4, price: 1650 }
    ]
  },
  {
    id: 'NT-104928',
    name: 'Marcus Brody',
    email: 'marcus@brody-design.co',
    phone: '+44 7911 123456',
    date: '2026-07-02',
    time: '9:30 PM',
    partySize: 2,
    seatingPreference: 'standard',
    status: 'cancelled',
    createdAt: '6/28/2026, 10:05 AM',
    tableNumber: 4,
    day: '02',
    month: 'July'
  },
  {
    id: 'NT-749281',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@tcs.com',
    phone: '+91 98112 23344',
    date: '2026-07-03',
    time: '7:30 PM',
    partySize: 3,
    seatingPreference: 'standard',
    specialRequests: 'One guest has severe peanut allergy.',
    status: 'pending',
    createdAt: '6/30/2026, 9:15 AM',
    tableNumber: 8,
    day: '03',
    month: 'July',
    orderItems: [
      { itemId: 's2', name: 'Crispy Oyster Mushrooms', quantity: 2, price: 480 },
      { itemId: 'm1', name: '12-Hour Braised Short Rib', quantity: 1, price: 1650 }
    ]
  }
];

const SEED_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-3921',
    name: 'Vikram Seth',
    email: 'vikram.seth@gmail.com',
    category: 'event',
    message: 'Hello, I am looking to book out the entire outdoor garden patio for a corporate sunset dinner on July 15th (around 40 guests). Could you please send me details about custom curation menus and packages?',
    date: '10:15 AM'
  },
  {
    id: 'MSG-1942',
    name: 'Linda H.',
    email: 'linda.hansen@comcast.net',
    category: 'feedback',
    message: 'We had a wonderful dining experience yesterday! The saffron paneer croquettes were spectacular, but we noticed the background music was a bit too upbeat. Overall, loved the artistic layout and the warm service!',
    date: 'Yesterday'
  },
  {
    id: 'MSG-8841',
    name: 'Karthik Rao',
    email: 'karthik.rao@gmail.com',
    category: 'general',
    message: 'Are you guys pet friendly on the outdoor garden patio? Hoping to bring my Golden Retriever along for weekend brunch.',
    date: 'Yesterday'
  }
];

const SEED_WASTAGE: WastageItem[] = [
  {
    id: 'WST-101',
    menuItemId: 's1',
    menuItemName: 'Roasted Heirloom Beet Salad',
    quantity: 3,
    reason: 'Overprepared during lunch shift',
    lossAmount: 1650,
    day: '29',
    month: 'June',
    dateString: '29 June',
    createdAt: '6/29/2026, 3:15 PM'
  },
  {
    id: 'WST-102',
    menuItemId: 'm1',
    menuItemName: '12-Hour Braised Short Rib',
    quantity: 1,
    reason: 'Spoiled due to cold room refrigerator spike',
    lossAmount: 1650,
    day: '30',
    month: 'June',
    dateString: '30 June',
    createdAt: '6/30/2026, 9:30 AM'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  // Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('peach_dine_admin_mode');
    return saved === 'true';
  });

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('peach_dine_menu_items');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        return items.map((item: MenuItem) => ({
          ...item,
          storage: typeof item.storage === 'number' ? item.storage : Math.floor(Math.random() * 61) + 40
        }));
      } catch (e) {
        console.error('Error parsing menu items, reverting to default', e);
      }
    }
    return MENU_ITEMS.map((item) => ({
      ...item,
      storage: typeof item.storage === 'number' ? item.storage : Math.floor(Math.random() * 61) + 40
    }));
  });

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('nectar_thyme_reservations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing reservations', e);
      }
    }
    return SEED_RESERVATIONS;
  });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('nectar_thyme_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing reviews', e);
      }
    }
    return DEFAULT_REVIEWS;
  });

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('nectar_thyme_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing messages', e);
      }
    }
    return SEED_MESSAGES;
  });

  // Wastage state
  const [wastageItems, setWastageItems] = useState<WastageItem[]>(() => {
    const saved = localStorage.getItem('peach_dine_wastage_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing wastage items', e);
      }
    }
    return SEED_WASTAGE;
  });

  // User accounts state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('peach_dine_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing users', e);
      }
    }
    return [
      { id: 'u1', name: 'Aarav Malhotra', email: 'aarav.malhotra@gmail.com', phone: '+91 98765 43210', dietaryPreference: 'Vegetarian', createdAt: '2026-06-28' },
      { id: 'u2', name: 'Gabriella Vance', email: 'gaby.v@outlook.com', phone: '+1 (555) 382-9482', dietaryPreference: 'None', createdAt: '2026-06-29' },
      { id: 'u3', name: 'Devika Sen', email: 'devika.sen@rediffmail.com', phone: '+91 99123 45678', dietaryPreference: 'Nut-Free', createdAt: '2026-06-29' },
      { id: 'u4', name: 'Marcus Brody', email: 'marcus@brody-design.co', phone: '+44 7911 123456', dietaryPreference: 'None', createdAt: '2026-06-28' },
      { id: 'u5', name: 'Rohan Deshmukh', email: 'rohan.d@tcs.com', phone: '+91 98112 23344', dietaryPreference: 'Nut-Free', createdAt: '2026-06-30' }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('peach_dine_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing current user', e);
      }
    }
    return null;
  });

  // Persist Users and Current User
  useEffect(() => {
    localStorage.setItem('peach_dine_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('peach_dine_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('peach_dine_current_user');
    }
  }, [currentUser]);

  const registerUser = (name: string, email: string, phone: string, dietaryPreference?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim().replace(/\s+/g, '').replace(/[-()+]/g, '');

    // Check if email already used
    const emailExists = users.some(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (emailExists) {
      return { success: false, error: 'This email address is already associated with an active account.' };
    }

    // Check if phone already used (compare digits/normalized characters)
    const phoneExists = users.some(u => u.phone.trim().replace(/\s+/g, '').replace(/[-()+]/g, '') === normalizedPhone);
    if (phoneExists) {
      return { success: false, error: 'This phone number is already associated with an active account.' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dietaryPreference: dietaryPreference?.trim() || 'None',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const loginUser = (emailOrPhone: string) => {
    const term = emailOrPhone.trim().toLowerCase();
    const termCleaned = emailOrPhone.trim().replace(/\s+/g, '').replace(/[-()+]/g, '');

    const found = users.find(u => 
      u.email.trim().toLowerCase() === term || 
      u.phone.trim().replace(/\s+/g, '').replace(/[-()+]/g, '') === termCleaned
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    } else {
      return { success: false, error: 'Account not found. Please register with your details.' };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Persist Admin Mode
  useEffect(() => {
    localStorage.setItem('peach_dine_admin_mode', String(isAdminMode));
  }, [isAdminMode]);

  // Persist Menu Items
  useEffect(() => {
    localStorage.setItem('peach_dine_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  // Persist Reservations
  useEffect(() => {
    localStorage.setItem('nectar_thyme_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Persist Reviews
  useEffect(() => {
    localStorage.setItem('nectar_thyme_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Persist Contact Messages
  useEffect(() => {
    localStorage.setItem('nectar_thyme_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Persist Wastage items
  useEffect(() => {
    localStorage.setItem('peach_dine_wastage_items', JSON.stringify(wastageItems));
  }, [wastageItems]);

  // Menu Handlers
  const addMenuItem = (item: MenuItem) => {
    const withStorage = {
      ...item,
      storage: typeof item.storage === 'number' ? item.storage : 50
    };
    setMenuItems((prev) => [withStorage, ...prev]);
  };

  const updateMenuItem = (id: string, updated: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetMenuItems = () => {
    setMenuItems(MENU_ITEMS.map(item => ({
      ...item,
      storage: 50
    })));
  };

  // Reservation Handlers
  const addReservation = (res: Reservation) => {
    setReservations((prev) => [res, ...prev]);

    // Automatically deduct storage quantities when a reservation with pre-order items is successfully created!
    if (res.orderItems && res.orderItems.length > 0) {
      setMenuItems((prevMenu) =>
        prevMenu.map((item) => {
          const ordered = res.orderItems?.find((oi) => oi.itemId === item.id);
          if (ordered) {
            const currentStorage = item.storage ?? 50;
            return {
              ...item,
              storage: Math.max(0, currentStorage - ordered.quantity)
            };
          }
          return item;
        })
      );
    }
  };

  const updateReservationStatus = (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const updateOrderStatus = (id: string, status: 'Pending' | 'Preparing' | 'Completed') => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, orderStatus: status } : r))
    );
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  // Review Handlers
  const addReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Contact Message Handlers
  const addContactMessage = (msg: ContactMessage) => {
    setContactMessages((prev) => [msg, ...prev]);
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Wastage Handlers
  const addWastageItem = (item: WastageItem) => {
    setWastageItems((prev) => [item, ...prev]);

    // Optionally deduct wastage item from storage too!
    setMenuItems((prevMenu) =>
      prevMenu.map((m) => {
        if (m.id === item.menuItemId) {
          const currentStorage = m.storage ?? 50;
          return {
            ...m,
            storage: Math.max(0, currentStorage - item.quantity)
          };
        }
        return m;
      })
    );
  };

  const deleteWastageItem = (id: string) => {
    setWastageItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWastageItems = () => {
    setWastageItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        resetMenuItems,
        reservations,
        addReservation,
        updateReservationStatus,
        updateOrderStatus,
        deleteReservation,
        reviews,
        addReview,
        deleteReview,
        contactMessages,
        addContactMessage,
        deleteContactMessage,
        wastageItems,
        addWastageItem,
        deleteWastageItem,
        clearWastageItems,
        currentUser,
        setCurrentUser,
        users,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
