import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function ExacqSwPage() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Exacq%20SW-f4caWYSGuWgv5uVufMiWGsPhqjGlbo.mp4" />
      <VideoProductSelector
        sheet="Exacq SW"
        category="Exacq Software"
        filterColumns={["License Type", "Level", "Validity"]}
      />
    </>
  );
}
