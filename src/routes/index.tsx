import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Home, Store, Sparkles, Package, User, Search, Bell, ShoppingCart,
  Mic, SlidersHorizontal, Heart, Star, ChevronRight, ChevronLeft,
  Truck, ShieldCheck, Banknote, Headphones, Plus, Minus, X, Send,
  Sun, Moon, ArrowRight, Tag, Zap, MapPin, CheckCircle2, Clock,
  FileText, MessageCircle, Settings, LogOut, BadgeCheck, Filter,
} from "lucide-react";

import excavator from "@/assets/excavator.jpg";
import skidsteer from "@/assets/skidsteer.jpg";
import wheelloader from "@/assets/wheelloader.jpg";
import forklift from "@/assets/forklift.jpg";
import attachment from "@/assets/attachment.jpg";
import scissorlift from "@/assets/scissorlift.jpg";
import hero1 from "@/assets/hero1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TYPHON — Heavy Equipment Marketplace" },
      { name: "description", content: "Premium iOS-style mobile commerce for heavy construction machinery, attachments and parts across the United States." },
      { property: "og:title", content: "TYPHON — Heavy Equipment Marketplace" },
      { property: "og:description", content: "Premium iOS-style mobile commerce for heavy construction machinery, attachments and parts." },
    ],
  }),
  component: App,
});

type TabKey = "home" | "shop" | "ai" | "orders" | "account";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number | null;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  stock: "In Stock" | "Low Stock" | "Pre-order";
  financing?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "TX-35 Mini Excavator", brand: "Typhon Pro", price: 38500, image: excavator, badge: "Best Seller", rating: 4.9, reviews: 142, stock: "In Stock", financing: true },
  { id: "p2", name: "SK-260 Skid Steer Loader", brand: "Typhon Pro", price: 42900, image: skidsteer, badge: "New", rating: 4.8, reviews: 88, stock: "In Stock", financing: true },
  { id: "p3", name: "WL-50 Wheel Loader", brand: "Typhon Heavy", price: 78400, image: wheelloader, badge: "Financing", rating: 4.7, reviews: 64, stock: "Low Stock", financing: true },
  { id: "p4", name: "FL-30 Diesel Forklift", brand: "Typhon Lift", price: 21500, image: forklift, badge: "Sale", rating: 4.6, reviews: 211, stock: "In Stock" },
  { id: "p5", name: 'Heavy-Duty 48" Bucket', brand: "Typhon Attach", price: 2890, image: attachment, badge: "In Stock", rating: 4.9, reviews: 73, stock: "In Stock" },
  { id: "p6", name: "SL-26 Electric Scissor Lift", brand: "Typhon Aerial", price: null, image: scissorlift, badge: "Quote", rating: 4.8, reviews: 39, stock: "Pre-order", financing: true },
];

