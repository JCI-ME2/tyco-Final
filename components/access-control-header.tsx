"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Home, FileSpreadsheet } from "lucide-react";
import { useCartCount } from "@/lib/cart";
import Image from "next/image";

const navItems = [
  { label: "Software", href: "/access-control/software" },
  { label: "Controllers", href: "/access-control/controllers" },
  { label: "Card Readers", href: "/access-control/card-readers" },
  { label: "Biometric", href: "/access-control/biometric" },
  { label: "Locks & More", href: "/access-control/maglocks" },
];

export function AccessControlHeader() {
  const count = useCartCount();
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
        <Link href="/access-control" className="flex items-center gap-3">
          <Image src="/images/jci-logo.png" alt="Johnson Controls" className="h-9 w-9 object-contain" width={36} height={36} />
          <span className="text-sm font-semibold tracking-wide text-accent leading-tight">
            Johnson Controls<br />Kantech
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={`rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground ${
                pathname === n.href ? "bg-secondary text-foreground" : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href="https://drive.google.com/uc?export=download&id=1AIiVm6TKAyh15qdLYmMtVbOqyoRBN4dv"
          target="_blank"
          rel="noopener noreferrer"
          title="Download KantechAllModels.xlsb"
          className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary lg:inline-flex"
        >
          <FileSpreadsheet className="h-5 w-5 text-[#107C41]" />
          All Models
        </a>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link
            href="/access-control/cart"
            className="group flex items-center gap-2 rounded-full border border-accent/40 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            My Cart
            <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground group-hover:bg-background group-hover:text-accent">
              {count}
            </span>
          </Link>
        </div>
      </div>
      <div className="h-[3px] w-full bg-gradient-to-r from-accent via-brand-accent to-accent" />
    </header>
  );
}
