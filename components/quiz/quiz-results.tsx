"use client";

import { Download, RotateCcw, Trophy } from "lucide-react";
import type { QuizParticipant } from "@/lib/quiz/types";
import { exportQuizResultPdf } from "@/lib/quiz/export-result";

export function QuizResults({
  score,
  total,
  participant,
  quizTitle,
  subtitle,
  onRetry,
}: {
  score: number;
  total: number;
  participant: QuizParticipant;
  quizTitle: string;
  subtitle: string;
  onRetry: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const pass = pct >= 70;

  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          pass ? "bg-brand-accent/20 text-brand-accent" : "bg-destructive/15 text-destructive"
        }`}
      >
        <Trophy className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-foreground">Quiz Complete</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-lg border border-border text-left">
        <Detail label="Full name" value={participant.fullName} />
        <Detail label="Company" value={participant.company} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="Score" value={`${score} / ${total}`} />
        <Stat label="Percentage" value={`${pct}%`} />
        <Stat label="Result" value={pass ? "Passed" : "Try again"} />
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={() => exportQuizResultPdf({ participant, quizTitle, score, total })}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-primary"
        >
          <Download className="h-4 w-4" />
          Export to PDF
        </button>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-border last:border-b-0">
      <div className="w-2/5 bg-secondary/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="flex-1 px-4 py-2.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
