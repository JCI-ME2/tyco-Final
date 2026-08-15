import { IllustraCamerasHeader } from "@/components/illustra-cameras-header";

export default function IllustraCamerasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <IllustraCamerasHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-brand py-6 text-center text-xs text-brand-foreground/70">
        Illustra Cameras
      </footer>
    </div>
  );
}
