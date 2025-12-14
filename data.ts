
import { MenuItem, User, Review } from './types';

export const INITIAL_USERS: User[] = [
  { id: 1, name: "System Admin", email: "admin@campus.edu", role: "admin" },
  { id: 2, name: "Head Chef", email: "chef@campus.edu", role: "kitchen" },
  { id: 3, name: "Rider Ali", email: "rider@campus.edu", role: "rider" },
  { id: 4, name: "Student Sarah", email: "student@campus.edu", role: "student", phone: "0300-1234567" }
];

export const INITIAL_REVIEWS: Review[] = [
  { id: 1, name: "Ali Khan", role: "CS Student", text: "Campus Crave saved my finals week! The route optimization is crazy accurate.", stars: 5, date: "2023-10-01" },
  { id: 2, name: "Sara Ahmed", role: "Faculty", text: "Finally, a way to order lunch without standing in lines for 20 minutes.", stars: 5, date: "2023-10-05" },
  { id: 3, name: "Bilal", role: "Rider", text: "The app makes my delivery routes so much easier. Less confusion, more tips!", stars: 4, date: "2023-10-10" },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- Desi Delights ---
  { id: 101, name: "Special Chicken Biryani", price: 350, category: "Desi Delights", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800" },
  { id: 102, name: "Chicken Pulao", price: 320, category: "Desi Delights", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800" },
  { id: 103, name: "Seekh Kabab (4 pcs)", price: 400, category: "Desi Delights", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800" },
  { id: 104, name: "Chapli Kabab", price: 150, category: "Desi Delights", image: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&q=80&w=800" },
  { id: 105, name: "Shahi Haleem", price: 250, category: "Desi Delights", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800" },
  { id: 106, name: "Chicken Karahi (Half)", price: 800, category: "Desi Delights", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800" },

  // --- Fast Food ---
  { id: 201, name: "Crispy Zinger Burger", price: 450, category: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" },
  { id: 202, name: "Club Sandwich", price: 300, category: "Fast Food", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800" },
  { id: 203, name: "Grilled Chicken Wrap", price: 350, category: "Fast Food", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=800" },
  { id: 204, name: "Loaded Cheese Fries", price: 400, category: "Fast Food", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800" },
  { id: 205, name: "Pepperoni Pizza Slice", price: 250, category: "Fast Food", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800" },
  { id: 206, name: "Jalapeno Beef Burger", price: 550, category: "Fast Food", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800" },

  // --- Italian & Chinese ---
  { id: 301, name: "Creamy Alfredo Pasta", price: 550, category: "Italian & Chinese", image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=800" },
  { id: 302, name: "Chicken Chow Mein", price: 450, category: "Italian & Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800" },
  { id: 303, name: "Spicy Meatballs Spaghetti", price: 400, category: "Italian & Chinese", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=800" },
  { id: 304, name: "Chicken Manchurian", price: 480, category: "Italian & Chinese", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800" },
  { id: 305, name: "Egg Fried Rice", price: 300, category: "Italian & Chinese", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800" },

  // --- Sips & Snacks ---
  { id: 401, name: "Masala Fries", price: 150, category: "Sips & Snacks", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800" },
  { id: 402, name: "Karak Chai", price: 80, category: "Sips & Snacks", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800" },
  { id: 403, name: "Cold Coffee", price: 250, category: "Sips & Snacks", image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800" },
  { id: 404, name: "Mint Margarita", price: 180, category: "Sips & Snacks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800" },
  { id: 405, name: "Fudge Brownie", price: 150, category: "Sips & Snacks", image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&q=80&w=800" },
  { id: 406, name: "Samosa Plate", price: 120, category: "Sips & Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800" },
];
