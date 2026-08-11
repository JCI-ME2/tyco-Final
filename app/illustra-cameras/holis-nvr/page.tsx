import { VideoProductSelector } from "@/components/video-product-selector";
import { Hero } from "@/components/hero";
import { AccessControlVideo } from "@/components/access-control-video";

export default function IllustraCamerasHolisNvrPage() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Holis-kKAHquI2puHuTknhzFsJtojZ8zxKb0.mp4" />
      <Hero title="Holis NVR" subtitle="Select your NVR based on Channels, HDD bays and Storages Required" />
      <VideoProductSelector
        sheet="Holis NVR"
        category="Holis NVR"
        filterColumns={["Max Channels", "HDD Bays", "Max Storage", "Features"]}
      />
    </>
  );
}
