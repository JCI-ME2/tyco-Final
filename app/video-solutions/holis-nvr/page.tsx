import { VideoProductSelector } from "@/components/video-product-selector";
import { Hero } from "@/components/hero";

export default function HolisNvrPage() {
  return (
    <>
      <Hero title="Holis NVR" subtitle="Select your NVR based on Channels, HDD bays and Storages Required" />
      <VideoProductSelector
        sheet="Holis NVR"
        category="Holis NVR"
        filterColumns={["Max Channels", "HDD Bays", "Max Storage", "Features"]}
      />
    </>
  );
}
