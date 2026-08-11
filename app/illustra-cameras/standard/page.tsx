import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function IllustraStandardPage() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Illustra%20All%20Video-ah3VFwd2Yp0cbGcHr6icHANZ5tW543.mp4" />
      <VideoProductSelector
        sheet="Illustra Standard"
        category="Illustra Standard"
        filterColumns={["Series", "Resolution", "Shape", "Lens type", "Lens mm", "In / outdoor", "IR", "Video Analytics"]}
        showBanner
      />
    </>
  );
}
