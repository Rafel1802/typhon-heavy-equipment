import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home, Store, Sparkles, Package, User, Search, Bell, ShoppingCart,
  Mic, SlidersHorizontal, Heart, Star, ChevronRight, ChevronLeft,
  Truck, ShieldCheck, Banknote, Headphones, Plus, Minus, X, Send,
  Sun, Moon, ArrowRight, Tag, Zap, MapPin, CheckCircle2, Clock,
  FileText, MessageCircle, Settings, LogOut, BadgeCheck, Filter,
  Shield, Wallet, CreditCard, RotateCcw, Eye, Gift, Receipt, Camera,
} from "lucide-react";

import excavator from "@/assets/excavator.jpg";
import skidsteer from "@/assets/skidsteer.jpg";
import wheelloader from "@/assets/wheelloader.jpg";
import forklift from "@/assets/forklift.jpg";
import attachment from "@/assets/attachment.jpg";
import scissorlift from "@/assets/scissorlift.jpg";
import hero1 from "@/assets/hero1.jpg";

import {
  AuthScreen, CheckoutFlow, OrderPlaced, CouponsScreen,
  AdminDashboard, NotificationsSheet, SettingsScreen,
} from "@/components/typhon-extras";
import {
  ProfileEditSheet, HelpSupportSheet, ShareEarnSheet, WishlistSheet,
  FollowingSheet, HistorySheet, WalletSheet, AddressesSheet, QuotesSheet,
  VerifiedSheet, SearchDropdown, HeroSlideshow,
} from "@/components/typhon-panels";
import { useAIConfig, useBanners, useChatSessions, useProfile, useRecentlyViewed, useWishlist, type Banner, type ChatMsg, type ChatSession } from "@/lib/typhon-store";
import { useI18n, LANGUAGES } from "@/lib/i18n";

