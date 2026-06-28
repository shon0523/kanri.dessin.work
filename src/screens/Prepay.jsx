import React, { useState } from 'react'
import { Card, CardHeader, Button, Badge, Toggle, Alert, Field, Input, Select, yen } from '../components/ui'
import { menus, stripe } from '../data/mock'

const METHODS = [
  { key: '全額事前決済', desc: '予約時に全額をオンライン決済します。最も確実な事前決済方式です。', icon: '💳' },
  { key: '予約金のみ事前決済', desc: '予約時に一部金額のみ決済し、残額は現地決済します。高額メニュー向け。', icon: '🪙' },
  { key: '現地決済併用', desc: 'お客様が事前決済または現地決済を選択できます。', icon: '🏬' },
  { key: '決済なし', desc: '予約受付のみ行い、決済は管理しません。', icon: '🚫' },
]

export default function Prepay({ showToast, navigate }) {
  const stripeConnected = stripe.status === '接続済み'
  const [enabled, setEnabled] = useState(true)
  const [method, setMethod] = useState('全額事前決済')
  const [menuCfg, setMenuCfg] = useState(() =>
    menus.reduce((acc, m) => { acc[m.id] = { prepay: m.prepay !== 'OFF', mode: m.method, deposit: m.deposit, local: m.local, cancelFee: m.cancelFee }; return acc }, {}))
  const [cancel, setCancel] = useState({ enabled: true, dayBefore: 50, sameDay: 100, noShow: 100, deadline: '3日前', feeHandling: '返金手数料は店舗負担' })
  const [refund, setRefund] = useState({ auto: false, approval: true, partial: true, reasonRequired: true, history: true })

  const patchMenu = (id, key, val) => setMenuCfg((c) => ({ ...c, [id]: { ...c[id], [key]: val } }))
  const save = () => showToast('事前決済設定を保存しました')

  return (
    <div className="space-y-5 pb-24">
      {/* ===== Status card ===== */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 text-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] text-slate-300 tracking-wide">事前決済 ステータス</div>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-2xl font-bold">{enabled ? '事前決済：ON' : '事前決済：OFF'}</span>
                <Badge tone={enabled ? 'green' : 'gray'} dot className="!bg-white/10 !text-white !border-white/20">{enabled ? '稼働中' : '停止中'}</Badge>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('stripe')}>Stripe接続設定へ →</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 divide-x divide-y md:divide-y-0 divide-slate-100">
          <Stat label="Stripe接続" value={<Badge tone="green" dot>接続済み</Badge>} />
          <Stat label="現在の決済モード" value={<span className="text-sm font-semibold text-ink-900">{method}</span>} />
          <Stat label="今月の事前決済売上" value={<span className="text-base font-bold text-ink-900">¥1,078,000</span>} />
          <Stat label="決済エラー件数" value={<span className="text-base font-bold text-rose-600">{stripe.errorCount} 件</span>} />
          <Stat label="未返金キャンセル" value={<span className="text-base font-bold text-amber-600">2 件</span>} />
          <Stat label="事前決済率" value={<span className="text-base font-bold text-emerald-600">84%</span>} />
        </div>
      </Card>

      {/* ===== Enable toggle ===== */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-xl">
            <h3 className="text-[15px] font-semibold text-ink-900">事前決済を有効にする</h3>
            <p className="mt-1.5 text-[13px] text-ink-500 leading-relaxed">
              ONにすると、対象メニューの予約時にオンライン決済を必須または任意にできます。
            </p>
            {!enabled && (
              <p className="mt-2 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                事前決済をOFFにすると、予約時のオンライン決済は利用できません。既存予約の決済情報には影響しません。
              </p>
            )}
          </div>
          <Toggle size="lg" checked={enabled} onChange={setEnabled} />
        </div>
        {enabled && !stripeConnected && (
          <div className="mt-4"><Alert tone="orange" title="Stripeの接続が必要です">事前決済を有効にするには、Stripeアカウントの接続が必要です。<button onClick={() => navigate('stripe')} className="ml-1 underline font-medium">接続する</button></Alert></div>
        )}
      </Card>

      {/* ===== Payment method ===== */}
      <Card className={enabled ? '' : 'opacity-50 pointer-events-none'}>
        <CardHeader title="決済方法設定" sub="店舗の標準となる決済方式を選択します" />
        <div className="px-5 pb-5 grid sm:grid-cols-2 gap-3">
          {METHODS.map((m) => {
            const on = method === m.key
            return (
              <button key={m.key} onClick={() => setMethod(m.key)} className={`text-left rounded-2xl border-2 p-4 transition ${on ? 'border-slate-900 bg-slate-50/80 shadow-card' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xl">{m.icon}</span>
                  <span className={`w-5 h-5 rounded-full border-2 grid place-items-center ${on ? 'border-slate-900' : 'border-slate-300'}`}>{on && <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />}</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-ink-900">{m.key}</div>
                <p className="mt-1 text-[12px] text-ink-500 leading-relaxed">{m.desc}</p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* ===== Per-menu settings ===== */}
      <Card className={enabled ? '' : 'opacity-50 pointer-events-none'}>
        <CardHeader title="メニュー別決済設定" sub="メニューごとに事前決済の有無・方式・予約金を設定します" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-ink-500 border-y border-slate-100 bg-slate-50/50">
                {['メニュー名', '大メニュー', '表示価格', '事前決済', '決済方式', '予約金', '現地決済', 'キャンセル料', '操作'].map((h) => (
                  <th key={h} className="text-left font-medium px-3 py-2.5 first:pl-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {menus.map((m) => {
                const c = menuCfg[m.id]
                return (
                  <tr key={m.id} className="hover:bg-slate-50/60 align-middle">
                    <td className="px-3 pl-5 py-3 font-medium text-ink-900">{m.name}</td>
                    <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{m.major}</td>
                    <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{yen(m.price)}</td>
                    <td className="px-3 py-3"><Toggle checked={c.prepay} onChange={(v) => patchMenu(m.id, 'prepay', v)} /></td>
                    <td className="px-3 py-3">
                      <Select className="!py-1.5 !text-xs min-w-[140px]" value={c.mode} onChange={(e) => patchMenu(m.id, 'mode', e.target.value)} disabled={!c.prepay}>
                        <option>全額事前決済</option><option>予約金のみ事前決済</option><option>現地決済併用</option>
                      </Select>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {c.mode === '予約金のみ事前決済'
                        ? <Input className="!py-1.5 !text-xs w-24" value={c.deposit} onChange={(e) => patchMenu(m.id, 'deposit', e.target.value)} />
                        : <span className="text-ink-300">—</span>}
                    </td>
                    <td className="px-3 py-3"><Toggle checked={c.local} onChange={(v) => patchMenu(m.id, 'local', v)} /></td>
                    <td className="px-3 py-3"><Badge tone="orange">{c.cancelFee}</Badge></td>
                    <td className="px-3 py-3"><Button variant="ghost" size="sm">編集</Button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* ===== Cancel fee ===== */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-ink-900">キャンセル料設定</h3>
              <p className="text-xs text-ink-500 mt-0.5">キャンセルのタイミングごとに料率を設定</p>
            </div>
            <Toggle checked={cancel.enabled} onChange={(v) => setCancel((c) => ({ ...c, enabled: v }))} />
          </div>
          <div className={`space-y-3 ${cancel.enabled ? '' : 'opacity-50 pointer-events-none'}`}>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-[12px] text-ink-600">
              例：3日前まで <b>無料</b> ／ 前日 <b>50%</b> ／ 当日 <b>100%</b> ／ 無断キャンセル <b>100%</b>
            </div>
            <PercentRow label="前日キャンセル" value={cancel.dayBefore} onChange={(v) => setCancel((c) => ({ ...c, dayBefore: v }))} />
            <PercentRow label="当日キャンセル" value={cancel.sameDay} onChange={(v) => setCancel((c) => ({ ...c, sameDay: v }))} />
            <PercentRow label="無断キャンセル" value={cancel.noShow} onChange={(v) => setCancel((c) => ({ ...c, noShow: v }))} />
            <Field label="キャンセル期限"><Select value={cancel.deadline} onChange={(e) => setCancel((c) => ({ ...c, deadline: e.target.value }))}><option>3日前</option><option>前日</option><option>当日</option></Select></Field>
            <Field label="返金手数料の扱い"><Select value={cancel.feeHandling} onChange={(e) => setCancel((c) => ({ ...c, feeHandling: e.target.value }))}><option>返金手数料は店舗負担</option><option>返金手数料はお客様負担</option><option>返金手数料を差し引いて返金</option></Select></Field>
          </div>
        </Card>

        {/* ===== Refund ===== */}
        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-ink-900 mb-1">返金設定</h3>
          <p className="text-xs text-ink-500 mb-4">キャンセル時の返金フローを設定します</p>
          <div className="space-y-1">
            <SwitchRow label="自動返金" desc="キャンセル時に自動で返金処理を行う" on={refund.auto} set={(v) => setRefund((r) => ({ ...r, auto: v }))} />
            <SwitchRow label="管理者承認後に返金" desc="返金前に店舗管理者の承認を必須にする" on={refund.approval} set={(v) => setRefund((r) => ({ ...r, approval: v }))} />
            <SwitchRow label="一部返金を許可" desc="キャンセル料を差し引いた一部返金を許可" on={refund.partial} set={(v) => setRefund((r) => ({ ...r, partial: v }))} />
            <SwitchRow label="返金理由の入力を必須にする" desc="返金時に理由の記録を必須にする" on={refund.reasonRequired} set={(v) => setRefund((r) => ({ ...r, reasonRequired: v }))} />
            <SwitchRow label="返金履歴を保存する" desc="すべての返金操作を履歴として保存" on={refund.history} set={(v) => setRefund((r) => ({ ...r, history: v }))} />
          </div>
        </Card>
      </div>

      {/* ===== Sticky save footer ===== */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 lg:px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
          <span className="text-xs text-ink-500 hidden sm:block">未保存の変更があります</span>
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" onClick={() => showToast('変更を破棄しました', 'info')}>キャンセル</Button>
            <Button variant="secondary" onClick={() => navigate('site')}>プレビュー</Button>
            <Button onClick={save}>変更を保存</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="px-5 py-4">
      <div className="text-[11px] text-ink-500 mb-1.5">{label}</div>
      {value}
    </div>
  )
}
function PercentRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-ink-700">{label}</span>
      <div className="flex items-center gap-2">
        <Input type="number" className="!py-1.5 w-20 text-right" value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <span className="text-sm text-ink-500">%</span>
      </div>
    </div>
  )
}
function SwitchRow({ label, desc, on, set }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-[13px] font-medium text-ink-800">{label}</div>
        <div className="text-[11px] text-ink-400">{desc}</div>
      </div>
      <Toggle checked={on} onChange={set} />
    </div>
  )
}
