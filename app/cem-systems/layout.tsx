import { CemSystemsHeader } from "@/components/cem-systems-header";

export default function CemSystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CemSystemsHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-brand py-6 text-center text-xs text-brand-foreground/70">
        CEM Systems AC2000
      </footer>
    </div>
  );
}
