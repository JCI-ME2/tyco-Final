import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Video, MonitorPlay, Camera, KeyRound, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Title */}
      <header className="mx-auto w-full max-w-6xl px-6 pt-4 md:pt-6">
        <h1 className="text-3xl md:text-5xl font-light leading-tight text-jci-blue text-center">
          Tyco Solutions – Exacq, Kantech, CEM &amp; Illustra
        </h1>
      </header>

      {/* Hero video */}
      <section className="mx-auto w-full max-w-6xl px-6 mt-3 flex justify-center">
        <div className="overflow-hidden rounded-sm shadow-sm" style={{ width: '70%' }}>
          <video
            width={1600}
            height={636}
            className="w-full h-auto object-contain"
            controls
            muted={false}
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recording%20with%20BG%20%281%29-5Wn1C5T6RzB0VpfBSb2bfkwktuuV16.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-4 md:py-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
          {/* Top row of three */}
          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href="/illustra-cameras"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-jci-blue/40 w-52"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-jci-blue/10 text-jci-blue">
                <Camera className="h-6 w-6" />
              </div>
              <div className="mt-3 text-lg font-bold text-jci-blue text-balance">
                Illustra Cameras
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                IP cameras, domes, bullets &amp; Holis NVR.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-jci-teal to-jci-blue" />
            </Link>

            <Link
              href="/video-solutions"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-jci-blue/40 w-52"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-jci-blue/10 text-jci-blue">
                <Video className="h-6 w-6" />
              </div>
              <div className="mt-3 text-lg font-bold text-jci-blue text-balance">
                Exacq
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Exacq HW/SW VMS solutions.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-jci-teal to-jci-blue" />
            </Link>

            <Link
              href="/access-control"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-jci-blue/40 w-52"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-jci-blue/10 text-jci-blue">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="mt-3 text-lg font-bold text-jci-blue text-balance">
                Kantech
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Controllers, readers, biometric &amp; locks.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-jci-teal to-jci-blue" />
            </Link>
          </div>

          {/* Divider */}
          <div className="h-[3px] w-full max-w-2xl bg-gradient-to-r from-jci-teal to-jci-blue rounded-full" />

          {/* Bottom row of two */}
          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href="/american-dynamics"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-jci-blue/40 w-52"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-jci-blue/10 text-jci-blue">
                <MonitorPlay className="h-6 w-6" />
              </div>
              <div className="mt-3 text-lg font-bold text-jci-blue text-balance">
                American Dynamics
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Victor VMS, VideoEdge &amp; recorders.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-jci-teal to-jci-blue" />
            </Link>

            <Link
              href="/cem-systems"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-jci-blue/40 w-52"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-jci-blue/10 text-jci-blue">
                <KeyRound className="h-6 w-6" />
              </div>
              <div className="mt-3 text-lg font-bold text-jci-blue text-balance">
                CEM Systems
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                AC2000 software, controllers &amp; readers.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-jci-teal to-jci-blue" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with tagline + logo */}
      <footer className="mx-auto w-full max-w-6xl px-6 pb-4 mt-auto">
        <div className="flex items-end justify-between gap-4 pb-3">
          <p className="text-sm md:text-base text-jci-blue">
            The power behind <span className="font-semibold">your mission</span>
          </p>
          <div className="flex items-end gap-4">
            <Link
              href="/chat"
              aria-label="Open Tyco Chat"
              className="inline-flex items-center gap-2 rounded-full bg-jci-blue px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
            <Image src="/images/jci-logo.png" alt="Johnson Controls" className="h-10 w-auto object-contain" width={40} height={40} />
          </div>
        </div>
        <div className="h-[3px] w-full bg-gradient-to-r from-jci-teal to-jci-blue" />
      </footer>
    </main>
  );
}
