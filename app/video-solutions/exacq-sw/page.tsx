import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function ExacqSwPage() {
  return (
    <>
      <AccessControlVideo frameId="exacq-software" frameTitle="Exacq Software" />
      <VideoProductSelector
        sheet="Exacq SW"
        category="Exacq Software"
        filterColumns={["License Type", "Level", "Validity"]}
      />
    </>
  );
}
