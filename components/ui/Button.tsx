import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'neo';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  ...props 
}) => {
  const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] text-white hover:brightness-105 focus:ring-[#3B6AFF] shadow-[0_12px_30px_rgba(59,106,255,0.35)] ring-1 ring-white/30',
    outline: 'border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-[#3B6AFF]',
    ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-[#3B6AFF]',
    link: 'underline underline-offset-4 text-slate-600 hover:text-slate-800 focus:ring-[#3B6AFF]',
    neo: 'bg-gradient-to-br from-[#BFE0FF] via-[#D7C8FF] to-[#F3E4FF] text-[#0f172a] ring-1 ring-[#ffffff]/40 hover:brightness-105',
  } as const;

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  } as const;

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ');

  const isNeo = variant === 'neo';

  return (
    <button className={combinedClassName} {...props}>
      {isNeo && (
        <span aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute -inset-12 bg-[radial-gradient(130%_130%_at_30%_20%,rgba(187,222,255,0.7),transparent_62%)] blur-3xl mix-blend-screen"></span>
          <span className="absolute -inset-12 bg-[radial-gradient(130%_130%_at_80%_90%,rgba(243,228,255,0.7),transparent_60%)] blur-3xl mix-blend-screen"></span>
          <span className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,rgba(255,255,255,0.35),transparent_75%)] blur-xl mix-blend-screen"></span>
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};