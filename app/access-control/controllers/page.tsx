import { ProductSelector } from "@/components/product-selector";
import { AccessControlVideo } from "@/components/access-control-video";
import { controllers } from "@/data/access-control";

export default function ControllersPage() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Controllers-SDLH5jwSZc0bmGCRg2f3umoQafwKdn.mp4" />
      <ProductSelector
      category="Controllers"
      title="Controllers"
      subtitle="Select your controller or module PN according to number of doors or housing type."
      data={controllers}
      partKey="Part Nymber"
      descriptionKey="Description"
      filters={[
        { key: "Category", label: "Category" },
        { key: "Maximum Doors", label: "Maximum Doors" },
        { key: "Component Type", label: "Component Type" },
        { key: "Housing / Add Feature", label: "Housing / Add Feature" },
      ]}
      />
    </>
  );
}
