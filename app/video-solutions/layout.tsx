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
    </div>
  );
}
