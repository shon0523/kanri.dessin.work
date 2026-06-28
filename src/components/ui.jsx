import React, { useEffect } from 'react'

// ===== Card =====
export function Card({ children, className = '', ...rest }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/70 shadow-card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
      <div>
        <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
        {sub && <p className="text-xs text-ink-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ===== KPI Card =====
export function Kpi({ label, value, unit, delta, deltaTone = 'green', icon, tone = 'default' }) {
  const toneRing = {
    default: 'bg-white',
    blue: 'bg-gradient-to-br from-sky-50 to-white',
    green: 'bg-gradient-to-br from-emerald-50 to-white',
    navy: 'bg-gradient-to-br from-slate-50 to-white',
  }[tone]
  return (
    <Card className={`p-5 ${toneRing}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-500">{label}</span>
        {icon && <span className="text-base opacity-70">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-2xl font-bold tracking-tight text-ink-900">{value}</span>
        {unit && <span className="text-sm text-ink-500 mb-0.5">{unit}</span>}
      </div>
      {delta && (
        <div className={`mt-1.5 text-xs font-medium ${deltaTone === 'green' ? 'text-emerald-600' : deltaTone === 'red' ? 'text-rose-600' : 'text-ink-500'}`}>
          {delta}
        </div>
      )}
    </Card>
  )
}

// ===== Badge =====
const badgeTones = {
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-sky-50 text-sky-700 border-sky-200',
  navy: 'bg-slate-800 text-white border-slate-800',
  orange: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
}
export function Badge({ children, tone = 'gray', dot = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeTones[tone]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${tone === 'green' ? 'bg-emerald-500' : tone === 'red' ? 'bg-rose-500' : tone === 'orange' ? 'bg-amber-500' : tone === 'blue' ? 'bg-sky-500' : 'bg-slate-400'}`} />}
      {children}
    </span>
  )
}

// status helpers
export function ReservationBadge({ status }) {
  const map = {
    '仮予約': 'orange', '予約確定': 'blue', '来店済み': 'green',
    'キャンセル': 'gray', '無断キャンセル': 'red',
  }
  return <Badge tone={map[status] || 'gray'} dot>{status}</Badge>
}
export function PaymentBadge({ status }) {
  const map = {
    '未決済': 'gray', '決済待ち': 'orange', '決済完了': 'green',
    '一部返金': 'purple', '全額返金': 'red', '現地決済': 'blue',
  }
  return <Badge tone={map[status] || 'gray'}>{status}</Badge>
}

// ===== Toggle =====
export function Toggle({ checked, onChange, size = 'md' }) {
  const dims = size === 'lg'
    ? { w: 'w-14', h: 'h-7', dot: 'w-6 h-6', tr: 'translate-x-7' }
    : { w: 'w-11', h: 'h-6', dot: 'w-5 h-5', tr: 'translate-x-5' }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex ${dims.w} ${dims.h} flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-1 ${checked ? 'bg-slate-800' : 'bg-slate-300'}`}
    >
      <span className={`inline-block ${dims.dot} transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? dims.tr : 'translate-x-0.5'}`} />
    </button>
  )
}

// ===== Button =====
export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }) {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900',
    secondary: 'bg-white text-ink-700 hover:bg-slate-50 border border-slate-300',
    ghost: 'bg-transparent text-ink-700 hover:bg-slate-100 border border-transparent',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600',
    accent: 'bg-sky-600 text-white hover:bg-sky-700 border border-sky-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  return (
    <button className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

// ===== Modal =====
export function Modal({ open, onClose, title, sub, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-2xl shadow-pop animate-pop`}>
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-ink-900">{title}</h3>
            {sub && <p className="text-xs text-ink-500 mt-0.5">{sub}</p>}
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 text-xl leading-none -mt-1">✕</button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

// ===== Toast =====
export function Toast({ toast }) {
  if (!toast) return null
  const tones = {
    success: 'bg-slate-900 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-900 text-white',
  }
  const icon = { success: '✓', error: '!', info: 'i' }[toast.type] || '✓'
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-toast">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-pop ${tones[toast.type] || tones.success}`}>
        <span className="w-5 h-5 rounded-full bg-white/20 grid place-items-center text-xs font-bold">{icon}</span>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  )
}

// ===== Form helpers =====
export function Field({ label, hint, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-ink-700 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-ink-400 mt-1">{hint}</span>}
    </label>
  )
}
export const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition'

export function Input(props) { return <input className={inputCls} {...props} /> }
export function Select({ children, ...props }) { return <select className={inputCls} {...props}>{children}</select> }
export function Textarea(props) { return <textarea className={`${inputCls} resize-y min-h-[80px]`} {...props} /> }

// ===== Alert =====
export function Alert({ tone = 'orange', title, children }) {
  const tones = {
    orange: 'bg-amber-50 border-amber-200 text-amber-800',
    red: 'bg-rose-50 border-rose-200 text-rose-800',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    blue: 'bg-sky-50 border-sky-200 text-sky-800',
  }
  const icon = { orange: '⚠', red: '⛔', green: '✓', blue: 'ℹ' }[tone]
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <span className="text-sm leading-5">{icon}</span>
      <div className="text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-[13px] leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  )
}

// ===== Tabs =====
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${active === t ? 'text-ink-900' : 'text-ink-400 hover:text-ink-700'}`}
        >
          {t}
          {active === t && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-slate-900" />}
        </button>
      ))}
    </div>
  )
}

// money
export const yen = (n) => '¥' + n.toLocaleString('ja-JP')
