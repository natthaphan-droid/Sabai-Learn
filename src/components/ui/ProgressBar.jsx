import { cn } from "../../lib/utils";

export function ProgressBar({ value, max = 100, className, indicatorColor = "bg-primary" }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  return (
    <div role="progressbar" aria-label="ความคืบหน้า" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} className={cn("w-full bg-gray-100 rounded-full h-2.5 overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-500 ease-out", indicatorColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
