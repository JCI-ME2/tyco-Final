import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function IllustraStandardPage() {
  return (
    <>
      <AccessControlVideo youtubeId="S1xZoTt94Ro" />
      <VideoProductSelector
        sheet="Illustra Standard"
        category="Illustra Standard"
        filterColumns={["Series", "Resolution", "Shape", "Lens type", "Lens mm", "In / outdoor", "IR", "Video Analytics"]}
      />
    </>
  );
}
