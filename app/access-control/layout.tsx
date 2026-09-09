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
    </div>
  );
}
