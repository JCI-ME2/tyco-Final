import { ProductSelector } from "@/components/product-selector";
import { AccessControlVideo } from "@/components/access-control-video";
import { magLocks } from "@/data/access-control";

export default function MagLocksPage() {
  return (
    <>
      <AccessControlVideo frameId="maglocks" frameTitle="Maglocks" />
      <ProductSelector
      category="MagLocks"
      title="Magnetic Locks"
      subtitle="Pick a lock type, door type and whether the lock should be monitored to narrow your selection."
      data={magLocks}
      partKey="Magnetic Locks"
      descriptionKey="Description"
      filters={[
        { key: "Type", label: "Type" },
        { key: "Lock Type", label: "Lock Type" },
        { key: "Door Type / Mount", label: "Door Type / Mount" },
        { key: "Monitored / Add Feature", label: "Monitored / Add Feature" },
      ]}
      />
    </>
  );
}
