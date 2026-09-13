import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "../../lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark"
      );
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className={cn(
        "p-2.5 rounded-full glass-panel border border-foreground/10 hover:border-primary/40 text-foreground transition-all shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
      aria-label="Toggle Theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
      ) : (
        <Moon className="h-4 w-4 text-primary drop-shadow-[0_0_8px_var(--primary)]" />
      )}
    </button>
  );
}

export default ThemeToggle;
