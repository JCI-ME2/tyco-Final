import { AccessControlHeader } from "@/components/access-control-header";
import { InsidePageFooter } from "@/components/inside-page-footer";

export default function AccessControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <AccessControlHeader />
      <main className="flex-1">{children}</main>
      <InsidePageFooter />
    </div>
  );
}
