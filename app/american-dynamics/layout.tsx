import { AmericanDynamicsHeader } from "@/components/american-dynamics-header";

export default function AmericanDynamicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AmericanDynamicsHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-brand py-6 text-center text-xs text-brand-foreground/70">
        American Dynamics
      </footer>
    </div>
  );
}
