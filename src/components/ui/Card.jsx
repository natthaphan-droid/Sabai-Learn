import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-surface rounded-[22px] border border-[#e2e2d7] shadow-soft p-5 md:p-6", className)} {...props}>
      {children}
    </div>
  );
}
