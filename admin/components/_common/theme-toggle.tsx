"use client";

import Button from "@/components/_ui/button";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import SunIcon from "@/public/assets/images/_common/sun.svg";
import MoonIcon from "@/public/assets/images/_common/moon.svg";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Switch between light and dark mode"
      title="Switch between light and dark mode"
      onClick={toggle}
    >
      <SunIcon aria-hidden className="light:hidden size-3.5" />
      <MoonIcon aria-hidden className="light:block hidden size-3.5" />
    </Button>
  );
}
