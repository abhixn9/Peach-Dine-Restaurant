export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert' | 'drink';
  image: string;
  tags: string[];
  isPopular?: boolean;
  calories?: number;
  storage?: number; // Stock level quantity
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  seatingPreference: 'standard' | 'window' | 'outdoor' | 'counter';
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  tableNumber?: number; // Table assigned to this reservation
  orderItems?: OrderItem[]; // Pre-ordered food items
  paymentMode?: string; // e.g. "Card", "UPI", "Cash"
  orderStatus?: 'Pending' | 'Preparing' | 'Completed'; // Incoming order status
  day?: string; // Day of booking (e.g. "30")
  month?: string; // Month of booking (e.g. "June")
}

export interface WastageItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  reason: string;
  lossAmount: number;
  day: string; // e.g. "30"
  month: string; // e.g. "June"
  dateString: string; // e.g. "30 June"
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  photo?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: 'general' | 'reservation' | 'event' | 'feedback';
  message: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dietaryPreference?: string;
  createdAt: string;
}

