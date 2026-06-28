import React, { useState, useMemo } from 'react'
import { Card, Button, Badge, Modal, ReservationBadge, PaymentBadge, Field, Select, Input, Textarea, yen } from '../components/ui'
import { reservations, menus, booths, googleCalendar, calendarSyncStatus } from '../data/mock'

export default function Reservations({ showToast, navigate }) {
  const [rows, setRows] = useState(reservations)
  const [filters, setFilters] = useState({ date: '', menu: '', booth: '', status: '', pay: '' })
  const [selected, setSelected] = useState(null)
  const [creating, setCreating] = useState(false)

  const calConnected = googleCalendar.status === '接続済み'

  const addReservation = (r) => {
    setRows((list) => [r, ...list])
    setCreating(false)
    if (calConnected) showToast('予約を作成し、Googleカレンダーに登録しました')
    else showToast('予約を作成しました（カレンダー未連携）', 'info')
  }

  const filtered = useMemo(() => rows.filter((r) =>
    (!filters.date || r.date === filters.date) &&
    (!filters.menu || r.menu === filters.menu) &&
    (!filters.booth || r.booth === filters.booth) &&
    (!filters.status || r.status === filters.status) &&
    (!filters.pay || r.pay === filters.pay)
  ), [rows, filters])

  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }))
  const reset = () => setFilters({ date: '', menu: '', booth: '', status: '', pay: '' })

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink-900">絞り込み</h3>
          <button onClick={reset} className="text-xs text-ink-500 hover:text-ink-800">条件をクリア</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Field label="日付"><Select value={filters.date} onChange={set('date')}><option value="">すべて</option><option value="2026/07/01">2026/07/01</option><option value="2026/07/02">2026/07/02</option></Select></Field>
          <Field label="メニュー"><Select value={filters.menu} onChange={set('menu')}><option value="">すべて</option>{menus.map((m) => <option key={m.id}>{m.name}</option>)}</Select></Field>
          <Field label="ブース"><Select value={filters.booth} onChange={set('booth')}><option value="">すべて</option>{booths.map((b) => <option key={b.id}>{b.name}</option>)}</Select></Field>
          <Field label="予約ステータス"><Select value={filters.status} onChange={set('status')}><option value="">すべて</option>{['仮予約', '予約確定', '来店済み', 'キャンセル', '無断キャンセル'].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="決済ステータス"><Select value={filters.pay} onChange={set('pay')}><option value="">すべて</option>{['未決済', '決済待ち', '決済完了', '一部返金', '全額返金', '現地決済'].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <div className="flex items-end"><Button className="w-full" onClick={() => setCreating(true)}>＋ 新規予約</Button></div>
        </div>
      </Card>

      {/* Google カレンダー連携バナー */}
      <Card className="p-3.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 grid place-items-center">📅</span>
          <div className="text-[13px] text-ink-700">
            {calConnected
              ? <>Googleカレンダー連携 <Badge tone="green" dot>接続済み</Badge> ／ 新規予約は自動でカレンダーに登録されます</>
              : <>Googleカレンダーは <Badge tone="gray" dot>未接続</Badge> です。連携すると予約が自動登録されます</>}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('calendar')}>カレンダー連携設定 →</Button>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="text-sm text-ink-600"><span className="font-semibold text-ink-900">{filtered.length}</span> 件の予約</div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">📅 カレンダー表示</Button>
            <Button variant="secondary" size="sm">⬇ エクスポート</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-ink-500 border-b border-slate-100 bg-slate-50/50">
                {['予約日時', '顧客名', 'メニュー', '使用ブース', '予約時間', '予約ステータス', '決済ステータス', '金額', '操作'].map((h) => (
                  <th key={h} className="text-left font-medium px-3 py-2.5 first:pl-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-3 pl-5 py-3 text-ink-700 whitespace-nowrap">{r.datetime}</td>
                  <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{r.customer}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{r.menu}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{r.booth}</td>
                  <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{r.time}</td>
                  <td className="px-3 py-3"><ReservationBadge status={r.status} /></td>
                  <td className="px-3 py-3"><PaymentBadge status={r.pay} /></td>
                  <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{yen(r.amount)}</td>
                  <td className="px-3 py-3"><Button variant="secondary" size="sm" onClick={() => setSelected(r)}>詳細</Button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-ink-400 text-sm">条件に一致する予約はありません</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <DetailModal r={selected} onClose={() => setSelected(null)} showToast={showToast} calConnected={calConnected} />
      <CreateModal open={creating} onClose={() => setCreating(false)} onCreate={addReservation} calConnected={calConnected} />
    </div>
  )
}

function CreateModal({ open, onClose, onCreate, calConnected }) {
  const [form, setForm] = useState({ customer: '', menu: menus[0].name, booth: booths[0].name, date: '2026/07/03', time: '10:00' })
  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const menu = menus.find((m) => m.name === form.menu) || menus[0]
  const endTime = (() => {
    const [h, mm] = form.time.split(':').map(Number)
    const total = h * 60 + mm + menu.realTime
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  })()

  const submit = () => {
    onCreate({
      id: 'R-' + form.date.replace(/\//g, '') + '-' + Math.floor(Math.random() * 900 + 100),
      datetime: `${form.date} ${form.time}`, date: form.date, time: `${form.time}〜${endTime}`,
      customer: form.customer || '新規 顧客', menu: form.menu, booth: form.booth,
      status: '予約確定', pay: menu.prepay !== 'OFF' ? '決済完了' : '現地決済', amount: menu.price,
      phone: '090-0000-0000', email: 'guest@example.com',
      method: menu.prepay !== 'OFF' ? 'クレジットカード' : '現地決済', memo: '新規作成（プロトタイプ）',
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="新規予約を作成" sub="作成すると予約情報がGoogleカレンダーに自動登録されます" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>キャンセル</Button><Button onClick={submit}>予約を作成{calConnected ? '＋カレンダー登録' : ''}</Button></>}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="顧客名" required className="md:col-span-2"><Input value={form.customer} onChange={upd('customer')} placeholder="例：山田 美咲" /></Field>
        <Field label="メニュー"><Select value={form.menu} onChange={upd('menu')}>{menus.map((m) => <option key={m.id}>{m.name}</option>)}</Select></Field>
        <Field label="使用ブース"><Select value={form.booth} onChange={upd('booth')}>{booths.map((b) => <option key={b.id}>{b.name}</option>)}</Select></Field>
        <Field label="予約日"><Input value={form.date} onChange={upd('date')} /></Field>
        <Field label="開始時刻"><Input value={form.time} onChange={upd('time')} /></Field>

        {/* 時間・占有プレビュー */}
        <div className="md:col-span-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-[12px] text-ink-600 space-y-1">
          <div>表示所要時間 <b>{menu.displayTime}分</b> ／ 実予約（ブース占有）<b>{menu.realTime}分</b></div>
          <div>占有時間枠：<b>{form.time}〜{endTime}</b>（{form.booth}）・同じ時間に同じブースは二重予約されません</div>
        </div>

        {/* カレンダー登録プレビュー */}
        <div className="md:col-span-2 rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-sky-800 mb-1">📅 Googleカレンダー登録プレビュー</div>
          {calConnected ? (
            <div className="text-[12px] text-ink-700">
              <div className="font-medium">【予約】{form.menu} / {form.customer || '新規 顧客'}</div>
              <div className="text-ink-500">{form.date} {form.time}〜{endTime} ・ 場所：{form.booth}</div>
            </div>
          ) : (
            <div className="text-[12px] text-amber-700">Googleカレンダー未連携のため、この予約は自動登録されません。</div>
          )}
        </div>
      </div>
    </Modal>
  )
}

function DetailModal({ r, onClose, showToast, calConnected }) {
  if (!r) return null
  const calSync = calConnected ? (calendarSyncStatus[r.status] || '同期済み') : '未連携'
  const calTone = { '同期済み': 'green', '同期待ち': 'orange', '削除済み': 'gray', '未連携': 'gray' }[calSync]
  const Row = ({ label, children }) => (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
      <span className="text-[13px] text-ink-500">{label}</span>
      <span className="text-[13px] font-medium text-ink-900 text-right">{children}</span>
    </div>
  )
  const Section = ({ title, children }) => (
    <div>
      <h4 className="text-xs font-semibold text-ink-700 mb-1.5 flex items-center gap-2"><span className="w-1 h-3.5 rounded bg-slate-800" />{title}</h4>
      <div className="rounded-xl border border-slate-200 px-4 py-1.5">{children}</div>
    </div>
  )
  return (
    <Modal open={!!r} onClose={onClose} size="lg" title={`予約詳細 ${r.id}`} sub={`${r.datetime}・${r.booth}`}
      footer={<>
        <Button variant="secondary" onClick={onClose}>閉じる</Button>
        <Button variant="danger" onClick={() => { showToast('予約をキャンセルしました', 'info'); onClose() }}>キャンセル処理</Button>
        <Button onClick={() => { showToast('予約を確定しました'); onClose() }}>予約を確定</Button>
      </>}>
      <div className="flex items-center gap-2 mb-4">
        <ReservationBadge status={r.status} />
        <PaymentBadge status={r.pay} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Section title="顧客情報">
          <Row label="氏名">{r.customer}</Row>
          <Row label="電話番号">{r.phone}</Row>
          <Row label="メール">{r.email}</Row>
        </Section>
        <Section title="予約内容">
          <Row label="メニュー">{r.menu}</Row>
          <Row label="予約日時">{r.datetime}</Row>
          <Row label="予約時間">{r.time}</Row>
        </Section>
        <Section title="利用ブース">
          <Row label="ブース">{r.booth}</Row>
          <Row label="ブロック時間">実予約時間で確保</Row>
          <Row label="二重予約">なし（占有中）</Row>
        </Section>
        <Section title="決済情報">
          <Row label="金額">{yen(r.amount)}</Row>
          <Row label="決済方法">{r.method}</Row>
          <Row label="決済ステータス"><PaymentBadge status={r.pay} /></Row>
        </Section>
        <Section title="キャンセルポリシー">
          <Row label="3日前まで">無料</Row>
          <Row label="前日">料金の50%</Row>
          <Row label="当日 / 無断">料金の100%</Row>
        </Section>
        <Section title="管理メモ">
          <div className="py-2 text-[13px] text-ink-700 leading-relaxed">{r.memo}</div>
        </Section>
        <Section title="Googleカレンダー連携">
          <Row label="同期ステータス"><Badge tone={calTone} dot>{calSync}</Badge></Row>
          <Row label="登録カレンダー">{calConnected ? 'C STUDIO 熊本店 予約' : '—'}</Row>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-[13px] text-ink-500">操作</span>
            <button
              className="text-[13px] font-medium text-sky-600 hover:text-sky-700 disabled:text-ink-300"
              disabled={!calConnected}
              onClick={() => showToast(calSync === '削除済み' ? 'カレンダーに再登録しました' : 'カレンダーを再同期しました')}
            >
              {calSync === '削除済み' ? 'カレンダーに再登録' : 'カレンダーを再同期'}
            </button>
          </div>
        </Section>
      </div>
    </Modal>
  )
}
