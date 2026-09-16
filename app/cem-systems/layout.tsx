import { CemSystemsHeader } from "@/components/cem-systems-header";
import { InsidePageFooter } from "@/components/inside-page-footer";

export default function CemSystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <CemSystemsHeader />
      <main className="flex-1">{children}</main>
      <InsidePageFooter />
    </div>
  );
}
