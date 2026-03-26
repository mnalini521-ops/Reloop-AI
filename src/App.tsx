import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Menu, X, Scan, ShoppingBag, LayoutDashboard, 
  Settings, HelpCircle, LogIn, UserPlus, 
  Recycle, ArrowLeftRight, Trash2, MapPin,
  Star, MessageSquare, Bell, Search, Globe,
  Moon, Sun, Languages, LogOut, ChevronRight,
  Camera, Upload, Smartphone, Laptop, Watch, 
  Battery, CheckCircle2, Truck, TrendingUp,
  Award, HeartHandshake, Mic, ChevronDown, Heart,
  User, Mail, Github, Lock, ArrowLeft, Zap, CreditCard, Phone
} from 'lucide-react';
import { cn } from './lib/utils';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useMemo } from 'react';
import ImpactDashboard from './components/ImpactDashboard';
import MapSimulation from './components/MapSimulation';

// --- Components ---

const ThreeDViewer = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="w-full h-full bg-black/20 backdrop-blur-sm">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <ProductModel imageUrl={imageUrl} />
          </Stage>
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={10} blur={2} far={0.8} />
        </Suspense>
      </Canvas>
    </div>
  );
};

const ProductModel = ({ imageUrl }: { imageUrl: string }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1, 2, 0.1]} />
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.8} />
    </mesh>
  );
};

const FeedbackView = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([
    { id: 1, name: 'John D.', rating: 5, comment: 'Amazing service! The AI detection was spot on.', date: '2 days ago' },
    { id: 2, name: 'Sarah M.', rating: 4, comment: 'Very convenient way to recycle old tech. Points are a great bonus.', date: '1 week ago' },
    { id: 3, name: 'Mike R.', rating: 5, comment: 'Exchanged my old phone for a refurbished one. Super smooth process.', date: '2 weeks ago' },
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    const newReview = {
      id: Date.now(),
      name: 'You',
      rating,
      comment,
      date: 'Just now'
    };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <BackButton />
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Share Your <span className="text-primary">Experience</span></h2>
        <p className="text-white/40">Your feedback helps us improve the ReLoop ecosystem.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="glass-card p-8 h-fit">
          <h3 className="text-xl font-bold mb-6">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all hover:scale-125"
                >
                  <Star 
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hover || rating) >= star ? "text-yellow-500 fill-current" : "text-white/10"
                    )} 
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">Your Comment</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary h-32 resize-none" 
                placeholder="What did you like or dislike?"
              />
            </div>
            <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
              Submit Review
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold mb-6">Recent Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-xs text-white/20">{review.date}</div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "text-yellow-500 fill-current" : "text-white/10")} />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/') return null;

  return (
    <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-6 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs font-bold uppercase tracking-widest">Back</span>
    </button>
  );
};

