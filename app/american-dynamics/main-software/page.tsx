import { ProductSelector } from "@/components/product-selector";
import { mainSoftware } from "@/data/american-dynamics";

export default function MainSoftwarePage() {
  return (
    <ProductSelector
      title="Main Software"
      subtitle="Victor VMS server & client licenses, integrations, AI analytics and VideoEdge add-ons"
      data={mainSoftware}
      partKey="Part Number"
      descriptionKey="Description"
      category="American Dynamics - Main Software"
      filters={[
        { key: "License Category", label: "Category" },
        { key: "System Level", label: "System Level" },
        { key: "License Type", label: "License Type" },
      ]}
    />
  );
}
