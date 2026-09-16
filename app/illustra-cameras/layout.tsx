import { IllustraCamerasHeader } from "@/components/illustra-cameras-header";
import { InsidePageFooter } from "@/components/inside-page-footer";

export default function IllustraCamerasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <IllustraCamerasHeader />
      <main className="flex-1">{children}</main>
      <InsidePageFooter />
    </div>
  );
}
