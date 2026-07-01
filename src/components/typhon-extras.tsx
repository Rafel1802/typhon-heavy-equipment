import { useState } from "react";
import {
  X, ChevronLeft, ChevronRight, CheckCircle2, CreditCard, Banknote, FileText,
  MapPin, Truck, Tag, ShieldCheck, Plus, Edit2, Trash2, BarChart3, Package,
  Users, Sparkles, Phone, Mail, Lock, ArrowRight, Image as ImageIcon, Menu,
  Layers, Megaphone, Bell, Search, GripVertical, TrendingUp, DollarSign,
  ShoppingBag, Eye, Apple,
} from "lucide-react";
import { useAIConfig, usePaymentCards, useSecurity } from "@/lib/typhon-store";

/* ============================================================
   AUTH SCREEN — login / register / google / phone
============================================================ */
export function AuthScreen({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="relative p-6 pb-4 bg-gradient-to-b from-primary/20 to-transparent">
          <button onClick={onClose} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-card/80 backdrop-blur grid place-items-center">
            <X className="h-4 w-4" />
          </button>
          <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-black text-2xl shadow-[0_0_30px_rgba(10,132,255,0.55)]">T</div>
          <h2 className="text-2xl font-black tracking-tight mt-4">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === "login" ? "Sign in to manage orders, quotes and financing." : "Join 12,400+ contractors buying smarter."}
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Method tabs */}
          <div className="glass rounded-2xl p-1 flex">
            <button onClick={() => setMethod("email")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 ${method === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Mail className="h-3.5 w-3.5" /> Email
            </button>
            <button onClick={() => setMethod("phone")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 ${method === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Phone className="h-3.5 w-3.5" /> Phone
            </button>
          </div>

          {mode === "register" && (
            <Field label="Full name" placeholder="John Miller" />
          )}
          {method === "email" ? (
            <Field label="Email" placeholder="john@example.com" type="email" />
          ) : (
            <Field label="Mobile number" placeholder="+1 (555) 123-4567" type="tel" />
          )}
          <Field label="Password" placeholder="••••••••" type="password" icon={<Lock className="h-3.5 w-3.5" />} />
          {mode === "register" && (
            <Field label="Company (optional)" placeholder="Miller Construction Co." />
          )}

          {mode === "login" && (
            <button className="text-xs text-primary font-bold w-full text-right">Forgot password?</button>
          )}

          <button onClick={onSuccess} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5 flex items-center justify-center gap-2">
            {mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4" />
          </button>

          <div className="relative flex items-center my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="px-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Or continue</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={onSuccess} className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-xs font-bold">
              <GoogleIcon className="h-4 w-4" /> Google
            </button>
            <button onClick={onSuccess} className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-xs font-bold">
              <Apple className="h-4 w-4" /> Apple
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button onClick={() => setMode(m => (m === "login" ? "register" : "login"))} className="text-primary font-bold">
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
          <p className="text-center text-[10px] text-muted-foreground">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", icon }: { label: string; placeholder: string; type?: string; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1 glass rounded-2xl flex items-center gap-2 px-4 py-3">
        {icon}
        <input type={type} placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
    </label>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.9c-.25 1.37-1.02 2.53-2.18 3.31v2.75h3.52c2.06-1.9 3.26-4.7 3.26-8.09z"/>
      <path fill="#34A853" d="M12 23c2.94 0 5.4-.97 7.2-2.64l-3.52-2.75c-.98.66-2.23 1.05-3.68 1.05-2.83 0-5.23-1.91-6.09-4.48H2.27v2.81C4.06 20.66 7.77 23 12 23z"/>
      <path fill="#FBBC05" d="M5.91 14.18A6.97 6.97 0 0 1 5.5 12c0-.76.13-1.5.36-2.18V7H2.27A11 11 0 0 0 1 12c0 1.78.43 3.46 1.27 4.99l3.64-2.81z"/>
      <path fill="#EA4335" d="M12 5.5c1.6 0 3.04.55 4.17 1.63l3.13-3.13C17.4 2.05 14.94 1 12 1 7.77 1 4.06 3.34 2.27 7l3.64 2.82C6.77 7.41 9.17 5.5 12 5.5z"/>
    </svg>
  );
}

/* ============================================================
   CHECKOUT FLOW — 4 steps
============================================================ */
export function CheckoutFlow({ total, onClose, onPlaced }: { total: number; onClose: () => void; onPlaced: () => void }) {
  const steps = ["Address", "Shipping", "Payment", "Review"];
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState<"card" | "ach" | "finance" | "invoice">("card");
  const [ship, setShip] = useState<"standard" | "expedited" | "white-glove">("standard");
  const shippingCost = ship === "standard" ? 0 : ship === "expedited" ? 449 : 1250;
  const tax = Math.round(total * 0.0825);
  const grand = total + shippingCost + tax;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b flex items-center gap-3">
          <button onClick={() => (step === 0 ? onClose() : setStep(s => s - 1))} className="h-9 w-9 rounded-full bg-muted grid place-items-center">
            {step === 0 ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Step {step + 1} of 4</p>
            <h2 className="text-lg font-black tracking-tight">{steps[step]}</h2>
          </div>
        </div>
        {/* Progress */}
        <div className="px-5 pt-3">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {step === 0 && <AddressStep />}
          {step === 1 && <ShippingStep ship={ship} setShip={setShip} />}
          {step === 2 && <PaymentStep pay={pay} setPay={setPay} />}
          {step === 3 && <ReviewStep subtotal={total} shipping={shippingCost} tax={tax} total={grand} pay={pay} ship={ship} />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t glass-strong space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order total</span>
            <span className="font-black text-lg">${grand.toLocaleString()}</span>
          </div>
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5 flex items-center justify-center gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={onPlaced} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressStep() {
  return (
    <div className="space-y-3">
      <div className="glass-strong rounded-2xl p-4 border-2 border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold">Home · Default</span>
          </div>
          <CheckCircle2 className="h-4 w-4 text-primary fill-primary text-primary-foreground" />
        </div>
        <p className="text-sm font-bold mt-2">John Miller · Miller Construction Co.</p>
        <p className="text-xs text-muted-foreground">2840 Industrial Blvd, Dallas, TX 75207</p>
        <p className="text-xs text-muted-foreground">+1 (214) 555-0142</p>
      </div>
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold">Job Site</span>
        </div>
        <p className="text-sm font-bold mt-2">Riverside Project</p>
        <p className="text-xs text-muted-foreground">5500 Trinity River Rd, Fort Worth, TX 76104</p>
      </div>
      <button className="w-full glass rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-1">
        <Plus className="h-3.5 w-3.5" /> Add new address
      </button>
    </div>
  );
}

function ShippingStep({ ship, setShip }: { ship: string; setShip: (s: any) => void }) {
  const opts = [
    { id: "standard", title: "Standard Freight", eta: "7–10 business days", price: "FREE", desc: "Curbside delivery via flatbed" },
    { id: "expedited", title: "Expedited", eta: "3–5 business days", price: "$449", desc: "Priority routing, signature required" },
    { id: "white-glove", title: "White-Glove Setup", eta: "5–7 business days", price: "$1,250", desc: "Onsite unload + walkaround training" },
  ];
  return (
    <div className="space-y-3">
      {opts.map(o => {
        const active = ship === o.id;
        return (
          <button key={o.id} onClick={() => setShip(o.id)}
            className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${active ? "border-primary glass-strong" : "border-transparent glass"}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-black">{o.title}</p>
                  <p className="text-[10px] text-muted-foreground">{o.eta}</p>
                </div>
              </div>
              <span className="text-sm font-black text-primary">{o.price}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 pl-6">{o.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

function PaymentStep({ pay, setPay }: { pay: string; setPay: (p: any) => void }) {
  const opts = [
    { id: "card", icon: CreditCard, title: "Credit / Debit Card", desc: "Visa, Mastercard, Amex via Stripe" },
    { id: "ach", icon: Banknote, title: "ACH Bank Transfer", desc: "1–2 business days · No fees" },
    { id: "finance", icon: TrendingUp, title: "Equipment Financing", desc: "From 4.9% APR · Pre-approval in 60s" },
    { id: "invoice", icon: FileText, title: "Pay by Invoice", desc: "Net 30 for verified businesses" },
  ];
  return (
    <div className="space-y-3">
      {opts.map(o => {
        const active = pay === o.id;
        const Icon = o.icon;
        return (
          <button key={o.id} onClick={() => setPay(o.id)}
            className={`w-full text-left rounded-2xl p-4 border-2 transition-all flex items-center gap-3 ${active ? "border-primary glass-strong" : "border-transparent glass"}`}>
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">{o.title}</p>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </div>
            {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
          </button>
        );
      })}
      {pay === "card" && (
        <div className="glass rounded-2xl p-4 space-y-3 mt-2">
          <Field label="Card number" placeholder="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Expiry" placeholder="MM / YY" />
            <Field label="CVC" placeholder="123" />
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" /> Card never touches our servers · Stripe PCI-DSS
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewStep({ subtotal, shipping, tax, total, pay, ship }: { subtotal: number; shipping: number; tax: number; total: number; pay: string; ship: string }) {
  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipping to</p>
        <p className="text-sm font-bold">2840 Industrial Blvd, Dallas, TX 75207</p>
      </div>
      <div className="glass rounded-2xl p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Method</p>
        <p className="text-sm font-bold capitalize">{ship.replace("-", " ")}</p>
      </div>
      <div className="glass rounded-2xl p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment</p>
        <p className="text-sm font-bold capitalize">{pay === "ach" ? "ACH Bank Transfer" : pay}</p>
      </div>
      <div className="glass-strong rounded-2xl p-4 space-y-2">
        <Row l="Subtotal" v={`$${subtotal.toLocaleString()}`} />
        <Row l="Shipping" v={shipping === 0 ? "FREE" : `$${shipping.toLocaleString()}`} />
        <Row l="Tax (TX 8.25%)" v={`$${tax.toLocaleString()}`} />
        <div className="border-t pt-2 mt-2 flex justify-between">
          <span className="font-black">Total</span>
          <span className="font-black text-xl">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{l}</span>
      <span className="font-bold">{v}</span>
    </div>
  );
}

/* ============================================================
   ORDER PLACED CONFIRMATION
============================================================ */
export function OrderPlaced({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in">
      <div className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden text-center p-8">
        <div className="h-20 w-20 mx-auto rounded-full bg-success/15 grid place-items-center yellow-glow">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mt-5">Order placed!</h2>
        <p className="text-sm text-muted-foreground mt-1">Confirmation #TX-84219 sent to john@millerco.com</p>
        <div className="glass rounded-2xl p-4 mt-5 text-left space-y-1">
          <p className="text-xs text-muted-foreground">Estimated delivery</p>
          <p className="font-black">Mar 14 – Mar 18, 2026</p>
        </div>
        <button onClick={onClose} className="w-full mt-5 rounded-2xl bg-primary text-primary-foreground font-black py-3.5">
          Track Order
        </button>
        <button onClick={onClose} className="w-full mt-2 rounded-2xl bg-muted text-foreground font-bold py-3 text-xs">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   COUPONS SCREEN
============================================================ */
const COUPONS = [
  { code: "SUMMER15", title: "15% off Compactors & Rollers", desc: "Min order $5,000 · Expires Aug 31", value: "15% OFF", color: "from-primary to-blue-700" },
  { code: "FREESHIP", title: "Free expedited shipping", desc: "Any order over $10,000", value: "FREE SHIP", color: "from-emerald-500 to-teal-600" },
  { code: "NEW500", title: "$500 off first order", desc: "New customers only · No minimum", value: "$500 OFF", color: "from-blue-500 to-indigo-600" },
  { code: "FINANCE0", title: "0% APR for 12 months", desc: "Excavators & loaders · OAC", value: "0% APR", color: "from-fuchsia-500 to-pink-600" },
];

export function CouponsScreen({ onClose }: { onClose: () => void }) {
  const [claimed, setClaimed] = useState<Set<string>>(new Set(["FREESHIP"]));
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="p-5 border-b flex items-center gap-3">
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted grid place-items-center">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight">My Coupons</h2>
            <p className="text-xs text-muted-foreground">{claimed.size} claimed · {COUPONS.length} available</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {COUPONS.map(c => {
            const isClaimed = claimed.has(c.code);
            return (
              <div key={c.code} className="relative rounded-2xl overflow-hidden border bg-card flex">
                <div className={`relative w-24 bg-gradient-to-br ${c.color} text-white grid place-items-center p-3`}>
                  <div className="text-center">
                    <Tag className="h-5 w-5 mx-auto" />
                    <p className="text-[10px] font-black mt-1">{c.value}</p>
                  </div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-background" />
                </div>
                <div className="flex-1 p-3 pl-5">
                  <p className="font-black text-sm leading-tight">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <code className="text-[10px] font-bold bg-muted rounded px-1.5 py-0.5">{c.code}</code>
                    <button onClick={() => setClaimed(s => { const n = new Set(s); n.has(c.code) ? n.delete(c.code) : n.add(c.code); return n; })}
                      className={`text-[10px] font-bold rounded-full px-3 py-1 ${isClaimed ? "bg-success/15 text-success" : "bg-primary text-primary-foreground"}`}>
                      {isClaimed ? "Claimed" : "Claim"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="w-full glass rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Find more deals
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN DASHBOARD
============================================================ */
type AdminSection = "overview" | "orders" | "products" | "coupons" | "categories" | "menu" | "banners" | "customers" | "ai";

export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<AdminSection>("overview");
  return (
    <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b flex items-center gap-3 bg-foreground text-background">
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-background/10 grid place-items-center">
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Admin Panel</p>
            <h2 className="text-lg font-black tracking-tight capitalize">{section}</h2>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-black text-xs">JM</div>
        </div>

        {/* Section tabs */}
        <div className="border-b overflow-x-auto no-scrollbar">
          <div className="flex gap-1 p-2 min-w-max">
            {([
              ["overview", BarChart3], ["orders", ShoppingBag], ["products", Package],
              ["coupons", Tag], ["categories", Layers], ["menu", Menu], ["banners", Megaphone], ["customers", Users], ["ai", Sparkles],
            ] as [AdminSection, any][]).map(([k, Icon]) => (
              <button key={k} onClick={() => setSection(k)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold capitalize ${section === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                <Icon className="h-3.5 w-3.5" /> {k === "ai" ? "AI Bot" : k}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5">
          {section === "overview" && <AdminOverview />}
          {section === "orders" && <AdminOrders />}
          {section === "products" && <AdminProducts />}
          {section === "coupons" && <AdminCoupons />}
          {section === "categories" && <AdminCategories />}
          {section === "menu" && <AdminMenuBuilder />}
          {section === "banners" && <AdminBanners />}
          {section === "customers" && <AdminCustomers />}
          {section === "ai" && <AdminAI />}
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const stats = [
    { l: "Revenue (30d)", v: "$1.24M", trend: "+18%", icon: DollarSign, color: "text-success" },
    { l: "Orders", v: "342", trend: "+12%", icon: ShoppingBag, color: "text-success" },
    { l: "Pending Quotes", v: "27", trend: "+5", icon: FileText, color: "text-warning" },
    { l: "AI Chats", v: "1,892", trend: "+34%", icon: Sparkles, color: "text-success" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.l} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <s.icon className="h-4 w-4 text-primary" />
              <span className={`text-[10px] font-bold ${s.color}`}>{s.trend}</span>
            </div>
            <p className="text-2xl font-black mt-2">{s.v}</p>
            <p className="text-[10px] text-muted-foreground font-semibold">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-sm">Sales — Last 7 days</p>
          <span className="text-[10px] text-muted-foreground">TX, CA, FL leading</span>
        </div>
        <div className="flex items-end gap-1.5 h-24">
          {[40, 65, 50, 78, 92, 70, 85].map((v, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-primary to-primary/40 rounded-t" style={{ height: `${v}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="font-black text-sm mb-2">Recent activity</p>
        <div className="space-y-2">
          {[
            { t: "New order #TX-84219", s: "TX-35 Mini Excavator · $38,500", time: "2m" },
            { t: "Quote requested", s: "Acme Build Co. · 3 items", time: "14m" },
            { t: "Customer registered", s: "Westlake Construction", time: "1h" },
          ].map(a => (
            <div key={a.t} className="flex gap-3 items-center text-xs">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="font-bold">{a.t}</p>
                <p className="text-[10px] text-muted-foreground">{a.s}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const orders = [
    { id: "84219", customer: "Miller Construction", total: 38500, status: "Processing" },
    { id: "84218", customer: "Acme Build Co.", total: 92400, status: "Paid" },
    { id: "84217", customer: "Westlake LLC", total: 2890, status: "Shipped" },
    { id: "84216", customer: "Trinity Excavating", total: 78400, status: "Delivered" },
  ];
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl flex items-center gap-2 px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Search orders..." className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      {orders.map(o => (
        <div key={o.id} className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/15 grid place-items-center text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm">#{o.id}</p>
            <p className="text-[10px] text-muted-foreground truncate">{o.customer}</p>
          </div>
          <div className="text-right">
            <p className="font-black text-sm">${o.total.toLocaleString()}</p>
            <span className={`text-[9px] font-bold rounded-full px-2 py-0.5 ${
              o.status === "Delivered" ? "bg-success/15 text-success" :
              o.status === "Shipped" ? "bg-primary/15 text-foreground" :
              o.status === "Paid" ? "bg-blue-500/15 text-blue-500" : "bg-warning/15 text-warning"
            }`}>{o.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminProducts() {
  const items = [
    { name: "TX-35 Mini Excavator", price: 38500, stock: 12, status: "Active" },
    { name: "SK-260 Skid Steer", price: 42900, stock: 7, status: "Active" },
    { name: "WL-50 Wheel Loader", price: 78400, stock: 2, status: "Low Stock" },
  ];
  return (
    <div className="space-y-3">
      <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Add Product
      </button>
      {items.map(p => (
        <div key={p.name} className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted grid place-items-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
          <div className="flex-1">
            <p className="font-black text-sm">{p.name}</p>
            <p className="text-[10px] text-muted-foreground">${p.price.toLocaleString()} · Stock: {p.stock}</p>
          </div>
          <button className="h-8 w-8 rounded-lg bg-muted grid place-items-center"><Edit2 className="h-3.5 w-3.5" /></button>
          <button className="h-8 w-8 rounded-lg bg-error/10 text-error grid place-items-center"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

function AdminCoupons() {
  return (
    <div className="space-y-3">
      <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Create Coupon
      </button>
      {COUPONS.map(c => (
        <div key={c.code} className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} text-white grid place-items-center`}>
            <Tag className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-black text-sm">{c.code}</p>
            <p className="text-[10px] text-muted-foreground">{c.title}</p>
          </div>
          <span className="text-[10px] font-bold rounded-full bg-success/15 text-success px-2 py-0.5">Active</span>
          <button className="h-8 w-8 rounded-lg bg-muted grid place-items-center"><Edit2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

function AdminCategories() {
  const cats = [
    { name: "Mini Excavator", subs: 4, sort: 1 },
    { name: "Skid Steer", subs: 3, sort: 2 },
    { name: "Wheel Loader", subs: 2, sort: 3 },
    { name: "Attachments", subs: 12, sort: 4 },
    { name: "Parts", subs: 28, sort: 5 },
  ];
  return (
    <div className="space-y-3">
      <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> New Category
      </button>
      {cats.map(c => (
        <div key={c.name} className="glass rounded-2xl p-3 flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center"><Layers className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="font-black text-sm">{c.name}</p>
            <p className="text-[10px] text-muted-foreground">{c.subs} subcategories · sort #{c.sort}</p>
          </div>
          <button className="h-8 w-8 rounded-lg bg-muted grid place-items-center"><Edit2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

function AdminMenuBuilder() {
  const menu = [
    { label: "Home", link: "/" , kids: 0 },
    { label: "Shop", link: "/shop", kids: 6 },
    { label: "Financing", link: "/finance", kids: 0 },
    { label: "About", link: "/about", kids: 3 },
  ];
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-4 bg-gradient-to-br from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <Menu className="h-4 w-4 text-primary" />
          <p className="font-black text-sm">Header Menu</p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Drag to reorder · Tap to edit links and submenus</p>
      </div>
      {menu.map(m => (
        <div key={m.label} className="glass rounded-2xl p-3 flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-black text-sm">{m.label}</p>
            <p className="text-[10px] text-muted-foreground">{m.link} · {m.kids} submenus</p>
          </div>
          <button className="h-8 px-2 rounded-lg bg-muted text-[10px] font-bold flex items-center gap-1"><Plus className="h-3 w-3" /> Submenu</button>
          <button className="h-8 w-8 rounded-lg bg-muted grid place-items-center"><Edit2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Add Menu Item
      </button>
    </div>
  );
}

function AdminBanners() {
  const banners = [
    { title: "Summer Savings — Compactors 15% off", placement: "Home Hero", live: true },
    { title: "0% APR Financing", placement: "Shop Top", live: true },
    { title: "Parts Black Friday", placement: "Home Hero", live: false },
  ];
  return (
    <div className="space-y-3">
      <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> New Banner
      </button>
      {banners.map(b => (
        <div key={b.title} className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-primary-foreground">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm truncate">{b.title}</p>
            <p className="text-[10px] text-muted-foreground">{b.placement}</p>
          </div>
          <button className={`h-6 w-10 rounded-full transition-colors ${b.live ? "bg-success" : "bg-muted"} relative`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${b.live ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

function AdminCustomers() {
  const list = [
    { name: "Miller Construction Co.", email: "john@millerco.com", orders: 15, spent: 412000 },
    { name: "Acme Build Co.", email: "ops@acmebuild.com", orders: 8, spent: 187200 },
    { name: "Westlake LLC", email: "buy@westlake.com", orders: 3, spent: 24500 },
  ];
  return (
    <div className="space-y-3">
      {list.map(c => (
        <div key={c.email} className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-primary-foreground font-black text-xs">
            {c.name.split(" ").map(x => x[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm truncate">{c.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
          </div>
          <div className="text-right">
            <p className="font-black text-sm">${c.spent.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{c.orders} orders</p>
          </div>
          <button className="h-8 w-8 rounded-lg bg-muted grid place-items-center"><Eye className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ADMIN — AI BOT CONFIG (Google Gemini API key)
============================================================ */
function AdminAI() {
  const [cfg, setCfg] = useAIConfig();
  const [draft, setDraft] = useState(cfg);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState<"idle" | "ok" | "fail" | "wait">("idle");
  const [testMsg, setTestMsg] = useState<string>("");

  const save = () => { setCfg(draft); setTestMsg("Settings saved."); setTesting("ok"); };

  const testConnection = async () => {
    if (!draft.googleApiKey) { setTesting("fail"); setTestMsg("Add an API key first."); return; }
    setTesting("wait"); setTestMsg("Contacting Google AI…");
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(draft.model)}:generateContent?key=${encodeURIComponent(draft.googleApiKey)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Reply with: OK" }] }] }),
      });
      const j: any = await res.json();
      if (!res.ok) { setTesting("fail"); setTestMsg(j?.error?.message || `HTTP ${res.status}`); return; }
      const text = j?.candidates?.[0]?.content?.parts?.[0]?.text || "(no text)";
      setTesting("ok"); setTestMsg(`Connected · "${text.trim().slice(0, 60)}"`);
    } catch (e: any) {
      setTesting("fail"); setTestMsg(e?.message || "Network error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Provider</p>
        <p className="font-black text-lg mt-1">Typhon AI Engine</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Choose how customer-facing chat answers are generated.</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {([
            { id: "builtin", t: "Built-in", d: "Offline KB · free" },
            { id: "google", t: "Google Gemini", d: "Smart · uses API key" },
          ] as const).map(o => (
            <button key={o.id} onClick={() => setDraft({ ...draft, provider: o.id })}
              className={`text-left rounded-2xl p-3 border-2 transition-all ${draft.provider === o.id ? "border-primary bg-primary/5" : "border-transparent bg-muted"}`}>
              <p className="font-black text-sm">{o.t}</p>
              <p className="text-[10px] text-muted-foreground">{o.d}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Google API Key</p>
          <div className="mt-2 flex gap-2">
            <input
              type={show ? "text" : "password"}
              value={draft.googleApiKey}
              onChange={e => setDraft({ ...draft, googleApiKey: e.target.value })}
              placeholder="AIzaSy…"
              className="flex-1 bg-muted rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:ring-2 ring-primary"
            />
            <button onClick={() => setShow(s => !s)} className="px-3 rounded-xl bg-muted text-xs font-bold">{show ? "Hide" : "Show"}</button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">Stored locally on this device. Get a key at <span className="text-primary font-bold">aistudio.google.com/apikey</span></p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Model</p>
          <select value={draft.model} onChange={e => setDraft({ ...draft, model: e.target.value })}
            className="mt-2 w-full bg-muted rounded-xl px-3 py-2.5 text-sm font-bold outline-none">
            {["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Prompt (persona)</p>
          <textarea value={draft.systemPrompt} onChange={e => setDraft({ ...draft, systemPrompt: e.target.value })} rows={4}
            className="mt-2 w-full bg-muted rounded-xl px-3 py-2.5 text-xs leading-relaxed outline-none focus:ring-2 ring-primary resize-none" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Brand Rules (tone & guardrails)</p>
          <textarea value={draft.brandRules} onChange={e => setDraft({ ...draft, brandRules: e.target.value })} rows={4}
            placeholder="How the AI should represent TYPHON, handle competitors, and drive to purchase…"
            className="mt-2 w-full bg-muted rounded-xl px-3 py-2.5 text-xs leading-relaxed outline-none focus:ring-2 ring-primary resize-none" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Brand Knowledge Script</p>
          <textarea value={draft.brandKnowledge} onChange={e => setDraft({ ...draft, brandKnowledge: e.target.value })} rows={8}
            placeholder="Paste FAQs, spec sheets, warranty terms, financing details, shipping zones, coupon list, dealer info…"
            className="mt-2 w-full bg-muted rounded-xl px-3 py-2.5 text-xs leading-relaxed outline-none focus:ring-2 ring-primary resize-none font-mono" />
          <div className="mt-2 flex items-center gap-2">
            <label className="flex-1 rounded-xl bg-primary/10 text-primary text-[11px] font-bold py-2.5 grid place-items-center cursor-pointer active:scale-[0.98]">
              Upload .txt / .md script
              <input type="file" accept=".txt,.md,.json,.csv" className="hidden" onChange={e => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader();
                r.onload = () => setDraft({ ...draft, brandKnowledge: String(r.result || "") });
                r.readAsText(f);
              }} />
            </label>
            <button onClick={() => setDraft({ ...draft, brandKnowledge: "" })}
              className="rounded-xl bg-muted text-xs font-bold px-3 py-2.5">Clear</button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">{draft.brandKnowledge.length.toLocaleString()} chars · Injected into every AI answer.</p>
        </div>
      </div>

      {testMsg && (
        <div className={`rounded-2xl p-3 text-xs font-bold ${testing === "ok" ? "bg-success/15 text-success" : testing === "fail" ? "bg-error/15 text-error" : "bg-muted text-muted-foreground"}`}>
          {testMsg}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={testConnection} className="flex-1 rounded-2xl bg-muted font-black py-3 text-sm">Test connection</button>
        <button onClick={save} className="flex-1 rounded-2xl bg-primary text-primary-foreground font-black py-3 text-sm">Save</button>
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="font-black text-sm">Status</p>
        <div className="mt-2 space-y-1.5 text-xs">
          <p>Provider: <span className="font-bold">{cfg.provider === "google" ? "Google Gemini" : "Built-in"}</span></p>
          <p>Key: <span className="font-bold">{cfg.googleApiKey ? `••••${cfg.googleApiKey.slice(-4)}` : "Not set"}</span></p>
          <p>Model: <span className="font-bold">{cfg.model}</span></p>
        </div>
      </div>
    </div>
  );
}
export function NotificationsSheet({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: Truck, t: "Order #84219 shipped", s: "Arrives Mar 14 · Track now", time: "5m", color: "text-primary" },
    { icon: Tag, t: "New coupon: 15% off compactors", s: "Code SUMMER15 · Expires Aug 31", time: "2h", color: "text-success" },
    { icon: Sparkles, t: "AI: 3 machines match your last search", s: "Tap to view recommendations", time: "1d", color: "text-primary" },
    { icon: Bell, t: "Quote approved", s: "WL-50 Wheel Loader · Valid 30 days", time: "2d", color: "text-blue-500" },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="p-5 border-b flex items-center gap-3">
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted grid place-items-center">
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-xl font-black tracking-tight flex-1">Notifications</h2>
          <button className="text-xs text-primary font-bold">Mark all read</button>
        </div>
        <div className="p-3 space-y-1">
          {items.map((n, i) => (
            <button key={i} className="w-full flex items-start gap-3 p-3 rounded-2xl hover:bg-muted text-left">
              <div className={`h-9 w-9 rounded-xl bg-muted grid place-items-center shrink-0 ${n.color}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{n.t}</p>
                <p className="text-[10px] text-muted-foreground">{n.s}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{n.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS SCREEN — Taobao-style grouped lists
============================================================ */
import { Globe, Bell as BellIcon, Lock as LockIcon, HelpCircle, FileText as FileText2, Info, ChevronRight as ChevRight, ArrowLeft } from "lucide-react";

export function SettingsScreen({ onClose, onSignOut }: { onClose: () => void; onSignOut: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [notif, setNotif] = useState({ orders: true, promos: true, ai: false, price: true });
  const [privacy, setPrivacy] = useState({ personalized: true, analytics: false, location: true });
  const [appearance, setAppearance] = useState<"liquid" | "classic" | "high">("liquid");
  const [country, setCountry] = useState({ country: "United States", lang: "English", currency: "USD" });

  const groups: { title: string; rows: { icon: any; label: string; trail?: string; key: string }[] }[] = [
    {
      title: "Account and security",
      rows: [
        { icon: MapPin, label: "My addresses", trail: "2 saved", key: "addresses" },
        { icon: ShieldCheck, label: "Account and security", trail: "", key: "security" },
        { icon: CreditCard, label: "Payment settings", trail: "Visa •••• 3568", key: "payment" },
        { icon: Globe, label: "Country / language / currency", trail: `${country.country.split(" ")[0]} · EN · ${country.currency}`, key: "country" },
      ],
    },
    {
      title: "Function",
      rows: [
        { icon: Sparkles, label: "General", trail: "", key: "general" },
        { icon: BellIcon, label: "Notifications", trail: Object.values(notif).filter(Boolean).length + " on", key: "notif" },
        { icon: LockIcon, label: "Privacy", trail: "", key: "privacy" },
        { icon: ImageIcon, label: "Appearance", trail: appearance === "liquid" ? "Liquid Glass" : appearance === "classic" ? "Classic" : "High contrast", key: "appearance" },
      ],
    },
    {
      title: "About",
      rows: [
        { icon: HelpCircle, label: "Help and feedback", trail: "", key: "help" },
        { icon: Info, label: "About TYPHON", trail: "v1.0.0", key: "about" },
        { icon: FileText2, label: "Legal Agreement", trail: "", key: "legal" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="px-4 py-4 border-b flex items-center justify-between shrink-0">
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted grid place-items-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="font-black text-lg">Settings</h2>
          <button className="h-9 w-9 rounded-full bg-muted grid place-items-center text-xs">···</button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-4 bg-muted/30">
          {groups.map(g => (
            <div key={g.title}>
              <p className="text-[11px] font-black tracking-wide text-muted-foreground uppercase px-3 mb-2">{g.title}</p>
              <div className="bg-card border rounded-2xl overflow-hidden divide-y">
                {g.rows.map(r => (
                  <button key={r.label} onClick={() => setActive(r.key)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-muted transition-colors">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 grid place-items-center text-primary">
                      <r.icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-left text-sm font-semibold">{r.label}</span>
                    {r.trail && <span className="text-xs text-muted-foreground max-w-[40%] truncate">{r.trail}</span>}
                    <ChevRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="h-2" />
        </div>

        <div className="p-4 border-t flex gap-2 shrink-0 bg-background">
          <button onClick={() => { onSignOut(); }} className="flex-1 rounded-2xl bg-muted text-foreground font-bold py-3 text-sm">Switch account</button>
          <button onClick={onSignOut} className="flex-1 rounded-2xl bg-error/10 text-error font-black py-3 text-sm">Log out</button>
        </div>
      </div>

      {active && (
        <SettingsSubSheet
          k={active}
          onClose={() => setActive(null)}
          notif={notif} setNotif={setNotif}
          privacy={privacy} setPrivacy={setPrivacy}
          appearance={appearance} setAppearance={setAppearance}
          country={country} setCountry={setCountry}
        />
      )}
    </div>
  );
}

function SettingsSubSheet({ k, onClose, notif, setNotif, privacy, setPrivacy, appearance, setAppearance, country, setCountry }: any) {
  const titles: Record<string, string> = {
    addresses: "My addresses", security: "Account & security", payment: "Payment methods",
    country: "Region & language", general: "General", notif: "Notifications", privacy: "Privacy",
    appearance: "Appearance", help: "Help & feedback", about: "About TYPHON", legal: "Legal agreements",
  };
  const Row = ({ label, value, on, onToggle }: any) => (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {value && <p className="text-[11px] text-muted-foreground">{value}</p>}
      </div>
      {typeof on === "boolean" && (
        <button onClick={onToggle} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted-foreground/30"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
        </button>
      )}
    </div>
  );

  let body: React.ReactNode = null;
  if (k === "notif") {
    body = (
      <div className="bg-card border rounded-2xl divide-y overflow-hidden">
        <Row label="Order updates" value="Shipping, delivery, status" on={notif.orders} onToggle={() => setNotif({ ...notif, orders: !notif.orders })} />
        <Row label="Promotions & deals" value="Coupons, flash sales" on={notif.promos} onToggle={() => setNotif({ ...notif, promos: !notif.promos })} />
        <Row label="AI assistant tips" value="Smart suggestions" on={notif.ai} onToggle={() => setNotif({ ...notif, ai: !notif.ai })} />
        <Row label="Price drop alerts" value="Wishlist items" on={notif.price} onToggle={() => setNotif({ ...notif, price: !notif.price })} />
      </div>
    );
  } else if (k === "privacy") {
    body = (
      <div className="bg-card border rounded-2xl divide-y overflow-hidden">
        <Row label="Personalized recommendations" on={privacy.personalized} onToggle={() => setPrivacy({ ...privacy, personalized: !privacy.personalized })} />
        <Row label="Share usage analytics" on={privacy.analytics} onToggle={() => setPrivacy({ ...privacy, analytics: !privacy.analytics })} />
        <Row label="Location services" on={privacy.location} onToggle={() => setPrivacy({ ...privacy, location: !privacy.location })} />
      </div>
    );
  } else if (k === "appearance") {
    const opts = [
      { id: "liquid", name: "Liquid Glass", desc: "Translucent blur, iOS feel" },
      { id: "classic", name: "Classic", desc: "Solid surfaces, minimal blur" },
      { id: "high", name: "High Contrast", desc: "Maximum readability" },
    ];
    body = (
      <div className="space-y-2">
        {opts.map(o => (
          <button key={o.id} onClick={() => setAppearance(o.id)} className={`w-full text-left bg-card border rounded-2xl p-4 flex items-center gap-3 ${appearance === o.id ? "ring-2 ring-primary" : ""}`}>
            <div className={`h-10 w-10 rounded-xl ${o.id === "liquid" ? "bg-gradient-to-br from-primary to-blue-700" : o.id === "classic" ? "bg-muted" : "bg-foreground"}`} />
            <div className="flex-1">
              <p className="font-bold text-sm">{o.name}</p>
              <p className="text-[11px] text-muted-foreground">{o.desc}</p>
            </div>
            {appearance === o.id && <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">✓</div>}
          </button>
        ))}
      </div>
    );
  } else if (k === "country") {
    body = (
      <div className="space-y-3">
        {[
          ["Country / Region", "country", ["United States", "Canada", "Mexico", "United Kingdom"]],
          ["Language", "lang", ["English", "Español", "Français"]],
          ["Currency", "currency", ["USD", "CAD", "EUR", "GBP"]],
        ].map(([label, key, opts]: any) => (
          <div key={key}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">{label}</p>
            <div className="bg-card border rounded-2xl divide-y overflow-hidden">
              {opts.map((o: string) => (
                <button key={o} onClick={() => setCountry({ ...country, [key]: o })} className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center justify-between active:bg-muted">
                  {o} {country[key] === o && <span className="text-primary">✓</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else if (k === "payment") {
    body = <PaymentMethodsPanel />;
  } else if (k === "security") {
    body = <SecurityPanel />;
  } else if (k === "addresses") {
    body = (
      <div className="space-y-2">
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-xs font-bold text-primary">Default · Home</p>
          <p className="font-bold text-sm mt-1">John Miller</p>
          <p className="text-[11px] text-muted-foreground">2840 Industrial Blvd, Dallas, TX 75207</p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-xs font-bold">Job Site</p>
          <p className="font-bold text-sm mt-1">Riverside Project</p>
          <p className="text-[11px] text-muted-foreground">5500 Trinity River Rd, Fort Worth, TX 76104</p>
        </div>
        <button className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5">+ Add new address</button>
      </div>
    );
  } else if (k === "general") {
    const handle = (x: string) => {
      if (x.startsWith("Clear")) { alert("Cache cleared (24 MB freed)."); }
      else if (x.startsWith("Reset")) { if (confirm("Reset all preferences to default?")) alert("Preferences reset."); }
      else if (x.startsWith("Download")) { alert("Your data export will be emailed within 24 hours."); }
      else if (x.startsWith("Beta")) { alert("Beta features enrollment opened."); }
    };
    body = (
      <div className="bg-card border rounded-2xl divide-y overflow-hidden">
        {["Clear cache (24 MB)", "Reset preferences", "Download data", "Beta features"].map(x => (
          <button key={x} onClick={() => handle(x)} className="w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center justify-between active:bg-muted">
            {x} <ChevRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    );
  } else if (k === "help") {
    body = (
      <div className="space-y-2">
        <a href="tel:+18008974661" className="block bg-card border rounded-2xl p-4 font-bold text-sm">📞 Call +1 (800) 897-466</a>
        <a href="mailto:support@typhonmachinery.com" className="block bg-card border rounded-2xl p-4 font-bold text-sm">✉️ support@typhonmachinery.com</a>
        <a href="https://wa.me/18008974661" target="_blank" rel="noopener noreferrer" className="block bg-card border rounded-2xl p-4 font-bold text-sm">💬 Chat on WhatsApp</a>
      </div>
    );
  } else if (k === "about") {
    body = (
      <div className="text-center py-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-white font-black text-2xl">T</div>
        <p className="font-black text-xl mt-3">TYPHON</p>
        <p className="text-xs text-muted-foreground">Version 1.0.0 · Build 2026.06</p>
        <p className="text-[11px] text-muted-foreground mt-4 px-6">Premium American heavy machinery, delivered with intelligence.</p>
      </div>
    );
  } else if (k === "legal") {
    const docs: Record<string, string> = {
      "Terms of Service": "By using TYPHON you agree to our terms… (full text available at typhonmachinery.com/terms)",
      "Privacy Policy": "We respect your privacy. Data is stored locally and never sold…",
      "Cookie Policy": "TYPHON uses essential cookies for sessions, cart, and preferences…",
      "Acceptable Use": "No fraudulent listings, harassment, or illegal use of equipment…",
      "Licenses": "Built with React, TanStack Start, Tailwind, lucide-react. MIT.",
    };
    body = (
      <div className="bg-card border rounded-2xl divide-y overflow-hidden">
        {Object.keys(docs).map(x => (
          <button key={x} onClick={() => alert(`${x}\n\n${docs[x]}`)} className="w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center justify-between active:bg-muted">
            {x} <ChevRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "85vh" }}>
        <div className="px-4 py-4 border-b flex items-center justify-between shrink-0">
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted grid place-items-center"><ArrowLeft className="h-4 w-4" /></button>
          <h2 className="font-black text-lg">{titles[k]}</h2>
          <span className="h-9 w-9" />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 bg-muted/30">{body}</div>
      </div>
    </div>
  );
}


/* ============================================================
   PAYMENT METHODS PANEL (functional)
============================================================ */
function PaymentMethodsPanel() {
  const [cards, setCards] = usePaymentCards();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ brand: "Visa", number: "", exp: "" });

  const remove = (id: string) => {
    if (!confirm("Remove this card?")) return;
    setCards(cards.filter(c => c.id !== id));
  };
  const makeDefault = (id: string) => setCards(cards.map(c => ({ ...c, def: c.id === id })));
  const add = () => {
    const last4 = form.number.replace(/\D/g, "").slice(-4);
    if (last4.length < 4 || !/^\d{2}\/\d{2}$/.test(form.exp)) { alert("Enter a valid card number and expiry MM/YY."); return; }
    setCards([...cards, { id: "c" + Date.now(), brand: form.brand, last4, exp: form.exp }]);
    setAdding(false); setForm({ brand: "Visa", number: "", exp: "" });
  };

  return (
    <div className="space-y-2">
      {cards.map(c => (
        <div key={c.id} className="bg-card border rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-white text-[10px] font-black">{c.brand}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">•••• {c.last4}</p>
            <p className="text-[11px] text-muted-foreground truncate">Expires {c.exp}{c.def ? " · Default" : ""}</p>
          </div>
          {!c.def && <button onClick={() => makeDefault(c.id)} className="text-[11px] font-bold text-primary">Default</button>}
          <button onClick={() => remove(c.id)} className="text-[11px] font-bold text-error">Remove</button>
        </div>
      ))}
      {!adding ? (
        <button onClick={() => setAdding(true)} className="w-full rounded-2xl border-2 border-dashed border-primary/40 py-4 text-sm font-bold text-primary">+ Add payment method</button>
      ) : (
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <p className="font-black text-sm">New card</p>
          <select value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm font-bold outline-none">
            {["Visa", "Mastercard", "Amex", "Discover"].map(b => <option key={b}>{b}</option>)}
          </select>
          <input value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="Card number" inputMode="numeric" className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm outline-none" />
          <input value={form.exp} onChange={e => setForm({ ...form, exp: e.target.value })} placeholder="MM/YY" className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm outline-none" />
          <div className="flex gap-2 pt-1">
            <button onClick={() => setAdding(false)} className="flex-1 rounded-xl bg-muted py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={add} className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-black">Save card</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECURITY PANEL (functional)
============================================================ */
function SecurityPanel() {
  const [sec, setSec] = useSecurity();
  const [view, setView] = useState<"root" | "pw" | "devices" | "history">("root");
  const [pw, setPw] = useState({ old: "", n: "", c: "" });

  const changePassword = () => {
    if (pw.n.length < 8) { alert("Password must be at least 8 characters."); return; }
    if (pw.n !== pw.c) { alert("Passwords do not match."); return; }
    setSec({ ...sec, passwordUpdatedAt: Date.now() });
    setPw({ old: "", n: "", c: "" });
    alert("Password updated.");
    setView("root");
  };
  const revoke = (id: string) => setSec({ ...sec, devices: sec.devices.filter(d => d.id !== id) });
  const deleteAccount = () => {
    if (!confirm("Permanently delete your account? This cannot be undone.")) return;
    if (!confirm("Are you absolutely sure?")) return;
    alert("Account deletion request submitted. You'll receive an email confirmation within 24 hours.");
  };

  if (view === "pw") return (
    <div className="space-y-2">
      <button onClick={() => setView("root")} className="text-xs font-bold text-primary mb-2">← Back</button>
      <input type="password" placeholder="Current password" value={pw.old} onChange={e => setPw({ ...pw, old: e.target.value })} className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm outline-none" />
      <input type="password" placeholder="New password (min 8 chars)" value={pw.n} onChange={e => setPw({ ...pw, n: e.target.value })} className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm outline-none" />
      <input type="password" placeholder="Confirm new password" value={pw.c} onChange={e => setPw({ ...pw, c: e.target.value })} className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm outline-none" />
      <button onClick={changePassword} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 text-sm mt-2">Update password</button>
    </div>
  );

  if (view === "devices") return (
    <div className="space-y-2">
      <button onClick={() => setView("root")} className="text-xs font-bold text-primary mb-2">← Back</button>
      {sec.devices.map(d => (
        <div key={d.id} className="bg-card border rounded-2xl p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{d.name}</p>
            <p className="text-[11px] text-muted-foreground">Last active {new Date(d.lastSeen).toLocaleString()}</p>
          </div>
          <button onClick={() => revoke(d.id)} className="text-[11px] font-bold text-error">Revoke</button>
        </div>
      ))}
      {sec.devices.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No active sessions.</p>}
    </div>
  );

  if (view === "history") return (
    <div className="space-y-2">
      <button onClick={() => setView("root")} className="text-xs font-bold text-primary mb-2">← Back</button>
      {sec.loginHistory.map(l => (
        <div key={l.id} className="bg-card border rounded-2xl p-3">
          <p className="font-bold text-sm">{l.where}</p>
          <p className="text-[11px] text-muted-foreground">{new Date(l.ts).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border rounded-2xl divide-y overflow-hidden">
      <button onClick={() => setView("pw")} className="w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center justify-between active:bg-muted">
        Change password <ChevRight className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold">Two-factor authentication</p>
          <p className="text-[11px] text-muted-foreground">{sec.twoFactor ? "Enabled · SMS" : "Disabled"}</p>
        </div>
        <button onClick={() => setSec({ ...sec, twoFactor: !sec.twoFactor })} className={`relative h-6 w-11 rounded-full transition-colors ${sec.twoFactor ? "bg-primary" : "bg-muted-foreground/30"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${sec.twoFactor ? "left-5" : "left-0.5"}`} />
        </button>
      </div>
      <button onClick={() => setView("devices")} className="w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center justify-between active:bg-muted">
        Connected devices <span className="text-xs text-muted-foreground">{sec.devices.length} active <ChevRight className="inline h-4 w-4" /></span>
      </button>
      <button onClick={() => setView("history")} className="w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center justify-between active:bg-muted">
        Login history <ChevRight className="h-4 w-4 text-muted-foreground" />
      </button>
      <button onClick={deleteAccount} className="w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center justify-between active:bg-muted text-error">
        Delete account <ChevRight className="h-4 w-4" />
      </button>
    </div>
  );
}
