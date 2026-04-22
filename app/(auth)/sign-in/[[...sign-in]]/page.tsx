'use client'

import { SignIn } from '@clerk/nextjs'

export default function Page() {
  const appearance = {
    variables: {
      colorPrimary: '#4F46E5',
      colorBackground: '#F3F3F1',
      colorInputBackground: '#F5F5F3',
      colorText: '#1F1F1F',
      colorTextSecondary: '#6B7280',
      borderRadius: '8px',
      fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
    },
    elements: {
      card: {
        background: '#FAFAF8',
        border: '1px solid',
        borderColor: '#D4D4D0',
        boxShadow: 'none',
        padding: '2rem',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      headerTitle: {
        fontSize: '22px',
        fontWeight: '500',
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      headerSubtitle: {
        fontSize: '14px',
        color: '#6B7280',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formFieldLabel: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formFieldInput: {
        backgroundColor: '#F5F5F3',
        border: '1px solid',
        borderColor: '#D4D4D0',
        color: '#1F1F1F',
        padding: '10px 12px',
        fontSize: '14px',
        transition: 'border 0.2s ease',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formButtonPrimary: {
        backgroundColor: '#4F46E5',
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
        backgroundColor: '#D4D4D0',
      },
      dividerText: {
        color: '#6B7280',
        fontSize: '12px',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      footerActionLink: {
        color: '#4F46E5',
        fontWeight: '500',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      socialButtonsBlockButton: {
        backgroundColor: '#FAFAF8',
        border: '1px solid',
        borderColor: '#D4D4D0',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-poppins bg-[#F3F3F1]">
      <div className="w-full max-w-[400px]">
        <SignIn appearance={appearance} />
      </div>
    </div>
  )
}