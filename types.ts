
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'kitchen' | 'rider' | 'student';
  phone?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  qty?: number;
}

export interface Order {
  id: string;
  studentId: number;
  studentName: string;
  studentPhone: string;
  items: MenuItem[];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'OUT' | 'DELIVERED' | 'CANCELLED';
  location: string;
  date: string;
  time: string;
  isReviewed?: boolean; // Track if the student has reviewed this order
}

export interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  stars: number;
  date?: string;
}
