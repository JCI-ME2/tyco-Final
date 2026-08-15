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
    </div>
  );
}
