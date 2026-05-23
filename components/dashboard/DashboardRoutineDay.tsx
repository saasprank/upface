'use client'

import { useEffect, useState } from 'react'

interface RoutineTask {
  id: string
  title: string
  category: string
}

interface DashboardRoutineDayProps {
  title: string
  tasks: RoutineTask[]
}

function RoutineCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? 'border-transparent' : 'border-[#1E2A3E] bg-transparent'
      }`}
      style={
        checked
          ? { background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }
          : undefined
      }
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}

export default function DashboardRoutineDay({ title, tasks }: DashboardRoutineDayProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem('upface_routine_day')
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>)
    } catch { /* ignore */ }
  }, [])

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try { localStorage.setItem('upface_routine_day', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }

  return (
    <section>
      <h2 className="mb-4 font-[Outfit,sans-serif] text-[16px] font-bold text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 rounded-xl border border-[#1E2A3E] bg-[#0D1321] p-4"
          >
            <RoutineCheckbox checked={!!checked[task.id]} onChange={() => toggle(task.id)} />
            <div className="min-w-0">
              <span className="mb-1 block font-[Inter,sans-serif] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3B82F6]">
                {task.category}
              </span>
              <p className="font-[Inter,sans-serif] text-[13px] leading-snug text-[#EEF2FF]">{task.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
