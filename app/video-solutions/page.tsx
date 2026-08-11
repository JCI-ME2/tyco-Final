import Link from "next/link";
import { KeyRound, Server, GraduationCap } from "lucide-react";
import { AccessControlVideo } from "@/components/access-control-video";

const categories = [
  { href: "/video-solutions/exacq-sw", label: "Exacq Software", desc: "Licenses & upgrades", Icon: KeyRound },
  { href: "/video-solutions/exacq-hw", label: "Exacq Hardware", desc: "NVR / VMS appliances", Icon: Server },
  { href: "/video-solutions/quiz", label: "Quiz", desc: "Test your exacqVision knowledge with a shuffled quiz.", Icon: GraduationCap },
];

export default function VideoSolutionsIndex() {
  return (
    <>
      <AccessControlVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MainVideo-H5EuIeMoO9clmyuiIfm6Ge8aDI7jfv.mp4" />

      <section className="mx-auto max-w-[1400px] px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground">Pick a Category to Build Your Order</h2>
        <p className="mt-1 text-sm text-muted-foreground">Each category opens a part-number selector with dropdown filters.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
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
