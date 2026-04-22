"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  attribute = "class",
  storageKey = "theme",
}: {
  children: ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  attribute?: string
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolved, setResolved] = useState<"light" | "dark">(
    defaultTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : (defaultTheme as "light" | "dark")
  )

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored) {
        setThemeState(stored)
      }
    } catch (e) {}
  }, [storageKey])

  // Resolve system theme on mount if needed
  useEffect(() => {
    if (theme === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setResolved(sys)
    }
  }, [theme])

  // Apply attribute to html element
  useEffect(() => {
    const html = document.documentElement
    const target = theme === "system" ? resolved : theme
    if (attribute === "class") {
      html.classList.toggle("dark", target === "dark")
      html.classList.toggle("light", target === "light")
    } else if (typeof attribute === "string" && attribute.startsWith("data-")) {
      html.setAttribute(attribute, target)
    }
  }, [theme, resolved, attribute])

  // Listen for system changes
  useEffect(() => {
    if (!enableSystem) return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? "dark" : "light"
      setResolved(newResolved)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [enableSystem])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    try {
      localStorage.setItem(storageKey, t)
    } catch (e) {}
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme: theme === "system" ? resolved : theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return ctx
}
