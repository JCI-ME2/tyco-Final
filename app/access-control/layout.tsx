import { AccessControlHeader } from "@/components/access-control-header";

export default function AccessControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AccessControlHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-brand py-6 text-center text-xs text-brand-foreground/70">
        Kantech Access Control
      </footer>
    </div>
  );
}
