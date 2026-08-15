import { VideoSolutionsHeader } from "@/components/video-solutions-header";

export default function VideoSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <VideoSolutionsHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-brand py-6 text-center text-xs text-brand-foreground/70">
        American Dynamics
      </footer>
    </div>
  );
}
