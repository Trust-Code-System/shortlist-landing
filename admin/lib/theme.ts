export const THEME_STORAGE_KEY = "shortlist-admin-theme";

export type Theme = "light" | "dark";

export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;
