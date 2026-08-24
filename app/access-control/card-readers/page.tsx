import { ProductSelector } from "@/components/product-selector";
import { AccessControlVideo } from "@/components/access-control-video";
import { cardReaders } from "@/data/access-control";

export default function CardReadersPage() {
  return (
    <>
      <AccessControlVideo youtubeId="8CFmAHK-hRk" />
      <ProductSelector
      category="Card Readers"
      title="Card Readers"
      subtitle="Readers selection by Shapes, features and connectivity"
      data={cardReaders}
      partKey="Card Reader"
      descriptionKey="Description"
      filters={[
        { key: "Shape / Mount", label: "Shape / Mount" },
        { key: "Reading Technolgy", label: "Reading Technology" },
        { key: "Connectivity", label: "Connectivity" },
        { key: "Additional Feature", label: "Additional Feature" },
      ]}
      />
    </>
  );
}
