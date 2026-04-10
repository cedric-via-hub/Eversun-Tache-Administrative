import { cn } from '@/lib/utils'

type Variant = 'encours' | 'accord' | 'refus' | 'abf' | 'abffav' | 'mes' | 'ok' | 'attente' | 'archive' | 'raccorde' | 'default'

const variants: Record<Variant, string> = {
  encours:  'bg-blue-500/10  text-blue-400  border-blue-500/20',
  accord:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  refus:    'bg-red-500/10   text-red-400   border-red-500/20',
  abf:      'bg-amber-500/10 text-amber-400  border-amber-500/20',
  abffav:   'bg-teal-500/10  text-teal-400   border-teal-500/20',
  mes:      'bg-violet-500/10 text-violet-400 border-violet-500/20',
  ok:       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  attente:  'bg-slate-500/10 text-slate-400  border-slate-500/20',
  archive:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  raccorde: 'bg-cyan-500/10  text-cyan-400   border-cyan-500/20',
  default:  'bg-slate-500/10 text-slate-300  border-slate-500/20',
}

function getVariant(statut: string): Variant {
  const s = statut.toLowerCase()
  if (s.includes("en cours")) return 'encours'
  if (s.includes("accord")) return 'accord'
  if (s.includes("refus")) return 'refus'
  if (s.includes("abf favorable")) return 'abffav'
  if (s.includes("abf")) return 'abf'
  if (s.includes("mise en service")) return 'mes'
  if (s.includes("consuel ok")) return 'ok'
  if (s.includes("raccordé")) return 'raccorde'
  if (s.includes("archivé")) return 'archive'
  if (s.includes("attente")) return 'attente'
  return 'default'
}

export default function StatusBadge({ statut, size = 'sm' }: { statut: string; size?: 'xs' | 'sm' }) {
  const variant = getVariant(statut)
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
      size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      variants[variant]
    )}>
      {statut}
    </span>
  )
}
