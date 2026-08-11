import { ProductSelector } from "@/components/product-selector";
import { biometrics } from "@/data/cem-systems";

export default function BiometricsPage() {
  return (
    <ProductSelector
      category="CEM Biometrics"
      title="AC2000 Biometric Readers"
      subtitle="Fingerprint, face and iris readers compatible with AC2000 via Suprema BioStar and Idemia MorphoManager interfaces."
      data={biometrics}
      partKey="Biometric Reader"
      descriptionKey="Description"
      filters={[
        { key: "Biometric Type", label: "Biometric Type" },
        { key: "Reading Technolgy", label: "Reading Technology" },
        { key: "Indoor / Outdoor", label: "Indoor / Outdoor" },
        { key: "PoE / Additional Features", label: "PoE / Features" },
      ]}
    />
  );
}
