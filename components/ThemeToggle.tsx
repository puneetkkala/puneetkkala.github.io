'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const THEME_KEY = 'happyhub_theme'

type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY)
    const initial: Theme = saved === 'dark' || saved === 'light' ? saved : getSystemTheme()
    setTheme(initial)
    applyTheme(initial)
    setMounted(true)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem(THEME_KEY, next)
    applyTheme(next)
  }

  const isDark = mounted && theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        compact
          ? 'w-full justify-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer'
          : 'p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer inline-flex items-center justify-center'
      }
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={17} aria-hidden="true" className="text-amber-400" />
      ) : (
        <Moon size={17} aria-hidden="true" className="text-zinc-600" />
      )}
      <span className={compact ? 'inline' : 'sr-only'}>
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  )
}