const Navbar = ({ onOpenAuth, onLogout, user }: { onOpenAuth: () => void; onLogout: () => void; user: { name: string; email: string } | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Globe className="w-5 h-5" /> },
    { name: 'AI Detector', path: '/detector', icon: <Scan className="w-5 h-5" /> },
    { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  const moreLinks = [
    { name: 'Exchange', path: '/exchange', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { name: 'Sell/Recycle', path: '/sell-recycle', icon: <Recycle className="w-4 h-4" /> },
    { name: 'Tracking', path: '/tracking', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Donation', path: '/donation', icon: <Heart className="w-4 h-4" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Award className="w-4 h-4" /> },
    { name: 'Support', path: '/support', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "glass py-3 shadow-2xl shadow-black/50" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Recycle className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ReLoop <span className="text-primary">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative group/link",
                  location.pathname === link.path ? "text-primary" : "text-white/70"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/link:w-full",
                  location.pathname === link.path && "w-full"
                )} />
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group/more">
              <button className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-primary transition-colors py-2">
                More <ChevronDown className="w-4 h-4 group-hover/more:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-56 glass-card p-2 opacity-0 translate-y-2 pointer-events-none group-hover/more:opacity-100 group-hover/more:translate-y-0 group-hover/more:pointer-events-auto transition-all duration-300 z-[60]">
                {moreLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-primary hover:bg-white/5 transition-all"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4">
            <Link 
              to="/detector"
              className="px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              Start Scan
            </Link>
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="flex items-center gap-2 group/user cursor-pointer">
                  <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-sm border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                    {user.name[0]}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs text-white/40 font-medium leading-none mb-1">Welcome back</div>
                    <div className="text-sm font-bold text-white leading-none">{user.name.split(' ')[0]}</div>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white p-2 glass rounded-xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/10 overflow-hidden lg:hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {[...navLinks, ...moreLinks].map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    location.pathname === link.path ? "bg-primary/10 text-primary" : "text-white/70 hover:bg-white/5"
                  )}
                >
                  {link.icon || <Globe className="w-5 h-5" />}
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-4" />
              <div className="flex flex-col gap-3">
                <Link 
                  to="/detector" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Scan className="w-5 h-5" />
                  Start Scan
                </Link>
                {user ? (
                  <button 
                    onClick={() => { setIsOpen(false); onLogout(); }}
                    className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <button 
                    onClick={() => { setIsOpen(false); onOpenAuth(); }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Views ---

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8">
            <Award className="w-4 h-4" />
            Next-Gen Recycling Platform
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] mb-8 tracking-tight text-white">
            Recycle Smarter <br />
            <span className="text-gradient">With AI Power.</span>
          </h1>
          <p className="text-xl text-white/60 mb-12 max-w-lg leading-relaxed font-medium">
            ReLoop AI uses advanced computer vision to identify, value, and recycle your electronics instantly. Join the circular economy and earn premium rewards.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link to="/detector" className="px-10 py-5 bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 hover:bg-primary-dark transition-all flex items-center gap-3">
              <Scan className="w-6 h-6" />
              Start AI Scan
            </Link>
            <Link to="/marketplace" className="px-10 py-5 glass text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              Marketplace
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-12">
            <div>
              <div className="text-3xl font-bold mb-1 text-white">50k+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Items Recycled</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-3xl font-bold mb-1 text-white">120t</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">CO₂ Saved</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-3xl font-bold mb-1 text-white">4.9/5</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">User Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full animate-pulse opacity-50" />
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800" 
              alt="Premium Electronics" 
              className="relative rounded-[2rem] shadow-2xl border border-white/10 w-full object-cover aspect-square lg:aspect-[4/5] xl:aspect-square"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Floating Insight Card */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 glass-card p-8 max-w-[280px] shadow-2xl shadow-black/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                <TrendingUp className="text-emerald-400 w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-bold uppercase tracking-wider">Market Value</div>
                <div className="text-xl font-bold text-emerald-400">+$240.00</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">Your iPhone 13 Pro is currently at peak resale value. Trade in now for maximum rewards!</p>
          </motion.div>

          {/* Floating Stats Card */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-8 -right-8 glass-card p-6 shadow-2xl shadow-black/50 border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Analysis</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <AuthModal 
          onClose={() => {}} 
          onLogin={handleLogin}
          isFullPage={true}
        />
      </div>
    );
  }

  return (
    <Router>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen selection:bg-primary/30 bg-bg-dark text-white"
      >
        <Navbar onOpenAuth={() => setShowAuth(true)} onLogout={handleLogout} user={user} />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detector" element={<AIDetector />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/sell-recycle" element={<SellRecycle />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/support" element={<Support />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<SettingsView onLogout={handleLogout} />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Voice Assistant Button */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-90 transition-all z-40 group">
          <Mic className="text-white w-6 h-6" />
          <span className="absolute right-full mr-4 px-3 py-1 glass rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask ReLoop AI
          </span>
        </button>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuth && (
            <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />
          )}
        </AnimatePresence>
      </motion.div>
    </Router>
  );
}

// --- Placeholder Components (To be implemented in next steps) ---

const AIDetector = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [boxPosition, setBoxPosition] = useState({ top: '20%', left: '20%', width: '60%', height: '60%' });
  const [result, setResult] = useState<null | {
    name: string;
    condition: string;
    life: string;
    suggestion: string;
    value: string;
  }>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Attach stream to video element when camera becomes active
  useEffect(() => {
    if (cameraActive && stream && vRef.current) {
      vRef.current.srcObject = stream;
    }
  }, [cameraActive, stream]);

  // Simulate bounding box movement
  useEffect(() => {
    let interval: any;
    if (cameraActive && !isScanning) {
      interval = setInterval(() => {
        setBoxPosition({
          top: `${15 + Math.random() * 10}%`,
          left: `${15 + Math.random() * 10}%`,
          width: `${50 + Math.random() * 20}%`,
          height: `${50 + Math.random() * 20}%`,
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [cameraActive, isScanning]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setCapturedImage(imageData);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const base64Data = imageData.split(',')[1];
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { inlineData: { data: base64Data, mimeType: file.type } },
                { text: "Identify this electronic device. Provide its name, estimated condition (based on visual cues), estimated battery health or remaining life (if applicable), a suggestion (sell, recycle, or repair), and an estimated market value in USD. Return the data in JSON format with keys: name, condition, life, suggestion, value." }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                condition: { type: Type.STRING },
                life: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                value: { type: Type.STRING }
              },
              required: ["name", "condition", "life", "suggestion", "value"]
            }
          }
        });

        const aiResult = JSON.parse(response.text || "{}");
        setResult(aiResult);
      } catch (err) {
        console.error("AI Analysis error:", err);
        setError("AI analysis failed. Please try again with a clearer image.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (vRef.current) {
      vRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    console.log("Attempting to start camera...");
    setError(null);
    setResult(null);
    setCapturedImage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support camera access. Please try a modern browser.");
      return;
    }

    if (!window.isSecureContext) {
      setError("Camera access requires a secure (HTTPS) connection.");
      return;
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        } 
      });
      console.log("Camera stream obtained successfully");
      setStream(newStream);
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError') {
        setError("Camera permission denied. Please enable camera access in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.");
      } else {
        setError(`Camera error: ${err.message || "Unknown error"}. Please check permissions.`);
      }
    }
  };

  const [analysisStatus, setAnalysisStatus] = useState("");

  const runAnalysis = async () => {
    if (!vRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setError(null);
    setAnalysisStatus("Capturing frame...");

    // Capture frame
    const video = vRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      try {
        const statuses = [
          "Analyzing visual features...",
          "Identifying device model...",
          "Assessing physical condition...",
          "Calculating market value...",
          "Generating eco-impact report..."
        ];
        
        let statusIdx = 0;
        const statusInterval = setInterval(() => {
          setAnalysisStatus(statuses[statusIdx]);
          statusIdx = (statusIdx + 1) % statuses.length;
        }, 1500);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const base64Data = imageData.split(',')[1];
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
                { text: "You are an expert electronics appraiser. Analyze this image and identify the electronic device. Provide: 1. Specific Name (Brand & Model), 2. Visual Condition (Excellent, Good, Fair, Poor), 3. Estimated Remaining Life/Battery Health, 4. Best Action (Sell, Repair, or Recycle), 5. Current Market Value in USD. Return ONLY a JSON object with keys: name, condition, life, suggestion, value." }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                condition: { type: Type.STRING },
                life: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                value: { type: Type.STRING }
              },
              required: ["name", "condition", "life", "suggestion", "value"]
            }
          }
        });

        clearInterval(statusInterval);
        const aiResult = JSON.parse(response.text || "{}");
        setResult(aiResult);
        stopCamera();
      } catch (err) {
        console.error("AI Analysis error:", err);
        setError("AI analysis failed. Please try again with a clearer view.");
      } finally {
        setIsScanning(false);
        setAnalysisStatus("");
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vRef.current && vRef.current.srcObject) {
        const stream = vRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen max-w-7xl mx-auto">
      <BackButton />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">AI Device <span className="text-primary">Detector</span></h2>
        <p className="text-white/60 max-w-xl mx-auto">Point your camera or upload a photo of your device. Our AI will analyze its condition and market value instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Scanner Area */}
        <div className="space-y-6">
          <div className={cn(
            "glass-card overflow-hidden relative aspect-video lg:aspect-square flex items-center justify-center bg-black transition-all duration-500",
            cameraActive && "ring-4 ring-primary/30 shadow-[0_0_50px_rgba(0,200,150,0.2)]"
          )}>
            {!cameraActive && !result ? (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <Camera className="w-10 h-10" />
                </div>
                {error ? (
                  <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                    <button onClick={startCamera} className="mt-2 text-xs text-red-400 underline hover:no-underline">Try again</button>
                  </div>
                ) : (
                  <p className="text-white/40 mb-8">Ready to analyze your device</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={startCamera} className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:scale-105 transition-transform">
                    <Scan className="w-5 h-5" /> Start Scan
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 glass text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:bg-white/10 transition-colors"
                  >
                    <Upload className="w-5 h-5" /> Upload Image
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>
            ) : cameraActive ? (
              <div className="w-full h-full relative">
                <video 
                  ref={vRef}
                  autoPlay 
                  playsInline 
                  className={cn("w-full h-full object-cover transition-opacity", isScanning ? "opacity-60" : "opacity-100")}
                />
                
                {/* AI Overlay Elements */}
                <AnimatePresence>
                  {cameraActive && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none border-[20px] border-black/20"
                      />
                      <motion.div
                        animate={{ 
                          top: boxPosition.top, 
                          left: boxPosition.left, 
                          width: boxPosition.width, 
                          height: boxPosition.height 
                        }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="absolute border-2 border-primary/60 rounded-lg pointer-events-none"
                      >
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-primary" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-primary" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-primary" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-primary" />
                        
                        <div className="absolute top-2 left-2 bg-primary/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-primary uppercase tracking-wider">
                          Detecting Object...
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {isScanning && (
                  <>
                    <div className="scan-line" />
                    <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
                  </>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  {!isScanning ? (
                    <div className="flex gap-4">
                      <button 
                        onClick={stopCamera}
                        className="px-6 py-4 glass text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all"
                      >
                        <X className="w-5 h-5" />
                        Stop Scan
                      </button>
                      <button 
                        onClick={runAnalysis}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                      >
                        <Camera className="w-6 h-6" />
                        Capture Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="font-bold tracking-widest uppercase text-primary animate-pulse mb-2">{analysisStatus || "Analyzing device..."}</p>
                      <p className="text-white/40 text-xs">This may take a few seconds as our AI evaluates your device.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <img 
                  src={capturedImage || "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800"} 
                  className="w-full h-full object-cover"
                  alt="Detected Device"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
                  <div className="px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full text-xs font-bold text-primary uppercase tracking-widest border border-primary/30">
                    Image Captured
                  </div>
                  <button 
                    onClick={startCamera} 
                    className="px-8 py-3 bg-white text-black rounded-xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <Scan className="w-5 h-5" />
                    New Scan
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Supported Devices Guide */}
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Supported Devices</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/60">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Phones</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/60">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Laptops</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/60">
                  <Watch className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Wearables</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{result.name}</h3>
                      <div className="flex items-center gap-2 text-primary text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        AI Verified
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/40 uppercase font-bold">Estimated Value</div>
                      <div className="text-3xl font-bold text-primary">{result.value}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-white/40 uppercase mb-1">Condition</div>
                      <div className="font-semibold">{result.condition}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-white/40 uppercase mb-1">Battery Health</div>
                      <div className="font-semibold">{result.life}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-primary font-bold uppercase">AI Suggestion</div>
                      <div className="text-sm font-medium">{result.suggestion}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Link 
                      to="/sell-recycle" 
                      state={{ 
                        productName: result.name, 
                        expectedPrice: result.value, 
                        condition: result.condition,
                        image: capturedImage 
                      }}
                      className="py-4 bg-primary text-white rounded-xl font-bold text-center shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
                    >
                      Sell Now
                    </Link>
                    <button 
                      onClick={startCamera}
                      className="py-4 glass text-white rounded-xl font-bold text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Scan className="w-5 h-5" />
                      New Scan
                    </button>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Recycle className="text-emerald-400 w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold">Eco-Impact</div>
                      <div className="text-xs text-white/40">Recycling this saves 12kg of CO₂</div>
                    </div>
                  </div>
                  <Link to="/sell-recycle" className="text-primary text-sm font-bold hover:underline">Recycle Instead</Link>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center border-dashed border-white/10 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analysis Pending</h3>
                <p className="text-white/40 text-sm max-w-xs">Scan your device to see detailed condition reports and market valuation.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
const PRODUCTS = [
  { id: '1', name: 'iPhone 15 Pro', price: '$999', rating: 4.9, condition: 'Refurbished - Like New', category: 'Mobiles', image: '/iphone.jpg', specs: { storage: '256GB', battery: '100%', color: 'Natural Titanium' } },
  { id: '2', name: 'MacBook Pro M3', price: '$1599', rating: 4.9, condition: 'Refurbished - Excellent', category: 'Laptops', image: '/macbook.jpg', specs: { storage: '1TB', ram: '32GB', color: 'Space Black' } },
  { id: '3', name: 'AirPods Max', price: '$449', rating: 4.8, condition: 'New - Open Box', category: 'Accessories', image: '/airpods.jpg', specs: { noise_cancelling: 'Yes', battery: '20h', color: 'Sky Blue' } },
  { id: '4', name: 'iPad Air 5', price: '$499', rating: 4.7, condition: 'Refurbished - Good', category: 'Laptops', image: '/ipad.jpg', specs: { storage: '64GB', chip: 'M1', color: 'Purple' } },
  { id: '5', name: 'Samsung S24 Ultra', price: '$1049', rating: 4.8, condition: 'Refurbished - Like New', category: 'Mobiles', image: '/samsung.jpg', specs: { storage: '512GB', zoom: '100x', color: 'Titanium Gray' } },
  { id: '6', name: 'Bose QC Ultra', price: '$349', rating: 4.9, condition: 'New - Sealed', category: 'Accessories', image: '/bose.jpg', specs: { battery: '24h', noise_cancelling: 'Immersive Audio', color: 'Black' } },
  { id: '7', name: 'Apple Watch S9', price: '$329', rating: 4.8, condition: 'Refurbished - Like New', category: 'Accessories', image: '/applewatch.jpg', specs: { case: 'Aluminum', battery: '18h', color: 'Midnight' } },
  { id: '8', name: 'Razer Blade 16', price: '$2499', rating: 4.7, condition: 'Refurbished - Excellent', category: 'Laptops', image: '/razer.jpg', specs: { gpu: 'RTX 4080', ram: '32GB', display: 'Mini-LED' } },
  { id: '9', name: 'Pixel 8 Pro', price: '$749', rating: 4.6, condition: 'Refurbished - Good', category: 'Mobiles', image: '/pixel.jpg', specs: { storage: '128GB', camera: 'Pro Triple', color: 'Bay' } },
  ];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Mobiles', 'Laptops', 'Accessories', 'Batteries'];

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-5xl font-bold mb-4 tracking-tight">Eco <span className="text-primary">Marketplace</span></h2>
          <p className="text-white/40 text-lg max-w-xl">Premium refurbished devices with 12-month warranty and certified eco-impact reports.</p>
        </motion.div>
        
        <div className="flex items-center gap-2 glass p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            className="group"
          >
            <Link to={`/product/${product.id}`} className="block glass-card overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
              <div className="aspect-[4/5] overflow-hidden relative bg-white/[0.02] flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                    {product.condition}
                  </div>
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                    {product.category}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="text-xs font-bold text-white/60 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Certified Refurbished
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl tracking-tight">{product.name}</h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-yellow-500">{product.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/30 font-bold uppercase tracking-widest mb-1">Starting at</div>
                    <div className="text-3xl font-bold text-primary">{product.price}</div>
                  </div>
                  <button className="w-12 h-12 bg-white/5 group-hover:bg-primary group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:shadow-primary/40">
                    <ShoppingBag className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <BackButton />
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-8">
        <ArrowLeftRight className="w-4 h-4 rotate-180" />
        Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-6">
          <div className="glass-card aspect-square overflow-hidden relative flex items-center justify-center p-8 bg-white/[0.02]">
            {is3D ? (
              <div className="absolute inset-0 z-10">
                <Suspense fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-bold uppercase tracking-widest text-primary text-xs">Initializing 3D Space...</p>
                  </div>
                }>
                  <ThreeDViewer imageUrl={product.image} />
                </Suspense>
              </div>
            ) : (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            )}
            <button 
              onClick={() => setIs3D(!is3D)}
              className={cn(
                "absolute bottom-6 right-6 px-6 py-3 glass rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all z-20",
                is3D && "bg-primary text-white hover:bg-primary/80"
              )}
            >
              {is3D ? <X className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              {is3D ? 'Exit 3D View' : 'View in 3D'}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card aspect-square overflow-hidden cursor-pointer hover:border-primary transition-colors">
                <img src={product.image} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase rounded-full">In Stock</span>
              <span className="px-3 py-1 glass text-white/40 text-[10px] font-bold uppercase rounded-full">{product.category}</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-primary">{product.price}</div>
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-white/40 text-xs ml-1">(128 reviews)</span>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed">
              This {product.name} has been meticulously inspected and certified by our AI experts. It comes with a 12-month ReLoop warranty and a brand new eco-friendly packaging.
            </p>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Specifications
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-sm text-white/40 capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95">
              Add to Cart
            </button>
            <Link to="/exchange" className="flex-1 py-4 glass text-white rounded-2xl font-bold text-center hover:bg-white/10 transition-all active:scale-95">
              Exchange Old Device
            </Link>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                User Reviews
              </h4>
              <button className="text-xs font-bold text-primary hover:underline">Write a Review</button>
            </div>

            <div className="glass-card p-6 mb-8">
              <h5 className="text-sm font-bold mb-4">Submit Your Review</h5>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} className="text-yellow-500"><Star className="w-5 h-5" /></button>
                ))}
              </div>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-primary h-24 resize-none mb-4" 
                placeholder="Share your experience with this product..."
              ></textarea>
              <button className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-bold">Post Review</button>
            </div>

            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">JD</div>
                      <span className="text-sm font-bold">John Doe</span>
                    </div>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-white/40">"Amazing condition! Looks and feels brand new. The AI detection was spot on with the valuation of my old device."</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Exchange = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'upi' | 'card' | null>(null);

  const handlePayment = (method: 'gpay' | 'upi' | 'card') => {
    setPaymentMethod(method);
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2500);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <BackButton />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Device <span className="text-primary">Exchange</span></h2>
        <p className="text-white/40">Upgrade your tech responsibly. Get instant credit for your old devices.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                    step >= i ? "bg-primary text-white" : "bg-white/5 text-white/40"
                  )}>{i}</div>
                  <span className={cn("text-xs font-bold uppercase tracking-widest hidden sm:block", step >= i ? "text-white" : "text-white/40")}>
                    {i === 1 ? 'Details' : i === 2 ? 'Condition' : 'Payment'}
                  </span>
                  {i < 3 && <div className="w-12 h-px bg-white/10 mx-2" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Full Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Location</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="New York, NY" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Old Product Details</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary appearance-none">
                      <option className="bg-[#1a1a1a]">Select Device Type</option>
                      <option className="bg-[#1a1a1a]">Smartphone</option>
                      <option className="bg-[#1a1a1a]">Laptop</option>
                      <option className="bg-[#1a1a1a]">Tablet</option>
                    </select>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-4 bg-primary text-white rounded-xl font-bold">Next Step</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h4 className="font-bold mb-4">Select Device Condition</h4>
                  <div className="grid gap-4">
                    {['Like New', 'Good', 'Fair', 'Broken'].map(cond => (
                      <button key={cond} className="p-4 glass rounded-xl text-left hover:border-primary transition-colors flex items-center justify-between group">
                        <div>
                          <div className="font-bold">{cond}</div>
                          <div className="text-xs text-white/40">No scratches or visible wear</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 glass text-white rounded-xl font-bold">Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 py-4 bg-primary text-white rounded-xl font-bold">Calculate Credit</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                    <div className="text-xs text-primary font-bold uppercase mb-2">Estimated Exchange Credit</div>
                    <div className="text-5xl font-bold text-primary mb-2">$320.00</div>
                    <p className="text-xs text-white/40">Final value subject to physical inspection</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold">Pay Difference</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => handlePayment('gpay')} 
                        disabled={isProcessing}
                        className="flex-1 py-4 glass rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold">Google Pay</span>
                      </button>
                      <button 
                        onClick={() => handlePayment('upi')} 
                        disabled={isProcessing}
                        className="flex-1 py-4 glass rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold">UPI Payment</span>
                      </button>
                      <button 
                        onClick={() => handlePayment('card')} 
                        disabled={isProcessing}
                        className="sm:col-span-2 py-4 glass rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        <CreditCard className="w-5 h-5 text-primary" />
                        <span className="font-bold">Credit / Debit Card</span>
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-4 text-white/40 font-bold hover:text-white">Back to Condition</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-6 text-white">Exchange For</h3>
            
            {/* Selected Product Preview */}
            <motion.div 
              key={selectedProduct.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 glass rounded-2xl text-center border border-primary/20 bg-primary/5"
            >
              <div className="w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden bg-white/5 shadow-2xl shadow-primary/20 border border-white/10 flex items-center justify-center p-4">
                <img src={selectedProduct.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="font-bold text-xl mb-1 text-white">{selectedProduct.name}</div>
              <div className="text-primary font-bold text-lg">{selectedProduct.price}</div>
            </motion.div>

            <div className="space-y-4">
              {PRODUCTS.slice(0, 3).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProduct(p)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all group",
                    selectedProduct.id === p.id ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" : "glass border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors shrink-0 flex items-center justify-center p-2">
                      <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-primary transition-colors">{p.name}</div>
                      <div className="text-xs text-primary font-bold">{p.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-primary/5 border-primary/10">
            <h4 className="font-bold mb-4">Price Difference</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">New Device</span>
                <span className="font-bold">{selectedProduct.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Exchange Credit</span>
                <span className="font-bold text-primary">-$320.00</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between">
                <span className="font-bold">Total to Pay</span>
                <span className="font-bold text-xl text-primary">$679.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Processing Payment</h3>
              <p className="text-white/40 font-medium">Please do not close this window...</p>
              
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="px-4 py-2 glass rounded-full flex items-center gap-2">
                  {paymentMethod === 'gpay' && <Smartphone className="w-4 h-4 text-primary" />}
                  {paymentMethod === 'upi' && <Zap className="w-4 h-4 text-primary" />}
                  {paymentMethod === 'card' && <CreditCard className="w-4 h-4 text-primary" />}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {paymentMethod === 'gpay' ? 'Google Pay' : paymentMethod === 'upi' ? 'UPI' : 'Card'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-card p-12 text-center max-w-sm">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/40">
                <CheckCircle2 className="text-white w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Exchange Initiated!</h3>
              <p className="text-white/40 mb-8 leading-relaxed">
                Payment of <span className="text-white font-bold">$679.00</span> successful via <span className="text-primary font-bold uppercase">{paymentMethod}</span>.
                Our agent will arrive within 24 hours to pick up your old device and deliver your new {selectedProduct.name}.
              </p>
              <Link to="/tracking" className="block w-full py-4 bg-primary text-white rounded-xl font-bold">Track Order</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SellRecycle = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'sell' | 'recycle'>('sell');
  const [showSuccess, setShowSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [productName, setProductName] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [conditionDesc, setConditionDesc] = useState("");

  useEffect(() => {
    const state = location.state as { productName?: string; expectedPrice?: string; condition?: string; image?: string };
    if (state) {
      if (state.productName) setProductName(state.productName);
      if (state.expectedPrice) setExpectedPrice(state.expectedPrice);
      if (state.condition) setConditionDesc(`AI Detected Condition: ${state.condition}`);
      if (state.image) setImages([state.image]);
    }
  }, [location.state]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          if (prev.length >= 5) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <BackButton />
      <div className="flex justify-center mb-12">
        <div className="glass p-1 rounded-2xl flex">
          <button 
            onClick={() => setActiveTab('sell')}
            className={cn("px-8 py-3 rounded-xl font-bold transition-all", activeTab === 'sell' ? "bg-primary text-white shadow-lg" : "text-white/40")}
          >
            Sell Device
          </button>
          <button 
            onClick={() => setActiveTab('recycle')}
            className={cn("px-8 py-3 rounded-xl font-bold transition-all", activeTab === 'recycle' ? "bg-primary text-white shadow-lg" : "text-white/40")}
          >
            Recycle
          </button>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            {activeTab === 'sell' ? <ShoppingBag /> : <Recycle />}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{activeTab === 'sell' ? 'Sell Your Tech' : 'Eco-Friendly Recycling'}</h3>
            <p className="text-sm text-white/40">{activeTab === 'sell' ? 'Get the best market price for your used gadgets.' : 'Dispose of e-waste safely and earn reward points.'}</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={e => { e.preventDefault(); setShowSuccess(true); }}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">Product Name</label>
              <input 
                type="text" 
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" 
                placeholder="e.g. iPhone 12" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">{activeTab === 'sell' ? 'Expected Price' : 'Product Type'}</label>
              {activeTab === 'sell' ? (
                <input 
                  type="text" 
                  value={expectedPrice}
                  onChange={e => setExpectedPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" 
                  placeholder="$400" 
                />
              ) : (
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary appearance-none">
                  <option className="bg-[#1a1a1a]">Select Category</option>
                  <option className="bg-[#1a1a1a]">Batteries</option>
                  <option className="bg-[#1a1a1a]">Cables / Chargers</option>
                  <option className="bg-[#1a1a1a]">Monitors</option>
                  <option className="bg-[#1a1a1a]">General E-waste</option>
                </select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase">Condition Description</label>
            <textarea 
              value={conditionDesc}
              onChange={e => setConditionDesc(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary h-32 resize-none" 
              placeholder="Describe any scratches, dents or issues..."
            ></textarea>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">Pickup Address</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="123 Eco St, Green City" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">Preferred Time</label>
              <input type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-white/40 uppercase">Product Photos (Max 5)</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group border border-white/10">
                  <img src={img} className="w-full h-full object-cover" alt={`Upload ${idx}`} referrerPolicy="no-referrer" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-primary/50 transition-colors bg-white/5"
                >
                  <Upload className="w-6 h-6 text-white/20 mb-2" />
                  <span className="text-[10px] text-white/40 font-bold uppercase">Add Photo</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              multiple 
              className="hidden" 
            />
          </div>

          {activeTab === 'recycle' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-emerald-400 w-5 h-5" />
                <span className="text-sm font-bold text-emerald-400">Estimated Rewards</span>
              </div>
              <span className="text-xl font-bold text-emerald-400">500 Points</span>
            </div>
          )}

          <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
            {activeTab === 'sell' ? 'Post for Sale' : 'Schedule Pickup'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-card p-12 text-center max-w-sm">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/40">
                {activeTab === 'sell' ? <ShoppingBag className="text-white w-12 h-12" /> : <Recycle className="text-white w-12 h-12" />}
              </div>
              <h3 className="text-3xl font-bold mb-4">{activeTab === 'sell' ? 'Product Listed!' : 'Pickup Scheduled!'}</h3>
              <p className="text-white/40 mb-4 leading-relaxed">
                {activeTab === 'sell' 
                  ? 'Your product has been successfully listed on our marketplace. You will be notified when a buyer is interested.' 
                  : 'Our eco-agent will arrive at your address to collect the e-waste. Thank you for contributing to a greener planet!'}
              </p>
              {activeTab === 'recycle' && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
                  <div className="text-xs text-primary font-bold uppercase">Reward Points Earned</div>
                  <div className="text-3xl font-bold text-primary">+450 pts</div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Link to="/tracking" className="block w-full py-4 bg-primary text-white rounded-xl font-bold">Track Pickup</Link>
                <button onClick={() => setShowSuccess(false)} className="w-full py-4 glass text-white rounded-xl font-bold">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Dashboard = ({ user }: { user: { name: string; email: string } | null }) => {
  const stats = [
    { label: 'Items Recycled', value: '12', icon: Recycle, color: 'text-primary', trend: '+2 this month' },
    { label: 'CO₂ Saved (kg)', value: '145', icon: TrendingUp, color: 'text-emerald-400', trend: 'Top 5% user' },
    { label: 'Reward Points', value: '2,450', icon: Award, color: 'text-yellow-400', trend: 'Level 4 Eco-Hero' },
    { label: 'Active Orders', value: '2', icon: ShoppingBag, color: 'text-blue-400', trend: '1 arriving today' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl border border-primary/20">
              {user?.name[0] || 'U'}
            </div>
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white">User <span className="text-primary">Dashboard</span></h2>
              <p className="text-white/40 font-medium">Welcome back, {user?.name.split(' ')[0] || 'Eco-Hero'}! Here's your impact overview.</p>
            </div>
          </div>
        </motion.div>
        
        <div className="flex gap-4">
          <Link to="/detector" className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <Scan className="w-5 h-5" />
            New Scan
          </Link>
          <Link to="/sell-recycle" className="px-6 py-3 glass text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
            <Recycle className="w-5 h-5" />
            Recycle Item
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 group hover:border-primary/50 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.trend}</div>
            </div>
            <div className="text-3xl font-bold mb-1 text-white">{stat.value}</div>
            <div className="text-sm text-white/40 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { title: 'iPhone 13 Pro Recycled', date: '2 days ago', points: '+450 pts', status: 'Completed', icon: Recycle, color: 'text-emerald-400' },
                { title: 'MacBook Air M1 Listed', date: '5 days ago', points: 'Pending Sale', status: 'Active', icon: ShoppingBag, color: 'text-blue-400' },
                { title: 'Donation to Eco-Green', date: '1 week ago', points: '-100 pts', status: 'Completed', icon: HeartHandshake, color: 'text-pink-400' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-xs text-white/40">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("font-bold", item.points.startsWith('+') ? "text-primary" : "text-white/60")}>{item.points}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-white/20">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-xl font-bold mb-6 text-white">Eco-Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Level 4 Eco-Hero</span>
                  <span className="text-primary font-bold">2,450 / 3,000</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '81%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(0,200,150,0.5)]" 
                  />
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                You're only 550 points away from Level 5! Recycle one more device to unlock the "Green Pioneer" badge.
              </p>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all">
                View Achievements
              </button>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Support', icon: HelpCircle, path: '/support' },
                { label: 'Settings', icon: Settings, path: '/settings' },
                { label: 'Leaderboard', icon: Award, path: '/leaderboard' },
                { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
              ].map((action) => (
                <Link 
                  key={action.label}
                  to={action.path}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all text-center group"
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2 text-white/40 group-hover:text-primary transition-colors" />
                  <div className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{action.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tracking = () => {
  const [status, setStatus] = useState(1); // 0: Assigned, 1: On the way, 2: Near, 3: Picked up

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <BackButton />
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Map Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card aspect-video relative overflow-hidden rounded-3xl">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[#1a1c20]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              {/* Animated Path */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.path 
                  d="M 100 400 Q 300 350 500 400 T 800 300" 
                  fill="none" 
                  stroke="#00C896" 
                  strokeWidth="4" 
                  strokeDasharray="10,10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </svg>

              {/* Delivery Icon */}
              <motion.div 
                animate={{ 
                  x: [100, 300, 500, 800],
                  y: [400, 350, 400, 300]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 z-10"
              >
                <Truck className="text-white w-5 h-5" />
              </motion.div>

              {/* Destination Icon */}
              <div className="absolute top-[300px] left-[800px] -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <MapPin className="text-red-500 w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="font-bold">Alex Rivera</div>
                  <div className="text-xs text-white/40">Eco-Agent ID: #4421</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 uppercase font-bold">Estimated Arrival</div>
                <div className="text-xl font-bold text-primary">12 - 15 Mins</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-8">Order Status</h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-10">
                {[
                  { title: 'Agent Assigned', time: '10:30 AM', desc: 'Alex Rivera has been assigned to your request.', completed: true },
                  { title: 'On the Way', time: '10:45 AM', desc: 'Agent is currently heading to your location.', completed: status >= 1 },
                  { title: 'Near Your Location', time: 'Pending', desc: 'Agent is within 1km of your address.', completed: status >= 2 },
                  { title: 'Item Picked Up', time: 'Pending', desc: 'Device verified and collected.', completed: status >= 3 },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 relative">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 transition-colors",
                      step.completed ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-white/20"
                    )}>
                      {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className={cn("font-bold", step.completed ? "text-white" : "text-white/40")}>{step.title}</h4>
                        <span className="text-xs text-white/20">{step.time}</span>
                      </div>
                      <p className="text-sm text-white/40">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h3 className="font-bold mb-6">Order Summary</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 glass rounded-xl overflow-hidden p-2">
                <img src="https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="font-bold text-sm">iPhone 14 Pro</div>
                <div className="text-xs text-white/40">Order ID: #RL-99281</div>
              </div>
            </div>
            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Service Type</span>
                <span className="font-medium">Exchange</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Credit Applied</span>
                <span className="font-medium text-primary">-$320.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Total Paid</span>
                <span className="font-medium">$479.00</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4">Need Help?</h4>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">If you have any issues with your delivery or need to reschedule, contact our support team.</p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 glass rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">Call Agent</button>
              <button className="flex-1 py-3 glass rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">Chat Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Donation = () => {
  const [amount, setAmount] = useState('100');
  const [showSuccess, setShowSuccess] = useState(false);

  const amounts = ['50', '100', '500', '1000'];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <BackButton />
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
          <HeartHandshake className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Support <span className="text-primary">Eco Mission</span></h2>
        <p className="text-white/40 max-w-lg mx-auto leading-relaxed">
          Your contributions help us expand our recycling network and develop better AI models for e-waste management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="glass-card p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl">Select Amount</h3>
            <div className="grid grid-cols-2 gap-4">
              {amounts.map(amt => (
                <button 
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={cn(
                    "py-4 rounded-xl font-bold transition-all border",
                    amount === amt ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "glass border-white/5 text-white/40 hover:border-white/20"
                  )}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-4 outline-none focus:border-primary font-bold"
                placeholder="Custom Amount"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowSuccess(true)} className="p-4 glass rounded-xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                <Globe className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">GPay / UPI</span>
              </button>
              <button onClick={() => setShowSuccess(true)} className="p-4 glass rounded-xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                <Globe className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">Card</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <h3 className="font-bold text-xl mb-4">Impact of ₹{amount || '0'}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-primary" /></div>
                <p className="text-sm text-white/60">Prevents {Math.floor(Number(amount) * 0.5)}kg of toxic e-waste from reaching landfills.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-primary" /></div>
                <p className="text-sm text-white/60">Funds the recovery of {Math.floor(Number(amount) * 0.01)}g of precious metals.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-primary" /></div>
                <p className="text-sm text-white/60">Supports local collection agents in your community.</p>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500"><Award className="w-6 h-6" /></div>
            <div>
              <div className="font-bold text-sm">Earn 500 Eco Points</div>
              <div className="text-xs text-white/40">For every ₹100 donated to the mission.</div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-card p-12 text-center max-w-sm">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/40">
                <HeartHandshake className="text-white w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Thank You!</h3>
              <p className="text-white/40 mb-8 leading-relaxed">Your contribution of ₹{amount} has been received. Together, we are building a greener future.</p>
              <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-primary text-white rounded-xl font-bold">Back to App</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Support = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'report' | 'chat'>('faq');
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hello! How can I help you today?' }
  ]);

  const faqs = [
    { q: "How does the AI detector work?", a: "Our AI uses deep learning models trained on millions of device images to identify models and detect physical damage or wear." },
    { q: "Is my data safe when I sell a device?", a: "Yes, we provide a certified data wiping service for every device we collect. We recommend a factory reset before pickup." },
    { q: "How are reward points calculated?", a: "Points are based on the weight and type of e-waste recycled. Higher complexity items like batteries earn more points." },
    { q: "What happens to the recycled items?", a: "Items are either refurbished for resale or dismantled to recover precious metals like gold, silver, and copper." },
  ];

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;
    
    const userMsg = message;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessage("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a helpful support agent for ReLoop AI, a sustainable electronics recycling and exchange platform. 
        Answer the user's question concisely. 
        User says: ${userMsg}`,
      });
      
      setChatMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't process that. Please try again." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <BackButton />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Help & <span className="text-primary">Support</span></h2>
        <p className="text-white/40">Everything you need to know about ReLoop AI and sustainable recycling.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <Phone className="text-primary w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase font-bold tracking-widest">24/7 Helpline</div>
            <div className="text-xl font-bold">+1 (800) RELOOP-AI</div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Mail className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Email Support</div>
            <div className="text-xl font-bold">support@reloop.ai</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <div className="glass p-1 rounded-2xl flex">
          <button onClick={() => setActiveTab('faq')} className={cn("px-6 py-2 rounded-xl font-bold transition-all", activeTab === 'faq' ? "bg-primary text-white shadow-lg" : "text-white/40")}>FAQ</button>
          <button onClick={() => setActiveTab('report')} className={cn("px-6 py-2 rounded-xl font-bold transition-all", activeTab === 'report' ? "bg-primary text-white shadow-lg" : "text-white/40")}>Report Issue</button>
          <button onClick={() => setActiveTab('chat')} className={cn("px-6 py-2 rounded-xl font-bold transition-all", activeTab === 'chat' ? "bg-primary text-white shadow-lg" : "text-white/40")}>Live Chat</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'faq' && (
          <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card p-6">
                <h4 className="font-bold mb-2 flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  {faq.q}
                </h4>
                <p className="text-sm text-white/40 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'report' && (
          <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-8">
            <form className="space-y-6" onSubmit={e => { e.preventDefault(); alert("Issue reported successfully!"); setActiveTab('faq'); }}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase">Issue Category</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary appearance-none">
                    <option className="bg-[#1a1a1a]">Payment Issue</option>
                    <option className="bg-[#1a1a1a]">Pickup Delay</option>
                    <option className="bg-[#1a1a1a]">AI Detection Error</option>
                    <option className="bg-[#1a1a1a]">App Bug</option>
                    <option className="bg-[#1a1a1a]">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase">Order ID (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="#RL-12345" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Description</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary h-32 resize-none" placeholder="Tell us more about the issue..."></textarea>
              </div>
              <button className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Submit Report</button>
            </form>
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card h-[500px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"><MessageSquare className="text-white w-5 h-5" /></div>
              <div>
                <div className="font-bold">Support Agent</div>
                <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Online</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm",
                    msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white/5 text-white/80 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white/40 p-4 rounded-2xl text-xs font-bold animate-pulse">
                    Agent is typing...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary disabled:opacity-50" 
                placeholder="Type your message..." 
              />
              <button disabled={isTyping} className="p-3 bg-primary text-white rounded-xl disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Leaderboard = () => {
  const users = [
    { rank: 1, name: 'EcoMaster_99', points: '45,200', items: 142, avatar: 'EM' },
    { rank: 2, name: 'GreenLife_Sarah', points: '42,150', items: 128, avatar: 'GS' },
    { rank: 3, name: 'RecycleKing', points: '38,900', items: 115, avatar: 'RK' },
    { rank: 4, name: 'Sustainability_Pro', points: '35,400', items: 98, avatar: 'SP' },
    { rank: 5, name: 'EarthFriend_Leo', points: '32,100', items: 85, avatar: 'EL' },
    { rank: 6, name: 'John Doe', points: '2,450', items: 12, avatar: 'JD', isUser: true },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <BackButton />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Global <span className="text-primary">Leaderboard</span></h2>
        <p className="text-white/40">See how you stack up against the world's top recyclers.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {users.slice(0, 3).map((user, idx) => (
          <div key={idx} className={cn(
            "glass-card p-6 text-center relative pt-12",
            idx === 0 ? "border-primary/50 bg-primary/5 scale-110 z-10" : ""
          )}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4",
                idx === 0 ? "bg-yellow-500 border-yellow-400" : idx === 1 ? "bg-slate-400 border-slate-300" : "bg-orange-600 border-orange-500"
              )}>
                {user.avatar}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Rank {user.rank}
              </div>
            </div>
            <h4 className="font-bold mb-1 mt-4 truncate">{user.name}</h4>
            <div className="text-primary font-bold">{user.points} pts</div>
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-2">{user.items} Items</div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-white/5 grid grid-cols-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-3">User</div>
          <div className="col-span-1 text-right">Items</div>
          <div className="col-span-1 text-right">Points</div>
        </div>
        <div className="divide-y divide-white/5">
          {users.map((user, idx) => (
            <div key={idx} className={cn(
              "p-6 grid grid-cols-6 items-center transition-colors",
              user.isUser ? "bg-primary/10" : "hover:bg-white/5"
            )}>
              <div className="col-span-1 text-center font-bold text-white/40">#{user.rank}</div>
              <div className="col-span-3 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{user.avatar}</div>
                <div>
                  <div className="font-bold text-sm">{user.name}</div>
                  {user.isUser && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase">You</span>}
                </div>
              </div>
              <div className="col-span-1 text-right text-sm text-white/60">{user.items}</div>
              <div className="col-span-1 text-right font-bold text-primary">{user.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ onLogout }: { onLogout: () => void }) => {
  const [darkMode, setDarkMode] = useState(!document.body.classList.contains('light'));
  const [language, setLanguage] = useState('English (US)');
  const [notifications, setNotifications] = useState(true);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    alert(`Language changed to ${lang}`);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion requested. Our team will process it within 24 hours.");
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen">
      <BackButton />
      <h2 className="text-4xl font-bold mb-12">Settings</h2>

      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Account Settings</h3>
          <div className="glass-card divide-y divide-white/5">
            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold">Profile Information</div>
                  <div className="text-xs text-white/40">Update your name, email and photo</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20" />
            </div>
            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold">Notifications</div>
                  <div className="text-xs text-white/40">Manage your alert preferences</div>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  notifications ? "bg-primary" : "bg-white/10"
                )}
              >
                <motion.div 
                  animate={{ x: notifications ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full" 
                />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">App Preferences</h3>
          <div className="glass-card divide-y divide-white/5">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold">Theme Mode</div>
                  <div className="text-xs text-white/40">Toggle between light and dark themes</div>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  darkMode ? "bg-primary" : "bg-white/10"
                )}
              >
                <motion.div 
                  animate={{ x: darkMode ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full" 
                />
              </button>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><Languages className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold">Language</div>
                  <div className="text-xs text-white/40">Select your preferred language</div>
                </div>
              </div>
              <select 
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-sm font-bold text-primary outline-none cursor-pointer"
              >
                <option className="bg-[#1a1a1a]" value="English (US)">English (US)</option>
                <option className="bg-[#1a1a1a]" value="Spanish">Spanish</option>
                <option className="bg-[#1a1a1a]" value="French">French</option>
                <option className="bg-[#1a1a1a]" value="German">German</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Security</h3>
          <div className="glass-card divide-y divide-white/5">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-400" /></div>
                <div>
                  <div className="font-bold text-red-400">Delete Account</div>
                  <div className="text-xs text-white/40">Permanently remove your data</div>
                </div>
              </div>
              <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Delete</button>
            </div>
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full py-4 glass text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const AuthModal = ({ onClose, onLogin, isFullPage = false }: { onClose: () => void; onLogin: (user: { name: string; email: string }) => void; isFullPage?: boolean }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin({
      name: username || email.split('@')[0] || 'User',
      email: email
    });
  };

  const content = (
    <motion.div 
      initial={isFullPage ? { opacity: 0, y: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
      animate={isFullPage ? { opacity: 1, y: 0 } : { scale: 1, opacity: 1, y: 0 }}
      exit={isFullPage ? { opacity: 0, y: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
      className={cn(
        "glass-card w-full max-w-md p-10 relative overflow-hidden",
        isFullPage && "shadow-2xl shadow-primary/10 border-primary/20"
      )}
      onClick={e => e.stopPropagation()}
    >
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {!isFullPage && (
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      )}
      
      <div className="text-center mb-10 relative z-10">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 transform rotate-12">
          <Recycle className="text-white w-10 h-10 -rotate-12" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">{isLogin ? 'Welcome Back' : 'Join ReLoop'}</h2>
        <p className="text-white/40 text-sm font-medium">{isLogin ? 'Enter your credentials to continue' : 'Start your sustainable journey today'}</p>
      </div>

      <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:border-primary focus:bg-white/10 outline-none transition-all" 
                placeholder="John Doe" 
              />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:border-primary focus:bg-white/10 outline-none transition-all" 
              placeholder="name@example.com" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Password</label>
            {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot?</button>}
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:border-primary focus:bg-white/10 outline-none transition-all" 
              placeholder="••••••••" 
            />
          </div>
        </div>
        
        <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all transform active:scale-[0.98] mt-4">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-[#151619] px-4 text-white/20">Or connect with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <button onClick={() => onLogin({ name: 'Google User', email: 'google@example.com' })} className="py-3.5 glass rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5">
          <Globe className="w-5 h-5 text-blue-400" />
          Google
        </button>
        <button className="py-3.5 glass rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5">
          <Github className="w-5 h-5" />
          GitHub
        </button>
      </div>

      <p className="text-center mt-10 text-sm text-white/40 font-medium">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold ml-2 hover:underline">
          {isLogin ? 'Sign Up Free' : 'Sign In'}
        </button>
      </p>
    </motion.div>
  );

  if (isFullPage) return content;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
      onClick={onClose}
    >
      {content}
    </motion.div>
  );
};

const Footer = () => (
  <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
      <div className="col-span-2 md:col-span-1">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Recycle className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold">ReLoop AI</span>
        </Link>
        <p className="text-sm text-white/40 leading-relaxed">
          Pioneering the future of sustainable electronics through artificial intelligence and community-driven circular economy.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-6">Platform</h4>
        <ul className="space-y-4 text-sm text-white/40">
          <li><Link to="/detector" className="hover:text-primary transition-colors">AI Detector</Link></li>
          <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
          <li><Link to="/exchange" className="hover:text-primary transition-colors">Exchange</Link></li>
          <li><Link to="/sell-recycle" className="hover:text-primary transition-colors">Recycle</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Company</h4>
        <ul className="space-y-4 text-sm text-white/40">
          <li><Link to="/support" className="hover:text-primary transition-colors">About Us</Link></li>
          <li><Link to="/support" className="hover:text-primary transition-colors">Sustainability</Link></li>
          <li><Link to="/support" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          <li><Link to="/support" className="hover:text-primary transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Support</h4>
        <ul className="space-y-4 text-sm text-white/40">
          <li><Link to="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
          <li><Link to="/support" className="hover:text-primary transition-colors">Contact Us</Link></li>
          <li className="text-primary font-bold">+1 (800) RELOOP-AI</li>
          <li><Link to="/support" className="hover:text-primary transition-colors">FAQ</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-xs text-white/20">© 2026 ReLoop AI. All rights reserved.</p>
      <div className="flex gap-6">
        <Globe className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Globe className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Globe className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
      </div>
    </div>
  </footer>
);
