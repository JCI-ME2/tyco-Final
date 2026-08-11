import { ProductSelector } from "@/components/product-selector";
import { controllers } from "@/data/cem-systems";

export default function ControllersPage() {
  return (
    <ProductSelector
      category="CEM Controllers"
      title="AC2000 Controllers"
      subtitle="DCM door controllers, ECM convertors, IO modules, lift controllers and door interface units."
      data={controllers}
      partKey="Part Number"
      descriptionKey="Description"
      filters={[
        { key: "Category", label: "Category" },
        { key: "Maximum Doors", label: "Maximum Doors" },
        { key: "Module Type", label: "Module Type" },
        { key: "Housing / Add Feature", label: "Housing / PSU" },
      ]}
    />
  );
}
