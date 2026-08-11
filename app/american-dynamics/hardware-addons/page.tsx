import { ProductSelector } from "@/components/product-selector";
import { hardwareAddons } from "@/data/american-dynamics";

export default function HardwareAddonsPage() {
  return (
    <ProductSelector
      title="Hardware Add-ons"
      subtitle="Servers, workstations, hard drives, rack mounts, encoders and accessories"
      data={hardwareAddons}
      partKey="Part Number"
      descriptionKey="Description"
      category="American Dynamics - Hardware Add-ons"
      filters={[
        { key: "Hardware Category", label: "Category" },
        { key: "Compatability", label: "Compatibility" },
        { key: "Feature", label: "Feature" },
      ]}
    />
  );
}
