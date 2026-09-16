import { VideoSolutionsHeader } from "@/components/video-solutions-header";
import { InsidePageFooter } from "@/components/inside-page-footer";

export default function VideoSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <VideoSolutionsHeader />
      <main className="flex-1">{children}</main>
      <InsidePageFooter />
    </div>
  );
}
