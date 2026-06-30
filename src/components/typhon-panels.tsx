import { useEffect, useMemo, useRef, useState } from "react";
import {
  X, ArrowLeft, MapPin, Phone, Mail, MessageCircle, Heart, Store, Clock, Wallet, Gift,
  FileText, BadgeCheck, Plus, Trash2, Edit2, Search, ChevronRight, Camera, Share2, Copy,
  Check, CheckCircle2, ArrowRight, Banknote, TrendingUp,
} from "lucide-react";
import {
  useAddresses, useFollowing, useProfile, useQuotes, useRecentlyViewed, useWallet,
  useWishlist, type Profile,
} from "@/lib/typhon-store";

type Product = { id: string; name: string; brand: string; price: number | null; image: string; rating: number; [k: string]: any };

/* ---------- Reusable sheet shell ---------- */
export function Sheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 animate-float-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-[36px] border shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="px-4 py-4 border-b flex items-center justify-between shrink-0">
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted grid place-items-center"><ArrowLeft className="h-4 w-4" /></button>
          <h2 className="font-black text-lg">{title}</h2>
          <span className="h-9 w-9" />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4">{children}</div>
        {footer && <div className="p-3 border-t shrink-0 bg-background">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- Profile edit (avatar + cover) ---------- */
export function ProfileEditSheet({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useProfile({
    name: "John Miller", company: "Miller Construction Co.", location: "Dallas, TX",
    initials: "JM", email: "john@millerco.com", phone: "+1 (214) 555-0142",
  });
  const [draft, setDraft] = useState<Profile>(profile);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const pick = (kind: "avatar" | "cover", file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft(d => ({ ...d, [kind]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <Sheet title="Edit profile" onClose={onClose}
      footer={
        <button onClick={() => { setProfile(draft); onClose(); }} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5">Save changes</button>
      }>
      {/* Cover + avatar */}
      <div className="relative mb-14">
        <div className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-blue-700">
          {draft.cover && <img src={draft.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button onClick={() => coverRef.current?.click()} className="absolute bottom-2 right-2 glass-strong rounded-full px-3 py-1.5 text-[10px] font-bold flex items-center gap-1 text-white">
            <Camera className="h-3 w-3" /> Change cover
          </button>
        </div>
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => pick("cover", e.target.files?.[0])} />
        {/* Avatar — sits OUTSIDE the overflow-hidden cover */}
        <div className="absolute -bottom-10 left-4">
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-700 grid place-items-center font-black text-2xl text-white border-4 border-background overflow-hidden shadow-xl">
            {draft.avatar
              ? <img src={draft.avatar} alt="" className="absolute inset-0 h-full w-full object-cover" />
              : <span>{draft.initials}</span>}
          </div>
          <button onClick={() => avatarRef.current?.click()} className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center border-2 border-background shadow">
            <Camera className="h-3 w-3" />
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => pick("avatar", e.target.files?.[0])} />
        </div>
      </div>

      <div className="space-y-3">
        {[
          ["Name", "name"], ["Company", "company"], ["Location", "location"],
          ["Email", "email"], ["Phone", "phone"], ["Initials (fallback)", "initials"],
        ].map(([label, key]) => (
          <label key={key} className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            <div className="mt-1 glass rounded-2xl px-4 py-3">
              <input value={(draft as any)[key] ?? ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                className="w-full bg-transparent text-sm outline-none" />
            </div>
          </label>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Help & Support ---------- */
export function HelpSupportSheet({ onClose }: { onClose: () => void }) {
  const channels = [
    { icon: Phone, label: "Call us", value: "+1 (800) 897-466", action: () => (window.location.href = "tel:+18008974661"), color: "from-emerald-500 to-teal-600" },
    { icon: Mail, label: "Email support", value: "support@typhonmachinery.com", action: () => (window.location.href = "mailto:support@typhonmachinery.com?subject=TYPHON%20Support"), color: "from-primary to-blue-700" },
    { icon: MessageCircle, label: "WhatsApp", value: "+1 (800) 897-466", action: () => window.open("https://wa.me/18008974661", "_blank"), color: "from-green-500 to-emerald-600" },
  ];
  const faqs = [
    "How do I track my order?",
    "Can I cancel after placing an order?",
    "How does financing work?",
    "What's your return policy?",
  ];
  return (
    <Sheet title="Help & Support" onClose={onClose}>
      <p className="text-xs text-muted-foreground mb-3">24/7 support · Avg reply under 2 min</p>
      <div className="space-y-2">
        {channels.map(c => (
          <button key={c.label} onClick={c.action} className="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform">
            <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm">{c.label}</p>
              <p className="text-[11px] text-muted-foreground truncate">{c.value}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <p className="mt-5 mb-2 text-[10px] font-black tracking-wider uppercase text-muted-foreground px-1">Top questions</p>
      <div className="bg-card border rounded-2xl divide-y overflow-hidden">
        {faqs.map(q => (
          <button key={q} className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center justify-between active:bg-muted">
            {q} <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Share & Earn ---------- */
export function ShareEarnSheet({ onClose }: { onClose: () => void }) {
  const link = "https://typhon.app/r/JM-42K9";
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const share = (where: string) => {
    const text = encodeURIComponent("Shop heavy equipment with $20 off on Typhon — ");
    const url = encodeURIComponent(link);
    const targets: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}${url}`,
      sms: `sms:?&body=${text}${url}`,
      email: `mailto:?subject=Typhon%20$20%20credit&body=${text}${url}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };
    window.open(targets[where], "_blank");
  };
  return (
    <Sheet title="Share & Earn" onClose={onClose}>
      <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-700 text-white p-5 text-center">
        <Gift className="h-10 w-10 mx-auto opacity-90" />
        <p className="text-2xl font-black mt-2">$20 for you, $20 for them</p>
        <p className="text-xs opacity-85 mt-1">Earn credit every time a friend places their first order</p>
      </div>
      <p className="mt-4 mb-2 text-[10px] font-black tracking-wider uppercase text-muted-foreground px-1">Your referral link</p>
      <div className="glass rounded-2xl px-3 py-2.5 flex items-center gap-2">
        <code className="flex-1 text-xs font-bold truncate">{link}</code>
        <button onClick={copy} className="rounded-xl bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 flex items-center gap-1">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-4 mb-2 text-[10px] font-black tracking-wider uppercase text-muted-foreground px-1">Share via</p>
      <div className="grid grid-cols-4 gap-2">
        {[
          { k: "whatsapp", label: "WhatsApp", color: "bg-green-500" },
          { k: "sms", label: "SMS", color: "bg-primary" },
          { k: "email", label: "Email", color: "bg-foreground" },
          { k: "x", label: "X", color: "bg-black dark:bg-white dark:text-black" },
        ].map(o => (
          <button key={o.k} onClick={() => share(o.k)} className="flex flex-col items-center gap-1 py-3 rounded-2xl glass">
            <div className={`h-10 w-10 rounded-full ${o.color} text-white grid place-items-center`}><Share2 className="h-4 w-4" /></div>
            <span className="text-[10px] font-bold">{o.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 bg-card border rounded-2xl p-4 text-center">
        <p className="text-3xl font-black text-primary">3</p>
        <p className="text-xs text-muted-foreground">friends joined · <span className="text-success font-bold">$60 earned</span></p>
      </div>
    </Sheet>
  );
}

/* ---------- Wishlist / Following / History ---------- */
export function WishlistSheet({ onClose, products, onOpenProduct }: { onClose: () => void; products: Product[]; onOpenProduct: (p: Product) => void }) {
  const [list, setList] = useWishlist();
  const items = products.filter(p => list.includes(p.id));
  return (
    <Sheet title="Wishlist" onClose={onClose}>
      {items.length === 0 ? (
        <Empty icon={<Heart className="h-7 w-7" />} text="Tap the heart on any product to save it here." />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map(p => (
            <button key={p.id} onClick={() => onOpenProduct(p)} className="bg-card border rounded-2xl overflow-hidden text-left">
              <img src={p.image} alt="" className="aspect-square w-full object-cover" />
              <div className="p-2 space-y-1">
                <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                <p className="text-sm font-black text-primary">{p.price ? `$${p.price.toLocaleString()}` : "Quote"}</p>
                <button onClick={(e) => { e.stopPropagation(); setList(l => l.filter(x => x !== p.id)); }}
                  className="text-[10px] text-error font-bold">Remove</button>
              </div>
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}

export function FollowingSheet({ onClose }: { onClose: () => void }) {
  const [list, setList] = useFollowing();
  return (
    <Sheet title="Following" onClose={onClose}>
      <div className="space-y-2">
        {list.map(s => (
          <div key={s} className="bg-card border rounded-2xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center"><Store className="h-4 w-4 text-primary" /></div>
            <p className="flex-1 font-bold text-sm">{s}</p>
            <button onClick={() => setList(l => l.filter(x => x !== s))} className="text-[11px] font-bold text-muted-foreground border rounded-full px-3 py-1">Unfollow</button>
          </div>
        ))}
        {list.length === 0 && <Empty icon={<Store className="h-7 w-7" />} text="Follow stores to see their newest equipment first." />}
      </div>
    </Sheet>
  );
}

export function HistorySheet({ onClose, products, onOpenProduct }: { onClose: () => void; products: Product[]; onOpenProduct: (p: Product) => void }) {
  const [ids, setIds] = useRecentlyViewed();
  const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  return (
    <Sheet title="Recently viewed" onClose={onClose}
      footer={ids.length ? <button onClick={() => setIds([])} className="w-full rounded-2xl bg-muted text-foreground font-bold py-3 text-sm">Clear history</button> : undefined}>
      {items.length === 0 ? (
        <Empty icon={<Clock className="h-7 w-7" />} text="Products you view will appear here." />
      ) : (
        <div className="space-y-2">
          {items.map(p => (
            <button key={p.id} onClick={() => onOpenProduct(p)} className="w-full bg-card border rounded-2xl p-2.5 flex items-center gap-3 text-left">
              <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{p.name}</p>
                <p className="text-xs text-primary font-black">{p.price ? `$${p.price.toLocaleString()}` : "Quote"}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}

/* ---------- Wallet ---------- */
export function WalletSheet({ onClose }: { onClose: () => void }) {
  const [w] = useWallet();
  return (
    <Sheet title="Wallet" onClose={onClose}>
      <div className="rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white p-5">
        <p className="text-xs opacity-80">Available balance</p>
        <p className="text-3xl font-black mt-1">${w.balance.toFixed(2)}</p>
        <div className="flex items-center justify-between mt-3 text-xs opacity-90">
          <span>Typhon credits: ${w.credits}</span>
          <button className="rounded-full bg-white/20 backdrop-blur px-3 py-1 font-bold text-[11px]">Top up</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { icon: Banknote, label: "Top up" },
          { icon: ArrowRight, label: "Send" },
          { icon: TrendingUp, label: "Earn" },
        ].map(a => (
          <button key={a.label} className="bg-card border rounded-2xl py-3 flex flex-col items-center gap-1">
            <a.icon className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold">{a.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 mb-2 text-[10px] font-black tracking-wider uppercase text-muted-foreground px-1">Recent</p>
      <div className="bg-card border rounded-2xl divide-y overflow-hidden">
        {w.tx.map(t => (
          <div key={t.id} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{t.label}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(t.ts).toLocaleDateString()}</p>
            </div>
            <p className={`font-black text-sm ${t.amount > 0 ? "text-success" : "text-error"}`}>{t.amount > 0 ? "+" : ""}${t.amount}</p>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Addresses (Taobao / Amazon style) ---------- */
type AddrDraft = {
  label: string; name: string; phone: string;
  country: string; state: string; city: string;
  zip: string; line1: string; line2: string;
  default: boolean;
};
const EMPTY_ADDR: AddrDraft = {
  label: "Home", name: "", phone: "", country: "United States",
  state: "", city: "", zip: "", line1: "", line2: "", default: false,
};
const LABEL_OPTS = ["Home", "Job Site", "Office", "Warehouse"];

export function AddressesSheet({ onClose }: { onClose: () => void }) {
  const [list, setList] = useAddresses();
  const [editing, setEditing] = useState<null | string>(null);
  const [draft, setDraft] = useState<AddrDraft>(EMPTY_ADDR);

  const startNew = () => { setDraft({ ...EMPTY_ADDR, default: list.length === 0 }); setEditing("new"); };
  const startEdit = (a: any) => {
    const parts = (a.line || "").split(",").map((s: string) => s.trim());
    setDraft({
      label: a.label || "Home", name: a.name || "", phone: a.phone || "",
      country: "United States",
      state: parts[2]?.split(" ")[0] || "", city: parts[1] || "",
      zip: parts[2]?.split(" ")[1] || "", line1: parts[0] || "", line2: "",
      default: !!a.default,
    });
    setEditing(a.id);
  };
  const save = () => {
    if (!draft.name.trim() || !draft.line1.trim() || !draft.phone.trim()) return;
    const line = [draft.line1, draft.city, `${draft.state} ${draft.zip}`.trim()].filter(Boolean).join(", ");
    const next = { label: draft.label, name: draft.name, phone: draft.phone, line };
    setList(l => {
      let updated = editing === "new"
        ? [...l, { id: `a${Date.now()}`, ...next, default: draft.default }]
        : l.map(a => a.id === editing ? { ...a, ...next, default: draft.default } : a);
      if (draft.default) updated = updated.map(a => ({ ...a, default: a.id === (editing === "new" ? updated[updated.length - 1].id : editing) }));
      return updated;
    });
    setEditing(null);
  };

  return (
    <Sheet title="Shipping Addresses" onClose={onClose}
      footer={<button onClick={startNew} className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"><Plus className="h-4 w-4" /> Add new address</button>}>
      <div className="space-y-2.5">
        {list.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">No addresses yet. Add one to start shipping.</div>
        )}
        {list.map(a => (
          <div key={a.id} className="bg-card border rounded-2xl p-4 relative">
            {a.default && <span className="absolute top-3 right-3 text-[9px] font-black bg-primary text-primary-foreground rounded-full px-2 py-0.5 tracking-wider">DEFAULT</span>}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-md px-2 py-0.5">{a.label}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="font-black text-base">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.phone}</p>
            </div>
            <p className="text-[12px] text-foreground/80 mt-1 leading-relaxed">{a.line}</p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t">
              {!a.default && <button onClick={() => setList(l => l.map(x => ({ ...x, default: x.id === a.id })))} className="text-[11px] font-bold text-primary flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Set default</button>}
              <button onClick={() => startEdit(a)} className="text-[11px] font-bold ml-auto text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => setList(l => l.filter(x => x.id !== a.id))} className="text-[11px] font-bold text-error">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setEditing(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[420px] bg-background rounded-t-3xl sm:rounded-3xl border max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b">
              <p className="font-black text-base">{editing === "new" ? "New address" : "Edit address"}</p>
              <button onClick={() => setEditing(null)} className="h-8 w-8 rounded-full bg-muted grid place-items-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Tag</p>
                <div className="flex gap-2 flex-wrap">
                  {LABEL_OPTS.map(l => (
                    <button key={l} onClick={() => setDraft(d => ({ ...d, label: l }))}
                      className={`text-xs font-bold rounded-full px-3 py-1.5 border-2 transition-all ${draft.label === l ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted text-muted-foreground"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Contact name">
                <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  placeholder="Full name" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
              </Field>
              <Field label="Phone number">
                <input value={draft.phone} onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                  placeholder="+1 (___) ___-____" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
              </Field>
              <Field label="Country / Region">
                <select value={draft.country} onChange={e => setDraft(d => ({ ...d, country: e.target.value }))}
                  className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none">
                  {["United States", "Canada", "Mexico"].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="State">
                  <input value={draft.state} onChange={e => setDraft(d => ({ ...d, state: e.target.value }))}
                    placeholder="TX" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
                </Field>
                <Field label="ZIP code">
                  <input value={draft.zip} onChange={e => setDraft(d => ({ ...d, zip: e.target.value }))}
                    placeholder="75201" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
                </Field>
              </div>
              <Field label="City">
                <input value={draft.city} onChange={e => setDraft(d => ({ ...d, city: e.target.value }))}
                  placeholder="Dallas" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
              </Field>
              <Field label="Street address">
                <input value={draft.line1} onChange={e => setDraft(d => ({ ...d, line1: e.target.value }))}
                  placeholder="Street, number" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
              </Field>
              <Field label="Apt / Suite / Notes (optional)">
                <input value={draft.line2} onChange={e => setDraft(d => ({ ...d, line2: e.target.value }))}
                  placeholder="Building, gate code, delivery notes" className="w-full bg-muted rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary" />
              </Field>
              <label className="flex items-center gap-3 bg-muted/50 rounded-xl px-3.5 py-3 cursor-pointer">
                <span className={`h-5 w-9 rounded-full p-0.5 transition-colors ${draft.default ? "bg-primary" : "bg-muted-foreground/30"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${draft.default ? "translate-x-4" : ""}`} />
                </span>
                <input type="checkbox" checked={draft.default} onChange={e => setDraft(d => ({ ...d, default: e.target.checked }))} className="sr-only" />
                <span className="text-sm font-bold flex-1">Set as default shipping address</span>
              </label>
            </div>
            <div className="px-5 py-3 border-t bg-background">
              <button onClick={save}
                disabled={!draft.name.trim() || !draft.line1.trim() || !draft.phone.trim()}
                className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3.5 text-sm active:scale-[0.98] transition-transform disabled:opacity-50">
                Save address
              </button>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
      {children}
    </div>
  );
}


/* ---------- My Quotes ---------- */
export function QuotesSheet({ onClose }: { onClose: () => void }) {
  const [list] = useQuotes();
  return (
    <Sheet title="My Quotes" onClose={onClose}>
      <div className="space-y-2">
        {list.map(q => (
          <div key={q.id} className="bg-card border rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <p className="font-black text-sm">{q.id}</p>
              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                q.status === "Approved" ? "bg-success/15 text-success" :
                q.status === "Pending" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
              }`}>{q.status}</span>
            </div>
            <p className="text-sm mt-1">{q.product}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[11px] text-muted-foreground">{new Date(q.ts).toLocaleDateString()}</p>
              {q.price > 0 && <p className="font-black text-primary text-sm">${q.price.toLocaleString()}</p>}
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Verified Business ---------- */
export function VerifiedSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="Verified Business" onClose={onClose}>
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5">
        <BadgeCheck className="h-10 w-10" />
        <p className="text-xl font-black mt-2">Status · Active</p>
        <p className="text-xs opacity-85 mt-1">Verified on Jan 14, 2025 · Net-30 invoicing enabled</p>
      </div>
      <div className="bg-card border rounded-2xl mt-3 divide-y overflow-hidden text-sm">
        {[
          ["Legal name", "Miller Construction Co."],
          ["EIN", "•••• 3942"],
          ["Tax exempt", "TX Resale Cert."],
          ["Credit line", "$250,000"],
        ].map(([l, v]) => (
          <div key={l} className="flex justify-between px-4 py-3">
            <span className="text-muted-foreground">{l}</span>
            <span className="font-bold">{v}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="py-16 text-center">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-muted grid place-items-center text-muted-foreground">{icon}</div>
      <p className="mt-3 text-sm text-muted-foreground px-8">{text}</p>
    </div>
  );
}

/* ---------- Search Dropdown (Home) ---------- */
export function SearchDropdown({ query, products, onPick, onClose }: {
  query: string; products: Product[]; onPick: (p: Product) => void; onClose: () => void;
}) {
  const q = query.trim().toLowerCase();
  const matches = useMemo(() =>
    q ? products.filter(p => `${p.name} ${p.brand}`.toLowerCase().includes(q)).slice(0, 6) : [],
    [q, products]);
  if (!q) return null;
  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-background border rounded-2xl shadow-2xl overflow-hidden">
      {matches.length === 0 ? (
        <div className="p-4 text-center text-xs text-muted-foreground">No match for "{query}"</div>
      ) : (
        <div className="divide-y max-h-80 overflow-y-auto no-scrollbar">
          {matches.map(p => (
            <button key={p.id} onClick={() => { onPick(p); onClose(); }} className="w-full flex items-center gap-3 p-2.5 text-left active:bg-muted">
              <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.brand} · ★ {p.rating}</p>
              </div>
              <p className="text-xs font-black text-primary">{p.price ? `$${p.price.toLocaleString()}` : "Quote"}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Hero slideshow with auto-rotate ---------- */
export function HeroSlideshow({ slides, fallback, onShop }: {
  slides: { id: string; title: string; subtitle: string; cta: string; image: string }[];
  fallback: string;
  onShop?: () => void;
}) {
  const items = slides.length ? slides : [{ id: "f", title: "Compactors & Rollers", subtitle: "Up to 15% off", cta: "Shop Now", image: fallback }];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);
  const slide = items[idx];
  return (
    <div className="relative rounded-3xl overflow-hidden h-52 shadow-xl">
      {items.map((s, i) => (
        <img key={s.id} src={s.image} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
        <span className="self-start glass-strong rounded-full px-3 py-1 text-[10px] font-bold tracking-widest">{slide.subtitle.toUpperCase()}</span>
        <div>
          <h2 className="text-2xl font-black leading-tight">{slide.title}</h2>
          <button onClick={onShop} className="mt-3 inline-flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-bold">
            {slide.cta} <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="absolute bottom-3 right-5 flex gap-1">
          {items.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
