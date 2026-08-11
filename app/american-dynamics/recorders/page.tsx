import { ProductSelector } from "@/components/product-selector";
import { recorders } from "@/data/american-dynamics";

export default function RecordersPage() {
  return (
    <ProductSelector
      title="Recorders"
      subtitle="VideoEdge NVRs, hybrid recorders and external storage systems"
      data={recorders}
      partKey="Part Number"
      descriptionKey="Description"
      category="American Dynamics - Recorders"
      filters={[
        { key: "Recorder type", label: "Type" },
        { key: "Channels", label: "Channels" },
        { key: "Raw Storage", label: "Storage" },
        { key: "Form Factor", label: "Form Factor" },
        { key: "Feature", label: "Feature" },
      ]}
    />
  );
}
