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
    </div>
  );
}
