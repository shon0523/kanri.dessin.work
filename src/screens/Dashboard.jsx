import React from 'react'
import { Card, CardHeader, Kpi, Badge, Button, ReservationBadge, PaymentBadge, yen } from '../components/ui'
import { reservations, booths, popularMenus, announcements, stripe } from '../data/mock'

export default function Dashboard({ navigate }) {
  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Kpi label="今日の予約数" value="8" unit="件" delta="前日比 +2" icon="📅" tone="blue" />
        <Kpi label="今月の予約数" value="186" unit="件" delta="前月比 +12%" icon="🗓" />
        <Kpi label="今月の売上" value="¥1,284,500" delta="前月比 +8%" icon="💴" tone="green" />
        <Kpi label="稼働率" value="72" unit="%" delta="目標 70%" icon="📈" />
        <Kpi label="キャンセル率" value="6.4" unit="%" delta="前月比 -1.2%" deltaTone="green" icon="↩" />
        <Kpi label="事前決済率" value="84" unit="%" delta="前月比 +5%" icon="💳" tone="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left 2/3 */}
        <div className="xl:col-span-2 space-y-5">
          {/* Stripe status */}
          <Card>
            <CardHeader title="Stripe接続ステータス" sub="オンライン決済の稼働状況" action={<Button variant="secondary" size="sm" onClick={() => navigate('stripe')}>詳細</Button>} />
            <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-[11px] text-ink-500 mb-1">接続状態</div>
                <Badge tone="green" dot>接続済み</Badge>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-[11px] text-ink-500 mb-1">事前決済</div>
                <Badge tone="navy">ON</Badge>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-[11px] text-ink-500 mb-1">最終入金予定日</div>
                <div className="text-sm font-semibold text-ink-900">{stripe.nextPayout}</div>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3">
                <div className="text-[11px] text-ink-500 mb-1">決済エラー</div>
                <div className="text-sm font-semibold text-rose-600">{stripe.errorCount} 件</div>
              </div>
            </div>
          </Card>

          {/* Recent reservations */}
          <Card>
            <CardHeader title="直近の予約一覧" sub="本日〜翌日の予約" action={<Button variant="ghost" size="sm" onClick={() => navigate('reservations')}>すべて見る →</Button>} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-ink-500 border-y border-slate-100 bg-slate-50/50">
                    <th className="text-left font-medium px-5 py-2.5">予約日時</th>
                    <th className="text-left font-medium px-3 py-2.5">顧客名</th>
                    <th className="text-left font-medium px-3 py-2.5 hidden md:table-cell">メニュー</th>
                    <th className="text-left font-medium px-3 py-2.5 hidden lg:table-cell">ブース</th>
                    <th className="text-left font-medium px-3 py-2.5">予約</th>
                    <th className="text-left font-medium px-3 py-2.5">決済</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reservations.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 text-ink-700 whitespace-nowrap">{r.datetime}</td>
                      <td className="px-3 py-3 font-medium text-ink-900">{r.customer}</td>
                      <td className="px-3 py-3 text-ink-600 hidden md:table-cell">{r.menu}</td>
                      <td className="px-3 py-3 text-ink-600 hidden lg:table-cell">{r.booth}</td>
                      <td className="px-3 py-3"><ReservationBadge status={r.status} /></td>
                      <td className="px-3 py-3"><PaymentBadge status={r.pay} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Booth utilization */}
          <Card>
            <CardHeader title="ブース別稼働状況" sub="本日の予約埋まり具合" />
            <div className="px-5 pb-5 space-y-3">
              {booths.map((b) => {
                const rate = Math.min(100, b.todayCount * 18)
                return (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className="w-32 text-[13px] text-ink-700 truncate">{b.name}</div>
                    <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${rate > 75 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${rate}%` }} />
                    </div>
                    <div className="w-16 text-right text-[12px] text-ink-500">{b.todayCount}件 / {rate}%</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">
          {/* Popular menus */}
          <Card>
            <CardHeader title="人気メニューランキング" sub="今月の予約数順" />
            <div className="px-5 pb-5 space-y-3">
              {popularMenus.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 grid place-items-center rounded-lg text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-800 truncate">{m.name}</div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${m.rate}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-ink-500 w-10 text-right">{m.count}件</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader title="本部からのお知らせ" sub="FC本部 → 加盟店" />
            <div className="px-5 pb-5 space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 p-3 hover:border-slate-300 transition cursor-pointer">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge tone={a.tag === '重要' ? 'red' : a.tag === 'メンテ' ? 'orange' : 'blue'}>{a.tag}</Badge>
                    <span className="text-[11px] text-ink-400">{a.date}</span>
                  </div>
                  <p className="text-[13px] font-medium text-ink-800 leading-snug">{a.title}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
