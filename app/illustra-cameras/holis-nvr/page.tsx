import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function IllustraCamerasHolisNvrPage() {
  return (
    <>
      <AccessControlVideo frameId="holis-nvr" frameTitle="Holis NVR" />
      <VideoProductSelector
        sheet="Holis NVR"
        category="Holis NVR"
        filterColumns={["Max Channels", "HDD Bays", "Max Storage", "Features"]}
      />
    </>
  );
}
