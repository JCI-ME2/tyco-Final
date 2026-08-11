import { VideoProductSelector } from "@/components/video-product-selector";

export default function IllustraStandardPage() {
  return (
    <VideoProductSelector
      sheet="Illustra Standard"
      category="Illustra Standard"
      filterColumns={["Series", "Resolution", "Shape", "Lens type", "Lens mm", "In / outdoor", "IR", "Video Analytics"]}
      showBanner
    />
  );
}
