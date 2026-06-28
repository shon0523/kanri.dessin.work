import React from 'react'
import { Card, CardHeader, Kpi, Badge, Button, PaymentBadge, yen } from '../components/ui'
import { payments, dailySales, menus, booths } from '../data/mock'

export default function Sales() {
  const max = Math.max(...dailySales.map((d) => d.value))
  const menuSales = [
    { name: 'セルフ写真30分プラン', v: 497000 }, { name: 'セルフ写真60分プラン', v: 588000 },
    { name: '七五三スタンダード撮影', v: 924000 }, { name: 'ペットセルフフォト', v: 390500 },
    { name: 'スタジオレンタル60分', v: 387200 },
  ]
  const boothSales = [
    { name: 'セルフブースA', v: 612000 }, { name: 'セルフブースB', v: 498000 },
    { name: '白壁スタジオ', v: 1043000 }, { name: 'ペット対応ブース', v: 390500 },
  ]
  const maxMenu = Math.max(...menuSales.map((m) => m.v))
  const maxBooth = Math.max(...boothSales.map((b) => b.v))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Kpi label="今月の売上" value="¥1,284,500" delta="前月比 +8%" tone="green" />
        <Kpi label="事前決済売上" value="¥1,078,000" delta="全体の84%" tone="blue" />
        <Kpi label="現地決済予定額" value="¥206,500" />
        <Kpi label="返金額" value="¥3,000" deltaTone="red" delta="1件" />
        <Kpi label="キャンセル料" value="¥3,000" delta="徴収済み" />
        <Kpi label="Stripe入金予定額" value="¥742,800" delta="7/3 入金予定" tone="navy" />
      </div>

      <Card className="p-6">
        <CardHeader title="日別売上グラフ" sub="直近7日間" />
        <div className="px-1 pt-2">
          <div className="flex items-end gap-3 h-48">
            {dailySales.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-slate-800 to-slate-600 hover:from-sky-600 hover:to-sky-400 transition-colors relative group" style={{ height: `${(d.value / max) * 100}%` }}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-ink-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">{yen(d.value)}</span>
                  </div>
                </div>
                <span className="text-[11px] text-ink-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <CardHeader title="メニュー別売上" />
          <div className="space-y-3 mt-2">
            {menuSales.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-40 text-[13px] text-ink-700 truncate">{m.name}</div>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-sky-400 rounded-full" style={{ width: `${(m.v / maxMenu) * 100}%` }} /></div>
                <div className="w-20 text-right text-[12px] font-medium text-ink-800">{yen(m.v)}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <CardHeader title="ブース別売上" />
          <div className="space-y-3 mt-2">
            {boothSales.map((b) => (
              <div key={b.name} className="flex items-center gap-3">
                <div className="w-40 text-[13px] text-ink-700 truncate">{b.name}</div>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(b.v / maxBooth) * 100}%` }} /></div>
                <div className="w-20 text-right text-[12px] font-medium text-ink-800">{yen(b.v)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-ink-900">決済一覧</h3>
          <Button variant="secondary" size="sm">⬇ CSVエクスポート</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-ink-500 border-b border-slate-100 bg-slate-50/50">
                {['決済日時', '顧客名', '予約ID', 'メニュー', '金額', '決済方法', '決済ステータス', '返金ステータス'].map((h) => (
                  <th key={h} className="text-left font-medium px-3 py-2.5 first:pl-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="px-3 pl-5 py-3 text-ink-700 whitespace-nowrap">{p.datetime}</td>
                  <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{p.customer}</td>
                  <td className="px-3 py-3 text-ink-500 font-mono text-xs whitespace-nowrap">{p.resId}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{p.menu}</td>
                  <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{yen(p.amount)}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{p.method}</td>
                  <td className="px-3 py-3"><PaymentBadge status={p.status} /></td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{p.refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
