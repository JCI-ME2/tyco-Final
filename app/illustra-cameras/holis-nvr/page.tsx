import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function IllustraCamerasHolisNvrPage() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Holis-kKAHquI2puHuTknhzFsJtojZ8zxKb0.mp4" />
      <VideoProductSelector
        sheet="Holis NVR"
        category="Holis NVR"
        filterColumns={["Max Channels", "HDD Bays", "Max Storage", "Features"]}
      />
    </>
  );
}
