
import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Truck, ChefHat, LogOut, MapPin, Clock, DollarSign, 
  Plus, Minus, CheckCircle, BarChart3, Users, Package, Sparkles, Bot, 
  Loader2, Navigation, ArrowRight, Phone, RefreshCw, AlertCircle, 
  Trash2, LayoutDashboard, Utensils, Home, ListOrdered, History, TrendingUp, X, Edit2, Star
} from 'lucide-react';
import { User as UserType, Order, MenuItem, Review } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_USERS } from '../data';

// --- LOGIC: DISTANCE MAP FOR ROUTE OPTIMIZATION ---
// Defined sequence: Lower is closer to start point (Cafeteria)
const LOCATION_SEQUENCE: Record<string, number> = {
  "Main Cafeteria": 0,
  "Admin Block": 1,       
  "CS Dept Block B": 2,   
  "Girls Hostel 1": 3,    
  "Boys Hostel 2": 4,    
  "Library Main Gate": 5 
};

// --- SIMULATED AI ENGINE ---
const simulateAIResponse = async (prompt: string, locations: string[] = []): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. RIDER ROUTE OPTIMIZATION
      if (prompt.includes("Sort these campus locations")) {
        if (locations.length > 0) {
          const locationCounts = locations.reduce((acc: any, loc) => { acc[loc] = (acc[loc] || 0) + 1; return acc; }, {});
          const uniqueLocs = Object.keys(locationCounts);
          
          // STRICT SORTING based on defined sequence
          uniqueLocs.sort((a, b) => {
             const distA = LOCATION_SEQUENCE[a] !== undefined ? LOCATION_SEQUENCE[a] : 99;
             const distB = LOCATION_SEQUENCE[b] !== undefined ? LOCATION_SEQUENCE[b] : 99;
             return distA - distB;
          });

          const path = uniqueLocs.map(loc => {
             const count = locationCounts[loc];
             return count > 1 ? `${loc} (${count})` : loc;
          });

          resolve("Cafeteria -> " + path.join(" -> "));
        } else {
          resolve("Cafeteria -> Admin Block -> Library -> Hostels"); 
        }
      }
      // 2. CRAVEBOT RECOMMENDATION
      else {
        const recommendations = [
          "I'd recommend the *Zinger Burger*! It's crispy, filling, and perfect for a quick lunch. 🍔",
          "How about *Chicken Biryani*? It's our bestseller and super spicy! 🥘",
          "You should try the *Club Sandwich*. It's light but keeps you full during classes. 🥪",
          "Go for *Masala Fries* and *Chai*! The ultimate campus comfort food combo. ☕🍟"
        ];
        resolve(recommendations[Math.floor(Math.random() * recommendations.length)]);
      }
    }, 1500); 
  });
};

interface DashboardProps {
  onBackToHome: () => void;
}

