"use client";

import Link from "next/link";
import { Minus, Plus, X, ArrowLeft, Copy, Check, Download, ArrowRight } from "lucide-react";
import { useCart, updateQuantity, removeFromCart, clearCart } from "@/lib/cart";
import { useState, useCallback } from "react";
import { Hero } from "@/components/hero";

export function CartView({ backHref, title }: { backHref: string; title: string }) {
  const items = useCart();
  const [copiedPn, setCopiedPn] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPn(text);
    setTimeout(() => setCopiedPn((c) => (c === text ? null : c)), 1500);
  }, []);

  const downloadCsv = () => {
    const header = "Quantity,Part Number";
    const rows = items.map((i) => `${i.quantity},"${i.partNumber}"`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cart.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Hero title={title} />

      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>

        {items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-4 py-16 text-center text-muted-foreground">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.partNumber}
                  className="relative flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold tracking-wide text-brand">
                        {item.partNumber}
                      </span>
                      <button
                        onClick={() => copy(item.partNumber)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy part number"
                      >
                        {copiedPn === item.partNumber ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex w-[112px] items-center rounded-md border border-input">
                      <button
                        onClick={() => updateQuantity(item.partNumber, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center text-foreground/70 hover:bg-secondary"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.partNumber, parseInt(e.target.value, 10) || 1)
                        }
                        className="h-9 w-full border-x border-input bg-transparent text-center text-sm outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.partNumber, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center text-foreground/70 hover:bg-secondary"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.partNumber)}
                      className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </button>
              <Link
                href="/project-registration"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
              >
                Proceed to Registration
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={clearCart}
                className="ml-auto inline-flex items-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
