"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { questions as allQuestions, type Question } from "@/data/video-solutions/quiz";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ParticipantGate } from "@/components/quiz/participant-gate";
import { QuizResults } from "@/components/quiz/quiz-results";
import type { QuizParticipant } from "@/lib/quiz/types";

const QUIZ_TITLE = "Exacq Video Solutions Quiz";

type Answer = number | number[]; // single -> number, multi -> number[]

function isCorrect(q: Question, a: Answer | undefined): boolean {
  if (a === undefined) return false;
  if (q.type === "single") return a === q.answer;
  const arr = a as number[];
  if (arr.length !== q.answer.length) return false;
  const s = new Set(q.answer);
  return arr.every((x) => s.has(x));
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  // Shuffle on mount (client only) to avoid hydration mismatch.
  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [participant, setParticipant] = useState<QuizParticipant | null>(null);

  useEffect(() => {
    setQuestions(shuffleArray(allQuestions));
  }, []);

  const q = questions[current];
  const submittedNow = submitted[q.id];

  const score = useMemo(
    () => questions.reduce((acc, qq) => acc + (isCorrect(qq, answers[qq.id]) ? 1 : 0), 0),
    [answers, questions]
  );

  function reset() {
    setQuestions(shuffleArray(allQuestions));
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
    return (a as number[]).length > 0;
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

  if (!participant) {
    return (
      <ParticipantGate
        title={QUIZ_TITLE}
        subtitle="Test your Exacq video solutions knowledge"
        backHref="/video-solutions"
        backLabel="Back to Video Solutions"
        onStart={setParticipant}
      />
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/video-solutions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Video Solutions
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
                {current + 1}. {q.prompt}
              </h2>

              {q.type === "multi" && (
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Select all that apply
                </p>
              )}

              <div className="mt-6">
                {q.type === "single" ? (
                  <SingleChoice
                    options={q.options}
                    value={answers[q.id] as number | undefined}
                    onChange={setAns}
                    locked={!!submittedNow}
                  />
                ) : (
                  <MultiChoice
                    options={q.options}
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
          <QuizResults
            score={score}
            total={questions.length}
            participant={participant}
            quizTitle={QUIZ_TITLE}
            subtitle="Here is how you did on the Exacq quiz."
            onRetry={reset}
          />
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

