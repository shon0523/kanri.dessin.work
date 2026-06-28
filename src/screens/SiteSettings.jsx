import React, { useState } from 'react'
import { Card, CardHeader, Button, Badge, Toggle, Field, Input, Textarea, Select } from '../components/ui'
import { store } from '../data/mock'

const FLOWS = [
  { key: 'menu', label: 'メニューから選ぶ', desc: 'お客様がまずメニューを選び、その後に日時・ブースを決定', icon: '☰' },
  { key: 'booth', label: 'ブース・スペースから選ぶ', desc: '箱（ブース）を起点に空き枠を探して予約', icon: '▣' },
  { key: 'date', label: '日時から選ぶ', desc: 'カレンダーの空き日時を起点に予約', icon: '📅' },
]

export default function SiteSettings({ showToast }) {
  const [flow, setFlow] = useState('menu')
  const [published, setPublished] = useState(true)
  const [opts, setOpts] = useState({
    showBooth: true, autoAssign: true, nominateBooth: false, nominateStaff: true,
    options: true, completeMail: true, remindMail: true,
  })
  const set = (k) => (v) => setOpts((o) => ({ ...o, [k]: v }))

  return (
    <div className="space-y-5 pb-20">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-ink-900">基本情報</h3>
              <div className="flex items-center gap-2"><span className="text-xs text-ink-500">公開状態</span><Toggle checked={published} onChange={setPublished} /><Badge tone={published ? 'green' : 'gray'} dot>{published ? '公開中' : '非公開'}</Badge></div>
            </div>
            <Field label="店舗ページURL"><div className="flex"><span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-[13px] text-ink-500">https://</span><Input className="!rounded-l-none" defaultValue={store.url} /></div></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="店舗名"><Input defaultValue={store.name} /></Field>
              <Field label="電話番号"><Input defaultValue={store.phone} /></Field>
            </div>
            <Field label="キャッチコピー"><Input defaultValue="熊本で“撮りたい瞬間”を、自分のペースで。" /></Field>
            <Field label="店舗説明"><Textarea defaultValue="セルフ写真からプロ撮影まで対応するC STUDIO熊本店。完全予約制で、白壁スタジオやペット対応ブースもご用意しています。" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="メイン画像"><div className="rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-center text-[12px] text-ink-400">📷 画像をドラッグ＆ドロップ</div></Field>
              <Field label="店舗写真（複数）"><div className="rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-center text-[12px] text-ink-400">＋ 写真を追加</div></Field>
            </div>
            <Field label="住所"><Input defaultValue={store.address} /></Field>
            <Field label="Googleマップ URL"><Input placeholder="https://maps.google.com/..." /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="営業時間"><Input defaultValue={store.hours} /></Field>
              <Field label="Instagram URL"><Input placeholder="https://instagram.com/..." /></Field>
            </div>
            <Field label="LINE URL"><Input placeholder="https://lin.ee/..." /></Field>
            <Field label="注意事項"><Textarea defaultValue="ご予約時間の5分前にお越しください。" /></Field>
            <Field label="キャンセルポリシー"><Textarea defaultValue="3日前まで無料 / 前日50% / 当日・無断100%" /></Field>
          </Card>
        </div>

        <div className="space-y-5">
          {/* 予約導線 */}
          <Card className="p-6">
            <h3 className="text-[15px] font-semibold text-ink-900">予約導線設定</h3>
            <p className="text-xs text-ink-500 mt-1 mb-4">店舗の標準となる予約導線を選択します</p>
            <div className="space-y-2.5">
              {FLOWS.map((f) => {
                const on = flow === f.key
                return (
                  <button key={f.key} onClick={() => setFlow(f.key)} className={`w-full text-left rounded-xl border-2 p-3.5 transition flex gap-3 ${on ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className="text-lg">{f.icon}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-ink-900">{f.label}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5 leading-snug">{f.desc}</div>
                    </div>
                    <span className={`w-4 h-4 mt-0.5 rounded-full border-2 grid place-items-center flex-shrink-0 ${on ? 'border-slate-900' : 'border-slate-300'}`}>{on && <span className="w-2 h-2 rounded-full bg-slate-900" />}</span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* 予約オプション */}
          <Card className="p-6">
            <h3 className="text-[15px] font-semibold text-ink-900 mb-3">予約オプション</h3>
            <div className="space-y-1">
              <Sw label="ブース選択を表示する" on={opts.showBooth} set={set('showBooth')} />
              <Sw label="ブース自動割当" on={opts.autoAssign} set={set('autoAssign')} />
              <Sw label="ブース指名予約" on={opts.nominateBooth} set={set('nominateBooth')} />
              <Sw label="スタッフ指名予約" on={opts.nominateStaff} set={set('nominateStaff')} />
              <Sw label="オプション選択" on={opts.options} set={set('options')} />
              <Sw label="予約完了メール送信" on={opts.completeMail} set={set('completeMail')} />
              <Sw label="リマインドメール送信" on={opts.remindMail} set={set('remindMail')} />
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 lg:px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex justify-end gap-2">
          <Button variant="secondary">プレビュー</Button>
          <Button onClick={() => showToast('予約サイト設定を保存しました')}>変更を保存</Button>
        </div>
      </div>
    </div>
  )
}

function Sw({ label, on, set }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[13px] text-ink-700">{label}</span>
      <Toggle checked={on} onChange={set} />
    </div>
  )
}
