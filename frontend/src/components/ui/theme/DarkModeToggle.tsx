/**
 * WF-THEME-001 | DarkModeToggle.tsx - Dark Mode Toggle Component
 * Purpose: Toggle between light and dark mode themes
 * Upstream: Design system | Dependencies: React, lucide-react
 * Downstream: AppLayout, Settings | Called by: Header components
 * Related: Theme management, user preferences
 * Exports: DarkModeToggle component | Key Features: Toggle, persistence, accessibility
 * Last Updated: 2025-10-23 | File Type: .tsx
 * Critical Path: User click → Toggle mode → Update localStorage → Update DOM
 * LLM Context: Dark mode toggle component for White Cross healthcare platform
 */

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check for saved preference or system preference on mount
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedMode === 'true' || (savedMode === null && prefersDark);
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      data-cy="dark-mode-toggle"
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-500" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
      )}
    </button>
  );
};

export default DarkModeToggle;
