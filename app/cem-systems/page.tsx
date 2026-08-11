import Link from "next/link";
import { Server, Cpu, ScanLine, Fingerprint, Lock, Blocks } from "lucide-react";
import { Hero } from "@/components/hero";
import { mainSoftware, softwareModules, controllers, cardReaders, biometrics, locks } from "@/data/cem-systems";

const categories = [
  {
    href: "/cem-systems/main-software",
    label: "Main Software",
    desc: `AC2000 server bundles, licences & upgrades (${mainSoftware.length} parts).`,
    Icon: Server,
  },
  {
    href: "/cem-systems/software-modules",
    label: "Software Modules",
    desc: `Integration licences, hardware & professional services (${softwareModules.length} parts).`,
    Icon: Blocks,
  },
  {
    href: "/cem-systems/controllers",
    label: "Controllers",
    desc: `DCM, ECM, IO modules & door interface units (${controllers.length} parts).`,
    Icon: Cpu,
  },
  {
    href: "/cem-systems/card-readers",
    label: "Card Readers",
    desc: `emerald terminals, S700 series, STID & HID readers (${cardReaders.length} parts).`,
    Icon: ScanLine,
  },
  {
    href: "/cem-systems/biometrics",
    label: "Biometrics",
    desc: `Fingerprint, face and iris readers (${biometrics.length} parts).`,
    Icon: Fingerprint,
  },
  {
    href: "/cem-systems/locks",
    label: "Locks",
    desc: `Magnetic locks, shear locks, bolts & accessories (${locks.length} parts).`,
    Icon: Lock,
  },
];

export default function CemSystemsIndex() {
  return (
    <>
      <Hero title="CEM Systems — AC2000 Access Control" />

      <section className="mx-auto max-w-[1400px] px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground">
          Pick a Category to Build Your Order
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each category opens a part-number selector with dropdown filters.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
