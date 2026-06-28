import React from 'react'
import { Card, CardHeader, Button, Badge, Field, Input, Textarea, Select } from '../components/ui'
import { store } from '../data/mock'

const staff = [
  { name: '中川 翔', role: '加盟店オーナー', tone: 'navy', email: 'kumamoto@cstudio.example.jp' },
  { name: '山本 さくら', role: '店長', tone: 'purple', email: 'sakura@cstudio.example.jp' },
  { name: '小林 大樹', role: '店舗スタッフ', tone: 'blue', email: 'daiki@cstudio.example.jp' },
  { name: '本部 管理', role: 'FC本部管理者', tone: 'green', email: 'hq@cstudio.example.jp' },
]
const perms = [
  ['予約管理', true, true, true],
  ['事前決済・Stripe設定', true, false, false],
  ['売上管理', true, true, false],
  ['メニュー本部承認', false, false, true],
  ['店舗設定', true, false, false],
]

export default function StoreSettings({ showToast }) {
  return (
    <div className="space-y-5 pb-20">
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6 space-y-4">
          <h3 className="text-[15px] font-semibold text-ink-900">店舗情報</h3>
          <Field label="店舗名"><Input defaultValue={store.name} /></Field>
          <Field label="運営会社名"><Input defaultValue={store.company} /></Field>
          <Field label="店舗住所"><Input defaultValue={store.address} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="電話番号"><Input defaultValue={store.phone} /></Field>
            <Field label="メールアドレス"><Input defaultValue={store.email} /></Field>
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="text-[15px] font-semibold text-ink-900">営業情報</h3>
          <Field label="営業時間"><Input defaultValue={store.hours} /></Field>
          <Field label="定休日"><Input defaultValue={store.holiday} /></Field>
          <Field label="通知先メールアドレス" hint="予約・決済の通知を受け取ります"><Input defaultValue={store.email} /></Field>
          <Field label="FC加盟店区分"><Select><option>直営+FC（加盟店）</option><option>本部直営</option></Select></Field>
        </Card>
      </div>

      {/* 権限管理 */}
      <Card>
        <CardHeader title="権限管理" sub="ロールごとに操作可能な範囲を管理します（FC本部・オーナー・スタッフ）" />
        <div className="overflow-x-auto px-1 pb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-ink-500 border-y border-slate-100 bg-slate-50/50">
                <th className="text-left font-medium px-5 py-2.5">機能</th>
                <th className="text-center font-medium px-3 py-2.5">オーナー</th>
                <th className="text-center font-medium px-3 py-2.5">店長</th>
                <th className="text-center font-medium px-3 py-2.5">FC本部</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {perms.map((p) => (
                <tr key={p[0]}>
                  <td className="px-5 py-3 font-medium text-ink-800">{p[0]}</td>
                  {p.slice(1).map((v, i) => (
                    <td key={i} className="px-3 py-3 text-center">{v ? <span className="text-emerald-600">●</span> : <span className="text-slate-300">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* スタッフアカウント */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-ink-900">スタッフアカウント管理</h3>
          <Button size="sm">＋ アカウント追加</Button>
        </div>
        <div className="divide-y divide-slate-50">
          {staff.map((s) => (
            <div key={s.email} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 grid place-items-center text-white text-xs font-semibold">{s.name[0]}</span>
                <div><div className="text-[13px] font-medium text-ink-900">{s.name}</div><div className="text-[11px] text-ink-500">{s.email}</div></div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={s.tone}>{s.role}</Badge>
                <Button variant="ghost" size="sm">編集</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 lg:px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex justify-end gap-2">
          <Button variant="ghost">キャンセル</Button>
          <Button onClick={() => showToast('店舗設定を保存しました')}>変更を保存</Button>
        </div>
      </div>
    </div>
  )
}