const CATEGORIES = [
  { name: "Mini Excavator", icon: "⛏️" },
  { name: "Skid Steer", icon: "🚜" },
  { name: "Wheel Loader", icon: "🏗️" },
  { name: "Forklift", icon: "📦" },
  { name: "Road Roller", icon: "🛣️" },
  { name: "Scissor Lift", icon: "🪜" },
  { name: "Attachments", icon: "🔩" },
  { name: "Parts", icon: "⚙️" },
];

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function App() {
  const [tab, setTab] = useState<TabKey>("home");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const cartTotal = useMemo(
    () => Object.entries(cart).reduce((sum, [id, q]) => {
      const p = PRODUCTS.find(x => x.id === id);
      return sum + (p?.price ?? 0) * q;
    }, 0),
    [cart]
  );

  const addToCart = (id: string) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const decCart = (id: string) => setCart(c => {
    const next = { ...c };
    if (!next[id]) return next;
    next[id] -= 1;
    if (next[id] <= 0) delete next[id];
    return next;
  });
  const toggleFav = (id: string) => setFavs(s => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a22] via-[#0f0f15] to-[#1f1a0a] dark:from-[#0a0a10] dark:via-[#08080c] dark:to-[#15110a] py-6 px-3 md:py-10">
      {/* Studio header */}
      <div className="mx-auto mb-8 max-w-6xl flex items-center justify-between text-white/90 px-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-black text-lg shadow-[0_0_30px_rgba(255,204,0,0.5)]">T</div>
          <div>
            <div className="font-black tracking-tight text-lg leading-none">TYPHON</div>
            <div className="text-xs text-white/50 mt-1">Heavy Equipment · iOS Prototype</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            className="glass-strong rounded-full px-4 py-2 text-xs font-medium flex items-center gap-2 text-white"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[420px]">
        {/* iPhone frame */}
        <div className="relative rounded-[52px] p-[6px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_50px_120px_-20px_rgba(0,0,0,0.7)]">
          <div className="rounded-[48px] overflow-hidden bg-background relative" style={{ height: "844px" }}>
            {/* Dynamic island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-7 w-32 rounded-full bg-black" />
            <div className="absolute top-3 left-7 z-50 text-[11px] font-semibold text-foreground">9:41</div>
            <div className="absolute top-3 right-7 z-50 text-[11px] font-semibold text-foreground flex items-center gap-1">
              <span>5G</span><span>􀛨</span>
            </div>

            <Screen tab={tab} theme={theme} onOpenProduct={setSelected}
              cart={cart} favs={favs} addToCart={addToCart} toggleFav={toggleFav}
              onOpenCart={() => setCartOpen(true)} cartCount={cartCount}
              setTab={setTab}
            />

            {/* Floating AI button (not on AI tab) */}
            {tab !== "ai" && (
              <button
                onClick={() => setTab("ai")}
                className="absolute bottom-28 right-5 z-30 h-14 w-14 rounded-full glass-strong yellow-glow grid place-items-center text-foreground animate-float-in"
                aria-label="AI Assistant"
              >
                <div className="relative">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" style={{ animation: "pulse-dot 1.6s infinite" }} />
                </div>
              </button>
            )}

            {/* Bottom nav */}
            <BottomNav tab={tab} setTab={setTab} cartCount={cartCount} />
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Tap a product to open detail · Use the bottom tabs to navigate · Toggle theme above
        </p>
      </div>

      {/* Product detail modal */}
      {selected && (
        <ProductDetail
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={() => { addToCart(selected.id); setSelected(null); setCartOpen(true); }}
          isFav={favs.has(selected.id)}
          onFav={() => toggleFav(selected.id)}
        />
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart} total={cartTotal}
          onClose={() => setCartOpen(false)}
          onInc={addToCart} onDec={decCart}
        />
      )}
    </div>
  );
}

/* ===================== SCREEN ROUTER ===================== */
function Screen(props: {
  tab: TabKey; theme: string; onOpenProduct: (p: Product) => void;
  cart: Record<string, number>; favs: Set<string>;
  addToCart: (id: string) => void; toggleFav: (id: string) => void;
  onOpenCart: () => void; cartCount: number; setTab: (t: TabKey) => void;
}) {
  const { tab } = props;
  return (
    <div key={tab} className="h-full overflow-y-auto no-scrollbar pb-32 pt-12 animate-float-in">
      {tab === "home" && <HomeScreen {...props} />}
      {tab === "shop" && <ShopScreen {...props} />}
      {tab === "ai" && <AIScreen />}
      {tab === "orders" && <OrdersScreen />}
      {tab === "account" && <AccountScreen />}
    </div>
  );
}

