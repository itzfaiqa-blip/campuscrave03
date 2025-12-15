
import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Star, Clock, MapPin, Sparkles, Coffee, ShieldCheck, 
  ChevronRight, Quote, Instagram, Twitter, Facebook, Utensils,
  ChefHat, Bike, Smartphone, Eye
} from 'lucide-react';
import { Review, MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data';

interface LandingPageProps {
  onLogin: () => void;
  onNavigate: (page: 'terms' | 'privacy') => void;
}

export default function LandingPage({ onLogin, onNavigate }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Load reviews from LocalStorage to reflect updates from Dashboard, start with empty if nothing saved
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('cc_reviews');
    return saved ? JSON.parse(saved) : []; 
  });

  // Listen for changes in localStorage to update reviews in real-time if multiple tabs are open
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cc_reviews' && e.newValue) {
        setReviews(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Logic to show limited items initially (e.g., top 8) vs full menu
  const displayedItems = showFullMenu ? INITIAL_MENU_ITEMS : INITIAL_MENU_ITEMS.slice(0, 8);
  
  // Group menu items
  const groupedMenu = showFullMenu 
    ? INITIAL_MENU_ITEMS.reduce((acc: any, item: MenuItem) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {})
    : { "Popular Picks": displayedItems }; 

  // Reviews to display
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-up-delay-1 { animation: fadeInUp 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-fade-up-delay-2 { animation: fadeInUp 0.8s ease-out 0.4s forwards; opacity: 0; }
        .hero-blob {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(234,88,12,0.1) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          z-index: -1;
        }
      `}</style>

      {/* HEADER */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white/50 backdrop-blur-sm py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {/* LOGO IN HEADER */}
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
              <div className="bg-[#ea580c] p-2.5 rounded-xl text-white transform transition-transform group-hover:rotate-12 hidden">
                <Coffee size={24} strokeWidth={3} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">Campus Crave</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('menu')} className="text-sm font-bold text-gray-600 hover:text-[#ea580c] transition-colors">Menu</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-gray-600 hover:text-[#ea580c] transition-colors">Features</button>
              <button onClick={() => scrollToSection('reviews')} className="text-sm font-bold text-gray-600 hover:text-[#ea580c] transition-colors">Reviews</button>
              <button 
                onClick={onLogin}
                className="bg-[#ea580c] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#c2410c] transition-all transform hover:scale-105 shadow-lg shadow-orange-200"
              >
                Login / Sign Up
              </button>
            </nav>
            <button onClick={onLogin} className="md:hidden text-gray-800 p-2">
              <Utensils />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="hero-blob -top-20 -right-20 animate-pulse"></div>
        <div className="hero-blob bottom-0 left-0 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 text-[#ea580c] rounded-full text-sm font-bold animate-fade-up">
                <Sparkles size={16} className="fill-orange-500" /> New: AI Food Recommendations
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-fade-up-delay-1">
                Delicious Food, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-yellow-500">
                  Delivered Fast
                </span>
                <br/> to Your Spot.
              </h1>
              
              <p className="text-xl text-gray-500 max-w-lg leading-relaxed animate-fade-up-delay-2">
                The smartest way to eat on campus. Skip the cafeteria queues and get fresh meals delivered to your library seat, dorm, or classroom.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-2">
                <button onClick={onLogin} className="flex items-center justify-center gap-2 bg-[#ea580c] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#c2410c] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-4 ring-orange-50">
                  Order Now <ArrowRight size={20} />
                </button>
                <button onClick={() => scrollToSection('menu')} className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:border-[#ea580c] hover:text-[#ea580c] transition-all">
                  View Menu
                </button>
              </div>
              
              <div className="flex items-center gap-4 pt-4 animate-fade-up-delay-2">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex gap-1 text-yellow-400 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="font-medium text-gray-500">Loved by <strong>2,000+</strong> students</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image & Animation */}
            <div className="relative animate-fade-up-delay-1 hidden lg:block">
              {/* Main Circular Image */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                 <div className="absolute inset-0 bg-[#ea580c] rounded-full opacity-5 transform rotate-6 scale-105"></div>
                 <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-10 transform -rotate-3 scale-110"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000" 
                   alt="Delicious Burger" 
                   className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-white relative z-10"
                 />
                 
                 {/* Floating Card: Zinger Combo */}
                 <div className="absolute top-10 -left-10 z-20 bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 animate-float w-64">
                   <div className="flex items-center gap-4 mb-3">
                     <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🍔</div>
                     <div>
                       <h4 className="font-bold text-gray-900">Zinger Combo</h4>
                       <p className="text-xs text-gray-500">Preparing...</p>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                       <span>Prep</span>
                       <span>Route</span>
                       <span>Arrive</span>
                     </div>
                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse"></div>
                     </div>
                   </div>
                 </div>

                 {/* Floating Badge: Delivery Time */}
                 <div className="absolute bottom-10 -right-6 z-20 bg-white py-3 px-5 rounded-full shadow-xl border border-gray-100 animate-float" style={{animationDelay: '1.5s'}}>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <p className="font-bold text-gray-800 text-sm">Est. 15 mins</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <span className="text-[#ea580c] font-bold tracking-wider uppercase text-sm">What's Cooking?</span>
             <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Explore Our Menu</h2>
             <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Browse through our delicious options. Log in to place your order.</p>
          </div>

          {Object.keys(groupedMenu).map((category) => (
            <div key={category} className="mb-12 last:mb-0">
               <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                 {category === 'Popular Picks' ? '🔥' : category === 'Desi Delights' ? '🥘' : category === 'Fast Food' ? '🍔' : '🥤'} {category}
               </h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {groupedMenu[category].map((item: MenuItem) => (
                   <div key={item.id} className="group bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-orange-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                     <div className="h-40 mb-4 overflow-hidden rounded-xl relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                        />
                     </div>
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h4>
                       <span className="bg-white text-[#ea580c] px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-gray-100 whitespace-nowrap">
                         Rs. {item.price}
                       </span>
                     </div>
                     <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                     <button onClick={onLogin} className="w-full py-2.5 rounded-xl bg-[#ea580c] text-white font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       Login to Order
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          ))}

          {/* Toggle Button */}
          <div className="text-center mt-12">
            <button 
                onClick={() => setShowFullMenu(!showFullMenu)}
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50 transition-all"
            >
              {showFullMenu ? 'Show Less' : 'View Full Menu'} <Eye size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Features) */}
      <section id="features" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">From Kitchen to Classroom</h2>
            <p className="mt-4 text-lg text-gray-600">We've optimized every step to ensure your food arrives hot and on time.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>
            
            {[
              { icon: <Smartphone className="text-[#ea580c]" size={32} />, title: "1. Order Smart", desc: "Browse the menu, customize your meal, and pay securely via the app." },
              { icon: <ChefHat className="text-[#ea580c]" size={32} />, title: "2. We Prep", desc: "Kitchens receive your order instantly and start preparing fresh food." },
              { icon: <Bike className="text-[#ea580c]" size={32} />, title: "3. Fast Delivery", desc: "Our AI routes the rider to your exact location on campus." }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center group">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-orange-200 transition-colors">
                <div className="bg-purple-50 p-3 rounded-xl"><MapPin className="text-purple-600" size={24}/></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Smart Routing Technology</h3>
                  <p className="text-sm text-gray-600">Our proprietary algorithm calculates the shortest path between buildings, accounting for campus traffic.</p>
                </div>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-orange-200 transition-colors">
                <div className="bg-green-50 p-3 rounded-xl"><ShieldCheck className="text-green-600" size={24}/></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Secure & Cashless</h3>
                  <p className="text-sm text-gray-600">Integrated with your student ID wallet for seamless payments, or choose cash on delivery.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-24 bg-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#ea580c] font-bold tracking-wider uppercase text-sm">Testimonials</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Campus Vibes</h2>
            </div>
            
            <button 
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="hidden md:flex items-center gap-2 text-gray-500 font-bold hover:text-[#ea580c] transition-colors"
            >
                {showAllReviews ? 'Show Less' : 'See All Reviews'} <ArrowRight size={20}/>
            </button>
          </div>
          
          {reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200">
              <Quote className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-lg text-gray-500 font-medium">No reviews yet. Be the first to order and share your experience!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
                {displayedReviews.map(review => (
                <div key={review.id} className="bg-gray-50 p-8 rounded-3xl relative hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col justify-between">
                    <div>
                        <Quote className="absolute top-8 right-8 text-gray-200" size={40} />
                        <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={`${i < review.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        </div>
                        <p className="text-gray-700 font-medium mb-8 relative z-10 leading-relaxed">"{review.text}"</p>
                    </div>
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {review.name[0]}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{review.name}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{review.role}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
          )}
          
          {reviews.length > 3 && (
            <div className="mt-8 text-center md:hidden">
                <button 
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-gray-600"
                >
                    {showAllReviews ? 'Show Less' : 'See All Reviews'}
                </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[#ea580c] rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Hungry? Don't wait.</h2>
                <p className="text-orange-100 mb-10 max-w-xl mx-auto text-lg">Join thousands of students ordering smarter, faster, and better food on campus today.</p>
                <button onClick={onLogin} className="bg-white text-[#ea580c] px-12 py-5 rounded-2xl font-bold text-xl hover:bg-orange-50 transition-all shadow-xl hover:scale-105">
                Get Started Now
                </button>
            </div>
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            <Utensils className="absolute top-20 right-20 text-white opacity-10 rotate-12" size={120} />
            <Coffee className="absolute bottom-20 left-20 text-white opacity-10 -rotate-12" size={120} />
          </div>
        </div>
      </section>

      {/* DARK FOOTER */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-6">
                  {/* LOGO IN FOOTER */}
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                  <div className="bg-[#ea580c] p-2 rounded-lg text-white hidden">
                    <Coffee size={20} strokeWidth={3} />
                  </div>
                  <span className="text-2xl font-extrabold text-white">Campus Crave</span>
               </div>
               <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                 The smartest way to eat on campus. Automated routing, AI recommendations, and happy bellies.
               </p>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#ea580c] hover:text-white transition-all cursor-pointer"><Instagram size={18} /></div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#ea580c] hover:text-white transition-all cursor-pointer"><Twitter size={18} /></div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#ea580c] hover:text-white transition-all cursor-pointer"><Facebook size={18} /></div>
               </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><button onClick={onLogin} className="hover:text-[#ea580c] transition-colors">Login</button></li>
                <li><button onClick={onLogin} className="hover:text-[#ea580c] transition-colors">Sign Up</button></li>
                <li><button onClick={() => scrollToSection('menu')} className="hover:text-[#ea580c] transition-colors">Menu</button></li>
                <li><button className="hover:text-[#ea580c] transition-colors">Partner with Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><button onClick={() => onNavigate('terms')} className="hover:text-[#ea580c] transition-colors">Terms & Conditions</button></li>
                <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#ea580c] transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-[#ea580c] transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2023 Campus Crave Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer">Security</span>
                <span className="hover:text-white cursor-pointer">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
