'use client';

import { create } from 'zustand';

type Theme = 'light' | 'dark';

type ThemeState = {
  theme: Theme;
  hydrated: boolean;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  init: () => void;
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  localStorage.setItem('theme', theme);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light', // 👈 always same on server + client
  hydrated: false,

  init: () => {
    const stored = (localStorage.getItem('theme') as Theme) || 'light';
    applyTheme(stored);
    set({ theme: stored, hydrated: true });
  },

  setTheme: (t) => {
    applyTheme(t);
    set({ theme: t });
  },

  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));
