import { ProductSelector } from "@/components/product-selector";
import { mainSoftware } from "@/data/cem-systems";

export default function MainSoftwarePage() {
  return (
    <ProductSelector
      category="CEM Main Software"
      title="AC2000 Main Software"
      subtitle="Select AC2000 server bundles, licences, upgrades and failover options by category and software level."
      data={mainSoftware}
      partKey="Part Number"
      descriptionKey="Description"
      filters={[
        { key: "Category", label: "Category" },
        { key: "Software Level", label: "Software Level" },
        { key: "Integration Type", label: "Integration Type" },
      ]}
    />
  );
}
