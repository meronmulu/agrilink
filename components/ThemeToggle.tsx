'use client'

import React, { useRef, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const OPTIONS: { value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  function toggle() {
    setOpen((s) => !s);
  }

  function onSelect(value: 'light' | 'dark' | 'system') {
    setTheme(value);
    setOpen(false);
    btnRef.current?.focus();
  }

  const currentOption = OPTIONS.find((o) => o.value === theme);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-2 border px-3 py-1 rounded-lg hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        title="Select theme"
      >
        {currentOption?.icon}
        <span className="text-sm capitalize">{currentOption?.label}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={theme}
          tabIndex={-1}
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg z-50"
        >
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={theme === opt.value}
              onClick={() => onSelect(opt.value)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer first:rounded-t-md last:rounded-b-md"
            >
              {opt.icon}
              <span className="text-sm">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}