import { ProductSelector } from "@/components/product-selector";
import { ssa } from "@/data/american-dynamics";

export default function SSAPage() {
  return (
    <ProductSelector
      title="SSA"
      subtitle="Software Support Agreements for Victor, VideoEdge and integrations"
      data={ssa}
      partKey="Part Number"
      descriptionKey="Description"
      category="American Dynamics - SSA"
      filters={[
        { key: "License Category", label: "Category" },
        { key: "System Level", label: "System Level" },
        { key: "License Type", label: "License Type" },
        { key: "License Validity", label: "Validity" },
      ]}
    />
  );
}
