"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Home } from "lucide-react";
import { useCartCount } from "@/lib/cart";
import Image from "next/image";
import { OurBrandsMenu } from "@/components/our-brands-menu";

const navItems = [
  { label: "Illustra Pro and Flex", href: "/illustra-cameras/pro-flex" },
  { label: "Illustra Standard", href: "/illustra-cameras/standard" },
  { label: "Holis NVR", href: "/illustra-cameras/holis-nvr" },
];

export function IllustraCamerasHeader() {
  const count = useCartCount();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="border-b border-border bg-background">
        <nav className="mx-auto flex h-11 max-w-[1400px] items-center justify-end gap-0 px-6 text-[15px] text-foreground" aria-label="Utility navigation">
          {[['Contact an expert', '/'], ['Investors', '/'], ['Careers', '/'], ['Media Center', '/']].map(([label, href], index) => (
            <span key={label} className="flex items-center">
              <Link href={href} className="px-4 py-1 hover:text-jci-blue">{label}</Link>
              {index < 3 && <span aria-hidden="true" className="text-jci-blue">|</span>}
            </span>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex min-h-16 max-w-[1400px] items-center gap-6 px-6">
        <Link href="/illustra-cameras" className="flex items-center">
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/jci-logo-pages.png`} alt="Johnson Controls" className="h-9 w-auto object-contain" width={140} height={40} />
        </Link>
        <OurBrandsMenu />

        <nav className="ml-4 hidden items-center gap-2 lg:flex">
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

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link
            href="/illustra-cameras/cart"
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
      <div className="h-[3px] w-full bg-jci-blue" />
    </header>
  );
}
