"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

const brands = [
  { label: "Exacq", href: "/video-solutions" },
  { label: "Kantech", href: "/access-control" },
  { label: "CEM Systems", href: "/cem-systems" },
  { label: "Illustra", href: "/illustra-cameras" },
  { label: "American Dynamics", href: "/american-dynamics" },
];

export function OurBrandsMenu() {
  const pathname = usePathname();

  return (
    <details className="relative shrink-0">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-2 text-sm font-semibold tracking-wide text-accent hover:bg-secondary [&::-webkit-details-marker]:hidden">
        Our Brands
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div className="absolute left-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-border bg-background p-1 shadow-lg">
        {brands.map((brand) => (
          <Link
            key={brand.href}
            href={brand.href}
            className={`block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary ${pathname.startsWith(brand.href) ? "bg-secondary font-medium" : ""}`}
          >
            {brand.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
