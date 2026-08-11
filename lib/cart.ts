"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  partNumber: string;
  description?: string;
  category: string;
  quantity: number;
};

const STORAGE_KEY = "tyco_cart_v1";
let items: CartItem[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function load() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw);
  } catch { /* ignore */ }
}

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
  load();
  const qty = Math.max(1, item.quantity ?? 1);
  const existing = items.find((i) => i.partNumber === item.partNumber);
  if (existing) existing.quantity += qty;
  else items = [...items, { ...item, quantity: qty }];
  emit();
}

export function updateQuantity(partNumber: string, quantity: number) {
  load();
  if (quantity <= 0) items = items.filter((i) => i.partNumber !== partNumber);
  else items = items.map((i) => (i.partNumber === partNumber ? { ...i, quantity } : i));
  emit();
}

export function removeFromCart(partNumber: string) {
  load();
  items = items.filter((i) => i.partNumber !== partNumber);
  emit();
}

export function clearCart() {
  items = [];
  emit();
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot() { return items; }

// Must be a stable reference to avoid infinite loop
const emptyCart: CartItem[] = [];
function getServerSnapshot(): CartItem[] { return emptyCart; }

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount() {
  const cart = useCart();
  return cart.reduce((n, i) => n + i.quantity, 0);
}
