"use client";

import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => setMounted(true), []);

  // Wait for mounted to show the button to avoid hydration mismatch
  if (!mounted) return <Button variant="outline" size="icon" />;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="size-[1.2rem]" />
      ) : (
        <Moon className="size-[1.2rem]" />
      )}
    </Button>
  );
};
