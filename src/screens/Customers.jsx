import React, { useState } from 'react'
import { Card, Button, Badge, Modal, PaymentBadge, ReservationBadge, Input, yen } from '../components/ui'
import { customers, reservations, payments } from '../data/mock'

const tagTone = { 'VIP': 'purple', 'リピーター': 'green', '新規': 'blue', '要注意': 'red', '法人': 'navy', 'ペット': 'orange', 'カップル': 'gray', '七五三': 'gray' }

export default function Customers() {
  const [sel, setSel] = useState(null)
  const [q, setQ] = useState('')
  const list = customers.filter((c) => !q || c.name.includes(q) || c.phone.includes(q) || c.email.includes(q))

  return (
    <div className="space-y-5">
      <Card className="p-4 flex items-center justify-between gap-3">
        <Input className="max-w-xs" placeholder="🔍 顧客名・電話・メールで検索" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button>＋ 顧客を追加</Button>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-ink-500 border-b border-slate-100 bg-slate-50/50">
                {['顧客名', '電話番号', 'メールアドレス', '予約回数', '累計利用額', '最終来店日', 'タグ', ''].map((h) => (
                  <th key={h} className="text-left font-medium px-3 py-2.5 first:pl-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-3 pl-5 py-3 font-medium text-ink-900 whitespace-nowrap">{c.name}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{c.phone}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{c.email}</td>
                  <td className="px-3 py-3 text-ink-700">{c.visits}回</td>
                  <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{yen(c.total)}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{c.lastVisit}</td>
                  <td className="px-3 py-3"><div className="flex gap-1 flex-wrap">{c.tags.map((t) => <Badge key={t} tone={tagTone[t] || 'gray'}>{t}</Badge>)}</div></td>
                  <td className="px-3 py-3"><Button variant="secondary" size="sm" onClick={() => setSel(c)}>詳細</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <CustomerModal c={sel} onClose={() => setSel(null)} />
    </div>
  )
}

function CustomerModal({ c, onClose }) {
  const [tab, setTab] = useState('基本情報')
  if (!c) return null
  const tabs = ['基本情報', '予約履歴', '決済履歴', 'キャンセル履歴', '管理メモ']
  return (
    <Modal open={!!c} onClose={onClose} size="lg" title={`顧客：${c.name}`} sub={`${c.visits}回利用 ・ 累計 ${yen(c.total)}`}
      footer={<Button variant="secondary" onClick={onClose}>閉じる</Button>}>
      <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative px-3 py-2 text-[13px] font-medium whitespace-nowrap ${tab === t ? 'text-ink-900' : 'text-ink-400 hover:text-ink-700'}`}>
            {t}{tab === t && <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-slate-900 rounded-full" />}
          </button>
        ))}
      </div>

      {tab === '基本情報' && (
        <div className="grid sm:grid-cols-2 gap-3">
          {[['氏名', c.name], ['電話番号', c.phone], ['メールアドレス', c.email], ['予約回数', `${c.visits}回`], ['累計利用額', yen(c.total)], ['最終来店日', c.lastVisit]].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 px-4 py-3"><div className="text-[11px] text-ink-500">{k}</div><div className="text-[13px] font-medium text-ink-900 mt-0.5">{v}</div></div>
          ))}
          <div className="sm:col-span-2 flex gap-1.5 flex-wrap">{c.tags.map((t) => <Badge key={t} tone={tagTone[t] || 'gray'}>{t}</Badge>)}</div>
        </div>
      )}
      {tab === '予約履歴' && (
        <div className="space-y-2">
          {reservations.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div><div className="text-[13px] font-medium text-ink-900">{r.menu}</div><div className="text-[11px] text-ink-500">{r.datetime} ・ {r.booth}</div></div>
              <ReservationBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
      {tab === '決済履歴' && (
        <div className="space-y-2">
          {payments.slice(0, 3).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div><div className="text-[13px] font-medium text-ink-900">{yen(p.amount)} ・ {p.menu}</div><div className="text-[11px] text-ink-500">{p.datetime} ・ {p.method}</div></div>
              <PaymentBadge status={p.status} />
            </div>
          ))}
        </div>
      )}
      {tab === 'キャンセル履歴' && (
        <div className="rounded-xl border border-slate-200 px-4 py-6 text-center text-[13px] text-ink-400">キャンセル履歴はありません</div>
      )}
      {tab === '管理メモ' && (
        <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm min-h-[120px]" defaultValue={c.memo} />
      )}
    </Modal>
  )
}
