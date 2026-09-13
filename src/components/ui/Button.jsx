import { cn } from "../../lib/utils";

export function Button({ children, variant = "primary", className, ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-[#6A9A75] active:bg-[#5C8666]",
    secondary: "bg-secondary text-white hover:bg-[#8AB896]",
    accent: "bg-accent text-gray-800 hover:bg-[#E5C95A]",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-textSecondary hover:bg-gray-100 hover:text-textPrimary",
    google: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm",
  };

  return (
    <button 
      className={cn("px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
