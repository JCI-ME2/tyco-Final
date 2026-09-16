"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { QuizParticipant } from "@/lib/quiz/types";

export function ParticipantGate({
  title,
  subtitle,
  backHref,
  backLabel,
  onStart,
}: {
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  onStart: (participant: QuizParticipant) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !company.trim()) {
      setError("Please enter both your full name and company name to begin.");
      return;
    }
    onStart({ fullName: fullName.trim(), company: company.trim() });
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 bg-brand px-6 py-5">
            <Image
              src="/images/jci-logo-pages.png"
              alt="Johnson Controls"
              width={40}
              height={40}
              className="h-10 w-10 rounded bg-white/90 object-contain p-1"
            />
            <div>
              <h1 className="text-lg font-bold leading-tight text-brand-foreground text-balance">{title}</h1>
              <p className="text-xs text-brand-foreground/70">{subtitle}</p>
            </div>
          </div>

          <div className="h-[3px] w-full bg-gradient-to-r from-accent via-brand-accent to-accent" />

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <p className="text-sm text-muted-foreground">
              Enter your details below. These will appear on your results and exported certificate.
            </p>

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-foreground">
                Full name <span className="text-destructive">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Jane Doe"
                className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-semibold text-foreground">
                Company name <span className="text-destructive">*</span>
              </label>
              <input
                id="company"
                type="text"
                required
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Acme Integrations Ltd."
                className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-primary"
            >
              Start Quiz <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
