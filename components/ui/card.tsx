import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}