type PanelKey = "profile" | "help" | "share" | "wishlist" | "following" | "history" | "wallet" | "addresses" | "quotes" | "verified" | null;

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
  category: string;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "TX-35 Mini Excavator", brand: "Typhon Pro", price: 38500, image: excavator, badge: "Best Seller", rating: 4.9, reviews: 142, stock: "In Stock", financing: true, category: "Mini Excavator" },
  { id: "p2", name: "SK-260 Skid Steer Loader", brand: "Typhon Pro", price: 42900, image: skidsteer, badge: "New", rating: 4.8, reviews: 88, stock: "In Stock", financing: true, category: "Skid Steer" },
  { id: "p3", name: "WL-50 Wheel Loader", brand: "Typhon Heavy", price: 78400, image: wheelloader, badge: "Financing", rating: 4.7, reviews: 64, stock: "Low Stock", financing: true, category: "Wheel Loader" },
  { id: "p4", name: "FL-30 Diesel Forklift", brand: "Typhon Lift", price: 21500, image: forklift, badge: "Sale", rating: 4.6, reviews: 211, stock: "In Stock", category: "Forklift" },
  { id: "p5", name: 'Heavy-Duty 48" Bucket', brand: "Typhon Attach", price: 2890, image: attachment, badge: "In Stock", rating: 4.9, reviews: 73, stock: "In Stock", category: "Attachments" },
  { id: "p6", name: "SL-26 Electric Scissor Lift", brand: "Typhon Aerial", price: null, image: scissorlift, badge: "Quote", rating: 4.8, reviews: 39, stock: "Pre-order", financing: true, category: "Scissor Lift" },
  { id: "p7", name: "RR-12 Tandem Road Roller", brand: "Typhon Heavy", price: 56800, image: wheelloader, badge: "New", rating: 4.7, reviews: 28, stock: "In Stock", financing: true, category: "Road Roller" },
  { id: "p8", name: "Hydraulic Quick Coupler", brand: "Typhon Parts", price: 1290, image: attachment, rating: 4.8, reviews: 54, stock: "In Stock", category: "Parts" },
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
  const [cartOpen, setCartOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartBounce, setCartBounce] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelKey>(null);

  const [wishlist, setWishlist] = useWishlist();
  const [, setRecentlyViewed] = useRecentlyViewed();
  const [profile] = useProfile({
    name: "John Miller", company: "Miller Construction Co.", location: "Dallas, TX",
    initials: "JM", email: "john@millerco.com", phone: "+1 (214) 555-0142",
  });
  const defaultBanners: Banner[] = [
    { id: "b1", title: "Compactors & Rollers\nUp to 15% off", subtitle: "Summer Savings", cta: "Shop Now", image: hero1, live: true },
    { id: "b2", title: "TX-35 Mini Excavator\nNew arrival", subtitle: "Just landed", cta: "Discover", image: excavator, live: true },
    { id: "b3", title: "WL-50 Wheel Loader\n0% APR · 12 months", subtitle: "Financing", cta: "Get pre-approved", image: wheelloader, live: true },
  ];
  const [banners] = useBanners(defaultBanners);
  const liveBanners = useMemo(() => banners.filter(b => b.live), [banners]);

  const favs = useMemo(() => new Set(wishlist), [wishlist]);

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

  const addToCart = (id: string) => {
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    setCartBounce(n => n + 1);
  };
  const decCart = (id: string) => setCart(c => {
    const next = { ...c };
    if (!next[id]) return next;
    next[id] -= 1;
    if (next[id] <= 0) delete next[id];
    return next;
  });
  const toggleFav = (id: string) => setWishlist(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);

  const openProduct = (p: Product) => {
    setSelected(p);
    setRecentlyViewed(prev => [p.id, ...prev.filter(x => x !== p.id)].slice(0, 20));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1530] via-[#070d1e] to-[#0a1a3a] dark:from-[#050a18] dark:via-[#03060f] dark:to-[#06122a] py-6 px-3 md:py-10">
      {/* Studio header */}
      <div className="mx-auto mb-8 max-w-6xl flex items-center justify-between text-white/90 px-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-black text-lg shadow-[0_0_30px_rgba(10,132,255,0.55)]">T</div>
          <div>
            <div className="font-black tracking-tight text-lg leading-none">TYPHON</div>
            <div className="text-xs text-white/50 mt-1">Heavy Equipment · iOS Prototype</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdmin(a => !a)}
            className={`glass-strong rounded-full px-4 py-2 text-xs font-medium flex items-center gap-2 ${isAdmin ? "text-primary" : "text-white"}`}
          >
            <Shield className="h-3.5 w-3.5" />
            {isAdmin ? "Admin" : "Customer"}
          </button>
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

            <Screen tab={tab} theme={theme} onOpenProduct={openProduct}
              cart={cart} favs={favs} addToCart={addToCart} toggleFav={toggleFav}
              onOpenCart={() => setCartOpen(true)} cartCount={cartCount}
              setTab={setTab}
              onOpenAuth={() => setShowAuth(true)}
              onOpenCoupons={() => setShowCoupons(true)}
              onOpenAdmin={() => setShowAdmin(true)}
              onOpenNotifs={() => setShowNotifs(true)}
              onOpenSettings={() => setShowSettings(true)}
              signedIn={signedIn}
              isAdmin={isAdmin}
              onSignOut={() => setSignedIn(false)}
              cartBounce={cartBounce}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              openPanel={setPanel}
              profile={profile}
              banners={liveBanners}
            />


            {/* Floating AI button (not on AI tab) */}
            {tab !== "ai" && (
              <div className="absolute bottom-28 right-5 z-30 group">
                <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-foreground text-background text-[11px] font-black tracking-wider px-3 py-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-lg">
                  TYPHON CHAT BOT
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-2 w-2 rotate-45 bg-foreground" />
                </span>
                <button
                  onClick={() => setTab("ai")}
                  className="h-14 w-14 rounded-full glass-strong yellow-glow grid place-items-center text-foreground animate-float-in"
                  aria-label="TYPHON CHAT BOT"
                  title="TYPHON CHAT BOT"
                >
                  <div className="relative">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" style={{ animation: "pulse-dot 1.6s infinite" }} />
                  </div>
                </button>
              </div>
            )}

            {/* Admin floating button */}
            {isAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                className="absolute bottom-28 left-5 z-30 h-14 w-14 rounded-full bg-foreground text-background grid place-items-center shadow-2xl animate-float-in"
                aria-label="Admin"
              >
                <Shield className="h-6 w-6 text-primary" />
              </button>
            )}

            {/* Bottom nav */}
            <BottomNav tab={tab} setTab={setTab} cartCount={cartCount} />
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Toggle Admin / Customer above · Tap product cards · Bottom nav switches screens
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
          onCheckout={() => { setCartOpen(false); setShowCheckout(true); }}
        />
      )}

      {showAuth && (
        <AuthScreen
          onClose={() => setShowAuth(false)}
          onSuccess={() => { setSignedIn(true); setShowAuth(false); }}
        />
      )}
      {showCheckout && (
        <CheckoutFlow
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onPlaced={() => { setCart({}); setShowCheckout(false); setShowOrderPlaced(true); }}
        />
      )}
      {showOrderPlaced && <OrderPlaced onClose={() => { setShowOrderPlaced(false); setTab("orders"); }} />}
      {showCoupons && <CouponsScreen onClose={() => setShowCoupons(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      {showNotifs && <NotificationsSheet onClose={() => setShowNotifs(false)} />}
      {showSettings && <SettingsScreen onClose={() => setShowSettings(false)} onSignOut={() => { setSignedIn(false); setShowSettings(false); }} />}

      {/* Wired sub-screens */}
      {panel === "profile" && <ProfileEditSheet onClose={() => setPanel(null)} />}
      {panel === "help" && <HelpSupportSheet onClose={() => setPanel(null)} />}
      {panel === "share" && <ShareEarnSheet onClose={() => setPanel(null)} />}
      {panel === "wishlist" && <WishlistSheet onClose={() => setPanel(null)} products={PRODUCTS} onOpenProduct={(p) => { const full = PRODUCTS.find(x => x.id === p.id); if (full) { setPanel(null); openProduct(full); } }} />}
      {panel === "following" && <FollowingSheet onClose={() => setPanel(null)} />}
      {panel === "history" && <HistorySheet onClose={() => setPanel(null)} products={PRODUCTS} onOpenProduct={(p) => { const full = PRODUCTS.find(x => x.id === p.id); if (full) { setPanel(null); openProduct(full); } }} />}
      {panel === "wallet" && <WalletSheet onClose={() => setPanel(null)} />}
      {panel === "addresses" && <AddressesSheet onClose={() => setPanel(null)} />}
      {panel === "quotes" && <QuotesSheet onClose={() => setPanel(null)} />}
      {panel === "verified" && <VerifiedSheet onClose={() => setPanel(null)} />}
    </div>
  );
}

/* ===================== SCREEN ROUTER ===================== */
function Screen(props: {
  tab: TabKey; theme: string; onOpenProduct: (p: Product) => void;
  cart: Record<string, number>; favs: Set<string>;
  addToCart: (id: string) => void; toggleFav: (id: string) => void;
  onOpenCart: () => void; cartCount: number; setTab: (t: TabKey) => void;
  onOpenAuth: () => void; onOpenCoupons: () => void; onOpenAdmin: () => void;
  onOpenNotifs: () => void; onOpenSettings: () => void;
  signedIn: boolean; isAdmin: boolean; onSignOut: () => void;
  cartBounce?: number;
  categoryFilter: string | null;
  setCategoryFilter: (c: string | null) => void;
  openPanel: (k: PanelKey) => void;
  profile: { name: string; company: string; location: string; initials: string; avatar?: string; cover?: string };
  banners: Banner[];
}) {
  const { tab } = props;
  const openCategory = (c: string) => { props.setCategoryFilter(c); props.setTab("shop"); };
  return (
    <div key={tab} className="h-full overflow-y-auto no-scrollbar pb-32 pt-12 animate-float-in">
      {tab === "home" && <HomeScreen {...props} openCategory={openCategory} />}
      {tab === "shop" && <ShopScreen {...props} />}
      {tab === "ai" && <AIScreen onOpenProduct={props.onOpenProduct} addToCart={props.addToCart} />}
      {tab === "orders" && <OrdersScreen />}
      {tab === "account" && <AccountScreen {...props} />}
    </div>
  );
}

/* ===================== HOME ===================== */
function HomeScreen(props: {
  onOpenProduct: (p: Product) => void; onOpenCart: () => void; cartCount: number;
  favs: Set<string>; addToCart: (id: string) => void; toggleFav: (id: string) => void;
  onOpenNotifs?: () => void; setTab?: (t: TabKey) => void; cartBounce?: number;
  openCategory?: (c: string) => void;
  profile?: { name: string; initials: string; avatar?: string };
  banners?: Banner[];
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const firstName = (props.profile?.name ?? "John Miller").split(" ")[0];
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="px-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="text-xl font-black tracking-tight">Build bigger, {firstName}.</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={props.onOpenNotifs}>
            <IconBtn><Bell className="h-4 w-4" /><Dot /></IconBtn>
          </button>
          <button onClick={props.onOpenCart} className="relative">
            <span key={props.cartBounce ?? 0} className={props.cartBounce ? "inline-block animate-cart-bounce" : "inline-block"}>
              <IconBtn><ShoppingCart className="h-4 w-4" /></IconBtn>
            </span>
            {props.cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">{props.cartCount}</span>
            )}
          </button>
          <button onClick={() => props.setTab?.("account")} className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-primary-foreground font-bold text-sm overflow-hidden">
            {props.profile?.avatar ? <img src={props.profile.avatar} alt="" className="h-full w-full object-cover" /> : props.profile?.initials ?? "JM"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5">
        <div className="relative">
          <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search excavators, skid steers..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="h-7 w-7 rounded-full bg-muted grid place-items-center"><Mic className="h-3.5 w-3.5" /></button>
            <button onClick={() => props.setTab?.("ai")} className="h-7 w-7 rounded-full bg-primary grid place-items-center"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></button>
          </div>
          {focused && query && (
            <SearchDropdown
              query={query}
              products={PRODUCTS}
              onPick={(p) => { const full = PRODUCTS.find(x => x.id === p.id); if (full) props.onOpenProduct(full); setQuery(""); }}
              onClose={() => setQuery("")}
            />
          )}
        </div>
      </div>

      {/* Hero slideshow */}
      <div className="px-5">
        <HeroSlideshow slides={props.banners ?? []} fallback={hero1} onShop={() => props.setTab?.("shop")} />
      </div>


      {/* Categories */}
      <div className="px-5">
        <SectionTitle title="Categories" action="See all" onAction={() => props.setTab?.("shop")} />
        <div className="grid grid-cols-4 gap-3 mt-3">
          {CATEGORIES.slice(0, 8).map(c => (
            <button
              key={c.name}
              onClick={() => props.openCategory?.(c.name)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="h-14 w-14 rounded-2xl bg-card border grid place-items-center text-2xl shadow-sm hover:border-primary hover:shadow-[0_4px_20px_rgba(10,132,255,0.25)] transition-all">{c.icon}</div>
              <span className="text-[10px] text-muted-foreground font-medium leading-tight text-center">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="px-5">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: ShieldCheck, label: "Warranty", q: "What is your warranty?" },
            { icon: Truck, label: "US Ship", q: "Tell me about shipping" },
            { icon: Banknote, label: "Finance", q: "Financing options" },
            { icon: Headphones, label: "24/7", q: "How do I contact support?" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => props.setTab?.("ai")} className="glass rounded-xl p-2 flex flex-col items-center gap-1 active:scale-95 transition-transform">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
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
  categoryFilter?: string | null;
  setCategoryFilter?: (c: string | null) => void;
}) {
  const cats = ["All", ...CATEGORIES.map(c => c.name)];
  const active = props.categoryFilter ?? "All";
  const setActive = (c: string) => props.setCategoryFilter?.(c === "All" ? null : c);
  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === active);
  return (
    <div className="space-y-4">
      <div className="px-5">
        <h1 className="text-2xl font-black tracking-tight">Shop</h1>
        <p className="text-xs text-muted-foreground">{filtered.length} of {PRODUCTS.length} products{active !== "All" ? ` · ${active}` : ""}</p>
      </div>
      <div className="px-5">
        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder={`Search ${active === "All" ? "all" : active}...`} className="flex-1 bg-transparent text-sm outline-none" />
          <Filter className="h-4 w-4" />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5">
        {cats.map(t => (
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

      {filtered.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-muted grid place-items-center text-2xl">🔍</div>
          <p className="mt-3 font-bold text-sm">No products in {active}</p>
          <button onClick={() => setActive("All")} className="mt-3 text-xs text-primary font-bold">Show all products</button>
        </div>
      ) : (
        <div className="px-5 grid grid-cols-2 gap-3">
          {filtered.map(p => (
            <ProductCard key={p.id} p={p}
              onClick={() => props.onOpenProduct(p)}
              fav={props.favs.has(p.id)}
              onFav={() => props.toggleFav(p.id)}
              onAdd={() => props.addToCart(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


/* ===================== AI ===================== */
type AIMsg = {
  role: "ai" | "user";
  text: string;
  products?: Product[];
  image?: string;
};

const TYPHON_KB = [
  { q: ["shipping", "delivery", "ship"], a: "Typhon ships free across the continental US on most machines. Standard delivery is 5–9 business days; expedited freight available at checkout. Track every order live from the Orders tab." },
  { q: ["finance", "financing", "loan", "lease"], a: "We offer financing on machines marked 'Financing'. Terms from 24–72 months, rates from 6.9% APR with approved credit. Open any product and tap 'Finance' to estimate monthly payments." },
  { q: ["warranty", "guarantee"], a: "Every Typhon machine comes with a 2-year limited powertrain warranty and 1 year bumper-to-bumper. Extended coverage to 5 years is available at checkout." },
  { q: ["return", "refund"], a: "30-day return window on attachments and parts. Machines: inspection period of 7 days from delivery — contact support for an RMA." },
  { q: ["payment", "pay", "stripe", "card"], a: "We accept all major cards via Stripe, ACH bank transfer, and Typhon financing. Apple Pay and Google Pay supported in checkout." },
  { q: ["contact", "support", "help", "phone"], a: "Reach Typhon Support 24/7 in-app via the AI chat, or call +1 (800) TYPHON-1. Average response time: under 2 minutes." },
  { q: ["account", "login", "sign"], a: "Sign in with Email, Phone, Google, or Apple from the Account tab. Your cart, orders and quotes sync across devices." },
  { q: ["coupon", "discount", "promo"], a: "Tap the Coupons icon on Home to claim active promotions like SUMMER15 (15% off Compactors) and FLEET10 (10% off fleet orders $50k+)." },
];

function aiAnswer(query: string, products: Product[]): AIMsg {
  const q = query.toLowerCase().trim();
  // 1) knowledge base hit
  const kb = TYPHON_KB.find(k => k.q.some(kw => q.includes(kw)));
  if (kb && !/\b(find|show|search|recommend|looking|need|want|excavator|skid|loader|forklift|lift|bucket|attachment)\b/.test(q)) {
    return { role: "ai", text: kb.a };
  }
  // 2) product search — score by name/brand/category keywords
  const tokens = q.split(/\s+/).filter(t => t.length >= 2 && !["the","a","an","for","me","please","find","show","search","i","need","want","my","is","best","good","with"].includes(t));
  const scored = products.map(p => {
    const hay = `${p.name} ${p.brand} ${p.badge ?? ""}`.toLowerCase();
    const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map(x => x.p);

  if (scored.length) {
    return {
      role: "ai",
      text: `I found ${scored.length} Typhon ${scored.length === 1 ? "machine" : "machines"} matching “${query}”. Tap any card to view full specs, financing or add to cart.`,
      products: scored,
    };
  }
  // 3) fallback — recommend top sellers
  return {
    role: "ai",
    text: "I couldn't find an exact match, but here are 3 popular Typhon machines our crews love. Tell me your job site size, budget, or terrain and I'll narrow it down.",
    products: products.slice(0, 3),
  };
}

function AIScreen(props: { onOpenProduct: (p: Product) => void; addToCart: (id: string) => void }) {
  const [sessions, setSessions] = useChatSessions();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [aiCfg] = useAIConfig();
  const aiConnected = aiCfg.provider === "google" && !!aiCfg.googleApiKey;

  // Ensure a current session exists
  useEffect(() => {
    if (!activeId) {
      if (sessions.length > 0) setActiveId(sessions[0].id);
      else {
        const id = "s" + Date.now();
        const s: ChatSession = {
          id, title: "New chat", createdAt: Date.now(),
          messages: [{ role: "ai", text: "Hi John — I'm your Typhon equipment expert. Ask me anything: shipping, financing, warranty, or 'find me a mini excavator under $40k'.", ts: Date.now() }],
        };
        setSessions([s]);
        setActiveId(id);
      }
    }
  }, [activeId, sessions, setSessions]);

  const current = sessions.find(s => s.id === activeId);
  const msgs: AIMsg[] = useMemo(() => (current?.messages ?? []).map(m => ({
    role: m.role, text: m.text, image: m.image,
    products: m.productIds ? m.productIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[] : undefined,
  })), [current]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const prompts = ["Find me a mini excavator", "Show all skid steers", "Shipping to 75201?", "Financing options", "Identify this machine"];

  const pushMsg = (msg: ChatMsg, titleHint?: string) => {
    setSessions(prev => prev.map(s => s.id === activeId
      ? { ...s, title: s.title === "New chat" && titleHint ? titleHint.slice(0, 40) : s.title, messages: [...s.messages, msg] }
      : s));
  };

  const handleImagePick = (file: File) => {
    if (file.size > 4 * 1024 * 1024) { alert("Image must be under 4 MB"); return; }
    const r = new FileReader();
    r.onload = () => setPendingImage(r.result as string);
    r.readAsDataURL(file);
  };

  const callGemini = async (history: ChatMsg[], userText: string, imageDataUrl?: string | null): Promise<string> => {
    const sys = aiCfg.systemPrompt + "\n\nProduct catalog (id · name · brand · price · category):\n" +
      PRODUCTS.slice(0, 30).map(p => `${p.id} · ${p.name} · ${p.brand} · ${p.price ? "$" + p.price : "quote"} · ${p.category ?? "n/a"}`).join("\n");
    const userParts: any[] = [];
    if (imageDataUrl) {
      const [meta, data] = imageDataUrl.split(",");
      const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
      userParts.push({ inline_data: { mime_type: mime, data } });
    }
    userParts.push({ text: userText || "Please analyze this image." });
    const contents = [
      ...history.filter(m => m.text && !m.image).map(m => ({ role: m.role === "ai" ? "model" : "user", parts: [{ text: m.text }] })),
      { role: "user", parts: userParts },
    ];
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(aiCfg.model)}:generateContent?key=${encodeURIComponent(aiCfg.googleApiKey)}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents }),
    });
    const j: any = await res.json();
    if (!res.ok) throw new Error(j?.error?.message || `HTTP ${res.status}`);
    return j?.candidates?.[0]?.content?.parts?.[0]?.text || "(no response)";
  };

  const send = async (t?: string) => {
    const text = (t ?? input).trim();
    const img = pendingImage;
    if (!text && !img) return;
    if (!activeId) return;
    pushMsg({ role: "user", text: text || (img ? "[image]" : ""), image: img || undefined, ts: Date.now() }, text);
    setInput("");
    setPendingImage(null);
    setTyping(true);
    const local = aiAnswer(text || "find equipment", PRODUCTS);
    if (aiConnected) {
      try {
        const history = current?.messages ?? [];
        const reply = await callGemini(history, text, img);
        pushMsg({ role: "ai", text: reply, productIds: img ? undefined : local.products?.map(p => p.id), ts: Date.now() });
      } catch (e: any) {
        pushMsg({ role: "ai", text: `⚠️ AI error: ${e.message}\n\nUsing built-in: ${local.text}`, productIds: local.products?.map(p => p.id), ts: Date.now() });
      } finally {
        setTyping(false);
      }
    } else {
      setTimeout(() => {
        pushMsg({ role: "ai", text: img ? "I can see your image. Connect Google Gemini in Admin → AI to enable image analysis. Meanwhile: " + local.text : local.text, productIds: local.products?.map(p => p.id), ts: Date.now() });
        setTyping(false);
      }, 450);
    }
  };

  const newChat = () => {
    const id = "s" + Date.now();
    setSessions(prev => [{ id, title: "New chat", createdAt: Date.now(), messages: [{ role: "ai", text: "New session — what are you looking for?", ts: Date.now() }] }, ...prev]);
    setActiveId(id);
    setShowHistory(false);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (id === activeId) setActiveId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full inline-block ${aiConnected ? "bg-success" : "bg-warning"}`} style={{ animation: "pulse-dot 1.6s infinite" }} />
            {aiConnected ? `Gemini · ${aiCfg.model}` : "Built-in mode · Connect Gemini in Admin"}
          </p>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2" title="TYPHON CHAT BOT">
            <Sparkles className="h-5 w-5 text-primary" /> TYPHON Chat Bot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHistory(true)} title="Chat history"><IconBtn><Clock className="h-4 w-4" /></IconBtn></button>
          <button onClick={newChat} title="New chat"><IconBtn><Plus className="h-4 w-4" /></IconBtn></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className="space-y-2">
            <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-2xl ${m.image ? "p-1.5" : "px-4 py-2.5"} text-sm leading-relaxed ${
                m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "glass rounded-bl-sm"
              }`}>
                {m.image && <img src={m.image} alt="upload" className="rounded-xl max-h-48 w-auto object-cover mb-1" />}
                {m.text && <div className={m.image ? "px-2.5 pb-1.5" : ""}>{m.text}</div>}
              </div>
            </div>
            {m.products && m.products.length > 0 && (
              <div className="space-y-2">
                {m.products.map(p => (
                  <button key={p.id} onClick={() => props.onOpenProduct(p)}
                    className="w-full text-left glass rounded-2xl p-3 flex gap-3 items-center hover:bg-primary/5 transition-colors">
                    <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.brand}</p>
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-primary font-black">{p.price ? fmt(p.price) : "Request Quote"}</p>
                        <span className="text-[10px] text-muted-foreground">★ {p.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1">View</span>
                      {p.price && (
                        <span onClick={(e) => { e.stopPropagation(); props.addToCart(p.id); }}
                          className="rounded-full glass-strong text-[10px] font-bold px-2.5 py-1 text-center">+ Cart</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: "pulse-dot 1s infinite" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: "pulse-dot 1s infinite 0.2s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: "pulse-dot 1s infinite 0.4s" }} />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {prompts.map(p => (
          <button key={p} onClick={() => send(p)} className="shrink-0 glass rounded-full px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">{p}</button>
        ))}
      </div>

      <div className="px-5 pb-3">
        {pendingImage && (
          <div className="mb-2 inline-flex items-center gap-2 glass rounded-2xl p-2 pr-3">
            <img src={pendingImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <span className="text-xs font-bold">Image ready</span>
            <button onClick={() => setPendingImage(null)} className="h-6 w-6 rounded-full bg-muted grid place-items-center"><X className="h-3 w-3" /></button>
          </div>
        )}
        <div className="glass-strong rounded-full flex items-center gap-2 pl-2 pr-1.5 py-1.5">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImagePick(f); e.target.value = ""; }} />
          <button onClick={() => fileRef.current?.click()} title="Attach image"
            className="h-9 w-9 rounded-full bg-muted grid place-items-center shrink-0 hover:bg-primary/10 transition-colors">
            <Camera className="h-4 w-4 text-muted-foreground" />
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder={pendingImage ? "Ask about this image…" : "Ask anything — or attach a photo"} className="flex-1 bg-transparent text-sm outline-none py-1.5 min-w-0" />
          <button onClick={() => send()} className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          {aiConnected ? "Powered by Google Gemini · image vision enabled" : "Built-in mode · attach Google API key in Admin → AI for smart answers + vision"}
        </p>
      </div>

      {showHistory && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end" onClick={() => setShowHistory(false)}>
          <div className="w-full bg-card rounded-t-3xl p-4 max-h-[70%] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-lg">Chat history</h3>
              <button onClick={() => setShowHistory(false)} className="h-8 w-8 rounded-full bg-muted grid place-items-center"><X className="h-4 w-4" /></button>
            </div>
            <button onClick={newChat} className="w-full mb-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm py-3 flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> New chat</button>
            <div className="space-y-2">
              {sessions.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No saved chats yet.</p>}
              {sessions.map(s => (
                <div key={s.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${s.id === activeId ? "border-primary bg-primary/5" : ""}`}>
                  <button onClick={() => { setActiveId(s.id); setShowHistory(false); }} className="flex-1 text-left">
                    <p className="font-bold text-sm truncate">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(s.createdAt).toLocaleString()} · {s.messages.length} msgs</p>
                  </button>
                  <button onClick={() => deleteSession(s.id)} className="h-8 w-8 rounded-full bg-muted grid place-items-center text-error"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ===================== ORDERS ===================== */
function OrdersScreen() {
  type Status = "To pay" | "To ship" | "To receive" | "To review" | "Refunds" | "Delivered";
  const orders: { id: string; name: string; price: number; image: string; status: Status; step: number; qty: number }[] = [
    { id: "84219", name: "TX-35 Mini Excavator", price: 38500, image: excavator, status: "To receive", step: 5, qty: 1 },
    { id: "84102", name: "SK-260 Skid Steer Loader", price: 42900, image: skidsteer, status: "Delivered", step: 9, qty: 1 },
    { id: "83992", name: '48" Heavy-Duty Bucket', price: 2890, image: attachment, status: "To ship", step: 3, qty: 2 },
    { id: "83880", name: "FL-30 Diesel Forklift", price: 21500, image: forklift, status: "To pay", step: 0, qty: 1 },
    { id: "83712", name: "WL-50 Wheel Loader", price: 78400, image: wheelloader, status: "To review", step: 9, qty: 1 },
  ];
  const tabs: ("All" | Status)[] = ["All", "To pay", "To ship", "To receive", "To review", "Refunds"];
  const [active, setActive] = useState<typeof tabs[number]>("All");
  const filtered = active === "All" ? orders : orders.filter(o => o.status === active);

  const statusStyle = (s: Status) =>
    s === "Delivered" ? "bg-success/15 text-success" :
    s === "To pay" ? "bg-error/15 text-error" :
    s === "To ship" ? "bg-warning/15 text-warning" :
    s === "To receive" ? "bg-primary/20 text-primary" :
    s === "To review" ? "bg-foreground/10 text-foreground" :
    "bg-muted text-muted-foreground";

  const primaryAction = (s: Status) =>
    s === "To pay" ? "Pay now" :
    s === "To ship" ? "Remind seller" :
    s === "To receive" ? "Track" :
    s === "To review" ? "Review" :
    s === "Refunds" ? "View status" : "Buy again";

  return (
    <div className="space-y-4">
      <div className="px-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Orders</h1>
          <p className="text-xs text-muted-foreground">{orders.length} total · {orders.filter(o=>o.status!=="Delivered").length} active</p>
        </div>
        <button className="glass rounded-full h-10 w-10 grid place-items-center"><Search className="h-4 w-4" /></button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5">
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold border transition-all ${
              active === t ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_20px_rgba(10,132,255,0.4)]" : "bg-card text-muted-foreground border-transparent"
            }`}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-muted grid place-items-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 font-bold">No {active.toLowerCase()} orders</p>
          <p className="text-xs text-muted-foreground mt-1">When you have orders here, they'll show up.</p>
        </div>
      ) : (
        <div className="px-5 space-y-3">
          {filtered.map(o => (
            <div key={o.id} className="glass rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Store className="h-3.5 w-3.5 text-primary shrink-0" />
                  <p className="text-xs font-bold truncate">Typhon Official Store</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle(o.status)}`}>{o.status}</span>
              </div>

              <div className="flex gap-3">
                <img src={o.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight line-clamp-2">{o.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Order #{o.id} · Qty {o.qty}</p>
                  <p className="text-sm font-black text-primary mt-1">{fmt(o.price * o.qty)}</p>
                </div>
              </div>

              {o.status !== "To pay" && o.status !== "Delivered" && <Timeline step={o.step} />}

              <div className="flex gap-2">
                <button className="flex-1 rounded-xl bg-muted text-foreground text-xs font-bold py-2 flex items-center justify-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Support
                </button>
                {o.status === "Delivered" && (
                  <button className="flex-1 rounded-xl bg-muted text-foreground text-xs font-bold py-2 flex items-center justify-center gap-1">
                    <RotateCcw className="h-3 w-3" /> Return
                  </button>
                )}
                <button className={`flex-[1.4] rounded-xl text-xs font-black py-2 ${
                  o.status === "To pay" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                }`}>{primaryAction(o.status)}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Timeline({ step }: { step: number }) {
  const stages = ["Received", "Paid", "Prep", "Ready", "Transit", "Port", "Customs", "Out", "Done"];
  return (
    <div className="relative pb-1">
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

/* ===================== ACCOUNT (Taobao-style) ===================== */
function AccountScreen(props: {
  onOpenAuth: () => void; onOpenCoupons: () => void; onOpenAdmin: () => void;
  onOpenNotifs: () => void; onOpenSettings: () => void;
  signedIn: boolean; isAdmin: boolean; onSignOut: () => void;
  setTab?: (t: TabKey) => void;
  onOpenProduct?: (p: Product) => void;
  openPanel?: (k: PanelKey) => void;
  profile?: { name: string; company: string; location: string; initials: string; avatar?: string; cover?: string };
}) {
  const op = props.openPanel ?? (() => {});
  const quickLinks = [
    { icon: Tag, label: "Vouchers", onClick: props.onOpenCoupons },
    { icon: Heart, label: "Wishlist", onClick: () => op("wishlist") },
    { icon: Store, label: "Following", onClick: () => op("following") },
    { icon: Clock, label: "History", onClick: () => op("history") },
    { icon: Wallet, label: "Wallet", onClick: () => op("wallet") },
  ];
  const orderActions = [
    { icon: CreditCard, label: "To pay", count: 1 },
    { icon: Package, label: "To ship", count: 2 },
    { icon: Truck, label: "To receive", count: 1 },
    { icon: Star, label: "To review", count: 1 },
    { icon: RotateCcw, label: "Refunds", count: 0 },
  ];


  return (
    <div className="pb-6">
      {/* Gradient hero header with optional cover */}
      <div className="relative -mt-12 pt-16 pb-20 px-5 bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white overflow-hidden">
        {props.profile?.cover && (
          <img src={props.profile.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-blue-700/60 to-blue-900/80" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {props.signedIn ? (
              <>
                <button onClick={() => op("profile")} className="h-14 w-14 rounded-full bg-white/20 backdrop-blur grid place-items-center font-black text-lg shrink-0 border-2 border-white/40 overflow-hidden">
                  {props.profile?.avatar ? <img src={props.profile.avatar} alt="" className="h-full w-full object-cover" /> : (props.profile?.initials ?? "JM")}
                </button>
                <button onClick={() => op("profile")} className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-lg truncate">{props.profile?.name ?? "John Miller"}</p>
                    <BadgeCheck className="h-4 w-4 shrink-0" />
                  </div>
                  <p className="text-[11px] opacity-80 truncate">{props.profile?.company ?? "Miller Construction Co."} · {props.profile?.location ?? "Dallas, TX"}</p>
                </button>
              </>
            ) : (
              <button onClick={props.onOpenAuth} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-white/20 grid place-items-center"><User className="h-6 w-6" /></div>
                <div>
                  <p className="font-black text-lg">Sign in</p>
                  <p className="text-[11px] opacity-80">Track orders & save favorites</p>
                </div>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={props.onOpenNotifs} className="h-9 w-9 rounded-full bg-white/15 grid place-items-center"><Bell className="h-4 w-4" /></button>
            <button onClick={props.onOpenSettings} className="h-9 w-9 rounded-full bg-white/15 grid place-items-center"><Settings className="h-4 w-4" /></button>
          </div>
        </div>
      </div>


      {/* Quick links — overlapping card */}
      <div className="px-3 -mt-14 relative z-10">
        <div className="bg-card border rounded-3xl p-3 shadow-xl">
          <div className="grid grid-cols-5 gap-1">
            {quickLinks.map(({ icon: Icon, label, onClick }) => (
              <button key={label} onClick={onClick} className="flex flex-col items-center gap-1 py-2 active:scale-95 transition-transform">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 grid place-items-center">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My orders */}
      <div className="px-3 mt-3">
        <div className="bg-card border rounded-3xl p-4">
          <button onClick={() => props.setTab?.("orders")} className="w-full flex items-center justify-between mb-3">
            <h3 className="font-black text-base">My orders</h3>
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">View all <ChevronRight className="h-3 w-3" /></span>
          </button>
          <div className="grid grid-cols-5 gap-1">
            {orderActions.map(({ icon: Icon, label, count }) => (
              <button key={label} onClick={() => props.setTab?.("orders")} className="relative flex flex-col items-center gap-1.5 py-2 active:scale-95 transition-transform">
                <div className="relative">
                  <Icon className="h-6 w-6 text-foreground" strokeWidth={1.6} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-error text-white text-[9px] font-bold grid place-items-center">{count}</span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promo banner */}
      <div className="px-3 mt-3">
        <button onClick={props.onOpenCoupons} className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-blue-700 text-white p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform">
          <div className="h-12 w-12 rounded-2xl bg-white/20 grid place-items-center shrink-0">
            <Gift className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-base leading-tight">Claim daily $12 voucher</p>
            <p className="text-[11px] opacity-85 mt-0.5">No minimum spend · expires in 24h</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-90" />
        </button>
      </div>

      {/* Share & Earn */}
      <div className="px-3 mt-3">
        <button onClick={() => op("share")} className="w-full bg-card border rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center"><Receipt className="h-4 w-4 text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm">Share & Earn</p>
            <p className="text-[10px] text-muted-foreground">Invite friends, earn $20 credit each</p>
          </div>
          <span className="text-xs text-primary font-bold">Go ›</span>
        </button>
      </div>

      {/* Account list */}
      <div className="px-3 mt-3">
        <div className="bg-card border rounded-3xl overflow-hidden divide-y">
          {[
            { icon: MapPin, label: "Addresses", trail: "2 saved", onClick: () => op("addresses") },
            { icon: FileText, label: "My Quotes", trail: "3", onClick: () => op("quotes") },
            { icon: BadgeCheck, label: "Verified Business", trail: "Active", onClick: () => op("verified") },
            ...(props.isAdmin ? [{ icon: Shield, label: "Admin Dashboard", trail: "", onClick: props.onOpenAdmin }] : []),
            { icon: Settings, label: "Settings", trail: "", onClick: props.onOpenSettings },
            { icon: Headphones, label: "Help & Support", trail: "24/7", onClick: () => op("help") },
            { icon: Eye, label: "Recently viewed", trail: "", onClick: () => op("history") },
          ].map(({ icon: Icon, label, trail, onClick }) => (
            <button key={label} onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-xl bg-muted grid place-items-center"><Icon className="h-4 w-4" /></div>
              <span className="flex-1 text-left text-sm font-semibold">{label}</span>
              {trail && <span className="text-xs text-muted-foreground">{trail}</span>}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>


      {/* Recommended */}
      <div className="px-3 mt-4">
        <h3 className="font-black text-base mb-2 px-1">Recommended for you</h3>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.slice(0, 4).map(p => (
            <button key={p.id} onClick={() => props.onOpenProduct?.(p)} className="bg-card border rounded-2xl overflow-hidden text-left">
              <img src={p.image} alt="" className="aspect-square w-full object-cover" />
              <div className="p-2">
                <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                <p className="text-sm font-black text-primary mt-1">{p.price ? fmt(p.price) : "Quote"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      {props.signedIn && (
        <div className="px-5 mt-5">
          <button onClick={props.onSignOut} className="w-full rounded-2xl border border-error/30 text-error font-bold py-3 text-sm flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
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
                active ? "bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(10,132,255,0.5)]" : "text-muted-foreground"
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

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-black text-base tracking-tight">{title}</h3>
      {action && <button onClick={onAction} className="text-xs text-muted-foreground font-semibold flex items-center gap-0.5">{action} <ChevronRight className="h-3 w-3" /></button>}
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
function CartDrawer({ cart, total, onClose, onInc, onDec, onCheckout }: {
  cart: Record<string, number>; total: number;
  onClose: () => void; onInc: (id: string) => void; onDec: (id: string) => void;
  onCheckout: () => void;
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
            <button onClick={onCheckout} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-4 flex items-center justify-center gap-2">
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
