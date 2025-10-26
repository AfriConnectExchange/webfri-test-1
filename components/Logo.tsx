"use client"
import React from 'react'

type LogoProps = {
  className?: string
  variant?: 'full' | 'compact' | 'large'
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  const badgeSize = variant === 'compact' ? 'w-7 h-7' : variant === 'large' ? 'w-12 h-12' : 'w-10 h-10'
  const textClass = variant === 'compact' ? 'text-sm font-medium' : variant === 'large' ? 'text-lg font-semibold' : 'text-base sm:text-lg font-semibold'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center justify-center ${badgeSize} rounded-lg bg-[#E11D48] shadow-sm`}>
        <span className="text-white font-bold text-sm">AE</span>
      </div>
      <span className={`${textClass} leading-none`}>AfriConnect Exchange</span>
    </div>
  )
}

export default Logo
