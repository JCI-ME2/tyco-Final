import type { ReactNode } from "react";

export function Hero({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-hero-from via-hero-from to-hero-to text-brand-foreground">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 14px)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-6 py-16 text-center">
        <h1 className="text-4xl font-light tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 text-base text-brand-foreground/80 md:text-lg">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
