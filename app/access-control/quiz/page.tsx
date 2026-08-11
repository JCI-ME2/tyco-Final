"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { questions, type Question } from "@/data/access-control/quiz";
import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, RotateCcw, Trophy } from "lucide-react";

type Answer = number | number[]; // single -> number, multi -> number[], match -> number[] (index per left row)

function isCorrect(q: Question, a: Answer | undefined): boolean {
  if (a === undefined) return false;
  if (q.type === "single") return a === q.answer;
  if (q.type === "multi") {
    const arr = a as number[];
    if (arr.length !== q.answer.length) return false;
    const s = new Set(q.answer);
    return arr.every((x) => s.has(x));
  }
  const arr = a as number[];
  return q.answer.every((v, i) => arr[i] === v);
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const submittedNow = submitted[q.id];

  const score = useMemo(
    () => questions.reduce((acc, qq) => acc + (isCorrect(qq, answers[qq.id]) ? 1 : 0), 0),
    [answers]
  );

  function reset() {
    setAnswers({});
    setSubmitted({});
    setCurrent(0);
    setFinished(false);
  }

  function setAns(a: Answer) {
    setAnswers((prev) => ({ ...prev, [q.id]: a }));
  }

  const hasAnswer = (() => {
    const a = answers[q.id];
    if (a === undefined) return false;
    if (q.type === "single") return typeof a === "number";
    if (q.type === "multi") return (a as number[]).length > 0;
    return (a as number[]).length === q.left.length;
  })();

  function submit() {
    setSubmitted((prev) => ({ ...prev, [q.id]: true }));
  }

  function next() {
    if (current === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/access-control"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Kantech
        </Link>

        {!finished ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                <span>
                  Question {current + 1} of {questions.length}
                </span>
                <span>{Math.round((current / questions.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gradient-to-r from-accent to-brand-accent transition-all"
                  style={{ width: `${(current / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">
                {q.id}. {q.prompt}
              </h2>

              <div className="mt-6">
                {q.type === "single" && (
                  <SingleChoice
                    options={q.options}
                    value={answers[q.id] as number | undefined}
                    onChange={setAns}
                    locked={!!submittedNow}
                  />
                )}
                {q.type === "multi" && (
                  <MultiChoice
                    options={q.options}
                    value={(answers[q.id] as number[] | undefined) ?? []}
                    onChange={setAns}
                    locked={!!submittedNow}
                  />
                )}
                {q.type === "match" && (
                  <Match
                    left={q.left}
                    right={q.right}
                    value={(answers[q.id] as number[] | undefined) ?? []}
                    onChange={setAns}
                    locked={!!submittedNow}
                  />
                )}
              </div>

              {submittedNow && (
                <div
                  className={`mt-6 flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium ${
                    isCorrect(q, answers[q.id])
                      ? "border-brand-accent/40 bg-brand-accent/10 text-foreground"
                      : "border-destructive/40 bg-destructive/10 text-destructive"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isCorrect(q, answers[q.id]) ? "Correct!" : "Not quite — recorded."}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                {!submittedNow ? (
                  <button
                    onClick={submit}
                    disabled={!hasAnswer}
                    className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90"
                  >
                    {current === questions.length - 1 ? "See Results" : "Next Question →"}
                  </button>
                )}
              </div>
            </article>
          </>
        ) : (
          <Results score={score} total={questions.length} onRetry={reset} />
        )}
      </main>
    </div>
  );
}

function SingleChoice({
  options,
  value,
  onChange,
  locked,
}: {
  options: string[];
  value: number | undefined;
  onChange: (n: number) => void;
  locked: boolean;
}) {
  return (
    <ul className="space-y-2">
      {options.map((opt, i) => {
        const sel = value === i;
        return (
          <li key={i}>
            <button
              type="button"
              disabled={locked}
              onClick={() => onChange(i)}
              className={`w-full rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                sel
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-background hover:border-accent/60 hover:bg-secondary"
              } ${locked ? "cursor-not-allowed opacity-80" : ""}`}
            >
              <span
                className={`mr-3 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                  sel ? "border-accent bg-accent" : "border-muted-foreground/50"
                }`}
              >
                {sel && <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />}
              </span>
              {opt}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MultiChoice({
  options,
  value,
  onChange,
  locked,
}: {
  options: string[];
  value: number[];
  onChange: (v: number[]) => void;
  locked: boolean;
}) {
  function toggle(i: number) {
    if (value.includes(i)) onChange(value.filter((x) => x !== i));
    else onChange([...value, i].sort((a, b) => a - b));
  }
  return (
    <ul className="space-y-2">
      {options.map((opt, i) => {
        const sel = value.includes(i);
        return (
          <li key={i}>
            <button
              type="button"
              disabled={locked}
              onClick={() => toggle(i)}
              className={`w-full rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                sel
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-background hover:border-accent/60 hover:bg-secondary"
              } ${locked ? "cursor-not-allowed opacity-80" : ""}`}
            >
              <span
                className={`mr-3 inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
                  sel ? "border-accent bg-accent" : "border-muted-foreground/50"
                }`}
              >
                {sel && <CheckCircle2 className="h-3 w-3 text-accent-foreground" />}
              </span>
              {opt}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Match({
  left,
  right,
  value,
  onChange,
  locked,
}: {
  left: string[];
  right: string[];
  value: number[];
  onChange: (v: number[]) => void;
  locked: boolean;
}) {
  // Initialize with a shuffled order (that isn't already the correct order)
  const initialOrder = useMemo(() => {
    const natural = right.map((_, i) => i);
    if (right.length <= 1) return natural;
    let order = shuffleArray(natural);
    let guard = 0;
    while (order.every((v, i) => v === i) && guard < 10) {
      order = shuffleArray(natural);
      guard++;
    }
    return order;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [right]);

  useEffect(() => {
    if (value.length !== left.length) {
      onChange(initialOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const order = value.length === left.length ? value : initialOrder;

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const nextOrder = [...order];
    [nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]];
    onChange(nextOrder);
  }

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Reorder the items on the right so each one lines up with the matching item on the left.
      </p>
      {left.map((l, i) => {
        const rightIdx = order[i];
        return (
          <div
            key={i}
            className="grid grid-cols-1 items-stretch gap-2 rounded-md border border-border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)_auto]"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                {i + 1}
              </span>
              <span>{l}</span>
            </div>
            <div className="hidden items-center text-muted-foreground sm:flex">→</div>
            <div className="flex items-center rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground">
              {right[rightIdx]}
            </div>
            <div className="flex items-center gap-1 sm:flex-col">
              <button
                type="button"
                disabled={locked || i === 0}
                onClick={() => move(i, -1)}
                aria-label="Move up"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={locked || i === order.length - 1}
                onClick={() => move(i, 1)}
                aria-label="Move down"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Results({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  const pct = Math.round((score / total) * 100);
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
      <p className="mt-1 text-sm text-muted-foreground">Here is how you did on the Kantech quiz.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="Score" value={`${score} / ${total}`} />
        <Stat label="Percentage" value={`${pct}%`} />
        <Stat label="Result" value={pass ? "Passed" : "Try again"} />
      </div>

      <div className="mt-8">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </button>
      </div>
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
