import { ProductSelector } from "@/components/product-selector";
import { AccessControlVideo } from "@/components/access-control-video";
import { software } from "@/data/access-control";

export default function SoftwarePage() {
  return (
    <>
      <AccessControlVideo frameId="access-control-software" frameTitle="Access Control Software" />
      <ProductSelector
      category="Software"
      title="EntraPass Software"
      subtitle="find the exact license PN by Filtering software level, category, maximum doors and integration type."
      data={software}
      partKey="Part Nymber"
      descriptionKey="Description"
      filters={[
        { key: "Software Level", label: "Software Level" },
        { key: "Category", label: "Category" },
        { key: "Doors / Limitations", label: "Doors / Limitations" },
        { key: "Integration Type", label: "Integration Type" },
      ]}
      />
    </>
  );
}
