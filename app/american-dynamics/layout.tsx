import { AmericanDynamicsHeader } from "@/components/american-dynamics-header";
import { InsidePageFooter } from "@/components/inside-page-footer";

export default function AmericanDynamicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <AmericanDynamicsHeader />
      <main className="flex-1">{children}</main>
      <InsidePageFooter />
    </div>
  );
}
