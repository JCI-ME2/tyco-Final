import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function ExacqHwPage() {
  return (
    <>
      <AccessControlVideo frameId="exacq-hardware" frameTitle="Exacq Hardware" />
      <VideoProductSelector
        sheet="Exacq HW"
        category="Exacq Hardware"
        filterColumns={["Hardware Type", "Max Channels / Servers / Streams", "Operating System", "Software Pro / Ent", "Usable Storage", "Form Factor /  Features"]}
      />
    </>
  );
}
