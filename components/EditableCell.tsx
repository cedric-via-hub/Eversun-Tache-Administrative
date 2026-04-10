'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface EditableCellProps {
  value: string | number | boolean | null | undefined
  onSave: (newValue: string) => void
  type?: 'text' | 'date' | 'select' | 'badge'
  options?: string[]           // for select type
  className?: string
  renderValue?: (v: string) => React.ReactNode  // custom display renderer
  mono?: boolean
}

export default function EditableCell({
  value,
  onSave,
  type = 'text',
  options,
  className,
  renderValue,
  mono,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  const display = value === null || value === undefined || value === '' ? '—' : String(value)

  function startEdit() {
    setDraft(display === '—' ? '' : display)
    setEditing(true)
  }

  function commit() {
    setEditing(false)
    if (draft !== display && !(display === '—' && draft === '')) {
      onSave(draft)
    }
  }

  function cancel() {
    setEditing(false)
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') cancel()
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [editing])

  if (editing) {
    if (type === 'select' && options) {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          className="w-full bg-[#0f2040] border border-emerald-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">—</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type === 'date' ? 'date' : 'text'}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        className={cn(
          'w-full bg-[#0f2040] border border-emerald-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500',
          mono && 'font-mono'
        )}
      />
    )
  }

  return (
    <div
      onClick={startEdit}
      title="Cliquer pour modifier"
      className={cn(
        'group relative min-w-[60px] cursor-pointer rounded-md px-1.5 py-0.5 -mx-1.5',
        'hover:bg-emerald-500/8 hover:ring-1 hover:ring-emerald-500/20',
        'transition-all duration-150',
        mono && 'font-mono',
        className
      )}
    >
      {renderValue ? renderValue(display) : (
        <span className={display === '—' ? 'text-slate-700' : ''}>{display}</span>
      )}
      {/* Edit hint */}
      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/60 transition-all" />
    </div>
  )
}
