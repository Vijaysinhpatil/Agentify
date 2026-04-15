'use client'

import { SignIn } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Page() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  const appearance = {
    variables: {
      colorPrimary: isDark ? '#8B9FFF' : '#4F46E5',
      colorBackground: isDark ? '#18181B' : '#F3F3F1',
      colorInputBackground: isDark ? '#27272A' : '#F5F5F3',
      colorText: isDark ? '#E4E4E7' : '#1F1F1F',
      colorTextSecondary: isDark ? '#A1A1AA' : '#6B7280',
      borderRadius: '8px',
      fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
    },
    elements: {
      card: {
        background: isDark ? '#18181B' : '#FAFAF8',
        border: '1px solid',
        borderColor: isDark ? '#27272A' : '#D4D4D0',
        boxShadow: 'none',
        padding: '2rem',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      headerTitle: {
        fontSize: '22px',
        fontWeight: '500',
        color: isDark ? '#F4F4F5' : '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      headerSubtitle: {
        fontSize: '14px',
        color: isDark ? '#A1A1AA' : '#6B7280',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formFieldLabel: {
        fontSize: '13px',
        fontWeight: '500',
        color: isDark ? '#E4E4E7' : '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formFieldInput: {
        backgroundColor: isDark ? '#27272A' : '#F5F5F3',
        border: '1px solid',
        borderColor: isDark ? '#3F3F46' : '#D4D4D0',
        color: isDark ? '#E4E4E7' : '#1F1F1F',
        padding: '10px 12px',
        fontSize: '14px',
        transition: 'border 0.2s ease',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formButtonPrimary: {
        backgroundColor: isDark ? '#6366F1' : '#4F46E5',
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '500',
        height: '40px',
        borderRadius: '6px',
        boxShadow: 'none',
        transition: 'background 0.2s ease',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      dividerLine: {
        backgroundColor: isDark ? '#27272A' : '#D4D4D0',
      },
      dividerText: {
        color: isDark ? '#71717A' : '#6B7280',
        fontSize: '12px',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      footerActionLink: {
        color: isDark ? '#8B9FFF' : '#4F46E5',
        fontWeight: '500',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      socialButtonsBlockButton: {
        backgroundColor: isDark ? '#27272A' : '#FAFAF8',
        border: '1px solid',
        borderColor: isDark ? '#3F3F46' : '#D4D4D0',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
    },
  }

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center px-4 font-poppins
        ${isDark ? 'bg-[#09090B]' : 'bg-[#F3F3F1]'}
      `}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`
          absolute top-6 right-6 text-sm px-3 py-1.5 rounded-md border font-poppins
          ${isDark
            ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
        `}
      >
        {isDark ? 'Light' : 'Dark'}
      </button>

      <div className="w-full max-w-[400px]">
        <SignIn appearance={appearance} />
      </div>
    </div>
  )
}