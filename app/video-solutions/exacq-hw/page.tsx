import { VideoProductSelector } from "@/components/video-product-selector";
import { AccessControlVideo } from "@/components/access-control-video";

export default function ExacqHwPage() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Exacq%20HW-q00MN1QauB6EG6bKqy3S0nMsxMhHJo.mp4" />
      <VideoProductSelector
        sheet="Exacq HW"
        category="Exacq Hardware"
        filterColumns={["Hardware Type", "Max Channels / Servers / Streams", "Operating System", "Software Pro / Ent", "Usable Storage", "Form Factor /  Features"]}
      />
    </>
  );
}
