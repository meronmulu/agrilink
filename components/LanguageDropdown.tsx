'use client'
import React, { useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const OPTIONS: { value: 'en' | 'am' | 'om'; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { value: 'om', label: 'Oromiffa', flag: '🇪🇹' }
];

export default function LanguageDropdown() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  function toggle() {
    setOpen((s) => !s);
  }

  function onSelect(value: 'en' | 'am' | 'om') {
    setLang(value);
    setOpen(false);
    btnRef.current?.focus();
  }

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-2 border px-3 py-1 rounded-lg hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
        title="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">
          {OPTIONS.find((o) => o.value === lang)?.flag} {lang.toUpperCase()}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={lang}
          tabIndex={-1}
          className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
        >
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              id={opt.value}
              role="option"
              aria-selected={opt.value === lang}
              onClick={() => onSelect(opt.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(opt.value);
                }
                if (e.key === 'Escape') {
                  setOpen(false);
                  btnRef.current?.focus();
                }
              }}
              tabIndex={0}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-emerald-50 ${
                opt.value === lang ? 'bg-emerald-100 font-semibold' : ''
              }`}
            >
              <span className="text-lg">{opt.flag}</span>
              <span className="text-sm">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}