/* ===================== HOME ===================== */
function HomeScreen(props: {
  onOpenProduct: (p: Product) => void; onOpenCart: () => void; cartCount: number;
  favs: Set<string>; addToCart: (id: string) => void; toggleFav: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="px-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="text-xl font-black tracking-tight">Build bigger, John.</h1>
        </div>
        <div className="flex items-center gap-2">
          <IconBtn><Bell className="h-4 w-4" /><Dot /></IconBtn>
          <button onClick={props.onOpenCart} className="relative">
            <IconBtn><ShoppingCart className="h-4 w-4" /></IconBtn>
            {props.cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">{props.cartCount}</span>
            )}
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 grid place-items-center text-primary-foreground font-bold text-sm">JM</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-5">
        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search excavators, skid steers..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="h-7 w-7 rounded-full bg-muted grid place-items-center"><Mic className="h-3.5 w-3.5" /></button>
          <button className="h-7 w-7 rounded-full bg-primary grid place-items-center"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></button>
        </div>
      </div>

      {/* Hero banner */}
      <div className="px-5">
        <div className="relative rounded-3xl overflow-hidden h-52 shadow-xl">
          <img src={hero1} alt="Heavy machinery" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
            <span className="self-start glass-strong rounded-full px-3 py-1 text-[10px] font-bold tracking-widest">SUMMER SAVINGS</span>
            <div>
              <h2 className="text-2xl font-black leading-tight">Compactors & Rollers<br />Up to 15% off</h2>
              <button className="mt-3 inline-flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-bold">
                Shop Now <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="absolute bottom-3 right-5 flex gap-1">
              <span className="h-1.5 w-6 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5">
        <SectionTitle title="Categories" action="See all" />
        <div className="grid grid-cols-4 gap-3 mt-3">
          {CATEGORIES.slice(0, 8).map(c => (
            <button key={c.name} className="flex flex-col items-center gap-1.5">
              <div className="h-14 w-14 rounded-2xl bg-card border grid place-items-center text-2xl shadow-sm">{c.icon}</div>
              <span className="text-[10px] text-muted-foreground font-medium leading-tight text-center">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="px-5">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: ShieldCheck, label: "Warranty" },
            { icon: Truck, label: "US Ship" },
            { icon: Banknote, label: "Finance" },
            { icon: Headphones, label: "24/7" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass rounded-xl p-2 flex flex-col items-center gap-1">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flash deals */}
      <div>
        <div className="px-5 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary fill-primary" />
            <h3 className="font-black">Flash Deals</h3>
            <span className="glass rounded-full px-2 py-0.5 text-[10px] font-bold">02:14:33</span>
          </div>
          <button className="text-xs text-muted-foreground">All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {PRODUCTS.slice(0, 4).map(p => (
            <FlashCard key={p.id} p={p} onClick={() => props.onOpenProduct(p)} />
          ))}
        </div>
      </div>

      {/* Featured grid */}
      <div className="px-5">
        <SectionTitle title="Featured Equipment" action="See all" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {PRODUCTS.slice(0, 4).map(p => (
            <ProductCard key={p.id} p={p}
              onClick={() => props.onOpenProduct(p)}
              fav={props.favs.has(p.id)}
              onFav={() => props.toggleFav(p.id)}
              onAdd={() => props.addToCart(p.id)}
            />
          ))}
        </div>
      </div>

      {/* AI recommendation card */}
      <div className="px-5">
        <div className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-primary/20 via-card to-card border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold tracking-wider">TYPHON AI</span>
          </div>
          <h3 className="font-black text-lg leading-tight">Need help picking a machine?</h3>
          <p className="text-xs text-muted-foreground mt-1">Tell our AI expert about your job site and we'll match you with the perfect fit.</p>
          <button className="mt-3 bg-foreground text-background rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-1">
            Talk to AI Expert <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* New arrivals horizontal */}
      <div>
        <div className="px-5 mb-2">
          <SectionTitle title="New Arrivals" action="See all" />
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {PRODUCTS.slice(2, 6).map(p => (
            <div key={p.id} className="min-w-[160px] max-w-[160px]">
              <ProductCard p={p}
                onClick={() => props.onOpenProduct(p)}
                fav={props.favs.has(p.id)}
                onFav={() => props.toggleFav(p.id)}
                onAdd={() => props.addToCart(p.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Financing CTA */}
      <div className="px-5">
        <div className="rounded-3xl bg-foreground text-background p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary grid place-items-center text-primary-foreground">
            <Banknote className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-black">Financing from 4.9%</h3>
            <p className="text-xs opacity-70">Pre-approved in 60 seconds</p>
          </div>
          <ChevronRight className="h-5 w-5 opacity-70" />
        </div>
      </div>
    </div>
  );
}

/* ===================== SHOP ===================== */
function ShopScreen(props: {
  onOpenProduct: (p: Product) => void;
  favs: Set<string>; addToCart: (id: string) => void; toggleFav: (id: string) => void;
}) {
  const tabs = ["All", "Equipment", "Attachments", "Parts", "Deals", "Used"];
  const [active, setActive] = useState("All");
  return (
    <div className="space-y-4">
      <div className="px-5">
        <h1 className="text-2xl font-black tracking-tight">Shop</h1>
        <p className="text-xs text-muted-foreground">2,419 products available</p>
      </div>
      <div className="px-5">
        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search 2,419 products..." className="flex-1 bg-transparent text-sm outline-none" />
          <Filter className="h-4 w-4" />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5">
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold border transition-all ${
              active === t ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground"
            }`}>{t}</button>
        ))}
      </div>

      {/* Sort row */}
      <div className="px-5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Sorted by <span className="text-foreground font-semibold">Best Match</span></span>
        <button className="glass rounded-full px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1">
          <SlidersHorizontal className="h-3 w-3" /> Filters · 3
        </button>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3">
        {PRODUCTS.map(p => (
          <ProductCard key={p.id} p={p}
            onClick={() => props.onOpenProduct(p)}
            fav={props.favs.has(p.id)}
            onFav={() => props.toggleFav(p.id)}
            onAdd={() => props.addToCart(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ===================== AI ===================== */
function AIScreen() {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hi John — I'm your Typhon equipment expert. What are you trying to get done?" },
  ]);
  const [input, setInput] = useState("");
  const prompts = [
    "Which mini excavator is best for landscaping?",
    "Compare TX-35 vs SK-260",
    "Estimate shipping to 75201",
    "Track my order #84219",
  ];
  const send = (t?: string) => {
    const text = (t ?? input).trim(); if (!text) return;
    setMsgs(m => [...m, { role: "user", text }, { role: "ai", text: "For landscaping under 2 acres I'd recommend the TX-35 Mini Excavator — compact, 24 HP, and ships free in Texas. Want a finance quote?" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Online · Equipment Expert</p>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Typhon AI
          </h1>
        </div>
        <IconBtn><Settings className="h-4 w-4" /></IconBtn>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "glass rounded-bl-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Recommendation card in chat */}
        {msgs.length > 1 && (
          <div className="glass rounded-2xl p-3 flex gap-3 items-center">
            <img src={excavator} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Recommended</p>
              <p className="font-bold text-sm">TX-35 Mini Excavator</p>
              <p className="text-xs text-primary font-bold">{fmt(38500)}</p>
            </div>
            <button className="rounded-full bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1.5">View</button>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {prompts.map(p => (
          <button key={p} onClick={() => send(p)} className="shrink-0 glass rounded-full px-3 py-1.5 text-[11px] text-muted-foreground">
            {p}
          </button>
        ))}
      </div>

      <div className="px-5 pb-3">
        <div className="glass-strong rounded-full flex items-center gap-2 pl-4 pr-1.5 py-1.5">
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Message Typhon AI..."
            className="flex-1 bg-transparent text-sm outline-none py-1.5"
          />
          <button onClick={() => send()} className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== ORDERS ===================== */
function OrdersScreen() {
  const orders = [
    { id: "84219", name: "TX-35 Mini Excavator", price: 38500, image: excavator, status: "In Transit", step: 5 },
    { id: "84102", name: "SK-260 Skid Steer", price: 42900, image: skidsteer, status: "Delivered", step: 9 },
    { id: "83992", name: '48" Bucket Attachment', price: 2890, image: attachment, status: "Preparing", step: 3 },
  ];
  return (
    <div className="space-y-4">
      <div className="px-5">
        <h1 className="text-2xl font-black tracking-tight">My Orders</h1>
        <p className="text-xs text-muted-foreground">3 active · 12 completed</p>
      </div>
      <div className="px-5 flex gap-2">
        {["Active", "Past", "Quotes"].map((t, i) => (
          <button key={t} className={`flex-1 rounded-2xl py-2.5 text-xs font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "glass"}`}>{t}</button>
        ))}
      </div>

      <div className="px-5 space-y-3">
        {orders.map(o => (
          <div key={o.id} className="glass rounded-2xl p-3 space-y-3">
            <div className="flex items-center gap-3">
              <img src={o.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Order #{o.id}</p>
                <p className="font-bold text-sm leading-tight">{o.name}</p>
                <p className="text-xs text-primary font-bold mt-0.5">{fmt(o.price)}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                o.status === "Delivered" ? "bg-success/15 text-success" :
                o.status === "In Transit" ? "bg-primary/20 text-foreground" : "bg-warning/15 text-warning"
              }`}>{o.status}</span>
            </div>

            <Timeline step={o.step} />

            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-foreground text-background text-xs font-bold py-2">Track</button>
              <button className="flex-1 rounded-xl bg-muted text-foreground text-xs font-bold py-2 flex items-center justify-center gap-1">
                <MessageCircle className="h-3 w-3" /> Support
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ step }: { step: number }) {
  const stages = ["Received", "Paid", "Prep", "Ready", "Transit", "Port", "Customs", "Out", "Done"];
  return (
    <div className="relative">
      <div className="absolute top-2 left-2 right-2 h-0.5 bg-border" />
      <div className="absolute top-2 left-2 h-0.5 bg-primary transition-all" style={{ width: `calc((100% - 16px) * ${step / (stages.length - 1)})` }} />
      <div className="relative flex justify-between">
        {stages.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className={`h-4 w-4 rounded-full border-2 ${i <= step ? "bg-primary border-primary" : "bg-card border-border"}`} />
            <span className={`text-[8px] font-semibold ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== ACCOUNT ===================== */
function AccountScreen() {
  const items = [
    { icon: Heart, label: "Favorites", count: 12 },
    { icon: FileText, label: "My Quotes", count: 3 },
    { icon: MapPin, label: "Addresses", count: 2 },
    { icon: Bell, label: "Notifications" },
    { icon: BadgeCheck, label: "Verified Business" },
    { icon: Settings, label: "Settings" },
    { icon: Headphones, label: "Help & Support" },
    { icon: LogOut, label: "Sign Out", danger: true },
  ];
  return (
    <div className="space-y-5">
      <div className="px-5">
        <h1 className="text-2xl font-black tracking-tight">Account</h1>
      </div>

      <div className="px-5">
        <div className="glass rounded-3xl p-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-yellow-600 grid place-items-center text-primary-foreground font-black text-xl">JM</div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-black">John Miller</p>
              <BadgeCheck className="h-4 w-4 text-primary fill-primary text-primary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Miller Construction Co.</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Dallas, TX · Member since 2024</p>
          </div>
          <button className="text-xs font-bold text-primary">Edit</button>
        </div>
      </div>

      <div className="px-5 grid grid-cols-3 gap-3">
        {[
          { label: "Orders", value: "15" },
          { label: "Saved", value: "12" },
          { label: "Quotes", value: "3" },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-3 text-center">
            <p className="text-xl font-black">{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 space-y-1">
        {items.map(({ icon: Icon, label, count, danger }) => (
          <button key={label} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-muted transition-colors">
            <div className={`h-9 w-9 rounded-xl grid place-items-center ${danger ? "bg-error/10 text-error" : "bg-muted text-foreground"}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className={`flex-1 text-left text-sm font-semibold ${danger ? "text-error" : ""}`}>{label}</span>
            {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================== COMPONENTS ===================== */
function BottomNav({ tab, setTab, cartCount }: { tab: TabKey; setTab: (t: TabKey) => void; cartCount: number }) {
  const items: { key: TabKey; label: string; icon: typeof Home }[] = [
    { key: "home", label: "Home", icon: Home },
    { key: "shop", label: "Shop", icon: Store },
    { key: "ai", label: "AI", icon: Sparkles },
    { key: "orders", label: "Orders", icon: Package },
    { key: "account", label: "Account", icon: User },
  ];
  return (
    <div className="absolute bottom-4 left-4 right-4 z-40">
      <div className="glass-strong rounded-[32px] p-1.5 flex items-center justify-between">
        {items.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-[26px] transition-all duration-300 ${
                active ? "bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(255,204,0,0.45)]" : "text-muted-foreground"
              }`}>
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? "" : ""}`} strokeWidth={active ? 2.5 : 2} />
                {key === "orders" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 h-3.5 min-w-3.5 px-1 rounded-full bg-error text-white text-[9px] font-bold grid place-items-center">{cartCount}</span>
                )}
              </div>
              <span className={`text-[9px] font-bold ${active ? "" : ""}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="relative glass rounded-full h-10 w-10 grid place-items-center text-foreground">
      {children}
    </button>
  );
}
function Dot() {
  return <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error border border-background" />;
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-black text-base tracking-tight">{title}</h3>
      {action && <button className="text-xs text-muted-foreground font-semibold flex items-center gap-0.5">{action} <ChevronRight className="h-3 w-3" /></button>}
    </div>
  );
}

function ProductCard({ p, onClick, fav, onFav, onAdd }: {
  p: Product; onClick: () => void; fav: boolean; onFav: () => void; onAdd: () => void;
}) {
  return (
    <div className="relative bg-card border rounded-2xl overflow-hidden flex flex-col">
      <button onClick={onClick} className="relative aspect-square bg-muted">
        <img src={p.image} alt={p.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        {p.badge && (
          <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-black tracking-wide ${
            p.badge === "Sale" ? "bg-error text-white" :
            p.badge === "New" ? "bg-foreground text-background" :
            p.badge === "Best Seller" ? "bg-primary text-primary-foreground" :
            "glass-strong"
          }`}>{p.badge.toUpperCase()}</span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onFav(); }}
          className="absolute top-2 right-2 h-7 w-7 rounded-full glass-strong grid place-items-center">
          <Heart className={`h-3.5 w-3.5 ${fav ? "fill-error text-error" : ""}`} />
        </button>
      </button>
      <div className="p-2.5 space-y-1.5">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">{p.brand}</p>
        <p className="text-xs font-bold leading-tight line-clamp-2 min-h-[2rem]">{p.name}</p>
        <div className="flex items-center gap-1 text-[10px]">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-bold">{p.rating}</span>
          <span className="text-muted-foreground">({p.reviews})</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div>
            {p.price ? (
              <p className="font-black text-sm">{fmt(p.price)}</p>
            ) : (
              <p className="text-[11px] font-black text-primary">Request Quote</p>
            )}
            <p className="text-[9px] text-success font-semibold">{p.stock}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="h-8 w-8 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FlashCard({ p, onClick }: { p: Product; onClick: () => void }) {
  return (
    <button onClick={onClick} className="shrink-0 w-36 bg-card border rounded-2xl overflow-hidden text-left">
      <div className="relative aspect-square bg-muted">
        <img src={p.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute top-2 left-2 bg-error text-white text-[9px] font-black rounded-full px-2 py-0.5">-15%</span>
      </div>
      <div className="p-2">
        <p className="text-[11px] font-bold leading-tight line-clamp-1">{p.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-black text-sm text-primary">{p.price ? fmt(p.price * 0.85) : "Quote"}</span>
        </div>
      </div>
    </button>
  );
}

/* ===================== PRODUCT DETAIL ===================== */
function ProductDetail({ product, onClose, onAdd, isFav, onFav }: {
  product: Product; onClose: () => void; onAdd: () => void; isFav: boolean; onFav: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 md:p-6 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto no-scrollbar bg-background rounded-[40px] border shadow-2xl">
        {/* image */}
        <div className="relative aspect-square bg-muted">
          <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
          <button onClick={onClose} className="absolute top-4 left-4 h-10 w-10 glass-strong rounded-full grid place-items-center">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={onFav} className="absolute top-4 right-4 h-10 w-10 glass-strong rounded-full grid place-items-center">
            <Heart className={`h-5 w-5 ${isFav ? "fill-error text-error" : ""}`} />
          </button>
          <div className="absolute bottom-4 right-4 glass-strong rounded-full px-3 py-1.5 text-[10px] font-bold flex gap-1">
            <span className="text-foreground">1</span><span className="text-muted-foreground">/ 6</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{product.brand}</p>
            <h2 className="text-2xl font-black tracking-tight mt-0.5">{product.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-xs font-bold">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-success font-bold">{product.stock}</span>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-b py-4">
            <div>
              {product.price ? (
                <>
                  <p className="text-3xl font-black">{fmt(product.price)}</p>
                  {product.financing && <p className="text-xs text-muted-foreground mt-0.5">or <span className="text-foreground font-bold">{fmt(Math.round(product.price / 60))}/mo</span> · 60mo @ 4.9%</p>}
                </>
              ) : (
                <p className="text-2xl font-black text-primary">Request Quote</p>
              )}
            </div>
            <span className="glass rounded-full px-3 py-1.5 text-[10px] font-bold flex items-center gap-1">
              <Truck className="h-3 w-3" /> Free Shipping
            </span>
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Specs</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Engine", v: "24 HP Diesel" },
                { l: "Weight", v: "7,800 lbs" },
                { l: "Dig Depth", v: "10 ft 2 in" },
                { l: "Warranty", v: "2 yr / 2000h" },
              ].map(s => (
                <div key={s.l} className="bg-card border rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold">{s.l}</p>
                  <p className="text-sm font-bold mt-0.5">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compact and powerful, engineered for landscaping, utility work, and tight job sites. Tier 4 Final diesel, hydraulic thumb-ready, and backed by Typhon's nationwide service network.
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: ShieldCheck, l: "2yr Warranty" },
              { icon: BadgeCheck, l: "Verified" },
              { icon: Banknote, l: "Financing" },
            ].map(({ icon: Icon, l }) => (
              <div key={l} className="glass rounded-xl p-2 flex flex-col items-center gap-1">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-center">{l}</span>
              </div>
            ))}
          </div>

          {/* Ask AI */}
          <button className="w-full glass-strong rounded-2xl p-3 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex-1 text-left">
              <p className="font-bold text-sm">Ask AI about this machine</p>
              <p className="text-[10px] text-muted-foreground">Specs, compatibility, financing...</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="h-20" />
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 left-0 right-0 p-4 glass-strong rounded-b-[40px] flex gap-2">
          <button className="flex-1 rounded-2xl bg-muted text-foreground font-bold py-3 text-xs flex items-center justify-center gap-1">
            <Tag className="h-3.5 w-3.5" /> Quote
          </button>
          <button onClick={onAdd} className="flex-[2] rounded-2xl bg-foreground text-background font-bold py-3 text-xs">
            Add to Cart
          </button>
          <button onClick={onAdd} className="flex-[2] rounded-2xl bg-primary text-primary-foreground font-black py-3 text-xs">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== CART DRAWER ===================== */
function CartDrawer({ cart, total, onClose, onInc, onDec }: {
  cart: Record<string, number>; total: number;
  onClose: () => void; onInc: (id: string) => void; onDec: (id: string) => void;
}) {
  const items = Object.entries(cart).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id)!, q }));
  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-end md:place-items-center p-3 md:p-6 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">Your Cart</h2>
            <p className="text-xs text-muted-foreground">{items.length} items</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto no-scrollbar">
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-muted grid place-items-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-bold">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Add equipment to get started</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map(({ p, q }) => (
                <div key={p.id} className="flex gap-3 items-center bg-card border rounded-2xl p-3">
                  <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                    <p className="text-sm font-black text-primary mt-0.5">{p.price ? fmt(p.price) : "Quote"}</p>
                  </div>
                  <div className="glass rounded-full flex items-center gap-1 p-1">
                    <button onClick={() => onDec(p.id)} className="h-6 w-6 rounded-full grid place-items-center"><Minus className="h-3 w-3" /></button>
                    <span className="text-xs font-bold w-4 text-center">{q}</span>
                    <button onClick={() => onInc(p.id)} className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">{fmt(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-bold text-success">FREE</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black">{fmt(total)}</span>
            </div>
            <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-4 flex items-center justify-center gap-2">
              Checkout <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full rounded-2xl bg-muted text-foreground font-bold py-3 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Request Financing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
