import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-surface rounded-2xl shadow-card p-5 md:p-6", className)} {...props}>
      {children}
    </div>
  );
}
