import React, { useState } from 'react'
import { Card, Button, Badge, Toggle, Modal, Field, Input, Select, Textarea } from '../components/ui'
import { booths as seed, menus } from '../data/mock'

const typeTone = {
  'セルフブース': 'blue', '撮影スタジオ': 'purple', 'レンタルスペース': 'green',
  'メイクルーム': 'orange', '設備': 'gray', 'スタッフ': 'navy',
}

export default function Booths({ showToast }) {
  const [list, setList] = useState(seed)
  const [open, setOpen] = useState(false)

  const patch = (id, key, val) => setList((l) => l.map((b) => (b.id === id ? { ...b, [key]: val } : b)))

  return (
    <div className="space-y-5">
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-ink-600">
          <p>このシステムは <span className="font-semibold text-ink-900">「箱＝ブース・スペース」の時間枠を押さえる</span> 予約方式です。複数のブースを登録し、メニューごとに必要な枠を割り当てます。</p>
        </div>
        <Button className="flex-shrink-0" onClick={() => setOpen(true)}>＋ ブースを追加</Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((b) => (
          <Card key={b.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-ink-900">{b.name}</h3>
                  {b.maintenance && <Badge tone="orange" dot>メンテ中</Badge>}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge tone={typeTone[b.type] || 'gray'}>{b.type}</Badge>
                  <span className="text-xs text-ink-400">定員 {b.capacity}名</span>
                </div>
              </div>
              <Badge tone={b.published ? 'green' : 'gray'} dot>{b.published ? '公開中' : '非公開'}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 py-2">
                <div className="text-lg font-bold text-ink-900">{b.menuCount}</div>
                <div className="text-[10px] text-ink-500">対応メニュー</div>
              </div>
              <div className="rounded-xl bg-slate-50 py-2">
                <div className="text-lg font-bold text-ink-900">{b.todayCount}</div>
                <div className="text-[10px] text-ink-500">本日の予約</div>
              </div>
              <div className="rounded-xl bg-slate-50 py-2">
                <div className="text-lg font-bold text-ink-900">{b.capacity}</div>
                <div className="text-[10px] text-ink-500">定員(名)</div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3">
              <Row label="公開状態"><Toggle checked={b.published} onChange={(v) => patch(b.id, 'published', v)} /></Row>
              <Row label="自動割当対象"><Toggle checked={b.autoAssign} onChange={(v) => patch(b.id, 'autoAssign', v)} /></Row>
              <Row label="指名予約可"><Toggle checked={b.nominate} onChange={(v) => patch(b.id, 'nominate', v)} /></Row>
              <Row label="メンテナンス"><Toggle checked={b.maintenance} onChange={(v) => patch(b.id, 'maintenance', v)} /></Row>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">編集</Button>
              <Button variant="secondary" size="sm" className="flex-1">予約状況</Button>
            </div>
          </Card>
        ))}
      </div>

      <AddBoothModal open={open} onClose={() => setOpen(false)} onSave={(b) => { setList((l) => [...l, b]); setOpen(false); showToast('ブースを追加しました') }} />
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-ink-600">{label}</span>
      {children}
    </div>
  )
}

function AddBoothModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('セルフブース')
  const [published, setPublished] = useState(true)
  const [autoAssign, setAutoAssign] = useState(true)
  const [nominate, setNominate] = useState(false)

  const save = () => onSave({
    id: 'b' + Date.now(), name: name || '新規ブース', type, capacity: 4,
    menuCount: 0, todayCount: 0, published, autoAssign, nominate, maintenance: false,
  })

  return (
    <Modal open={open} onClose={onClose} title="ブースを追加" sub="箱（リソース）の時間枠を新しく登録します" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>キャンセル</Button><Button onClick={save}>追加する</Button></>}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="ブース名" required className="md:col-span-2"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例：セルフブースC" /></Field>
        <Field label="ブース種別" required>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {['セルフブース', '撮影スタジオ', 'レンタルスペース', 'メイクルーム', '設備', 'スタッフ'].map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="定員"><Input type="number" defaultValue={4} /></Field>
        <Field label="説明文" className="md:col-span-2"><Textarea placeholder="ブースの特徴や用途を記載" /></Field>
        <Field label="対応メニュー" hint="複数選択可" className="md:col-span-2">
          <Select multiple className="h-24">{menus.map((m) => <option key={m.id}>{m.name}</option>)}</Select>
        </Field>
        <Field label="営業時間"><Input defaultValue="10:00〜19:00" /></Field>
        <Field label="予約単位"><Select><option>15分</option><option>30分</option><option>60分</option></Select></Field>
        <div className="md:col-span-2 rounded-xl border border-slate-200 p-4 space-y-3">
          <Row label="公開状態"><Toggle checked={published} onChange={setPublished} /></Row>
          <Row label="自動割当対象"><Toggle checked={autoAssign} onChange={setAutoAssign} /></Row>
          <Row label="指名予約可"><Toggle checked={nominate} onChange={setNominate} /></Row>
        </div>
        <Field label="注意事項" className="md:col-span-2"><Textarea placeholder="利用時の注意点など" /></Field>
      </div>
    </Modal>
  )
}
