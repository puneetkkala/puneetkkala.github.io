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

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`btn-outline ${compact ? 'w-full justify-center mt-3' : 'ml-2'} flex items-center gap-2 text-sm`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {mounted && theme === 'dark' ? (
                <Sun size={15} aria-hidden="true" />
            ) : (
                <Moon size={15} aria-hidden="true" />
            )}
            {mounted && theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
    )
}
