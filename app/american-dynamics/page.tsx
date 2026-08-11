import Link from "next/link";
import { Server, ShieldCheck, HardDrive, Wrench } from "lucide-react";
import { Hero } from "@/components/hero";
import { mainSoftware, ssa, recorders, hardwareAddons } from "@/data/american-dynamics";

const categories = [
  { href: "/american-dynamics/main-software", label: "Main Software", desc: `Victor VMS licenses, integrations & AI add-ons (${mainSoftware.length} parts).`, Icon: Server },
  { href: "/american-dynamics/ssa", label: "SSA", desc: `Software Support Agreements & renewals (${ssa.length} parts).`, Icon: ShieldCheck },
  { href: "/american-dynamics/recorders", label: "Recorders", desc: `VideoEdge NVRs, hybrids & external storage (${recorders.length} parts).`, Icon: HardDrive },
  { href: "/american-dynamics/hardware-addons", label: "Hardware Add-ons", desc: `Servers, workstations, HDDs & accessories (${hardwareAddons.length} parts).`, Icon: Wrench },
];

export default function AmericanDynamicsIndex() {
  return (
    <>
      <Hero title="Welcome to Johnson Controls American Dynamics" />

      <section className="mx-auto max-w-[1400px] px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground">Pick a Category to Build Your Order</h2>
        <p className="mt-1 text-sm text-muted-foreground">Each category opens a part-number selector with dropdown filters.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ href, label, desc, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-accent to-brand-accent opacity-80 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
