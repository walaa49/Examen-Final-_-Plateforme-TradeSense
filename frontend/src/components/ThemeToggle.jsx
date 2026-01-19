import React from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors border border-dark-700"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <FiSun className="w-5 h-5 text-yellow-400" />
            ) : (
                <FiMoon className="w-5 h-5 text-primary-400" />
            )}
        </button>
    )
}
