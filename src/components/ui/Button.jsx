import { cn } from "../../lib/utils";

export function Button({ children, variant = "primary", size, className, type = "button", ...props }) {
  const variants = {
    primary: "bg-[#78a9ee] text-[#202823] hover:bg-[#6499e4] active:bg-[#5489d4]",
    secondary: "bg-secondary/60 text-primary hover:bg-secondary",
    accent: "bg-accent text-gray-800 hover:bg-[#E5C95A]",
    outline: "border border-primary/25 text-primary hover:bg-primary/5",
    ghost: "text-textSecondary hover:bg-gray-100 hover:text-textPrimary",
    google: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm",
  };

  return (
    <button 
      type={type}
      className={cn("min-h-11 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", variants[variant] || variants.primary, size === "sm" && "min-h-9 px-3 py-2 text-xs", className)}
      {...props}
    >
      {children}
    </button>
  );
}
