import { ProductSelector } from "@/components/product-selector";
import { locks } from "@/data/cem-systems";

export default function LocksPage() {
  return (
    <ProductSelector
      category="CEM Locks"
      title="AC2000 Locks"
      subtitle="Magnetic locks, shear locks, bolt locks, brackets and exit control accessories."
      data={locks}
      partKey="Part Number"
      descriptionKey="Description"
      filters={[
        { key: "Type", label: "Type" },
        { key: "Lock Type", label: "Lock Type" },
        { key: "Door Type / Mount", label: "Door Type / Mount" },
        { key: "Monitored / Add Feature", label: "Monitored / Feature" },
      ]}
    />
  );
}
