import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: number; label: string }
  accent?: 'emerald' | 'blue' | 'red' | 'amber' | 'violet' | 'cyan'
  className?: string
}

const accents = {
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-900/20' },
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-500/20',    glow: 'shadow-blue-900/20' },
  red:     { icon: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-500/20',     glow: 'shadow-red-900/20' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-500/20',   glow: 'shadow-amber-900/20' },
  violet:  { icon: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-500/20',  glow: 'shadow-violet-900/20' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-500/20',    glow: 'shadow-cyan-900/20' },
}

export default function KpiCard({
  title, value, subtitle, icon: Icon, accent = 'emerald', className
}: KpiCardProps) {
  const a = accents[accent]
  return (
    <div className={cn(
      'rounded-2xl border bg-[#0b1628] p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 shadow-lg',
      a.border, a.glow, 'hover:shadow-xl',
      className
    )}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">{title}</p>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', a.bg)}>
          <Icon size={16} className={a.icon} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
