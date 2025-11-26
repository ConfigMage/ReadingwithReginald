"use client";

import { cn } from "@/lib/utils";

export type StepState = "pending" | "active" | "done" | "error";

export interface GenerationStep {
  id: string;
  label: string;
  state: StepState;
  detail?: string;
}

export function GenerationProgress({ steps }: { steps: GenerationStep[] }) {
  const progress =
    (steps.filter((s) => s.state === "done").length / Math.max(steps.length, 1)) * 100;

  return (
    <div className="rounded-3xl border border-ink/10 bg-white/80 p-5 shadow-soft">
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full bg-ink transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-start gap-3 rounded-2xl border p-3",
              step.state === "done"
                ? "border-ink/10 bg-mint/60"
                : step.state === "active"
                  ? "border-ink/10 bg-butter/70"
                  : "border-ink/10 bg-white/70"
            )}
          >
            <StatusDot state={step.state} />
            <div>
              <p className="font-semibold text-ink">{step.label}</p>
              {step.detail ? <p className="text-sm text-ink/70">{step.detail}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDot({ state }: { state: StepState }) {
  const color =
    state === "done"
      ? "bg-green-500"
      : state === "active"
        ? "bg-amber-500"
        : state === "error"
          ? "bg-red-500"
          : "bg-ink/30";

  return <span className={cn("mt-1 inline-block h-3 w-3 rounded-full", color)} aria-hidden />;
}
