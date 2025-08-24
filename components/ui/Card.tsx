
import React from 'react';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-3xl ${className?.includes('neo') ? 'border border-white/30 bg-white/40 backdrop-blur-xl shadow-[0_25px_70px_rgba(111,214,255,0.25)]' : 'border border-slate-200 bg-white shadow-[0_12px_30px_rgba(30,42,74,0.08)]'} ${className || ''}`}
    {...props}
  />
));
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-8 ${className || ''}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-slate-500 ${className || ''}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-8 pt-0 ${className || ''}`}
    {...props}
  />
));
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
