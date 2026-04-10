import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  icon: LucideIcon
  iconColor?: string
  title: string
  subtitle?: string
  badge?: string | number
  children?: React.ReactNode
}

export default function PageHeader({ icon: Icon, iconColor = 'text-emerald-400', title, subtitle, badge, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center">
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {badge !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
