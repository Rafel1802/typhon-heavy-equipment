import { useEffect, useState, useCallback } from "react";

const K = {
  banners: "typhon.banners",
  products: "typhon.products",
  profile: "typhon.profile",
  chat: "typhon.chat",
  recents: "typhon.recents",
  viewed: "typhon.viewed",
  wishlist: "typhon.wishlist",
  following: "typhon.following",
  wallet: "typhon.wallet",
  addresses: "typhon.addresses",
  quotes: "typhon.quotes",
};

function load<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(k: string, v: T) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

export function useLocal<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => load<T>(key, initial));
  useEffect(() => { save(key, val); }, [key, val]);
  const set = useCallback((v: T | ((p: T) => T)) => setVal(v), []);
  return [val, set] as const;
}

export type Banner = { id: string; title: string; subtitle: string; cta: string; image: string; live: boolean };
export type Profile = { name: string; company: string; location: string; initials: string; avatar?: string; cover?: string; email: string; phone: string };
export type ChatMsg = { role: "ai" | "user"; text: string; productIds?: string[]; ts: number };
export type ChatSession = { id: string; title: string; createdAt: number; messages: ChatMsg[] };

export const STORE_KEYS = K;

export function useBanners(defaults: Banner[]) { return useLocal<Banner[]>(K.banners, defaults); }
export function useProfile(defaults: Profile) { return useLocal<Profile>(K.profile, defaults); }
export function useChatSessions() { return useLocal<ChatSession[]>(K.chat, []); }
export function useRecentSearches() { return useLocal<string[]>(K.recents, []); }
export function useRecentlyViewed() { return useLocal<string[]>(K.viewed, []); }
export function useWishlist() { return useLocal<string[]>(K.wishlist, []); }
export function useFollowing() { return useLocal<string[]>(K.following, ["Typhon Official Store", "Heavy Parts Co."]); }
export function useWallet() { return useLocal<{ balance: number; credits: number; tx: { id: string; label: string; amount: number; ts: number }[] }>(K.wallet, { balance: 240, credits: 60, tx: [
  { id: "t1", label: "Welcome credit", amount: 60, ts: Date.now() - 86400000 },
  { id: "t2", label: "Refund · order #83992", amount: 180, ts: Date.now() - 172800000 },
] }); }
export type Address = { id: string; label: string; name: string; line: string; phone: string; default?: boolean };
export function useAddresses() { return useLocal<Address[]>(K.addresses, [
  { id: "a1", label: "Home", name: "John Miller", line: "2840 Industrial Blvd, Dallas, TX 75207", phone: "+1 (214) 555-0142", default: true },
  { id: "a2", label: "Job Site", name: "Riverside Project", line: "5500 Trinity River Rd, Fort Worth, TX 76104", phone: "+1 (214) 555-0142" },
]); }
export function useQuotes() { return useLocal<{ id: string; product: string; status: "Pending" | "Approved" | "Expired"; price: number; ts: number }[]>(K.quotes, [
  { id: "Q-1042", product: "SL-26 Electric Scissor Lift", status: "Pending", price: 0, ts: Date.now() - 86400000 },
  { id: "Q-1038", product: "WL-50 Wheel Loader · Fleet (3)", status: "Approved", price: 224000, ts: Date.now() - 432000000 },
  { id: "Q-1011", product: "Custom attachment bundle", status: "Expired", price: 12400, ts: Date.now() - 2592000000 },
]); }
