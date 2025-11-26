import { cn } from "@/lib/utils";

interface RadioCardProps<T extends string> {
  value: T;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: (value: T) => void;
}

export function RadioCard<T extends string>({
  value,
  label,
  description,
  selected,
  onSelect
}: RadioCardProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition",
        "hover:border-sky-300 hover:shadow-md",
        selected ? "border-sky-400 bg-white shadow-soft" : "border-ink/10 bg-white/60"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{label}</p>
          {description ? <p className="text-sm text-ink/70">{description}</p> : null}
        </div>
        <span
          className={cn(
            "h-4 w-4 rounded-full border",
            selected ? "border-ink bg-ink" : "border-ink/30 bg-white"
          )}
        />
      </div>
    </button>
  );
}
