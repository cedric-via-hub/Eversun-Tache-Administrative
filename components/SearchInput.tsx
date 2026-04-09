'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40 focus:bg-white/6 transition-all"
      />
    </div>
  )
}
