import { ProductSelector } from "@/components/product-selector";
import { cardReaders } from "@/data/cem-systems";

export default function CardReadersPage() {
  return (
    <ProductSelector
      category="CEM Card Readers"
      title="AC2000 Card Readers"
      subtitle="emerald terminals, S700 series, STID Architect, HID Signo and portable readers."
      data={cardReaders}
      partKey="Part Number"
      descriptionKey="Description"
      filters={[
        { key: "Shape / Mount", label: "Shape / Mount" },
        { key: "Reading Technology", label: "Reading Technology" },
        { key: "Connectivity", label: "Connectivity" },
        { key: "Additional Feature", label: "Additional Feature" },
      ]}
    />
  );
}
