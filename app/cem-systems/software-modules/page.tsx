import { ProductSelector } from "@/components/product-selector";
import { softwareModules } from "@/data/cem-systems";

export default function SoftwareModulesPage() {
  return (
    <ProductSelector
      category="CEM Software Modules"
      title="AC2000 Software Modules"
      subtitle="Integration licences, server hardware, workstations, monitors and professional services."
      data={softwareModules}
      partKey="Part Number"
      descriptionKey="Description"
      filters={[
        { key: "Category", label: "Category" },
        { key: "Type", label: "Type" },
        { key: "Integration Type", label: "Integration Type" },
      ]}
    />
  );
}