export default function Dashboard({ onBackToHome }: DashboardProps) {
  // --- SYNCED STATE (LocalStorage) ---
  const [users, setUsers] = useState<UserType[]>(() => {
    const saved = localStorage.getItem('cc_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cc_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // START WITH ZERO ORDERS
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cc_orders');
    return saved ? JSON.parse(saved) : []; 
  });

  // START WITH ZERO REVIEWS
  const [reviews, setReviews] = useState<Review[]>(() => {
      const saved = localStorage.getItem('cc_reviews');
      return saved ? JSON.parse(saved) : [];
  });

  // START WITH ZERO REVENUE
  const [weeklyRevenue, setWeeklyRevenue] = useState(() => {
    const saved = localStorage.getItem('cc_revenue');
    return saved ? JSON.parse(saved) : 0;
  });

  // Initialize currentUser from URL params to support multiple tabs
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        if (email) {
            const saved = localStorage.getItem('cc_users');
            const allUsers = saved ? JSON.parse(saved) : INITIAL_USERS;
            return allUsers.find((u: UserType) => u.email === email) || null;
        }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('student'); 
  const [loginError, setLoginError] = useState(""); 
  const [cart, setCart] = useState<MenuItem[]>([]);

  // --- EFFECT: SYNC DATA ACROSS TABS ---
  useEffect(() => { localStorage.setItem('cc_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('cc_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('cc_revenue', JSON.stringify(weeklyRevenue)); }, [weeklyRevenue]);
  useEffect(() => { localStorage.setItem('cc_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cc_reviews', JSON.stringify(reviews)); }, [reviews]);

  // Tab Listener for real-time updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cc_orders' && e.newValue) setOrders(JSON.parse(e.newValue));
        if (e.key === 'cc_menu' && e.newValue) setMenu(JSON.parse(e.newValue));
        if (e.key === 'cc_revenue' && e.newValue) setWeeklyRevenue(JSON.parse(e.newValue));
        if (e.key === 'cc_users' && e.newValue) setUsers(JSON.parse(e.newValue));
        if (e.key === 'cc_reviews' && e.newValue) setReviews(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (email: string, password: string) => {
    setLoginError("");
    const user = users.find(u => u.email === email);
    if (!user) { setLoginError("⚠ Account not found. Please check your email."); return; }
    if (password !== "pass123") { setLoginError("⚠ Incorrect password. Please try again."); return; } // Simplified auth
    if (user.role !== activeTab) { setLoginError(`⚠ Access Denied. This account is for ${user.role.toUpperCase()}.`); return; }
    
    // Open Dashboard in a new tab
    const url = new URL(window.location.href);
    url.searchParams.set('email', email);
    // Ensure view param is set
    if (!url.searchParams.get('view')) url.searchParams.set('view', 'app');
    window.open(url.toString(), '_blank');
  };

  const handleSignup = (name: string, email: string, password: string, phone: string) => {
    const newUser: UserType = { id: users.length + 1, name, email, role: 'student', phone };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('cc_users', JSON.stringify(updatedUsers));
    
    // Automatically log in (open in new tab)
    const url = new URL(window.location.href);
    url.searchParams.set('email', newUser.email);
    if (!url.searchParams.get('view')) url.searchParams.set('view', 'app');
    window.open(url.toString(), '_blank');
  };

  const logout = () => { 
      setCurrentUser(null); 
      setCart([]); 
      setLoginError(""); 
      // Remove email param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('email');
      window.history.pushState({}, '', url);
  };

  // Safe State Update function for orders
  const safeUpdateStatus = (id: string, status: Order['status']) => {
      setOrders(prevOrders => prevOrders.map(o => o.id === id ? { ...o, status } : o));
      if (status === 'DELIVERED') {
          const order = orders.find(o => o.id === id);
          if (order) setWeeklyRevenue((prev: number) => prev + order.total);
      }
  };

  // Modify Order Logic: Loads items to cart and removes the pending order
  const handleModifyOrder = (orderId: string, items: MenuItem[]) => {
      if (cart.length > 0) {
          if (!window.confirm("Your cart currently has items. Modifying this order will overwrite your current cart. Continue?")) return;
      }
      setCart(items);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      alert("Order loaded into cart for modification.");
  };

  const handleSubmitReview = (orderId: string, rating: number, text: string) => {
      const order = orders.find(o => o.id === orderId);
      if(!order) return;

      const newReview: Review = {
          id: Date.now(),
          name: order.studentName,
          role: "Student",
          text: text,
          stars: rating,
          date: new Date().toISOString().split('T')[0]
      };

      setReviews([newReview, ...reviews]);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isReviewed: true } : o));
  };

  // --- LOGIN SCREEN ---
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
        {/* Left Half - Branding */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#ea580c] to-[#c2410c] relative flex-col justify-between p-16 text-white">
          <button onClick={onBackToHome} className="absolute top-8 left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors z-20 font-medium hover:translate-x-1 duration-300">
            <Home size={20}/> Back to Home
          </button>
          <div className="relative z-10 mt-20">
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight drop-shadow-sm flex items-center gap-4">
                <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain drop-shadow-lg" onError={(e) => e.currentTarget.style.display = 'none'} />
                Campus Crave
            </h1>
            <div className="border-l-4 border-yellow-400 pl-6 py-2">
              <p className="text-2xl font-medium text-white opacity-95 tracking-wide">Food Delivery System</p>
            </div>
          </div>
          <div className="relative z-10 space-y-5 mb-10">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 transition-transform hover:scale-[1.02]">
              <div className="bg-white/20 p-2.5 rounded-xl"><Sparkles size={28} className="text-yellow-300" /></div>
              <div><p className="font-bold text-lg">AI Food Concierge</p><p className="text-sm text-orange-100">Get smart meal suggestions</p></div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 transition-transform hover:scale-[1.02]">
              <div className="bg-white/20 p-2.5 rounded-xl"><MapPin size={28} /></div>
              <div><p className="font-bold text-lg">Live Tracking</p><p className="text-sm text-orange-100">Know exactly where your food is</p></div>
            </div>
          </div>
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>

        {/* Right Half - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white h-full overflow-y-auto relative">
           <button onClick={onBackToHome} className="lg:hidden absolute top-4 left-4 flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"><Home size={20}/> Home</button>
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-orange-50 text-[#ea580c] mb-6 shadow-sm border border-orange-100">
                <User size={40} />
              </div>
              {/* Reduced font size for Welcome */}
              <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              <p className="text-gray-500 mt-2">Sign in to your dashboard</p>
            </div>

            <div className="grid grid-cols-4 gap-2 p-1.5 bg-gray-50 rounded-xl mb-8 border border-gray-100">
              {['student', 'kitchen', 'rider', 'admin'].map((role) => (
                <button key={role} onClick={() => { setActiveTab(role); setLoginError(""); }}
                  className={`py-3 text-sm font-bold rounded-lg capitalize transition-all tracking-wide ${activeTab === role ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                  {role === 'student' ? 'Customer' : role}
                </button>
              ))}
            </div>
            
            <LoginForm role={activeTab} onLogin={handleLogin} onSignup={handleSignup} error={loginError} />
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD LAYOUT ---
  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 lg:px-8 py-4 flex justify-between items-center shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-3">
          <button onClick={onBackToHome} className="p-2.5 rounded-full hover:bg-orange-50 text-gray-500 hover:text-[#ea580c] transition-colors flex items-center justify-center border border-transparent hover:border-orange-100" title="Back to Landing Page">
            <Home size={20}/>
          </button>
          <div className={`p-2 rounded-xl text-white shadow-md shadow-orange-200 ${currentUser.role === 'admin' ? 'bg-purple-600' : currentUser.role === 'rider' ? 'bg-blue-600' : currentUser.role === 'kitchen' ? 'bg-green-600' : 'bg-[#ea580c]'}`}>
            {currentUser.role === 'student' && <User size={20} />}
            {currentUser.role === 'kitchen' && <ChefHat size={20} />}
            {currentUser.role === 'rider' && <Truck size={20} />}
            {currentUser.role === 'admin' && <BarChart3 size={20} />}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-gray-800 leading-none hidden sm:block">Campus Crave</h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${currentUser.role === 'admin' ? 'text-purple-600' : currentUser.role === 'kitchen' ? 'text-green-600' : currentUser.role === 'rider' ? 'text-blue-600' : 'text-[#ea580c]'}`}>
              {currentUser.role === 'student' ? 'Customer' : currentUser.role} Portal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
          <button onClick={logout} className="bg-gray-100 p-2.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="p-4 lg:p-8 w-full max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentUser.role === 'student' && (
          <StudentDashboard 
            user={currentUser} 
            menu={menu} 
            cart={cart} 
            setCart={setCart} 
            placeOrder={(order: Order) => setOrders(prev => [order, ...prev])} 
            myOrders={orders.filter(o => o.studentId === currentUser.id)} 
            updateStatus={safeUpdateStatus}
            submitReview={handleSubmitReview}
            onModifyOrder={handleModifyOrder}
          />
        )}
        {currentUser.role === 'kitchen' && (
            <KitchenDashboard 
                orders={orders} 
                updateStatus={safeUpdateStatus} 
            />
        )}
        {currentUser.role === 'rider' && (
            <RiderDashboard 
                orders={orders} 
                updateStatus={safeUpdateStatus} 
            />
        )}
        {currentUser.role === 'admin' && (
            <AdminDashboard 
                orders={orders} 
                users={users} 
                weeklyRevenue={weeklyRevenue} 
                resetRevenue={() => setWeeklyRevenue(0)} 
                menu={menu} 
                setMenu={setMenu} 
            />
        )}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB COMPONENTS
// ----------------------------------------------------------------------

function LoginForm({ role, onLogin, onSignup, error }: any) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) onSignup(formData.name, formData.email, formData.password, formData.phone);
    else onLogin(formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-sm text-red-700 flex items-start gap-2 animate-in fade-in slide-in-from-top-1"><AlertCircle size={16} className="mt-0.5 shrink-0" /> <p>{error}</p></div>}
      {isSignup && (
        <>
          <div><label className="block text-base font-bold text-gray-600 uppercase mb-2">Full Name</label><input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-lg focus:ring-2 focus:ring-[#ea580c] outline-none transition-all shadow-sm" placeholder="e.g. Ali Khan" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="block text-base font-bold text-gray-600 uppercase mb-2">Phone Number</label><input type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-lg focus:ring-2 focus:ring-[#ea580c] outline-none transition-all shadow-sm" placeholder="0300-1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
        </>
      )}
      <div><label className="block text-base font-bold text-gray-600 uppercase mb-2">Email Address</label><input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-lg focus:ring-2 focus:ring-[#ea580c] outline-none transition-all shadow-sm" placeholder={`${role}@campus.edu`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
      <div><label className="block text-base font-bold text-gray-600 uppercase mb-2">Password</label><input type="password" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-lg focus:ring-2 focus:ring-[#ea580c] outline-none transition-all shadow-sm" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
      
      <button type="submit" className="w-full py-5 px-6 rounded-2xl shadow-xl shadow-orange-100 text-lg font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] transition-transform hover:scale-[1.01]">
        {isSignup ? 'Create Account' : 'Sign In'}
      </button>
      {role === 'student' && <div className="text-center pt-2"><button type="button" onClick={() => setIsSignup(!isSignup)} className="text-sm text-[#ea580c] hover:text-[#c2410c] font-bold">{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</button></div>}
      {role !== 'student' && <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3 leading-relaxed mt-4 border border-blue-100"><AlertCircle size={16} className="mt-0.5 shrink-0"/> <span>Staff accounts are provisioned by the Administration. Contact IT if you lost credentials.</span></div>}
    </form>
  );
}

// --- STUDENT DASHBOARD ---
function StudentDashboard({ user, menu, cart, setCart, placeOrder, myOrders, updateStatus, submitReview, onModifyOrder }: any) {
  const [reviewModal, setReviewModal] = useState<{open: boolean, orderId: string | null}>({open: false, orderId: null});
  const [reviewForm, setReviewForm] = useState({rating: 5, text: ''});

  const groupedMenu = menu.reduce((acc: any, item: MenuItem) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const addToCart = (item: MenuItem) => {
    const existing = cart.find((i: MenuItem) => i.id === item.id);
    setCart(existing ? cart.map((i: MenuItem) => i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i) : [...cart, { ...item, qty: 1 }]);
  };
  
  const updateQty = (itemId: number, change: number) => {
      setCart((prev: MenuItem[]) => prev.map((item: MenuItem) => {
          if (item.id === itemId) {
              const newQty = (item.qty || 1) + change;
              return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
      }).filter(Boolean) as MenuItem[]);
  };

  const removeFromCart = (itemId: number) => {
      setCart((prev: MenuItem[]) => prev.filter((item: MenuItem) => item.id !== itemId));
  };

  const locations = ["Library Main Gate", "CS Dept Block B", "Girls Hostel 1", "Boys Hostel 2", "Admin Block", "Main Cafeteria"];
  const [selectedLoc, setSelectedLoc] = useState(locations[0]);
  const [checkoutPhone, setCheckoutPhone] = useState(user.phone || "");

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!checkoutPhone) { alert("Please enter phone number for rider"); return; }
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      studentId: user.id,
      studentName: user.name,
      studentPhone: checkoutPhone,
      items: cart,
      total: cart.reduce((acc: number, item: MenuItem) => acc + (item.price * (item.qty || 1)), 0),
      status: 'PENDING',
      location: selectedLoc,
      date: 'today',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    placeOrder(newOrder);
    setCart([]);
    alert("Order Placed! Check 'My Orders' for updates.");
  };

  const handleCancelOrder = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      if(window.confirm("Are you sure you want to cancel this order?")) {
        updateStatus(id, 'CANCELLED');
      }
  };

  const handleReviewSubmit = () => {
      if(!reviewModal.orderId) return;
      if(!reviewForm.text.trim()) return alert("Please write a review.");
      
      submitReview(reviewModal.orderId, reviewForm.rating, reviewForm.text);
      setReviewModal({open: false, orderId: null});
      setReviewForm({rating: 5, text: ''});
      alert("Thanks for your review!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full relative">
      {/* Review Modal */}
      {reviewModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Rate your Meal</h3>
                      <button onClick={() => setReviewModal({open: false, orderId: null})} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                  </div>
                  <div className="flex justify-center gap-2 mb-6">
                      {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className="transition-transform hover:scale-110">
                              <Star size={32} className={`${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                      ))}
                  </div>
                  <textarea 
                      className="w-full border border-gray-200 rounded-xl p-4 text-sm mb-6 focus:ring-2 focus:ring-orange-500 outline-none resize-none bg-gray-50" 
                      rows={4} 
                      placeholder="How was the food? Tell us about it..."
                      value={reviewForm.text}
                      onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                  />
                  <button onClick={handleReviewSubmit} className="w-full bg-[#ea580c] text-white py-3 rounded-xl font-bold hover:bg-[#c2410c] shadow-lg shadow-orange-200">Submit Review</button>
              </div>
          </div>
      )}

      <div className="flex-1 space-y-8 w-full">
        <CraveBot menu={menu} />
        {Object.keys(groupedMenu).map(category => (
          <div key={category} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-orange-100 p-2 rounded-lg text-[#ea580c]">{category === 'Desi Delights' ? '🥘' : category === 'Fast Food' ? '🍔' : '🥤'}</span> {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupedMenu[category].map((item: MenuItem) => (
                <div key={item.id} className="group bg-gray-50 hover:bg-white p-4 rounded-xl border border-transparent hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1" onClick={() => addToCart(item)}>
                  <div className="h-40 mb-4 overflow-hidden rounded-lg relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
                  </div>
                  <div className="flex justify-between items-start mt-auto">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                        <p className="text-[#ea580c] font-bold mt-1">PKR {item.price}</p>
                      </div>
                      <button className="bg-white text-gray-800 p-2 rounded-full shadow-sm hover:bg-[#ea580c] hover:text-white transition-colors border"><Plus size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full lg:w-96 space-y-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag className="text-[#ea580c]" /> Your Cart</h3>
          {cart.length === 0 ? <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">Cart is empty</div> : 
            <div className="space-y-4">
              {cart.map((item: MenuItem) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white rounded border border-gray-200">
                        <button onClick={(e) => {e.stopPropagation(); updateQty(item.id, -1)}} className="px-2 py-1 text-gray-500 hover:bg-gray-100"><Minus size={10}/></button>
                        <span className="px-2 text-xs font-bold">{item.qty}</span>
                        <button onClick={(e) => {e.stopPropagation(); updateQty(item.id, 1)}} className="px-2 py-1 text-gray-500 hover:bg-gray-100"><Plus size={10}/></button>
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{(item.qty||1) * item.price}</span>
                    <button onClick={(e)=>{e.stopPropagation(); removeFromCart(item.id)}} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                  </div>
                </div>
              ))}
              <div className="space-y-3 pt-4 border-t">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Location</label><select className="w-full p-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] outline-none" value={selectedLoc} onChange={e => setSelectedLoc(e.target.value)}>{locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Phone</label><input type="tel" className="w-full p-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] outline-none" value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value)} placeholder="For rider to contact" /></div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2"><span>Total</span><span>PKR {cart.reduce((acc, item) => acc + (item.price * (item.qty||1)), 0)}</span></div>
                <button onClick={handleCheckout} className="w-full py-3.5 bg-[#ea580c] text-white rounded-xl font-bold hover:bg-[#c2410c] shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]">Confirm Order</button>
              </div>
            </div>
          }
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={18}/> Recent Orders</h3>
          <div className="space-y-3">
            {myOrders.length === 0 ? <p className="text-sm text-gray-400 italic">No history.</p> : myOrders.map((o: Order) => (
              <div key={o.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between mb-2"><span className="font-bold text-xs text-gray-500">#{o.id}</span><StatusBadge status={o.status} /></div>
                <p className="text-sm font-medium mb-1">{o.items.map(i => i.name).join(', ')}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {o.location}</p>
                
                {o.status === 'PENDING' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onModifyOrder(o.id, o.items); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"><Edit2 size={12}/> Modify</button>
                        <button type="button" onClick={(e) => handleCancelOrder(e, o.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-100 flex items-center justify-center gap-1 transition-colors z-10 cursor-pointer"><X size={12}/> Cancel</button>
                    </div>
                )}
                {o.status === 'DELIVERED' && !o.isReviewed && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => setReviewModal({open: true, orderId: o.id})} className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-100 border border-yellow-100 flex items-center justify-center gap-1 transition-colors"><Star size={12}/> Rate & Review</button>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- KITCHEN DASHBOARD ---
function KitchenDashboard({ orders, updateStatus }: any) {
  const activeOrders = orders.filter((o: Order) => ['PENDING', 'PREPARING'].includes(o.status));
  const completedOrders = orders.filter((o: Order) => ['READY', 'OUT', 'DELIVERED'].includes(o.status));
  
  const pendingCount = orders.filter((o: Order) => o.status === 'PENDING').length;
  const preparingCount = orders.filter((o: Order) => o.status === 'PREPARING').length;

  // Items to prepare summary
  const itemSummary: Record<string, number> = {};
  activeOrders.forEach((order: Order) => {
      order.items.forEach(item => { itemSummary[item.name] = (itemSummary[item.name] || 0) + (item.qty || 1); });
  });

  return (
    <div className="w-full">
      {/* NEW KITCHEN HEADER BANNER */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl"><ChefHat size={32} className="text-white"/></div>
              <div>
                  <h2 className="text-3xl font-bold">Kitchen Dashboard</h2>
                  <p className="text-orange-100 text-sm">Manage orders & preparation</p>
              </div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
              <div className="bg-white/10 px-6 py-3 rounded-xl text-center backdrop-blur-sm border border-white/10">
                  <p className="text-xs font-bold text-orange-100 uppercase tracking-wider">Pending</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-xl text-center backdrop-blur-sm border border-white/10">
                  <p className="text-xs font-bold text-orange-100 uppercase tracking-wider">Cooking</p>
                  <p className="text-3xl font-bold">{preparingCount}</p>
              </div>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
         {/* MAIN CONTENT: ORDERS (Left) */}
         <div className="lg:col-span-3 space-y-8">
             {/* ORDERS GRID */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {activeOrders.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <Utensils size={48} className="text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500 font-medium">No active orders</p>
                    </div>
                 ) : activeOrders.map((order: Order) => (
                    <div key={order.id} className={`bg-white rounded-2xl shadow-md overflow-hidden border-l-8 ${order.status === 'PENDING' ? 'border-red-500' : 'border-yellow-500'}`}>
                        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div><h4 className="font-bold text-lg text-gray-800">#{order.id.split('-')[1]}</h4><span className="text-xs text-gray-500">{order.time}</span></div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === 'PENDING' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                        </div>
                        <div className="p-5 space-y-2">
                             {order.items.map((item, i) => (
                                 <div key={i} className="flex justify-between font-medium text-gray-700">
                                     <span>{item.name}</span>
                                     <span className="font-bold">x{item.qty}</span>
                                 </div>
                             ))}
                        </div>
                        <div className="p-4 bg-gray-50">
                             {order.status === 'PENDING' ? (
                                <button onClick={() => updateStatus(order.id, 'PREPARING')} className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">Start Cooking</button>
                             ) : (
                                <button onClick={() => updateStatus(order.id, 'READY')} className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Mark Ready</button>
                             )}
                        </div>
                    </div>
                 ))}
             </div>

             {/* COMPLETED HISTORY */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-gray-800 flex items-center gap-2"><History size={20} className="text-gray-400"/> Order History</h3></div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Time</th><th className="p-4">Items</th><th className="p-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {completedOrders.slice(0,5).map((o: Order) => (
                            <tr key={o.id}>
                                <td className="p-4 font-bold text-gray-700">#{o.id}</td>
                                <td className="p-4 text-xs text-gray-500">{o.time}</td>
                                <td className="p-4 text-sm truncate max-w-xs">{o.items.map(i=>i.name).join(', ')}</td>
                                <td className="p-4"><StatusBadge status={o.status}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         </div>

         {/* SIDEBAR: ITEMS TO PREPARE (Right) */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ListOrdered size={20} className="text-[#ea580c]"/> Items to Prepare</h3>
                <div className="space-y-3">
                    {Object.entries(itemSummary).length === 0 ? <span className="text-gray-400 italic text-sm">No pending items.</span> : 
                    Object.entries(itemSummary).map(([name, count]) => (
                        <div key={name} className="flex justify-between items-center p-3 bg-orange-50 border border-orange-100 rounded-xl">
                            <span className="font-medium text-gray-700 text-sm truncate max-w-[120px]">{name}</span>
                            <span className="font-bold text-[#ea580c] text-lg bg-white px-2 rounded-lg shadow-sm">{count}x</span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// --- RIDER DASHBOARD ---
function RiderDashboard({ orders, updateStatus }: any) {
  const availableJobs = orders.filter((o: Order) => o.status === 'READY');
  const myJobs = orders.filter((o: Order) => o.status === 'OUT');
  const deliveredJobs = orders.filter((o: Order) => o.status === 'DELIVERED');
  const [route, setRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const optimizeRoute = async () => {
    if(myJobs.length < 2) return alert("⚠ Please accept at least 2 jobs to optimize route! Currently accepted: " + myJobs.length);
    setLoading(true);
    const currentLocations = myJobs.map((job: Order) => job.location);
    const text = await simulateAIResponse("Sort these campus locations", currentLocations);
    setRoute(text);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-8">
      {/* AI Route Optimizer */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div><h2 className="text-2xl font-bold flex items-center gap-2"><Navigation className="text-yellow-400"/> Smart Route Optimizer</h2><p className="text-blue-100">AI-powered path planning</p></div>
          <button onClick={optimizeRoute} disabled={loading} className="bg-white text-indigo-900 px-5 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
            {loading && <Loader2 className="animate-spin" size={16}/>} Optimize Path
          </button>
        </div>
        {route ? (
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 flex flex-wrap items-center gap-3 animate-in fade-in relative">
            <button onClick={() => setRoute(null)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 text-blue-200 hover:text-white transition-colors" title="Clear Route">
                <X size={16}/>
            </button>
            <span className="bg-blue-900 px-3 py-1 rounded-lg text-sm font-bold">🏠 Start</span>
            {route.split('->').map((loc, i) => (
              <React.Fragment key={i}>
                <ArrowRight size={16} className="text-yellow-400"/>
                <span className="bg-white text-blue-900 px-3 py-1 rounded-lg text-sm font-bold shadow-sm">{loc.trim()}</span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="h-16 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-blue-200">
            Accept 2+ jobs & click Optimize to see the magic path!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Truck className="text-blue-600"/> My Active Run ({myJobs.length})</h3>
          {myJobs.length === 0 ? <p className="text-gray-400 italic p-6 bg-white rounded-2xl border border-gray-200 border-dashed text-center">No deliveries in progress. Pick up jobs from the list.</p> : myJobs.map((order: Order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-600 transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-start mb-3"><div><h4 className="font-bold text-lg">#{order.id}</h4><p className="text-sm text-gray-500">{order.studentName}</p></div><a href={`tel:${order.studentPhone}`} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-200"><Phone size={12} /> Call</a></div>
              <div className="bg-gray-50 p-3 rounded-xl mb-4"><p className="text-sm text-gray-600 flex items-center gap-2 mb-1"><MapPin size={16} className="text-red-500"/> <strong>{order.location}</strong></p><p className="text-xs text-gray-500 ml-6">Items: {order.items.length}</p></div>
              <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md">Complete Delivery</button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Package className="text-orange-600"/> Ready for Pickup ({availableJobs.length})</h3>
          {availableJobs.length === 0 ? <p className="text-gray-400 italic p-6 bg-white rounded-2xl border border-gray-200 border-dashed text-center">No orders ready for pickup yet.</p> : availableJobs.map((order: Order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors">
              <div className="flex justify-between mb-2"><span className="font-bold text-gray-700">#{order.id}</span><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Ready</span></div>
              <p className="text-gray-800 font-medium mb-4 flex items-center gap-2"><MapPin size={16}/> {order.location}</p>
              <button onClick={() => updateStatus(order.id, 'OUT')} className="w-full bg-[#ea580c] text-white py-3 rounded-xl font-bold hover:bg-[#c2410c] shadow-md">Accept Job</button>
            </div>
          ))}
        </div>
      </div>

      {/* DELIVERED HISTORY */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-gray-800 flex items-center gap-2"><History size={20} className="text-gray-400"/> Completed Deliveries</h3></div>
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4">Location</th><th className="p-4">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
                {deliveredJobs.slice(0, 5).map((o: Order) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-gray-700">#{o.id}</td>
                        <td className="p-4 text-sm text-gray-600">{o.studentName}</td>
                        <td className="p-4 text-sm text-gray-600">{o.location}</td>
                        <td className="p-4"><StatusBadge status={o.status}/></td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ orders, users, weeklyRevenue, resetRevenue, menu, setMenu }: any) {
  const [activeSection, setActiveSection] = useState('orders'); 
  const [viewDate, setViewDate] = useState('today');
  const displayOrders = orders.filter((o: Order) => o.date === viewDate);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Fast Food', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' });

  const handleAddItem = (e: React.FormEvent) => { e.preventDefault(); if(!newItem.name || !newItem.price) return; const item = { id: Date.now(), ...newItem, price: Number(newItem.price) }; setMenu([...menu, item]); setNewItem({ name: '', price: '', category: 'Fast Food', image: '' }); alert("Item added!"); };
  const handleDeleteItem = (id: number) => { 
      if(window.confirm("Delete this item?")) setMenu((prev: MenuItem[]) => prev.filter((item: MenuItem) => item.id !== id)); 
  };

  // Stats Logic
  const todayRevenue = orders.filter((o: Order) => o.date === 'today' && o.status === 'DELIVERED').reduce((a: number, c: Order) => a + c.total, 0);
  const monthlyRevenue = weeklyRevenue * 4; 

  return (
    <div className="space-y-8 w-full">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div><h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Admin Control Panel</h2><p className="text-gray-500 mt-1">Manage system operations</p></div>
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button onClick={() => setActiveSection('orders')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeSection === 'orders' ? 'bg-[#ea580c] text-white shadow-orange-200' : 'bg-transparent text-gray-600 hover:bg-white'}`}><LayoutDashboard size={18}/> Overview</button>
            <button onClick={() => setActiveSection('menu')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeSection === 'menu' ? 'bg-[#ea580c] text-white shadow-orange-200' : 'bg-transparent text-gray-600 hover:bg-white'}`}><Utensils size={18}/> Menu</button>
          </div>
        </div>
        
        {/* MONTHLY REVENUE CARD WITH NEW INDIGO GRADIENT */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4"><div className="bg-white/10 p-3 rounded-xl"><DollarSign size={32} className="text-white"/></div><div><p className="text-xs text-indigo-100 uppercase font-bold tracking-wider mb-1">Total Monthly Revenue</p><p className="text-4xl font-bold tracking-tight">PKR {monthlyRevenue.toLocaleString()}</p></div></div>
          <button onClick={resetRevenue} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all flex items-center gap-2 text-sm font-bold" title="Reset"><RefreshCw size={16} /> Reset</button>
        </div>
      </div>

      {activeSection === 'orders' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<DollarSign />} title="Today's Revenue" value={`PKR ${todayRevenue.toLocaleString()}`} color="bg-emerald-500" />
            <StatCard icon={<TrendingUp />} title="Weekly Revenue" value={`PKR ${weeklyRevenue.toLocaleString()}`} color="bg-blue-500" />
            <StatCard icon={<Package />} title="Orders Today" value={orders.filter((o: Order) => o.date === 'today').length} color="bg-orange-500" />
            <StatCard icon={<Users />} title="Total Users" value={users.length} color="bg-violet-500" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              <button onClick={() => setViewDate('today')} className={`flex-1 py-4 text-center font-bold text-sm transition-all ${viewDate === 'today' ? 'text-[#ea580c] border-b-2 border-orange-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Today</button>
              <button onClick={() => setViewDate('yesterday')} className={`flex-1 py-4 text-center font-bold text-sm transition-all ${viewDate === 'yesterday' ? 'text-[#ea580c] border-b-2 border-orange-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Yesterday</button>
            </div>
            {displayOrders.length === 0 ? <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2"><Package size={48} className="opacity-20"/><p>No orders found for {viewDate}.</p></div> : 
              <div className="divide-y divide-gray-100">
                {displayOrders.map((order: Order) => (
                  <div key={order.id} className="p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-orange-50/30 transition-colors gap-6">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl border border-gray-200"><span className="text-xs font-bold text-gray-500 uppercase">Time</span><span className="font-bold text-gray-900">{order.time || '12:00'}</span></div>
                      <div><div className="flex items-center gap-3 mb-1"><h4 className="font-bold text-gray-900 text-lg">#{order.id}</h4><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono border">{(order.items || []).length} Items</span></div><p className="text-gray-500 flex items-center gap-2 text-sm"><User size={14}/> {order.studentName}</p></div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end"><div className="text-right"><p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Amount</p><p className="font-bold text-gray-900 text-xl">PKR {order.total}</p></div><StatusBadge status={order.status} /></div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Utensils size={20}/> Current Menu Items</h3><span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{menu.length} Items</span></div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              {menu.map((item: MenuItem) => (
                <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-xl flex items-start justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4"><img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100"/><div><p className="font-bold text-gray-800">{item.name}</p><p className="text-xs text-[#ea580c] font-medium bg-orange-50 px-2 py-0.5 rounded-full w-fit mt-1">{item.category}</p></div></div>
                  <div className="flex flex-col items-end gap-2"><span className="font-bold text-gray-900">PKR {item.price}</span>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteItem(item.id); }} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer z-10"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-fit p-8 sticky top-24">
             <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2"><Plus className="bg-[#ea580c] text-white rounded p-0.5" size={20}/> Add New Item</h3>
             <form onSubmit={handleAddItem} className="space-y-5">
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Beef Burger"/></div>
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (PKR)</label><input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="350"/></div>
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label><select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}><option value="Fast Food">Fast Food</option><option value="Desi Delights">Desi Delights</option><option value="Italian & Chinese">Italian & Chinese</option><option value="Sips & Snacks">Sips & Snacks</option></select></div>
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label><input className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} placeholder="https://..."/></div>
               <button type="submit" className="w-full bg-[#ea580c] text-white py-4 rounded-xl font-bold hover:bg-[#c2410c] flex justify-center items-center gap-2 shadow-lg transform transition-transform hover:scale-[1.02]">Add to Menu</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SHARED HELPERS ---
function CraveBot({ menu }: any) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleAsk = async () => { if(!input) return; setLoading(true); const res = await simulateAIResponse(input); setResponse(res); setLoading(false); };
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Bot className="text-yellow-300"/> CraveBot AI</h3>
        <div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="What should I eat?" className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-100 focus:outline-none focus:border-yellow-400"/><button onClick={handleAsk} disabled={loading} className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors">{loading ? <Loader2 className="animate-spin"/> : <Sparkles/>}</button></div>
        {response && <div className="mt-3 bg-white/10 p-3 rounded-lg text-sm text-white animate-in fade-in">{response}</div>}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${color} p-4 rounded-xl text-white shadow-lg shadow-${color.replace('bg-', '')}/30`}>{icon}</div>
      <div><p className="text-sm text-gray-500 font-medium">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const colors: Record<string, string> = { PENDING: 'bg-red-100 text-red-700', PREPARING: 'bg-yellow-100 text-yellow-700', READY: 'bg-blue-100 text-blue-700', OUT: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-gray-100 text-gray-500 line-through' };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
}
