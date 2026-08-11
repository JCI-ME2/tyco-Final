import { VideoProductSelector } from "@/components/video-product-selector";

export default function IllustraPage() {
  return (
    <VideoProductSelector
      sheet="Illustra"
      category="Illustra Cameras"
      filterColumns={["Series", "Resolution", "Shape", "Lens type", "Lens mm", "In / outdoor", "IR", "Video Analytics"]}
      showBanner
    />
  );
}
