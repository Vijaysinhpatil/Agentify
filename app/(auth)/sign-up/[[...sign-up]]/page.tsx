'use client'

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  const appearance = {
    variables: {
      colorPrimary: '#4F46E5',
      colorBackground: '#F3F3F1',
      colorInputBackground: '#F5F5F3',
      colorInputText: '#1F1F1F',
      colorText: '#1F1F1F',
      colorTextSecondary: '#6B7280',
      colorTextOnPrimaryBackground: '#FFFFFF',
      colorDanger: '#EF4444',
      colorSuccess: '#22C55E',
      colorWarning: '#F59E0B',
      borderRadius: '8px',
      fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
    },
    elements: {
      rootBox: {
        backgroundColor: '#F3F3F1',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      card: {
        backgroundColor: '#FAFAF8',
        border: '1px solid',
        borderColor: '#D4D4D0',
        borderRadius: '12px',
        boxShadow: 'none',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      headerTitle: {
        color: '#1F1F1F',
        fontWeight: '600',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      headerSubtitle: {
        color: '#6B7280',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      socialButtonsBlockButton: {
        backgroundColor: '#FAFAF8',
        border: '1px solid',
        borderColor: '#D4D4D0',
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formFieldLabel: {
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formFieldInput: {
        backgroundColor: '#F5F5F3',
        border: '1px solid',
        borderColor: '#D4D4D0',
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      footerActionLink: {
        color: '#4F46E5',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      identityPreviewText: {
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      identityPreviewEditButton: {
        color: '#4F46E5',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      dividerLine: {
        backgroundColor: '#D4D4D0',
      },
      dividerText: {
        color: '#6B7280',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formButtonPrimary: {
        backgroundColor: '#4F46E5',
        color: '#FFFFFF',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      formButtonReset: {
        color: '#6B7280',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      footer: {
        backgroundColor: '#F3F3F1',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      footerSupportLink: {
        color: '#4F46E5',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      navbar: {
        backgroundColor: '#F3F3F1',
        borderBottom: '1px solid',
        borderBottomColor: '#D4D4D0',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      navbarButton: {
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      otpCodeFieldInput: {
        backgroundColor: '#F5F5F3',
        border: '1px solid',
        borderColor: '#D4D4D0',
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      pickerTheme: {
        backgroundColor: '#FAFAF8',
        border: '1px solid',
        borderColor: '#D4D4D0',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      pickerLabel: {
        color: '#6B7280',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
      localeSwitcher: {
        backgroundColor: '#F5F5F3',
        border: '1px solid',
        borderColor: '#D4D4D0',
        color: '#1F1F1F',
        fontFamily: "'Poppins', 'Inter', 'Geist', sans-serif",
      },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-poppins bg-[#F3F3F1]">
      <div className="w-full max-w-[400px]">
        <SignUp appearance={appearance} />
      </div>
    </div>
  )
}