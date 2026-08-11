import { VideoProductSelector } from "@/components/video-product-selector";

export default function IllustraProFlexPage() {
  return (
    <VideoProductSelector
      sheet="Illustra"
      category="Illustra Pro and Flex"
      filterColumns={["Series", "Resolution", "Shape", "Lens type", "Lens mm", "In / outdoor", "IR", "Video Analytics"]}
      showBanner
      partNumberPrefixes={["IFS0", "IPS0"]}
    />
  );
}
