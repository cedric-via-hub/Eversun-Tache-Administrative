'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Zap,
  BadgeCheck,
  FileCheck2,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/',                label: 'Dashboard',            icon: LayoutDashboard,  color: 'text-emerald-400' },
  { href: '/dp-en-cours',     label: 'DP – En cours',        icon: ClipboardList,    color: 'text-blue-400',   badge: 20 },
  { href: '/dp-accordes',     label: 'DP – Accordés',        icon: CheckCircle2,     color: 'text-emerald-400',badge: 70 },
  { href: '/dp-refus',        label: 'DP – Refus',           icon: XCircle,          color: 'text-red-400',    badge: 3 },
  { href: '/consuel',         label: 'Consuel',              icon: BadgeCheck,       color: 'text-cyan-400' },
  { href: '/raccordement',    label: 'Raccordement',         icon: Zap,              color: 'text-amber-400' },
  { href: '/daact',           label: 'DAACT',                icon: FileCheck2,       color: 'text-violet-400', badge: 40 },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-[#060d1f] border-r border-white/5 h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
          <Sun size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-700 text-white leading-tight tracking-tight">DP Dashboard</p>
          <p className="text-[10px] text-slate-500 tracking-wide">SUIVI ADMINISTRATIF</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = path === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
                active
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'
              )}
            >
              <Icon
                size={16}
                className={cn(
                  'shrink-0 transition-colors',
                  active ? item.color : 'text-slate-500 group-hover:text-slate-400'
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                  active
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/6 text-slate-500'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="rounded-xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/15 p-3">
          <p className="text-[10px] text-emerald-500 font-semibold tracking-widest uppercase mb-1">Automatisation</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Logique Apps Script portée en TypeScript — calculs de délais en temps réel.
          </p>
        </div>
      </div>
    </aside>
  )
}
