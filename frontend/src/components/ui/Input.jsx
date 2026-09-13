import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-textPrimary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}
