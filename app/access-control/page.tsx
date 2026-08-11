import Link from "next/link";
import { Cpu, Server, ScanLine, Fingerprint, Lock, GraduationCap, DoorOpen, Settings } from "lucide-react";
import { software, controllers, cardReaders, biometric, magLocks } from "@/data/access-control";
import { AccessControlVideo } from "@/components/access-control-video";

const categories = [
  { href: "/access-control/software", label: "Software", desc: `EntraPass editions, licenses & integrations (${software.length} parts).`, Icon: Server },
  { href: "/access-control/controllers", label: "Controllers", desc: `KT-1, KT-2, KT-4 controllers & components (${controllers.length} parts).`, Icon: Cpu },
  { href: "/access-control/card-readers", label: "Card Readers", desc: `Mullion, single gang, multi-tech readers (${cardReaders.length} parts).`, Icon: ScanLine },
  { href: "/access-control/biometric", label: "Biometric", desc: `Face, fingerprint and iris readers (${biometric.length} parts).`, Icon: Fingerprint },
  { href: "/access-control/maglocks", label: "Locks & More", desc: `Magnetic locks for single & double doors (${magLocks.length} parts).`, Icon: Lock },
  { href: "/access-control/quiz", label: "Quiz", desc: `Test your Kantech & EntraPass knowledge with a sequential quiz.`, Icon: GraduationCap },
];

export default function AccessControlIndex() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video-k4sL3Qxb6aHcXumgClVgw5P4eBBaid.mp4" />

      <section className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Pick a Category to Build Your Order</h2>
            <p className="mt-1 text-sm text-muted-foreground">Each category opens a part-number selector with dropdown filters.</p>
          </div>

          <Link
            href="/access-control/wizard"
            aria-label="Open the EntraPass configuration wizard"
            className="group flex items-center gap-5 rounded-xl border border-border bg-card px-6 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="relative flex h-16 w-16 flex-none items-center justify-center rounded-lg border border-accent/30 bg-secondary">
              <DoorOpen className="h-8 w-8 text-accent" />
              <Settings className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-card p-0.5 text-brand-accent" />
              <span className="absolute -bottom-2 rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
                Wizard
              </span>
            </span>
            <span className="text-2xl font-bold text-brand md:text-3xl">Or use the wizard</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
