import React from 'react'
import { store } from '../data/mock'

const items = [
  { key: 'dashboard', label: 'ダッシュボード', icon: '▦' },
  { key: 'reservations', label: '予約管理', icon: '▤' },
  { key: 'calendar', label: 'Googleカレンダー連携', icon: '📅', highlight: true },
  { key: 'booths', label: 'ブース・スペース', icon: '▣' },
  { key: 'menus', label: 'メニュー管理', icon: '☰' },
  { key: 'site', label: '予約サイト設定', icon: '◰' },
  { key: 'prepay', label: '事前決済設定', icon: '¥', highlight: true },
  { key: 'stripe', label: 'Stripe接続', icon: '⊕', highlight: true },
  { key: 'sales', label: '売上管理', icon: '◔' },
  { key: 'customers', label: '顧客管理', icon: '☺' },
  { key: 'settings', label: '店舗設定', icon: '⚙' },
]

export default function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden" onClick={onCloseMobile} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-5 h-16 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white text-slate-900 grid place-items-center font-bold text-sm">CS</div>
          <div>
            <div className="text-white font-semibold text-[15px] leading-tight">C STUDIO</div>
            <div className="text-[10px] tracking-widest text-slate-400">RESERVE</div>
          </div>
        </div>

        {/* FC switcher hint */}
        <div className="px-3 pt-3">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="text-[11px]">
              <div className="text-slate-400">表示中の店舗</div>
              <div className="text-white font-medium">{store.name}</div>
            </div>
            <span className="text-slate-500 text-xs">⌄</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {items.map((it) => {
            const active = current === it.key
            return (
              <button
                key={it.key}
                onClick={() => onNavigate(it.key)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                <span className={`w-5 text-center ${active ? 'opacity-100' : 'opacity-70'}`}>{it.icon}</span>
                <span className="flex-1 text-left">{it.label}</span>
                {it.highlight && !active && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
              </button>
            )
          })}
        </nav>

        {/* Footer: store/role/logout */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 grid place-items-center text-white font-semibold text-sm">中</div>
            <div className="min-w-0">
              <div className="text-white text-[13px] font-medium truncate">{store.name}</div>
              <div className="text-[11px] text-slate-400">{store.role}</div>
            </div>
          </div>
          <button className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
            <span>⏻</span> ログアウト
          </button>
        </div>
      </aside>
    </>
  )
}
