import { ProductSelector } from "@/components/product-selector";
import { AccessControlVideo } from "@/components/access-control-video";
import { biometric } from "@/data/access-control";

export default function BiometricPage() {
  return (
    <>
      <AccessControlVideo youtubeId="0qDc7zO7lLo" />
      <ProductSelector
      category="Biometric"
      title="Biometric Readers"
      subtitle="Biometrics (Face, Finger and IRIS) readers with multi card readings options and features."
      data={biometric}
      partKey="Biometric Reader"
      descriptionKey="Description"
      filters={[
        { key: "Biometric Type", label: "Biometric Type" },
        { key: "Reading Technolgy", label: "Reading Technology" },
        { key: "Indoor / Outdoor", label: "Indoor / Outdoor" },
        { key: "PoE / Additional Features", label: "PoE / Additional Features" },
      ]}
      />
    </>
  );
}
