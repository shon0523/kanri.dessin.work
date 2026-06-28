import React, { useState } from 'react'
import { Button } from './ui'

export default function Header({ title, breadcrumb, onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false)
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="h-16 px-4 lg:px-6 flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-ink-700 text-xl">☰</button>
        <div className="min-w-0 flex-1">
          <nav className="flex items-center gap-1.5 text-[11px] text-ink-400">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-ink-600 font-medium' : ''}>{b}</span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-lg font-bold text-ink-900 leading-tight truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
            <span>↗</span> 予約サイトを確認
          </Button>

          <div className="relative">
            <button onClick={() => setNotifOpen((v) => !v)} className="relative w-9 h-9 grid place-items-center rounded-xl hover:bg-slate-100 text-ink-600">
              <span className="text-base">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-pop border border-slate-200 z-40 animate-pop overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 text-sm font-semibold text-ink-900">通知</div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {[
                      { t: '決済エラーが1件あります', d: '5分前', tone: 'text-rose-600' },
                      { t: '七五三スタンダード撮影が承認待ちです', d: '1時間前', tone: 'text-amber-600' },
                      { t: '本部より新しいお知らせがあります', d: '昨日', tone: 'text-ink-500' },
                    ].map((n, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                        <p className={`text-[13px] font-medium ${n.tone}`}>{n.t}</p>
                        <p className="text-[11px] text-ink-400 mt-0.5">{n.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="w-9 h-9 grid place-items-center rounded-xl hover:bg-slate-100 text-ink-600" title="ヘルプ">
            <span className="text-base">？</span>
          </button>

          <button className="flex items-center gap-2 pl-1.5 pr-3 h-9 rounded-xl hover:bg-slate-100">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 grid place-items-center text-white text-xs font-semibold">中</span>
            <span className="hidden md:block text-[13px] font-medium text-ink-700">中川 翔</span>
          </button>
        </div>
      </div>
    </header>
  )
}
