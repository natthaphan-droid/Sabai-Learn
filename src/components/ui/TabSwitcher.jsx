import React from "react";
import { cn } from "../../lib/utils";
import { useUser } from "../../contexts/UserContext";

export function TabSwitcher({ activeType, onTypeChange }) {
  const { getGradeLabel } = useUser();
  const types = [
    { id: "basic", label: `คณิตศาสตร์พื้นฐาน (${getGradeLabel()})` },
    { id: "additional", label: `คณิตศาสตร์เพิ่มเติม (${getGradeLabel()})` },
  ];

  return (
    <div className="space-y-3 mb-8 w-full max-w-lg mx-auto md:mx-0">
      <div className="flex p-1 bg-gray-100/50 rounded-xl w-full border border-gray-100">
        {types.map((type) => (
          <button
            aria-pressed={activeType === type.id}
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200",
              activeType === type.id
                ? "bg-primary text-white shadow-sm"
                : "text-textSecondary hover:text-primary hover:bg-primary/5"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
