import React, { useState } from 'react'
import { Card, Button, Badge, Toggle, Tabs, Modal, Field, Input, Select, Textarea, yen } from '../components/ui'
import { menus as seed, booths } from '../data/mock'

const TABS = ['大メニュー', '中メニュー', '小メニュー', 'オプション', '本部共通メニュー', '店舗独自メニュー']
const majors = ['セルフ写真', '記念写真', 'プロフィール写真', '家族写真', '七五三', 'ペット撮影', 'スタジオレンタル']
const middles = ['カップル', '友達', '家族', 'ペット', 'ビジネスプロフィール', '七五三スタンダード']

export default function Menus({ showToast }) {
  const [tab, setTab] = useState('小メニュー')
  const [list, setList] = useState(seed)
  const [detail, setDetail] = useState(null)

  const patch = (id, key, val) => setList((l) => l.map((m) => (m.id === id ? { ...m, [key]: val } : m)))

  return (
    <div className="space-y-5">
      <Card className="px-4 pt-3">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </Card>

      {(tab === '大メニュー' || tab === '中メニュー') && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-900">{tab}一覧</h3>
            <Button size="sm">＋ {tab}を追加</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(tab === '大メニュー' ? majors : middles).map((m) => (
              <span key={m} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-ink-800 hover:border-slate-300">
                {m} <span className="text-ink-300">✎</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-500">大メニュー → 中メニュー → 小メニューの3階層で管理します。通常写真館メニューにも対応可能です。</p>
        </Card>
      )}

      {tab === 'オプション' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-900">オプション一覧</h3>
            <Button size="sm">＋ オプション追加</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[['データ全カット', 3300], ['追加プリント', 1100], ['ヘアメイク', 5500], ['衣装レンタル', 4400]].map(([n, p]) => (
              <div key={n} className="rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div><div className="text-sm font-medium text-ink-900">{n}</div><div className="text-xs text-ink-500 mt-0.5">{yen(p)}</div></div>
                <Toggle checked onChange={() => {}} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {(tab === '小メニュー' || tab === '本部共通メニュー' || tab === '店舗独自メニュー') && (
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-ink-900">
              {tab === '小メニュー' ? '小メニュー一覧' : tab}
              <span className="ml-2 text-xs font-normal text-ink-400">表示所要時間と実予約時間は別管理</span>
            </h3>
            <Button size="sm">＋ メニュー追加</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-ink-500 border-b border-slate-100 bg-slate-50/50">
                  {['メニュー名', '大/中', '表示時間', '実予約', '価格', '事前決済', '公開', '本部承認', ''].map((h, i) => (
                    <th key={i} className="text-left font-medium px-3 py-2.5 first:pl-5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.filter((m) => tab === '小メニュー' || (tab === '本部共通メニュー' ? m.scope === '本部共通' : m.scope === '店舗独自')).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="px-3 pl-5 py-3 font-medium text-ink-900">{m.name}</td>
                    <td className="px-3 py-3 text-ink-600 text-xs whitespace-nowrap">{m.major}<br /><span className="text-ink-400">{m.middle}</span></td>
                    <td className="px-3 py-3 whitespace-nowrap"><Badge tone="blue">{m.displayTime}分</Badge></td>
                    <td className="px-3 py-3 whitespace-nowrap"><Badge tone="navy">{m.realTime}分</Badge></td>
                    <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{yen(m.price)}</td>
                    <td className="px-3 py-3"><Toggle size="md" checked={m.prepay !== 'OFF'} onChange={(v) => patch(m.id, 'prepay', v ? 'ON' : 'OFF')} /></td>
                    <td className="px-3 py-3"><Badge tone={m.published ? 'green' : 'gray'} dot>{m.published ? '公開' : '非公開'}</Badge></td>
                    <td className="px-3 py-3"><Badge tone={m.approval === '本部承認済み' ? 'green' : 'orange'}>{m.approval === '本部承認済み' ? '承認済' : '承認待ち'}</Badge></td>
                    <td className="px-3 py-3"><Button variant="secondary" size="sm" onClick={() => setDetail(m)}>詳細設定</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <MenuDetail m={detail} onClose={() => setDetail(null)} onSave={() => { setDetail(null); showToast('メニューを保存しました') }} />
    </div>
  )
}

function MenuDetail({ m, onClose, onSave }) {
  if (!m) return null
  return (
    <Modal open={!!m} onClose={onClose} size="lg" title={`小メニュー詳細：${m.name}`} sub="表示所要時間と実予約時間を分けて設定できます"
      footer={<><Button variant="secondary" onClick={onClose}>キャンセル</Button><Button onClick={onSave}>保存する</Button></>}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="メニュー名" required className="md:col-span-2"><Input defaultValue={m.name} /></Field>
        <Field label="所属する大メニュー"><Select defaultValue={m.major}>{['セルフ写真','記念写真','プロフィール写真','家族写真','七五三','ペット撮影','スタジオレンタル'].map((x)=><option key={x}>{x}</option>)}</Select></Field>
        <Field label="所属する中メニュー"><Select defaultValue={m.middle}>{['カップル','友達','家族','ペット','ビジネスプロフィール','七五三スタンダード'].map((x)=><option key={x}>{x}</option>)}</Select></Field>
        <Field label="説明文" className="md:col-span-2"><Textarea defaultValue="セルフ撮影用のスタンダードプラン。" /></Field>
        <Field label="表示価格"><Input type="number" defaultValue={m.price} /></Field>
        <Field label="税区分"><Select defaultValue={m.taxIncluded ? '税込' : '税別'}><option>税込</option><option>税別</option></Select></Field>

        {/* Time highlight */}
        <div className="md:col-span-2 rounded-2xl border-2 border-sky-200 bg-sky-50/40 p-4">
          <div className="text-xs font-semibold text-sky-800 mb-3">⏱ 時間設定（ユーザー表示とシステム占有時間を分けます）</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="表示所要時間" hint="お客様に見せる時間"><div className="flex items-center gap-2"><Input type="number" defaultValue={m.displayTime} /><span className="text-sm text-ink-500">分</span></div></Field>
            <Field label="実予約時間" hint="ブース占有時間"><div className="flex items-center gap-2"><Input type="number" defaultValue={m.realTime} /><span className="text-sm text-ink-500">分</span></div></Field>
            <Field label="前バッファ"><div className="flex items-center gap-2"><Input type="number" defaultValue={m.bufferBefore} /><span className="text-sm text-ink-500">分</span></div></Field>
            <Field label="後バッファ"><div className="flex items-center gap-2"><Input type="number" defaultValue={m.bufferAfter} /><span className="text-sm text-ink-500">分</span></div></Field>
          </div>
          <p className="mt-2 text-[11px] text-sky-700">例：ユーザー表示は{m.displayTime}分・システム上は{m.realTime}分ブロックとして二重予約を防止します。</p>
        </div>

        <Field label="必要リソース"><Input defaultValue={m.resource} /></Field>
        <Field label="定員"><Input type="number" defaultValue={m.capacity} /></Field>
        <Field label="対応可能ブース" hint="複数選択可" className="md:col-span-2">
          <Select multiple className="h-20" defaultValue={m.booth}>{booths.map((b) => <option key={b.id}>{b.name}</option>)}</Select>
        </Field>
        <Field label="予約受付期限"><Select defaultValue="前日17:00"><option>前日17:00</option><option>3時間前</option><option>当日まで</option></Select></Field>
        <Field label="キャンセル期限"><Select defaultValue="前日まで"><option>3日前まで</option><option>前日まで</option><option>当日まで</option></Select></Field>

        <div className="md:col-span-2 rounded-xl border border-slate-200 p-4 grid sm:grid-cols-2 gap-3">
          <ToggleRow label="事前決済必須" defaultOn={m.prepay !== 'OFF'} />
          <ToggleRow label="現地決済許可" defaultOn={m.local} />
        </div>
        <Field label="公開状態"><Select defaultValue={m.published ? '公開' : '非公開'}><option>公開</option><option>非公開</option></Select></Field>
        <Field label="本部承認ステータス"><Select defaultValue={m.approval}><option>本部承認済み</option><option>承認待ち</option><option>差し戻し</option></Select></Field>
      </div>
    </Modal>
  )
}

function ToggleRow({ label, defaultOn }) {
  const [on, setOn] = useState(!!defaultOn)
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-ink-700 font-medium">{label}</span>
      <Toggle checked={on} onChange={setOn} />
    </div>
  )
}
