import React, { useState } from 'react'
import { Card, CardHeader, Button, Badge, Toggle, Alert, Field, Select } from '../components/ui'
import { googleCalendar, boothCalendars, reservations, calendarSyncStatus } from '../data/mock'

const syncTone = { '同期済み': 'green', '同期待ち': 'orange', '削除済み': 'gray', '失敗': 'red' }

export default function Calendar({ showToast }) {
  const [status, setStatus] = useState(googleCalendar.status) // デモ用に未接続/接続済みを切替
  const connected = status === '接続済み'

  // 自動連携設定
  const [cfg, setCfg] = useState({
    onCreate: true, onUpdate: true, onCancel: true,
    reminder: true, splitByBooth: true, inviteGuest: false,
  })
  const set = (k) => (v) => setCfg((c) => ({ ...c, [k]: v }))

  const [reminderMin, setReminderMin] = useState('60')
  const [targetCal, setTargetCal] = useState(googleCalendar.calendarName)

  // 同期ログ（予約 → カレンダーイベント）
  const [log, setLog] = useState(() =>
    reservations.map((r) => ({
      id: r.id, datetime: r.datetime, customer: r.customer, menu: r.menu,
      booth: r.booth, time: r.time, sync: calendarSyncStatus[r.status] || '同期済み',
    })))

  const runTestSync = () => {
    if (!connected) { showToast('先にGoogleカレンダーを接続してください', 'error'); return }
    const next = {
      id: 'R-TEST-' + (log.length + 1), datetime: '2026/07/03 16:00', customer: '体験 太郎',
      menu: 'セルフ写真30分プラン', booth: 'セルフブースA', time: '16:00〜16:45', sync: '同期済み',
    }
    setLog((l) => [next, ...l])
    showToast('Googleカレンダーに予約を登録しました')
  }

  return (
    <div className="space-y-5">
      {/* デモ用 状態切替 */}
      <Card className="p-4 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-ink-500">表示状態を切替（デモ用）:</span>
        {['未接続', '接続済み'].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-ink-600 border-slate-200 hover:border-slate-300'}`}>{s}</button>
        ))}
      </Card>

      {/* ===== ステータスカード ===== */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 grid place-items-center text-2xl shadow-sm">📅</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-900">Googleカレンダー連携</h3>
                <Badge tone={connected ? 'green' : 'gray'} dot>{status}</Badge>
              </div>
              <p className="text-[13px] text-ink-500 mt-0.5">予約が入ると、予約情報を自動でGoogleカレンダーに登録します</p>
            </div>
          </div>
          {connected && (
            <Button variant="accent" onClick={() => showToast('Googleカレンダーを開きます', 'info')}>↗ Googleカレンダーを開く</Button>
          )}
        </div>

        {connected && (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Info label="接続アカウント" value={googleCalendar.account} />
            <Info label="登録先カレンダー" value={googleCalendar.calendarName} />
            <Info label="タイムゾーン" value={googleCalendar.timezone} />
            <Info label="許可した権限" value={googleCalendar.scope} />
            <Info label="最終同期日時" value={googleCalendar.lastSync} />
            <Info label="同期済み予約" value={`${googleCalendar.syncedCount} 件`} />
            <Info label="カレンダーID" value={googleCalendar.calendarId} mono />
            <Info label="連携ステータス" value={<Badge tone="green" dot>正常</Badge>} />
          </div>
        )}
      </Card>

      {/* ===== 未接続時 ===== */}
      {!connected && (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 grid place-items-center mx-auto text-2xl">📅</div>
            <h3 className="mt-4 text-lg font-bold text-ink-900">Googleカレンダーを接続しましょう</h3>
            <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">
              接続すると、予約が入ったタイミングで予約情報（日時・メニュー・顧客・ブース）が自動でGoogleカレンダーに登録されます。変更やキャンセルもカレンダーに反映できます。
            </p>
            <Button size="lg" className="mt-5 w-full" onClick={() => { setStatus('接続済み'); showToast('Googleカレンダーを接続しました') }}>
              Googleアカウントを接続する
            </Button>
          </div>
          <div className="mt-8 grid sm:grid-cols-4 gap-3 text-left">
            {['Googleアカウントでログイン', 'カレンダーへのアクセスを許可', '登録先カレンダーを選択', 'C STUDIO Reserveと連携完了'].map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center text-xs font-bold mb-2">{i + 1}</div>
                <div className="text-[12px] text-ink-700 leading-snug">{s}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ===== 接続済み時 ===== */}
      {connected && (
        <>
          <div className="grid lg:grid-cols-2 gap-5">
            {/* 自動連携設定 */}
            <Card className="p-6">
              <h3 className="text-[15px] font-semibold text-ink-900 mb-1">自動連携設定</h3>
              <p className="text-xs text-ink-500 mb-4">予約の発生・変更時にカレンダーへ反映する内容を設定します</p>
              <div className="space-y-1">
                <Sw label="新規予約が入ったら自動で登録" desc="予約成立と同時にカレンダーへイベントを作成" on={cfg.onCreate} set={set('onCreate')} />
                <Sw label="予約変更時にカレンダーを更新" desc="日時・メニュー・ブース変更を自動反映" on={cfg.onUpdate} set={set('onUpdate')} />
                <Sw label="キャンセル時にカレンダーから削除" desc="キャンセル・無断キャンセルでイベントを削除" on={cfg.onCancel} set={set('onCancel')} />
                <Sw label="顧客をゲストとして招待" desc="顧客のメールにGoogleカレンダー招待を送信" on={cfg.inviteGuest} set={set('inviteGuest')} />
                <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-50">
                  <div>
                    <div className="text-[13px] font-medium text-ink-800">リマインダー通知</div>
                    <div className="text-[11px] text-ink-400">予約時間の前に通知を設定</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select className="!py-1.5 !text-xs w-24" value={reminderMin} onChange={(e) => setReminderMin(e.target.value)} disabled={!cfg.reminder}>
                      <option value="15">15分前</option><option value="30">30分前</option><option value="60">60分前</option><option value="1440">前日</option>
                    </Select>
                    <Toggle checked={cfg.reminder} onChange={set('reminder')} />
                  </div>
                </div>
                <Sw label="ブースごとにカレンダーを分ける" desc="ブース単位でサブカレンダーに振り分け" on={cfg.splitByBooth} set={set('splitByBooth')} />
              </div>
            </Card>

            {/* 登録内容（イベントテンプレート） */}
            <div className="space-y-5">
              <Card className="p-6">
                <h3 className="text-[15px] font-semibold text-ink-900 mb-1">カレンダー登録内容</h3>
                <p className="text-xs text-ink-500 mb-4">予約から作成されるイベントの内容（プレビュー）</p>
                <Field label="登録先カレンダー" className="mb-4">
                  <Select value={targetCal} onChange={(e) => setTargetCal(e.target.value)}>
                    <option>C STUDIO 熊本店 予約</option>
                    <option>個人カレンダー</option>
                    <option>スタッフ共有カレンダー</option>
                  </Select>
                </Field>
                {/* イベントプレビュー */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="flex items-start gap-3 p-4 bg-slate-50/60">
                    <span className="w-1.5 h-10 rounded bg-sky-400 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-ink-900">【予約】セルフ写真30分プラン / 山田 美咲</div>
                      <div className="text-[12px] text-ink-500 mt-0.5">2026/07/01（火）10:00〜10:45</div>
                    </div>
                  </div>
                  <div className="px-4 py-3 space-y-1.5 text-[12px] text-ink-600">
                    <EvRow icon="📍" label="場所">セルフブースA（C STUDIO 熊本店）</EvRow>
                    <EvRow icon="👤" label="顧客">山田 美咲 / 090-1111-2222</EvRow>
                    <EvRow icon="💳" label="決済">決済完了 ¥3,500（クレジットカード）</EvRow>
                    <EvRow icon="🆔" label="予約ID">R-20260701-001</EvRow>
                    <EvRow icon="⏰" label="通知">{reminderMin === '1440' ? '前日' : `${reminderMin}分前`}</EvRow>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['{メニュー}', '{顧客名}', '{ブース}', '{日時}', '{決済状況}', '{予約ID}'].map((v) => (
                    <span key={v} className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] text-ink-600 font-mono">{v}</span>
                  ))}
                </div>
              </Card>

              {/* テスト同期 */}
              <Card className="p-6">
                <h3 className="text-[15px] font-semibold text-ink-900 mb-1">連携テスト</h3>
                <p className="text-xs text-ink-500 mb-3">テスト予約を作成し、カレンダーへの自動登録を確認します</p>
                <Button variant="secondary" className="w-full" onClick={runTestSync}>テスト予約を作成して同期</Button>
              </Card>
            </div>
          </div>

          {/* ブース別カレンダー */}
          {cfg.splitByBooth && (
            <Card className="p-6">
              <h3 className="text-[15px] font-semibold text-ink-900 mb-1">ブース別カレンダー</h3>
              <p className="text-xs text-ink-500 mb-4">ブースごとに登録先のサブカレンダーを割り当てます（二重予約防止にも活用）</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {boothCalendars.map((b) => (
                  <div key={b.booth} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${b.color}`} />
                      <span className="text-[13px] font-medium text-ink-800">{b.booth}</span>
                    </div>
                    <span className="text-[12px] text-ink-500 truncate">→ {b.calendar}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 同期ログ */}
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">カレンダー同期ログ</h3>
                <p className="text-[11px] text-ink-400 mt-0.5">予約 → Googleカレンダーへの登録状況</p>
              </div>
              <Badge tone="green" dot>最終同期 {googleCalendar.lastSync}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-ink-500 border-b border-slate-100 bg-slate-50/50">
                    {['予約日時', '顧客名', 'メニュー', 'ブース（カレンダー）', '予約時間', '同期ステータス'].map((h) => (
                      <th key={h} className="text-left font-medium px-3 py-2.5 first:pl-5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {log.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/60">
                      <td className="px-3 pl-5 py-3 text-ink-700 whitespace-nowrap">{e.datetime}</td>
                      <td className="px-3 py-3 font-medium text-ink-900 whitespace-nowrap">{e.customer}</td>
                      <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{e.menu}</td>
                      <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{e.booth}</td>
                      <td className="px-3 py-3 text-ink-600 whitespace-nowrap">{e.time}</td>
                      <td className="px-3 py-3"><Badge tone={syncTone[e.sync]} dot>{e.sync}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 接続解除 */}
          <Card className="p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">連携を解除</h3>
              <p className="text-[12px] text-ink-500 mt-0.5">解除すると以降の予約はカレンダーに登録されません。既存のイベントは削除されません。</p>
            </div>
            <Button variant="secondary" onClick={() => { setStatus('未接続'); showToast('Googleカレンダー連携を解除しました', 'info') }}>連携を解除する</Button>
          </Card>
        </>
      )}
    </div>
  )
}

function Info({ label, value, mono }) {
  return (
    <div>
      <div className="text-[11px] text-ink-500 mb-1">{label}</div>
      <div className={`text-[13px] font-medium text-ink-900 ${mono ? 'font-mono text-[12px] break-all' : ''}`}>{value}</div>
    </div>
  )
}
function EvRow({ icon, label, children }) {
  return (
    <div className="flex gap-2">
      <span className="w-4">{icon}</span>
      <span className="text-ink-400 w-12 flex-shrink-0">{label}</span>
      <span className="text-ink-700">{children}</span>
    </div>
  )
}
function Sw({ label, desc, on, set }) {
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
